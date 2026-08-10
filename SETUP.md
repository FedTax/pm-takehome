# Local Setup Guide

This gets the TaxRate app running on your computer, step by step. It takes about two minutes.
No prior Node.js experience needed — just follow along in order.

> **In a hurry, or not comfortable in a terminal?** Once your AI coding tool is connected to
> the gateway (see [README §2](README.md#2-point-your-coding-tool-at-our-gateway)), you can hand
> this whole thing off — see [Let your AI tool do it](#let-your-ai-tool-do-it) at the bottom.

---

## What you need

**Node.js 20 or newer** (npm is included with it).

- Check what you have — run this in a terminal:
  ```bash
  node --version
  ```
  If it prints `v20.` or higher (e.g. `v20.11.0`, `v22.3.0`), you're set. Skip to the steps.
- If it says "command not found" or a version below 20: install the **LTS** build from
  <https://nodejs.org>, then **close and reopen your terminal** and check again.

---

## Steps

### 1. Open a terminal in the project folder

Open a terminal and move into the folder that contains this repo (the one with `package.json`
in it). To confirm you're in the right place:

```bash
ls package.json
```

If it prints `package.json`, continue. If it says "No such file", `cd` into the project folder
first.

### 2. Install dependencies

```bash
npm install
```

This downloads the app's libraries into a `node_modules/` folder. It takes roughly 30–60
seconds the first time. A few lines starting with `npm warn` are normal and safe to ignore.

### 3. Start the app

```bash
npm run dev
```

Wait a few seconds for output like:

```
  ▲ Next.js 15.x
  - Local:  http://localhost:3000
  ✓ Ready in 2s
```

**Leave this terminal open** — the app runs only while this command is running.

### 4. Open the app

Go to **<http://localhost:3000>** in your browser. You should see the TaxRate landing page.

### 5. Confirm it actually works

- **Web:** click **Dashboard** in the top-right (or open <http://localhost:3000/login>) and sign
  in with the password:
  ```
  letmein
  ```
  You should land on a dashboard showing a seeded merchant.
- **API (optional):** open a *second* terminal (leave the app running in the first) and run:
  ```bash
  curl -X POST http://localhost:3000/api/tax/calculate \
    -H "Authorization: Bearer demo_sk_taxrate_public" \
    -H "Content-Type: application/json" \
    -d '{"merchant_id":"mch_demo_coffee","amount":100,"ship_to":{"state":"CA"}}'
  ```
  You should get back JSON containing `"tax_amount": 8.75`.

If both work, you're fully set up. 🎉

---

## Stopping and restarting

- **Stop the app:** in the terminal running it, press **Ctrl + C**.
- **Start it again:** `npm run dev`.
- Restarting **resets any merchants you created** — the data lives in memory, not a database.
  That is intentional; there is nothing to install or configure.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `command not found: npm` (or `node`) | Node isn't installed, or the terminal predates the install. Install Node LTS from <https://nodejs.org> and open a **new** terminal. |
| `Port 3000 is already in use` | Something else is using that port. Stop it, or run on another port: `npm run dev -- -p 3001`, then open <http://localhost:3001>. |
| Errors mentioning your Node version | Make sure `node --version` is 20+. |
| The page won't load | Confirm step 3 is still running and printed `Ready`, then refresh the browser. |
| A code change isn't showing | The dev server hot-reloads automatically; if it seems stuck, stop it (Ctrl + C) and run `npm run dev` again. |

Still stuck? Setup problems don't count against you — email your hiring contact.

---

## Let your AI tool do it

Once your coding tool is pointed at the gateway
([README §2](README.md#2-point-your-coding-tool-at-our-gateway)), you can just ask it to run
this guide for you. For example:

> Read `SETUP.md` and follow it to install dependencies and start the app, then tell me the
> local URL and confirm it's working.

It will run the steps above and report back.
