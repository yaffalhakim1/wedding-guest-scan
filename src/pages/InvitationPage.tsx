import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { getGuestById } from "@/utils/storage";
import { generateQRDataURL } from "@/utils/qr";
import { useWeddingConfig } from "@/hooks/useWeddingConfig";
import { InvitationCard } from "@/components/InvitationCard";
import type { Guest } from "@/types";
import { LuShare2 } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster";

// ============================================================================
// Constants
// ============================================================================

type PageStatus = "loading" | "ready" | "not-found";

const MotionBox = motion.create(Box);

// ============================================================================
// InvitationPage Component
// ============================================================================

export default function InvitationPage() {
  const { guestId } = useParams<{ guestId: string }>();
  const navigate = useNavigate();
  const weddingConfig = useWeddingConfig();
  const [searchParams] = useSearchParams();
  const sharedData = searchParams.get("d");

  // State Machine Pattern
  const [status, setStatus] = useState<PageStatus>("loading");
  const [guest, setGuest] = useState<Guest | null>(null);
  const [qrDataURL, setQrDataURL] = useState<string>("");

  // Load guest data
  useEffect(() => {
    const loadGuest = async () => {
      let foundGuest: Guest | null = null;

      if (sharedData) {
        // Handle stateless shared links (Compact Array Format: [id, name, isVIP])
        try {
          const raw = atob(decodeURIComponent(sharedData));
          const [id, name, isVIP] = JSON.parse(raw);

          foundGuest = {
            id,
            name,
            isVIP: !!isVIP,
            createdAt: Date.now(),
            checkedIn: false,
            checkedInAt: null,
          };
        } catch (error) {
          console.error("Failed to parse shared data:", error);
          setStatus("not-found");
          return;
        }
      } else if (guestId) {
        // Handle local lookup
        foundGuest = getGuestById(guestId);
      }

      if (!foundGuest) {
        setStatus("not-found");
        return;
      }

      setGuest(foundGuest);

      // Generate QR code
      const dataURL = await generateQRDataURL(foundGuest);
      setQrDataURL(dataURL);
      setStatus("ready");
    };

    loadGuest();
  }, [guestId, sharedData]);

  // Share invitation logic: Compact Array [id, name, isVIP]
  const shareLink = guest
    ? `${window.location.origin}/invitation/share?d=${encodeURIComponent(btoa(JSON.stringify([guest.id, guest.name, guest.isVIP ? 1 : 0])))}`
    : "";

  const handleShare = () => {
    navigator.clipboard.writeText(shareLink);
    toaster.create({
      title: "Link Copied!",
      description: "You can now share this link with the guest.",
      type: "success",
    });
  };

  // Not found state
  if (status === "not-found") {
    return (
      <Container maxW="container.md" py={20}>
        <VStack gap={6}>
          <Text fontSize="6xl">😢</Text>
          <Heading color="gray.800">Guest Not Found</Heading>
          <Button onClick={() => navigate("/guests")}>
            ← Back to Guest List
          </Button>
        </VStack>
      </Container>
    );
  }

  // Loading state
  if (status === "loading") {
    return (
      <Container maxW="container.md" py={20}>
        <VStack gap={6}>
          <Spinner size="xl" color="rose.500" />
          <Text color="gray.500">Loading invitation...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={10}>
      <HStack justify="space-between" mb={8} w="full">
        <Button variant="ghost" onClick={() => navigate("/guests")}>
          ← Back
        </Button>

        {!sharedData && (
          <Button variant="solid" onClick={handleShare}>
            <LuShare2 /> Share Link
          </Button>
        )}
      </HStack>

      {/* Invitation Preview */}
      <MotionBox
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        display="flex"
        justifyContent="center"
      >
        {guest && (
          <InvitationCard
            guest={guest}
            config={weddingConfig}
            qrDataURL={qrDataURL}
          />
        )}
      </MotionBox>
    </Container>
  );
}
