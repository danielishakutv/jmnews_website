import { NextResponse, type NextRequest } from "next/server";

/**
 * Two jobs:
 *
 * 1. Surface the current pathname to server components via the `x-pathname`
 *    request header — used by `app/layout.tsx` to decide whether to render
 *    public chrome (Header/Footer/Ticker) or the bare shell for /admin/*.
 *
 * 2. Gate `/admin/*` behind a session cookie. Unauthenticated requests are
 *    redirected to `/admin/login`. The login route itself is open. Phase 2
 *    ships with a stub session reader; Phase 2 final wires WPGraphQL JWT.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  // Dashboard auth gate
  const isDashboard = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";
  if (isDashboard && !isLoginRoute) {
    const session = req.cookies.get("jm_session")?.value;
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  // Skip Next internals and static asset routes — middleware would just add
  // latency for those.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|manifest.webmanifest).*)",
  ],
};
