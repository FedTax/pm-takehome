# The Assignment

**Role:** Product Manager, API & Platform
**Timebox:** ~3–4 hours
**Tools:** This repo + Claude Code (see the [README](../README.md) for setup)

You've inherited **TaxRate**, a small sales tax rate API with a marketing site, docs, pricing,
and a dashboard. It works. Your job is to prototype two product improvements and explain your
thinking. Treat Claude Code as your engineer: you decide *what* and *why*, and drive it to
build the *how*.

There is no single right answer. We're evaluating product judgment, how you scope under a
time limit, and how well you use AI to turn an idea into something real.

---

## Context you need

- Today there is **no free product.** Every new account starts a **30-day free trial of the
  Basic plan** ($20/mo). When the trial ends, they must pick a paid plan (Basic $20, Premium
  $100) to keep calling the API. You can see this on `/pricing` and `/dashboard`.
- The product is developer-facing: the "customer" is someone deciding whether to wire this API
  into their store or app.
- The landing page (`/`) is where a first-time visitor lands. It has a working but plain "Try
  it live" widget.

---

## Goal 1 — Replace the trial with a Free tier (freemium)

Prototype what it looks and feels like to offer a **permanent free tier** instead of a
time-boxed trial.

**Think through (and cover in your write-up):**
- What's *in* the free tier vs. Basic vs. Premium? Where's the line that makes free genuinely
  useful but creates a real reason to upgrade? (Request volume? States? Features? Support?)
- What does a free user *see* — on the pricing page, and in the dashboard where the trial
  countdown lives today? What replaces the "23 days left → upgrade" pressure?
- How does someone move from free to paid? What's the upgrade trigger and moment?
- Why is freemium the right call here (or where would you push back)? What's the risk?

**Build:** Enough of the experience to make it tangible — the pricing page and the dashboard
state are the two obvious surfaces. You don't need real billing or real usage metering; fake
data and hardcoded state are fine.

**Starting points:** `lib/plans.ts`, `app/pricing/page.tsx`, `app/dashboard/page.tsx`
(search for `📌 GOAL 1`).

---

## Goal 2 — Get to the "Aha" moment fast

On the landing page, prototype an **interactive experience** that gets a first-time visitor to
the "oh, I get it — I want this" moment as quickly as possible.

The current "Try it live" widget (`app/components/ApiPlayground.tsx`) technically works: pick a
state, get raw JSON. But raw JSON is not an "aha." Your job is to design something better.

**Think through (and cover in your write-up):**
- For this product, what *is* the aha moment? What does the visitor need to feel or see?
- What's the single fastest path to it — fewest clicks, least typing, zero setup?
- How do you show *value*, not just a response? (A tax amount on a real order? A code snippet
  they can copy? Something that maps to their actual use case?)
- What makes them want to sign up in the next 10 seconds?

**Build:** Rework the landing-page experience. You can rewrite the widget entirely. Keep it
real — it should hit the live `/api/rates` endpoint.

**Starting point:** `app/components/ApiPlayground.tsx` and `app/page.tsx` (search for
`📌 GOAL 2`).

---

## What we're evaluating

| We look for | What that means here |
| --- | --- |
| **Product judgment** | Sensible tier boundaries, a clear aha, decisions you can defend. |
| **Scoping** | You did the *right* 3–4 hours of work, not the most. |
| **User empathy** | You designed for the developer evaluating this API, not for yourself. |
| **Driving AI** | You got Claude Code to build what you intended, and caught it when it drifted. |
| **Communication** | Your write-up makes the "why" obvious and honest about tradeoffs. |

## What we are NOT evaluating

- Pixel-perfect design or clean code architecture.
- Real payments, real auth, real usage metering, or a real database.
- Handling every edge case. Prototype quality is expected.
- Whether you personally wrote any code. Using AI fully is the point.

---

## Tips for working with Claude Code

- Start by asking it to give you a tour: *"Explain how this app is structured and where the
  trial logic lives."* Understand before you change.
- Work in small steps and look at the result in the browser after each one.
- Be specific about product intent, not just mechanics: *"Free users should never see a
  countdown; instead show their remaining monthly requests and a soft nudge when they're
  close."*
- When it goes the wrong direction, say so and steer. That back-and-forth is exactly the skill
  we're interested in.
- Keep notes as you go — they'll make the write-up easy.

Questions about setup only: email your hiring contact. Questions about the product decisions:
those are yours to make. Have fun.
