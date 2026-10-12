import mongoose from 'mongoose';
import dbConnect from '@/lib/databaseConnect';
import Post from '@/models/Post';
import { guard } from '@/lib/guard';
import { DIFFICULTIES } from '@/lib/config';
import { deleteFolderAssets } from '@/lib/cloudinary';
import { json, readJson, revalidatePost } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const clean = (value, max) => String(value ?? '').trim().slice(0, max);

export async function GET(request, { params }) {
  const auth = await guard(request);
  if (auth.error) return auth.error;

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return json({ message: 'Invalid id' }, 400);

  try {
    await dbConnect();
    const withContent = new URL(request.url).searchParams.get('content') === '1';
    const query = Post.findById(id);
    if (!withContent) query.select('-content');
    const post = await query.lean();
    if (!post) return json({ message: 'Not found' }, 404);
    return json({ post });
  } catch (error) {
    console.error('get post failed:', error.message);
    return json({ message: 'Server error' }, 500);
  }
}

export async function PATCH(request, { params }) {
  const auth = await guard(request);
  if (auth.error) return auth.error;

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return json({ message: 'Invalid id' }, 400);

  const body = await readJson(request);
  const set = { updatedBy: auth.email };

  if (body.title !== undefined) {
    const title = clean(body.title, 200);
    if (!title) return json({ message: 'Title cannot be empty' }, 400);
    set.title = title;
  }
  if (body.difficulty !== undefined) {
    if (!DIFFICULTIES.includes(body.difficulty)) return json({ message: 'Invalid difficulty' }, 400);
    set.difficulty = body.difficulty;
  }
  if (body.order !== undefined) {
    const order = Number(body.order);
    if (!Number.isFinite(order) || order < 0 || order > 100000) {
      return json({ message: 'Order must be a number between 0 and 100000' }, 400);
    }
    set.order = Math.floor(order);
  }
  if (body.tags !== undefined) {
    const list = Array.isArray(body.tags) ? body.tags : String(body.tags).split(',');
    set.tags = [...new Set(list.map((t) => clean(t, 40).toLowerCase()).filter(Boolean))].slice(0, 12);
  }
  if (body.excerpt !== undefined) set.excerpt = clean(body.excerpt, 300);
  if (body.metaTitle !== undefined) set['seo.metaTitle'] = clean(body.metaTitle, 120);
  if (body.metaDescription !== undefined) set['seo.metaDescription'] = clean(body.metaDescription, 200);
  if (body.authorName !== undefined) set.authorName = clean(body.authorName, 80) || 'Sarkitshala Team';

  if (Object.keys(set).length === 1) return json({ message: 'No fields to update' }, 400);

  try {
    await dbConnect();
    const post = await Post.findByIdAndUpdate(id, { $set: set }, { new: true, runValidators: true })
      .select('-content')
      .lean();
    if (!post) return json({ message: 'Not found' }, 404);

    if (post.status === 'published') revalidatePost(post.category, post.slug);

    return json({ post });
  } catch (error) {
    console.error('update post failed:', error.message);
    return json({ message: 'Server error' }, 500);
  }
}

export async function DELETE(request, { params }) {
  const auth = await guard(request);
  if (auth.error) return auth.error;

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return json({ message: 'Invalid id' }, 400);

  try {
    await dbConnect();
    const post = await Post.findByIdAndDelete(id).select('category slug').lean();
    if (!post) return json({ message: 'Not found' }, 404);

    await deleteFolderAssets(`sarkitshala/${post.category}/${post.slug}/`);
    revalidatePost(post.category, post.slug);
    return json({ ok: true });
  } catch (error) {
    console.error('delete post failed:', error.message);
    return json({ message: 'Server error' }, 500);
  }
}