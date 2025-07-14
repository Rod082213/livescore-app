// src/app/teams-list/page.tsx

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

// Component Imports
import Header from '@/components/Header';
import BackButton from "@/components/BackButton";
import Footer from '@/components/Footer';
import SportsNav from '@/components/SportsNav';
import LeftSidebar from '@/components/LeftSidebar';
import TeamSidebar from '@/components/TeamSidebar'; // Assuming you still use this, otherwise use SimplifiedRightSidebar

// Data Fetching and Utility Imports
import { 
  fetchAllTeamsFromAllLeagues,
  fetchTeamOfTheWeek,
} from '@/lib/api';
import { fetchNewsList } from '@/lib/news-api';
import { createTeamSlug } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Browse All Football Teams by League',
  description: 'Explore a complete directory of football teams from top leagues worldwide. Select any team to view their live scores, upcoming fixtures, and league standings.',
};

export default async function AllTeamsListPage() {
  
  const [allLeagues, teamOfTheWeek, allNews] = await Promise.all([
    fetchAllTeamsFromAllLeagues(),
    fetchTeamOfTheWeek(),
    fetchNewsList()
  ]);

  const latestNewsForSidebar = allNews.slice(0, 3);

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />
      <div className="container mx-auto px-4 py-8">
        
        {/* --- THIS IS THE NEW LOCATION FOR THE H1 --- */}
        <BackButton text="Back to Teams List" />
        <h1 className="text-3xl font-bold text-white mb-8">All Teams By League</h1>

        <div className="lg:flex lg:gap-8">
            
          {/* Column 1: Left Sidebar */}
          <aside className="w-full lg:w-72 lg:flex-shrink-0 lg:sticky lg:top-4 lg:self-start">
            <LeftSidebar 
              teamOfTheWeek={teamOfTheWeek} 
              latestNews={latestNewsForSidebar}
            />
          </aside>
            
          {/* Column 2: Main Content Area */}
          <main className="w-full lg:flex-1">
            {/* --- THE H1 HAS BEEN REMOVED FROM HERE --- */}
            <div className="space-y-10">
              {allLeagues.map((league) => (
                <div key={league.name}>
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
              ))}
            </div>
          </main>
          
          {/* Column 3: Right Sidebar */}
          <aside className="hidden lg:block lg:w-72 lg:flex-shrink-0 lg:sticky lg:top-4 lg:self-start">
             <TeamSidebar />
          </aside>

        </div>
      </div>
      <Footer />
    </div>
  );
}