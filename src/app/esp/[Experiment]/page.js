import { notFound } from 'next/navigation';
import getData from '@/app/apiCall';
import PostView from '@/components/blog/PostView';
import Esp from '@/components/Esp';
import {
  getLegacy,
  getPublishedSlugs,
  legacySlugs,
  loadPost,
  pageMetadata,
  postMetadata,
  truncate,
} from '@/lib/blogPage';

const API = 'https://sarkitshala.com/api/experiments/Esp';
const META_API = 'https://sarkitshala.com/api/experiments/EspMeta';
const DEFAULT_DESCRIPTION = 'Discover ESP32 experiments and projects with step by step guides and code examples.';

export async function generateStaticParams() {
  const [legacy, posts] = await Promise.all([
    getData(META_API)
      .then(legacySlugs)
      .catch((error) => {
        console.error('esp static params failed:', error.message);
        return [];
      }),
    getPublishedSlugs('esp'),
  ]);

  return [...new Set([...legacy, ...posts])].map((Experiment) => ({ Experiment }));
}

export async function generateMetadata({ params }) {
  const { Experiment } = await params;

  const post = await loadPost('esp', Experiment);
  if (post) return postMetadata(post, 'esp');

  const data = await getLegacy(() => getData(META_API, Experiment));
  if (!data) notFound();

  const title = data.title || 'ESP32 Experiment';
  return pageMetadata({
    category: 'esp',
    slug: Experiment,
    title: `${title} | ESP32 Tutorial - Sarkitshala`,
    ogTitle: `${title} | ESP32 Project Guide`,
    description: truncate(data.metaDescription || DEFAULT_DESCRIPTION),
    image: data.image1,
  });
}

export default async function Page({ params }) {
  const { Experiment } = await params;

  const post = await loadPost('esp', Experiment);
  if (post) return <PostView post={post} />;

  const data = await getLegacy(() => getData(API, Experiment));
  if (!data) notFound();

  return <Esp data={data} />;
}