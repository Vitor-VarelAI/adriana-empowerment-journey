import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { z } from "zod";

import {
  isSlotBooked,
  listAvailableTimes,
  listBookedTimes,
  saveBooking,
} from "../_lib/memory-db";
import {
  BOOKING_TIME_ZONE,
  generateDailySlots,
  getSlotIntervalMinutes,
  isBusinessDay,
  isValidSlot,
} from "@/lib/bookingSlots";

const MAX_ADVANCE_MONTHS = 12;

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

type BookingPayload = z.infer<typeof BookingPayloadSchema>;

type FormspreeError = {
  status: number;
  message: string;
};

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

function isBeyondAdvanceLimit(date: string) {
  const today = DateTime.now().setZone(BOOKING_TIME_ZONE).startOf("day");
  const target = DateTime.fromISO(date, { zone: BOOKING_TIME_ZONE }).startOf("day");
  return target.diff(today, "months").months > MAX_ADVANCE_MONTHS;
}

function derivePreferredSessionTypes(payload: BookingPayload): string[] {
  if (Array.isArray(payload.preferredSessionTypes) && payload.preferredSessionTypes.length > 0) {
    return payload.preferredSessionTypes.filter((value): value is string => typeof value === "string");
  }
  const fromMetadata = payload.metadata && typeof payload.metadata === "object"
    ? (payload.metadata as Record<string, unknown>).preferredSessionTypes
    : undefined;
  return Array.isArray(fromMetadata)
    ? (fromMetadata.filter((value): value is string => typeof value === "string"))
    : [];
}

async function notifyFormspree(payload: Record<string, unknown>): Promise<FormspreeError | null> {
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

  if (!formspreeId) {
    return { status: 500, message: "Formspree ID não configurado" };
  }

  try {
    const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text().catch(() => "");

    if (response.status !== 200) {
      const message = responseText.trim().length > 0 ? responseText : response.statusText;
      return { status: response.status, message };
    }

    return null;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Falha ao contactar Formspree";
    return { status: 500, message };
  }
}

export async function GET(request: NextRequest) {
  const parseResult = BookingQuerySchema.safeParse({
    date: request.nextUrl.searchParams.get("date"),
  });

  if (!parseResult.success) {
    return createErrorResponse("Invalid or missing date parameter", 400, parseResult.error.flatten());
  }

  const { date } = parseResult.data;

  if (isBeyondAdvanceLimit(date)) {
    return createErrorResponse("Selected date is beyond the booking window", 400);
  }

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
    const bookedTimes = listBookedTimes(date);
    const availableTimes = slots.filter((slot) => !bookedTimes.includes(slot));

    return NextResponse.json({
      success: true,
      date,
      timeZone: BOOKING_TIME_ZONE,
      bookedTimes,
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

  if (isBeyondAdvanceLimit(date)) {
    return createErrorResponse("Selected date is beyond the booking window", 400);
  }

  const bookingDate = new Date(`${date}T00:00:00`);

  if (!isBusinessDay(bookingDate)) {
    return createErrorResponse("Selected date is not available", 400);
  }

  if (!isValidSlot(time)) {
    return createErrorResponse("Selected time is not available", 400);
  }

  if (isSlotBooked(date, time)) {
    return createErrorResponse("Selected time is already booked", 409);
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

    const metadata = {
      ...(payload.metadata ?? {}),
      sessionDate: date,
      sessionTime: time,
      slotMinutes: getSlotIntervalMinutes(),
      source: "website-static-slots",
      capturedAt: new Date().toISOString(),
    } satisfies Record<string, unknown>;

    const formspreePayload = {
      name: payload.name,
      email: payload.email,
      _replyto: payload.email,
      phone: payload.phone ?? "Não fornecido",
      sessionType: payload.sessionType,
      serviceName: payload.serviceName,
      sessionDate: startDateTime.toFormat("dd/MM/yyyy"),
      sessionTime: time,
      message: payload.message ?? "Sem mensagem adicional",
      bookingReference: `${date} ${time}`,
      timestamp: new Date().toISOString(),
      reminderOptIn: payload.reminderOptIn ?? true,
      preferredSessionTypes: derivePreferredSessionTypes(payload),
      preferredDays: payload.preferredDays ?? [],
      preferredTimeRanges: payload.preferredTimeRanges ?? [],
    } satisfies Record<string, unknown>;

    const formspreeError = await notifyFormspree(formspreePayload);

    if (formspreeError) {
      const { message, status } = formspreeError;
      return createErrorResponse(message, 502, { formspreeStatus: status });
    }

    const stored = saveBooking({
      date,
      time,
      startIso,
      endIso,
      metadata,
      payload: payload as unknown as Record<string, unknown>,
    });

    const availableTimes = listAvailableTimes(date);

    return NextResponse.json({
      success: true,
      booking: {
        id: stored.id,
        startTime: stored.startIso,
        endTime: stored.endIso,
        timeZone: BOOKING_TIME_ZONE,
      },
      availableTimes,
    });
  } catch (error) {
    console.error("Booking creation failed", error);
    return createErrorResponse("Internal server error", 500);
  }
}
