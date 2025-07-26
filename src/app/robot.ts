import { MetadataRoute } from 'next';

/**
 * This function generates the robots.txt file for your site.
 * It combines all necessary rules and correctly points to the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  
  // For consistency, use the same environment variable as your sitemap.ts
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://todaylivescores.com';

  // Define rules for different types of crawlers.
  const rules: MetadataRoute.Robots['rules'] = [
    // Rule for all general crawlers (like Google, Bing, etc.)
    {
      userAgent: '*',
      allow: '/',          // Allow everything by default
      disallow: '/admin/', // Block the admin panel
    },
    // Rules to block AI data scrapers
    { userAgent: 'Amazonbot', disallow: '/' },
    { userAgent: 'Applebot-Extended', disallow: '/' },
    { userAgent: 'Bytespider', disallow: '/' },
    { userAgent: 'CCBot', disallow: '/' },
    { userAgent: 'ClaudeBot', disallow: '/' },
    { userAgent: 'Google-Extended', disallow: '/' },
    { userAgent: 'GPTBot', disallow: '/' },
    { userAgent: 'meta-externalagent', disallow: '/' },
  ];
5
  return {
    rules,
    // --- THIS IS THE FIX ---
    // Use proper string concatenation to form the full URL.
    sitemap: `${baseUrl}/sitemap.xml`, 
  };
}