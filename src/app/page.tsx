// src/app/page.tsx

import Footer from "@/components/Footer";
import DashboardWrapper from "@/components/DashboardWrapper";
import { 
  fetchDashboardData, 
  fetchTopLeagues, 
  fetchTeamOfTheWeek, 
  fetchLatestNews 
} from "@/lib/api";

export default async function Home() {
  const [
    initialMatches, 
    topLeagues, 
    teamOfTheWeekPlayers, 
    latestNews
  ] = await Promise.all([
    fetchDashboardData(),
    fetchTopLeagues(),
    fetchTeamOfTheWeek(),
    fetchLatestNews()
  ]).catch(error => {
    return [[], [], [], []];
  });

  const featuredMatch = Array.isArray(initialMatches) 
      ? initialMatches.flatMap(g => g.matches).find(m => m.status === 'LIVE' || m.status === 'HT') || null
      : null;
  
  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <DashboardWrapper
        initialMatches={initialMatches}
        initialTopLeagues={topLeagues}
        initialTeamOfTheWeek={teamOfTheWeekPlayers}
        initialLatestNews={latestNews}
        initialFeaturedMatch={featuredMatch}
      />
      <Footer />
    </div>
  );
}