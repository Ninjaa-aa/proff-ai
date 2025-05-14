import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Admin routes protection
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Protected routes for authenticated users
    if (path.startsWith("/chatbot") && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Subscription required routes
    if (path.startsWith("/premium") && token?.subscription !== "pro") {
      return NextResponse.redirect(new URL("/pricing", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/chatbot/:path*",
    "/premium/:path*",
    "/api/chat-sessions/:path*",
    "/api/admin/:path*"
  ]
}; 