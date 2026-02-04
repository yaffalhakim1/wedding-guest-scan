import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
  Icon,
} from "@chakra-ui/react";
import {
  FaUsers,
  FaQrcode,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { type IconType } from "react-icons";
import {
  DrawerRoot,
  DrawerContent,
  DrawerBody,
  DrawerTrigger,
  DrawerCloseTrigger,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

// ============================================================================
// Types & Config
// ============================================================================

interface NavItem {
  id: string;
  label: string;
  icon: IconType;
  to?: string;
  onClick?: () => void;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  // Main Menu
  {
    id: "dashboard",
    label: "Dashboard",
    icon: FaChartBar,
    to: "/",
    section: "MAIN MENU",
  },
  {
    id: "guests",
    label: "Guest List",
    icon: FaUsers,
    to: "/guests",
    section: "MAIN MENU",
  },
  {
    id: "scan",
    label: "Scanner",
    icon: FaQrcode,
    to: "/scan",
    section: "MAIN MENU",
  },

  // Settings
  {
    id: "config",
    label: "Configuration",
    icon: FaCog,
    to: "/config",
    section: "SETTINGS",
  },
  {
    id: "logout",
    label: "Logout",
    icon: FaSignOutAlt,
    onClick: () => console.log("Logout"),
    section: "SETTINGS",
  },
];

// ============================================================================
// Sidebar Content (Shared)
// ============================================================================

interface SidebarContentProps {
  onItemClick?: () => void;
}

const SidebarContent = ({ onItemClick }: SidebarContentProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const renderNavItems = (items: NavItem[], title?: string) => (
    <VStack align="stretch" gap={1}>
      {title && (
        <Text fontSize="xs" color="gray.500" fontWeight="bold" px={6} mb={2}>
          {title}
        </Text>
      )}
      {items.map((item) => {
        const isActive = item.to ? currentPath === item.to : false;
        return (
          <Button
            key={item.id}
            variant="ghost"
            justifyContent="start"
            color={isActive ? "cyan.400" : "gray.400"}
            bg={isActive ? "whiteAlpha.100" : "transparent"}
            _hover={{ color: "white", bg: "whiteAlpha.50" }}
            onClick={() => {
              if (item.to) navigate(item.to);
              if (item.onClick) item.onClick();
              if (onItemClick) onItemClick();
            }}
            rounded="none"
            px={6}
            h="12"
          >
            <Icon as={item.icon} mr={3} /> {item.label}
          </Button>
        );
      })}
    </VStack>
  );

  const mainItems = NAV_ITEMS.filter((item) => item.section === "MAIN MENU");
  const settingsItems = NAV_ITEMS.filter((item) => item.section === "SETTINGS");

  return (
    <Flex direction="column" h="full" py={6} bg="#1a1c23">
      <Box px={6} mb={6}>
        <Heading size="md" color="white">
          Guest Manager
        </Heading>
      </Box>

      {/* Main Menu */}
      <Box>{renderNavItems(mainItems, "MAIN MENU")}</Box>

      {/* Settings - pushed to bottom */}
      <Box mt="auto">{renderNavItems(settingsItems, "SETTINGS")}</Box>
    </Flex>
  );
};

// ============================================================================
// Layout Component
// ============================================================================

export default function Layout() {
  return (
    <Box minH="100vh" bg="gray.50">
      {/* Desktop Sidebar */}
      <Box
        w={{ base: "0", md: "15.625rem" }}
        bg="#1a1c23"
        h="100vh"
        position="fixed"
        left="0"
        top="0"
        display={{ base: "none", md: "block" }}
        zIndex={20}
      >
        <SidebarContent />
      </Box>

      {/* Main Content Area */}
      <Box ml={{ base: 0, md: "15.625rem" }} p={0}>
        {/* Top Navbar */}
        <Flex
          bg="white"
          h="4rem"
          align="center"
          px={8}
          justify="space-between"
          borderBottom="1px solid"
          borderColor="gray.200"
          position="sticky"
          top="0"
          zIndex="10"
        >
          <HStack gap={4}>
            {/* Mobile Hamburger */}
            <Box display={{ base: "block", md: "none" }}>
              <DrawerRoot placement="start">
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="sm" p={0}>
                    <Icon as={FaBars} fontSize="xl" color="gray.600" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent bg="#1a1c23" color="white" maxW="17.5rem">
                  <DrawerHeader
                    borderBottom="1px solid"
                    borderColor="whiteAlpha.100"
                  >
                    <DrawerTitle color="white">Menu</DrawerTitle>
                    <DrawerCloseTrigger color="white" />
                  </DrawerHeader>
                  <DrawerBody p={0}>
                    <SidebarContent />
                  </DrawerBody>
                </DrawerContent>
              </DrawerRoot>
            </Box>

            <Text fontWeight="bold" fontSize="lg" color="gray.800">
              Dashboard Overview
            </Text>
          </HStack>

          <HStack gap={3}>
            <Text
              fontSize="sm"
              color="gray.500"
              display={{ base: "none", md: "block" }}
            >
              Administrator
            </Text>
            <Box
              w="2rem"
              h="2rem"
              bg="cyan.100"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="xs" fontWeight="bold" color="cyan.700">
                A
              </Text>
            </Box>
          </HStack>
        </Flex>

        {/* Page Content */}
        <Box p={8}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
