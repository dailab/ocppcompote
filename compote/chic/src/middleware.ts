import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAllowedPath, isPublicPath } from "./permissions";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (isPublicPath(path)) {
    return NextResponse.next();
  }

  const userCookie = cookies().get("user");

  if (!userCookie) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (!isAllowedPath(path, JSON.parse(userCookie.value))) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
