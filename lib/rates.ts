/**
 * Reference sales tax rate data, keyed by US state.
 *
 * These are illustrative demo numbers — NOT authoritative tax rates. Real rate
 * data is jurisdiction-level (state + county + city + special districts) and
 * changes constantly. Here we return one representative blended breakdown per
 * state so the API has something realistic to hand back.
 *
 * This is the *reference layer*. On top of it, the platform API tracks which
 * states each merchant actually collects in (see lib/store.ts) and applies
 * these rates during a calculation (see app/api/tax/calculate).
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
 * Demo rate table for all 50 states + DC. The five states with no statewide
 * sales tax (AK, DE, MT, NH, OR) have a 0 state rate; Alaska still has local
 * tax in some places. Numbers are illustrative.
 */
const STATE_RATES: Record<string, StateRate> = {
  AL: { state: "AL", state_name: "Alabama", state_rate: 0.04, county_rate: 0.02, city_rate: 0.03, special_rate: 0.005 },
  AK: { state: "AK", state_name: "Alaska", state_rate: 0.0, county_rate: 0.0, city_rate: 0.0175, special_rate: 0.0 },
  AZ: { state: "AZ", state_name: "Arizona", state_rate: 0.056, county_rate: 0.007, city_rate: 0.023, special_rate: 0.0 },
  AR: { state: "AR", state_name: "Arkansas", state_rate: 0.065, county_rate: 0.015, city_rate: 0.012, special_rate: 0.003 },
  CA: { state: "CA", state_name: "California", state_rate: 0.0725, county_rate: 0.0025, city_rate: 0.0075, special_rate: 0.005 },
  CO: { state: "CO", state_name: "Colorado", state_rate: 0.029, county_rate: 0.01, city_rate: 0.035, special_rate: 0.011 },
  CT: { state: "CT", state_name: "Connecticut", state_rate: 0.0635, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
  DE: { state: "DE", state_name: "Delaware", state_rate: 0.0, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
  FL: { state: "FL", state_name: "Florida", state_rate: 0.06, county_rate: 0.01, city_rate: 0.0, special_rate: 0.0 },
  GA: { state: "GA", state_name: "Georgia", state_rate: 0.04, county_rate: 0.03, city_rate: 0.01, special_rate: 0.0 },
  HI: { state: "HI", state_name: "Hawaii", state_rate: 0.04, county_rate: 0.005, city_rate: 0.0, special_rate: 0.0 },
  ID: { state: "ID", state_name: "Idaho", state_rate: 0.06, county_rate: 0.0, city_rate: 0.01, special_rate: 0.0 },
  IL: { state: "IL", state_name: "Illinois", state_rate: 0.0625, county_rate: 0.01, city_rate: 0.0075, special_rate: 0.005 },
  IN: { state: "IN", state_name: "Indiana", state_rate: 0.07, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
  IA: { state: "IA", state_name: "Iowa", state_rate: 0.06, county_rate: 0.01, city_rate: 0.0, special_rate: 0.0 },
  KS: { state: "KS", state_name: "Kansas", state_rate: 0.065, county_rate: 0.01, city_rate: 0.015, special_rate: 0.0 },
  KY: { state: "KY", state_name: "Kentucky", state_rate: 0.06, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
  LA: { state: "LA", state_name: "Louisiana", state_rate: 0.0445, county_rate: 0.02, city_rate: 0.025, special_rate: 0.005 },
  ME: { state: "ME", state_name: "Maine", state_rate: 0.055, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
  MD: { state: "MD", state_name: "Maryland", state_rate: 0.06, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
  MA: { state: "MA", state_name: "Massachusetts", state_rate: 0.0625, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
  MI: { state: "MI", state_name: "Michigan", state_rate: 0.06, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
  MN: { state: "MN", state_name: "Minnesota", state_rate: 0.06875, county_rate: 0.005, city_rate: 0.005, special_rate: 0.0025 },
  MS: { state: "MS", state_name: "Mississippi", state_rate: 0.07, county_rate: 0.0, city_rate: 0.0007, special_rate: 0.0 },
  MO: { state: "MO", state_name: "Missouri", state_rate: 0.04225, county_rate: 0.015, city_rate: 0.02, special_rate: 0.008 },
  MT: { state: "MT", state_name: "Montana", state_rate: 0.0, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
  NE: { state: "NE", state_name: "Nebraska", state_rate: 0.055, county_rate: 0.005, city_rate: 0.014, special_rate: 0.0 },
  NV: { state: "NV", state_name: "Nevada", state_rate: 0.0685, county_rate: 0.01, city_rate: 0.0038, special_rate: 0.0 },
  NH: { state: "NH", state_name: "New Hampshire", state_rate: 0.0, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
  NJ: { state: "NJ", state_name: "New Jersey", state_rate: 0.06625, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
  NM: { state: "NM", state_name: "New Mexico", state_rate: 0.05, county_rate: 0.01, city_rate: 0.0163, special_rate: 0.0 },
  NY: { state: "NY", state_name: "New York", state_rate: 0.04, county_rate: 0.0425, city_rate: 0.0, special_rate: 0.00375 },
  NC: { state: "NC", state_name: "North Carolina", state_rate: 0.0475, county_rate: 0.0225, city_rate: 0.0, special_rate: 0.0 },
  ND: { state: "ND", state_name: "North Dakota", state_rate: 0.05, county_rate: 0.005, city_rate: 0.015, special_rate: 0.0 },
  OH: { state: "OH", state_name: "Ohio", state_rate: 0.0575, county_rate: 0.0125, city_rate: 0.0, special_rate: 0.005 },
  OK: { state: "OK", state_name: "Oklahoma", state_rate: 0.045, county_rate: 0.0135, city_rate: 0.0355, special_rate: 0.0 },
  OR: { state: "OR", state_name: "Oregon", state_rate: 0.0, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
  PA: { state: "PA", state_name: "Pennsylvania", state_rate: 0.06, county_rate: 0.01, city_rate: 0.01, special_rate: 0.0 },
  RI: { state: "RI", state_name: "Rhode Island", state_rate: 0.07, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
  SC: { state: "SC", state_name: "South Carolina", state_rate: 0.06, county_rate: 0.01, city_rate: 0.005, special_rate: 0.0 },
  SD: { state: "SD", state_name: "South Dakota", state_rate: 0.042, county_rate: 0.0, city_rate: 0.019, special_rate: 0.0 },
  TN: { state: "TN", state_name: "Tennessee", state_rate: 0.07, county_rate: 0.02, city_rate: 0.0025, special_rate: 0.0 },
  TX: { state: "TX", state_name: "Texas", state_rate: 0.0625, county_rate: 0.005, city_rate: 0.01, special_rate: 0.005 },
  UT: { state: "UT", state_name: "Utah", state_rate: 0.0485, county_rate: 0.0125, city_rate: 0.011, special_rate: 0.0 },
  VT: { state: "VT", state_name: "Vermont", state_rate: 0.06, county_rate: 0.007, city_rate: 0.0, special_rate: 0.0 },
  VA: { state: "VA", state_name: "Virginia", state_rate: 0.053, county_rate: 0.01, city_rate: 0.007, special_rate: 0.0 },
  WA: { state: "WA", state_name: "Washington", state_rate: 0.065, county_rate: 0.015, city_rate: 0.0125, special_rate: 0.003 },
  WV: { state: "WV", state_name: "West Virginia", state_rate: 0.06, county_rate: 0.0, city_rate: 0.005, special_rate: 0.0 },
  WI: { state: "WI", state_name: "Wisconsin", state_rate: 0.05, county_rate: 0.005, city_rate: 0.001, special_rate: 0.0 },
  WY: { state: "WY", state_name: "Wyoming", state_rate: 0.04, county_rate: 0.015, city_rate: 0.0, special_rate: 0.0 },
  DC: { state: "DC", state_name: "District of Columbia", state_rate: 0.06, county_rate: 0.0, city_rate: 0.0, special_rate: 0.0 },
};

/** Round to 4 decimal places to avoid floating-point noise like 0.08750000001. */
function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

export function combinedRate(r: RateBreakdown): number {
  return round4(r.state_rate + r.county_rate + r.city_rate + r.special_rate);
}

/** All supported state codes, sorted. */
export function supportedStates(): string[] {
  return Object.keys(STATE_RATES).sort();
}

export function isSupportedState(stateCode: string): boolean {
  return !!stateCode && stateCode.trim().toUpperCase() in STATE_RATES;
}

/**
 * Look up rates for a state code. Returns null if we do not have data for it,
 * so the caller can decide how to respond (e.g. 404 vs. a default).
 */
export function lookupByState(stateCode: string): StateRate | null {
  if (!stateCode) return null;
  return STATE_RATES[stateCode.trim().toUpperCase()] ?? null;
}
