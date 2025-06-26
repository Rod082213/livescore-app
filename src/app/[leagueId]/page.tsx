// src/app/league/[leagueId]/page.tsx
import Header from '@/components/Header';
import SportsNav from '@/components/SportsNav';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';
import LeagueHeader from '@/components/LeagueHeader';
import StandingsTable from '@/components/StandingsTable';
import TeamOfTheWeek from '@/components/TeamOfTheWeek';
import { fetchStandings, fetchTeamOfTheWeek } from '@/lib/api'; // Import fetch functions

// This is now an async Server Component
export default async function LeagueDetailPage({ params }: { params: { leagueId: string } }) {
  // Fetch all data for this page in parallel
  const [standings, topPlayers] = await Promise.all([
    fetchStandings(params.leagueId),
    fetchTeamOfTheWeek(params.leagueId)
  ]);

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <LeftSidebar />
          <main className="flex-grow space-y-6">
            <LeagueHeader />
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