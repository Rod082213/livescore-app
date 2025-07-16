// src/app/team/[slug]/page.tsx (CORRECTED)

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { 
  fetchTeamInfo, 
  fetchTeamFixtures, 
  fetchTeamSquad, 
  fetchStandings,
  fetchAllTeamsFromAllLeagues 
} from '@/lib/api';
import { createTeamSlug } from '@/lib/utils';

// Component Imports
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SportsNav from '@/components/SportsNav';
import TeamHeader from '@/components/team/TeamHeader';
import VenueInformation from '@/components/team/VenueInformation';
import MatchSchedule from '@/components/team/MatchSchedule';
import LeagueStandings from '@/components/team/LeagueStandings';
import SquadList from '@/components/team/SquadList';
import BacktoTeamLists from "@/components/BacktoTeamLists";

// Define the type for the destructured params for clarity
type PageProps = {
  params: {
    slug: string;
  };
};

// Helper function to extract the ID from a slug like "team-name-123"
const getTeamIdFromSlug = (slug: string): string | null => {
    const parts = slug.split('-');
    const potentialId = parts[parts.length - 1];
    return /^\d+$/.test(potentialId) ? potentialId : null;
};

// --- FIX #1: Destructure `slug` directly in the function signature ---
export async function generateMetadata({ params: { slug } }: PageProps): Promise<Metadata> {
  // Now we use the `slug` variable directly, instead of `params.slug`
  const teamId = getTeamIdFromSlug(slug);

  if (!teamId) {
    return { title: 'Invalid Team URL' };
  }

  const teamInfo = await fetchTeamInfo(teamId);
  
  if (!teamInfo) {
    return { title: 'Team Not Found' };
  }

  const team = teamInfo.team;
  const dynamicTitle = `${team.name}: Live Scores, Fixtures & Standings`;
  const dynamicDescription = `Get the latest live scores, match schedule, league standings, and full squad list for ${team.name}. Follow all the action on TodayLiveScores.`;

  return {
    title: dynamicTitle,
    description: dynamicDescription,
  };
}

// --- FIX #2: Destructure `slug` directly in the function signature ---
export default async function TeamDetailPage({ params: { slug } }: PageProps) {
  // Now we use the `slug` variable directly, instead of `params.slug`
  const teamId = getTeamIdFromSlug(slug);

  if (!teamId) {
    notFound(); 
  }

  const [teamInfo, fixtures, squad] = await Promise.all([
    fetchTeamInfo(teamId),
    fetchTeamFixtures(teamId),
    fetchTeamSquad(teamId)
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
               <BacktoTeamLists text="Back to Teams List" />
              <TeamHeader team={teamInfo.team} />
            </div>
            <div>
              <VenueInformation venue={teamInfo.venue} />
            </div>
          </div>
          <MatchSchedule fixtures={fixtures} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <LeagueStandings standings={standings} teamId={Number(teamId)} />
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

// --- generateStaticParams is correct and needs no changes ---
export async function generateStaticParams() {
  const allLeagues = await fetchAllTeamsFromAllLeagues();
  const allTeams = allLeagues.flatMap(league => league.teams);
 
  return allTeams.map((team) => ({
    slug: createTeamSlug(team.name, team.id),
  }));
}