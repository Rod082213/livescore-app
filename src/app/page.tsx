// src/app/page.tsx
import Header from '@/components/Header';
import SportsNav from '@/components/SportsNav';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import MatchListContainer from '@/components/MatchListContainer';
import Footer from '@/components/Footer';
import { fetchDashboardData, fetchTopLeagues, fetchTeamOfTheWeek } from '@/lib/api'; 

export default async function Home() {
  const [initialMatches, topLeagues, teamOfTheWeekPlayers] = await Promise.all([
    fetchDashboardData(),
    fetchTopLeagues(),
    fetchTeamOfTheWeek()
  ]);

  const featuredMatch = Array.isArray(initialMatches) 
      ? initialMatches.flatMap(g => g.matches).find(m => m.status === 'LIVE' || m.status === 'HT') || null
      : null;

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />
    
      <div className="container mx-auto px-4 py-6">
        <div className="lg:flex lg:gap-6">
          <div className="flex-grow lg:flex lg:gap-6">
            
            {/* ===== START: LEFT SIDEBAR WRAPPER MODIFICATION ===== */}
            {/* Added sticky top-4 self-start to this wrapper div */}
            <div className="lg:w-64 flex-shrink-0 mb-6 lg:mb-0 sticky top-4 self-start">
              <LeftSidebar teamOfTheWeek={teamOfTheWeekPlayers} />
            </div>
            {/* ===== END: LEFT SIDEBAR WRAPPER MODIFICATION ===== */}

            <div className="flex-grow w-full">
              <MatchListContainer initialMatches={initialMatches} />
            </div>
          </div>

          {/* ===== START: RIGHT SIDEBAR WRAPPER MODIFICATION (RECOMMENDED) ===== */}
          {/* Added sticky top-4 self-start to this wrapper div as well */}
          <div className="lg:w-72 flex-shrink-0 mt-6 lg:mt-0 sticky top-4 self-start">
            <RightSidebar 
              initialTopLeagues={topLeagues} 
              initialFeaturedMatch={featuredMatch}
            />
          </div>
          {/* ===== END: RIGHT SIDEBAR WRAPPER MODIFICATION (RECOMMENDED) ===== */}
          
        </div>
      </div>
      <Footer />
    </div>
  );
}