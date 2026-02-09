import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  INVITATION_COLORS,
  INVITATION_FONTS,
} from "@/constants/invitation-theme";

// ============================================================================
// Our Story Carousel Component
// ============================================================================

const MotionBox = motion(Box);

interface StoryItem {
  date: string;
  title: string;
  description: string;
  image?: string;
}

interface OurStoryCarouselProps {
  stories: StoryItem[];
}

export default function OurStoryCarousel({ stories }: OurStoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!stories || stories.length === 0) {
    // Placeholder content
    return (
      <VStack gap={4} py={8} px={4}>
        <Heading
          size={{ base: "md", md: "lg" }}
          color={INVITATION_COLORS.textMuted}
          fontFamily={INVITATION_FONTS.serif}
          textAlign="center"
        >
          Our Story Coming Soon
        </Heading>
        <Text
          color={INVITATION_COLORS.textLight}
          textAlign="center"
          fontSize="sm"
        >
          Details will be added later
        </Text>
      </VStack>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const currentStory = stories[currentIndex];

  return (
    <VStack gap={6} w="full" position="relative">
      {/* Carousel content */}
      <Box
        w="full"
        minH="300px"
        position="relative"
        overflow="hidden"
        borderRadius="3xl"
      >
        <AnimatePresence mode="wait">
          <MotionBox
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            bg={INVITATION_COLORS.backgroundWhite}
            p={{ base: 6, md: 8 }}
            borderRadius="3xl"
            borderWidth="1px"
            borderColor={INVITATION_COLORS.primaryMuted}
          >
            <VStack gap={4} align="start">
              <Text
                fontSize="sm"
                color={INVITATION_COLORS.primary}
                fontWeight="bold"
                letterSpacing="wide"
              >
                {currentStory.date}
              </Text>
              <Heading
                size={{ base: "lg", md: "xl" }}
                color={INVITATION_COLORS.text}
                fontFamily={INVITATION_FONTS.serif}
              >
                {currentStory.title}
              </Heading>
              <Text
                color={INVITATION_COLORS.textMuted}
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="tall"
              >
                {currentStory.description}
              </Text>
            </VStack>
          </MotionBox>
        </AnimatePresence>
      </Box>

      {/* Navigation */}
      {stories.length > 1 && (
        <HStack gap={4} justify="center">
          <IconButton
            aria-label="Previous story"
            onClick={prevSlide}
            size="sm"
            variant="outline"
            borderColor={INVITATION_COLORS.primaryMuted}
            color={INVITATION_COLORS.primary}
            _hover={{ bg: INVITATION_COLORS.primaryLight }}
          >
            <FaChevronLeft />
          </IconButton>

          {/* Dots indicator */}
          <HStack gap={2}>
            {stories.map((_, index) => (
              <Box
                key={index}
                w={index === currentIndex ? "8" : "2"}
                h="2"
                borderRadius="full"
                bg={
                  index === currentIndex
                    ? INVITATION_COLORS.primary
                    : INVITATION_COLORS.primaryMuted
                }
                transition="all 0.3s"
                cursor="pointer"
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </HStack>

          <IconButton
            aria-label="Next story"
            onClick={nextSlide}
            size="sm"
            variant="outline"
            borderColor={INVITATION_COLORS.primaryMuted}
            color={INVITATION_COLORS.primary}
            _hover={{ bg: INVITATION_COLORS.primaryLight }}
          >
            <FaChevronRight />
          </IconButton>
        </HStack>
      )}
    </VStack>
  );
}
