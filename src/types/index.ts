// ============================================================================
// Types - Guest & App State
// ============================================================================

/**
 * Guest data model
 */
export interface Guest {
  id: string;
  name: string;
  isVIP: boolean;
  createdAt: number;
  checkedIn: boolean;
  checkedInAt: number | null;
}

/**
 * QR Code payload embedded in the QR
 */
export interface QRPayload {
  id: string;
  name: string;
  vip: boolean;
  ts: number;
}

/**
 * Scan record for history tracking
 */
export interface ScanRecord {
  guestId: string;
  guestName: string;
  isVIP: boolean;
  scannedAt: number;
}

/**
 * Wedding config from JSON
 */
export interface WeddingConfig {
  bride: string;
  groom: string;
  date: string;
  time: string;
  venue: string;
  message: string;
}

/**
 * App state stored in localStorage
 */
export interface AppState {
  guests: Guest[];
  scanHistory: ScanRecord[];
}

// ============================================================================
// Scanner State Machine
// ============================================================================

export type ScannerStatus =
  | "idle"
  | "scanning"
  | "success"
  | "error"
  | "already-checked-in";

export interface ScannerState {
  status: ScannerStatus;
  guest: Guest | null;
  errorMessage: string | null;
}

// ============================================================================
// Form State Machine
// ============================================================================

export type FormStatus = "idle" | "submitting" | "success" | "error";

export interface FormState {
  status: FormStatus;
  errorMessage: string | null;
}
