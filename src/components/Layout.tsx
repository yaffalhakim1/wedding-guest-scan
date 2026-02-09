import { Outlet, useLocation, Link } from "react-router-dom";
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
import { useAuth } from "../hooks/useAuth";
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
    label: "Scanner (Dashboard)",
    icon: FaQrcode,
    to: "/scan",
    section: "MAIN MENU",
  },
  {
    id: "scan-fullscreen",
    label: "Full-Screen Scanner",
    icon: FaQrcode,
    to: "/scan-fullscreen",
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
];

// ============================================================================
// Sidebar Content (Shared)
// ============================================================================

interface SidebarContentProps {
  onItemClick?: () => void;
}

const SidebarContent = ({ onItemClick }: SidebarContentProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout } = useAuth();

  const renderNavItems = (items: NavItem[], title?: string) => (
    <VStack align="stretch" gap={1}>
      {title && (
        <Text
          fontSize="xs"
          color="whiteAlpha.500"
          fontWeight="bold"
          px={6}
          mb={2}
        >
          {title}
        </Text>
      )}
      {items.map((item) => {
        const isActive = item.to ? currentPath === item.to : false;
        
        if (item.to) {
          return (
            <Button
              key={item.id}
              asChild
              variant="ghost"
              justifyContent="start"
              color={isActive ? "white" : "whiteAlpha.700"}
              bg={isActive ? "whiteAlpha.200" : "transparent"}
              _hover={{ color: "white", bg: "whiteAlpha.100" }}
              rounded="none"
              px={6}
              h="12"
              onClick={onItemClick}
            >
              <Link to={item.to}>
                <Icon as={item.icon} mr={3} /> {item.label}
              </Link>
            </Button>
          );
        }
        
        return (
          <Button
            key={item.id}
            variant="ghost"
            justifyContent="start"
            color={isActive ? "white" : "whiteAlpha.700"}
            bg={isActive ? "whiteAlpha.200" : "transparent"}
            _hover={{ color: "white", bg: "whiteAlpha.100" }}
            onClick={() => {
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
    <Flex direction="column" h="full" py={6} bg="blue.950">
      <Box px={6} mb={10}>
        <Heading size="lg" color="white" fontWeight="900" letterSpacing="tight">
          Wedding Admin
        </Heading>
      </Box>

      {/* Main Menu */}
      <Box>{renderNavItems(mainItems, "MAIN MENU")}</Box>

      {/* Settings - pushed to bottom */}
      <Box mt="auto">
        {renderNavItems(settingsItems, "SETTINGS")}
        <Button
          variant="ghost"
          justifyContent="start"
          color="whiteAlpha.700"
          _hover={{ color: "white", bg: "whiteAlpha.100" }}
          onClick={logout}
          rounded="none"
          px={6}
          h="12"
          w="full"
        >
          <Icon as={FaSignOutAlt} mr={3} /> Logout
        </Button>
      </Box>
    </Flex>
  );
};

// ============================================================================
// Layout Component
// ============================================================================

export default function Layout() {
  const { user } = useAuth();
  return (
    <Box minH="100vh" bg="blue.50">
      {/* Desktop Sidebar */}
      <Box
        w={{ base: "0", md: "15.625rem" }}
        bg="blue.950"
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
          borderColor="blue.100"
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
                    <Icon as={FaBars} fontSize="xl" color="blue.600" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent bg="blue.950" color="white" maxW="17.5rem">
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
              color="blue.500"
              display={{ base: "none", md: "block" }}
            >
              {user?.email || "Administrator"}
            </Text>
            <Box
              w="2.5rem"
              h="2.5rem"
              bg="blue.600"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              shadow="sm"
            >
              <Text fontSize="sm" fontWeight="bold" color="white">
                {user?.email?.[0].toUpperCase() || "A"}
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
