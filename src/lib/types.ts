// For the news listing page
export interface NewsArticleSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string;
  pubDate: string;
  keywords: string; // Comma-separated string
  publishedAt: string;

}

// For the detailed news article page
export interface NewsArticleDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  full_article: string; // The full HTML content
  image_url: string;
  pubDate: string;
  creator: string[];
  category: string[];
  country: string[];
  keywords: string[];
  link: string; // Original source link
  canonical?: string; // Canonical URL if available
}

// For the Table of Contents
export interface Heading {
  id: string;
  text: string;
  level: number;
}

export interface Highlight {
  id: string;      // A unique ID for the video from the API
  title: string;   // e.g., "Goal by Player X (78')"
  embedUrl: string;// The URL for the iframe embed
}