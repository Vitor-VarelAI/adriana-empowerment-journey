import { randomUUID } from "node:crypto";

import { generateDailySlots } from "@/lib/bookingSlots";

export type StoredBooking = {
  id: string;
  date: string;
  time: string;
  startIso: string;
  endIso: string;
  createdAt: string;
  payload: Record<string, unknown>;
  metadata: Record<string, unknown>;
};

export type StoredCustomerProfile = {
  customer_email: string;
  customer_name?: string;
  customer_phone?: string | null;
  session_type?: string | null;
  preferred_session_types?: string[];
  preferred_days?: string[];
  preferred_time_ranges?: Array<Record<string, unknown>>;
  reminder_opt_in?: boolean;
  locale?: string | null;
  notes?: string | null;
  metadata?: Record<string, unknown> | null;
  updated_at: string;
};

const bookingsByDate = new Map<string, Map<string, StoredBooking>>();
const customerProfiles = new Map<string, StoredCustomerProfile>();

export function listBookedTimes(date: string): string[] {
  const day = bookingsByDate.get(date);
  if (!day) {
    return [];
  }
  return Array.from(day.keys()).sort();
}

export function isSlotBooked(date: string, time: string): boolean {
  const day = bookingsByDate.get(date);
  if (!day) {
    return false;
  }
  return day.has(time);
}

export function saveBooking(record: Omit<StoredBooking, "id" | "createdAt">): StoredBooking {
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const stored: StoredBooking = { ...record, id, createdAt };

  const day = bookingsByDate.get(record.date) ?? new Map<string, StoredBooking>();
  day.set(record.time, stored);
  bookingsByDate.set(record.date, day);

  const email = typeof record.payload.email === "string" ? record.payload.email.toLowerCase() : undefined;
  if (email) {
    rememberCustomerProfile(email, record.payload, record.metadata);
  }

  return stored;
}

export function getCustomerProfile(email: string): StoredCustomerProfile | null {
  const normalized = email.toLowerCase();
  return customerProfiles.get(normalized) ?? null;
}

export function rememberCustomerProfile(
  email: string,
  payload: Record<string, unknown>,
  metadata: Record<string, unknown>,
) {
  const normalized = email.toLowerCase();
  const existing = customerProfiles.get(normalized) ?? null;
  const snapshot: StoredCustomerProfile = {
    customer_email: normalized,
    customer_name: typeof payload.name === "string" ? payload.name : existing?.customer_name,
    customer_phone: typeof payload.phone === "string" ? payload.phone : existing?.customer_phone ?? null,
    session_type: typeof payload.sessionType === "string" ? payload.sessionType : existing?.session_type,
    preferred_session_types: Array.isArray(payload.preferredSessionTypes)
      ? payload.preferredSessionTypes.filter((value): value is string => typeof value === "string")
      : existing?.preferred_session_types ?? [],
    preferred_days: Array.isArray(payload.preferredDays)
      ? payload.preferredDays.filter((value): value is string => typeof value === "string")
      : existing?.preferred_days ?? [],
    preferred_time_ranges: Array.isArray(payload.preferredTimeRanges)
      ? payload.preferredTimeRanges.filter(
          (value): value is Record<string, unknown> => typeof value === "object" && value !== null,
        )
      : existing?.preferred_time_ranges ?? [],
    reminder_opt_in: typeof payload.reminderOptIn === "boolean"
      ? payload.reminderOptIn
      : existing?.reminder_opt_in,
    locale: typeof payload.locale === "string" ? payload.locale : existing?.locale ?? null,
    notes: typeof payload.message === "string" ? payload.message : existing?.notes ?? null,
    metadata: Object.keys(metadata).length > 0 ? metadata : existing?.metadata ?? null,
    updated_at: new Date().toISOString(),
  };

  customerProfiles.set(normalized, snapshot);
}

export function resetMemoryDatabase() {
  bookingsByDate.clear();
  customerProfiles.clear();
}

export function listAvailableTimes(date: string): string[] {
  const booked = new Set(listBookedTimes(date));
  return generateDailySlots().filter((slot) => !booked.has(slot));
}
