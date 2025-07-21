// src/app/page.tsx

import Footer from "@/components/Footer";
import { Metadata } from 'next';
import DashboardWrapper from "@/components/DashboardWrapper";


import { 
  fetchDashboardData, 
  fetchTopLeagues, 
  fetchTeamOfTheWeek, 
} from "@/lib/api";
import { fetchNewsList } from "@/lib/news-api";

// --- SEO-OPTIMIZED METADATA FOR THE HOMEPAGE ---
export const metadata: Metadata = {
  // This title will be used by the layout's template to create:
  // "Live Sports Scores, Fixtures & Results | TodayLiveScores"
  title: 'Live Sports Scores, Fixtures & Results',

  // This description overrides the default one from layout.tsx and is the perfect length.
  description: 'Get instant live scores, upcoming fixtures, and final results for football, basketball, tennis, and more. Your go-to source for the fastest sports updates.',

  // Keywords give search engines extra context.
  keywords: ['live scores', 'football scores', 'sports results', 'fixtures', 'standings', 'live football', 'basketball scores', 'tennis scores', 'todaylivescores'],

  // The canonical URL for the homepage is the root of your site.
  alternates: {
    canonical: '/',
  },
  
  // Open Graph tags for beautiful sharing on social media.
  openGraph: {
    title: 'Live Sports Scores, Fixtures & Results | TodayLiveScores',
    description: 'Your go-to source for the fastest updates in football, basketball, tennis, and more.',
    url: '/',
    siteName: 'TodayLiveScores',
    // IMPORTANT: Create this image (1200x630px) and place it in your /public folder.
    images: [
      {
        url: '/social-card-home.png', // The absolute path to your social image
        width: 1200,
        height: 630,
        alt: 'Live sports scores and fixtures on TodayLiveScores',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter-specific tags for optimized sharing.
  twitter: {
    card: 'summary_large_image',
    title: 'Live Sports Scores, Fixtures & Results | TodayLiveScores',
    description: 'Your go-to source for the fastest updates in football, basketball, tennis, and more.',
    images: ['/social-card-home.png'], // Use the same image as Open Graph
  },

  // Explicit instructions for search engine crawlers.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};


export default async function Home() {
  // Promise.all fetches everything concurrently for faster page loads
  const [
    initialMatches, 
    topLeagues, 
    teamOfTheWeekPlayers, 
    allNews 
  ] = await Promise.all([
    fetchDashboardData(),
    fetchTopLeagues(),
    fetchTeamOfTheWeek(),
    fetchNewsList() 
  ]).catch(error => {
    // Basic error handling: if anything fails, return empty arrays for all.
    console.error("Failed to fetch initial page data:", error);
    return [[], [], [], []]; 
  });

  // Find the first "live" or "halftime" match to feature
  const featuredMatch = Array.isArray(initialMatches) 
      ? initialMatches.flatMap(g => g.matches).find(m => m.status === 'LIVE' || m.status === 'HT') || null
      : null;
  
  // Slice the news array to get just the latest few for the sidebar
  const latestNewsForSidebar = Array.isArray(allNews) ? allNews.slice(0, 3) : [];

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <DashboardWrapper
        initialMatches={initialMatches}
        initialTopLeagues={topLeagues}
        initialTeamOfTheWeek={teamOfTheWeekPlayers}
        initialLatestNews={latestNewsForSidebar}
        initialFeaturedMatch={featuredMatch}
      />
      <Footer />
    </div>
  );
}