/**
 * POST /api/rates  — the core product endpoint.
 *
 * Accepts an address payload and returns the sales tax rate breakdown for that
 * address's state. Requires an API key sent as a Bearer token.
 *
 * Example:
 *   curl -X POST http://localhost:3000/api/rates \
 *     -H "Authorization: Bearer demo_sk_taxrate_public" \
 *     -H "Content-Type: application/json" \
 *     -d '{"address":{"line1":"1 Market St","city":"San Francisco","state":"CA","zip":"94105"}}'
 */
import { NextRequest, NextResponse } from "next/server";
import { DEMO_API_KEY } from "@/lib/apiKey";
import { combinedRate, lookupByState, supportedStates } from "@/lib/rates";

interface AddressPayload {
  line1?: string;
  city?: string;
  state?: string;
  zip?: string;
}

function unauthorized(message: string) {
  return NextResponse.json({ error: "unauthorized", message }, { status: 401 });
}

function badRequest(message: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: "bad_request", message, ...extra }, { status: 400 });
}

/** Pull the Bearer token out of the Authorization header. */
function extractApiKey(req: NextRequest): string | null {
  const header = req.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

export async function POST(req: NextRequest) {
  // 1. Authenticate.
  const key = extractApiKey(req);
  if (!key) {
    return unauthorized("Missing API key. Send it as: Authorization: Bearer <key>");
  }
  if (key !== DEMO_API_KEY) {
    return unauthorized("Invalid API key.");
  }

  // 2. Parse the body.
  let body: { address?: AddressPayload };
  try {
    body = await req.json();
  } catch {
    return badRequest("Request body must be valid JSON.");
  }

  const address = body?.address;
  if (!address || typeof address !== "object") {
    return badRequest('Missing "address" object in request body.', {
      example: { address: { line1: "1 Market St", city: "San Francisco", state: "CA", zip: "94105" } },
    });
  }

  const state = address.state;
  if (!state || typeof state !== "string") {
    return badRequest('Address is missing a "state" (two-letter code, e.g. "CA").');
  }

  // 3. Look up the rate.
  const rate = lookupByState(state);
  if (!rate) {
    return NextResponse.json(
      {
        error: "not_found",
        message: `No rate data for state "${state}". Supported states: ${supportedStates().join(", ")}.`,
      },
      { status: 404 },
    );
  }

  // 4. Return the breakdown.
  return NextResponse.json({
    address: {
      line1: address.line1 ?? null,
      city: address.city ?? null,
      state: rate.state,
      zip: address.zip ?? null,
    },
    jurisdiction: rate.state_name,
    currency: "USD",
    rates: {
      state_rate: rate.state_rate,
      county_rate: rate.county_rate,
      city_rate: rate.city_rate,
      special_rate: rate.special_rate,
      combined_rate: combinedRate(rate),
    },
    // Percent form is handy for display; kept alongside the decimal form.
    combined_rate_percent: `${(combinedRate(rate) * 100).toFixed(3)}%`,
  });
}

/** Friendly 405 so a browser GET explains how to use the endpoint. */
export async function GET() {
  return NextResponse.json(
    {
      error: "method_not_allowed",
      message: "Use POST with a JSON address payload and a Bearer API key. See /docs.",
    },
    { status: 405, headers: { Allow: "POST" } },
  );
}
