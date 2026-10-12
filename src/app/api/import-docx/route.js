import dbConnect from '@/lib/databaseConnect';
import Post from '@/models/Post';
import { guard } from '@/lib/guard';
import { importDocx } from '@/lib/import/docx';
import { pruneFolder } from '@/lib/cloudinary';
import { isValidSlug } from '@/lib/slug';
import { CATEGORIES, DIFFICULTIES, MAX_DOCX_BYTES } from '@/lib/config';
import { json, revalidatePost } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const ENVELOPE_BYTES = 64 * 1024;

export async function POST(request) {
  const auth = await guard(request);
  if (auth.error) return auth.error;

  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_DOCX_BYTES + ENVELOPE_BYTES) {
    return json({ message: 'File is larger than 20 MB' }, 413);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ message: 'Could not read the uploaded form data' }, 400);
  }

  const file = form.get('file');
  const category = String(form.get('category') || '');
  const difficulty = String(form.get('difficulty') || '');
  const slugInput = String(form.get('slug') || '').trim().toLowerCase();
  const authorName = String(form.get('authorName') || '').trim().slice(0, 80);

  if (!file || typeof file === 'string') return json({ message: 'Choose a .docx file' }, 400);
  if (!Object.hasOwn(CATEGORIES, category)) return json({ message: 'Invalid category' }, 400);
  if (!DIFFICULTIES.includes(difficulty)) return json({ message: 'Invalid difficulty' }, 400);
  if (slugInput && !isValidSlug(slugInput)) {
    return json({ message: 'Invalid slug. Use lowercase letters, numbers and hyphens' }, 400);
  }
  if (!String(file.name).toLowerCase().endsWith('.docx')) {
    return json({ message: 'Only .docx files are supported' }, 400);
  }
  if (file.size > MAX_DOCX_BYTES) return json({ message: 'File is larger than 20 MB' }, 413);
  if (file.size < 4) return json({ message: 'This is not a valid .docx file' }, 400);

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
    return json({ message: 'This is not a valid .docx file' }, 400);
  }

  let parsed;
  try {
    parsed = await importDocx(buffer, { category, difficulty, slug: slugInput });
  } catch (error) {
    console.error('import-docx parse failed:', error);
    return json({ message: error?.message || 'The document could not be parsed' }, 422);
  }

  if (!parsed || !Array.isArray(parsed.content) || parsed.content.length === 0) {
    return json({ message: 'No readable content found in the document' }, 422);
  }
  if (!String(parsed.title || '').trim()) {
    return json({ message: 'No title found. Apply the Heading 1 style to the first line' }, 422);
  }
  if (!isValidSlug(parsed.slug)) {
    return json({ message: 'A valid slug could not be created from the title. Enter a slug manually' }, 422);
  }

  try {
    await dbConnect();

    const existing = await Post.findOne({ category, slug: parsed.slug }).select('_id status').lean();

    const update = {
      $set: {
        title: parsed.title,
        difficulty,
        tags: parsed.tags || [],
        excerpt: parsed.excerpt || '',
        'seo.metaTitle': parsed.metaTitle || '',
        'seo.metaDescription': parsed.metaDescription || '',
        content: parsed.content,
        toc: parsed.toc || [],
        readingTime: parsed.readingTime || 1,
        importWarnings: parsed.warnings || [],
        updatedBy: auth.email,
      },
      $setOnInsert: {
        status: 'draft',
        createdBy: auth.email,
      },
    };

    if (parsed.coverImage) {
      update.$set.coverImage = parsed.coverImage;
    } else {
      update.$unset = { coverImage: '' };
    }
    if (authorName) update.$set.authorName = authorName;

    if (!existing) {
      const last = await Post.findOne({ category, difficulty }).sort({ order: -1 }).select('order').lean();
      update.$setOnInsert.order = (last?.order || 0) + 1;
    }

    const post = await Post.findOneAndUpdate({ category, slug: parsed.slug }, update, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    }).select('_id slug category status');

    const stats = parsed.imageStats || { found: 0, used: 0, uploaded: 0, reused: 0, failed: 0, skipped: 0 };
    let removed = 0;
    if (stats.failed === 0 && !stats.skipped) {
      removed = await pruneFolder(`sarkitshala/${category}/${parsed.slug}/`, parsed.imagePublicIds || []);
    }

    if (existing?.status === 'published') revalidatePost(post.category, post.slug);

    return json({
      id: String(post._id),
      slug: post.slug,
      category: post.category,
      status: post.status,
      created: !existing,
      warnings: parsed.warnings || [],
      blocks: parsed.content.length,
      images: { ...stats, removed },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return json({ message: 'Another import for this slug is in progress. Try again' }, 409);
    }
    console.error('import save failed:', error);
    return json({ message: 'The post could not be saved to the database' }, 500);
  }
}