import { useForm } from "react-hook-form";
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
import { toaster } from "@/components/ui/toaster";
import { useWeddingConfig } from "@/hooks/useWeddingConfig";
import defaultConfig from "@/config/wedding.json";

// ============================================================================
// Types
// ============================================================================

type WeddingConfig = typeof defaultConfig;

// ============================================================================
// ConfigPage Component
// ============================================================================

export default function ConfigPage() {
  const config = useWeddingConfig();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<WeddingConfig>({
    defaultValues: config,
  });

  const onSubmit = (data: WeddingConfig) => {
    localStorage.setItem("weddingConfig", JSON.stringify(data));
    toaster.create({
      title: "Settings saved",
      description: "Wedding details have been updated. Reloading...",
      type: "success",
    });

    // Force reload to apply changes globally
    setTimeout(() => window.location.reload(), 1000);
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

      <Card.Root
        bg="white"
        borderColor="gray.200"
        borderWidth="1px"
        shadow="sm"
      >
        <Card.Body p={8}>
          <VStack gap={8} align="stretch">
            <Heading
              size="md"
              color="gray.800"
              borderBottomWidth="1px"
              borderColor="gray.100"
              pb={4}
            >
              Event Details
            </Heading>

            <form onSubmit={handleSubmit(onSubmit)}>
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
                    borderColor="gray.300"
                    color="gray.800"
                    _focus={{ borderColor: "cyan.500" }}
                    size="lg"
                  />
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
                    borderColor="gray.300"
                    color="gray.800"
                    _focus={{ borderColor: "cyan.500" }}
                    size="lg"
                  />
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
                    bg="white"
                    borderColor="gray.300"
                    color="gray.800"
                    _focus={{ borderColor: "cyan.500" }}
                    size="lg"
                  />
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
                    bg="white"
                    borderColor="gray.300"
                    color="gray.800"
                    _focus={{ borderColor: "cyan.500" }}
                    size="lg"
                  />
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
                    borderColor="gray.300"
                    color="gray.800"
                    _focus={{ borderColor: "cyan.500" }}
                    size="lg"
                  />
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
                    borderColor="gray.300"
                    color="gray.800"
                    _focus={{ borderColor: "cyan.500" }}
                    size="lg"
                  />
                </Box>

                <Box gridColumn={{ md: "span 2" }} pt={4}>
                  <Button
                    type="submit"
                    colorPalette="blue"
                    size="lg"
                    w="full"
                    loading={isSubmitting}
                  >
                    Save Changes
                  </Button>
                </Box>
              </SimpleGrid>
            </form>
          </VStack>
        </Card.Body>
      </Card.Root>
    </VStack>
  );
}
