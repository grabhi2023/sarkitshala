import { SITE_URL } from '@/lib/seo';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/*?_rsc=',
          '/admin',
          '/api',
          '/dashboard',
          '/login',
          '/register',
          '/user-profile',
          '/private',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}