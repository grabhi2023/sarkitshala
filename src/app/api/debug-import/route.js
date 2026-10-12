export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const modules = {
  databaseConnect: () => import('@/lib/databaseConnect'),
  Post: () => import('@/models/Post'),
  guard: () => import('@/lib/guard'),
  docx: () => import('@/lib/import/docx'),
  cloudinary: () => import('@/lib/cloudinary'),
  slug: () => import('@/lib/slug'),
  config: () => import('@/lib/config'),
  http: () => import('@/lib/http'),
  sharp: () => import('sharp'),
  mammoth: () => import('mammoth'),
  cheerio: () => import('cheerio'),
  sanitizeHtml: () => import('sanitize-html'),
};

const envNames = [
  'MONGO_URI',
  'MONGODB_URI',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'ADMIN_JWT_SECRET',
  'ADMIN_ACCESS_KEY',
];

export async function GET() {
  const imports = {};
  for (const [name, load] of Object.entries(modules)) {
    try {
      await load();
      imports[name] = 'ok';
    } catch (error) {
      imports[name] = String(error?.message || error).slice(0, 300);
    }
  }

  const env = Object.fromEntries(envNames.map((name) => [name, Boolean(process.env[name])]));

  return Response.json({ node: process.version, imports, env });
}