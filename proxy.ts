import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"
 
const { auth: proxy } = NextAuth(authConfig)

const privateRoutes = [
    "/dashboard",
    ]

export default proxy(async (req) => {
    const isLoggedIn = !!req.auth;
    const {nextUrl} = req;

    const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
    const isAuthRoute = nextUrl.pathname.includes("/auth");
    const isApiRoute = nextUrl.pathname.includes("/api");


    if(isApiRoute) return Promise.resolve();
    if(isAuthRoute) return Promise.resolve();
    if(isPrivateRoute && !isLoggedIn) return NextResponse.redirect(new URL('/auth/signin', req.url));
    if(!isPrivateRoute && isLoggedIn) return NextResponse.redirect(new URL('/dashboard', req.url));
    return Promise.resolve();


})




export const config = { matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"] }