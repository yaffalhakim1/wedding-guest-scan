import { SimpleGrid, Box, Image } from "@chakra-ui/react";
import { INVITATION_COLORS } from "@/constants/invitation-theme";

// ============================================================================
// Photo Gallery Component
// ============================================================================

interface PhotoGalleryProps {
  photos?: string[];
}

// Default placeholder images
const DEFAULT_PHOTOS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
];

export default function PhotoGallery({
  photos = DEFAULT_PHOTOS,
}: PhotoGalleryProps) {
  const displayPhotos = photos.length > 0 ? photos : DEFAULT_PHOTOS;

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 4, md: 6 }} w="full">
      {displayPhotos.slice(0, 3).map((photo, index) => (
        <Box
          key={index}
          position="relative"
          overflow="hidden"
          borderRadius="3xl"
          aspectRatio="4/5"
          bg={INVITATION_COLORS.primaryMuted}
          borderWidth="1px"
          borderColor={INVITATION_COLORS.primaryMuted}
          _hover={{
            transform: "scale(1.02)",
            boxShadow: "lg",
          }}
          transition="all 0.3s"
        >
          <Image
            src={photo}
            alt={`Couple photo ${index + 1}`}
            objectFit="cover"
            w="full"
            h="full"
            loading="lazy"
          />
        </Box>
      ))}
    </SimpleGrid>
  );
}
