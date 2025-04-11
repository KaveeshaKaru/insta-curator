import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is a dashboard route
  const isDashboardRoute = pathname.startsWith("/dashboard")

  // Get the authentication status from the request headers
  const isAuthenticated = request.cookies.get("isAuthenticated")?.value === "true"

  // If trying to access dashboard without being logged in, redirect to home
  if (isDashboardRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// Configure which routes the middleware runs on
export const config = {
  matcher: ["/dashboard/:path*"],
}

