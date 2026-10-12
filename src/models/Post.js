import mongoose from 'mongoose';
import { CATEGORIES, DIFFICULTIES } from '@/lib/config';

const { Schema } = mongoose;

const BlockSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['heading', 'paragraph', 'image', 'code', 'list', 'table', 'callout', 'faq'],
    },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const PostSchema = new Schema(
  {
    slug: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    category: { type: String, required: true, enum: Object.keys(CATEGORIES) },
    difficulty: { type: String, enum: DIFFICULTIES, default: 'basic' },
    tags: { type: [String], default: [] },
    excerpt: { type: String, default: '' },
    coverImage: {
      url: String,
      alt: String,
      width: Number,
      height: Number,
      blurDataURL: String,
    },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      ogImage: { type: String, default: '' },
    },
    content: { type: [BlockSchema], default: [] },
    toc: [{ _id: false, id: String, text: String, level: Number }],
    readingTime: { type: Number, default: 1 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: Date,
    order: { type: Number, default: 0 },
    authorName: { type: String, default: 'Sarkitshala Team' },
    createdBy: String,
    updatedBy: String,
    importWarnings: { type: [String], default: [] },
  },
  { timestamps: true }
);

PostSchema.index({ category: 1, slug: 1 }, { unique: true });
PostSchema.index({ status: 1, category: 1, difficulty: 1, order: 1 });
PostSchema.index({ category: 1, updatedAt: -1 });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);