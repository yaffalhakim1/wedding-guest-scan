import { useState, useRef, useEffect } from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaPlay, FaPause } from "react-icons/fa";
import { INVITATION_COLORS } from "@/constants/invitation-theme";

// ============================================================================
// Music Player Component
// ============================================================================

const MotionBox = motion(Box);

interface MusicPlayerProps {
  musicUrl?: string;
}

export default function MusicPlayer({ musicUrl }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!musicUrl || !audioRef.current) return;

    const audio = audioRef.current;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      setHasError(true);
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [musicUrl]);

  const toggleMusic = () => {
    if (!audioRef.current || !musicUrl || hasError) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        setHasError(true);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  // Don't render if no music URL or error
  if (!musicUrl || hasError) return null;

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={musicUrl} loop />

      {/* Floating music button */}
      <MotionBox
        position="fixed"
        bottom={{ base: 6, md: 8 }}
        left={{ base: 6, md: 8 }}
        zIndex={1000}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        <IconButton
          aria-label={isPlaying ? "Pause music" : "Play music"}
          onClick={toggleMusic}
          size="lg"
          borderRadius="full"
          bg={INVITATION_COLORS.primary}
          color="white"
          _hover={{ bg: INVITATION_COLORS.primaryDark }}
          boxShadow="lg"
          css={{
            animation: isPlaying ? "spin 4s linear infinite" : "none",
            "@keyframes spin": {
              from: { transform: "rotate(0deg)" },
              to: { transform: "rotate(360deg)" },
            },
          }}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </IconButton>
      </MotionBox>
    </>
  );
}
