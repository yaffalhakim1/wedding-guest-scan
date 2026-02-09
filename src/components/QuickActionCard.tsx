import { Card, HStack, Box, Icon, VStack, Text } from "@chakra-ui/react";
import { type IconType } from "react-icons";
import { useNavigate } from "react-router-dom";

export interface QuickActionCardProps {
  label: string;
  description: string;
  icon: IconType;
  colorScheme: string;
  to: string;
}

export function QuickActionCard({
  label,
  description,
  icon,
  colorScheme,
  to,
}: QuickActionCardProps) {
  const navigate = useNavigate();

  return (
    <Card.Root
      bg="white"
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => navigate(to)}
    >
      <Card.Body>
        <HStack gap={4}>
          <Box
            bg={`${colorScheme}.50`}
            borderRadius="lg"
            color={`${colorScheme}.500`}
          >
            <Icon as={icon} fontSize="2xl" />
          </Box>
          <VStack align="start" gap={0}>
            <Text fontWeight="bold" fontSize="lg" color="gray.800">
              {label}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {description}
            </Text>
          </VStack>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}
