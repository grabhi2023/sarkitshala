import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { guard } from '@/lib/guard';
import { CATEGORIES } from '@/lib/config';
import { isValidSlug } from '@/lib/slug';
import { json } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const draft = await draftMode();

  if (searchParams.get('exit')) {
    draft.disable();
    redirect('/admin');
  }

  const auth = await guard(request);
  if (auth.error) return auth.error;

  const category = searchParams.get('category') || '';
  const slug = searchParams.get('slug') || '';
  if (!Object.hasOwn(CATEGORIES, category) || !isValidSlug(slug)) {
    return json({ message: 'Invalid category or slug' }, 400);
  }

  draft.enable();
  redirect(`/${category}/${slug}`);
}