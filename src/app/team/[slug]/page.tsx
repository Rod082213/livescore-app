// src/app/team/[slug]/page.tsx

import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SportsNav from '@/components/SportsNav';
import { 
  fetchTeamInfo, 
  fetchTeamFixtures, 
  fetchTeamSquad, 
  fetchStandings, 
  fetchAllTeamsFromAllLeagues // <-- We need this to find the team ID
} from '@/lib/api';
import { createSlug } from '@/lib/utils'; // <-- We need our slug function

import TeamHeader from '@/components/team/TeamHeader';
import VenueInformation from '@/components/team/VenueInformation';
import MatchSchedule from '@/components/team/MatchSchedule';
import LeagueStandings from '@/components/team/LeagueStandings';
import SquadList from '@/components/team/SquadList';

// The page now receives 'slug' instead of 'teamId'
export default async function TeamDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // --- Step 1: Find the team object (and its ID) that matches the slug ---
  const allLeagues = await fetchAllTeamsFromAllLeagues();
  const allTeams = allLeagues.flatMap(league => league.teams);
  const teamFromList = allTeams.find(t => createSlug(t.name) === slug);

  // If no team matches the slug, show the 404 page
  if (!teamFromList) {
    notFound();
  }

  // We now have the correct team ID!
  const teamId = teamFromList.id.toString();

  // --- Step 2: Fetch all team-specific data using the found teamId ---
  // This part is the same as your old page, but uses our `teamId` variable.
  const [teamInfo, fixtures, squad] = await Promise.all([
    fetchTeamInfo(teamId),
    fetchTeamFixtures(teamId),
    fetchTeamSquad(teamId)
  ]);

  if (!teamInfo) {
    // This is an extra safety check in case the specific API fails
    notFound();
  }
  
  // --- Step 3: Continue with the rest of your page logic ---
  // This logic is also the same as your old page.
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
              {/* Use the numeric ID from our found team object */}
              <LeagueStandings standings={standings} teamId={teamFromList.id} />
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

// Optional but highly recommended: Pre-build all team pages for performance
export async function generateStaticParams() {
  const allLeagues = await fetchAllTeamsFromAllLeagues();
  const allTeams = allLeagues.flatMap(league => league.teams);
 
  return allTeams.map((team) => ({
    slug: createSlug(team.name),
  }));
}