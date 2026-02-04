import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  VStack,
  HStack,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useGuests } from "@/hooks/useGuests";
import { useWeddingConfig } from "@/hooks/useWeddingConfig";
import {
  FaUsers,
  FaUserCheck,
  FaStar,
  FaQrcode,
  FaUserPlus,
  FaChevronRight,
} from "react-icons/fa";
import { QuickActionCard } from "@/components/QuickActionCard";

// ============================================================================
// Constants
// ============================================================================

const MotionBox = motion.create(Box);

const STAT_CARDS_CONFIG = [
  {
    key: "total",
    label: "Total Guests",
    getValue: (stats: ReturnType<typeof useGuests>["getStats"]) =>
      stats().total,
    bg: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    icon: FaUsers,
    subLabel: "Invitations Sent",
  },
  {
    key: "checkedIn",
    label: "Guest Arrivals",
    getValue: (stats: ReturnType<typeof useGuests>["getStats"]) =>
      stats().checkedIn,
    bg: "linear-gradient(135deg, #3730a3 0%, #1e1b4b 100%)",
    icon: FaUserCheck,
    subLabel: "Real-time Presence",
  },
  {
    key: "vipTotal",
    label: "VIP List",
    getValue: (stats: ReturnType<typeof useGuests>["getStats"]) =>
      stats().vipTotal,
    bg: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
    icon: FaStar,
    subLabel: "Special Protocol",
  },
  {
    key: "vipCheckedIn",
    label: "VIP Arrived",
    getValue: (stats: ReturnType<typeof useGuests>["getStats"]) =>
      stats().vipCheckedIn,
    bg: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
    icon: FaStar,
    subLabel: "Seating Plan Active",
  },
] as const;

const QUICK_ACTIONS = [
  {
    label: "Open Scanner",
    description: "Check-in guests via camera",
    icon: FaQrcode,
    colorScheme: "blue",
    to: "/scan",
  },
  {
    label: "Add Guest",
    description: "Register new attendees",
    icon: FaUserPlus,
    colorScheme: "blue",
    to: "/guests",
  },
  {
    label: "Manage List",
    description: "View and edit all guests",
    icon: FaUsers,
    colorScheme: "gray",
    to: "/guests",
  },
];

// ============================================================================
// HomePage Component (Admin Dashboard Style)
// ============================================================================

export default function HomePage() {
  const navigate = useNavigate();
  const { getStats } = useGuests();
  const weddingConfig = useWeddingConfig();

  return (
    <VStack align="stretch" gap={8}>
      {/* Event Header */}
      <Box>
        <Heading size="lg" mb={2} color="gray.800">
          The Wedding of {weddingConfig.bride} & {weddingConfig.groom}
        </Heading>
        <Text color="gray.500">
          📅 {weddingConfig.date} • 📍 {weddingConfig.venue}
        </Text>
      </Box>

      {/* Stat Cards Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
        {STAT_CARDS_CONFIG.map((config, index) => (
          <MotionBox
            key={config.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card.Root
              bg={config.bg}
              color="white"
              overflow="hidden"
              border="none"
              shadow="lg"
              borderRadius="xl"
            >
              <Card.Body p={5}>
                <HStack justify="space-between" align="start" mb={4}>
                  <VStack align="start" gap={0}>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      opacity={0.9}
                      mb={1}
                    >
                      {config.label}
                    </Text>
                    <Heading size="3xl" fontWeight="bold">
                      {config.getValue(getStats)}
                    </Heading>
                    <Text fontSize="xs" opacity={0.8} mt={1}>
                      {config.subLabel}
                    </Text>
                  </VStack>
                  <Icon as={config.icon} fontSize="4xl" opacity={0.3} />
                </HStack>
              </Card.Body>

              {/* Card Footer "View Details" */}
              <Flex
                bg="blackAlpha.200"
                p={2}
                px={5}
                justify="space-between"
                align="center"
                cursor="pointer"
                _hover={{ bg: "blackAlpha.300" }}
                onClick={() => navigate("/guests")}
              >
                <Text fontSize="xs" fontWeight="bold">
                  View Details
                </Text>
                <Icon as={FaChevronRight} fontSize="xs" />
              </Flex>
            </Card.Root>
          </MotionBox>
        ))}
      </SimpleGrid>

      {/* Quick Actions Area */}
      <Heading size="md" mt={4} mb={2} color="gray.700">
        Quick Actions
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        {QUICK_ACTIONS.map((action) => (
          <QuickActionCard key={action.label} {...action} />
        ))}
      </SimpleGrid>
    </VStack>
  );
}
