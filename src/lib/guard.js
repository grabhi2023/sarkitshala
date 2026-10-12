import { NextResponse } from 'next/server';
import { getAdminEmail } from '@/lib/auth';

export async function guard(request) {
  const email = await getAdminEmail();
  if (!email) {
    return { error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const origin = request.headers.get('origin');
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    let originHost = null;
    try {
      originHost = origin ? new URL(origin).host : null;
    } catch {
      originHost = null;
    }
    if (!originHost || originHost !== host) {
      return { error: NextResponse.json({ message: 'Forbidden' }, { status: 403 }) };
    }
  }

  return { email };
}