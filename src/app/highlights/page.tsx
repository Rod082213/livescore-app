// src/app/highlights/page.tsx

import { Metadata } from 'next';
import { format } from 'date-fns';

// 1. Import all necessary components and API functions
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebarHighlight from "@/components/RightSidebarHighlight";
import SportsNav from "@/components/SportsNav";
import BackButton from '@/components/BackButton';
import HighlightsClientPage from "./HighlightsClientPage";

// Import your API functions
import { fetchDailyMatchesAndHighlights, fetchTeamOfTheWeek, fetchTopLeagues } from "@/lib/api";
import { fetchNewsList } from "@/lib/news-api";

// --- SEO METADATA FOR THE HIGHLIGHTS PAGE ---
export const metadata: Metadata = {
  title: 'Daily Football Highlights & Match Previews',
  description: 'Catch up on all the action with daily football highlights. See live scores, finished match videos, and schedules for upcoming games all in one place.',
  
  // ADDED: The canonical URL for the highlights page.
  // This must be an absolute URL.
  alternates: {
    canonical: 'https://todaylivescores.com/highlights', // <-- Use your actual domain here
  },

  // ADDED: Explicit instructions for search engine crawlers.
  robots: {
    index: true,  // Allow this page to be indexed
    follow: true, // Allow crawlers to follow links from this page
  },

  // ADDED: Open Graph and Twitter tags for rich social media sharing.
  openGraph: {
    title: 'Daily Football Highlights | TodayLiveScores',
    description: 'Catch up on all the action with daily football highlights and match videos.',
    url: 'https://todaylivescores.com/highlights', // <-- Use your actual domain here
    siteName: 'TodayLiveScores',
    images: [
      {
        url: '/social-card-highlights.png', // IMPORTANT: Create this image (1200x630px)
        width: 1200,
        height: 630,
        alt: 'Daily Football Highlights on TodayLiveScores',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Football Highlights | TodayLiveScores',
    description: 'Catch up on all the action with daily football highlights and match videos.',
    images: ['/social-card-highlights.png'], // Use the same image
  },
};


export default async function HighlightsPage() {
  
  // Fetch ALL data in parallel for the page and its sidebars
  const today = new Date();
  const formattedDate = format(today, 'yyyy-MM-dd');

  // Your data fetching logic is excellent - concurrent and resilient.
  const [
    initialDailyData,
    teamOfTheWeek,
    topLeagues,
    allNews,
  ] = await Promise.all([
    fetchDailyMatchesAndHighlights(formattedDate),
    fetchTeamOfTheWeek(),
    fetchTopLeagues(),
    fetchNewsList(),
  ]).catch(error => {
    // Graceful error handling in case any API fails
    console.error("Failed to fetch highlights page data:", error);
    return [[], [], [], []];
  });

  // Slice news for the sidebar, with a check in case it's empty
  const latestNewsForSidebar = Array.isArray(allNews) ? allNews.slice(0, 5) : [];

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />
      
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 border-b border-gray-700 pb-4">
          Daily Matches & Highlights
        </h1>
        <div className="lg:flex lg:gap-8">
          
          {/* Left Sidebar */}
          <aside className="w-full lg:w-64 lg:order-1 flex-shrink-0 mb-8 lg:mb-0 lg:sticky lg:top-8 lg:self-start">
            <LeftSidebar 
              teamOfTheWeek={teamOfTheWeek} 
              latestNews={latestNewsForSidebar} 
            />
          </aside>
          
          {/* Main Content Area */}
          <main className="w-full lg:flex-1 lg:order-2 lg:min-w-0">
            <HighlightsClientPage 
              initialData={initialDailyData} 
              initialDate={today} 
            />
          </main>
          
          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:w-72 lg:order-3 flex-shrink-0 lg:sticky lg:top-8 lg:self-start">
            <RightSidebarHighlight 
              initialTopLeagues={topLeagues} 
              initialFeaturedMatch={null}
            />
          </aside>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}