import { Box, Text, Heading, VStack, HStack, Badge } from "@chakra-ui/react";
import type { Guest, WeddingConfig } from "@/types";

const INVITATION_THEMES = {
  vip: {
    textColor: "blue.200",
    gradientFrom: "blue.400",
    gradientTo: "blue.100",
    borderColor: "blue.300",
    dividerColor: "blue.400",
    shadow: "0 0 2.5rem rgba(129, 140, 248, 0.3)",
    decorativeGradient: "linear-gradient(90deg, #818cf8, #e0e7ff, #818cf8)",
  },
  regular: {
    textColor: "blue.400",
    gradientFrom: "blue.500",
    gradientTo: "blue.200",
    borderColor: "blue.600",
    dividerColor: "blue.700",
    shadow: "0 0 2.5rem rgba(99, 102, 241, 0.3)",
    decorativeGradient: "linear-gradient(90deg, #6366f1, #c7d2fe, #6366f1)",
  },
};

interface InvitationCardProps {
  guest: Guest;
  config: WeddingConfig;
  qrDataURL: string;
}

export function InvitationCard({
  guest,
  config,
  qrDataURL,
}: InvitationCardProps) {
  const theme = guest.isVIP ? INVITATION_THEMES.vip : INVITATION_THEMES.regular;

  return (
    <Box
      w="25rem"
      bg="linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)"
      borderRadius="2xl"
      overflow="hidden"
      border="2px solid"
      borderColor={theme.borderColor}
      boxShadow={theme.shadow}
    >
      {/* Decorative Top */}
      <Box h="0.5rem" bg={theme.decorativeGradient} />

      <VStack p={8} gap={6} textAlign="center">
        {/* Header */}
        <Text
          fontSize="sm"
          color={theme.textColor}
          letterSpacing="widest"
          textTransform="uppercase"
        >
          You Are Cordially Invited
        </Text>

        {/* Couple Names */}
        <Box>
          <Text fontSize="sm" color="gray.400" mb={2}>
            🌸 Wedding of 🌸
          </Text>
          <Heading
            size="2xl"
            bgGradient="to-r"
            gradientFrom={theme.gradientFrom}
            gradientTo={theme.gradientTo}
            bgClip="text"
          >
            {config.bride}
          </Heading>
          <Text fontSize="xl" color="gray.400" my={1}>
            &
          </Text>
          <Heading
            size="2xl"
            bgGradient="to-r"
            gradientFrom={theme.gradientFrom}
            gradientTo={theme.gradientTo}
            bgClip="text"
          >
            {config.groom}
          </Heading>
        </Box>

        {/* Divider */}
        <Box w="60%" h="1px" bg={theme.dividerColor} opacity={0.5} />

        {/* Details */}
        <VStack gap={2}>
          <HStack color="gray.300">
            <Text>📅</Text>
            <Text>
              {/^\d{4}-\d{2}-\d{2}$/.test(config.date)
                ? new Date(config.date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : config.date}
            </Text>
          </HStack>
          <HStack color="gray.300">
            <Text>🕐</Text>
            <Text>{config.time}</Text>
          </HStack>
          <HStack color="gray.300">
            <Text>📍</Text>
            <Text>{config.venue}</Text>
          </HStack>
        </VStack>

        {/* Divider */}
        <Box w="60%" h="1px" bg={theme.dividerColor} opacity={0.5} />

        {/* Guest Name */}
        <Box>
          <Text fontSize="sm" color="gray.400" mb={2}>
            Dear
          </Text>
          <VStack justify="center" gap={2}>
            <Heading size="xl" color="white">
              {guest.name}
            </Heading>
            {guest.isVIP && (
              <Badge colorPalette="yellow" size="lg">
                ⭐ VIP
              </Badge>
            )}
          </VStack>
        </Box>

        {/* QR Code */}
        {qrDataURL && (
          <Box p={4} bg="white" borderRadius="xl" boxShadow="lg">
            <img
              src={qrDataURL}
              alt="QR Code"
              style={{ width: "11.25rem", height: "11.25rem" }}
            />
          </Box>
        )}

        {/* Footer */}
        <Text fontSize="sm" color="gray.400">
          Please show this QR code at the entrance
        </Text>

        <Text fontSize="xs" color={theme.textColor} fontStyle="italic">
          {config.message}
        </Text>
      </VStack>

      {/* Decorative Bottom */}
      <Box h="0.5rem" bg={theme.decorativeGradient} />
    </Box>
  );
}
