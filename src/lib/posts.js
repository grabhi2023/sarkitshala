import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { draftMode } from 'next/headers';
import dbConnect from '@/lib/databaseConnect';
import Post from '@/models/Post';
import { CATEGORIES } from '@/lib/config';
import { isValidSlug } from '@/lib/slug';

const plain = (value) => (value ? JSON.parse(JSON.stringify(value)) : null);
const CACHE_OPTIONS = { tags: ['posts'], revalidate: false };

const publishedPost = unstable_cache(
  async (category, slug) => {
    await dbConnect();
    const doc = await Post.findOne({ category, slug, status: 'published' }).lean();
    return plain(doc);
  },
  ['post-by-slug'],
  CACHE_OPTIONS
);

const sidebarPosts = unstable_cache(
  async (category) => {
    await dbConnect();
    const rows = await Post.find({ category, status: 'published' })
      .select('slug title difficulty order')
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return plain(rows) || [];
  },
  ['sidebar-posts'],
  CACHE_OPTIONS
);

const relatedPosts = unstable_cache(
  async (category, slug, tagsKey, difficulty) => {
    await dbConnect();
    const tags = tagsKey ? tagsKey.split('|') : [];
    const rows = await Post.find({
      category,
      status: 'published',
      slug: { $ne: slug },
      $or: [{ tags: { $in: tags } }, { difficulty }],
    })
      .select('slug title tags difficulty')
      .limit(30)
      .lean();

    const scored = rows
      .map((row) => ({
        slug: row.slug,
        title: row.title,
        score: (row.tags || []).filter((t) => tags.includes(t)).length * 2 + (row.difficulty === difficulty ? 1 : 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    return plain(scored) || [];
  },
  ['related-posts'],
  CACHE_OPTIONS
);

export const getPostForRender = cache(async (category, slug) => {
  if (!CATEGORIES[category] || typeof slug !== 'string' || !isValidSlug(slug)) return null;
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    await dbConnect();
    return plain(await Post.findOne({ category, slug }).lean());
  }
  return publishedPost(category, slug);
});

export function getSidebarPosts(category) {
  return sidebarPosts(category);
}

export function getRelatedPosts(post) {
  return relatedPosts(post.category, post.slug, (post.tags || []).join('|'), post.difficulty);
}