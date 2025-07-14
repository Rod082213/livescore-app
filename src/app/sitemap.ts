// src/app/sitemap.ts

import { MetadataRoute } from 'next';
import { fetchAllTeamsFromAllLeagues } from '@/lib/api';
import { fetchNewsList } from '@/lib/news-api';
// --- THIS IS THE FIX: Import the correct function ---
import { createTeamSlug } from '@/lib/utils'; 

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://todaylivescores.com/';

  // 1. Static pages
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/teams-list`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 2. Dynamic news article pages
  const allNews = await fetchNewsList().catch(() => []);
  const newsUrls: MetadataRoute.Sitemap = allNews.map(article => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: new Date(article.publishedAt || Date.now()),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // 3. Dynamic team pages
  const allLeagues = await fetchAllTeamsFromAllLeagues().catch(() => []);
  const allTeams = allLeagues.flatMap(league => league.teams);
  const teamUrls: MetadataRoute.Sitemap = allTeams.map(team => ({
    // --- THIS IS THE FIX: Use createTeamSlug with both name and ID ---
    url: `${baseUrl}/team/${createTeamSlug(team.name, team.id)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Combine and return all URLs
  return [
    ...staticUrls,
    ...newsUrls,
    ...teamUrls,
  ];
}