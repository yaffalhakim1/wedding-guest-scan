import { Box } from "@chakra-ui/react";
import cornerFlowersSvg from "@/assets/florals/corner-flowers.svg";

// ============================================================================
// Floral Border Component
// ============================================================================

interface FloralBorderProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: number;
  opacity?: number;
}

export default function FloralBorder({
  position,
  size = 200,
  opacity = 0.3,
}: FloralBorderProps) {
  const positionStyles = {
    "top-left": { top: 0, left: 0, transform: "rotate(0deg)" },
    "top-right": { top: 0, right: 0, transform: "scaleX(-1)" },
    "bottom-left": { bottom: 0, left: 0, transform: "scaleY(-1)" },
    "bottom-right": { bottom: 0, right: 0, transform: "scale(-1, -1)" },
  };

  return (
    <Box
      position="absolute"
      pointerEvents="none"
      opacity={opacity}
      width={`${size}px`}
      height={`${size}px`}
      {...positionStyles[position]}
      display={{
        base: position.includes("bottom") ? "none" : "block",
        md: "block",
      }}
    >
      <img
        src={cornerFlowersSvg}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </Box>
  );
}
