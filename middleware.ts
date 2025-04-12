import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const pathname = request.nextUrl.pathname;

  console.log('➡️ Middleware triggered on:', pathname);
  console.log('🧠 Session:', sessionCookie);

  const isLoginPage = pathname === '/auth/login';
  const isRootPage = pathname === '/';

  const publicPages = ['/auth/login', '/auth/register','/landingPage'];

  if (sessionCookie && isLoginPage) {
    // Already logged in, avoid login page
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!sessionCookie && !publicPages.includes(pathname)) {
    // Not logged in, trying to access dashboard or root → redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (sessionCookie && isRootPage) {
    // Logged in and visiting "/", send to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// ✅ Include both /dashboard and /
export const config = {
  matcher: ['/dashboard/:path*', '/'],
};

