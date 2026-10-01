import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token =
    req.cookies.get("accessToken")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  // Public routes that do NOT require authentication
  const publicPaths = ["/admin/login"];

  const { pathname } = req.nextUrl;

  // If route is public → allow
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // If route is protected and no token → redirect to login
  if (!token) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // If token exists → continue
  return NextResponse.next();
}

// ✅ Apply middleware to specific routes
export const config = {
  matcher: [
    "/admin/:path*", // protect all admin pages
  ],
};
