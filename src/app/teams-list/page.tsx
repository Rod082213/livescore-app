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

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Browse All Football Teams by League',
  description: 'Explore a complete directory of football teams, logos, and standings from top leagues worldwide. Find your favorite team on TodayLiveScores.',
  keywords: ['football teams', 'football clubs', 'team standings'],
  authors: [{ name: 'TodayLiveScores' }],
  publisher: 'TodayLiveScores',
  alternates: {
    canonical: 'https://todaylivescores.com/teams-list',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Browse All Football Teams by League | TodayLiveScores',
    description: 'Explore a complete directory of football teams from top leagues worldwide.',
    url: 'https://todaylivescores.com/teams-list',
    siteName: 'TodayLiveScores',
    images: [{
      url: '/social-card-teams.png',
      width: 1200,
      height: 630,
      alt: 'A directory of all football teams on TodayLiveScores',
    }],
    publishedTime: new Date().toISOString(),
    // CONSISTENCY FIX: Changed 'Author' to 'TodayLiveScores' to match main author tag
    authors: ['TodayLiveScores'], 
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse All Football Teams by League | TodayLiveScores',
    description: 'Explore a complete directory of football teams from top leagues worldwide.',
    images: ['/social-card-teams.png'],
  },
};

async function getGroupedTeamsFromDB() {
    // ... (no changes in this function)
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
              {allLeagues.map((league) => (
                <div key={league.leagueName}>
                  <h2 className="text-2xl font-semibold text-white mb-4 border-b-2 border-gray-700 pb-2">
                    {league.leagueName}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {league.teams.map((team) => (
                      <Link 
                        key={team.id}
                        // --- THIS IS THE CRITICAL UPDATE ---
                        href={`/teams-list/${createTeamSlug(team.name, team.id)}`}
                        className="group bg-[#2b3341] p-4 rounded-lg flex flex-col items-center justify-center text-center hover:bg-[#3e4859] transition-colors h-full"
                      >
                        <Image
                          src={team.logo || '/placeholder-image.jpg'}
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
              ))}
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