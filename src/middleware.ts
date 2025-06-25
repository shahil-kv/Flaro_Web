// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/dashboard", "/profile"];
const publicPaths = ["/login", "/signup"];
const landingPath = "/";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
    const isLandingPath = pathname === landingPath;
    const accessToken = request.cookies.get("access_token")?.value;
    const isAuthenticated = !!accessToken;

    if (isAuthenticated) {
        if (isPublicPath) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        if (isProtectedPath || isLandingPath) {
            return NextResponse.next();
        }
    }

    if (!isAuthenticated) {
        if (isProtectedPath) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard/:path*", "/profile/:path*", "/login", "/signup"],
};