// src/app/team/[slug]/page.tsx

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

// Helper function to extract the ID from a slug
const getTeamIdFromSlug = (slug: string): string | null => {
    const parts = slug.split('-');
    const potentialId = parts[parts.length - 1];
    return /^\d+$/.test(potentialId) ? potentialId : null;
};

// --- METADATA FUNCTION WITH CANONICAL AND ROBOTS TAGS ---
export async function generateMetadata({ params: { slug } }: PageProps): Promise<Metadata> {
  const teamId = getTeamIdFromSlug(slug);

  if (!teamId) {
    return { 
      title: 'Invalid Team URL',
      robots: { index: false } // Don't index invalid URLs
    };
  }

  const teamInfo = await fetchTeamInfo(teamId);
  
  if (!teamInfo) {
    return { 
      title: 'Team Not Found',
      robots: { index: false } // Don't index pages for teams that weren't found
    };
  }

  const team = teamInfo.team;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://todaylivescores.com';
  const canonicalUrl = `${siteUrl}/team/${slug}`;
  
  const dynamicTitle = `${team.name}: Live Scores, Fixtures & Standings`;
  const dynamicDescription = `Get the latest live scores, match schedule, league standings, and full squad list for ${team.name}. Follow all the action on TodayLiveScores.`;

  return {
    title: dynamicTitle,
    description: dynamicDescription,
    
    // ADDED: The canonical URL for this specific team page.
    alternates: {
      canonical: canonicalUrl,
    },

    // ADDED: Explicit instructions for search engine crawlers.
    robots: {
      index: true,
      follow: true,
    },

    // ADDED: Open Graph and Twitter tags for rich social sharing.
    openGraph: {
      title: dynamicTitle,
      description: dynamicDescription,
      url: canonicalUrl,
      siteName: 'TodayLiveScores',
      // For a dynamic image, you can use the team's logo.
      // Make sure the logo URL is absolute (https://...).
      images: [
        {
          url: team.logo, // Using the team's logo for the social card
          width: 250,     // Specify dimensions if known
          height: 250,
          alt: `${team.name} logo`,
        },
      ],
      type: 'profile', // 'profile' is a good type for an entity like a sports team
    },
    twitter: {
      card: 'summary',
      title: dynamicTitle,
      description: dynamicDescription,
      images: [team.logo], // Use the team's logo here as well
    },
  };
}

// --- Page Component (no changes needed here) ---
export default async function TeamDetailPage({ params: { slug } }: PageProps) {
  const teamId = getTeamIdFromSlug(slug);

  if (!teamId) {
    notFound(); 
  }

  // Fetching is automatically deduplicated by Next.js
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
            <div className="lg:col-span-1 leaguestanding lg:sticky lg:top-4">
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
  if (!allLeagues || allLeagues.length === 0) return []; // Graceful fallback
  
  const allTeams = allLeagues.flatMap(league => league.teams);
 
  return allTeams.map((team) => ({
    slug: createTeamSlug(team.name, team.id),
  }));
}