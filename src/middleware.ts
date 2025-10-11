import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeFirebaseAdmin } from '@/firebase/server';

async function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    initializeFirebaseAdmin();
    const decodedToken = await getAuth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = await getAuthenticatedUser(request);

  const isAuthPage = pathname.startsWith('/admin/login');

  if (isAuthPage) {
    if (user) {
      // If user is logged in, redirect from login page to dashboard
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Allow access to login page if not logged in
    return NextResponse.next();
  }

  // Protect all other /admin routes
  if (pathname.startsWith('/admin')) {
    if (!user) {
      // If user is not logged in, redirect to login page
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // For non-admin pages or authenticated admin pages, proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
