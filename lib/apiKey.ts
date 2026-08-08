/**
 * The public demo API key.
 *
 * This is intentionally NOT a secret: it is printed in the API docs and used by
 * the landing-page playground so anyone can try the API without signing up.
 * A real product would issue per-customer keys from the dashboard and keep them
 * private. For this take-home scaffold, one shared demo key keeps things simple.
 *
 * Because it is referenced by client components (the playground), it is read
 * from a NEXT_PUBLIC_* variable so it is safe to expose in the browser.
 */
export const DEMO_API_KEY =
  process.env.NEXT_PUBLIC_DEMO_API_KEY ?? "demo_sk_taxrate_public";
