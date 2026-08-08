# CLAUDE.md

Context for AI agents working in this repo. Humans: read [`README.md`](README.md) and
[`docs/ASSIGNMENT.md`](docs/ASSIGNMENT.md) first.

## What this is

**TaxRate**, a demo sales tax rate lookup API with a Next.js marketing site, docs, pricing,
login, and dashboard. It is the scaffold for a **PM take-home assignment**. The person you're
helping is a product manager prototyping two changes (see `docs/ASSIGNMENT.md`):

1. Replace the 30-day Basic **trial** with a permanent **Free tier** (freemium).
2. Turn the landing page's "Try it live" widget into an **interactive "aha" experience**.

Help them make and build product decisions. Don't make the product calls for them — offer
options and tradeoffs, then build what they choose.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS. No database — state is
hardcoded or stored in cookies.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # type-check + production build
```

Login password: `letmein`. Public demo API key: `demo_sk_taxrate_public`.

## Map

- `app/api/rates/route.ts` — the product: the rate lookup endpoint.
- `lib/rates.ts` — hardcoded rate data by state.
- `lib/plans.ts` — plan + trial definitions. **(Goal 1)**
- `app/pricing/page.tsx`, `app/dashboard/page.tsx` — where plan/trial state is shown. **(Goal 1)**
- `app/components/ApiPlayground.tsx`, `app/page.tsx` — the landing experience. **(Goal 2)**
- `lib/session.ts`, `lib/auth.ts` — cookie session + hardcoded password.

Search the codebase for `📌 GOAL` to find the exact starting points.

## Conventions

- Keep it simple. This is a prototype; fake data and hardcoded state are expected and fine.
- Files are small and heavily commented on purpose — match that style.
- After a change, verify in the browser at http://localhost:3000.
