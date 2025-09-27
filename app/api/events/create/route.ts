import { NextRequest, NextResponse } from "next/server";
import {
  extractStoredTokens,
  getAuthorizedCalendar,
  getGoogleConfig,
  saveTokens,
} from "../../_lib/google";
import { supabase } from "@/db/client";
import type { NewCustomerProfile, NewReminderLog } from "@/db/schema";

function validatePayload(payload: unknown) {
  const errors: string[] = [];
  if (!payload || typeof payload !== 'object') {
    errors.push("Payload is missing or invalid");
    return errors;
  }

  const data = payload as Record<string, unknown>;

  if (!data.start) {
    errors.push("start is required");
  }
  if (!data.end) {
    errors.push("end is required");
  }
  if (!data.summary) {
    errors.push("summary is required");
  }
  if (!data.email || typeof data.email !== "string") {
    errors.push("email is required");
  }
  if (data.email && typeof data.email === 'string' && !data.email.includes("@")) {
    errors.push("email must be valid");
  }
  if (!data.name || typeof data.name !== "string") {
    errors.push("name is required");
  }

  if (data.start && Number.isNaN(new Date(data.start as string).getTime())) {
    errors.push("start must be a valid ISO date string");
  }

  if (data.end && Number.isNaN(new Date(data.end as string).getTime())) {
    errors.push("end must be a valid ISO date string");
  }

  return errors;
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const errors = validatePayload(payload);
  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Invalid payload", details: errors },
      { status: 400 },
    );
  }

  let config;
  try {
    config = getGoogleConfig();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown config error";
    console.error("Event config error", message);
    return NextResponse.json(
      {
        success: false,
        error: "Configuration error",
        details: message,
      },
      { status: 500 },
    );
  }

  try {
    const { calendar, authClient } = await getAuthorizedCalendar(config);
    const calendarId = config.calendarId || "primary";

    const event = {
      summary: payload.summary,
      description: payload.description || undefined,
      start: {
        dateTime: payload.start,
      },
      end: {
        dateTime: payload.end,
      },
      location: payload.location || undefined,
      attendees:
        payload.email
          ? [
              {
                email: payload.email,
                displayName: payload.name,
              },
            ]
          : undefined,
      extendedProperties: payload.metadata
        ? {
            private: Object.fromEntries(
              Object.entries(payload.metadata).map(([key, value]) => [
                key,
                typeof value === "string"
                  ? value
                  : JSON.stringify(value, null, 2),
              ]),
            ),
          }
        : undefined,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 30 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
      sendUpdates: "all",
    });

    const stored = extractStoredTokens(authClient, config.adminEmail);
    if (stored) {
      await saveTokens(config, stored);
    }

    const startTime = new Date(payload.start);
    const endTime = new Date(payload.end);
    const serviceIdValue = payload.metadata?.serviceId ?? payload.serviceId;
    const parsedServiceId = Number.parseInt(serviceIdValue ?? "", 10);

    const locationLabel =
      typeof payload.location === "string"
        ? payload.location.toLowerCase()
        : "";

    const bookingRecord = {
      // TODO: Include richer preference snapshots and reminder plans when client sends them.
      customer_name: payload.name as string,
      customer_email: payload.email as string,
      customer_phone: payload.phone ?? null,
      session_type:
        payload.sessionType ||
        payload.metadata?.sessionType ||
        (locationLabel.includes("presencial")
          ? "Presencial"
          : "Online"),
      service_id: Number.isNaN(parsedServiceId) ? null : parsedServiceId,
      service_name: payload.summary ?? null,
      notes: payload.description ?? null,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      time_zone:
        payload.timeZone ||
        payload.metadata?.timezone ||
        config.defaultTimeZone,
      calendar_event_id: response.data.id ?? null,
      calendar_html_link: response.data.htmlLink ?? null,
      status: response.data.status ?? "confirmed",
      sent_client_notifications: false,
      metadata: {
        ...(payload.metadata && typeof payload.metadata === "object"
          ? payload.metadata
          : {}),
        serviceId: Number.isNaN(parsedServiceId) ? undefined : parsedServiceId,
      },
      preference_snapshot:
        payload.preferenceSnapshot && typeof payload.preferenceSnapshot === "object"
          ? (payload.preferenceSnapshot as Record<string, unknown>)
          : payload.metadata && typeof payload.metadata === "object"
            ? (payload.metadata as Record<string, unknown>)
            : {},
      last_reminder_at: null,
    };

    try {
      const { data: insertedBooking, error: bookingError } = await supabase
        .from("bookings")
        .insert([bookingRecord])
        .select()
        .single();
      if (bookingError) {
        console.error("Booking persistence failed", bookingError);
      } else {
        const bookingId = insertedBooking?.id ?? null;

        await upsertCustomerProfile({
          customer_email: bookingRecord.customer_email,
          preferred_session_types: derivePreferredSessionTypes(payload),
          preferred_days: payload.preferredDays ?? [],
          preferred_time_ranges: payload.preferredTimeRanges ?? [],
          last_attended_at: null,
          reminder_opt_in: payload.reminderOptIn ?? true,
          locale: payload.locale ?? null,
          notes: payload.profileNotes ?? null,
        });

        if (Array.isArray(payload.reminderPlan)) {
          await enqueueReminderLogs(
            bookingId,
            payload.reminderPlan as ReminderPlanItem[],
            startTime
          );
        }

        await initializeBookingEngagement(bookingId);
      }
    } catch (dbError) {
      console.error("Booking persistence failed", dbError);
    }

    return NextResponse.json({
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
    });
  } catch (error: unknown) {


    const status = (error as { code?: number })?.code || 500;
    const message = error instanceof Error ? error.message : "Unknown error";

    console.error("Event creation failed", {
      message,
      code: (error as { code?: number })?.code,
      detail: (error as { cause?: { message?: string } })?.cause?.message ?? (error as Error)?.message,
      stack: error instanceof Error ? error.stack : undefined,
    });

    let friendlyMessage = "Failed to create event";
    if (status === 401) {
      friendlyMessage =
        "Authentication failed. Re-authorize the Google Calendar integration.";
    } else if (status === 403) {
      friendlyMessage = "Permission denied. Check Google Calendar API access.";
    } else if (status === 429) {
      friendlyMessage = "Too many requests. Try again later.";
    } else if (status === 400) {
      friendlyMessage = "Invalid event data. Please review the booking details.";
    }

    return NextResponse.json(
      {
        success: false,
        error: friendlyMessage,
        details: message,
        code: status,
      },
      { status: status >= 400 && status < 600 ? status : 500 },
    );
  }
}

