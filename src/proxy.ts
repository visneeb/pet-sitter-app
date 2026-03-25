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

const ADMIN_PREFIXES = ["/pet-owner", "/pet-sitter", "/report"];
const CHAT_PREFIXES = ["/chat"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isSitterRoute = SITTER_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  const isOwnerRoute = OWNER_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  const isAdminRoute = ADMIN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  const isChatRoute = CHAT_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  if (!isSitterRoute && !isOwnerRoute && !isAdminRoute && !isChatRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    const loginUrl = new URL(LOGIN_URL, request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = request.cookies.get("userRole")?.value;
  const isSitterRole = role === "sitter" || role === "petsitter";

  if (role === "admin") {
    if (!isAdminRoute) {
      return NextResponse.redirect(new URL("/admin/pet-owner", request.url));
    }
    return NextResponse.next();
  }

  if (isOwnerRoute && role !== "owner") {
    return NextResponse.redirect(new URL("/petsitter-profile", request.url));
  }

  if (isSitterRoute && !isSitterRole) {
    return NextResponse.redirect(new URL("/user-profile", request.url));
  }

  if (isChatRoute && role !== "owner" && !isSitterRole) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAdminRoute) {
    return NextResponse.redirect(new URL("/", request.url));
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
    "/chat",
    "/chat/:path*",
    "/pets/:path*",
    "/user-profile/:path*",
    "/pet-owner/:path*",
    "/pet-sitter/:path*",
    "/report/:path*",
  ],
};
