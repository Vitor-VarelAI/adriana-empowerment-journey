import { supabase } from "@/db/client";
import type { NewCustomerProfile, NewReminderLog } from "@/db/schema";

export type ReminderPlanItem = {
  channel?: string;
  offsetMinutes?: number;
  [key: string]: unknown;
};

export async function upsertCustomerProfile(profile: NewCustomerProfile) {
  try {
    const { error } = await supabase
      .from("customer_profiles")
      .upsert(
        {
          ...profile,
          customer_email: profile.customer_email.toLowerCase(),
        },
        { onConflict: "customer_email" },
      );
    if (error) {
      console.error("Failed to upsert customer profile", error);
    }
  } catch (error) {
    console.error("Failed to upsert customer profile", error);
  }
}

export function derivePreferredSessionTypes(payload: Record<string, unknown>): string[] {
  const direct = Array.isArray(payload.preferredSessionTypes)
    ? (payload.preferredSessionTypes as string[])
    : [];
  if (direct.length > 0) return direct;
  const metadata = payload.metadata && typeof payload.metadata === "object"
    ? (payload.metadata as Record<string, unknown>).preferredSessionTypes
    : undefined;
  return Array.isArray(metadata) ? (metadata as string[]) : [];
}

export async function initializeBookingEngagement(bookingId: string | null) {
  if (!bookingId) return;
  try {
    const { error } = await supabase
      .from("booking_engagements")
      .insert([
        {
          booking_id: bookingId,
          engagement_status: "pending",
          follow_up_required: false,
        },
      ]);
    if (error) {
      console.error("Failed to seed booking engagement", error);
    }
  } catch (error) {
    console.error("Failed to seed booking engagement", error);
  }
}

export async function enqueueReminderLogs(
  bookingId: string | null,
  reminderPlan: ReminderPlanItem[] | undefined,
  bookingStartTime: Date,
) {
  if (!bookingId || !Array.isArray(reminderPlan) || reminderPlan.length === 0) return;

  const rows: NewReminderLog[] = reminderPlan
    .map((item) => {
      const channel = typeof item.channel === "string" ? item.channel : "email";
      const offsetMinutes = typeof item.offsetMinutes === "number" ? item.offsetMinutes : 0;
      const sendAt = new Date(bookingStartTime.getTime() - offsetMinutes * 60 * 1000);
      if (Number.isNaN(sendAt.getTime())) return null;
      return {
        booking_id: bookingId,
        channel,
        status: "pending",
        send_at: sendAt.toISOString(),
        sent_at: null,
        error_message: null,
        delivery_metadata: { offsetMinutes },
      };
    })
    .filter(Boolean) as NewReminderLog[];

  if (rows.length === 0) return;

  try {
    const { error } = await supabase.from("reminder_logs").insert(rows);
    if (error) {
      console.error("Failed to enqueue reminder logs", error);
    }
  } catch (error) {
    console.error("Failed to enqueue reminder logs", error);
  }
}
