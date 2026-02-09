import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  VStack,
  Card,
  Input,
  Button,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster-instance";
import { useWeddingConfig } from "@/hooks/useWeddingConfig";
import { isAxiosError } from "axios";
import { configSchema, type WeddingConfig } from "@/utils/validators";
import RHFForm from "@/components/RHFForm";

// ============================================================================
// ConfigPage Component
// ============================================================================

export default function ConfigPage() {
  const navigate = useNavigate();
  const { weddingConfig, updateWeddingConfig, isLoading } = useWeddingConfig();

  const methods = useForm<WeddingConfig>({
    resolver: zodResolver(configSchema),
    defaultValues: weddingConfig,
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, errors },
  } = methods;

  // Sync form values when data is loaded from API
  useEffect(() => {
    if (weddingConfig) {
      reset(weddingConfig);
    }
  }, [weddingConfig, reset]);

  const onSubmit = async (data: WeddingConfig) => {
    try {
      await updateWeddingConfig(data);
      toaster.create({
        title: "Settings saved",
        description: "Wedding details have been updated successfully.",
        type: "success",
      });
      // Small delay before redirecting to dashboard
      setTimeout(() => navigate("/"), 1500);
    } catch (err: unknown) {
      console.error(err);

      let errorMessage = "Failed to update wedding details.";
      if (isAxiosError(err)) {
        errorMessage = err.response?.data?.error || errorMessage;
      }

      toaster.create({
        title: "Update failed",
        description: errorMessage,
        type: "error",
      });
    }
  };

  return (
    <VStack align="stretch" gap={8} maxW="62.5rem">
      <Box>
        <Heading size="2xl" color="gray.800" mb={2}>
          System Configuration
        </Heading>
        <Text color="gray.500">
          Manage wedding details and system settings.
        </Text>
      </Box>

      <Card.Root bg="white">
        <Card.Body p={8}>
          <VStack gap={8} align="stretch">
            <Heading
              size="md"
              color="gray.800"
              borderBottomWidth="1px"
              borderColor="blue.50"
              pb={4}
            >
              Event Details
            </Heading>

            <RHFForm methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
                {/* Couple Names */}
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    mb={2}
                    color="gray.700"
                  >
                    Bride Name
                  </Text>
                  <Input
                    {...register("bride")}
                    bg="white"
                    borderColor={errors.bride ? "red.300" : "blue.200"}
                    color="gray.800"
                    _focus={{ borderColor: "blue.500" }}
                    placeholder="Enter bride's name"
                    size="lg"
                  />
                  {errors.bride && (
                    <Text color="red.500" fontSize="xs" mt={1}>
                      {errors.bride.message}
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    mb={2}
                    color="gray.700"
                  >
                    Groom Name
                  </Text>
                  <Input
                    {...register("groom")}
                    bg="white"
                    borderColor={errors.groom ? "red.300" : "blue.200"}
                    color="gray.800"
                    _focus={{ borderColor: "blue.500" }}
                    placeholder="Enter groom's name"
                    size="lg"
                  />
                  {errors.groom && (
                    <Text color="red.500" fontSize="xs" mt={1}>
                      {errors.groom.message}
                    </Text>
                  )}
                </Box>

                {/* Date & Time */}
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    mb={2}
                    color="gray.700"
                  >
                    Date
                  </Text>
                  <Input
                    {...register("date")}
                    type="date"
                    bg="white"
                    borderColor={errors.date ? "red.300" : "blue.200"}
                    color="gray.800"
                    _focus={{ borderColor: "blue.500" }}
                    size="lg"
                  />
                  {errors.date && (
                    <Text color="red.500" fontSize="xs" mt={1}>
                      {errors.date.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    mb={2}
                    color="gray.700"
                  >
                    Time
                  </Text>
                  <Input
                    {...register("time")}
                    type="time"
                    bg="white"
                    borderColor={errors.time ? "red.300" : "blue.200"}
                    color="gray.800"
                    _focus={{ borderColor: "blue.500" }}
                    size="lg"
                  />
                  {errors.time && (
                    <Text color="red.500" fontSize="xs" mt={1}>
                      {errors.time.message}
                    </Text>
                  )}
                </Box>

                {/* Full Width Fields */}
                <Box gridColumn={{ md: "span 2" }}>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    mb={2}
                    color="gray.700"
                  >
                    Venue
                  </Text>
                  <Input
                    {...register("venue")}
                    bg="white"
                    borderColor={errors.venue ? "red.300" : "blue.200"}
                    color="gray.800"
                    _focus={{ borderColor: "blue.500" }}
                    placeholder="Enter wedding venue"
                    size="lg"
                  />
                  {errors.venue && (
                    <Text color="red.500" fontSize="xs" mt={1}>
                      {errors.venue.message}
                    </Text>
                  )}
                </Box>

                <Box gridColumn={{ md: "span 2" }}>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    mb={2}
                    color="gray.700"
                  >
                    Welcome Message
                  </Text>
                  <Input
                    {...register("message")}
                    bg="white"
                    borderColor={errors.message ? "red.300" : "blue.200"}
                    color="gray.800"
                    _focus={{ borderColor: "blue.500" }}
                    placeholder="Welcome message for guests"
                    size="lg"
                  />
                  {errors.message && (
                    <Text color="red.500" fontSize="xs" mt={1}>
                      {errors.message.message}
                    </Text>
                  )}
                </Box>

                <Box gridColumn={{ md: "span 2" }} pt={4}>
                  <Button
                    type="submit"
                    colorPalette="blue"
                    size="lg"
                    w="full"
                    disabled={!isValid || isLoading}
                    loading={isSubmitting}
                  >
                    Save Changes
                  </Button>
                </Box>
              </SimpleGrid>
            </RHFForm>
          </VStack>
        </Card.Body>
      </Card.Root>
    </VStack>
  );
}
