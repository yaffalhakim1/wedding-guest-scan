// ============================================================================
// Invitation Theme Constants
// ============================================================================

/**
 * Color palette for invitation using existing Chakra theme tokens
 */
export const INVITATION_COLORS = {
  // Dusty Blue (using existing blue tokens)
  primary: "blue.500",
  primaryLight: "blue.100",
  primaryMuted: "blue.200",
  primaryDark: "blue.700",
  primaryDarkest: "blue.950",

  // Silver/Platinum (using existing silver tokens)
  accent: "silver.500",
  accentLight: "silver.100",
  accentMuted: "silver.200",
  accentDark: "silver.700",

  // Backgrounds
  background: "silver.50",
  backgroundWhite: "white",

  // Text
  text: "silver.900",
  textMuted: "silver.600",
  textLight: "silver.400",
} as const;

/**
 * Typography fonts for invitation
 */
export const INVITATION_FONTS = {
  script: "'Great Vibes', cursive", // Couple names
  serif: "'Crimson Text', serif", // Quotes, verses
  sans: "system-ui, sans-serif", // Body text, details
} as const;

/**
 * Animation timing values
 */
export const ANIMATION_TIMING = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  verySlow: 1.0,
} as const;

/**
 * Spacing scale for invitation sections
 */
export const INVITATION_SPACING = {
  sectionGap: { base: 12, md: 16 },
  containerPadding: { base: 6, md: 10 },
  cardPadding: { base: 6, md: 8 },
} as const;
