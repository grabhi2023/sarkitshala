import { SignJWT, jwtVerify } from 'jose';
import { ADMIN_EMAILS, SESSION_TTL_SECONDS } from '@/lib/config';

function secretKey() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_JWT_SECRET must be at least 32 characters');
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(email) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] });
    const email = String(payload.email || '').toLowerCase();
    if (!ADMIN_EMAILS.includes(email)) return null;
    return email;
  } catch {
    return null;
  }
}