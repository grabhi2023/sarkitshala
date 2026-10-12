import dbConnect from '@/lib/databaseConnect';
import Post from '@/models/Post';
import { guard } from '@/lib/guard';
import { CATEGORIES, DIFFICULTIES } from '@/lib/config';
import { json } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toInt = (value, fallback, min, max) => {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, min), max);
};

export async function GET(request) {
  const auth = await guard(request);
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const filter = {};

    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const difficulty = searchParams.get('difficulty');
    const q = (searchParams.get('q') || '').trim().slice(0, 100);

    if (category && CATEGORIES[category]) filter.category = category;
    if (status === 'draft' || status === 'published') filter.status = status;
    if (difficulty && DIFFICULTIES.includes(difficulty)) filter.difficulty = difficulty;
    if (q) {
      const pattern = new RegExp(escapeRegex(q), 'i');
      filter.$or = [{ title: pattern }, { slug: pattern }];
    }

    const limit = toInt(searchParams.get('limit'), DEFAULT_LIMIT, 1, MAX_LIMIT);
    const page = toInt(searchParams.get('page'), 1, 1, 100000);

    await dbConnect();

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .select('title slug category difficulty status order updatedAt publishedAt readingTime importWarnings')
        .sort({ updatedAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
    ]);

    return json({ posts, page, limit, total, pages: Math.max(Math.ceil(total / limit), 1) });
  } catch (error) {
    console.error('list posts failed:', error.message);
    return json({ message: 'Server error' }, 500);
  }
}