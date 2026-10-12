import { CATEGORIES } from '@/lib/config';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sarkitshala.com';
export const SITE_NAME = 'Sarkitshala';

export function postUrl(post) {
  return `${SITE_URL}/${post.category}/${post.slug}`;
}

export function ogImageUrl(url) {
  if (!url) return `${SITE_URL}/opengraph-image.jpg`;
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/c_fill,w_1200,h_630,f_jpg,q_auto/');
  }
  return url;
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildPostMetadata(post) {
  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt || '';
  const url = postUrl(post);
  const image = ogImageUrl(post.seo?.ogImage || post.coverImage?.url);
  const isLive = post.status === 'published';

  return {
    metadataBase: new URL(SITE_URL),
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: { canonical: url },
    robots: isLive ? { index: true, follow: true } : { index: false, follow: false },
    authors: [{ name: post.authorName || 'Sarkitshala Team' }],
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'article',
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function articleGraph(post) {
  const url = postUrl(post);
  const description = post.seo?.metaDescription || post.excerpt || '';
  const image = ogImageUrl(post.seo?.ogImage || post.coverImage?.url);
  const categoryLabel = CATEGORIES[post.category]?.label || post.category;

  const graph = [
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: post.title,
      description,
      image: [image],
      author: { '@type': 'Organization', name: post.authorName || 'Sarkitshala Team' },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.webp` },
      },
      datePublished: post.publishedAt || post.createdAt,
      dateModified: post.updatedAt,
      mainEntityOfPage: url,
      keywords: (post.tags || []).join(', '),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: categoryLabel, item: `${SITE_URL}/${post.category}` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ];

  const faqItems = (post.content || [])
    .filter((b) => b.type === 'faq')
    .flatMap((b) => b.data?.items || []);

  if (faqItems.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: stripHtml(item.q),
        acceptedAnswer: { '@type': 'Answer', text: stripHtml(item.a) },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}