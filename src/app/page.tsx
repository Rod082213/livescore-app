// src/app/page.tsx

import Footer from "@/components/Footer";
import DashboardWrapper from "@/components/DashboardWrapper";

import { 
  fetchDashboardData, 
  fetchTopLeagues, 
  fetchTeamOfTheWeek, 
} from "@/lib/api";
import { fetchNewsList } from "@/lib/news-api"; // <--- 1. IMPORT THE NEWS FETCH FUNCTION

export default async function Home() {
  // Promise.all fetches everything concurrently for faster page loads
  const [
    initialMatches, 
    topLeagues, 
    teamOfTheWeekPlayers, 
    allNews // <--- 2. FETCH THE NEWS ARTICLES
  ] = await Promise.all([
    fetchDashboardData(),
    fetchTopLeagues(),
    fetchTeamOfTheWeek(),
    fetchNewsList() // <--- 3. ADD THE FUNCTION CALL HERE
  ]).catch(error => {
    // Basic error handling: if anything fails, return empty arrays for all.
    console.error("Failed to fetch initial page data:", error);
    return [[], [], [], []]; 
  });

  // Find the first "live" or "halftime" match to feature
  const featuredMatch = Array.isArray(initialMatches) 
      ? initialMatches.flatMap(g => g.matches).find(m => m.status === 'LIVE' || m.status === 'HT') || null
      : null;
  
  // 4. SLICE THE NEWS ARRAY to get just the latest few for the sidebar
  const latestNewsForSidebar = Array.isArray(allNews) ? allNews.slice(0, 3) : [];

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <DashboardWrapper
        initialMatches={initialMatches}
        initialTopLeagues={topLeagues}
        initialTeamOfTheWeek={teamOfTheWeekPlayers}
        initialLatestNews={latestNewsForSidebar} // <--- 5. PASS THE SLICED NEWS DATA
        initialFeaturedMatch={featuredMatch}
      />
      <Footer />
    </div>
  );
}