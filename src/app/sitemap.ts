// src/app/sitemap.ts

import { MetadataRoute } from 'next';
import { fetchAllTeamsFromAllLeagues } from '@/lib/api';
import { fetchNewsList } from '@/lib/news-api';
import { createTeamSlug } from '@/lib/utils';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export const revalidate = 86400; // Revalidate once per day

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://todaylivescores.com';

  const [allNews, allLeagues, allPosts] = await Promise.all([
    fetchNewsList().catch(() => []),
    fetchAllTeamsFromAllLeagues().catch(() => []),
    (async () => {
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
    { url: `${baseUrl}/highlights`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    // --- THIS IS THE NEW LINE YOU REQUESTED ---
    { url: `${baseUrl}/predictions`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
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
    lastModified: new Date(),
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