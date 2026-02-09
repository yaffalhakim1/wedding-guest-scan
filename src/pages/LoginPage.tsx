import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Fieldset,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { Field } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { loginSchema, type LoginFormValues } from "@/utils/validators";
import RHFForm from "@/components/RHFForm";

// ============================================================================
// Types
// ============================================================================

type LoginStatus = "idle" | "loading" | "error" | "success";

const STATUS_CONTENT_MAP = {
  idle: { buttonText: "Login", buttonColor: "blue" },
  loading: { buttonText: "Logging in...", buttonColor: "gray" },
  error: { buttonText: "Retry Login", buttonColor: "red" },
  success: { buttonText: "Success!", buttonColor: "green" },
};

export default function LoginPage() {
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";
  const config = STATUS_CONTENT_MAP[status];

  // React Hook Form implementation
  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = methods;

  const onSubmit = async (data: LoginFormValues) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      await login(data.email, data.password);
      setStatus("success");
      navigate(from, { replace: true });
    } catch (err: unknown) {
      console.error(err);
      setStatus("error");

      if (isAxiosError(err)) {
        setErrorMessage(
          err.response?.data?.error ||
            "Failed to login. Please check your credentials.",
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Box
      minH="100vh"
      bg="blue.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Container maxW="md">
        <VStack gap={8} align="stretch">
          <Box textAlign="center">
            <Heading
              size="3xl"
              color="blue.950"
              mb={2}
              fontWeight="900"
              letterSpacing="tight"
            >
              Wedding Admin
            </Heading>
            <Text color="blue.600">Please sign in to manage guest access</Text>
          </Box>

          <Box bg="white" p={8} borderRadius="2xl">
            <RHFForm methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack gap={6}>
                <Fieldset.Root>
                  <Stack gap={4}>
                    <Field
                      label="Email Address"
                      invalid={!!errors.email || status === "error"}
                      errorText={errors.email?.message || errorMessage}
                    >
                      <Input
                        type="email"
                        {...register("email")}
                        placeholder="admin@wedding.com"
                        bg="blue.50"
                        border="none"
                        _focus={{ bg: "blue.100" }}
                        disabled={status === "loading"}
                      />
                    </Field>

                    <Field
                      label="Password"
                      invalid={!!errors.password}
                      errorText={errors.password?.message}
                    >
                      <Input
                        type="password"
                        {...register("password")}
                        placeholder="••••••••"
                        bg="blue.50"
                        border="none"
                        _focus={{ bg: "blue.100" }}
                        disabled={status === "loading"}
                      />
                    </Field>
                  </Stack>
                </Fieldset.Root>

                {status === "error" && !errorMessage && !errors.email && (
                  <Text color="red.500" fontSize="sm" textAlign="center">
                    Invalid email or password
                  </Text>
                )}

                <Button
                  type="submit"
                  colorPalette={config.buttonColor}
                  size="xl"
                  loading={status === "loading"}
                  disabled={status === "loading" || !isValid}
                  width="full"
                  borderRadius="xl"
                  _hover={{ transform: "translateY(-2px)", bg: "blue.700" }}
                >
                  {config.buttonText}
                </Button>
              </Stack>
            </RHFForm>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
