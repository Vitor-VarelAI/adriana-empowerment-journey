import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/db/client";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("x-admin-secret");
  const expectedSecret = process.env.ADMIN_ANALYTICS_SECRET;

  if (expectedSecret && authHeader !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [noShow, reminders, slots] = await Promise.all([
    supabase.from("vw_booking_no_show_rate").select("*").limit(30),
    supabase.from("vw_reminder_effectiveness").select("*"),
    supabase.from("vw_slot_utilization").select("*").limit(50),
  ]);

  if (noShow.error || reminders.error || slots.error) {
    console.error("Analytics overview query failed", {
      noShowError: noShow.error,
      reminderError: reminders.error,
      slotError: slots.error,
    });
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }

  return NextResponse.json({
    noShowRate: noShow.data ?? [],
    reminderEffectiveness: reminders.data ?? [],
    slotUtilization: slots.data ?? [],
  });
}

export async function POST(request: NextRequest) {
  return GET(request);
}
