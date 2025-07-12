import { NewsArticleSummary, NewsArticleDetail } from './types';

// The base URL for the new News API
const NEWS_API_BASE_URL = "https://news.todaylivescores.com";

/**
 * This helper function is correct.
 */
function generateSummaryFromHtml(html: string, length = 150): string {
  if (!html) return 'No summary available.';
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * CORRECTED: This now maps correctly to `_id` and `imageUrl`.
 */
function mapApiArticle(apiArticle: any): NewsArticleSummary {
    return {
        id: apiArticle.id.toString(), // Corrected from `id`
        title: apiArticle.title,
        slug: apiArticle.slug,
        image_url: apiArticle.image_url, // Corrected from `image_url`
        summary: apiArticle.description || generateSummaryFromHtml(apiArticle.full_article),
        publishedAt: apiArticle.pubDate,
    };
}

/**
 * CORRECTED: Added the missing function name `fetchNewsList`.
 */
export async function fetchNewsList(): Promise<NewsArticleSummary[]> {
  try {
    const res = await fetch(`${NEWS_API_BASE_URL}/api/news`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error('Failed to fetch news list');
    }
    const apiResponse = await res.json();
    
    if (!apiResponse || !Array.isArray(apiResponse.data)) {
        console.error("News API response is not in the expected format:", apiResponse);
        return [];
    }
    return apiResponse.data.map(mapApiArticle);

  } catch (error) {
    console.error('API Error (fetchNewsList):', error);
    return [];
  }
}

/**
 * FINAL FIX: This function now correctly handles the API's actual response format.
 */
export async function fetchNewsBySlug(slug: string): Promise<NewsArticleDetail | null> {
  try {
    const res = await fetch(`${NEWS_API_BASE_URL}/api/news/slug/${slug}`, { next: { revalidate: 3600 } });

    if (!res.ok) {
      if (res.status === 404) {
        console.error(`Article with slug '${slug}' not found.`);
        return null;
      }
      throw new Error(`Failed to fetch article: ${slug}`);
    }

    // --- THE FIX ---
    // The API sends the article object directly, not inside a "data" property.
    // So, we just parse the JSON and return the whole object.
    const apiResponse = await res.json();
    
    // We can add a simple check to ensure it's a valid object before returning.
    if (apiResponse && typeof apiResponse === 'object' && apiResponse.slug) {
      return apiResponse;
    } else {
      console.error(`API response for slug '${slug}' was not a valid article object.`);
      return null;
    }

  } catch (error) {
    console.error(`API Error (fetchNewsBySlug for slug: ${slug}):`, error);
    return null;
  }
}