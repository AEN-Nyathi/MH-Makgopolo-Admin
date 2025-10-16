import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');

  // Redirect the root path to the admin dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // If the user is trying to access the admin area but has no session cookie,
  // redirect them to the login page.
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !sessionCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If the user is logged in and tries to access the login page,
  // redirect them to the admin dashboard.
  if (pathname.startsWith('/admin/login') && sessionCookie) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|logo.png|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
