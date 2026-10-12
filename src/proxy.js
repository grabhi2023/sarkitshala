import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/session';
import { SESSION_COOKIE } from '@/lib/config';

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const isOpen = pathname === '/admin/login' || pathname.startsWith('/api/admin/auth/');
  if (isOpen) {
    const res = NextResponse.next();
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const email = token ? await verifySession(token) : null;

  if (email) {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};