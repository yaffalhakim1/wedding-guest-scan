import { STORAGE_KEYS } from "@/constants";
import type { Guest, ScanRecord } from "@/types";

// ============================================================================
// localStorage Utilities
// ============================================================================

/**
 * Get all guests from localStorage
 */
export function getGuests(): Guest[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GUESTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save guests to localStorage
 */
export function saveGuests(guests: Guest[]): void {
  localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(guests));
}

/**
 * Get guest by ID
 */
export function getGuestById(id: string): Guest | null {
  const guests = getGuests();
  return guests.find((g) => g.id === id) ?? null;
}

/**
 * Add a new guest
 */
export function addGuest(guest: Guest): void {
  const guests = getGuests();
  guests.push(guest);
  saveGuests(guests);
}

/**
 * Update a guest
 */
export function updateGuest(updatedGuest: Guest): void {
  const guests = getGuests();
  const index = guests.findIndex((g) => g.id === updatedGuest.id);
  if (index !== -1) {
    guests[index] = updatedGuest;
    saveGuests(guests);
  }
}

/**
 * Delete a guest
 */
export function deleteGuest(id: string): void {
  const guests = getGuests();
  const filtered = guests.filter((g) => g.id !== id);
  saveGuests(filtered);
}

/**
 * Check in a guest
 */
export function checkInGuest(id: string): Guest | null {
  const guests = getGuests();
  const index = guests.findIndex((g) => g.id === id);

  if (index === -1) return null;

  guests[index] = {
    ...guests[index],
    checkedIn: true,
    checkedInAt: Date.now(),
  };

  saveGuests(guests);
  addScanRecord(guests[index]);

  return guests[index];
}

// ============================================================================
// Scan History
// ============================================================================

/**
 * Get scan history from localStorage
 */
export function getScanHistory(): ScanRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Add a scan record
 */
export function addScanRecord(guest: Guest): void {
  const history = getScanHistory();
  const record: ScanRecord = {
    guestId: guest.id,
    guestName: guest.name,
    isVIP: guest.isVIP,
    scannedAt: Date.now(),
  };
  history.push(record);
  localStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(history));
}

// ============================================================================
// Statistics
// ============================================================================

export interface GuestStats {
  total: number;
  checkedIn: number;
  vipTotal: number;
  vipCheckedIn: number;
}

/**
 * Get guest statistics
 */
export function getGuestStats(): GuestStats {
  const guests = getGuests();

  return {
    total: guests.length,
    checkedIn: guests.filter((g) => g.checkedIn).length,
    vipTotal: guests.filter((g) => g.isVIP).length,
    vipCheckedIn: guests.filter((g) => g.isVIP && g.checkedIn).length,
  };
}
