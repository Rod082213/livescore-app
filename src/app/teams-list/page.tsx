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

export const metadata: Metadata = {
  title: 'Browse All Football Teams by League',
  description: 'Explore a complete directory of football teams from top leagues worldwide.',
};

// This function ONLY reads from your database. It is fast and efficient.
async function getGroupedTeamsFromDB() {
  try {
    await connectToDB();
    console.log('[PAGE] Reading grouped teams from the database...');
    const groupedTeams = await Team.aggregate([
      {
        $group: {
          _id: '$leagueName',       // Group by the 'leagueName' field from your DB
          teams: {
            $push: {
              id: '$apiId',         // Read 'apiId' from your DB
              name: '$name',        // Read 'name' from your DB
              logo: '$logoUrl',     // Read 'logoUrl' from your DB
            }
          }
        }
      },
      { $project: { _id: 0, leagueName: '$_id', teams: '$teams' } },
      { $sort: { leagueName: 1 } }
    ]);
    console.log(`[PAGE] Found ${groupedTeams.length} leagues in the database.`);
    return JSON.parse(JSON.stringify(groupedTeams));
  } catch (error) {
    console.error('[PAGE-ERROR] Could not fetch teams from DB:', error);
    return [];
  }
}

export default async function AllTeamsListPage() {
  const [allLeagues, teamOfTheWeek, allNews, topLeagues] = await Promise.all([
    getGroupedTeamsFromDB(),
    fetchTeamOfTheWeek(),
    fetchNewsList(),
    fetchTopLeagues(),
  ]);

  const latestNewsForSidebar = allNews.slice(0, 3);

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />
      <div className="container mx-auto px-4 py-8">
        <BackButton text="Back to Teams List" />
        <h1 className="text-3xl font-bold text-white mb-8">All Teams By League</h1>
        <div className="lg:flex lg:gap-8">
          <aside className="w-full lg:w-72 lg:flex-shrink-0 lg:sticky lg:top-4 lg:self-start">
            <LeftSidebar teamOfTheWeek={teamOfTheWeek} latestNews={latestNewsForSidebar} />
          </aside>
          <main className="w-full lg:flex-1">
            <div className="space-y-10">
              {allLeagues.length === 0 ? (
                <div className="text-center text-gray-400 p-8 bg-[#2b3341] rounded-lg">
                  <p className="font-semibold text-lg">No Teams Found</p>
                  <p className="mt-2">Please run the sync job by sending a POST request to /api/teams/sync</p>
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
                          className="group bg-[#2b3341] p-4 rounded-lg flex flex-col items-center justify-center text-center hover:bg-[#3e4859] transition-colors"
                        >
                          <Image
                            src={team.logo}
                            alt={`${team.name} logo`}
                            width={64}
                            height={64}
                            className="h-16 w-16 object-contain mb-3"
                          />
                          <h3 className="text-white font-semibold text-sm group-hover:underline">
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