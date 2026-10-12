import dbConnect from '@/lib/databaseConnect';
import Post from '@/models/Post';
import { Arduino } from '@/models/arduinomodels';
import { Esp } from '@/models/espmodel';
import { Respberry } from '@/models/resberymodel';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 3600;

const STATIC_PAGES = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/arduino', priority: 1, changeFrequency: 'weekly' },
  { path: '/raspberry', priority: 1, changeFrequency: 'weekly' },
  { path: '/esp', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/jetson', priority: 0.7, changeFrequency: 'monthly' },
];

const SOURCES = [
  { model: Arduino, category: 'arduino', priority: 0.9 },
  { model: Respberry, category: 'raspberry', priority: 0.9 },
  { model: Esp, category: 'esp', priority: 0.8 },
];

const PRIORITY = { arduino: 0.9, raspberry: 0.9, esp: 0.8 };

function entry(url, priority, lastModified) {
  const item = { url, changeFrequency: 'weekly', priority };
  if (lastModified) item.lastModified = new Date(lastModified);
  return item;
}

async function legacyEntries({ model, category, priority }) {
  try {
    const rows = await model.find({}, { slug: 1, updatedAt: 1, _id: 0 }).lean();
    return rows
      .filter((row) => typeof row.slug === 'string' && row.slug.trim())
      .map((row) => entry(`${SITE_URL}/${category}/${row.slug.trim()}`, priority, row.updatedAt));
  } catch (error) {
    console.error(`sitemap: ${category} legacy read failed:`, error.message);
    return [];
  }
}

async function newPostEntries() {
  try {
    const rows = await Post.find({ status: 'published' }).select('category slug updatedAt').lean();
    return rows.map((row) => entry(`${SITE_URL}/${row.category}/${row.slug}`, PRIORITY[row.category] || 0.8, row.updatedAt));
  } catch (error) {
    console.error('sitemap: new posts read failed:', error.message);
    return [];
  }
}

export default async function sitemap() {
  const entries = new Map();

  STATIC_PAGES.forEach((page) => {
    entries.set(`${SITE_URL}${page.path}`, {
      url: `${SITE_URL}${page.path}`,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  });

  try {
    await dbConnect();
  } catch (error) {
    console.error('sitemap: database connect failed:', error.message);
    return Array.from(entries.values());
  }

  const [legacy, fresh] = await Promise.all([
    Promise.all(SOURCES.map(legacyEntries)),
    newPostEntries(),
  ]);

  legacy.flat().forEach((item) => entries.set(item.url, item));
  fresh.forEach((item) => entries.set(item.url, item));

  return Array.from(entries.values());
}