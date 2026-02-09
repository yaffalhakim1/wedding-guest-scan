import {
  VStack,
  Text,
  Heading,
  Button,
  Badge,
  Box,
  Icon,
} from "@chakra-ui/react";
import { DialogBody, DialogContent, DialogRoot } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaStar } from "react-icons/fa";
import type { Guest, WeddingConfig } from "@/types";

interface WelcomeDialogProps {
  guest: Guest | null;
  config: WeddingConfig;
  isOpen: boolean;
  onContinue: () => void;
}

const MotionHeading = motion.create(Heading);
const MotionBox = motion.create(Box);

export const WelcomeDialog = ({
  guest,
  config,
  isOpen,
  onContinue,
}: WelcomeDialogProps) => {
  if (!guest) return null;

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onContinue()}
      size="full"
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent
        bg="linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)"
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        border="none"
      >
        <DialogBody w="full" maxW="container.md" p={8}>
          <AnimatePresence>
            <VStack gap={10} textAlign="center">
              {/* Header Icon */}
              <MotionBox
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                position="relative"
              >
                <Icon
                  as={FaHeart}
                  color="red.400"
                  boxSize={16}
                  filter="drop-shadow(0 0 10px rgba(248, 113, 113, 0.5))"
                />
                {guest.isVIP && (
                  <Box position="absolute" top="-10px" right="-10px">
                    <Icon as={FaStar} color="yellow.400" boxSize={6} />
                  </Box>
                )}
              </MotionBox>

              {/* Ceremony Text */}
              <VStack gap={2}>
                <Text
                  color="blue.200"
                  fontWeight="bold"
                  letterSpacing="widest"
                  fontSize="sm"
                  textTransform="uppercase"
                >
                  Welcome to our ceremony
                </Text>

                {guest.isVIP && (
                  <Badge
                    colorPalette="blue"
                    variant="surface"
                    size="lg"
                    px={4}
                    borderRadius="full"
                    bg="whiteAlpha.100"
                    color="white"
                    borderColor="whiteAlpha.300"
                  >
                    ⭐ VVIP
                  </Badge>
                )}
              </VStack>

              {/* Guest Name */}
              <VStack gap={4}>
                <MotionHeading
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  size={{ base: "4xl", md: "6xl" }}
                  fontWeight="900"
                  lineHeight="shorter"
                  letterSpacing="tight"
                >
                  {guest.name}
                </MotionHeading>

                {guest.group && (
                  <Text
                    fontSize="xl"
                    color="whiteAlpha.700"
                    fontWeight="medium"
                  >
                    {guest.group}
                  </Text>
                )}
              </VStack>

              {/* Footer Wedding Info */}
              <VStack gap={1} opacity={0.6}>
                <Text fontSize="sm">Pernikahan</Text>
                <Heading size="md" fontWeight="bold">
                  {config.bride} & {config.groom}
                </Heading>
              </VStack>

              {/* Action Button */}
              <MotionBox
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  size="xl"
                  bg="white"
                  color="blue.900"
                  _hover={{ bg: "blue.50", transform: "translateY(-2px)" }}
                  _active={{ transform: "translateY(0)" }}
                  px={12}
                  fontWeight="bold"
                  borderRadius="full"
                  onClick={onContinue}
                >
                  Lanjutkan
                </Button>
              </MotionBox>
            </VStack>
          </AnimatePresence>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
