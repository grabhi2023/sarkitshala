import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

const NO_STORE = { 'Cache-Control': 'no-store' };

export function json(body, status = 200, headers = {}) {
  return NextResponse.json(body, { status, headers: { ...NO_STORE, ...headers } });
}

export async function readJson(request) {
  try {
    const body = await request.json();
    return body && typeof body === 'object' && !Array.isArray(body) ? body : {};
  } catch {
    return {};
  }
}

export function revalidatePost(category, slug) {
  revalidateTag('posts', { expire: 0 });
  if (slug) revalidatePath(`/${category}/${slug}`);
  revalidatePath(`/${category}`, 'layout');
  revalidatePath('/sitemap.xml');
}