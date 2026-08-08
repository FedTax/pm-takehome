/**
 * Cookie-based "session" for the demo. There is no database — the login screen
 * simply sets two cookies:
 *
 *   tr_session      = "ok"                (marks the browser as logged in)
 *   tr_trial_start  = ISO date string     (when the 30-day Basic trial began)
 *
 * The trial start is stamped at first login so the dashboard can show a real,
 * counting-down "days left in trial" number. That trial state is exactly what
 * Goal 1 asks you to reimagine as a free tier.
 */
import "server-only";
import { cookies } from "next/headers";
import { TRIAL } from "./plans";

const SESSION_COOKIE = "tr_session";
const TRIAL_COOKIE = "tr_trial_start";

export interface TrialStatus {
  planName: string;
  totalDays: number;
  daysLeft: number;
  expired: boolean;
  startedAt: string;
}

/** Mark the browser as logged in and start the trial clock if not already set. */
export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, "ok", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  if (!store.get(TRIAL_COOKIE)) {
    store.set(TRIAL_COOKIE, new Date().toISOString(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 60,
    });
  }
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  // Note: we intentionally keep tr_trial_start so logging back in resumes the
  // same trial clock rather than restarting it.
}

export async function isLoggedIn(): Promise<boolean> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value === "ok";
}

/** Compute how much of the 30-day Basic trial is left. */
export async function getTrialStatus(): Promise<TrialStatus> {
  const store = await cookies();
  const startedAt = store.get(TRIAL_COOKIE)?.value ?? new Date().toISOString();
  const start = new Date(startedAt).getTime();
  const elapsedDays = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, TRIAL.lengthDays - elapsedDays);
  return {
    planName: TRIAL.planName,
    totalDays: TRIAL.lengthDays,
    daysLeft,
    expired: daysLeft <= 0,
    startedAt,
  };
}
