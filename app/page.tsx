import Link from "next/link";
import { CodeBlock } from "./components/CodeBlock";
import { LiveDemo } from "./components/LiveDemo";
import { DEMO_API_KEY } from "@/lib/apiKey";

export default function HomePage() {
  const createMerchant = `curl -X POST http://localhost:3000/api/merchants \\
  -H "Authorization: Bearer ${DEMO_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Acme Roasters","address":{"state":"CA"}}'
# -> { "id": "mch_ab12cd34", ... }`;

  const turnOnState = `curl -X PUT http://localhost:3000/api/merchants/mch_ab12cd34/states/CA \\
  -H "Authorization: Bearer ${DEMO_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"collecting":true}'`;

  const calculate = `curl -X POST http://localhost:3000/api/tax/calculate \\
  -H "Authorization: Bearer ${DEMO_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"merchant_id":"mch_ab12cd34","amount":100,"ship_to":{"state":"CA"}}'`;

  const calcResponse = `{
  "merchant_id": "mch_ab12cd34",
  "ship_to_state": "CA",
  "collecting": true,
  "rate": { "combined_rate": 0.0875 },
  "tax_amount": 8.75,
  "total": 108.75
}`;

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1 mb-4">
            Sales tax API for platforms
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
            Sales tax, built into your platform.
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            If your sellers collect sales tax, TaxRate handles the hard part. Manage each merchant,
            control the states they collect in, and get the exact tax for every sale from one API.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="rounded-md bg-brand-500 px-5 py-2.5 text-white font-medium hover:bg-brand-600"
            >
              Read the API docs
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-gray-300 px-5 py-2.5 font-medium text-ink hover:bg-gray-50"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Live demo */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">See it work</h2>
        <LiveDemo />
      </section>

      {/* Concepts */}
      <section className="mx-auto max-w-6xl px-6 py-12 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-ink">How TaxRate works</h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Three ideas. If you build a platform where other businesses sell, this is your model.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Concept title="Merchants" badge="the sellers on your platform">
            Each of your customers is a merchant. You create and manage them through the API. Their
            tax settings live on the merchant record.
          </Concept>
          <Concept title="Collection settings" badge="which states are on">
            A merchant only owes tax in states where they are registered to collect. You turn those
            states on or off per merchant, one API call each.
          </Concept>
          <Concept title="Calculation" badge="tax for a sale">
            For any sale, send the merchant and the ship-to address. TaxRate returns the tax, and
            charges $0 automatically in states the merchant has not turned on.
          </Concept>
        </div>
      </section>

      {/* Quick start */}
      <section className="mx-auto max-w-6xl px-6 py-12 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-ink">Quick start</h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Go from zero to a real tax calculation in three calls. Full reference in the{" "}
          <Link href="/docs" className="text-brand-600 underline">
            API docs
          </Link>
          .
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <Step n={1} title="Create a merchant">
              <p className="text-gray-600">
                Authenticate with the demo key ({<span className="font-mono text-sm">{DEMO_API_KEY}</span>}) as
                a Bearer token, then add one of your sellers.
              </p>
              <CodeBlock label="terminal">{createMerchant}</CodeBlock>
            </Step>

            <Step n={2} title="Turn on the states they collect in">
              <p className="text-gray-600">Flip a state on for that merchant.</p>
              <CodeBlock label="terminal">{turnOnState}</CodeBlock>
            </Step>
          </div>

          <div className="space-y-6">
            <Step n={3} title="Calculate tax for a sale">
              <p className="text-gray-600">Send the merchant and the ship-to state. Get the tax back.</p>
              <CodeBlock label="terminal">{calculate}</CodeBlock>
              <CodeBlock label="200 OK">{calcResponse}</CodeBlock>
            </Step>
          </div>
        </div>
      </section>
    </div>
  );
}

function Concept({ title, badge, children }: { title: string; badge: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-0.5 text-xs uppercase tracking-wide text-brand-600 font-medium">{badge}</p>
      <p className="mt-3 text-sm text-gray-600">{children}</p>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-white text-sm font-bold">
          {n}
        </span>
        <h3 className="font-semibold text-ink">{title}</h3>
      </div>
      <div className="pl-10 space-y-3">{children}</div>
    </div>
  );
}
