/**
 * Server-only auth helpers for the web app login.
 *
 * This is deliberately trivial: a single hardcoded password gates the
 * dashboard. Do NOT model a real auth system on this. It exists only so the
 * demo has a "logged-in" experience for showing plan / trial state.
 */
import "server-only";

/** The password accepted by the /login screen. */
export const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "letmein";

/** Constant-ish check kept in one place so it is easy to find and change. */
export function isValidPassword(input: string): boolean {
  return typeof input === "string" && input === DEMO_PASSWORD;
}
