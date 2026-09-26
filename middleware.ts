import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const isTrial = req.nextUrl.searchParams.get("trial") === "true";

  // Protected paths check
  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    (pathname.startsWith("/test") && !isTrial) ||
    pathname.startsWith("/checkout");

  if (isProtectedPath) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // 1. Unauthenticated user -> Redirect to /login with callbackUrl
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Admin route protection -> Strictly ADMIN role
    if (pathname.startsWith("/admin")) {
      if (token.role !== "ADMIN") {
        // Unauthorized student accessing /admin -> redirect to /
        const homeUrl = new URL("/", req.url);
        return NextResponse.redirect(homeUrl);
      }
    }
  }

  // 3. Auth pages (login / register): Redirect already-authenticated users
  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token) {
      if (token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/test/:path*",
    "/checkout/:path*",
    "/login",
    "/register",
  ],
};