type ReminderPlanItem = {
  channel?: string;
  offsetMinutes?: number;
  [key: string]: unknown;
};

async function upsertCustomerProfile(profile: NewCustomerProfile) {
  try {
    const { error } = await supabase
      .from("customer_profiles")
      .upsert(
        {
          ...profile,
          customer_email: profile.customer_email.toLowerCase(),
        },
        { onConflict: "customer_email" }
      );
    if (error) {
      console.error("Failed to upsert customer profile", error);
    }
  } catch (error) {
    console.error("Failed to upsert customer profile", error);
  }
}

function derivePreferredSessionTypes(payload: Record<string, unknown>): string[] {
  const direct = Array.isArray(payload.preferredSessionTypes)
    ? (payload.preferredSessionTypes as string[])
    : [];
  if (direct.length > 0) return direct;
  const metadata = payload.metadata && typeof payload.metadata === "object"
    ? (payload.metadata as Record<string, unknown>).preferredSessionTypes
    : undefined;
  return Array.isArray(metadata) ? (metadata as string[]) : [];
}

async function initializeBookingEngagement(bookingId: string | null) {
  if (!bookingId) return;
  try {
    const { error } = await supabase
      .from("booking_engagements")
      .insert([{
        booking_id: bookingId,
        engagement_status: "pending",
        follow_up_required: false,
      }]);
    if (error) {
      console.error("Failed to seed booking engagement", error);
    }
  } catch (error) {
    console.error("Failed to seed booking engagement", error);
  }
}

/**
 * Future automation: once a background worker processes reminder_logs,
 * - mark reminder deliveries in this table (status => sent/error).
 * - update booking_engagements when users confirm, cancel, or no-show.
 */
async function enqueueReminderLogs(
  bookingId: string | null,
  reminderPlan: ReminderPlanItem[],
  bookingStartTime: Date
) {
  if (!bookingId) return;
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
