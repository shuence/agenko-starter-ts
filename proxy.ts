import { type NextRequest, NextResponse } from "next/server";
import { DEMO_COOKIE } from "@/lib/auth";

/**
 * Dummy gate for the demo. Real apps should verify a session here
 * (or in the page/layout) — see the Next.js authentication guide.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.get(DEMO_COOKIE)?.value) return NextResponse.next();

  const login = new URL("/login", request.url);
  login.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/chat/:path*"],
};
