/**
 * /api/merchants  — collection resource.
 *   GET   list all merchants
 *   POST  create a merchant
 *
 * A "merchant" is one of your platform's sellers. See /docs for the model.
 */
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "@/lib/apiAuth";
import { createMerchant, listMerchants } from "@/lib/store";

export async function GET(req: NextRequest) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const data = listMerchants();
  return NextResponse.json({ object: "list", count: data.length, data });
}

export async function POST(req: NextRequest) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  let body: { name?: string; email?: string; address?: unknown; collecting?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request", message: "Body must be valid JSON." }, { status: 400 });
  }

  if (!body?.name || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json(
      {
        error: "bad_request",
        message: 'A merchant "name" is required.',
        example: { name: "Acme Roasters", email: "ap@acme.example", address: { state: "CA" }, collecting: ["CA"] },
      },
      { status: 400 },
    );
  }

  const merchant = createMerchant({
    name: body.name,
    email: typeof body.email === "string" ? body.email : null,
    address: (body.address as Record<string, string>) ?? undefined,
    collecting: Array.isArray(body.collecting) ? (body.collecting as string[]) : [],
  });

  return NextResponse.json(merchant, { status: 201 });
}
