/**
 * /api/merchants/:id  — single merchant resource.
 *   GET     retrieve
 *   PATCH   update (name, email, address, collecting)
 *   DELETE  remove
 */
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { deleteMerchant, getMerchant, updateMerchant } from "@/lib/store";

type Ctx = { params: Promise<{ id: string }> };

function notFound(id: string) {
  return NextResponse.json(
    { error: "not_found", message: `No merchant with id "${id}".` },
    { status: 404 },
  );
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const { id } = await ctx.params;
  const merchant = getMerchant(id);
  if (!merchant) return notFound(id);
  return NextResponse.json(merchant);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const { id } = await ctx.params;
  if (!getMerchant(id)) return notFound(id);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request", message: "Body must be valid JSON." }, { status: 400 });
  }

  const updated = updateMerchant(id, {
    name: typeof body.name === "string" ? body.name : undefined,
    email: body.email === null || typeof body.email === "string" ? (body.email as string | null) : undefined,
    address: (body.address as Record<string, string>) ?? undefined,
    collecting: Array.isArray(body.collecting) ? (body.collecting as string[]) : undefined,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const { id } = await ctx.params;
  if (!deleteMerchant(id)) return notFound(id);
  return NextResponse.json({ object: "merchant", id, deleted: true });
}
