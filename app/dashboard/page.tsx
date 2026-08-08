import Link from "next/link";
import { redirect } from "next/navigation";
import { isLoggedIn, getTrialStatus } from "@/lib/session";
import { getPlan, TRIAL } from "@/lib/plans";
import { DEMO_API_KEY } from "@/lib/apiKey";
import { listMerchants } from "@/lib/store";
import { LogoutButton } from "../components/LogoutButton";

export default async function DashboardPage() {
  // Middleware already guards this route, but check again so the page is safe
  // to render on its own.
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  const trial = await getTrialStatus();
  const plan = getPlan(TRIAL.planId);
  const pct = Math.round(((trial.totalDays - trial.daysLeft) / trial.totalDays) * 100);
  const merchants = listMerchants();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <LogoutButton />
      </div>

      {/*
        ─────────────────────────────────────────────────────────────────────
        📌 GOAL 2 (developer onboarding) STARTS HERE.
        This is a placeholder "getting started" card. Right now it is a static
        checklist that does nothing. Your task is to turn getting set up — first
        merchant, first state turned on, first successful calculation — into an
        onboarding experience that makes a developer FEEL the product working.
        You can build it here, as its own route/flow, or wherever you think a
        developer would actually experience it. Redesign freely.
        ─────────────────────────────────────────────────────────────────────
      */}
      <div className="mt-6 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/40 p-6">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-100 text-brand-700 text-xs font-medium px-2.5 py-0.5">
            Getting started
          </span>
          <span className="text-xs text-gray-400">📌 Goal 2 starting point — build the real thing</span>
        </div>
        <h2 className="mt-3 font-semibold text-ink">Make your first tax calculation</h2>
        <ol className="mt-3 space-y-2 text-sm text-gray-600 list-decimal list-inside">
          <li>Create a merchant (POST /api/merchants).</li>
          <li>Turn on the states they collect in (PUT /api/merchants/:id/states/:state).</li>
          <li>Calculate tax for a sale (POST /api/tax/calculate).</li>
        </ol>
        <p className="mt-3 text-xs text-gray-500">
          See the <Link href="/docs" className="underline">docs</Link>. This card is a stub — the
          onboarding experience is yours to design.
        </p>
      </div>

      {/*
        ─────────────────────────────────────────────────────────────────────
        📌 GOAL 1 (freemium) SHOWS UP HERE.
        This card is the trial experience: a countdown that ends in a hard wall
        ("upgrade to keep going"). Reimagine what a customer sees on a permanent
        free tier.
        ─────────────────────────────────────────────────────────────────────
      */}
      <div className="mt-6 rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-sm text-gray-500">Current plan</p>
            <p className="text-lg font-semibold text-ink">
              {plan?.name} trial{" "}
              <span
                className={`ml-2 align-middle rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  trial.expired ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                {trial.expired ? "Trial ended" : `${trial.daysLeft} days left`}
              </span>
            </p>
          </div>
          <Link
            href="/pricing"
            className="rounded-md bg-brand-500 px-4 py-2 text-white text-sm font-medium hover:bg-brand-600"
          >
            {trial.expired ? "Choose a plan" : "Upgrade"}
          </Link>
        </div>
        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full ${trial.expired ? "bg-red-500" : "bg-brand-500"}`}
              style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {trial.expired
              ? "Your free trial has ended. Pick a plan to keep calling the API."
              : `Day ${trial.totalDays - trial.daysLeft} of ${trial.totalDays}. When the trial ends you'll need a paid plan to continue.`}
          </p>
        </div>
      </div>

      {/* API key */}
      <div className="mt-6 rounded-2xl border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Your API key</p>
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          <code className="rounded-md bg-gray-100 px-3 py-2 font-mono text-sm">{DEMO_API_KEY}</code>
          <span className="text-xs text-gray-400">
            Public demo key — send as a Bearer token. See{" "}
            <Link href="/docs" className="underline">
              the docs
            </Link>
            .
          </span>
        </div>
      </div>

      {/* Merchants */}
      <div className="mt-6 rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Merchants <span className="text-gray-400">({merchants.length})</span>
          </p>
          <span className="text-xs text-gray-400">Managed via POST /api/merchants</span>
        </div>

        <div className="mt-4 divide-y divide-gray-100">
          {merchants.map((m) => (
            <div key={m.id} className="py-3 flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-ink">{m.name}</p>
                <p className="text-xs font-mono text-gray-400">{m.id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">
                  Collecting in {m.collecting.length} {m.collecting.length === 1 ? "state" : "states"}
                </p>
                <div className="flex flex-wrap gap-1 justify-end max-w-xs">
                  {m.collecting.length === 0 ? (
                    <span className="text-xs text-gray-400">none yet</span>
                  ) : (
                    m.collecting.map((s) => (
                      <span key={s} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
          {merchants.length === 0 && (
            <p className="py-6 text-sm text-gray-400 text-center">
              No merchants yet. Create one with POST /api/merchants.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
