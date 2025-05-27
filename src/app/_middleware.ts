'use client'
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const protectedPaths = ["/dashboard", "/profile"];
    const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));
    const accessToken = request.cookies.get("access_token")?.value;

    if (isProtectedPath && !accessToken) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*"],
};