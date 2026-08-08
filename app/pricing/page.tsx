import Link from "next/link";
import { PLANS, TRIAL } from "@/lib/plans";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-ink">Simple, usage-based pricing</h1>
        <p className="mt-3 text-gray-600">
          Every new account starts with a{" "}
          <strong>
            {TRIAL.lengthDays}-day free trial of {TRIAL.planName}
          </strong>
          . No credit card required to start. Cancel anytime.
        </p>
      </div>

      {/*
        ─────────────────────────────────────────────────────────────────────
        📌 GOAL 1 (freemium) TOUCHES THIS PAGE.
        Today there are two paid plans and a time-boxed trial (the banner
        above). Part of your task is deciding how a permanent FREE tier shows
        up here and how it changes this page's story.
        ─────────────────────────────────────────────────────────────────────
      */}
      <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border p-8 flex flex-col ${
              plan.highlighted
                ? "border-brand-500 ring-1 ring-brand-500 shadow-lg"
                : "border-gray-200"
            }`}
          >
            {plan.highlighted && (
              <span className="self-start rounded-full bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1 mb-3">
                Trial default
              </span>
            )}
            <h2 className="text-lg font-semibold text-ink">{plan.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{plan.tagline}</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-ink">${plan.price}</span>
              <span className="text-gray-500">/ {plan.cadence.replace("per ", "")}</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-gray-700">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className={`mt-8 rounded-md px-4 py-2.5 text-center font-medium ${
                plan.highlighted
                  ? "bg-brand-500 text-white hover:bg-brand-600"
                  : "border border-gray-300 text-ink hover:bg-gray-50"
              }`}
            >
              Start {TRIAL.lengthDays}-day trial
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-gray-500">
        Prices are illustrative for this demo.
      </p>
    </div>
  );
}

function Check() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.1 3.1 6.8-6.8a1 1 0 011.4 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
