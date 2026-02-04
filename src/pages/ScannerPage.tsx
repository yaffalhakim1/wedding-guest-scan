import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Heading,
  Text,
  Card,
  Button,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Html5Qrcode } from "html5-qrcode";
import confetti from "canvas-confetti";
import { decodeQRPayload } from "@/utils/qr";
import { getGuestById, checkInGuest, getGuestStats } from "@/utils/storage";
import { useSound } from "@/hooks/useSound";
import { SCANNER_STATUS_CONFIG } from "@/constants";
import type { ScannerStatus, Guest } from "@/types";

// ============================================================================
// Constants
// ============================================================================

const SCANNER_ELEMENT_ID = "qr-reader";

const MotionBox = motion.create(Box);

// ============================================================================
// VIP Celebration - Confetti explosion
// ============================================================================

function triggerVIPCelebration() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ["#d4af37", "#f4e4ba", "#996515", "#fef08a", "#facc15"],
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

function triggerRegularCelebration() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.7 },
    colors: ["#b76e79", "#d4a5a5", "#4ade80"],
  });
}

// ============================================================================
// ScannerPage Component
// ============================================================================

export default function ScannerPage() {
  const { playSound } = useSound();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);

  // State Machine Pattern
  const [status, setStatus] = useState<ScannerStatus>("idle");
  const [scannedGuest, setScannedGuest] = useState<Guest | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stats, setStats] = useState(getGuestStats());

  // Config lookup from dictionary
  const statusConfig = SCANNER_STATUS_CONFIG[status];

  // Initialize scanner
  useEffect(() => {
    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = scanner;

    return () => {
      if (scanner.isScanning) {
        scanner.stop().catch(console.error);
      }
    };
  }, []);

  // Stop scanning
  const stopScanning = useCallback(async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
    }
  }, []);

  // Handle successful scan
  const handleScanSuccess = useCallback(
    async (decodedText: string) => {
      // Prevent multiple processing
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      // Stop scanner immediately
      await stopScanning();

      // Decode QR payload
      const payload = decodeQRPayload(decodedText);

      if (!payload) {
        setStatus("error");
        setErrorMessage("Invalid QR code format");
        isProcessingRef.current = false;
        return;
      }

      // Find guest in storage
      const guest = getGuestById(payload.id);

      if (!guest) {
        setStatus("error");
        setErrorMessage("Guest not found in system");
        isProcessingRef.current = false;
        return;
      }

      // Check if already checked in
      if (guest.checkedIn) {
        setStatus("already-checked-in");
        setScannedGuest(guest);
        playSound("success");
        isProcessingRef.current = false;
        return;
      }

      // Check in the guest
      const updatedGuest = checkInGuest(guest.id);

      if (updatedGuest) {
        setStatus("success");
        setScannedGuest(updatedGuest);
        setStats(getGuestStats());

        // Celebration based on VIP status
        if (updatedGuest.isVIP) {
          playSound("vipSuccess");
          triggerVIPCelebration();
        } else {
          playSound("success");
          triggerRegularCelebration();
        }
      }

      isProcessingRef.current = false;
    },
    [stopScanning, playSound],
  );

  // Start scanning
  const startScanning = useCallback(async () => {
    if (!scannerRef.current) return;

    try {
      setStatus("scanning");
      setScannedGuest(null);
      setErrorMessage(null);

      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        handleScanSuccess,
        () => {}, // Ignore scan failures
      );
    } catch (error) {
      console.error("Failed to start scanner:", error);
      setStatus("error");
      setErrorMessage("Could not access camera. Please check permissions.");
    }
  }, [handleScanSuccess]);

  // Reset and scan again
  const resetAndScan = useCallback(() => {
    setStatus("idle");
    setScannedGuest(null);
    setErrorMessage(null);
    isProcessingRef.current = false;
  }, []);

  return (
    <VStack gap={6}>
      {/* Header */}
      <HStack justify="space-between" mb={4} w="full">
        <Heading size="xl" color="gray.800">
          QR Scanner
        </Heading>
        <HStack gap={4}>
          <Badge colorPalette="green" size="lg" py={2} px={4}>
            ✅ {stats.checkedIn} / {stats.total}
          </Badge>
          <Badge colorPalette="yellow" size="lg" py={2} px={4}>
            ⭐ VIP: {stats.vipCheckedIn} / {stats.vipTotal}
          </Badge>
        </HStack>
      </HStack>

      {/* Scanner Area */}
      <Card.Root
        w="full"
        maxW="500px"
        bg="white"
        borderColor="gray.200"
        borderWidth="1px"
        overflow="hidden"
        shadow="md"
        mx="auto"
      >
        <Card.Body p={0}>
          {/* Camera View */}
          <Box
            id={SCANNER_ELEMENT_ID}
            w="full"
            h="21.875rem"
            bg="black"
            position="relative"
          />

          {/* Status Overlay */}
          <AnimatePresence mode="wait">
            {status !== "scanning" && (
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="blackAlpha.800"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={6}
              >
                <VStack gap={4}>
                  {status === "idle" && (
                    <>
                      <Text fontSize="5xl">📷</Text>
                      <Button
                        size="xl"
                        colorPalette="green"
                        onClick={startScanning}
                        py={6}
                        px={10}
                      >
                        Start Scanning
                      </Button>
                    </>
                  )}
                </VStack>
              </MotionBox>
            )}
          </AnimatePresence>
        </Card.Body>
      </Card.Root>

      {/* Result Display */}
      <AnimatePresence mode="wait">
        {scannedGuest &&
          (status === "success" || status === "already-checked-in") && (
            <MotionBox
              key="result"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, type: "spring" }}
              w="full"
              maxW="31.25rem"
              mx="auto"
            >
              <Card.Root
                bg="white"
                borderColor={scannedGuest.isVIP ? "gold.400" : "green.400"}
                borderWidth="2px"
                shadow="lg"
              >
                <Card.Body>
                  <VStack gap={4}>
                    {/* Status Icon */}
                    <MotionBox
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <Text fontSize="6xl">
                        {status === "already-checked-in"
                          ? "🔄"
                          : scannedGuest.isVIP
                            ? "🌟"
                            : "✅"}
                      </Text>
                    </MotionBox>

                    {/* Status Text */}
                    <Heading
                      size="lg"
                      color={scannedGuest.isVIP ? "yellow.600" : "green.600"}
                    >
                      {statusConfig.title}
                    </Heading>

                    {/* Guest Name */}
                    <HStack>
                      <Heading size="2xl" color="gray.800">
                        {scannedGuest.name}
                      </Heading>
                      {scannedGuest.isVIP && (
                        <Badge colorPalette="yellow" size="lg">
                          ⭐ VIP
                        </Badge>
                      )}
                    </HStack>

                    {/* Description */}
                    <Text color="gray.600">{statusConfig.description}</Text>

                    {/* Scan Again Button */}
                    <Button
                      size="lg"
                      colorPalette="blue"
                      onClick={() => {
                        resetAndScan();
                        startScanning();
                      }}
                      mt={4}
                    >
                      📷 Scan Next Guest
                    </Button>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </MotionBox>
          )}

        {status === "error" && (
          <MotionBox
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            w="full"
            maxW="31.25rem"
            mx="auto"
          >
            <Card.Root
              bg="white"
              borderColor="red.500"
              borderWidth="2px"
              shadow="lg"
            >
              <Card.Body>
                <VStack gap={4}>
                  <Text fontSize="5xl">❌</Text>
                  <Heading size="lg" color="red.600">
                    {statusConfig.title}
                  </Heading>
                  <Text color="gray.600">
                    {errorMessage || statusConfig.description}
                  </Text>
                  <Button
                    size="lg"
                    colorPalette="red"
                    variant="outline"
                    onClick={() => {
                      resetAndScan();
                      startScanning();
                    }}
                  >
                    Try Again
                  </Button>
                </VStack>
              </Card.Body>
            </Card.Root>
          </MotionBox>
        )}
      </AnimatePresence>
    </VStack>
  );
}
