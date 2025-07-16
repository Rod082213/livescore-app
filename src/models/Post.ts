import mongoose, { Document, Schema, models } from 'mongoose';

// ... (keep IContentBlock interface)
export interface IContentBlock { id: string; type: string; value: any; }

export interface IPost extends Document {
  title: string;
  slug: string;
  author: string;
  // REMOVED: keywords is replaced by tags
  // keywords: string[];
  featuredImageUrl?: string;
  content: IContentBlock[];
  createdAt: Date;
  updatedAt: Date;
  // NEW: Add references to Category and Tag models
  categories: mongoose.Types.ObjectId[];
  tags: mongoose.Types.ObjectId[];
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  featuredImageUrl: { type: String },
  content: { type: Array, required: true },
  // NEW: Define the references in the schema
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
}, { timestamps: true });

const Post = models.Post || mongoose.model<IPost>('Post', PostSchema);
export default Post;