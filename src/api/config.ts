import api from "./axios";
import { type ConfigResponse, type WeddingConfig } from "@/utils/validators";
export { type ConfigResponse, type WeddingConfig };

export const configService = {
  get: () => api.get<ConfigResponse>("/config").then((res) => res.data),

  update: (data: WeddingConfig) =>
    api.put<ConfigResponse>("/config", data).then((res) => res.data),
};
