import Link from "next/link";
import { CodeBlock } from "./components/CodeBlock";
import { ApiPlayground } from "./components/ApiPlayground";
import { DEMO_API_KEY } from "@/lib/apiKey";

export default function HomePage() {
  const curlExample = `curl -X POST http://localhost:3000/api/rates \\
  -H "Authorization: Bearer ${DEMO_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"address":{"city":"San Francisco","state":"CA","zip":"94105"}}'`;

  const responseExample = `{
  "jurisdiction": "California",
  "currency": "USD",
  "rates": {
    "state_rate": 0.0725,
    "county_rate": 0.0025,
    "city_rate": 0.0075,
    "special_rate": 0.005,
    "combined_rate": 0.0875
  },
  "combined_rate_percent": "8.750%"
}`;

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1 mb-4">
            Sales tax rates API
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
            Sales tax rates, one API call away.
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Send an address, get the combined sales tax rate back as JSON. No tax tables to
            maintain, no jurisdiction math. Built for developers.
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

      {/* Interactive tester (Goal 2 seed) */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
          Try it live
        </h2>
        <ApiPlayground />
      </section>

      {/* One-page quick-start guide */}
      <section className="mx-auto max-w-6xl px-6 py-12 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-ink">Quick start</h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Everything you need to make your first call. For the full reference, see the{" "}
          <Link href="/docs" className="text-brand-600 underline">
            API docs
          </Link>
          .
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <Step n={1} title="Grab the demo API key">
              <p className="text-gray-600">
                Send it as a Bearer token on every request. This public demo key is fine to use
                while you test:
              </p>
              <CodeBlock label="api key">{DEMO_API_KEY}</CodeBlock>
            </Step>

            <Step n={2} title="Make a request">
              <p className="text-gray-600">
                POST an <span className="font-mono text-sm">address</span> to{" "}
                <span className="font-mono text-sm">/api/rates</span>. Only{" "}
                <span className="font-mono text-sm">state</span> is required.
              </p>
              <CodeBlock label="terminal">{curlExample}</CodeBlock>
            </Step>
          </div>

          <div className="space-y-6">
            <Step n={3} title="Read the response">
              <p className="text-gray-600">
                You get a full rate breakdown plus the combined rate, as a decimal and a percent.
              </p>
              <CodeBlock label="200 OK">{responseExample}</CodeBlock>
            </Step>

            <div className="rounded-lg bg-brand-50 border border-brand-100 p-5">
              <h3 className="font-semibold text-brand-900">How to compute tax on a sale</h3>
              <p className="mt-1 text-sm text-brand-900/80">
                Multiply the order subtotal by <span className="font-mono">combined_rate</span>. A
                $100 order in California ({"8.750%"}) owes <strong>$8.75</strong> in sales tax.
              </p>
            </div>
          </div>
        </div>
      </section>
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
