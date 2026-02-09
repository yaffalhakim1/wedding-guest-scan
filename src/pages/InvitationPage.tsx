import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Icon,
  Separator,
  Center,
  Spinner,
  QrCode as ChakraQrCode,
  Button,
  HStack,
} from "@chakra-ui/react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarPlus,
  FaMap,
} from "react-icons/fa";
import { motion } from "framer-motion";
import useSWR from "swr";
import { invitationService } from "@/api/invitation";
import { encodeQRPayload } from "@/utils/qr";
import {
  INVITATION_COLORS,
  INVITATION_FONTS,
  INVITATION_SPACING,
} from "@/constants/invitation-theme";

// Components
import SplashScreen from "@/components/invitation/SplashScreen";
import MusicPlayer from "@/components/invitation/MusicPlayer";
import CountdownTimer from "@/components/invitation/CountdownTimer";
import OurStoryCarousel from "@/components/invitation/OurStoryCarousel";
import PhotoGallery from "@/components/invitation/PhotoGallery";
import DigitalAngpao from "@/components/invitation/DigitalAngpao";
import GuestWishes from "@/components/invitation/GuestWishes";
import FloralBorder from "@/components/invitation/FloralBorder";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

type ViewStatus = "loading" | "error" | "success";

export default function InvitationPage() {
  const { guestId } = useParams<{ guestId: string }>();
  const [showInvitation, setShowInvitation] = useState(false);

  const { data, error, isLoading } = useSWR(
    guestId ? [`/invitation`, guestId] : null,
    () =>
      guestId ? invitationService.get(guestId) : Promise.reject("No guest ID"),
  );

  const status: ViewStatus = isLoading
    ? "loading"
    : error
      ? "error"
      : "success";

  if (status === "loading") {
    return (
      <Center h="100vh" bg={INVITATION_COLORS.background}>
        <Spinner size="xl" color={INVITATION_COLORS.primary} />
      </Center>
    );
  }

  if (status === "error" || !data) {
    return (
      <Center h="100vh" bg={INVITATION_COLORS.background}>
        <VStack gap={4}>
          <Heading color={INVITATION_COLORS.text}>Oops!</Heading>
          <Text color={INVITATION_COLORS.textMuted}>
            Invitation not found or invalid link.
          </Text>
        </VStack>
      </Center>
    );
  }

  const { guest, config } = data;

  return (
    <>
      {/* Splash Screen */}
      <SplashScreen
        show={!showInvitation}
        guestName={guest.name}
        bride={config.bride}
        groom={config.groom}
        onOpen={() => setShowInvitation(true)}
      />

      {/* Main Invitation Content */}
      {showInvitation && (
        <Box minH="100vh" bg={INVITATION_COLORS.background} position="relative">
          {/* Music Player */}
          <MusicPlayer musicUrl={config.musicUrl} />

          <Container
            maxW="container.md"
            py={INVITATION_SPACING.containerPadding}
          >
            <VStack gap={INVITATION_SPACING.sectionGap} align="stretch">
              {/* Quote Section */}
              {config.quote && (
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  position="relative"
                >
                  <FloralBorder position="top-left" size={150} />
                  <FloralBorder position="top-right" size={150} />

                  <VStack
                    gap={4}
                    textAlign="center"
                    py={12}
                    px={6}
                    position="relative"
                  >
                    <Text
                      fontSize="sm"
                      color={INVITATION_COLORS.primary}
                      fontWeight="bold"
                      letterSpacing="widest"
                      textTransform="uppercase"
                    >
                      {config.quote.text}
                    </Text>
                    <Text
                      fontSize={{ base: "md", md: "lg" }}
                      color={INVITATION_COLORS.textMuted}
                      fontFamily={INVITATION_FONTS.serif}
                      fontStyle="italic"
                      maxW="600px"
                      lineHeight="tall"
                    >
                      "{config.quote.content}"
                    </Text>
                  </VStack>
                </MotionBox>
              )}

              {/* Couple Section */}
              <MotionVStack
                gap={6}
                textAlign="center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Text
                  fontSize="sm"
                  color={INVITATION_COLORS.primary}
                  fontWeight="bold"
                  letterSpacing="widest"
                  textTransform="uppercase"
                >
                  The Wedding Of
                </Text>

                <VStack gap={2}>
                  <Heading
                    fontFamily={INVITATION_FONTS.script}
                    fontSize={{ base: "4xl", md: "6xl" }}
                    color={INVITATION_COLORS.primary}
                    fontWeight="normal"
                  >
                    {config.bride}
                  </Heading>
                  {config.brideParents && (
                    <Text fontSize="sm" color={INVITATION_COLORS.textMuted}>
                      {config.brideParents}
                    </Text>
                  )}
                </VStack>

                <Text
                  fontSize="3xl"
                  color={INVITATION_COLORS.textMuted}
                  fontFamily={INVITATION_FONTS.serif}
                >
                  &
                </Text>

                <VStack gap={2}>
                  <Heading
                    fontFamily={INVITATION_FONTS.script}
                    fontSize={{ base: "4xl", md: "6xl" }}
                    color={INVITATION_COLORS.primary}
                    fontWeight="normal"
                  >
                    {config.groom}
                  </Heading>
                  {config.groomParents && (
                    <Text fontSize="sm" color={INVITATION_COLORS.textMuted}>
                      {config.groomParents}
                    </Text>
                  )}
                </VStack>
              </MotionVStack>

              <Separator borderColor={INVITATION_COLORS.primaryMuted} />

              {/* Guest Greeting */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                textAlign="center"
              >
                <VStack gap={3}>
                  <Text fontSize="lg" color={INVITATION_COLORS.textMuted}>
                    Dear,
                  </Text>
                  <Heading
                    size="2xl"
                    color={INVITATION_COLORS.text}
                    fontWeight="bold"
                  >
                    {guest.name}
                  </Heading>
                  {guest.isVIP && (
                    <Text
                      bg={INVITATION_COLORS.primaryLight}
                      color={INVITATION_COLORS.primary}
                      px={4}
                      py={1}
                      borderRadius="full"
                      fontSize="sm"
                      fontWeight="bold"
                    >
                      ⭐ VIP GUEST
                    </Text>
                  )}
                  <Text
                    color={INVITATION_COLORS.textMuted}
                    fontSize="md"
                    maxW="500px"
                    mt={2}
                  >
                    {config.message}
                  </Text>
                </VStack>
              </MotionBox>

              {/* Our Story Section */}
              {config.ourStory && config.ourStory.length > 0 && (
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <VStack gap={6}>
                    <Heading
                      size={{ base: "lg", md: "xl" }}
                      color={INVITATION_COLORS.text}
                      fontFamily={INVITATION_FONTS.serif}
                      textAlign="center"
                    >
                      Our Story
                    </Heading>
                    <OurStoryCarousel stories={config.ourStory} />
                  </VStack>
                </MotionBox>
              )}

              {/* Save The Date + Countdown */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <VStack gap={6}>
                  <VStack gap={2} textAlign="center">
                    <Text
                      fontSize="sm"
                      color={INVITATION_COLORS.primary}
                      fontWeight="bold"
                      letterSpacing="widest"
                      textTransform="uppercase"
                    >
                      Save The Date
                    </Text>
                    <Heading
                      size={{ base: "xl", md: "2xl" }}
                      color={INVITATION_COLORS.text}
                    >
                      {new Date(config.date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Heading>
                  </VStack>

                  {config.countdownDate && (
                    <CountdownTimer targetDate={config.countdownDate} />
                  )}
                </VStack>
              </MotionBox>

              {/* Event Details */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <VStack gap={4} w="full">
                  {/* Date */}
                  <Box
                    bg="white"
                    borderRadius="2xl"
                    p={6}
                    w="full"
                    borderWidth="1px"
                    borderColor={INVITATION_COLORS.primaryMuted}
                  >
                    <HStack gap={4}>
                      <Icon
                        as={FaCalendarAlt}
                        color={INVITATION_COLORS.primary}
                        boxSize={6}
                      />
                      <VStack align="start" gap={0}>
                        <Text
                          fontSize="xs"
                          color={INVITATION_COLORS.textMuted}
                          fontWeight="bold"
                          textTransform="uppercase"
                        >
                          Date
                        </Text>
                        <Text
                          color={INVITATION_COLORS.text}
                          fontWeight="bold"
                          fontSize="md"
                        >
                          {new Date(config.date).toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>

                  {/* Time */}
                  <Box
                    bg="white"
                    borderRadius="2xl"
                    p={6}
                    w="full"
                    borderWidth="1px"
                    borderColor={INVITATION_COLORS.primaryMuted}
                  >
                    <HStack gap={4}>
                      <Icon
                        as={FaClock}
                        color={INVITATION_COLORS.primary}
                        boxSize={6}
                      />
                      <VStack align="start" gap={0}>
                        <Text
                          fontSize="xs"
                          color={INVITATION_COLORS.textMuted}
                          fontWeight="bold"
                          textTransform="uppercase"
                        >
                          Time
                        </Text>
                        <Text
                          color={INVITATION_COLORS.text}
                          fontWeight="bold"
                          fontSize="md"
                        >
                          {config.time} WIB
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>

                  {/* Venue */}
                  <Box
                    bg="white"
                    borderRadius="2xl"
                    p={6}
                    w="full"
                    borderWidth="1px"
                    borderColor={INVITATION_COLORS.primaryMuted}
                  >
                    <HStack gap={4}>
                      <Icon
                        as={FaMapMarkerAlt}
                        color={INVITATION_COLORS.primary}
                        boxSize={6}
                      />
                      <VStack align="start" gap={0} flex={1}>
                        <Text
                          fontSize="xs"
                          color={INVITATION_COLORS.textMuted}
                          fontWeight="bold"
                          textTransform="uppercase"
                        >
                          Venue
                        </Text>
                        <Text
                          color={INVITATION_COLORS.text}
                          fontWeight="bold"
                          fontSize="md"
                        >
                          {config.venue}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>

                  {/* Action Buttons */}
                  <HStack gap={4} w="full" flexWrap="wrap">
                    {config.mapsUrl && (
                      <Button
                        asChild
                        colorPalette="blue"
                        variant="outline"
                        flex={1}
                        size="lg"
                      >
                        <a
                          href={config.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaMap /> View Maps
                        </a>
                      </Button>
                    )}
                    <Button
                      colorPalette="blue"
                      variant="solid"
                      flex={1}
                      size="lg"
                      onClick={() => {
                        // Simple ICS download implementation
                        const event = {
                          title: `${config.bride} & ${config.groom} Wedding`,
                          description: config.message,
                          location: config.venue,
                          start: new Date(
                            config.countdownDate || config.date,
                          ).toISOString(),
                          end: new Date(
                            new Date(
                              config.countdownDate || config.date,
                            ).getTime() +
                              4 * 60 * 60 * 1000,
                          ).toISOString(),
                        };
                        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
DTSTART:${event.start.replace(/[-:]/g, "").split(".")[0]}Z
DTEND:${event.end.replace(/[-:]/g, "").split(".")[0]}Z
END:VEVENT
END:VCALENDAR`;
                        const blob = new Blob([icsContent], {
                          type: "text/calendar",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "wedding-invitation.ics";
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <FaCalendarPlus /> Add to Calendar
                    </Button>
                  </HStack>
                </VStack>
              </MotionBox>

              {/* QR Code */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <VStack gap={4}>
                  <Heading
                    size={{ base: "lg", md: "xl" }}
                    color={INVITATION_COLORS.text}
                    textAlign="center"
                  >
                    Check-in QR Code
                  </Heading>
                  <Center
                    p={8}
                    bg="white"
                    borderRadius="3xl"
                    borderWidth="1px"
                    borderColor={INVITATION_COLORS.primaryMuted}
                  >
                    <ChakraQrCode.Root value={encodeQRPayload(guest)} size="xl">
                      <ChakraQrCode.Frame>
                        <ChakraQrCode.Pattern />
                      </ChakraQrCode.Frame>
                    </ChakraQrCode.Root>
                  </Center>
                  <Text
                    fontSize="sm"
                    color={INVITATION_COLORS.textMuted}
                    textAlign="center"
                  >
                    Please show this QR code at the registration desk
                  </Text>
                </VStack>
              </MotionBox>

              {/* Photo Gallery */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <VStack gap={6}>
                  <Heading
                    size={{ base: "lg", md: "xl" }}
                    color={INVITATION_COLORS.text}
                    fontFamily={INVITATION_FONTS.serif}
                    textAlign="center"
                  >
                    Portrait of Us
                  </Heading>
                  <PhotoGallery />
                </VStack>
              </MotionBox>

              {/* Digital Angpao */}
              {config.bankAccount && (
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                >
                  <VStack gap={6}>
                    <Heading
                      size={{ base: "lg", md: "xl" }}
                      color={INVITATION_COLORS.text}
                      textAlign="center"
                    >
                      Wedding Gift
                    </Heading>
                    <DigitalAngpao bankAccount={config.bankAccount} />
                  </VStack>
                </MotionBox>
              )}

              {/* Guest Wishes */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <GuestWishes />
              </MotionBox>

              {/* Footer */}
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                position="relative"
                py={12}
              >
                <FloralBorder position="bottom-left" size={150} />
                <FloralBorder position="bottom-right" size={150} />

                <VStack gap={4} textAlign="center">
                  <Heading
                    size="lg"
                    color={INVITATION_COLORS.primary}
                    fontFamily={INVITATION_FONTS.script}
                  >
                    Thank You
                  </Heading>
                  <Text color={INVITATION_COLORS.textMuted} fontSize="sm">
                    {config.bride} & {config.groom}
                  </Text>
                  <Separator
                    borderColor={INVITATION_COLORS.primaryMuted}
                    maxW="100px"
                  />
                  <Text color={INVITATION_COLORS.textLight} fontSize="xs">
                    Made with ❤️
                  </Text>
                </VStack>
              </MotionBox>
            </VStack>
          </Container>
        </Box>
      )}
    </>
  );
}
