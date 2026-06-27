import { NextResponse, type NextRequest } from "next/server";
import {
  protectedPathRoles,
  roleHomePath,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedPath = protectedPathRoles.find(({ path }) =>
    pathname.startsWith(path),
  );
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL(roleHomePath[session.role], request.url));
  }

  if (!protectedPath) {
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (session.role !== protectedPath.role) {
    return NextResponse.redirect(new URL(roleHomePath[session.role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portaria/:path*", "/morador/:path*", "/login"],
};
