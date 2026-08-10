# The Assignment

**Role:** Product Manager, API & Platform
**Timebox:** ~3–4 hours
**Tools:** This repo + an agentic coding tool of your choice (see the [README](../README.md) for setup)

You've inherited **TaxRate**, a sales tax API for platforms, with a marketing site, docs,
pricing, and a dashboard. It works. Your job is to prototype two product improvements and
explain your thinking. Treat your coding agent as your engineer: you decide *what* and *why*, and
drive it to build the *how*.

There is no single right answer. We're evaluating product judgment, how you scope under a time
limit, and how well you use AI to turn an idea into something real.

**Deliverable:** a screen-recorded video demo, **5 minutes or less**, walking through both
prototypes. We do not review code. Keep it a quick overview — the detailed walkthrough of your
decisions happens live in the next interview. Full details in the
[README](../README.md#6-submitting).

---

## The product, in one minute

TaxRate is sold to **platforms** — companies whose business customers sell through them (a
storefront builder, a marketplace, an invoicing tool). Those customers are **merchants**.

The API gives a platform three things:
- **Merchants** — create and manage each seller (`/api/merchants`).
- **Collection settings** — turn on the states each merchant is registered to collect tax in
  (`/api/merchants/:id/states`). A merchant owes tax only where it is turned on.
- **Calculation** — for a sale, send a merchant + a ship-to address and get the tax back
  (`/api/tax/calculate`). It returns $0 in states the merchant has not turned on.

Read `/docs` in the running app (the Workflow section walks the three calls end to end) and try
the endpoints yourself to feel how it fits together. There is a seeded merchant,
`mch_demo_coffee`, that collects in CA, NY, and WA.

---

## Goal 1 — Replace the trial with a Free tier (freemium)

Prototype what it looks and feels like to offer a **permanent free tier** instead of a
time-boxed trial.

Today every new account starts a **30-day free trial of Basic** ($20/mo). When it ends, the
platform must pick a paid plan (Basic $20, Premium $100) to keep calling the API. You can see
this on `/pricing` and `/dashboard`.

**Think through (touch on it in the demo, and be ready to go deeper in the interview):**
- What's *in* the free tier vs. Basic vs. Premium? Where's the line that makes free genuinely
  useful but creates a real reason to upgrade? (Number of merchants? Calculations per month?
  States? Support?)
- What does a free user *see* — on the pricing page, and in the dashboard where the trial
  countdown lives today? What replaces the "23 days left → upgrade" pressure?
- How does someone move from free to paid? What's the upgrade trigger and moment?
- Why is freemium the right call here (or where would you push back)? What's the risk?

**Build:** Enough of the experience to make it tangible — the pricing page and the dashboard
state are the two obvious surfaces. No real billing or metering needed; hardcoded state is fine.

**Starting points:** `lib/plans.ts`, `app/pricing/page.tsx`, `app/dashboard/page.tsx`
(search for `📌 GOAL 1`).

---

## Goal 2 — Prototype the developer onboarding experience

A developer just signed up and landed in the dashboard. Right now there is a placeholder
"Getting started" card that does nothing. Your job is to design and build the **onboarding
experience** that gets that developer from "I have an API key" to their **first successful tax
calculation** — the moment the product clicks.

For this platform API, the "aha" is roughly: *"I created a merchant, turned on a state, ran a
calculation, and got real tax back — and I can see it would be $0 if I hadn't turned that state
on."* Your onboarding should make a developer feel that as fast as possible.

**Think through (touch on it in the demo, and be ready to go deeper in the interview):**
- What is the shortest credible path to that first calculation? What is the very first step?
- Where should onboarding live and what form should it take — a guided checklist, an
  interactive setup wizard, copy-paste code that runs against live results, seeded example data,
  something else? Why that shape for a *developer* audience?
- How do you show progress and make success obvious and rewarding?
- What would make them keep going (add more merchants, integrate for real) vs. drop off?

**Build:** A working onboarding prototype. It can drive the real API (create merchants, toggle
states, calculate), reflect real state from the dashboard, or guide the developer through doing
it themselves — your call. You can build it in the dashboard, as its own route/flow, or wherever
a developer would actually experience it. The placeholder card is only a starting point; feel
free to replace it entirely.

**Starting points:** `app/dashboard/page.tsx` (the stub, `📌 GOAL 2`), the API routes under
`app/api/`, and `lib/store.ts` for the data model.

---

## What we're evaluating

| We look for | What that means here |
| --- | --- |
| **Product judgment** | Sensible tier boundaries; an onboarding path that respects a developer's time. |
| **Scoping** | You did the *right* 3–4 hours of work, not the most. |
| **User empathy** | You designed for the developer integrating this API, not for yourself. |
| **Driving AI** | You got your coding agent to build what you intended, and caught it when it drifted. |
| **Communication** | Your demo makes the "why" obvious and is honest about tradeoffs. |

## What we are NOT evaluating

- Pixel-perfect design or clean code architecture.
- Real payments, real auth, real usage metering, or a real database.
- Handling every edge case. Prototype quality is expected.
- Whether you personally wrote any code. Using AI fully is the point.

---

Questions about setup only: email your hiring contact. Questions about the product decisions:
those are yours to make. Have fun.
