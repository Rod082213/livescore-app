import mongoose, { Document, Schema, models, Types } from 'mongoose';
import { ICategory } from './Category';
import { ITag } from './Tag';

export interface IContentBlock { id: string; type: string; value: any; }

export interface IPost extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  author: string;
  description?: string; // NEW: The meta description field
  featuredImageUrl?: string;
  content: IContentBlock[];
  categories: (Types.ObjectId | ICategory)[];
  tags: (Types.ObjectId | ITag)[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  description: { type: String }, // NEW: Add to the schema
  featuredImageUrl: { type: String },
  content: { type: Array, required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
}, { timestamps: true });

const Post = models.Post || mongoose.model<IPost>('Post', PostSchema);
export default Post;