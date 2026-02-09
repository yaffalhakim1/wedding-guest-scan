import {
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Badge,
  Box,
  Separator,
  Icon,
} from "@chakra-ui/react";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { StepperInput } from "@/components/ui/stepper-input";
import { FaUserFriends, FaUserShield, FaClock } from "react-icons/fa";
import { useState } from "react";
import type { Guest } from "@/types";

interface VerificationDialogProps {
  guest: Guest | null;
  isOpen: boolean;
  onCheckIn: (attendanceCount: number) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const VerificationDialog = ({
  guest,
  isOpen,
  onCheckIn,
  onCancel,
  isSubmitting,
}: VerificationDialogProps) => {
  // Initialize state from props. Since we use a 'key' in the parent,
  // this component remounts when the guest changes, so state resets automatically.
  const [attendanceCount, setAttendanceCount] = useState<number>(
    guest?.attendanceCount || 1,
  );

  if (!guest) return null;

  const now = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onCancel()}
      motionPreset="slide-in-bottom"
      size="md"
      placement="center"
    >
      <DialogContent borderRadius="2xl" overflow="hidden">
        <DialogHeader bg="blue.50" borderBottomWidth="1px" pb={4}>
          <VStack align="start" gap={1}>
            <DialogTitle color="blue.900" fontWeight="bold">
              Konfirmasi Kehadiran
            </DialogTitle>
            <HStack color="blue.600" fontSize="xs" fontWeight="bold">
              <Icon as={FaClock} />
              <Text>Check-in • {now} WIB</Text>
            </HStack>
          </VStack>
        </DialogHeader>

        <DialogBody py={6}>
          <VStack align="stretch" gap={6}>
            {/* Guest Detail */}
            <Box p={4} bg="gray.50" borderRadius="xl">
              <Text fontSize="xs" color="gray.500" fontWeight="bold" mb={1}>
                DETAIL TAMU
              </Text>
              <VStack align="start" gap={3}>
                <HStack w="full" justify="space-between">
                  <Heading size="md" color="gray.800">
                    {guest.name}
                  </Heading>
                  {guest.isVIP && (
                    <Badge colorPalette="blue" variant="solid">
                      VIP
                    </Badge>
                  )}
                </HStack>

                <HStack gap={4}>
                  <VStack align="start" gap={0}>
                    <Text fontSize="2xs" color="gray.400" fontWeight="bold">
                      KATEGORI
                    </Text>
                    <HStack gap={1} color="blue.700">
                      <Icon as={FaUserShield} boxSize={3} />
                      <Text fontSize="xs" fontWeight="bold">
                        {guest.isVIP ? "Prioritas" : "Reguler"}
                      </Text>
                    </HStack>
                  </VStack>

                  <Separator orientation="vertical" h="20px" />

                  <VStack align="start" gap={0}>
                    <Text fontSize="2xs" color="gray.400" fontWeight="bold">
                      GRUP
                    </Text>
                    <HStack gap={1} color="blue.700">
                      <Icon as={FaUserFriends} boxSize={3} />
                      <Text fontSize="xs" fontWeight="bold">
                        {guest.group || "Umum"}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
              </VStack>
            </Box>

            {/* Attendance Count */}
            <VStack align="stretch" gap={3}>
              <Text fontSize="sm" color="gray.600" fontWeight="bold">
                Jumlah Kehadiran
              </Text>
              <Box
                p={4}
                border="1px solid"
                borderColor="gray.100"
                borderRadius="xl"
              >
                <HStack justify="space-between">
                  <Text color="gray.600" fontSize="sm">
                    Berapa orang yang hadir?
                  </Text>
                  <StepperInput
                    min={1}
                    max={10}
                    value={attendanceCount.toString()}
                    onValueChange={(details) =>
                      setAttendanceCount(details.valueAsNumber)
                    }
                  />
                </HStack>
              </Box>
            </VStack>
          </VStack>
        </DialogBody>

        <DialogFooter bg="gray.50" p={4}>
          <HStack w="full" gap={3}>
            <Button
              variant="ghost"
              flex={1}
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              colorPalette="blue"
              flex={2}
              onClick={() => onCheckIn(attendanceCount)}
              loading={isSubmitting}
              loadingText="Checking in..."
            >
              Check-in
            </Button>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
