

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;


  if (pathname.startsWith('/.well-known')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}
