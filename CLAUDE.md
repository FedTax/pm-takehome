# CLAUDE.md

Context for AI agents working in this repo. Humans: read [`README.md`](README.md) and
[`docs/ASSIGNMENT.md`](docs/ASSIGNMENT.md) first.

## What this is

**TaxRate**, a demo **sales tax API for platforms**, with a Next.js marketing site, docs,
pricing, login, and dashboard. A "platform" is a company whose business customers
(**merchants**) sell through it. The API lets the platform manage merchants, control which
states each merchant collects tax in, and calculate tax for a sale.

This is the scaffold for a **PM take-home assignment**. The person you're helping is a product
manager prototyping two changes (see `docs/ASSIGNMENT.md`):

1. **Freemium** — replace the 30-day Basic trial with a permanent Free tier.
2. **Developer onboarding** — prototype an onboarding experience that gets a developer set up
   (create merchants, turn on states, run a calculation) and to the "aha" fast.

Help them make and build product decisions. Don't make the product calls for them — offer
options and tradeoffs, then build what they choose.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS. No database — merchant data
lives in an in-memory store (`lib/store.ts`) that resets on server restart; session/trial state
is in cookies.

## Domain model

- **Platform** = the developer using the API (authenticates with one API key).
- **Merchant** = one of the platform's sellers. Full CRUD.
- **Collection settings** = the states a merchant is registered to collect in (on/off per state).
- **Calculation** = tax for a sale; returns $0 in states the merchant has not turned on.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # type-check + production build
```

Login password: `letmein`. Public demo API key: `demo_sk_taxrate_public`.
Seeded demo merchant: `mch_demo_coffee` (collects in CA, NY, WA).

## Map

- `app/api/merchants/route.ts` — list + create merchants.
- `app/api/merchants/[id]/route.ts` — retrieve / update / delete a merchant.
- `app/api/merchants/[id]/states/route.ts` — list a merchant's state on/off flags.
- `app/api/merchants/[id]/states/[state]/route.ts` — turn one state on/off.
- `app/api/tax/calculate/route.ts` — the endpoint that ties it together (honors collection).
- `app/api/rates/route.ts` — stateless rate lookup utility.
- `lib/store.ts` — in-memory merchants + collection store (seeded).
- `lib/rates.ts` — hardcoded rate data for all 50 states + DC.
- `lib/plans.ts` — plan + trial definitions. **(Goal 1)**
- `app/pricing/page.tsx` — pricing + trial. **(Goal 1)**
- `app/dashboard/page.tsx` — dev console: onboarding stub **(Goal 2)** + trial card **(Goal 1)** + merchants.
- `app/components/LiveDemo.tsx`, `app/page.tsx` — landing page + live calculate demo.
- `lib/session.ts`, `lib/auth.ts`, `lib/apiAuth.ts` — cookie session, password, API-key check.

Search the codebase for `📌 GOAL` to find the exact starting points.

## Conventions

- Keep it simple. This is a prototype; fake data and in-memory/hardcoded state are expected.
- Files are small and heavily commented on purpose — match that style.
- After a change, verify in the browser at http://localhost:3000.
