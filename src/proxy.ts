import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

//    DEV MODE: All protected paths are commented out — every route is freely accessible.
//    When ready for production:
//      1. Uncomment the paths in PROTECTED_PREFIXES and matcher below.

// Routes that require authentication
const PROTECTED_PREFIXES: string[] = [
  // "/user-profile",
  // "/booking-history",
  // "/change-password",
  // "/pets",
  // "/bookings",
  // "/calendar",
  // "/payout",
  // "/petsitter-profile",
];

// Where to send unauthenticated users
const LOGIN_URL = "/auth/login";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run on protected paths (belt-and-suspenders check alongside matcher)
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  if (!isProtected) return NextResponse.next();

  const response = NextResponse.next();

  // Build a Supabase SSR client that reads cookies from the request
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  try {
    // getUser() validates the session against Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL(LOGIN_URL, request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    // If Supabase is unreachable, redirect to login rather than crashing
    const loginUrl = new URL(LOGIN_URL, request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // "/user-profile/:path*",
    // "/booking-history/:path*",
    // "/change-password/:path*",
    // "/pets/:path*",
    // "/bookings/:path*",
    // "/calendar/:path*",
    // "/payout/:path*",
    // "/petsitter-profile/:path*",
  ],
};
