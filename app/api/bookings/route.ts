import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { z } from "zod";

import { supabase } from "@/db/client";
import {
  enqueueReminderLogs,
  initializeBookingEngagement,
  upsertCustomerProfile,
  derivePreferredSessionTypes,
  type ReminderPlanItem,
} from "../_lib/booking-helpers";
import {
  BOOKING_TIME_ZONE,
  generateDailySlots,
  getSlotIntervalMinutes,
  isBusinessDay,
  isValidSlot,
} from "@/lib/bookingSlots";

const BookingQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/),
});

const BookingPayloadSchema = z.object({
  name: z.string().min(2).max(180),
  email: z.string().email(),
  phone: z.string().min(5).max(40).optional().nullable(),
  sessionType: z.enum(["Online", "Presencial"]),
  serviceId: z.number().int().positive().optional().nullable(),
  serviceName: z.string().min(1).max(180),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  message: z.string().max(2000).optional().nullable(),
  reminderOptIn: z.boolean().optional(),
  preferredSessionTypes: z.array(z.string()).optional(),
  preferredDays: z.array(z.string()).optional(),
  preferredTimeRanges: z.array(z.record(z.string(), z.unknown())).optional(),
  reminderPlan: z.array(z.record(z.string(), z.unknown())).optional(),
  locale: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

function createErrorResponse(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details,
    },
    { status },
  );
}

function formatToLisbonTime(isoString: string, template = "HH:mm") {
  return DateTime.fromISO(isoString, { zone: "utc" })
    .setZone(BOOKING_TIME_ZONE)
    .toFormat(template);
}

