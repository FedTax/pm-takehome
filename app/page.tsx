import Link from "next/link";

export default function HomePage() {
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

      {/* Concepts */}
      <section className="mx-auto max-w-6xl px-6 py-12 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-ink">How TaxRate works</h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Three ideas. If you build a platform where other businesses sell, this is your model. See
          the{" "}
          <Link href="/docs" className="text-brand-600 underline">
            API docs
          </Link>{" "}
          for the full workflow.
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
