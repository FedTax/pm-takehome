/**
 * Plan / pricing definitions for the demo.
 *
 * Today the product has TWO paid plans (Basic, Premium) and every new account
 * starts on a 30-day free TRIAL of Basic. There is no free tier — when the
 * trial ends, the customer must pick a paid plan to keep using the API.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * 📌 GOAL 1 (freemium) STARTS HERE.
 * Your task is to prototype replacing the trial with a permanent FREE tier.
 * This file, the pricing page (app/pricing/page.tsx), and the dashboard
 * (app/dashboard/page.tsx) are the three places that describe plan state.
 * ───────────────────────────────────────────────────────────────────────────
 */

export type PlanId = "basic" | "premium";

export interface Plan {
  id: PlanId;
  name: string;
  /** Monthly price in USD. */
  price: number;
  cadence: string;
  tagline: string;
  features: string[];
  /** Requests per month included; null = unmetered for the demo. */
  monthlyRequests: number | null;
  /** Visually emphasize this plan on the pricing page. */
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 20,
    cadence: "per month",
    tagline: "For side projects and small stores.",
    features: [
      "10,000 rate lookups / month",
      "All 50 states + DC",
      "REST API + JSON responses",
      "Email support",
    ],
    monthlyRequests: 10_000,
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 100,
    cadence: "per month",
    tagline: "For production apps and platforms.",
    features: [
      "250,000 rate lookups / month",
      "All 50 states + DC",
      "99.9% uptime SLA",
      "Priority support + Slack channel",
      "Webhooks & bulk lookups",
    ],
    monthlyRequests: 250_000,
  },
];

/** The trial every new account starts on. */
export const TRIAL = {
  /** Which paid plan the trial is a trial *of*. */
  planId: "basic" as PlanId,
  planName: "Basic",
  lengthDays: 30,
};

export function getPlan(id: PlanId): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
