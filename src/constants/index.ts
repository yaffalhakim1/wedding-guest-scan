// ============================================================================
// Constants - Magic numbers and strings defined at top level
// ============================================================================

/**
 * localStorage keys
 */
export const STORAGE_KEYS = {
  GUESTS: "wedding-guests",
  SCAN_HISTORY: "wedding-scan-history",
} as const;

/**
 * Route paths
 */
export const ROUTES = {
  HOME: "/",
  GUESTS: "/guests",
  INVITATION: "/invitation/:guestId",
  SCANNER: "/scan",
} as const;

/**
 * Scanner status display configuration
 * Dictionary/Map Pattern - O(1) lookup for UI content
 */
export const SCANNER_STATUS_CONFIG = {
  idle: {
    title: "Ready to Scan",
    description: "Point camera at QR code",
    colorScheme: "gray",
  },
  scanning: {
    title: "Scanning...",
    description: "Hold steady",
    colorScheme: "blue",
  },
  searching: {
    title: "Mencari Tamu",
    description: "Masukkan nama tamu",
    colorScheme: "blue",
  },
  adding: {
    title: "Tambah Tamu",
    description: "Daftarkan tamu baru",
    colorScheme: "blue",
  },
  verifying: {
    title: "Verifikasi",
    description: "Konfirmasi detail tamu",
    colorScheme: "blue",
  },
  welcoming: {
    title: "Selamat Datang!",
    description: "Tamu berhasil check-in",
    colorScheme: "green",
  },
  success: {
    title: "Sukses!",
    description: "Guest checked in successfully",
    colorScheme: "green",
  },
  error: {
    title: "Gagal",
    description: "Terjadi kesalahan",
    colorScheme: "red",
  },
  "already-checked-in": {
    title: "Sudah Check-in",
    description: "Tamu ini sudah hadir sebelumnya",
    colorScheme: "orange",
  },
} as const;

/**
 * Animation durations (ms)
 */
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  CELEBRATION: 3000,
} as const;
