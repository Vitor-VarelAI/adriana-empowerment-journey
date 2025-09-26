import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/db/client";

const MAX_BATCH = 25;
const FORMSPREE_FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;
const REMINDER_FROM_EMAIL = process.env.REMINDER_FROM_EMAIL || process.env.FROM_EMAIL;

type PendingReminder = {
  id: string;
  booking_id: string | null;
  channel: string;
  send_at: string;
  delivery_metadata: Record<string, unknown> | null;
};

type BookingSnapshot = {
  id: string;
  customer_email: string | null;
  customer_name: string | null;
  session_type: string | null;
  start_time: string | null;
  preference_snapshot: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
};

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("x-reminder-secret");
  const expectedSecret = process.env.REMINDER_RUN_SECRET;

  if (expectedSecret && authHeader !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const nowIso = new Date().toISOString();

  const { data: pendingLogsRaw, error: queryError } = await supabase
    .from("reminder_logs")
    .select("id, booking_id, channel, send_at, delivery_metadata")
    .eq("status", "pending")
    .lte("send_at", nowIso)
    .order("send_at", { ascending: true })
    .limit(MAX_BATCH);

  if (queryError) {
    console.error("Failed to load reminder logs", queryError);
    return NextResponse.json({ error: "Failed to load reminders" }, { status: 500 });
  }

  const pendingLogs = (pendingLogsRaw ?? []) as PendingReminder[];
  if (pendingLogs.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  const processedResults = await Promise.all(
    pendingLogs.map(async (log) => {
      try {
        const booking = log.booking_id ? await loadBooking(log.booking_id) : null;

        if (log.channel === "email") {
          await sendEmailReminder(log, booking);
        } else {
          throw new Error(`Unsupported channel ${log.channel}`);
        }

        const sentAt = new Date().toISOString();

        const { error: updateError } = await supabase
          .from("reminder_logs")
          .update({ status: "sent", sent_at: sentAt, error_message: null })
          .eq("id", log.id);

        if (updateError) {
          throw updateError;
        }

        if (log.booking_id) {
          const { error: bookingUpdateError } = await supabase
            .from("bookings")
            .update({ last_reminder_at: sentAt })
            .eq("id", log.booking_id)
            .lte("last_reminder_at", sentAt);

          if (bookingUpdateError) {
            console.warn("Failed to bump last_reminder_at", { bookingId: log.booking_id, bookingUpdateError });
          }

          const { error: engagementUpdateError } = await supabase
            .from("booking_engagements")
            .update({ engagement_status: "reminded" })
            .eq("booking_id", log.booking_id)
            .eq("engagement_status", "pending");

          if (engagementUpdateError) {
            console.warn("Failed to update engagement status", { bookingId: log.booking_id, engagementUpdateError });
          }
        }

        return { id: log.id, status: "sent" as const };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Reminder processing failed", { id: log.id, error });

        const { error: markError } = await supabase
          .from("reminder_logs")
          .update({ status: "error", error_message: errorMessage })
          .eq("id", log.id);

        if (markError) {
          console.error("Failed to mark reminder error", markError);
        }

        return { id: log.id, status: "error" as const, error: errorMessage };
      }
    })
  );

  return NextResponse.json({ processed: processedResults.length, results: processedResults });
}

export async function GET(request: NextRequest) {
  // Convenience endpoint for manual checks
  return POST(request);
}

async function loadBooking(bookingId: string): Promise<BookingSnapshot | null> {
  const { data, error } = await supabase
    .from("bookings")
    .select("id, customer_email, customer_name, session_type, start_time, preference_snapshot, metadata")
    .eq("id", bookingId)
    .maybeSingle();

  if (error) {
    console.warn("Failed to load booking for reminder", { bookingId, error });
    return null;
  }

  return (data as BookingSnapshot) ?? null;
}

function formatSessionDateTime(iso: string | null): string {
  if (!iso) return "a data agendada";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "a data agendada";
  return new Intl.DateTimeFormat("pt-PT", { dateStyle: "full", timeStyle: "short" }).format(date);
}

async function sendEmailReminder(log: PendingReminder, booking: BookingSnapshot | null) {
  if (!FORMSPREE_FORM_ID) {
    throw new Error("FORMSPREE_FORM_ID not configured");
  }

  if (!booking) {
    throw new Error("Booking information unavailable for reminder");
  }

  if (!booking.customer_email) {
    throw new Error("Booking missing customer email");
  }

  const endpoint = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;
  const sessionDate = formatSessionDateTime(booking.start_time);
  const offsetMinutes = typeof log.delivery_metadata?.offsetMinutes === "number"
    ? (log.delivery_metadata.offsetMinutes as number)
    : null;

  const name = booking.customer_name ?? "Cliente";
  const subject = `Lembrete: sessão agendada para ${sessionDate}`;
  const message = `Olá ${name.split(" ")[0] ?? name}, este é um lembrete da sua sessão ${booking.session_type ?? ""} agendada para ${sessionDate}.`
    .replace(/\s+/g, " ")
    .trim();

  const payload = {
    name,
    email: booking.customer_email,
    subject,
    message,
    channel: log.channel,
    reminderOffsetMinutes: offsetMinutes,
    bookingId: booking.id,
    sessionType: booking.session_type ?? "Sessão",
    sessionDate,
    metadata: booking.preference_snapshot ?? booking.metadata ?? {},
    from: REMINDER_FROM_EMAIL ?? undefined,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Formspree responded ${response.status} ${response.statusText}: ${errorText}`);
  }
}
