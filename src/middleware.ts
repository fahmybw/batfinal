import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefix = "/app";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (!path.startsWith(protectedPrefix)) return NextResponse.next();

  const token = req.cookies.get(process.env.SESSION_COOKIE_NAME ?? "bat_session")?.value;
  if (!token) return NextResponse.redirect(new URL("/auth/sign-in", req.url));

  const twoFactor = req.cookies.get("bat_2fa")?.value;
  if (twoFactor !== "verified" && path !== "/auth/verify-2fa") {
    return NextResponse.redirect(new URL("/auth/verify-2fa", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/app/:path*"] };
