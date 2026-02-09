import api from "./axios";
import { type GuestResponse, type ConfigResponse } from "@/utils/validators";

export const invitationService = {
  get: (guestId: string) =>
    api
      .get<GuestResponse & ConfigResponse>(`/invitation/${guestId}`)
      .then((res) => res.data),
};
