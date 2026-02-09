import { useState, useEffect, useCallback } from "react";
import { VStack, Text, Heading, SimpleGrid } from "@chakra-ui/react";
import { INVITATION_COLORS } from "@/constants/invitation-theme";

// ============================================================================
// Countdown Timer Component
// ============================================================================

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  // Helper function to calculate time left
  const calculateTimeLeft = useCallback((): TimeLeft | null => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [targetDate]);

  // ✅ Use lazy initialization - calculate initial value only once
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    calculateTimeLeft(),
  );

  // ✅ Derive isExpired from timeLeft - no separate state needed
  const isExpired = timeLeft === null;

  useEffect(() => {
    // Only set up the interval - no initial setState calls
    const timer = setInterval(() => {
      const time = calculateTimeLeft();
      setTimeLeft(time);
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (isExpired) {
    return (
      <VStack gap={4} py={8}>
        <Text fontSize="4xl">🎉</Text>
        <Heading size="lg" color={INVITATION_COLORS.primary} textAlign="center">
          The day has arrived!
        </Heading>
      </VStack>
    );
  }

  if (!timeLeft) {
    return null;
  }

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} gap={{ base: 3, md: 4 }} w="full">
      {timeUnits.map(({ label, value }) => (
        <VStack
          key={label}
          bg={INVITATION_COLORS.backgroundWhite}
          borderRadius="2xl"
          p={{ base: 4, md: 6 }}
          gap={2}
          borderWidth="1px"
          borderColor={INVITATION_COLORS.primaryMuted}
        >
          <Heading
            size={{ base: "3xl", md: "4xl" }}
            color={INVITATION_COLORS.primary}
            fontWeight="bold"
          >
            {String(value).padStart(2, "0")}
          </Heading>
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color={INVITATION_COLORS.textMuted}
            fontWeight="medium"
            letterSpacing="wide"
            textTransform="uppercase"
          >
            {label}
          </Text>
        </VStack>
      ))}
    </SimpleGrid>
  );
}
