// src/models/Article.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArticle extends Document {
  apiId: string;
  slug: string;
  category: string;
  title: string;
  imageUrl: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema: Schema = new Schema({
  apiId: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  publishedAt: { type: Date, required: true },
}, {
  timestamps: true
});

const Article: Model<IArticle> = mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;