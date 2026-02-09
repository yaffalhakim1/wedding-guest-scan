import { useState, useEffect, useRef, useCallback } from "react";
import { isAxiosError } from "axios";
import {
  Box,
  Heading,
  Text,
  Card,
  Button,
  VStack,
  HStack,
  Badge,
  Input,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { Html5Qrcode } from "html5-qrcode";
import confetti from "canvas-confetti";

import { decodeQRPayload } from "@/utils/qr";
import { useGuests } from "@/hooks/useGuests";
import { useSound } from "@/hooks/useSound";
import { useWeddingConfig } from "@/hooks/useWeddingConfig";
import type { ScannerStatus, Guest } from "@/types";

import { VerificationDialog } from "@/components/VerificationDialog";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InputGroup } from "@/components/ui/input-group";
import { DialogRoot, DialogContent, DialogBody } from "@/components/ui/dialog";
import { LuSearch, LuUserPlus, LuQrCode, LuChevronRight } from "react-icons/lu";
import { useQueryState } from "nuqs";

// ============================================================================
// Constants
// ============================================================================

const SCANNER_ELEMENT_ID = "qr-reader";

// ============================================================================
// Celebrations
// ============================================================================

function triggerVIPCelebration() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ["#6366f1", "#a5b4fc", "#e0e7ff", "#f1f5f9", "#cbd5e1"],
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
    colors: ["#6366f1", "#818cf8", "#4ade80"],
  });
}

// ============================================================================
// ScannerPage Component
// ============================================================================

