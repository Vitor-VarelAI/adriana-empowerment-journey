import { NextRequest, NextResponse } from "next/server";

const message = "Analytics dashboard indisponível: armazenamento Supabase removido.";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("x-admin-secret");
  const expectedSecret = process.env.ADMIN_ANALYTICS_SECRET;

  if (expectedSecret && authHeader !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ error: message }, { status: 501 });
}

export async function POST(request: NextRequest) {
  return GET(request);
}
