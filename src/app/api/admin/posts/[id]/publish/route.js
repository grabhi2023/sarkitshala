import mongoose from 'mongoose';
import dbConnect from '@/lib/databaseConnect';
import Post from '@/models/Post';
import { guard } from '@/lib/guard';
import { json, readJson, revalidatePost } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  const auth = await guard(request);
  if (auth.error) return auth.error;

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return json({ message: 'Invalid id' }, 400);

  const body = await readJson(request);
  const action = body.action;
  if (action !== 'publish' && action !== 'unpublish') {
    return json({ message: 'action must be "publish" or "unpublish"' }, 400);
  }

  try {
    await dbConnect();

    const post = await Post.findById(id)
      .select('title slug category status publishedAt seo.metaDescription')
      .lean();
    if (!post) return json({ message: 'Not found' }, 404);

    const set = { updatedBy: auth.email };

    if (action === 'publish') {
      const hasContent = await Post.exists({ _id: id, 'content.0': { $exists: true } });
      if (!hasContent) return json({ message: 'This post has no content, so it cannot be published' }, 400);
      if (!String(post.seo?.metaDescription || '').trim()) {
        return json({ message: 'A meta description is required before publishing' }, 400);
      }
      if (!String(post.title || '').trim()) return json({ message: 'A title is required before publishing' }, 400);

      set.status = 'published';
      if (!post.publishedAt) set.publishedAt = new Date();
    } else {
      set.status = 'draft';
    }

    const updated = await Post.findByIdAndUpdate(id, { $set: set }, { new: true })
      .select('status slug category')
      .lean();
    if (!updated) return json({ message: 'Not found' }, 404);

    revalidatePost(updated.category, updated.slug);

    return json({ ok: true, status: updated.status, url: `/${updated.category}/${updated.slug}` });
  } catch (error) {
    console.error('publish failed:', error.message);
    return json({ message: 'Server error' }, 500);
  }
}