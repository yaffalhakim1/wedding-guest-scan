import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// ============================================================================
// Wedding Theme - Elegant Rose Gold & Gold
// ============================================================================

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Rose Gold - Primary
        rose: {
          50: { value: "#fdf2f4" },
          100: { value: "#fce4e8" },
          200: { value: "#f9ccd5" },
          300: { value: "#f4a3b4" },
          400: { value: "#ec7089" },
          500: { value: "#b76e79" }, // Main rose gold
          600: { value: "#a45d68" },
          700: { value: "#8b4557" },
          800: { value: "#753c4a" },
          900: { value: "#633544" },
          950: { value: "#3a1b24" },
        },
        // Gold - VIP Accent
        gold: {
          50: { value: "#fefce8" },
          100: { value: "#fef9c3" },
          200: { value: "#fef08a" },
          300: { value: "#fde047" },
          400: { value: "#facc15" },
          500: { value: "#d4af37" }, // Main gold
          600: { value: "#b8972e" },
          700: { value: "#996515" },
          800: { value: "#7c4f12" },
          900: { value: "#663d10" },
          950: { value: "#3d2306" },
        },
      },
      // Fonts removed to use system default
    },
    semanticTokens: {
      colors: {
        // Rose (Primary)
        rose: {
          solid: { value: "{colors.rose.500}" },
          contrast: { value: "{colors.rose.100}" },
          fg: {
            value: { _light: "{colors.rose.700}", _dark: "{colors.rose.400}" },
          },
          muted: { value: "{colors.rose.100}" },
          subtle: { value: "{colors.rose.200}" },
          emphasized: { value: "{colors.rose.300}" },
          focusRing: { value: "{colors.rose.500}" },
        },
        // Gold (VIP)
        gold: {
          solid: { value: "{colors.gold.500}" },
          contrast: { value: "{colors.gold.100}" },
          fg: {
            value: { _light: "{colors.gold.700}", _dark: "{colors.gold.400}" },
          },
          muted: { value: "{colors.gold.100}" },
          subtle: { value: "{colors.gold.200}" },
          emphasized: { value: "{colors.gold.300}" },
          focusRing: { value: "{colors.gold.500}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
