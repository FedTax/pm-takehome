/**
 * "The product": hardcoded sales tax rate data, keyed by US state.
 *
 * These are illustrative demo numbers — NOT authoritative tax rates. Real rate
 * data is jurisdiction-level (state + county + city + special districts) and
 * changes constantly. Here we return one representative blended breakdown per
 * state so the API has something realistic to hand back.
 *
 * combined_rate is computed from the parts, so you only maintain the parts.
 */

export interface RateBreakdown {
  /** State-level sales tax rate (decimal, e.g. 0.0725 = 7.25%). */
  state_rate: number;
  /** Representative county rate. */
  county_rate: number;
  /** Representative city rate. */
  city_rate: number;
  /** Special district rate (transit, stadium, etc.). */
  special_rate: number;
}

export interface StateRate extends RateBreakdown {
  /** Two-letter USPS state code. */
  state: string;
  /** Human-readable state name. */
  state_name: string;
}

/**
 * Demo rate table. A handful of states plus the five states with no statewide
 * sales tax (AK, DE, MT, NH, OR). Extend freely.
 */
const STATE_RATES: Record<string, StateRate> = {
  CA: { state: "CA", state_name: "California", state_rate: 0.0725, county_rate: 0.0025, city_rate: 0.0075, special_rate: 0.005 },
  NY: { state: "NY", state_name: "New York", state_rate: 0.04, county_rate: 0.0425, city_rate: 0.0, special_rate: 0.00375 },
  TX: { state: "TX", state_name: "Texas", state_rate: 0.0625, county_rate: 0.005, city_rate: 0.01, special_rate: 0.005 },
  FL: { state: "FL", state_name: "Florida", state_rate: 0.06, county_rate: 0.01, city_rate: 0.0, special_rate: 0.0 },
  WA: { state: "WA", state_name: "Washington", state_rate: 0.065, county_rate: 0.015, city_rate: 0.0125, special_rate: 0.003 },
  IL: { state: "IL", state_name: "Illinois", state_rate: 0.0625, county_rate: 0.0175, city_rate: 0.0125, special_rate: 0.01 },
  CO: { state: "CO", state_name: "Colorado", state_rate: 0.029, county_rate: 0.01, city_rate: 0.035, special_rate: 0.011 },
  GA: { state: "GA", state_name: "Georgia", state_rate: 0.04, county_rate: 0.03, city_rate: 0.01, special_rate: 0.0 },
  MA: { state: "MA", state_name: "Massachusetts", state_rate: 0.0625, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
  PA: { state: "PA", state_name: "Pennsylvania", state_rate: 0.06, county_rate: 0.01, city_rate: 0.01, special_rate: 0.0 },
  AZ: { state: "AZ", state_name: "Arizona", state_rate: 0.056, county_rate: 0.007, city_rate: 0.023, special_rate: 0.0 },
  OH: { state: "OH", state_name: "Ohio", state_rate: 0.0575, county_rate: 0.0125, city_rate: 0.0, special_rate: 0.005 },
  // No statewide sales tax:
  OR: { state: "OR", state_name: "Oregon", state_rate: 0.0, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
  MT: { state: "MT", state_name: "Montana", state_rate: 0.0, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
  NH: { state: "NH", state_name: "New Hampshire", state_rate: 0.0, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
  DE: { state: "DE", state_name: "Delaware", state_rate: 0.0, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
  AK: { state: "AK", state_name: "Alaska", state_rate: 0.0, county_rate: 0.0, city_rate: 0.0175, special_rate: 0.0 },
};

/** Round to 4 decimal places to avoid floating-point noise like 0.08750000001. */
function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

export function combinedRate(r: RateBreakdown): number {
  return round4(r.state_rate + r.county_rate + r.city_rate + r.special_rate);
}

/** All supported state codes (for docs / validation messages). */
export function supportedStates(): string[] {
  return Object.keys(STATE_RATES).sort();
}

/**
 * Look up rates for a state code. Returns null if we do not have data for it,
 * so the caller can decide how to respond (e.g. 404 vs. a default).
 */
export function lookupByState(stateCode: string): StateRate | null {
  if (!stateCode) return null;
  return STATE_RATES[stateCode.trim().toUpperCase()] ?? null;
}
