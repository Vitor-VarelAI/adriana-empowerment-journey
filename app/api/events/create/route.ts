import { NextRequest, NextResponse } from "next/server";
import {
  extractStoredTokens,
  getAuthorizedCalendar,
  getGoogleConfig,
  saveTokens,
} from "../../_lib/google";

function validatePayload(payload: any) {
  const errors: string[] = [];
  if (!payload) {
    errors.push("Payload is missing");
    return errors;
  }

  if (!payload.start) {
    errors.push("start is required");
  }
  if (!payload.end) {
    errors.push("end is required");
  }
  if (!payload.summary) {
    errors.push("summary is required");
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

  const config = getGoogleConfig();

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

    const stored = extractStoredTokens(authClient);
    if (stored) {
      saveTokens(config, stored);
    }

    return NextResponse.json({
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
    });
  } catch (error: any) {
    const status = error?.code || 500;
    const message = error instanceof Error ? error.message : "Unknown error";

    console.error("Event creation failed", message);

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
