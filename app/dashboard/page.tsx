import Link from "next/link";
import { redirect } from "next/navigation";
import { isLoggedIn, getTrialStatus } from "@/lib/session";
import { getPlan, TRIAL } from "@/lib/plans";
import { DEMO_API_KEY } from "@/lib/apiKey";
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

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <LogoutButton />
      </div>

      {/*
        ─────────────────────────────────────────────────────────────────────
        📌 GOAL 1 (freemium) SHOWS UP HERE.
        This card is the trial experience: a countdown that ends in a hard
        wall ("upgrade to keep going"). Reimagine what a customer sees when
        they are instead on a permanent free tier.
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
                  trial.expired
                    ? "bg-red-50 text-red-700"
                    : "bg-amber-50 text-amber-700"
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

        {/* Trial progress bar */}
        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full ${trial.expired ? "bg-red-500" : "bg-brand-500"}`}
              style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {trial.expired
              ? "Your free trial has ended. Pick a plan to keep making API calls."
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

      {/* Usage placeholder */}
      <div className="mt-6 rounded-2xl border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Usage this month</p>
        <p className="mt-1 text-3xl font-bold text-ink">
          0<span className="text-base font-normal text-gray-400"> / {plan?.monthlyRequests?.toLocaleString()} requests</span>
        </p>
        <p className="mt-1 text-xs text-gray-400">Usage tracking is stubbed out for the demo.</p>
      </div>
    </div>
  );
}
