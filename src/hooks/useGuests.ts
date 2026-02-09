import useSWR, { useSWRConfig } from "swr";
import { guestService } from "../api/guests";
import type { GuestStats } from "../utils/validators";
import { useState } from "react";

export function useGuests() {
  const { mutate } = useSWRConfig();
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const {
    data: guestsData,
    error: guestsError,
    isLoading: guestsLoading,
  } = useSWR(["/guests", searchQuery], () =>
    guestService.getAll({ search: searchQuery || undefined }),
  );

  const {
    data: statsData,
    error: statsError,
    isLoading: statsLoading,
  } = useSWR("/guests/stats", () => guestService.getStats());

  const addGuest = async (
    name: string,
    isVIP: boolean,
    group?: string,
    attendanceCount: number = 1,
  ) => {
    try {
      const result = await guestService.create({
        name,
        isVIP,
        group,
        attendanceCount,
      });
      mutate(["/guests", searchQuery]);
      mutate("/guests/stats");
      return result.guest;
    } catch (err) {
      console.error("Failed to add guest", err);
      throw err;
    }
  };

  const updateGuest = async (
    id: string,
    name: string,
    isVIP: boolean,
    group?: string,
    attendanceCount: number = 1,
  ) => {
    try {
      await guestService.update(id, { name, isVIP, group, attendanceCount });
      mutate(["/guests", searchQuery]);
      mutate("/guests/stats");
    } catch (err) {
      console.error("Failed to update guest", err);
      throw err;
    }
  };

  const deleteGuest = async (id: string) => {
    try {
      await guestService.delete(id);
      mutate(["/guests", searchQuery]);
      mutate("/guests/stats");
    } catch (err) {
      console.error("Failed to delete guest", err);
      throw err;
    }
  };

  const checkInGuest = async (id: string, attendanceCount?: number) => {
    try {
      const response = await guestService.checkIn(id, attendanceCount);
      mutate(["/guests", searchQuery]);
      mutate("/guests/stats");
      return response;
    } catch (err) {
      console.error("Failed to check in guest", err);
      throw err;
    }
  };

  const resetGuests = () => {
    // This functionality depends on backend implementation
    // For now, it just invalidates cache
    mutate(["/guests", searchQuery]);
    mutate("/guests/stats");
  };

  const getStats = (): GuestStats => {
    return (
      statsData || { total: 0, checkedIn: 0, vipTotal: 0, vipCheckedIn: 0 }
    );
  };

  return {
    guests: guestsData?.guests || [],
    stats: getStats(),
    isLoading: guestsLoading || statsLoading,
    isError: guestsError || statsError,
    addGuest,
    updateGuest,
    deleteGuest,
    checkInGuest,
    resetGuests,
    searchQuery,
    setSearchQuery,
    getStats,
  };
}
