// src/app/top-teams/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchAllTeamsInLeague } from '@/lib/api'; // Use the function we created

// Notice we are using `searchParams` here instead of `params`
export default async function TopTeamsPage({ searchParams }: { searchParams: { leagueId: string } }) {
  
  // Get the leagueId from the URL's query parameter
  const leagueId = searchParams.leagueId;

  // Fetch the teams for that specific league
  const teams = await fetchAllTeamsInLeague(leagueId);

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-white mb-6">League Teams</h1>
        
        {teams && teams.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {teams.map((team) => (
              <Link 
                key={team.id}
                href={`/team/${team.id}`} // This can link to your team detail page
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
        ) : (
          <p className="text-center text-gray-400 mt-10 text-lg">
            Could not load teams. Please ensure a valid league is selected.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}