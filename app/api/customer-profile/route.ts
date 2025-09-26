import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/db/client";

function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && value.includes("@") && value.trim().length > 3;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = body?.email;

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "email is required" },
      { status: 400 },
    );
  }

  const normalizedEmail = email.toLowerCase();

  try {
    const { data: profile, error } = await supabase
      .from("customer_profiles")
      .select("*")
      .eq("customer_email", normalizedEmail)
      .maybeSingle();

    if (error) {
      console.error("Failed to load customer profile", error);
    }

    if (profile) {
      return NextResponse.json(profile);
    }

    const { data: latestBooking, error: bookingError } = await supabase
      .from("bookings")
      .select("customer_name, customer_phone, session_type, metadata")
      .eq("customer_email", normalizedEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (bookingError) {
      console.error("Failed to load fallback booking", bookingError);
    }

    if (latestBooking) {
      return NextResponse.json({
        customer_name: latestBooking.customer_name,
        customer_phone: latestBooking.customer_phone,
        session_type: latestBooking.session_type,
        metadata: latestBooking.metadata,
      });
    }

    return NextResponse.json(null);
  } catch (error) {
    console.error("Unexpected error loading profile", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}
