import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import BackButton from "@/components/BackButton";
import Footer from '@/components/Footer';
import SportsNav from '@/components/SportsNav';
import LeftSidebar from '@/components/LeftSidebar';
import TeamSidebar from '@/components/TeamSidebar';
import connectToDB from '@/lib/mongodb';
import Team from '@/models/Team';
import { fetchTeamOfTheWeek, fetchTopLeagues } from '@/lib/api';
import { fetchNewsList } from '@/lib/news-api';
import { createTeamSlug } from '@/lib/utils';

// --- PERFORMANCE & SEO ENHANCEMENTS ---

// 1. Revalidate the page once a day. The list of all teams doesn't change frequently.
// This caches the page, making it load instantly and reducing database load.
export const revalidate = 86400; // 24 hours in seconds

// 2. Add full SEO metadata for the teams list page.
export const metadata: Metadata = {
  title: 'Browse All Football Teams by League',
  description: 'Explore a complete directory of football teams, logos, and standings from top leagues worldwide. Find your favorite team on TodayLiveScores.',
  keywords: [
    'football teams',  
    'football clubs', 
    'team standings', 
],
  
  // CORRECTED: This generates the primary <meta name="author" content="Author"> tag.
  authors: [{ name: 'TodayLiveScores' }],
  
  // CONFIRMED: The publisher of the website.
  publisher: 'TodayLiveScores',

  // ADDED: The canonical URL for the teams list page.
  alternates: {
    canonical: 'https://todaylivescores.com/teams-list',
  },

  // ADDED: Explicit instructions for search engine crawlers.
  robots: {
    index: true,
    follow: true,
  },

  // CORRECTED: Open Graph and Twitter tags for rich social sharing.
  openGraph: {
    title: 'Browse All Football Teams by League | TodayLiveScores',
    description: 'Explore a complete directory of football teams from top leagues worldwide.',
    url: 'https://todaylivescores.com/teams-list',
    siteName: 'TodayLiveScores',
    images: [
      {
        url: '/social-card-teams.png',
        width: 1200,
        height: 630,
        alt: 'A directory of all football teams on TodayLiveScores',
      },
    ],
    publishedTime: new Date().toISOString(),
    // CORRECTED: This ensures the author for social media sharing is also 'Author'.
    authors: ['Author'], 
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse All Football Teams by League | TodayLiveScores',
    description: 'Explore a complete directory of football teams from top leagues worldwide.',
    images: ['/social-card-teams.png'],
  },
};

// This function ONLY reads from your database. It is fast and efficient.
async function getGroupedTeamsFromDB() {
  try {
    await connectToDB();
    const groupedTeams = await Team.aggregate([
      {
        $group: {
          _id: '$leagueName',
          teams: { $push: { id: '$apiId', name: '$name', logo: '$logoUrl' } }
        }
      },
      { $project: { _id: 0, leagueName: '$_id', teams: '$teams' } },
      { $sort: { leagueName: 1 } }
    ]);
    return JSON.parse(JSON.stringify(groupedTeams));
  } catch (error) {
    console.error('[TEAMS-PAGE-ERROR] Could not fetch teams from DB:', error);
    return [];
  }
}

export default async function AllTeamsListPage() {
  // Your concurrent data fetching is great. Added a .catch for robustness.
  const [allLeagues, teamOfTheWeek, allNews, topLeagues] = await Promise.all([
    getGroupedTeamsFromDB(),
    fetchTeamOfTheWeek(),
    fetchNewsList(),
    fetchTopLeagues(),
  ]).catch(error => {
    console.error("Failed to fetch page data for Teams List:", error);
    return [[], [], [], []];
  });

  const latestNewsForSidebar = Array.isArray(allNews) ? allNews.slice(0, 3) : [];

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 border-b border-gray-700 pb-4">
          All Teams By League
        </h1>
        <div className="lg:flex lg:gap-8">
          <aside className="w-full lg:w-72 lg:flex-shrink-0 lg:sticky lg:top-4 lg:self-start mb-8 lg:mb-0">
            <LeftSidebar teamOfTheWeek={teamOfTheWeek} latestNews={latestNewsForSidebar} />
          </aside>
          <main className="w-full lg:flex-1">
            <div className="space-y-10">
              {allLeagues.length === 0 ? (
                <div className="text-center text-gray-400 p-8 bg-[#2b3341] rounded-lg">
                  <p className="font-semibold text-lg">No Teams Found</p>
                  <p className="mt-2">Please ensure the database sync has been completed.</p>
                </div>
              ) : (
                allLeagues.map((league) => (
                  <div key={league.leagueName}>
                    <h2 className="text-2xl font-semibold text-white mb-4 border-b-2 border-gray-700 pb-2">
                      {league.leagueName}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {league.teams.map((team) => (
                        <Link 
                          key={team.id}
                          href={`/team/${createTeamSlug(team.name, team.id)}`}
                          className="group bg-[#2b3341] p-4 rounded-lg flex flex-col items-center justify-center text-center hover:bg-[#3e4859] transition-colors h-full"
                        >
                          <Image
                            src={team.logo || '/placeholder-image.jpg'} // Fallback image
                            alt={`${team.name} logo`}
                            width={64}
                            height={64}
                            className="h-16 w-16 object-contain mb-3"
                          />
                          <h3 className="text-white font-semibold text-sm group-hover:underline mt-auto">
                            {team.name}
                          </h3>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
          <aside className="hidden lg:block lg:w-72 lg:flex-shrink-0 lg:sticky lg:top-4 lg:self-start">
             <TeamSidebar initialTopLeagues={topLeagues} />
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}