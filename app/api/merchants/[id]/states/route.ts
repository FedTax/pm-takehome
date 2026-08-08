/**
 * /api/merchants/:id/states  — the merchant's collection settings.
 *   GET  list every supported state with a flag for whether this merchant
 *        collects tax there.
 *
 * To turn a single state on/off, use /api/merchants/:id/states/:state.
 */
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { getMerchant, listCollection } from "@/lib/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const { id } = await ctx.params;
  const merchant = getMerchant(id);
  if (!merchant) {
    return NextResponse.json(
      { error: "not_found", message: `No merchant with id "${id}".` },
      { status: 404 },
    );
  }

  const states = listCollection(merchant);
  return NextResponse.json({
    object: "list",
    merchant_id: id,
    collecting_count: merchant.collecting.length,
    data: states,
  });
}
