"use client";

/**
 * A small marketing demo for the landing page. It calls the real
 * POST /api/tax/calculate against a seeded demo merchant so a visitor can see
 * the core behavior: tax is charged where the merchant collects, and $0 where
 * it doesn't.
 *
 * NOTE: This is just a taste of the product. The candidate's Goal 2 is a full
 * developer ONBOARDING experience (see docs/ASSIGNMENT.md) — not this widget.
 */

import { useState } from "react";
import { DEMO_API_KEY } from "@/lib/apiKey";
import { DEMO_MERCHANT_ID, DEMO_MERCHANT_NAME } from "@/lib/demo";

// A representative set of states for the dropdown. The demo merchant collects
// in CA, NY, and WA — try one of those vs. one it doesn't (e.g. TX, FL).
const STATE_CHOICES = ["CA", "NY", "WA", "TX", "FL", "CO", "IL", "AZ", "GA", "OR"];

interface CalcResult {
  collecting: boolean;
  ship_to_state: string;
  jurisdiction: string;
  tax_amount: number;
  total: number;
  applied_rate: number;
  note: string | null;
}

export function LiveDemo() {
  const [amount, setAmount] = useState("100");
  const [state, setState] = useState("CA");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function calculate() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/tax/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${DEMO_API_KEY}` },
        body: JSON.stringify({
          merchant_id: DEMO_MERCHANT_ID,
          amount: Number(amount) || 0,
          ship_to: { state },
        }),
      });
      setResult(await res.json());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 p-5 bg-white shadow-sm">
      <p className="text-sm text-gray-500 mb-4">
        Demo merchant <span className="font-medium text-ink">{DEMO_MERCHANT_NAME}</span> collects in{" "}
        <span className="font-mono text-xs bg-gray-100 rounded px-1.5 py-0.5">CA</span>{" "}
        <span className="font-mono text-xs bg-gray-100 rounded px-1.5 py-0.5">NY</span>{" "}
        <span className="font-mono text-xs bg-gray-100 rounded px-1.5 py-0.5">WA</span>. Ship an order
        somewhere else and watch the tax go to $0.
      </p>

      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <span className="block text-gray-500 mb-1">Order amount</span>
          <div className="flex items-center rounded-md border border-gray-300 px-3 py-2 w-36">
            <span className="text-gray-400 mr-1">$</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              className="w-full outline-none"
            />
          </div>
        </label>
        <label className="text-sm">
          <span className="block text-gray-500 mb-1">Ship to</span>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
          >
            {STATE_CHOICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={calculate}
          disabled={loading}
          className="rounded-md bg-brand-500 px-4 py-2 text-white font-medium hover:bg-brand-600 disabled:opacity-50"
        >
          {loading ? "Calculating…" : "Calculate tax"}
        </button>
      </div>

      {result && (
        <div
          className={`mt-4 rounded-lg border p-4 ${
            result.collecting ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-gray-600">
                Tax to collect on ${Number(amount || 0).toFixed(2)} shipped to {result.ship_to_state}
              </p>
              <p className="text-3xl font-bold text-ink">${result.tax_amount.toFixed(2)}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                result.collecting ? "bg-green-600 text-white" : "bg-amber-500 text-white"
              }`}
            >
              {result.collecting
                ? `Collecting in ${result.ship_to_state}`
                : `Not registered in ${result.ship_to_state}`}
            </span>
          </div>
          {result.note && <p className="mt-2 text-sm text-amber-800">{result.note}</p>}
        </div>
      )}
    </div>
  );
}
