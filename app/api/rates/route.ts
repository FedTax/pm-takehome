/**
 * POST /api/rates  — a stateless reference utility.
 *
 * Returns the raw sales tax rate breakdown for an address's state, with no
 * merchant involved. Handy for "what's the rate in X?" lookups. For an actual
 * sale, use POST /api/tax/calculate, which also honors whether the merchant is
 * registered to collect in that state.
 *
 * Example:
 *   curl -X POST http://localhost:3000/api/rates \
 *     -H "Authorization: Bearer demo_sk_taxrate_public" \
 *     -H "Content-Type: application/json" \
 *     -d '{"address":{"city":"San Francisco","state":"CA","zip":"94105"}}'
 */
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { combinedRate, lookupByState, supportedStates } from "@/lib/rates";

interface AddressPayload {
  line1?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export async function POST(req: NextRequest) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  let body: { address?: AddressPayload };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request", message: "Request body must be valid JSON." }, { status: 400 });
  }

  const address = body?.address;
  if (!address || typeof address !== "object") {
    return NextResponse.json(
      {
        error: "bad_request",
        message: 'Missing "address" object in request body.',
        example: { address: { line1: "1 Market St", city: "San Francisco", state: "CA", zip: "94105" } },
      },
      { status: 400 },
    );
  }

  const state = address.state;
  if (!state || typeof state !== "string") {
    return NextResponse.json(
      { error: "bad_request", message: 'Address is missing a "state" (two-letter code, e.g. "CA").' },
      { status: 400 },
    );
  }

  const rate = lookupByState(state);
  if (!rate) {
    return NextResponse.json(
      {
        error: "not_found",
        message: `No rate data for state "${state}". Supported: ${supportedStates().join(", ")}.`,
      },
      { status: 404 },
    );
  }

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
