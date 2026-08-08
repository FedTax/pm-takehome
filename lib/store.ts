/**
 * In-memory data store for merchants and their state-collection settings.
 *
 * There is no database. Data lives in a Map for the life of the dev server and
 * RESETS when you restart it. That is fine for a prototype — it keeps setup to
 * zero. It is cached on `globalThis` so it survives Next.js hot-reloads while
 * you're developing.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * Domain model (see /docs for the full explainer):
 *   - Platform  = you, the developer using this API.
 *   - Merchant  = one of your platform's sellers. You manage these via the API.
 *   - Collection = the set of states a merchant is registered to collect tax in.
 *                  Tax is only charged in states the merchant has turned ON.
 * ───────────────────────────────────────────────────────────────────────────
 */
import "server-only";
import { isSupportedState, supportedStates } from "./rates";

/** Fixed id for the seeded demo merchant, referenced by the docs and README. */
const DEMO_MERCHANT_ID = "mch_demo_coffee";

export interface Address {
  line1: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}

export interface Merchant {
  id: string;
  name: string;
  email: string | null;
  /** The merchant's business address (their origin / where they're based). */
  address: Address;
  /** State codes this merchant is registered to collect tax in. */
  collecting: string[];
  created_at: string;
}

// Cache the Map on globalThis so hot-reload in `npm run dev` doesn't wipe it.
const g = globalThis as unknown as { __taxrateMerchants?: Map<string, Merchant> };
const merchants: Map<string, Merchant> = g.__taxrateMerchants ?? (g.__taxrateMerchants = new Map());

/** Seed a couple of example merchants the first time the store is created. */
function seed() {
  if (merchants.size > 0) return;
  const now = "2026-01-15T00:00:00.000Z"; // fixed so demo data looks stable
  merchants.set(DEMO_MERCHANT_ID, {
    id: DEMO_MERCHANT_ID,
    name: "Blue Bottle Coffee",
    email: "ap@bluebottle.example",
    address: { line1: "1 Ferry Building", city: "San Francisco", state: "CA", zip: "94111" },
    collecting: ["CA", "NY", "WA"],
    created_at: now,
  });
  merchants.set("mch_demo_goods", {
    id: "mch_demo_goods",
    name: "Lone Star Goods",
    email: "billing@lonestar.example",
    address: { line1: "500 Congress Ave", city: "Austin", state: "TX", zip: "78701" },
    collecting: ["TX"],
    created_at: now,
  });
}
seed();

function normalizeAddress(input: Partial<Address> | undefined): Address {
  return {
    line1: input?.line1 ?? null,
    city: input?.city ?? null,
    state: input?.state ? input.state.toUpperCase() : null,
    zip: input?.zip ?? null,
  };
}

/** Short, random-ish id. Runtime-only randomness is fine here. */
function newId(): string {
  return "mch_" + Math.random().toString(36).slice(2, 10);
}

// ── Merchant CRUD ──────────────────────────────────────────────────────────

export function listMerchants(): Merchant[] {
  return Array.from(merchants.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getMerchant(id: string): Merchant | null {
  return merchants.get(id) ?? null;
}

export interface MerchantInput {
  name?: string;
  email?: string | null;
  address?: Partial<Address>;
  collecting?: string[];
}

export function createMerchant(input: MerchantInput): Merchant {
  const merchant: Merchant = {
    id: newId(),
    name: (input.name ?? "").trim(),
    email: input.email ?? null,
    address: normalizeAddress(input.address),
    collecting: dedupeStates(input.collecting ?? []),
    created_at: new Date().toISOString(),
  };
  merchants.set(merchant.id, merchant);
  return merchant;
}

export function updateMerchant(id: string, patch: MerchantInput): Merchant | null {
  const existing = merchants.get(id);
  if (!existing) return null;
  const updated: Merchant = {
    ...existing,
    name: patch.name !== undefined ? patch.name.trim() : existing.name,
    email: patch.email !== undefined ? patch.email : existing.email,
    address: patch.address ? normalizeAddress({ ...existing.address, ...patch.address }) : existing.address,
    collecting: patch.collecting !== undefined ? dedupeStates(patch.collecting) : existing.collecting,
  };
  merchants.set(id, updated);
  return updated;
}

export function deleteMerchant(id: string): boolean {
  return merchants.delete(id);
}

// ── Collection settings (states on/off) ─────────────────────────────────────

export interface CollectionRow {
  state: string;
  collecting: boolean;
}

/** Every supported state with a flag for whether this merchant collects there. */
export function listCollection(merchant: Merchant): CollectionRow[] {
  const on = new Set(merchant.collecting);
  return supportedStates().map((state) => ({ state, collecting: on.has(state) }));
}

/** Turn a state on or off for a merchant. Returns the updated merchant, or null. */
export function setCollection(id: string, state: string, collecting: boolean): Merchant | null {
  const merchant = merchants.get(id);
  if (!merchant) return null;
  const code = state.toUpperCase();
  const set = new Set(merchant.collecting);
  if (collecting) set.add(code);
  else set.delete(code);
  merchant.collecting = dedupeStates(Array.from(set));
  merchants.set(id, merchant);
  return merchant;
}

export function isCollecting(merchant: Merchant, state: string): boolean {
  return merchant.collecting.includes(state.toUpperCase());
}

// ── helpers ──────────────────────────────────────────────────────────────

/** Uppercase, keep only supported states, dedupe, sort. */
export function dedupeStates(states: string[]): string[] {
  const clean = states
    .map((s) => s.toUpperCase())
    .filter((s) => isSupportedState(s));
  return Array.from(new Set(clean)).sort();
}