export default function ScannerPage() {
  const { playSound } = useSound();
  const { checkInGuest, stats, guests } = useGuests();
  const { weddingConfig } = useWeddingConfig();

  // Search State (synced with URL)
  const [searchQuery, setSearchQuery] = useQueryState("q", {
    defaultValue: "",
  });

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);

  // State Machine
  const [status, setStatus] = useState<ScannerStatus>("idle");
  const [activeTab, setActiveTab] = useState<string>("scan");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for manual add
  const [newName, setNewName] = useState("");
  const [newGroup, setNewGroup] = useState("");

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

  const stopScanning = useCallback(async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
    }
  }, []);

  const handleScanSuccess = useCallback(
    async (decodedText: string) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      await stopScanning();
      const payload = decodeQRPayload(decodedText);

      if (!payload) {
        setStatus("error");
        setErrorMessage("Format QR Code tidak valid");
        isProcessingRef.current = false;
        return;
      }

      // Instead of immediate check-in, we go to verifying status
      const guestMatch = guests.find((g) => g.id === payload.id);
      if (guestMatch) {
        if (guestMatch.checkedIn) {
          setStatus("already-checked-in");
          setSelectedGuest(guestMatch);
        } else {
          setSelectedGuest(guestMatch);
          setStatus("verifying");
        }
      } else {
        setStatus("error");
        setErrorMessage("Tamu tidak ditemukan dalam daftar");
      }
      isProcessingRef.current = false;
    },
    [stopScanning, guests],
  );

  const startScanning = useCallback(async () => {
    if (!scannerRef.current) return;

    try {
      setStatus("scanning");
      setErrorMessage(null);

      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 15 },  // Full camera area, no qrbox restriction
        handleScanSuccess,
        () => {},
      );
    } catch (error) {
      console.error("Failed to start scanner:", error);
      setStatus("error");
      setErrorMessage("Gagal mengakses kamera. Cek izin browser.");
    }
  }, [handleScanSuccess]);

  // Actions
  const handleCheckIn = async (attendanceCount: number) => {
    if (!selectedGuest) return;
    setIsSubmitting(true);
    setStatus("checking-in");

    try {
      const response = await checkInGuest(selectedGuest.id, attendanceCount);
      setSelectedGuest(response.guest as Guest);

      // Animations & Sounds
      if (response.guest.isVIP) {
        playSound("vipSuccess");
        triggerVIPCelebration();
      } else {
        playSound("success");
        triggerRegularCelebration();
      }

      setStatus("welcoming");
    } catch (err: unknown) {
      console.error(err);
      setStatus("error");
      if (isAxiosError(err)) {
        setErrorMessage(
          err.response?.data?.error || "Gagal melakukan check-in",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualAdd = async () => {
    if (!newName.trim()) return;
    setIsSubmitting(true);
    // Simulate creating a temporary guest object for the verification flow
    // The actual guest will be created in the database during checkIn if it doesn't exist,
    // or we can modify the flow to create first.
    // For this UI, we treat it as a "Walk-in"
    const walkInGuest: Guest = {
      id: "walkin-" + Date.now(),
      name: newName,
      isVIP: false,
      checkedIn: false,
      checkedInAt: null,
      createdAt: new Date().toISOString(),
      group: newGroup,
      attendanceCount: 1,
    };
    setSelectedGuest(walkInGuest);
    setStatus("verifying");
    setIsSubmitting(false);
  };

  const resetFlow = () => {
    setStatus("idle");
    setSelectedGuest(null);
    setErrorMessage(null);
    setNewName("");
    setNewGroup("");
    isProcessingRef.current = false;
    if (activeTab === "scan") {
      startScanning();
    }
  };

  return (
    <VStack gap={6} align="stretch" maxW="800px" mx="auto">
      {/* Stats Header */}
      <Card.Root variant="subtle" bg="blue.50">
        <Card.Body p={4}>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
            <Box>
              <Text
                fontSize="2xs"
                fontWeight="bold"
                color="blue.600"
                textTransform="uppercase"
              >
                Total Guest
              </Text>
              <Heading size="md">{stats.total}</Heading>
            </Box>
            <Box>
              <Text
                fontSize="2xs"
                fontWeight="bold"
                color="green.600"
                textTransform="uppercase"
              >
                Hadir
              </Text>
              <Heading size="md">{stats.checkedIn}</Heading>
            </Box>
            <Box>
              <Text
                fontSize="2xs"
                fontWeight="bold"
                color="purple.600"
                textTransform="uppercase"
              >
                VIP
              </Text>
              <Heading size="md">{stats.vipTotal}</Heading>
            </Box>
            <Box>
              <Text
                fontSize="2xs"
                fontWeight="bold"
                color="purple.800"
                textTransform="uppercase"
              >
                VIP Hadir
              </Text>
              <Heading size="md">{stats.vipCheckedIn}</Heading>
            </Box>
          </SimpleGrid>
        </Card.Body>
      </Card.Root>

      {/* Main Container */}
      <Tabs
        value={activeTab}
        variant='enclosed'
        onValueChange={(details) => {
          setActiveTab(details.value);
          if (details.value === "scan") {
            startScanning();
          } else {
            stopScanning();
            setStatus("idle");
          }
        }}
      >
        <TabsList
          bg="white"
          p={1}
          borderRadius="xl"
          mb={6}
          w="full"
        >
          <TabsTrigger
            value="scan"
            flex={1}
            py={3}
            borderRadius="lg"
            borderBottom="none"
            _selected={{ bg: "blue.500", color: "white", borderBottom: "none" }}
          >
            <Icon as={LuQrCode} mr={2} /> Scan QR
          </TabsTrigger>
          <TabsTrigger
            value="search"
            flex={1}
            py={3}
            borderRadius="lg"
            borderBottom="none"
            _selected={{ bg: "blue.500", color: "white", borderBottom: "none" }}
          >
            <Icon as={LuSearch} mr={2} /> Cari Nama
          </TabsTrigger>
          <TabsTrigger
            value="add"
            flex={1}
            py={3}
            borderRadius="lg"
            borderBottom="none"
            _selected={{ bg: "blue.500", color: "white", borderBottom: "none" }}
          >
            <Icon as={LuUserPlus} mr={2} /> Tambah Tamu
          </TabsTrigger>
        </TabsList>

        <Box>
          <TabsContent value="scan">
            <Box 
              position="relative" 
              h="600px" 
              w="full" 
              bg="black" 
              borderRadius="2xl" 
              overflow="hidden"
            >
              {/* Scanner element - always mounted and visible for html5-qrcode */}
              <Box
                id={SCANNER_ELEMENT_ID}
                w="full"
                h="full"
              />
              
              {/* Instruction overlay - shown while scanning */}
              {status === "scanning" && (
                <Box
                  position="absolute"
                  bottom={4}
                  left={0}
                  right={0}
                  textAlign="center"
                  zIndex={5}
                >
                  <Text 
                    color="white" 
                    fontSize="sm" 
                    bg="blackAlpha.600" 
                    px={4} 
                    py={2} 
                    borderRadius="full"
                    display="inline-block"
                  >
                    Arahkan kamera ke kode QR tamu
                  </Text>
                </Box>
              )}
              
              {/* Overlay for idle state */}
              {status === "idle" && (
                <Box
                  position="absolute"
                  inset={0}
                  bg="blackAlpha.800"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  zIndex={10}
                >
                  <Button
                    colorPalette="blue"
                    size="xl"
                    onClick={startScanning}
                  >
                    Aktifkan Kamera
                  </Button>
                </Box>
              )}
            </Box>
          </TabsContent>


          <TabsContent value="search">
            <VStack gap={4} align="stretch">
              <InputGroup
                startElement={<Icon as={LuSearch} color="gray.400" />}
              >
                <Input
                  placeholder="Cari nama tamu..."
                  size="xl"
                  value={searchQuery || ""}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>

              <VStack align="stretch" gap={2} maxH="300px" overflowY="auto">
                {guests.length === 0 && searchQuery && (
                  <Text textAlign="center" py={8} color="gray.400">
                    Tamu tidak ditemukan
                  </Text>
                )}
                {guests.slice(0, 10).map((guest) => (
                  <Button
                    key={guest.id}
                    variant="ghost"
                    justifyContent="space-between"
                    h="auto"
                    py={4}
                    px={4}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.100"
                    _hover={{ bg: "blue.50", borderColor: "blue.200" }}
                    onClick={() => {
                      setSelectedGuest(guest);
                      if (guest.checkedIn) {
                        setStatus("already-checked-in");
                      } else {
                        setStatus("verifying");
                      }
                    }}
                  >
                    <VStack align="start" gap={0}>
                      <Text fontWeight="bold" color="gray.800">
                        {guest.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {guest.group || "Reguler"}
                      </Text>
                    </VStack>
                    <HStack>
                      {guest.isVIP && <Badge colorPalette="blue">VIP</Badge>}
                      {guest.checkedIn ? (
                        <Badge colorPalette="green">HADIR</Badge>
                      ) : (
                        <Icon as={LuChevronRight} color="gray.300" />
                      )}
                    </HStack>
                  </Button>
                ))}
              </VStack>
            </VStack>
          </TabsContent>

          <TabsContent value="add">
            <Card.Root bg="white">
              <Card.Body p={6}>
                <VStack gap={6} align="stretch">
                  <VStack align="start" gap={2}>
                    <Text fontSize="sm" fontWeight="bold">
                      Nama Tamu
                    </Text>
                    <Input
                      placeholder="Masukkan nama lengkap"
                      size="lg"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </VStack>
                  <VStack align="start" gap={2}>
                    <Text fontSize="sm" fontWeight="bold">
                      Grup / Kategori
                    </Text>
                    <Input
                      placeholder="misal: Keluarga Bride, Teman Kantor"
                      size="lg"
                      value={newGroup}
                      onChange={(e) => setNewGroup(e.target.value)}
                    />
                  </VStack>
                  <Button
                    colorPalette="blue"
                    size="xl"
                    w="full"
                    onClick={handleManualAdd}
                    loading={isSubmitting}
                    disabled={!newName.trim()}
                  >
                    Verifikasi & Lanjut
                  </Button>
                </VStack>
              </Card.Body>
            </Card.Root>
          </TabsContent>
        </Box>
      </Tabs>

      {/* Already Checked-in Dialog */}
      <DialogRoot 
        open={status === "already-checked-in" && !!selectedGuest} 
        onOpenChange={() => resetFlow()}
      >
        <DialogContent>
          <DialogBody py={8} textAlign="center">
            <VStack gap={4}>
              <Text fontSize="5xl">🔄</Text>
              <Heading size="lg" color="orange.600">
                Sudah Check-in
              </Heading>
              <Text color="gray.600">
                <b>{selectedGuest?.name}</b> sudah hadir pada{" "}
                {selectedGuest?.checkedInAt
                  ? new Date(selectedGuest.checkedInAt).toLocaleTimeString()
                  : "-"}
              </Text>
              <Button colorPalette="orange" onClick={resetFlow} w="full">
                Tutup
              </Button>
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>

      {/* Error Dialog */}
      <DialogRoot 
        open={status === "error"} 
        onOpenChange={() => resetFlow()}
      >
        <DialogContent>
          <DialogBody py={8} textAlign="center">
            <VStack gap={4}>
              <Text fontSize="5xl">❌</Text>
              <Heading size="lg" color="red.600">
                Error
              </Heading>
              <Text color="gray.600">
                {errorMessage || "Terjadi kesalahan sistem"}
              </Text>
              <Button colorPalette="red" onClick={resetFlow} w="full">
                Coba Lagi
              </Button>
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>


      <VerificationDialog
        key={selectedGuest?.id || "none"}
        guest={selectedGuest}
        isOpen={status === "verifying" || status === "checking-in"}
        onCheckIn={handleCheckIn}
        onCancel={() => {
          setStatus("idle");
          setSelectedGuest(null);
          if (activeTab === "scan") startScanning();
        }}
        isSubmitting={isSubmitting}
      />

      <WelcomeDialog
        guest={selectedGuest}
        config={weddingConfig}
        isOpen={status === "welcoming"}
        onContinue={resetFlow}
      />
    </VStack>
  );
}
