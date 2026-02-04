import { useState } from "react";
import defaultConfig from "@/config/wedding.json";

export type WeddingConfig = typeof defaultConfig;

export function useWeddingConfig() {
  const [config] = useState<WeddingConfig>(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("weddingConfig");
        if (saved) {
          return { ...defaultConfig, ...JSON.parse(saved) };
        }
      }
    } catch (e) {
      console.error("Failed to parse wedding config", e);
    }
    return defaultConfig;
  });

  return config;
}
