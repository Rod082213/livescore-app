// src/app/league/[leagueId]/page.tsx

// 1. Import the notFound function
import { notFound } from 'next/navigation';

import Header from '@/components/Header';
import SportsNav from '@/components/SportsNav';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';
import LeagueHeader from '@/components/LeagueHeader';
import StandingsTable from '@/components/StandingsTable';
import TeamOfTheWeek from '@/components/TeamOfTheWeek';
import { fetchStandings, fetchTeamOfTheWeek } from '@/lib/api';

export default async function LeagueDetailPage({ params }: { params: { leagueId: string } }) {
  const [standings, topPlayers] = await Promise.all([
    fetchStandings(params.leagueId),
    fetchTeamOfTheWeek(params.leagueId),
    
  ]);
  

  // 2. *** THIS IS THE KEY CHANGE ***
  // If no standings are found for this leagueId, it's considered a non-existent page.
  // The check `standings.length === 0` assumes your API returns an empty array for an invalid ID.
  // If it returns `null` or `undefined`, `!standings` would also work. This check is more robust.
  if (!standings || standings.length === 0) {
    notFound(); // This will render the closest not-found.tsx file
  }

  // If the code reaches here, the league is valid and the page will render.
  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
           <LeftSidebar 
        teamOfTheWeek={teamOfTheWeek} 
        latestNews={latestNews}
        leagueId={params.leagueid} 
      />
          <main className="flex-grow space-y-6">
            {/* Pro Tip: You should probably pass some league data to your header as well! */}
            <LeagueHeader leagueName={standings[0]?.league?.name} leagueLogo={standings[0]?.league?.logo} />
            <StandingsTable standings={standings} />
            <TeamOfTheWeek players={topPlayers} />
          </main>
          <RightSidebar />
        </div>
      </div>
      <Footer />
    </div>
  );
}