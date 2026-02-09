import useSWR from "swr";
import { configService } from "../api/config";
import type { WeddingConfig } from "../api/config";

const DEFAULT_CONFIG: WeddingConfig = {
  bride: "Sarah",
  groom: "John",
  date: "2024-12-31",
  time: "18:00",
  venue: "Grand Ballroom, Fairmont Jakarta",
  message: "We are delighted to invite you to our wedding celebration!",
};

export function useWeddingConfig() {
  const {
    data: configData,
    error,
    isLoading,
    mutate,
  } = useSWR("/config", () => configService.get());

  const weddingConfig = configData?.config || DEFAULT_CONFIG;

  const updateWeddingConfig = async (newConfig: WeddingConfig) => {
    try {
      await configService.update(newConfig);
      mutate();
    } catch (err: unknown) {
      console.error("Failed to update wedding config", err);
      throw err;
    }
  };

  return {
    weddingConfig,
    updateWeddingConfig,
    isLoading,
    isError: error,
  };
}
