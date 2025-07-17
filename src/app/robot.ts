// ===== src/app/robots.ts =====

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // --- THIS IS THE FIX ---
  // Use the specific environment variable for the site's public URL.
  // Provide a safe fallback for local development if the variable isn't set.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://todaylivescores.com';
  // --- END OF FIX ---

  return {
    rules: {
      userAgent: '*', // This rule applies to all crawlers
      allow: '/',     // Allow crawling of all pages
      disallow: '/admin/create-post', // IMPORTANT: Block crawlers from the admin panel
    },
    sitemap: ${baseUrl}/sitemap.xml, 
  };
}