import dbConnect from '@/lib/databaseConnect';
import Post from '@/models/Post';
import { getPostForRender } from '@/lib/posts';
import { buildPostMetadata } from '@/lib/seo';

const SITE = 'https://sarkitshala.com';
const FALLBACK_IMAGE = `${SITE}/opengraph-image.jpg`;

export const loadPost = getPostForRender;

export const postMetadata = (post) => buildPostMetadata(post);

export async function getPublishedSlugs(category) {
  try {
    await dbConnect();
    const rows = await Post.find({ category, status: 'published' }).select('slug').lean();
    return rows.map((row) => row.slug).filter(Boolean);
  } catch (error) {
    console.error(`published slugs failed for ${category}:`, error.message);
    return [];
  }
}

export async function getLegacy(fetcher) {
  try {
    return await fetcher();
  } catch (error) {
    if (String(error?.message).includes('API error 404')) return null;
    throw error;
  }
}

export function legacySlugs(response) {
  const list = Array.isArray(response)
    ? response
    : Array.isArray(response?.experiments)
      ? response.experiments
      : Array.isArray(response?.data)
        ? response.data
        : [];
  return list.map((item) => String(item?.slug || item?.Experiment || '')).filter(Boolean);
}

export function truncate(text, max = 160) {
  const value = String(text || '').replace(/\s+/g, ' ').trim();
  if (value.length <= max) return value;
  const cut = value.slice(0, max - 3);
  const space = cut.lastIndexOf(' ');
  return `${(space > 40 ? cut.slice(0, space) : cut).trim()}...`;
}

export function pageMetadata({ category, slug, title, ogTitle, description, image }) {
  const url = `${SITE}/${category}/${slug}`;
  const picture = image || FALLBACK_IMAGE;
  const social = ogTitle || title;

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: {
      title: social,
      description,
      url,
      siteName: 'Sarkitshala',
      type: 'article',
      images: [{ url: picture, width: 1200, height: 630, alt: social }],
    },
    twitter: {
      card: 'summary_large_image',
      title: social,
      description,
      images: [picture],
    },
  };
}