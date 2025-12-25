import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /cart for authenticated users only
  if (pathname.startsWith("/cart")) {
    const hasSession =
      req.cookies.get("next-auth.session-token") ||
      req.cookies.get("__Secure-next-auth.session-token");

    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart"],
};
