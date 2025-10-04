import { NextRequest, NextResponse } from "next/server";

import { getCustomerProfile } from "../_lib/memory-db";

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
  const profile = getCustomerProfile(normalizedEmail);

  return NextResponse.json(profile);
}
