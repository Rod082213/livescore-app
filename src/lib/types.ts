// src/lib/types.ts

// Type for the summary card shown on the main news page
export interface NewsArticleSummary {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  imageUrl: string;
  publishedAt: string;
}

// Type for the full article detail page
export interface NewsArticleDetail extends NewsArticleSummary {
  content: string; // The full HTML article content
  keywords: string[];
}