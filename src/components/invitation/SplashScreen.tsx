import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Container,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import FloralBorder from "./FloralBorder";
import {
  INVITATION_COLORS,
  INVITATION_FONTS,
} from "@/constants/invitation-theme";

// ============================================================================
// Splash Screen Component
// ============================================================================

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

interface SplashScreenProps {
  guestName: string;
  bride: string;
  groom: string;
  onOpen: () => void;
  show: boolean;
}

export default function SplashScreen({
  guestName,
  bride,
  groom,
  onOpen,
  show,
}: SplashScreenProps) {
  return (
    <AnimatePresence>
      {show && (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={INVITATION_COLORS.background}
          zIndex={9999}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {/* Floral borders */}
          <FloralBorder position="top-left" />
          <FloralBorder position="top-right" />
          <FloralBorder position="bottom-left" />
          <FloralBorder position="bottom-right" />

          <Container maxW="container.md" position="relative">
            <MotionVStack
              gap={8}
              textAlign="center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {/* Guest greeting */}
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={INVITATION_COLORS.textMuted}
                fontWeight="medium"
                letterSpacing="wide"
              >
                Hai {guestName}
              </Text>

              {/* Couple names in elegant script */}
              <VStack gap={2}>
                <Heading
                  fontFamily={INVITATION_FONTS.script}
                  fontSize={{ base: "5xl", md: "7xl" }}
                  color={INVITATION_COLORS.primary}
                  fontWeight="normal"
                  lineHeight="shorter"
                >
                  {bride}
                </Heading>
                <Text
                  fontSize={{ base: "2xl", md: "3xl" }}
                  color={INVITATION_COLORS.textMuted}
                  fontFamily={INVITATION_FONTS.serif}
                >
                  &
                </Text>
                <Heading
                  fontFamily={INVITATION_FONTS.script}
                  fontSize={{ base: "5xl", md: "7xl" }}
                  color={INVITATION_COLORS.primary}
                  fontWeight="normal"
                  lineHeight="shorter"
                >
                  {groom}
                </Heading>
              </VStack>

              {/* Open button */}
              <MotionBox
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                mt={6}
              >
                <Button
                  onClick={onOpen}
                  size="xl"
                  px={12}
                  py={7}
                  fontSize="lg"
                  bg={INVITATION_COLORS.primary}
                  color="white"
                  _hover={{
                    bg: INVITATION_COLORS.primaryDark,
                    transform: "translateY(-2px)",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  borderRadius="full"
                  boxShadow="lg"
                  transition="all 0.2s"
                >
                  Open Invitation
                </Button>
              </MotionBox>
            </MotionVStack>
          </Container>
        </MotionBox>
      )}
    </AnimatePresence>
  );
}
