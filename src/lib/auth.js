import crypto from 'crypto';
import { cookies } from 'next/headers';
import { ADMIN_EMAILS, SESSION_COOKIE } from '@/lib/config';
import { verifySession } from '@/lib/session';

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export function isAllowedEmail(value) {
  return ADMIN_EMAILS.includes(normalizeEmail(value));
}

export function safeEqual(a, b) {
  const hashA = crypto.createHash('sha256').update(String(a)).digest();
  const hashB = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export async function getAdminEmail() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}