import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"

const { auth: proxy } = NextAuth(authConfig)

const privateRoutes = ["/", "/dashboard"]
const authRoutes = ["/auth/signin", "/auth/signup"]

export default proxy(async (req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
  const isAuthRoute = nextUrl.pathname.startsWith("/auth");
  const isApiRoute = nextUrl.pathname.startsWith("/api");

  // API routes — return 401 if not logged in
  if (isApiRoute) {
    if (!isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.next();
  }

  // Auth routes (signin/signup) — redirect to dashboard if already logged in
  if (isAuthRoute) {
    if (isLoggedIn) return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.next();
  }

  // Private routes — redirect to signin if not logged in
  if (isPrivateRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/auth/signin", req.url));
    return NextResponse.next();
  }

  // Everything else — just pass through
  return NextResponse.next();
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}