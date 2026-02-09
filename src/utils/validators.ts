import * as z from "zod";

// ============================================================================
// Login Validator
// ============================================================================

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ============================================================================
// Guest Validator
// ============================================================================

export const guestSchema = z.object({
  name: z.string().min(1, "Guest name is required"),
  isVIP: z.boolean(),
  group: z.string().optional(),
  attendanceCount: z.number().int().min(1),
});

export type GuestFormData = z.infer<typeof guestSchema>;

// ============================================================================
// Wedding Config Validator
// ============================================================================

export const configSchema = z.object({
  bride: z.string().min(1, "Bride name is required"),
  groom: z.string().min(1, "Groom name is required"),
  brideParents: z.string().optional(),
  groomParents: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().min(1, "Venue is required"),
  message: z.string().min(1, "Welcome message is required"),
  mapsUrl: z.string().optional(),
  countdownDate: z.string().optional(),
  musicUrl: z.string().optional(),
  ourStory: z
    .array(
      z.object({
        date: z.string(),
        title: z.string(),
        description: z.string(),
        image: z.string().optional(),
      }),
    )
    .optional(),
  bankAccount: z
    .object({
      bankName: z.string(),
      accountNumber: z.string(),
      accountName: z.string(),
    })
    .optional(),
  quote: z
    .object({
      text: z.string(),
      content: z.string(),
    })
    .optional(),
});

export type WeddingConfig = z.infer<typeof configSchema>;

// ============================================================================
// QR Payload Validator
// ============================================================================

export const qrPayloadSchema = z.object({
  id: z.string(),
  name: z.string(),
  vip: z.boolean(),
  ts: z.string(),
});

export type QRPayload = z.infer<typeof qrPayloadSchema>;

// ============================================================================
// API Response Types
// ============================================================================

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

export interface GuestResponse {
  guest: GuestFormData & {
    id: string;
    checkedIn: boolean;
    checkedInAt: string | null;
    createdAt: string;
    group?: string;
    attendanceCount: number;
  };
  stats?: GuestStats;
}

export interface GuestsResponse {
  guests: (GuestFormData & {
    id: string;
    checkedIn: boolean;
    checkedInAt: string | null;
    createdAt: string;
    group?: string;
    attendanceCount: number;
  })[];
}

export interface GuestStats {
  total: number;
  checkedIn: number;
  vipTotal: number;
  vipCheckedIn: number;
}

export interface ConfigResponse {
  config: WeddingConfig;
}

export interface MessageResponse {
  message: string;
}
