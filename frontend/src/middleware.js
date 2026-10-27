import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value; // asli cookie naam likho

  console.log("MIDDLEWARE:", path, "token:", !!token);

  const isAuthPage = path === "/login" || path === "/sign-up";

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (!isAuthPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/sign-up",
    "/dashboard/:path*",
    "/chat/:path*",
    "/profile/:path*",
  ],
};
