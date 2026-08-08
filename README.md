# TaxRate — PM Take-Home

Welcome, and thanks for taking the time. This is a small but real full-stack app: a
**sales tax API for platforms** with a marketing site, docs, pricing, and a logged-in
dashboard. Your job is to extend it using **Claude Code** (an AI coding agent), the same
way you would prototype with engineering in the role.

The product: a "platform" (think a storefront builder or marketplace) has business customers
called **merchants**. The API lets the platform manage merchants, control which states each
merchant collects sales tax in, and calculate the tax for any sale. See `/docs` in the running
app for the full explainer.

You do not need to be an engineer. You need to be able to describe what you want, drive an
AI agent to build it, and make good product decisions along the way. The code is small and
heavily commented so you can find your way around.

---

## What you'll build

Two prototypes. The full brief is in **[`docs/ASSIGNMENT.md`](docs/ASSIGNMENT.md)** — read it
first. In short:

1. **Freemium.** Today every new account gets a 30-day *trial* of the Basic plan, then hits a
   paywall. Prototype replacing that trial with a permanent **Free tier**. Show what the
   experience looks and feels like, and explain *why* you designed it that way.
2. **Developer onboarding.** Prototype an onboarding experience that gets a *developer* set up
   and to the "aha" as fast as possible: create their first merchants, turn on the states they
   collect in, and see a real tax calculation come back. What should that first-run experience
   look and feel like?

We care more about product judgment and how you use AI than about polished code. In fact, we
won't look at your code at all — you'll show us your work in a short video demo (see
[§6 Submitting](#6-submitting)).

---

## 1. Prerequisites

- **Node.js 20+** and npm (check with `node --version`).
- **Claude Code**. Install it globally:
  ```bash
  npm install -g @anthropic-ai/claude-code
  ```
  (Or follow the docs at https://docs.claude.com/en/docs/claude-code.) Prefer not to install
  anything on your machine? See [§5 Sandbox](#5-optional-run-it-in-a-sandbox).

---

## 2. Point Claude Code at our gateway

We'll send you an **API key** separately. It routes Claude Code through our LLM gateway, so
you don't need your own Anthropic account. Point Claude Code at it in **one** of these ways.

**Option A — project settings file (recommended).** From the repo root:

```bash
cp .claude/settings.example.json .claude/settings.local.json
```

Then edit `.claude/settings.local.json` and fill in the two values we gave you:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://the-gateway-url-we-send-you",
    "ANTHROPIC_AUTH_TOKEN": "the-api-key-we-send-you"
  }
}
```

`settings.local.json` is gitignored, so your key never gets committed. Use
`ANTHROPIC_AUTH_TOKEN` for a Bearer-token key (the default); if we tell you the key is an
`x-api-key`, rename it to `ANTHROPIC_API_KEY` instead.

**Option B — environment variables.** Set them in your shell before running `claude`:

```bash
export ANTHROPIC_BASE_URL="https://the-gateway-url-we-send-you"
export ANTHROPIC_AUTH_TOKEN="the-api-key-we-send-you"
```

**Verify it works.** Run `claude` from the repo, then type `/status`. You should see the
gateway base URL listed. Send it a quick message ("say hello") to confirm it responds. If you
get a 401, double-check the key and whether it should be `ANTHROPIC_AUTH_TOKEN` vs
`ANTHROPIC_API_KEY`.

---

## 3. Run the app

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

If you'd rather not install Node or Claude Code on your own machine, this repo ships a
**dev container** that sets everything up in an isolated environment.

1. Install [Docker](https://www.docker.com/) and, in VS Code, the
   [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).
2. Open this folder in VS Code and run **"Dev Containers: Reopen in Container"** from the
   Command Palette. It installs the app's dependencies and Claude Code automatically.
3. In the container terminal, do [§2](#2-point-claude-code-at-our-gateway) (settings file), then
   `npm run dev`.

Because the container is isolated, you can safely let Claude Code work with fewer
interruptions by starting it as `claude --permission-mode acceptEdits` (auto-approves file
edits) or, fully hands-off, `claude --permission-mode bypassPermissions`. Only use
`bypassPermissions` inside the container, never on your own machine.

> GitHub Codespaces works too: "Code → Create codespace" uses the same container config, so
> you can do the whole exercise in the browser with nothing installed locally.

---

## 6. Submitting

**Send us one thing: a screen-recorded video demo, 5 minutes or less.** We do not need your
code — we won't review it. Just record your screen and walk us through what you built.

Cover both prototypes:

1. **Pricing changes** — your freemium / Free tier, and how it shows up.
2. **Developer onboarding** — the onboarding experience you built.

Keep it to a **quick overview**: show the highlights and the reasoning in a sentence or two,
not a line-by-line tour. We'll go deep together in the next interview — that is where you'll
walk through your decisions and tradeoffs in detail, so no need to cram it all into the video.

**How to send it:** a shareable link is easiest — [Loom](https://www.loom.com) (free, records
your screen in one click), Google Drive, or any link we can open. Send it to your hiring
contact.

Timebox the work itself to **~3–4 hours**. We're not looking for finished, shippable features —
we're looking at how you scope, decide, and drive an AI agent toward a good product outcome. If
you get stuck on setup, email your contact; setup problems won't count against you.

Good luck, and have fun with it.
