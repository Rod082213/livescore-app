import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SportsNav from '@/components/SportsNav';
import { fetchTeamInfo, fetchTeamFixtures, fetchTeamSquad, fetchStandings } from '@/lib/api';

import TeamHeader from '@/components/team/TeamHeader';
import VenueInformation from '@/components/team/VenueInformation';
import MatchSchedule from '@/components/team/MatchSchedule';
import LeagueStandings from '@/components/team/LeagueStandings';
import SquadList from '@/components/team/SquadList';

export default async function TeamDetailPage({ params }: { params: { teamId: string } }) {

  const [teamInfo, fixtures, squad] = await Promise.all([
    fetchTeamInfo(params.teamId),
    fetchTeamFixtures(params.teamId),
    fetchTeamSquad(params.teamId)
  ]);

  if (!teamInfo) {
    notFound();
  }
  
  const leagueId = (fixtures && fixtures.length > 0 && fixtures[0].league)
    ? fixtures[0].league.id.toString() 
    : null;

  const standings = leagueId ? await fetchStandings(leagueId) : [];

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TeamHeader team={teamInfo.team} />
            </div>
            <div>
              <VenueInformation venue={teamInfo.venue} />
            </div>
          </div>

          <MatchSchedule fixtures={fixtures} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <LeagueStandings standings={standings} teamId={Number(params.teamId)} />
            </div>
            <div className="lg:col-span-2">
              <SquadList squad={squad} />
            </div>
          </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
}