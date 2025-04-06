import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is a dashboard route
  const isDashboardRoute = pathname.startsWith("/dashboard")

  // Get the token from the request
  const token = await getToken({ req: request })

  // If trying to access dashboard without being logged in, redirect to home
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// Configure which routes the middleware runs on
export const config = {
  matcher: ["/dashboard/:path*"],
}

