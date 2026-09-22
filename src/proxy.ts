/**
 * Next.js Proxy / Route Handler Guard (Next.js 16+)
 *
 * Handles:
 * 1. Route protection (auth checks)
 * 2. Admin route protection (admin role check)
 * 3. Request ID injection for observability
 * 4. Maintenance mode
 */

import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/account",
  "/checkout",
];

// Routes that require admin access
const ADMIN_ROUTES = ["/admin"];

// Routes only accessible to guests (redirect authenticated users)
const GUEST_ONLY_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
];

export default auth(async (req) => {
  const { nextUrl, auth: session } = req;
  const path = nextUrl.pathname;
  const requestId = nanoid(12);

  // Inject request ID header for tracing
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-request-id", requestId);

  // Check maintenance mode
  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";
  if (
    maintenanceMode &&
    !path.startsWith("/admin") &&
    !path.startsWith("/api/admin") &&
    path !== "/maintenance"
  ) {
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }

  // Admin route protection
  if (ADMIN_ROUTES.some((route) => path.startsWith(route))) {
    if (!session?.user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", path);
      loginUrl.searchParams.set("reason", "admin_required");
      return NextResponse.redirect(loginUrl);
    }

    const adminRoles = [
      "SUPER_ADMIN",
      "ADMIN",
      "PRODUCT_MANAGER",
      "ORDER_MANAGER",
      "SUPPORT_AGENT",
      "CONTENT_MANAGER",
      "FINANCE_MANAGER",
    ];

    const isAdmin =
      session.user.isAdmin ||
      session.user.roles?.some((r: string) => adminRoles.includes(r));

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/403", req.url));
    }
  }

  // Protected customer routes
  if (PROTECTED_ROUTES.some((route) => path.startsWith(route))) {
    if (path.startsWith("/account") && !session?.user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Guest-only routes
  if (GUEST_ONLY_ROUTES.some((route) => path.startsWith(route))) {
    if (session?.user) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest|robots.txt|sitemap.xml).*)",
  ],
};
