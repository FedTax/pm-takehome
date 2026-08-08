/**
 * Shared API-key check used by every product endpoint.
 *
 * Returns an error `NextResponse` if the request is not authenticated, or null
 * if it is. Usage in a route handler:
 *
 *   const denied = requireApiKey(req);
 *   if (denied) return denied;
 */
import { NextRequest, NextResponse } from "next/server";
import { DEMO_API_KEY } from "./apiKey";

/** Pull the Bearer token out of the Authorization header. */
export function extractApiKey(req: NextRequest): string | null {
  const header = req.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

export function requireApiKey(req: NextRequest): NextResponse | null {
  const key = extractApiKey(req);
  if (!key) {
    return NextResponse.json(
      { error: "unauthorized", message: "Missing API key. Send it as: Authorization: Bearer <key>" },
      { status: 401 },
    );
  }
  if (key !== DEMO_API_KEY) {
    return NextResponse.json({ error: "unauthorized", message: "Invalid API key." }, { status: 401 });
  }
  return null;
}
