import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
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
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { toaster } from "@/components/ui/toaster";
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

// ============================================================================
// Constants
// ============================================================================

const MotionCard = motion.create(Card.Root);

type GuestFormData = {
  name: string;
  isVIP: boolean;
};

// ============================================================================
// GuestsPage Component
// ============================================================================

export default function GuestsPage() {
  const navigate = useNavigate();
  const { guests, addGuest, deleteGuest } = useGuests();

  // Search State (synced with URL)
  const [searchQuery, setSearchQuery] = useQueryState("q", {
    defaultValue: "",
  });

  // Delete Dialog State
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);

  // Add Guest Form
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm<GuestFormData>({
    defaultValues: {
      name: "",
      isVIP: false,
    },
    mode: "onChange",
  });

  // Filtered guests
  const filteredGuests = useMemo(() => {
    if (!searchQuery?.trim()) return guests;
    return guests.filter((guest) =>
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [guests, searchQuery]);

  // Handle form submit
  const onSubmit = (data: GuestFormData) => {
    if (!data.name.trim()) return;

    try {
      addGuest(data.name.trim(), data.isVIP);
      toaster.create({
        title: "Guest added",
        description: `${data.name} has been added to the list.`,
        type: "success",
      });
      reset();
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Error",
        description: "Failed to add guest. Please try again.",
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
    } catch (e) {
      console.error("Delete failed", e);
      toaster.create({ title: "Delete failed", type: "error" });
    }
  };

  return (
    <VStack gap={8} align="stretch" pb={10}>
      {/* Header */}
      <Box>
        <Heading size="2xl" color="gray.800" mb={2}>
          Guest Management
        </Heading>
        <Text color="gray.500">
          {guests.length} guest{guests.length !== 1 ? "s" : ""} registered
        </Text>
      </Box>

      {/* Add Guest Form */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        bg="white"
        borderColor="gray.200"
        shadow="sm"
      >
        <Card.Body p={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <SimpleGrid columns={{ base: 1, md: 12 }} gap={6} alignItems="end">
              <Box gridColumn={{ base: "span 1", md: "span 8" }}>
                <Text mb={3} fontWeight="medium" color="gray.600" fontSize="md">
                  Add Guest
                </Text>
                <Input
                  {...register("name", { required: true })}
                  placeholder="Enter guest name"
                  size="xl"
                  bg="white"
                  borderColor="gray.300"
                  color="gray.800"
                  _focus={{ borderColor: "green.500" }}
                  px={4}
                />
              </Box>

              <Box gridColumn={{ base: "span 1", md: "span 2" }} pb={2}>
                <Controller
                  name="isVIP"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Switch.Root
                      checked={value}
                      onCheckedChange={(e) => onChange(e.checked)}
                      colorPalette="yellow"
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
                            VIP Status
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
                  colorPalette="green"
                  variant="solid"
                  color="white"
                  _hover={{ bg: "green.700" }}
                  size="xl"
                  w="full"
                  disabled={!isValid}
                  loading={isSubmitting}
                >
                  Add Guest
                </Button>
              </Box>
            </SimpleGrid>
          </form>
        </Card.Body>
      </MotionCard>

      {/* Search and List */}
      <VStack gap={6} align="stretch">
        <Input
          value={searchQuery || ""}
          onChange={(e) => setSearchQuery(e.target.value || null)}
          placeholder="🔍 Search guests..."
          size="xl"
          bg="white"
          borderColor="gray.300"
          color="gray.800"
          _focus={{ borderColor: "green.500" }}
          py={6}
          px={6}
        />

        <Card.Root
          bg="white"
          borderColor="gray.200"
          borderWidth="1px"
          shadow="sm"
        >
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
                    <Table.Row bg="gray.50">
                      <Table.ColumnHeader
                        color="gray.600"
                        fontWeight="bold"
                        fontSize="sm"
                        p={4}
                      >
                        Name
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        color="gray.600"
                        fontWeight="bold"
                        fontSize="sm"
                      >
                        Status
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        color="gray.600"
                        fontWeight="bold"
                        fontSize="sm"
                      >
                        Check-in
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        color="gray.600"
                        textAlign="end"
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
                                  colorPalette="yellow"
                                  variant="solid"
                                  size="sm"
                                  px={1}
                                >
                                  ⭐ VIP
                                </Badge>
                              )}
                            </HStack>
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
                          <Table.Cell color="gray.600" fontSize="sm">
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
                          <Table.Cell textAlign="end" pr={{ base: 4, md: 6 }}>
                            <HStack gap={{ base: 2, md: 3 }} justify="end">
                              <Button
                                size="sm"
                                colorPalette="blue"
                                minW={{ base: "2rem", md: "7.5rem" }}
                                onClick={() =>
                                  navigate(`/invitation/${guest.id}`)
                                }
                              >
                                <Text display={{ base: "none", md: "block" }}>
                                  📩 Invitation
                                </Text>
                                <Text display={{ base: "block", md: "none" }}>
                                  📩
                                </Text>
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                colorPalette="red"
                                onClick={() => setGuestToDelete(guest)}
                              >
                                🗑️
                              </Button>
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
    </VStack>
  );
}
