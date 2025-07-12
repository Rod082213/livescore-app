import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SportsNav from '@/components/SportsNav';
import LeftSidebar from '@/components/LeftSidebar';
import TeamSidebar from '@/components/TeamSidebar';

import { 
  fetchAllTeamsFromAllLeagues,
  fetchTeamOfTheWeek,
  fetchLatestNews 
} from '@/lib/api';

export default async function AllTeamsListPage() {
  
  // Fetch data for the main content AND the LeftSidebar
  const [allLeagues, teamOfTheWeek, latestNews] = await Promise.all([
    fetchAllTeamsFromAllLeagues(),
    fetchTeamOfTheWeek(),
    fetchLatestNews()
  ]);

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />
      <div className="container mx-auto px-4 py-6">
        {/* This is the three-column layout container */}
        <div className="flex flex-col lg:flex-row gap-6">
            
          {/* Column 1: Left Sidebar */}
          <aside className="lg:w-72 lg:flex-shrink-0 lg:sticky lg:top-4">
            <LeftSidebar 
              teamOfTheWeek={teamOfTheWeek} 
              latestNews={latestNews} 
            />
          </aside>
            
          {/* Column 2: Main Content Area */}
          <main className="w-full lg:flex-1">
            <h1 className="text-3xl font-bold text-white mb-8">All Teams By League</h1>
            <div className="space-y-10">
              {allLeagues.map((league) => (
                <div key={league.leagueName}>
                  <h2 className="text-2xl font-semibold text-white mb-4 border-b-2 border-gray-700 pb-2">
                    {league.leagueName}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {league.teams.map((team) => (
                      <Link 
                        key={team.id}
                        href={`/team/${team.id}`}
                        className="group bg-[#2b3341] p-4 rounded-lg flex flex-col items-center justify-center text-center hover:bg-[#3e4859] transition-colors"
                      >
                        <Image
                          src={team.logo}
                          alt={team.name}
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
          <aside className="lg:w-72 lg:flex-shrink-0 ">
             <TeamSidebar />
          </aside>

        </div>
      </div>
      <Footer />
    </div>
  );
}