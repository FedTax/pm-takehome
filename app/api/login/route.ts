/**
 * POST /api/login  — sets the demo session cookie if the password matches.
 * Body: { "password": "..." }
 */
import { NextRequest, NextResponse } from "next/server";
import { isValidPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request", message: "Invalid JSON." }, { status: 400 });
  }

  if (!isValidPassword(body?.password ?? "")) {
    return NextResponse.json(
      { error: "unauthorized", message: "Incorrect password." },
      { status: 401 },
    );
  }

  await createSession();
  return NextResponse.json({ ok: true });
}
