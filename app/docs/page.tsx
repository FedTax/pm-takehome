import Link from "next/link";
import { CodeBlock } from "../components/CodeBlock";
import { DEMO_API_KEY } from "@/lib/apiKey";
import { supportedStates } from "@/lib/rates";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "auth", label: "Authentication" },
  { id: "endpoint", label: "POST /api/rates" },
  { id: "errors", label: "Errors" },
  { id: "states", label: "Supported states" },
];

export default function DocsPage() {
  const request = `POST /api/rates HTTP/1.1
Host: localhost:3000
Authorization: Bearer ${DEMO_API_KEY}
Content-Type: application/json

{
  "address": {
    "line1": "1 Market St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94105"
  }
}`;

  const response = `{
  "address": {
    "line1": "1 Market St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94105"
  },
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
    <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 lg:grid-cols-[200px_1fr]">
      {/* Sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
            Reference
          </p>
          <nav className="space-y-1 text-sm">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-gray-600 hover:text-brand-600 py-1"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <div className="max-w-3xl space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-ink">API Reference</h1>
          <p className="mt-2 text-gray-600">
            The TaxRate API has a single endpoint. Base URL for local development is{" "}
            <span className="font-mono text-sm">http://localhost:3000</span>.
          </p>
        </div>

        <Doc id="overview" title="Overview">
          <p className="text-gray-600">
            TaxRate returns the sales tax rate for a US address. You send an address, we return the
            state, county, city, and special-district rates plus the combined total. All responses
            are JSON. New here? Start with the{" "}
            <Link href="/" className="text-brand-600 underline">
              quick-start guide
            </Link>
            .
          </p>
        </Doc>

        <Doc id="auth" title="Authentication">
          <p className="text-gray-600">
            Every request must include your API key as a Bearer token in the{" "}
            <span className="font-mono text-sm">Authorization</span> header. Requests without a
            valid key get a <span className="font-mono text-sm">401</span>.
          </p>
          <CodeBlock label="header">{`Authorization: Bearer ${DEMO_API_KEY}`}</CodeBlock>
        </Doc>

        <Doc id="endpoint" title="POST /api/rates">
          <p className="text-gray-600">
            Look up rates for a single address. The <span className="font-mono text-sm">address</span>{" "}
            object accepts <span className="font-mono text-sm">line1</span>,{" "}
            <span className="font-mono text-sm">city</span>,{" "}
            <span className="font-mono text-sm">state</span>, and{" "}
            <span className="font-mono text-sm">zip</span>. Only{" "}
            <span className="font-mono text-sm">state</span> (a two-letter code) is required.
          </p>

          <h4 className="font-semibold text-ink mt-6 mb-2">Request</h4>
          <CodeBlock label="request">{request}</CodeBlock>

          <h4 className="font-semibold text-ink mt-6 mb-2">Response · 200 OK</h4>
          <CodeBlock label="response">{response}</CodeBlock>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-2 font-medium">Field</th>
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-4 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <Row f="jurisdiction" t="string" d="Human-readable state name." />
                <Row f="rates.state_rate" t="number" d="State portion, as a decimal (0.0725 = 7.25%)." />
                <Row f="rates.county_rate" t="number" d="County portion." />
                <Row f="rates.city_rate" t="number" d="City portion." />
                <Row f="rates.special_rate" t="number" d="Special district portion." />
                <Row f="rates.combined_rate" t="number" d="Sum of all portions." />
                <Row f="combined_rate_percent" t="string" d="Combined rate formatted as a percent." />
              </tbody>
            </table>
          </div>
        </Doc>

        <Doc id="errors" title="Errors">
          <p className="text-gray-600">Errors return a JSON body with an <span className="font-mono text-sm">error</span> code and a <span className="font-mono text-sm">message</span>.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Code</th>
                  <th className="px-4 py-2 font-medium">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <Row f="400" t="bad_request" d="Body is not valid JSON, or address / state is missing." />
                <Row f="401" t="unauthorized" d="API key is missing or invalid." />
                <Row f="404" t="not_found" d="No rate data for the given state." />
                <Row f="405" t="method_not_allowed" d="Used a method other than POST." />
              </tbody>
            </table>
          </div>
        </Doc>

        <Doc id="states" title="Supported states">
          <p className="text-gray-600">
            This demo ships rate data for {supportedStates().length} states. Requests for other
            states return a <span className="font-mono text-sm">404</span>.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {supportedStates().map((s) => (
              <span key={s} className="rounded-md border border-gray-200 px-2.5 py-1 text-sm font-mono">
                {s}
              </span>
            ))}
          </div>
        </Doc>
      </div>
    </div>
  );
}

function Doc({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-bold text-ink mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Row({ f, t, d }: { f: string; t: string; d: string }) {
  return (
    <tr>
      <td className="px-4 py-2 font-mono text-xs">{f}</td>
      <td className="px-4 py-2 text-gray-500">{t}</td>
      <td className="px-4 py-2 text-gray-600">{d}</td>
    </tr>
  );
}
