/**
 * Plan / pricing definitions for the demo.
 *
 * Today the product has TWO paid plans (Basic, Premium) and every new account
 * starts on a 30-day free TRIAL of Basic. There is no free tier — when the
 * trial ends, the platform must pick a paid plan to keep calling the API.
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
  /** Tax calculations included per month; null = unmetered for the demo. */
  monthlyCalculations: number | null;
  /** Visually emphasize this plan on the pricing page. */
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 20,
    cadence: "per month",
    tagline: "For platforms just getting started.",
    features: [
      "Up to 25 merchants",
      "10,000 tax calculations / month",
      "All 50 states + DC",
      "REST API + JSON responses",
      "Email support",
    ],
    monthlyCalculations: 10_000,
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 100,
    cadence: "per month",
    tagline: "For platforms running tax at scale.",
    features: [
      "Unlimited merchants",
      "250,000 tax calculations / month",
      "All 50 states + DC",
      "99.9% uptime SLA",
      "Priority support + Slack channel",
      "Webhooks & bulk calculations",
    ],
    monthlyCalculations: 250_000,
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
