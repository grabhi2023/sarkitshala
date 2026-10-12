import { isAllowedEmail, normalizeEmail, safeEqual } from '@/lib/auth';
import { signSession } from '@/lib/session';
import { LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS, SESSION_COOKIE, SESSION_TTL_SECONDS } from '@/lib/config';
import { json, readJson } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_TRACKED = 5000;
const FAILURE_DELAY_MS = 500;

const attempts = globalThis._adminLoginAttempts || (globalThis._adminLoginAttempts = new Map());

function clientId(request) {
  const forwarded = request.headers.get('x-forwarded-for') || '';
  return forwarded.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
}

function isSameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function retryAfterSeconds(id) {
  const record = attempts.get(id);
  if (!record) return 0;
  const elapsed = Date.now() - record.start;
  if (elapsed > LOGIN_WINDOW_MS) {
    attempts.delete(id);
    return 0;
  }
  return record.count >= LOGIN_MAX_ATTEMPTS ? Math.ceil((LOGIN_WINDOW_MS - elapsed) / 1000) : 0;
}

function recordFailure(id) {
  const now = Date.now();
  const record = attempts.get(id);
  if (!record || now - record.start > LOGIN_WINDOW_MS) {
    attempts.set(id, { start: now, count: 1 });
  } else {
    record.count += 1;
  }
  if (attempts.size > MAX_TRACKED) {
    for (const [key, value] of attempts) {
      if (now - value.start > LOGIN_WINDOW_MS) attempts.delete(key);
    }
  }
}

export async function GET() {
  return json({ keyRequired: Boolean(process.env.ADMIN_ACCESS_KEY) });
}

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return json({ ok: false, message: 'Request not allowed' }, 403);
  }

  const id = clientId(request);
  const wait = retryAfterSeconds(id);
  if (wait > 0) {
    return json(
      { ok: false, message: `Too many failed attempts. Try again in ${Math.ceil(wait / 60)} minute(s)` },
      429,
      { 'Retry-After': String(wait) }
    );
  }

  const body = await readJson(request);
  const email = normalizeEmail(String(body.email ?? '').slice(0, 254));
  const accessKey = String(body.accessKey ?? '').slice(0, 256);

  const requiredKey = process.env.ADMIN_ACCESS_KEY;
  const emailOk = isAllowedEmail(email);
  const keyOk = requiredKey ? safeEqual(accessKey, requiredKey) : true;

  if (!emailOk || !keyOk) {
    recordFailure(id);
    await new Promise((resolve) => setTimeout(resolve, FAILURE_DELAY_MS));
    return json(
      { ok: false, message: requiredKey ? 'Incorrect email or access key' : 'This email is not authorised' },
      401
    );
  }

  let token;
  try {
    token = await signSession(email);
  } catch (error) {
    console.error('session sign failed:', error.message);
    return json({ ok: false, message: 'Server error' }, 500);
  }

  attempts.delete(id);

  const res = json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}