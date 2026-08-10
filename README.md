# TaxRate — PM Take-Home

Welcome, and thanks for taking the time. This is a small but real full-stack app: a
**sales tax API for platforms** with a marketing site, docs, pricing, and a logged-in
dashboard. Your job is to extend it using an **agentic coding tool** — Claude Code, or any
other you like, as long as you can point it at our gateway ([§2](#2-point-your-coding-tool-at-our-gateway)).
You will work the same way you would prototype with engineering in the role.

The product: a "platform" (think a storefront builder or marketplace) has business customers
called **merchants**. The API lets the platform manage merchants, control which states each
merchant collects sales tax in, and calculate the tax for any sale. See `/docs` in the running
app for the full explainer.

You do not need to be an engineer. You need to be able to describe what you want, drive an
AI agent to build it, and make good product decisions along the way. The code is small and
heavily commented so you can find your way around.

---

## What you'll build

Two prototypes, plus a short plan. The full brief is in
**[`docs/ASSIGNMENT.md`](docs/ASSIGNMENT.md)** — read it first. In short:

1. **Freemium.** Today every new account gets a 30-day *trial* of the Basic plan, then hits a
   paywall. Prototype replacing that trial with a permanent **Free tier**. Show what the
   experience looks and feels like, and explain *why* you designed it that way.
2. **Developer onboarding.** Prototype an onboarding experience that gets a *developer* set up
   and to the "aha" as fast as possible: create their first merchants, turn on the states they
   collect in, and see a real tax calculation come back. What should that first-run experience
   look and feel like?
3. **Customer-interview plan.** A one-pager for taking the onboarding to a real customer: the
   goal of the interview and the questions you'd ask.

We care more about product judgment and how you use AI than about polished code. In fact, we
won't look at your code at all — you'll show us your work in a short video demo (see
[§6 Submitting](#6-submitting)). Use AI heavily, but the thinking, opinions, and taste need to
be **yours** — leaning on it for everything without your own input is a failure.

---

## 1. Prerequisites

- **Node.js 20+** and npm (check with `node --version`).
- **An agentic coding tool of your choice.** Use whatever you are most productive in. The only
  requirement is that you can point it at our gateway (see [§2](#2-point-your-coding-tool-at-our-gateway)).
  If you do not have a preference, [Claude Code](https://docs.claude.com/en/docs/claude-code) is
  a simple default — install it with `npm install -g @anthropic-ai/claude-code`. Prefer not to
  install anything locally? See [§5 Sandbox](#5-optional-run-it-in-a-sandbox).

---

## 2. Point your coding tool at our gateway

We'll send you a **gateway URL** and an **API key** separately. The gateway is
Anthropic-API-compatible and routes to the model for you, so you don't need your own Anthropic
account. Whatever tool you use, you are giving it the same two values:

- **Base URL** — the gateway URL we send you.
- **Auth** — the API key we send you (sent as a Bearer token).

> **Please note:** because your tool routes through our gateway, your session there — the
> prompts you write and how you steer the agent — is logged, and we review it as part of
> assessing this take-home. How you drive AI is one of the things we're evaluating, so there's
> nothing to do differently here — just work naturally.

**Any tool (environment variables).** Most agentic coding tools read these standard variables.
Set them before launching your tool from the repo:

```bash
export ANTHROPIC_BASE_URL="https://the-gateway-url-we-send-you"
export ANTHROPIC_AUTH_TOKEN="the-api-key-we-send-you"
```

If your tool expects the key as an `x-api-key` header rather than a Bearer token, use
`ANTHROPIC_API_KEY` in place of `ANTHROPIC_AUTH_TOKEN`. If your tool has its own settings UI for
a custom Anthropic-compatible endpoint, enter the same base URL and key there — check your
tool's docs for where.

**Claude Code specifically.** The env vars above work, or you can use a project settings file:

```bash
cp .claude/settings.example.json .claude/settings.local.json
```

Then edit `.claude/settings.local.json` with the two values (it is gitignored, so your key
never gets committed):

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://the-gateway-url-we-send-you",
    "ANTHROPIC_AUTH_TOKEN": "the-api-key-we-send-you"
  }
}
```

**Verify it works.** Launch your tool and send a quick test prompt ("say hello"). If it
responds, you're set. (In Claude Code, `/status` also shows the configured gateway URL.) A
`401` means the key or header type is wrong — try `ANTHROPIC_API_KEY` vs `ANTHROPIC_AUTH_TOKEN`.

---

## 3. Run the app

> **Recommended: let your AI tool set this up for you.** Once it's connected to the gateway
> (§2), give it this prompt: *"Read `SETUP.md` and follow it to install dependencies and start
> the app, then tell me the local URL and confirm it's working."* It will handle the steps below.
>
> Prefer to do it by hand, or want a step-by-step guide with troubleshooting? See
> **[`SETUP.md`](SETUP.md)**. The short version:

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

| Thing | Value |
| --- | --- |
| Login password (at `/login`) | `letmein` |
| Public demo API key | `demo_sk_taxrate_public` |
| Seeded demo merchant | `mch_demo_coffee` (collects in CA, NY, WA) |

Both defaults can be changed via a `.env.local` file — see [`.env.example`](.env.example). You
don't need to.

Try the API directly — calculate tax for the seeded merchant (collects in CA, so tax is
charged; try `"state":"TX"` and it comes back $0 because that state is off):

```bash
curl -X POST http://localhost:3000/api/tax/calculate \
  -H "Authorization: Bearer demo_sk_taxrate_public" \
  -H "Content-Type: application/json" \
  -d '{"merchant_id":"mch_demo_coffee","amount":100,"ship_to":{"state":"CA"}}'
```

> The merchant store is in-memory: any merchants you create reset when you restart the dev
> server. That is intentional — no database to set up.

---

## 4. What's in the app

### Pages

| Page | Path | What it is |
| --- | --- | --- |
| Landing | `/` | Hero and a concepts explainer. |
| API Docs | `/docs` | Concepts, a common-workflow guide, and a reference for every endpoint. |
| Pricing | `/pricing` | Two paid plans (Basic $20/mo, Premium $100/mo) + the trial. **Goal 1 touches here.** |
| Login | `/login` | Hardcoded-password sign-in. |
| Dashboard | `/dashboard` | Dev console: onboarding stub **(Goal 2)**, trial card **(Goal 1)**, API key, merchants. |

### The API

| Endpoint | What it does |
| --- | --- |
| `GET/POST /api/merchants` | List / create merchants (your platform's sellers). |
| `GET/PATCH/DELETE /api/merchants/:id` | Retrieve / update / delete a merchant. |
| `GET /api/merchants/:id/states` | List a merchant's per-state collection flags. |
| `GET/PUT/DELETE /api/merchants/:id/states/:state` | Turn one state on/off for a merchant. |
| `POST /api/tax/calculate` | Calculate tax for a sale (honors the merchant's collection settings). |
| `POST /api/rates` | Stateless rate lookup utility (no merchant). |

### Where the code lives

```
app/
  page.tsx                    Landing page (hero + concepts)
  docs/page.tsx               API reference + concepts + workflow
  pricing/page.tsx            Pricing + trial          ← Goal 1
  login/page.tsx              Login screen
  dashboard/page.tsx          Dev console              ← Goal 2 stub + Goal 1 trial card
  api/merchants/...           Merchants + collection CRUD
  api/tax/calculate/route.ts  The calculation endpoint
  api/rates/route.ts          Rate lookup utility
  api/login|logout/           Session cookies
lib/
  store.ts                    In-memory merchants + collection store (seeded)
  rates.ts                    Hardcoded rate data, all 50 states + DC
  plans.ts                    Plan / trial definitions ← Goal 1
  session.ts                  Trial-clock cookie logic
  auth.ts / apiAuth.ts        Password + API-key checks
```

Search the code for **`📌 GOAL`** to jump straight to the spots each task starts from.

---

## 5. (Optional) Run it in a sandbox

If you'd rather not install Node or a coding tool on your own machine, this repo ships a
**dev container** that sets everything up in an isolated environment.

1. Install [Docker](https://www.docker.com/) and, in VS Code, the
   [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).
2. Open this folder in VS Code and run **"Dev Containers: Reopen in Container"** from the
   Command Palette. It installs the app's dependencies automatically, plus Claude Code as a
   ready-to-go default. Prefer a different tool? Install it in the container the same way you
   would locally.
3. In the container terminal, point your tool at the gateway
   ([§2](#2-point-your-coding-tool-at-our-gateway)), then run `npm run dev`.

Because the container is isolated, you can safely let your tool run with fewer approval prompts.
In Claude Code that is `claude --permission-mode acceptEdits` (auto-approves file edits) or,
fully hands-off, `claude --permission-mode bypassPermissions` — only use `bypassPermissions`
inside the container, never on your own machine. Other tools have their own auto-approve
setting.

> GitHub Codespaces works too: "Code → Create codespace" uses the same container config, so
> you can do the whole exercise in the browser with nothing installed locally.

---

## 6. Submitting

**Send us two things** (no code — we won't review it):

1. **A screen-recorded video demo, 5 minutes or less**, walking through both prototypes:
   - **Pricing changes** — your freemium / Free tier, and how it shows up.
   - **Developer onboarding** — the onboarding experience you built.
2. **A one-page customer-interview plan** for the onboarding (Goal 3 in
   [`docs/ASSIGNMENT.md`](docs/ASSIGNMENT.md)): the goal of the interview plus the questions you'd
   ask. Any format is fine — PDF, doc, or a link.

Keep the video a **quick overview**: show the highlights and the reasoning in a sentence or two,
not a line-by-line tour. We'll go deep together in the next interview — that is where you'll walk
through your decisions and tradeoffs in detail, so no need to cram it all into the video.

**How to send it:** shareable links are easiest — [Loom](https://www.loom.com) (free, records
your screen in one click) for the video, and a Google Drive/doc link for the one-pager, or
anything we can open. Send them to your hiring contact.

Timebox the work itself to **~2–3 hours**. We're not looking for finished, shippable features —
we're looking at how you scope, decide, and drive an AI agent toward a good product outcome. If
you get stuck on setup, email your contact; setup problems won't count against you.

Good luck, and have fun with it.
