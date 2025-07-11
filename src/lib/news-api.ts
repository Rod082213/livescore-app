// src/lib/news-api.ts

import { NewsArticleSummary, NewsArticleDetail } from './types';

// The URL for your custom news backend API.
const NEWS_API_BASE_URL = "https://news.todaylivescores.com/api";

/**
 * A reusable helper to fetch data from your news API.
 */
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  try {
    const res = await fetch(`${NEWS_API_BASE_URL}${endpoint}`, options);
    if (!res.ok) {
      console.error(`News API Error: ${res.status} for ${endpoint}`);
      return options.method === 'POST' ? null : [];
    }
    return res.json();
  } catch (error) {
    console.error(`Fetch failed for ${endpoint}:`, error);
    return options.method === 'POST' ? null : [];
  }
}

/**
 * Fetches the list of all news articles.
 */
export async function fetchAllNews(): Promise<NewsArticleSummary[]> {
  const response = await apiFetch('/news', { next: { revalidate: 300 } });
  // Handles both direct array responses and { data: [...] } responses
  if (Array.isArray(response?.data)) return response.data;
  return Array.isArray(response) ? response : [];
}

/**
 * Fetches a single news article by its slug.
 */
export async function fetchNewsBySlug(slug: string): Promise<NewsArticleDetail | null> {
  return apiFetch(`/news/slug/${slug}`, { next: { revalidate: 3600 } });
}

/**
 * Sends form data to generate a new article.
 */
export async function generateArticle(formData: { title: string; description: string; image_url: string }) {
  const response = await apiFetch(`/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!response) throw new Error('Article generation failed');
  return response;
}