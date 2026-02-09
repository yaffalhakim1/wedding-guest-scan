import { useState } from "react";
import {
  VStack,
  HStack,
  Text,
  Input,
  Textarea,
  Button,
  Box,
  Heading,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useSWR, { mutate } from "swr";
import { isAxiosError } from "axios";
import { INVITATION_COLORS } from "@/constants/invitation-theme";
import { toaster } from "@/components/ui/toaster-instance";
import api from "@/api/axios";

// ============================================================================
// Guest Wishes Component
// ============================================================================

interface GuestWish {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

const wishSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  message: z.string().min(5, "Message must be at least 5 characters").max(500),
});

type WishFormData = z.infer<typeof wishSchema>;

export default function GuestWishes() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch wishes
  const { data: wishes = [], error } = useSWR<GuestWish[]>(
    "/wishes",
    async () => {
      try {
        const response = await api.get<{ wishes: GuestWish[] }>("/wishes");
        return response.data.wishes;
      } catch (err) {
        // If backend not ready, return empty array
        if (isAxiosError(err) && err.response?.status === 404) {
          return [];
        }
        throw err;
      }
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<WishFormData>({
    resolver: zodResolver(wishSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: WishFormData) => {
    setIsSubmitting(true);
    try {
      const response = await api.post<{ wish: GuestWish }>("/wishes", data);

      // Optimistic update
      mutate("/wishes", [...wishes, response.data.wish], false);

      toaster.create({
        title: "Thank you!",
        description: "Your message has been added.",
        type: "success",
      });
      reset();
    } catch (err) {
      let errorMessage = "Failed to submit wish. Please try again.";
      if (isAxiosError(err)) {
        if (err.response?.status === 404) {
          errorMessage = "Guest wishes feature is not yet available.";
        } else {
          errorMessage = err.response?.data?.error || errorMessage;
        }
      }
      toaster.create({
        title: "Error",
        description: errorMessage,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VStack gap={8} w="full" align="stretch">
      {/* Submit wish form */}
      <Box
        bg={INVITATION_COLORS.backgroundWhite}
        borderRadius="3xl"
        p={{ base: 6, md: 8 }}
        borderWidth="1px"
        borderColor={INVITATION_COLORS.primaryMuted}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap={4} align="stretch">
            <Heading
              size={{ base: "md", md: "lg" }}
              color={INVITATION_COLORS.text}
            >
              Send Your Wishes
            </Heading>

            <VStack gap={1} align="start">
              <Input
                {...register("name")}
                placeholder="Your Name"
                size="lg"
                bg="white"
                borderColor={INVITATION_COLORS.primaryMuted}
                _focus={{ borderColor: INVITATION_COLORS.primary }}
              />
              {errors.name && (
                <Text fontSize="sm" color="red.500">
                  {errors.name.message}
                </Text>
              )}
            </VStack>

            <VStack gap={1} align="start">
              <Textarea
                {...register("message")}
                placeholder="Your wishes and prayers..."
                size="lg"
                minH="120px"
                bg="white"
                borderColor={INVITATION_COLORS.primaryMuted}
                _focus={{ borderColor: INVITATION_COLORS.primary }}
              />
              {errors.message && (
                <Text fontSize="sm" color="red.500">
                  {errors.message.message}
                </Text>
              )}
            </VStack>

            <Button
              type="submit"
              colorPalette="blue"
              size="lg"
              disabled={!isValid}
              loading={isSubmitting}
            >
              Send Wishes
            </Button>
          </VStack>
        </form>
      </Box>

      {/* Wishes list */}
      {wishes.length > 0 && (
        <VStack gap={4} align="stretch">
          <Heading
            size={{ base: "md", md: "lg" }}
            color={INVITATION_COLORS.text}
            textAlign="center"
          >
            Guest Wishes
          </Heading>

          <VStack gap={4} maxH="500px" overflowY="auto" px={2}>
            {wishes.map((wish) => (
              <Box
                key={wish.id}
                bg={INVITATION_COLORS.backgroundWhite}
                borderRadius="2xl"
                p={6}
                w="full"
                borderWidth="1px"
                borderColor={INVITATION_COLORS.primaryMuted}
              >
                <VStack gap={2} align="start">
                  <HStack justify="space-between" w="full">
                    <Text
                      fontWeight="bold"
                      color={INVITATION_COLORS.text}
                      fontSize="md"
                    >
                      {wish.name}
                    </Text>
                    <Text fontSize="xs" color={INVITATION_COLORS.textLight}>
                      {new Date(wish.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </Text>
                  </HStack>
                  <Text
                    color={INVITATION_COLORS.textMuted}
                    fontSize="sm"
                    lineHeight="tall"
                  >
                    {wish.message}
                  </Text>
                </VStack>
              </Box>
            ))}
          </VStack>
        </VStack>
      )}

      {error && !isAxiosError(error) && (
        <Text
          fontSize="sm"
          color={INVITATION_COLORS.textMuted}
          textAlign="center"
        >
          Guest wishes will be available soon.
        </Text>
      )}
    </VStack>
  );
}
