"use client";

/**
 * ───────────────────────────────────────────────────────────────────────────
 * 📌 GOAL 2 (interactive "aha" experience) STARTS HERE.
 *
 * This is a deliberately BARE-BONES live API tester: type an address, hit the
 * real /api/rates endpoint, see raw JSON. It proves the API works, but it does
 * NOT yet deliver an "aha" moment quickly.
 *
 * Your task is to redesign this into an interactive experience that gets a
 * first-time visitor to "oh, I get it — I want this" as fast as possible.
 * Feel free to rewrite this component entirely. Some prompts to consider:
 *   - What is the single fastest path to value? (Pre-filled example? One click?)
 *   - How do you show the answer, not just JSON? (A computed tax on a price?)
 *   - What makes someone want to sign up right after?
 * ───────────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { DEMO_API_KEY } from "@/lib/apiKey";

const EXAMPLE_STATES = ["CA", "NY", "TX", "FL", "WA", "OR"];

export function ApiPlayground() {
  const [state, setState] = useState("CA");
  const [city, setCity] = useState("San Francisco");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runLookup() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEMO_API_KEY}`,
        },
        body: JSON.stringify({ address: { city, state } }),
      });
      const json = await res.json();
      setResult(JSON.stringify(json, null, 2));
    } catch (err) {
      setResult(`Error: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 p-5 bg-white shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <span className="block text-gray-500 mb-1">City</span>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 w-48"
          />
        </label>
        <label className="text-sm">
          <span className="block text-gray-500 mb-1">State</span>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
          >
            {EXAMPLE_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={runLookup}
          disabled={loading}
          className="rounded-md bg-brand-500 px-4 py-2 text-white font-medium hover:bg-brand-600 disabled:opacity-50"
        >
          {loading ? "Looking up…" : "Get rate"}
        </button>
      </div>

      {result && (
        <pre className="code mt-4 rounded-lg bg-ink text-gray-100 p-4 overflow-x-auto">
          <code>{result}</code>
        </pre>
      )}
    </div>
  );
}