export async function GET(request: NextRequest) {
  const parseResult = BookingQuerySchema.safeParse({
    date: request.nextUrl.searchParams.get("date"),
  });

  if (!parseResult.success) {
    return createErrorResponse("Invalid or missing date parameter", 400, parseResult.error.flatten());
  }

  const { date } = parseResult.data;
  const slots = generateDailySlots();
  const requestedDate = new Date(`${date}T00:00:00`);

  if (!isBusinessDay(requestedDate)) {
    return NextResponse.json({
      success: true,
      date,
      timeZone: BOOKING_TIME_ZONE,
      bookedTimes: [],
      availableTimes: [],
      slotMinutes: getSlotIntervalMinutes(),
    });
  }

  try {
    const startOfDayUtc = DateTime.fromISO(`${date}T00:00:00`, { zone: BOOKING_TIME_ZONE })
      .toUTC()
      .toISO();
    const endOfDayUtc = DateTime.fromISO(`${date}T23:59:59`, { zone: BOOKING_TIME_ZONE })
      .toUTC()
      .toISO();

    if (!startOfDayUtc || !endOfDayUtc) {
      return createErrorResponse("Failed to compute availability window", 500);
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("id, start_time, status")
      .gte("start_time", startOfDayUtc)
      .lte("start_time", endOfDayUtc)
      .neq("status", "cancelled");

    if (error) {
      console.error("Failed to load bookings", error);
      return createErrorResponse("Failed to load bookings", 500, error.message);
    }

    const bookedTimes = (data ?? [])
      .map((booking) => {
        try {
          return formatToLisbonTime(booking.start_time, "HH:mm");
        } catch (err) {
          console.error("Failed to parse booking time", { booking, err });
          return null;
        }
      })
      .filter((time): time is string => Boolean(time));

    const uniqueBooked = Array.from(new Set(bookedTimes));
    const availableTimes = slots.filter((slot) => !uniqueBooked.includes(slot));

    return NextResponse.json({
      success: true,
      date,
      timeZone: BOOKING_TIME_ZONE,
      bookedTimes: uniqueBooked,
      availableTimes,
      slotMinutes: getSlotIntervalMinutes(),
    });
  } catch (error) {
    console.error("Availability query failed", error);
    return createErrorResponse("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  const payloadResult = BookingPayloadSchema.safeParse(await request.json().catch(() => null));
  if (!payloadResult.success) {
    return createErrorResponse("Invalid payload", 400, payloadResult.error.flatten());
  }

  const payload = payloadResult.data;

  const { date, time } = payload;
  const bookingDate = new Date(`${date}T00:00:00`);

  if (!isBusinessDay(bookingDate)) {
    return createErrorResponse("Selected date is not available", 400);
  }

  if (!isValidSlot(time)) {
    return createErrorResponse("Selected time is not available", 400);
  }

  try {
    const startDateTime = DateTime.fromISO(`${date}T${time}`, { zone: BOOKING_TIME_ZONE });
    if (!startDateTime.isValid) {
      return createErrorResponse("Failed to parse selected date/time", 400);
    }

    const startUtc = startDateTime.toUTC();
    const endUtc = startDateTime.plus({ minutes: getSlotIntervalMinutes() }).toUTC();
    const startIso = startUtc.toISO();
    const endIso = endUtc.toISO();

    if (!startIso || !endIso) {
      return createErrorResponse("Failed to compute timeslot", 500);
    }

    if (startUtc.toMillis() < DateTime.utc().toMillis()) {
      return createErrorResponse("Selected time is in the past", 400);
    }

    const { data: existingBooking, error: existingError } = await supabase
      .from("bookings")
      .select("id, status")
      .eq("start_time", startIso)
      .maybeSingle();

    if (existingError && existingError.code !== "PGRST116") {
      console.error("Failed to check booking uniqueness", existingError);
      return createErrorResponse("Failed to verify availability", 500, existingError.message);
    }

    if (existingBooking && existingBooking.status !== "cancelled") {
      return createErrorResponse("Selected time is already booked", 409);
    }

    const metadata = {
      ...payload.metadata,
      sessionDate: date,
      sessionTime: time,
      slotMinutes: getSlotIntervalMinutes(),
      source: "website-static-slots",
      capturedAt: new Date().toISOString(),
    };

    const { data: inserted, error } = await supabase
      .from("bookings")
      .insert([
        {
          customer_name: payload.name,
          customer_email: payload.email.toLowerCase(),
          customer_phone: payload.phone ?? null,
          session_type: payload.sessionType,
          service_id: payload.serviceId ?? null,
          service_name: payload.serviceName,
          notes: payload.message ?? null,
          start_time: startIso,
          end_time: endIso,
          time_zone: BOOKING_TIME_ZONE,
          status: "confirmed",
          metadata,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Failed to insert booking", error);
      return createErrorResponse("Failed to create booking", 500, error.message);
    }

    const insertedId = inserted?.id ?? null;

    const derivedPreferences = derivePreferredSessionTypes(payload as unknown as Record<string, unknown>);
    const reminderPlan = (payload.reminderPlan as ReminderPlanItem[] | undefined) ?? [];

    await upsertCustomerProfile({
      customer_email: payload.email.toLowerCase(),
      preferred_session_types: derivedPreferences,
      preferred_days: Array.isArray(payload.preferredDays) ? payload.preferredDays : [],
      preferred_time_ranges: Array.isArray(payload.preferredTimeRanges)
        ? (payload.preferredTimeRanges as Record<string, unknown>[])
        : [],
      last_attended_at: null,
      reminder_opt_in: payload.reminderOptIn ?? true,
      locale: payload.locale ?? null,
      notes: payload.message ?? null,
    });

    await enqueueReminderLogs(insertedId, reminderPlan, startUtc.toJSDate());
    await initializeBookingEngagement(insertedId);

    return NextResponse.json({
      success: true,
      booking: {
        id: insertedId,
        startTime: inserted?.start_time,
        endTime: inserted?.end_time,
        timeZone: BOOKING_TIME_ZONE,
      },
      availableTimes: generateDailySlots().filter((slot) => slot !== time),
    });
  } catch (error) {
    console.error("Booking creation failed", error);
    return createErrorResponse("Internal server error", 500);
  }
}
