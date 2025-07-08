// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const isAuthPage = req.nextUrl.pathname.startsWith('/signin') || req.nextUrl.pathname.startsWith('/signup');
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/profile') || req.nextUrl.pathname.startsWith('/cart');

  // Redirect logged-in users away from /signin or /signup
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Block unauthenticated users from /dashboard
  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  return NextResponse.next();
}

// 🔁 Enable middleware only for these routes
export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/signup', '/profile', '/cart'],
};
