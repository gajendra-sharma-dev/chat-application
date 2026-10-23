import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const publishPath = path === "/login" || path === "/signup";

  const token = request.cookies.get("token")?.value || "";

  if (publishPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
  if (!publishPath && !token) {
    return NextResponse.redirect(new URL("/sign-up", request.nextUrl));
  }
}

export const config = {
  matcher: ["/", "/login", "/sign-up", "/dashboard", "/logout"],
};
