import { useState, useCallback, useSyncExternalStore } from "react";
import type { Guest } from "@/types";
import {
  getGuests,
  addGuest as addGuestToStorage,
  updateGuest as updateGuestInStorage,
  deleteGuest as deleteGuestFromStorage,
  checkInGuest as checkInGuestInStorage,
  getGuestStats,
  type GuestStats,
} from "@/utils/storage";

// ============================================================================
// useGuests Hook - Manages guest state with localStorage sync
// ============================================================================

/**
 * External store for guests to enable cross-component sync
 */
let guestsCache: Guest[] = getGuests();
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return guestsCache;
}

function notifyListeners() {
  guestsCache = getGuests();
  listeners.forEach((listener) => listener());
}

/**
 * Hook to manage guests with localStorage persistence
 * Uses useSyncExternalStore for cross-component reactivity
 */
export function useGuests() {
  const guests = useSyncExternalStore(subscribe, getSnapshot);

  const addGuest = useCallback((name: string, isVIP: boolean) => {
    const newGuest: Guest = {
      id: crypto.randomUUID(),
      name,
      isVIP,
      createdAt: Date.now(),
      checkedIn: false,
      checkedInAt: null,
    };
    addGuestToStorage(newGuest);
    notifyListeners();
    return newGuest;
  }, []);

  const updateGuest = useCallback((guest: Guest) => {
    updateGuestInStorage(guest);
    notifyListeners();
  }, []);

  const deleteGuest = useCallback((id: string) => {
    deleteGuestFromStorage(id);
    notifyListeners();
  }, []);

  const checkInGuest = useCallback((id: string) => {
    const guest = checkInGuestInStorage(id);
    notifyListeners();
    return guest;
  }, []);

  const getStats = useCallback((): GuestStats => {
    return getGuestStats();
  }, []);

  return {
    guests,
    addGuest,
    updateGuest,
    deleteGuest,
    checkInGuest,
    getStats,
  };
}

// ============================================================================
// useLocalStorage Hook - Generic localStorage hook
// ============================================================================

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue] as const;
}
