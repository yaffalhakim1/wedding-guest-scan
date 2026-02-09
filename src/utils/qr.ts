import type { Guest } from "@/types";
import { qrPayloadSchema, type QRPayload } from "./validators";
import QRCode from "qrcode";

// ============================================================================
// QR Code Utilities
// ============================================================================

/**
 * Encode guest data to Base64 for QR code
 */
export function encodeQRPayload(guest: Guest): string {
  const payload: QRPayload = {
    id: guest.id,
    name: guest.name,
    vip: guest.isVIP,
    ts: guest.createdAt,
  };

  return btoa(JSON.stringify(payload));
}

/**
 * Decode Base64 QR payload back to guest data
 * Returns null if invalid
 */
export function decodeQRPayload(encoded: string): QRPayload | null {
  try {
    const decoded = atob(encoded);
    const result = qrPayloadSchema.safeParse(JSON.parse(decoded));

    if (!result.success) {
      return null;
    }

    return result.data;
  } catch {
    return null;
  }
}

/**
 * Generate QR code as Data URL
 */
export async function generateQRDataURL(guest: Guest): Promise<string> {
  const encoded = encodeQRPayload(guest);

  return QRCode.toDataURL(encoded, {
    width: 300,
    margin: 2,
    color: {
      dark: "#1a1a2e",
      light: "#ffffff",
    },
  });
}
