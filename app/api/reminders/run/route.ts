import { NextRequest, NextResponse } from "next/server";

const message = "Reminder automation desativada: não há base de dados configurada.";

export async function POST(_request: NextRequest) {
  return NextResponse.json({ error: message }, { status: 501 });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
