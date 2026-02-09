import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineSlotRecipe,
} from "@chakra-ui/react";
import { cardAnatomy } from "@chakra-ui/react/anatomy";

// ============================================================================
// Wedding Theme - Elegant Sapphire Blue & Platinum
// ============================================================================

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Sapphire Blue - Primary
        blue: {
          50: { value: "#eef2ff" },
          100: { value: "#e0e7ff" },
          200: { value: "#c7d2fe" },
          300: { value: "#a5b4fc" },
          400: { value: "#818cf8" },
          500: { value: "#6366f1" }, // Main sapphire
          600: { value: "#4f46e5" },
          700: { value: "#4338ca" },
          800: { value: "#3730a3" },
          900: { value: "#312e81" },
          950: { value: "#1e1b4b" },
        },
        // Silver/Platinum - VIP Accent
        silver: {
          50: { value: "#f8fafc" },
          100: { value: "#f1f5f9" },
          200: { value: "#e2e8f0" },
          300: { value: "#cbd5e1" },
          400: { value: "#94a3b8" },
          500: { value: "#64748b" }, // Main silver/slate
          600: { value: "#475569" },
          700: { value: "#334155" },
          800: { value: "#1e293b" },
          900: { value: "#0f172a" },
          950: { value: "#020617" },
        },
      },
      shadows: {
        xs: { value: "none" },
        sm: { value: "none" },
        md: { value: "none" },
        lg: { value: "none" },
        xl: { value: "none" },
        "2xl": { value: "none" },
        "3xl": { value: "none" },
      },
    },
    semanticTokens: {
      colors: {
        // Primary Blue
        brand: {
          solid: { value: "{colors.blue.500}" },
          contrast: { value: "{colors.blue.500}" },
          fg: {
            value: { _light: "{colors.blue.700}", _dark: "{colors.blue.400}" },
          },
          muted: { value: "{colors.blue.100}" },
          subtle: { value: "{colors.blue.200}" },
          emphasized: { value: "{colors.blue.300}" },
          focusRing: { value: "{colors.blue.500}" },
        },
        // Silver (VIP)
        accent: {
          solid: { value: "{colors.silver.500}" },
          contrast: { value: "{colors.silver.100}" },
          fg: {
            value: {
              _light: "{colors.silver.700}",
              _dark: "{colors.silver.400}",
            },
          },
          muted: { value: "{colors.silver.50}" },
          subtle: { value: "{colors.silver.100}" },
          emphasized: { value: "{colors.silver.200}" },
          focusRing: { value: "{colors.silver.400}" },
        },
      },
    },
    slotRecipes: {
      card: defineSlotRecipe({
        className: "chakra-card",
        slots: cardAnatomy.keys(),
        base: {
          root: {
            shadow: "none",
            borderWidth: "0",
            borderColor: "transparent",
          },
        },
        variants: {
          size: {
            xs: {
              root: {
                "--card-padding": "spacing.2",
              },
              title: {
                textStyle: "md",
              },
            },
          },
          variant: {
            elevated: {
              root: {
                boxShadow: "none",
                borderWidth: "0",
              },
            },
            outline: {
              root: {
                borderWidth: "0",
                borderColor: "transparent",
              },
            },
            subtle: {
              root: {
                borderWidth: "0",
              },
            },
          },
        },
        defaultVariants: {
          variant: "subtle",
        },
      }),
    },
  },
});

export const system = createSystem(config, defaultConfig);
