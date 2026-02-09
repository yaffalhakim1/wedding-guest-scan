// ============================================================================
// Types - Guest & App State
// ============================================================================
import type {
  QRPayload as ValidatorQRPayload,
  WeddingConfig as ValidatorWeddingConfig,
} from "@/utils/validators";

/**
 * Guest data model
 */
export interface Guest {
  id: string;
  name: string;
  isVIP: boolean;
  createdAt: string;
  checkedIn: boolean;
  checkedInAt: string | null;
  group?: string;
  attendanceCount?: number;
}

/**
 * QR Code payload embedded in the QR
 */
export type QRPayload = ValidatorQRPayload;

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
export type WeddingConfig = ValidatorWeddingConfig;

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
  | "searching"
  | "adding"
  | "verifying"
  | "checking-in"
  | "welcoming"
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
