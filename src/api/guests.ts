import api from "./axios";
import {
  type GuestResponse,
  type GuestsResponse,
  type GuestStats,
  type MessageResponse,
} from "@/utils/validators";

export const guestService = {
  getAll: (params?: { search?: string; isVIP?: boolean }) =>
    api.get<GuestsResponse>("/guests", { params }).then((res) => res.data),

  getStats: () => api.get<GuestStats>("/guests/stats").then((res) => res.data),

  create: (data: {
    name: string;
    isVIP: boolean;
    group?: string;
    attendanceCount: number;
  }) => api.post<GuestResponse>("/guests", data).then((res) => res.data),

  update: (
    id: string,
    data: {
      name: string;
      isVIP: boolean;
      group?: string;
      attendanceCount: number;
    },
  ) => api.put<GuestResponse>(`/guests/${id}`, data).then((res) => res.data),

  delete: (id: string) =>
    api.delete<MessageResponse>(`/guests/${id}`).then((res) => res.data),

  checkIn: (id: string, attendanceCount?: number) =>
    api
      .post<GuestResponse & { stats: GuestStats }>(`/guests/${id}/check-in`, {
        attendanceCount,
      })
      .then((res) => res.data),
};
