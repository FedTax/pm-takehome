# TaxRate — PM Take-Home

Welcome, and thanks for taking the time. This is a small but real full-stack app: a
**sales tax rate lookup API** with a marketing site, docs, pricing, and a logged-in
dashboard. Your job is to extend it using **Claude Code** (an AI coding agent), the same
way you would prototype with engineering in the role.

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
2. **The "Aha" moment.** The landing page has a bare-bones "Try it live" widget. Turn it into an
   **interactive experience** that gets a first-time visitor to the "I get it, I want this"
   moment as fast as possible.

We care more about product judgment and how you use AI than about polished code. A short
write-up of your decisions matters as much as the working prototype.

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
| API endpoint | `POST /api/rates` |

Both defaults can be changed via a `.env.local` file — see [`.env.example`](.env.example). You
don't need to.

Try the API directly:

```bash
curl -X POST http://localhost:3000/api/rates \
  -H "Authorization: Bearer demo_sk_taxrate_public" \
  -H "Content-Type: application/json" \
  -d '{"address":{"city":"San Francisco","state":"CA","zip":"94105"}}'
```

---

## 4. What's in the app

| Page | Path | What it is |
| --- | --- | --- |
| Landing | `/` | Hero, a "Try it live" widget, and a one-page quick-start guide. **Goal 2 lives here.** |
| API Docs | `/docs` | Standard-looking reference for the one endpoint. |
| Pricing | `/pricing` | Two paid plans (Basic $20/mo, Premium $100/mo) + the trial. **Goal 1 touches here.** |
| Login | `/login` | Hardcoded-password sign-in. |
| Dashboard | `/dashboard` | Post-login view: trial countdown, API key, usage. **Goal 1 shows up here.** |
| The API | `POST /api/rates` | Send an address, get the sales tax rate breakdown for that state. |

### Where the code lives

```
app/
  page.tsx              Landing page (quick-start guide)
  docs/page.tsx         API reference
  pricing/page.tsx      Pricing + trial
  login/page.tsx        Login screen
  dashboard/page.tsx    Logged-in dashboard (trial state)
  api/rates/route.ts    ← the product: the rate lookup endpoint
  api/login|logout/     Session cookies
  components/
    ApiPlayground.tsx   ← Goal 2 starting point (the "Try it live" widget)
lib/
  rates.ts              Hardcoded rate data by state ("the product" data)
  plans.ts              ← Goal 1 starting point (plan / trial definitions)
  session.ts            Trial-clock cookie logic
  auth.ts               The hardcoded password
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

Please send back:

1. **The code** (a zip, a fork, or a branch — whatever's easy).
2. **A short write-up** (1–2 pages, or a Loom, your call) covering:
   - Your freemium design and the reasoning behind it.
   - Your "aha" experience and why it's the fastest path to value.
   - What you'd do next with more time, and anything you'd validate with data.

Timebox it to **~3–4 hours**. We're not looking for finished, shippable features — we're
looking at how you scope, decide, and drive an AI agent toward a good product outcome. If you
get stuck on setup, email your contact; setup problems won't count against you.

Good luck, and have fun with it.
