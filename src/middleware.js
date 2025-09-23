import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Allow requests for API, static files, and auth pages
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.includes('.') || // Assume files with extensions are static assets
    ['/', '/login', '/register', '/profile-setup'].includes(pathname)
  ) {
    return NextResponse.next();
  }

  // If user is not authenticated, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If user is authenticated but profile is not complete, redirect to onboarding
  if (token && !token.profileComplete && pathname !== '/onboarding') {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  // If user is authenticated and profile is complete, but they are trying to access onboarding, redirect to dashboard
  if (token && token.profileComplete && (pathname === '/onboarding' || pathname === '/profile-setup')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // Always redirect authenticated users to dashboard after login
  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
    */
    '/((?!api|_next/static|_next/image|favicon.ico).)*',
  ],
};