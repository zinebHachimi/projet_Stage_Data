import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/features/auth/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let Next.js handle internal files, public assets, static files, and next images
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Retrieve the session cookie
  const sessionCookie = request.cookies.get("agentic_session")?.value;
  const session = sessionCookie ? await verifySession(sessionCookie) : null;
  const isAuthenticated = !!session;

  // Define route checks
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isApiAuth = pathname.startsWith("/api/auth");
  const isApiRoute = pathname.startsWith("/api/");
  const isAdminRoute = pathname.startsWith("/admin");

  // If user is authenticated and tries to visit /login or /register, redirect to appropriate home page.
  if (isAuthenticated && isAuthPage) {
    const role = session?.role;
    if (role === "VIEWER") {
      return NextResponse.redirect(new URL("/admin/profile", request.url));
    }
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // If user is NOT authenticated:
  if (!isAuthenticated) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 1. If it's a private API route, return 401 Unauthorized
    if (isApiRoute && !isApiAuth) {
      return new NextResponse(
        JSON.stringify({ error: { message: "Unauthorized. Please log in." } }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // If user IS authenticated, enforce RBAC:
  if (isAuthenticated && isAdminRoute) {
    const role = session?.role;
    
    // VIEWER (Candidate/User)
    if (role === "VIEWER") {
      // Allowed only: /admin/profile, /admin/kanban, /admin/calendar
      const allowedPaths = ["/admin/profile", "/admin/kanban", "/admin/calendar"];
      const isAllowed = allowedPaths.some(p => pathname === p || pathname.startsWith(p + "/"));
      if (!isAllowed) {
        return NextResponse.redirect(new URL("/admin/profile", request.url));
      }
    }
    
    // ANALYST (Recruiter/RH)
    if (role === "ANALYST") {
      // Allowed: /admin, /admin/profile, /admin/kanban, /admin/calendar, /admin/ai/chat
      // NOT allowed: /admin/errors, /admin/analytics (or any admin-only page)
      const deniedPaths = ["/admin/errors", "/admin/analytics"];
      const isDenied = deniedPaths.some(p => pathname === p || pathname.startsWith(p + "/"));
      if (isDenied) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except actual static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico|static).*)"],
};
