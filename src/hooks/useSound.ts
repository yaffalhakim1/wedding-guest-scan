import { useRef, useCallback } from "react";

// ============================================================================
// useSound Hook - Play sound effects
// ============================================================================

const SOUND_PATHS = {
  success: "/sounds/success.mp3",
  vipSuccess: "/sounds/vip-success.mp3",
} as const;

type SoundType = keyof typeof SOUND_PATHS;

/**
 * Hook to play sound effects
 */
export function useSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((type: SoundType) => {
    try {
      // Stop any currently playing sound
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(SOUND_PATHS[type]);
      audioRef.current = audio;
      audio.play().catch((err) => {
        console.warn("Could not play sound:", err);
      });
    } catch (err) {
      console.warn("Sound not available:", err);
    }
  }, []);

  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { playSound, stopSound };
}
