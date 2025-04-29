import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const pathname = request.nextUrl.pathname;

  console.log('➡️ Middleware triggered on:', pathname);
  console.log('🧠 Session:', sessionCookie);

  const isLoginPage = pathname === '/auth/login';
  const isRootPage = pathname === '/';
  const isLandingPage = pathname === '/landingPage';

  const publicPages = ['/auth/login', '/auth/register', '/landingPage'];

  if (sessionCookie && isLoginPage) {
    // Already logged in, avoid login page
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!sessionCookie && !publicPages.includes(pathname)) {
    // Not logged in, trying to access dashboard or root → redirect to landing page
    return NextResponse.redirect(new URL('/landingPage', request.url));
  }

  if (sessionCookie && isRootPage) {
    // Logged in and visiting "/", send to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!sessionCookie && isRootPage) {
    // Not logged in and visiting "/", send to landing page
    return NextResponse.redirect(new URL('/landingPage', request.url));
  }

  return NextResponse.next();
}

// ✅ Include both /dashboard and /
export const config = {
  matcher: ['/dashboard/:path*', '/'],
};

