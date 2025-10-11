
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // This is a temporary fix to allow access without authentication.
  // We will restore authentication later.
  // return NextResponse.next();

  let response = await updateSession(request)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          request.cookies.set(name, value, options)
          response.cookies.set(name, value, options)
        },
        remove: (name, options) => {
          request.cookies.set(name, '', options)
          response.cookies.set(name, '', options)
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  if (!session && pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (session && pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
