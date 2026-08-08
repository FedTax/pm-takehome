import Link from "next/link";
import { CodeBlock } from "../components/CodeBlock";
import { DEMO_API_KEY } from "@/lib/apiKey";
import { supportedStates } from "@/lib/rates";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "concepts", label: "Core concepts" },
  { id: "auth", label: "Authentication" },
  { id: "merchants", label: "Merchants" },
  { id: "collection", label: "Collection settings" },
  { id: "calculate", label: "Calculate tax" },
  { id: "rates", label: "Rates (utility)" },
  { id: "errors", label: "Errors" },
];

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-sky-100 text-sky-700",
  POST: "bg-green-100 text-green-700",
  PUT: "bg-amber-100 text-amber-700",
  PATCH: "bg-amber-100 text-amber-700",
  DELETE: "bg-red-100 text-red-700",
};

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 lg:grid-cols-[210px_1fr]">
      {/* Sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Reference</p>
          <nav className="space-y-1 text-sm">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="block text-gray-600 hover:text-brand-600 py-1">
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <div className="max-w-3xl space-y-14">
        <div>
          <h1 className="text-3xl font-bold text-ink">API Reference</h1>
          <p className="mt-2 text-gray-600">
            TaxRate is a sales tax API for platforms. Base URL for local development is{" "}
            <span className="font-mono text-sm">http://localhost:3000</span>. All requests and responses
            are JSON.
          </p>
        </div>

        <Doc id="overview" title="Overview">
          <p className="text-gray-600">
            If you run a platform where other businesses sell (a storefront builder, a marketplace, an
            invoicing tool), your sellers are responsible for collecting sales tax. TaxRate gives you the
            primitives to do that for them: manage each seller as a{" "}
            <strong>merchant</strong>, control which states each merchant{" "}
            <strong>collects</strong> in, and <strong>calculate</strong> the exact tax for every sale.
          </p>
          <p className="text-gray-600">
            New here? The fastest path is the three-call{" "}
            <Link href="/" className="text-brand-600 underline">
              quick start
            </Link>
            .
          </p>
        </Doc>

        <Doc id="concepts" title="Core concepts">
          <div className="grid gap-4 sm:grid-cols-2">
            <ConceptCard title="Platform">
              You. The company integrating this API. You authenticate with one API key and manage many
              merchants underneath it.
            </ConceptCard>
            <ConceptCard title="Merchant">
              One of your sellers. A merchant has a name, a business address, and a set of states it
              collects tax in. You manage merchants with the endpoints below.
            </ConceptCard>
            <ConceptCard title="Collection settings">
              The states a merchant is registered to collect in. A merchant owes tax only in states that
              are turned on. Everything else calculates to $0.
            </ConceptCard>
            <ConceptCard title="Calculation">
              For a given merchant and ship-to address, the tax to collect. It reads the merchant&#39;s
              collection settings, so it returns $0 where the merchant is not registered.
            </ConceptCard>
          </div>
        </Doc>

        <Doc id="auth" title="Authentication">
          <p className="text-gray-600">
            Every request must include your API key as a Bearer token in the{" "}
            <span className="font-mono text-sm">Authorization</span> header. Requests without a valid key
            get a <span className="font-mono text-sm">401</span>.
          </p>
          <CodeBlock label="header">{`Authorization: Bearer ${DEMO_API_KEY}`}</CodeBlock>
        </Doc>

        <Doc id="merchants" title="Merchants">
          <p className="text-gray-600">Create and manage the sellers on your platform.</p>

          <Endpoint method="GET" path="/api/merchants" desc="List all merchants." />
          <Endpoint method="POST" path="/api/merchants" desc="Create a merchant. Only name is required.">
            <CodeBlock label="request body">{`{
  "name": "Acme Roasters",
  "email": "ap@acme.example",
  "address": { "line1": "1 Main St", "city": "Denver", "state": "CO", "zip": "80202" },
  "collecting": ["CO"]
}`}</CodeBlock>
            <CodeBlock label="201 Created">{`{
  "id": "mch_ab12cd34",
  "name": "Acme Roasters",
  "email": "ap@acme.example",
  "address": { "line1": "1 Main St", "city": "Denver", "state": "CO", "zip": "80202" },
  "collecting": ["CO"],
  "created_at": "2026-08-01T12:00:00.000Z"
}`}</CodeBlock>
          </Endpoint>
          <Endpoint method="GET" path="/api/merchants/:id" desc="Retrieve one merchant." />
          <Endpoint
            method="PATCH"
            path="/api/merchants/:id"
            desc="Update a merchant. Send only the fields you want to change (name, email, address, collecting)."
          />
          <Endpoint method="DELETE" path="/api/merchants/:id" desc="Delete a merchant." />
        </Doc>

        <Doc id="collection" title="Collection settings">
          <p className="text-gray-600">
            Control which states a merchant collects in. Listing returns every supported state with a{" "}
            <span className="font-mono text-sm">collecting</span> flag, which is convenient for building a
            toggle UI.
          </p>

          <Endpoint
            method="GET"
            path="/api/merchants/:id/states"
            desc="List all states with an on/off flag for this merchant."
          >
            <CodeBlock label="200 OK">{`{
  "object": "list",
  "merchant_id": "mch_ab12cd34",
  "collecting_count": 1,
  "data": [
    { "state": "AK", "collecting": false },
    { "state": "AL", "collecting": false },
    { "state": "CO", "collecting": true },
    ...
  ]
}`}</CodeBlock>
          </Endpoint>
          <Endpoint
            method="GET"
            path="/api/merchants/:id/states/:state"
            desc="Check a single state for this merchant."
          />
          <Endpoint
            method="PUT"
            path="/api/merchants/:id/states/:state"
            desc="Turn a state on or off. Body { collecting: true | false }. No body defaults to on."
          >
            <CodeBlock label="request body">{`{ "collecting": true }`}</CodeBlock>
          </Endpoint>
          <Endpoint
            method="DELETE"
            path="/api/merchants/:id/states/:state"
            desc="Turn a state off (shortcut for PUT with collecting:false)."
          />
        </Doc>

        <Doc id="calculate" title="Calculate tax">
          <p className="text-gray-600">
            The endpoint you call on every sale. Give it a merchant and a ship-to address; it returns the
            tax to collect. If the merchant is not registered in the ship-to state,{" "}
            <span className="font-mono text-sm">tax_amount</span> is 0 and{" "}
            <span className="font-mono text-sm">collecting</span> is false.
          </p>

          <Endpoint method="POST" path="/api/tax/calculate" desc="Calculate tax for one sale.">
            <CodeBlock label="request body">{`{
  "merchant_id": "mch_ab12cd34",
  "amount": 100.00,
  "currency": "USD",
  "ship_to": { "state": "CO" }
}`}</CodeBlock>
            <CodeBlock label="200 OK">{`{
  "object": "tax_calculation",
  "merchant_id": "mch_ab12cd34",
  "ship_to_state": "CO",
  "jurisdiction": "Colorado",
  "collecting": true,
  "taxable_amount": 100,
  "rate": {
    "state_rate": 0.029,
    "county_rate": 0.01,
    "city_rate": 0.035,
    "special_rate": 0.011,
    "combined_rate": 0.085
  },
  "applied_rate": 0.085,
  "tax_amount": 8.5,
  "total": 108.5,
  "note": null
}`}</CodeBlock>
          </Endpoint>
        </Doc>

        <Doc id="rates" title="Rates (utility)">
          <p className="text-gray-600">
            A stateless lookup for the raw rate in a state, with no merchant involved. Useful for
            reference. For real sales, prefer <span className="font-mono text-sm">/api/tax/calculate</span>.
          </p>
          <Endpoint method="POST" path="/api/rates" desc="Return the rate breakdown for an address's state.">
            <CodeBlock label="request body">{`{ "address": { "state": "CA" } }`}</CodeBlock>
          </Endpoint>
          <p className="text-gray-600">
            Rate data covers all {supportedStates().length} states and DC. Rates are illustrative demo
            values, not authoritative.
          </p>
        </Doc>

        <Doc id="errors" title="Errors">
          <p className="text-gray-600">
            Errors return a JSON body with an <span className="font-mono text-sm">error</span> code and a{" "}
            <span className="font-mono text-sm">message</span>.
          </p>
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
                <Row f="400" t="bad_request" d="Invalid JSON, or a required field is missing/invalid." />
                <Row f="401" t="unauthorized" d="API key is missing or invalid." />
                <Row f="404" t="not_found" d="No merchant (or rate data) for the given id/state." />
                <Row f="405" t="method_not_allowed" d="Unsupported method for the endpoint." />
              </tbody>
            </table>
          </div>
        </Doc>
      </div>
    </div>
  );

  function Endpoint({
    method,
    path,
    desc,
    children,
  }: {
    method: string;
    path: string;
    desc: string;
    children?: React.ReactNode;
  }) {
    return (
      <div className="mt-5 rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
          <span className={`rounded px-2 py-0.5 text-xs font-bold font-mono ${METHOD_COLORS[method]}`}>
            {method}
          </span>
          <span className="font-mono text-sm text-ink">{path}</span>
        </div>
        <div className="px-4 py-3 space-y-3">
          <p className="text-sm text-gray-600">{desc}</p>
          {children}
        </div>
      </div>
    );
  }
}

function Doc({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-bold text-ink mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function ConceptCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{children}</p>
    </div>
  );
}

function Row({ f, t, d }: { f: string; t: string; d: string }) {
  return (
    <tr>
      <td className="px-4 py-2 font-mono text-xs">{f}</td>
      <td className="px-4 py-2 text-gray-500 font-mono text-xs">{t}</td>
      <td className="px-4 py-2 text-gray-600">{d}</td>
    </tr>
  );
}
