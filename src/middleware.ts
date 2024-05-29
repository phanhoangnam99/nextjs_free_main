import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePath = ["/me"];
const authPath = ["/login", "/register"];

const productEditRegex = /^\/products\/\d+\/edit$/;
export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("sessionToken")?.value;

  const { pathname } = request.nextUrl;
  if (privatePath.some((path) => pathname.startsWith(path)) && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (authPath.some((path) => pathname.startsWith(path)) && sessionToken) {
    return NextResponse.redirect(new URL("/me", request.url));
  }

  if (pathname.match(productEditRegex) && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/register", "/me", "/products/:path*"],
};
