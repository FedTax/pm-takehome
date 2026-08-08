import { NextRequest, NextResponse } from "next/server";

/**
 * Protect the dashboard. If there is no session cookie, bounce to /login.
 * (The dashboard page double-checks this too.)
 */
export function middleware(req: NextRequest) {
  const loggedIn = req.cookies.get("tr_session")?.value === "ok";
  if (!loggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
