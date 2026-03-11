import { NextRequest, NextResponse } from "next/server";

const LOGIN_URL = "/auth/login";

const SITTER_PREFIXES = [
  "/bookings",
  "/calendar",
  "/payout",
  "/petsitter-profile",
];

const OWNER_PREFIXES = [
  "/booking-history",
  "/change-password",
  "/pets",
  "/user-profile",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isSitterRoute = SITTER_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  const isOwnerRoute = OWNER_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  if (!isSitterRoute && !isOwnerRoute) return NextResponse.next();

  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    const loginUrl = new URL(LOGIN_URL, request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = request.cookies.get("userRole")?.value;

  if (isOwnerRoute && role !== "owner") {
    return NextResponse.redirect(new URL("/petsitter-profile", request.url));
  }

  if (isSitterRoute && role !== "sitter") {
    return NextResponse.redirect(new URL("/user-profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/bookings/:path*",
    "/calendar/:path*",
    "/payout/:path*",
    "/petsitter-profile/:path*",
    "/booking-history/:path*",
    "/change-password/:path*",
    "/pets/:path*",
    "/user-profile/:path*",
  ],
};
