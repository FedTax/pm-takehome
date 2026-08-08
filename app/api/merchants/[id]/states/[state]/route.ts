/**
 * /api/merchants/:id/states/:state  — one state's collection setting.
 *   GET     is this merchant collecting in this state?
 *   PUT     turn collection on/off. Body: { "collecting": true|false }.
 *           (Sending no body defaults to turning it ON.)
 *   DELETE  turn collection off (shortcut for PUT { collecting: false }).
 */
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { getMerchant, isCollecting, setCollection } from "@/lib/store";
import { isSupportedState, lookupByState } from "@/lib/rates";

type Ctx = { params: Promise<{ id: string; state: string }> };

function stateResponse(merchantId: string, state: string, collecting: boolean) {
  const rate = lookupByState(state);
  return NextResponse.json({
    object: "collection_setting",
    merchant_id: merchantId,
    state: state.toUpperCase(),
    state_name: rate?.state_name ?? null,
    collecting,
  });
}

async function guard(req: NextRequest, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return { error: denied };
  const { id, state } = await ctx.params;
  if (!getMerchant(id)) {
    return { error: NextResponse.json({ error: "not_found", message: `No merchant with id "${id}".` }, { status: 404 }) };
  }
  if (!isSupportedState(state)) {
    return {
      error: NextResponse.json(
        { error: "bad_request", message: `"${state}" is not a supported state code.` },
        { status: 400 },
      ),
    };
  }
  return { id, state };
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const g = await guard(req, ctx);
  if (g.error) return g.error;
  const merchant = getMerchant(g.id!)!;
  return stateResponse(g.id!, g.state!, isCollecting(merchant, g.state!));
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const g = await guard(req, ctx);
  if (g.error) return g.error;

  // Default to turning ON if no/invalid body is sent.
  let collecting = true;
  try {
    const body = await req.json();
    if (typeof body?.collecting === "boolean") collecting = body.collecting;
  } catch {
    // no body — keep default (on)
  }

  setCollection(g.id!, g.state!, collecting);
  return stateResponse(g.id!, g.state!, collecting);
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const g = await guard(req, ctx);
  if (g.error) return g.error;
  setCollection(g.id!, g.state!, false);
  return stateResponse(g.id!, g.state!, false);
}
