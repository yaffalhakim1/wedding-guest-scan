import { useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryState } from "nuqs";
import {
  Box,
  Heading,
  Text,
  Card,
  Button,
  VStack,
  HStack,
  Input,
  Table,
  Badge,
  Switch,
  SimpleGrid,
  IconButton,
  QrCode,
  Center,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { LuTrash2, LuQrCode, LuShare2, LuDownload } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster-instance";
import { guestService } from "@/api/guests";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
  DialogCloseTrigger,
} from "@/components/ui/dialog";
import { useGuests } from "@/hooks/useGuests";
import type { Guest } from "@/types";
import { encodeQRPayload } from "@/utils/qr";
import { guestSchema, type GuestFormData } from "@/utils/validators";
import RHFForm from "@/components/RHFForm";

// ============================================================================
// Constants
// ============================================================================

const MotionCard = motion.create(Card.Root);

// ============================================================================
// GuestsPage Component
// ============================================================================

export default function GuestsPage() {
  const [selectedQR, setSelectedQR] = useState<Guest | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { guests, deleteGuest, addGuest } = useGuests();

  // Search State (synced with URL)
  const [searchQuery, setSearchQuery] = useQueryState("q", {
    defaultValue: "",
  });

  // Delete Dialog State
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);

  // Add Guest Form
  const methods = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: "",
      isVIP: false,
      group: undefined,
      attendanceCount: 1,
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, isValid },
  } = methods;

  // Filtered guests
  const filteredGuests = useMemo(() => {
    if (!searchQuery?.trim()) return guests;
    return guests.filter((guest) =>
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [guests, searchQuery]);

  // Handle form submit
  const onSubmit = async (data: GuestFormData) => {
    if (!data.name.trim()) return;

    try {
      const result = await addGuest(
        data.name.trim(),
        data.isVIP,
        data.group,
        data.attendanceCount,
      );

      // Generate invitation URL
      const invitationUrl = `${window.location.origin}/invitation/${result?.id || ""}`;

      toaster.create({
        title: "Guest added",
        description: (
          <VStack align="start" gap={2} w="full">
            <Text>{data.name} has been added to the list.</Text>
            <Box
              bg="blue.50"
              p={3}
              borderRadius="md"
              w="full"
              borderWidth="1px"
              borderColor="blue.200"
            >
              <VStack align="stretch" gap={2}>
                <Text fontSize="xs" fontWeight="bold" color="blue.700">
                  Invitation Link:
                </Text>
                <HStack>
                  <Input
                    value={invitationUrl}
                    readOnly
                    size="sm"
                    fontSize="xs"
                    bg="white"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(invitationUrl);
                      toaster.create({
                        title: "Link copied!",
                        type: "success",
                        duration: 2000,
                      });
                    }}
                  >
                    Copy
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        ),
        type: "success",
        duration: 15000,
      });
      reset();
    } catch (err: unknown) {
      console.error(err);
      let errorMessage = "Failed to add guest. Please try again.";
      if (isAxiosError(err)) {
        errorMessage = err.response?.data?.error || errorMessage;
      }
      toaster.create({
        title: "Error",
        description: errorMessage,
        type: "error",
      });
    }
  };

  const confirmDelete = () => {
    if (!guestToDelete) return;

    try {
      deleteGuest(guestToDelete.id);
      toaster.create({
        title: "Guest deleted",
        type: "info",
      });
      setGuestToDelete(null);
    } catch (err: unknown) {
      console.error("Delete failed", err);
      let errorMessage = "Delete failed";
      if (isAxiosError(err)) {
        errorMessage = err.response?.data?.error || errorMessage;
      }
      toaster.create({
        title: "Delete failed",
        description: errorMessage,
        type: "error",
      });
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await guestService.exportGuests();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `guests-export-${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toaster.create({
        title: "Export successful",
        description: "Guest list has been exported to Excel.",
        type: "success",
      });
    } catch (err: unknown) {
      console.error("Export failed", err);
      let errorMessage = "Failed to export guest list. Please try again.";
      if (isAxiosError(err)) {
        errorMessage = err.response?.data?.error || errorMessage;
      }
      toaster.create({
        title: "Export failed",
        description: errorMessage,
        type: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Box gap={8} pb={10}>
      {/* Header */}
      <HStack justify="space-between" align="start" mb={4}>
        <Box>
          <Heading size="2xl" color="gray.800" mb={2}>
            Guest Management
          </Heading>
          <Text color="gray.500">
            {guests.length} guest{guests.length !== 1 ? "s" : ""} registered
          </Text>
        </Box>
        <Button
          variant="outline"
          colorPalette="green"
          onClick={handleExport}
          loading={isExporting}
          size="sm"
        >
          <LuDownload /> Export Excel
        </Button>
      </HStack>

      {/* Add Guest Form */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        mb={4}
      >
        <Card.Body p={6}>
          <RHFForm methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <SimpleGrid columns={{ base: 1, md: 12 }} gap={6} alignItems="end">
              <Box gridColumn={{ base: "span 1", md: "span 4" }}>
                <Text mb={3} fontWeight="medium" color="gray.600" fontSize="md">
                  Add Guest
                </Text>
                <Input
                  {...register("name")}
                  placeholder="Enter guest name"
                  size="xl"
                  bg="white"
                  borderColor="blue.200"
                  color="blue.950"
                  _focus={{ borderColor: "blue.500" }}
                  px={4}
                />
              </Box>

              <Box gridColumn={{ base: "span 1", md: "span 3" }}>
                <Text mb={3} fontWeight="medium" color="gray.600" fontSize="md">
                  Group / Category
                </Text>
                <Input
                  {...register("group")}
                  placeholder="e.g. Keluarga Bride"
                  size="xl"
                  bg="white"
                  borderColor="blue.200"
                  color="blue.950"
                  _focus={{ borderColor: "blue.500" }}
                  px={4}
                />
              </Box>

              <Box gridColumn={{ base: "span 1", md: "span 1" }}>
                <Text mb={3} fontWeight="medium" color="gray.600" fontSize="md">
                  Pax
                </Text>
                <Input
                  {...register("attendanceCount", { valueAsNumber: true })}
                  type="number"
                  min={1}
                  placeholder="1"
                  size="xl"
                  bg="white"
                  borderColor="blue.200"
                  color="blue.950"
                  _focus={{ borderColor: "blue.500" }}
                  px={4}
                />
              </Box>

              <Box gridColumn={{ base: "span 1", md: "span 2" }} pb={{ md: 2 }}>
                <Controller
                  name="isVIP"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Switch.Root
                      checked={value}
                      onCheckedChange={(e) => onChange(e.checked)}
                      colorPalette="blue"
                      size="lg"
                    >
                      <Switch.HiddenInput />
                      <Switch.Control />
                      <Switch.Label>
                        <HStack gap={3}>
                          <Text
                            color="gray.700"
                            fontSize="md"
                            fontWeight="medium"
                          >
                            VIP
                          </Text>
                          <Text fontSize="xl">⭐</Text>
                        </HStack>
                      </Switch.Label>
                    </Switch.Root>
                  )}
                />
              </Box>

              <Box gridColumn={{ base: "span 1", md: "span 2" }}>
                <Button
                  type="submit"
                  colorPalette="blue"
                  variant="solid"
                  color="white"
                  _hover={{ bg: "blue.700" }}
                  size="xl"
                  w="full"
                  disabled={!isValid}
                  loading={isSubmitting}
                >
                  Add
                </Button>
              </Box>
            </SimpleGrid>
          </RHFForm>
        </Card.Body>
      </MotionCard>

      {/* Search and List */}
      <VStack gap={6} align="stretch">
        <Input
          value={searchQuery || ""}
          onChange={(e) => setSearchQuery(e.target.value || null)}
          placeholder="🔍 Search guests..."
          size="xl"
          bg="blue.100"
          border="none"
          color="blue.900"
          _placeholder={{ color: "blue.400" }}
          _focus={{ bg: "blue.200" }}
          py={6}
          px={6}
        />

        <Card.Root bg="white">
          <Card.Body p={0}>
            {filteredGuests.length === 0 ? (
              <VStack py={16} gap={6}>
                <Text fontSize="5xl">📋</Text>
                <Text color="gray.500" fontSize="lg">
                  {searchQuery
                    ? "No guests found"
                    : "No guests yet. Add your first guest!"}
                </Text>
              </VStack>
            ) : (
              <Table.ScrollArea>
                <Table.Root size={{ base: "sm", md: "lg" }} striped>
                  <Table.Header>
                    <Table.Row bg="blue.50">
                      <Table.ColumnHeader
                        color="blue.700"
                        fontWeight="bold"
                        fontSize="sm"
                        p={4}
                      >
                        Name
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        color="blue.600"
                        fontWeight="bold"
                        fontSize="sm"
                      >
                        Group
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        color="blue.600"
                        fontWeight="bold"
                        fontSize="sm"
                      >
                        Status
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        color="blue.600"
                        fontWeight="bold"
                        fontSize="sm"
                      >
                        Check-in
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        color="blue.600"
                        fontWeight="bold"
                        fontSize="sm"
                        pr={{ base: 4, md: 6 }}
                        w={{ base: "3.75rem", md: "auto" }}
                      >
                        Actions
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <AnimatePresence>
                      {filteredGuests.map((guest) => (
                        <Table.Row key={guest.id}>
                          <Table.Cell p={{ base: 3, md: 4 }}>
                            <VStack align="start" gap={0}>
                              <HStack flexWrap="wrap">
                                <Text
                                  color="gray.800"
                                  fontWeight="semibold"
                                  fontSize={{ base: "sm", md: "md" }}
                                  whiteSpace="nowrap"
                                >
                                  {guest.name}
                                </Text>
                                {guest.isVIP && (
                                  <Badge
                                    colorPalette="blue"
                                    variant="solid"
                                    size="sm"
                                    px={1}
                                  >
                                    ⭐ VIP
                                  </Badge>
                                )}
                              </HStack>
                              <Text
                                fontSize="2xs"
                                color="gray.400"
                                display={{ base: "block", md: "none" }}
                              >
                                {guest.group || "Umum"} •{" "}
                                {guest.attendanceCount || 1} Pax
                              </Text>
                            </VStack>
                          </Table.Cell>
                          <Table.Cell
                            py={4}
                            px={{ base: 2, md: 4 }}
                            display={{ base: "none", md: "table-cell" }}
                          >
                            <VStack align="start" gap={0}>
                              <Text
                                color="blue.900"
                                fontWeight="medium"
                                fontSize="sm"
                              >
                                {guest.group || "-"}
                              </Text>
                              <Text fontSize="xs" color="gray.400">
                                {guest.attendanceCount || 1} Pax
                              </Text>
                            </VStack>
                          </Table.Cell>
                          <Table.Cell py={4} px={{ base: 2, md: 4 }}>
                            <Badge
                              colorPalette={guest.checkedIn ? "green" : "gray"}
                              variant="subtle"
                              size="md"
                              px={2}
                            >
                              {guest.checkedIn ? "Checked In" : "Pending"}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell color="blue.600" fontSize="sm">
                            {guest.checkedInAt
                              ? new Date(guest.checkedInAt).toLocaleTimeString(
                                  "en-GB",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  },
                                )
                              : "-"}
                          </Table.Cell>
                          <Table.Cell pr={{ base: 4, md: 6 }}>
                            <HStack gap={2}>
                              <IconButton
                                aria-label="View QR"
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedQR(guest)}
                              >
                                <LuQrCode />
                              </IconButton>

                              <IconButton
                                aria-label="Share invitation"
                                variant="ghost"
                                size="sm"
                                colorPalette="blue"
                                onClick={() => {
                                  const url = `${window.location.origin}/invitation/${guest.id}`;
                                  navigator.clipboard.writeText(url);
                                  toaster.create({
                                    title: "Invitation link copied!",
                                    description:
                                      "You can now share it with the guest",
                                    type: "success",
                                    duration: 3000,
                                  });
                                }}
                              >
                                <LuShare2 />
                              </IconButton>

                              <IconButton
                                aria-label="Delete guest"
                                variant="ghost"
                                size="sm"
                                colorPalette="red"
                                onClick={() => setGuestToDelete(guest)}
                              >
                                <LuTrash2 />
                              </IconButton>
                            </HStack>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </AnimatePresence>
                  </Table.Body>
                </Table.Root>
              </Table.ScrollArea>
            )}
          </Card.Body>
        </Card.Root>
      </VStack>

      {/* Delete Confirmation Dialog */}
      <DialogRoot
        open={!!guestToDelete}
        onOpenChange={(e) => !e.open && setGuestToDelete(null)}
        placement="center"
        motionPreset="slide-in-bottom"
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Guest</DialogTitle>
          </DialogHeader>
          <DialogBody py={4}>
            Are you sure you want to delete guest{" "}
            <Text as="span" fontWeight="bold">
              {guestToDelete?.name}
            </Text>
            ? This action cannot be undone.
          </DialogBody>
          <DialogFooter gap={4}>
            <DialogActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogActionTrigger>
            <Button colorPalette="red" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
      {/* QR Dialog */}
      <DialogRoot
        open={!!selectedQR}
        onOpenChange={() => setSelectedQR(null)}
        role="alertdialog"
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code Invitation</DialogTitle>
          </DialogHeader>
          <DialogBody pb={10}>
            {selectedQR && (
              <VStack gap={6}>
                <Center p={8} bg="blue.50" borderRadius="3xl">
                  <QrCode.Root value={encodeQRPayload(selectedQR)} size="2xl">
                    <QrCode.Frame>
                      <QrCode.Pattern />
                    </QrCode.Frame>
                  </QrCode.Root>
                </Center>
                <VStack gap={1} textAlign="center">
                  <Heading size="md">{selectedQR.name}</Heading>
                  <Text color="gray.500">{selectedQR.group || "Reguler"}</Text>
                </VStack>
              </VStack>
            )}
          </DialogBody>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}
