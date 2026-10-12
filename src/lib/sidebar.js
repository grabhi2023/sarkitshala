import dbConnect from '@/lib/databaseConnect';
import Post from '@/models/Post';

const MAX_SIDEBAR_POSTS = 300;

export async function getSidebarItems(category) {
  try {
    await dbConnect();
    return await Post.find({ category, status: 'published' })
      .select('title slug difficulty publishedAt')
      .sort({ publishedAt: -1, _id: -1 })
      .limit(MAX_SIDEBAR_POSTS)
      .lean();
  } catch (error) {
    console.error(`sidebar items failed for ${category}:`, error.message);
    return [];
  }
}