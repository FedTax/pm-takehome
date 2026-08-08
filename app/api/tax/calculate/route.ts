/**
 * POST /api/tax/calculate  — the endpoint that ties everything together.
 *
 * Given a merchant and a sale (an amount + a ship-to address), return the tax
 * to collect. The key behavior: tax is only charged if the merchant is
 * registered to collect in the ship-to state. If they're not, tax is $0 and
 * `collecting` is false. Turning that state on (see /api/merchants/:id/states)
 * changes the result. That's the whole point of the platform model.
 *
 * Example:
 *   curl -X POST http://localhost:3000/api/tax/calculate \
 *     -H "Authorization: Bearer demo_sk_taxrate_public" \
 *     -H "Content-Type: application/json" \
 *     -d '{"merchant_id":"mch_demo_coffee","amount":100,"ship_to":{"state":"CA"}}'
 */
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { getMerchant, isCollecting } from "@/lib/store";
import { combinedRate, lookupByState } from "@/lib/rates";

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export async function POST(req: NextRequest) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  let body: { merchant_id?: string; amount?: number; currency?: string; ship_to?: { state?: string } };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request", message: "Body must be valid JSON." }, { status: 400 });
  }

  const merchant = body.merchant_id ? getMerchant(body.merchant_id) : null;
  if (!merchant) {
    return NextResponse.json(
      { error: "not_found", message: `Unknown merchant_id "${body.merchant_id ?? ""}". Create one at POST /api/merchants.` },
      { status: 404 },
    );
  }

  const amount = Number(body.amount);
  if (!isFinite(amount) || amount < 0) {
    return NextResponse.json(
      { error: "bad_request", message: 'An "amount" (order subtotal, a non-negative number) is required.' },
      { status: 400 },
    );
  }

  const stateCode = body.ship_to?.state;
  const rate = stateCode ? lookupByState(stateCode) : null;
  if (!rate) {
    return NextResponse.json(
      { error: "bad_request", message: 'A valid "ship_to.state" (two-letter code) is required.' },
      { status: 400 },
    );
  }

  const collecting = isCollecting(merchant, rate.state);
  const combined = combinedRate(rate);
  const taxAmount = collecting ? round2(amount * combined) : 0;

  return NextResponse.json({
    object: "tax_calculation",
    merchant_id: merchant.id,
    currency: body.currency ?? "USD",
    ship_to_state: rate.state,
    jurisdiction: rate.state_name,
    // Was the merchant registered to collect here? This is the deciding factor.
    collecting,
    taxable_amount: round2(amount),
    rate: {
      state_rate: rate.state_rate,
      county_rate: rate.county_rate,
      city_rate: rate.city_rate,
      special_rate: rate.special_rate,
      combined_rate: combined,
    },
    // Rate actually applied: 0 when the merchant isn't collecting in this state.
    applied_rate: collecting ? combined : 0,
    tax_amount: taxAmount,
    total: round2(amount + taxAmount),
    note: collecting
      ? null
      : `${merchant.name} is not registered to collect tax in ${rate.state}. Turn it on: PUT /api/merchants/${merchant.id}/states/${rate.state}`,
  });
}
