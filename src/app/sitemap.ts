// src/app/sitemap.ts

import { MetadataRoute } from 'next';
import { fetchAllTeamsFromAllLeagues } from '@/lib/api';
import { fetchNewsList } from '@/lib/news-api';
import { createTeamSlug } from '@/lib/utils';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

// CHANGE: Instead of 'force-dynamic', we use revalidation.
// This tells Next.js to cache the sitemap and regenerate it at most once per day.
// This is MUCH better for performance and reduces server load.
export const revalidate = 60 * 60 * 24; // 24 hours in seconds

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://todaylivescores.com';

  // Your concurrent fetching logic is excellent. No changes needed here.
  const [allNews, allLeagues, allPosts] = await Promise.all([
    fetchNewsList().catch(() => []), // Fetch news
    fetchAllTeamsFromAllLeagues().catch(() => []), // Fetch teams
    (async () => { // Fetch blog posts
      await dbConnect();
      return Post.find({}).select('slug updatedAt').lean();
    })().catch(() => [])
  ]);

  // 1. Static pages
  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/teams-list`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    // ADDED: The new /highlights page as requested
    { url: `${baseUrl}/highlights`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  // 2. Dynamic news article pages
  const newsUrls: MetadataRoute.Sitemap = allNews.map(article => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: new Date(article.publishedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 3. Dynamic team pages
  const allTeams = allLeagues.flatMap(league => league.teams);
  const teamUrls: MetadataRoute.Sitemap = allTeams.map(team => ({
    url: `${baseUrl}/team/${createTeamSlug(team.name, team.id)}`,
    lastModified: new Date(), // This is the best you can do if the API doesn't provide a date
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // 4. Dynamic blog post pages
  const blogPostUrls: MetadataRoute.Sitemap = allPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Combine and return all URLs
  return [
    ...staticUrls,
    ...newsUrls,
    ...teamUrls,
    ...blogPostUrls,
  ];
}