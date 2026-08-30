export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/*?_rsc=*',       // RSC-related
          '/*?*rsc=*',        // Query string patterns
          '/admin',
          '/dashboard',
          '/login',
          '/register',
          '/user-profile',
          '/api',             // API routes (optional if public)
          '/private',         // Any private sections
        ],
      },
     
    ],
    sitemap: 'https://sarkitshala.com/sitemap.xml',
  };
}
