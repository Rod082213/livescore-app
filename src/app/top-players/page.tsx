// src/app/top-players/page.tsx

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { fetchAllTopPlayers } from '@/lib/api'; // Import our new function
import { Player } from '@/data/mockData';

export default async function AllTopPlayersPage() {
  // Fetch the full list of players for the default league
  const allPlayers = await fetchAllTopPlayers();

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-white mb-6">Top Players</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allPlayers.map((player: Player, index: number) => (
            <div key={index} className="bg-[#2b3341] p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image 
                    src={player.logo} 
                    alt={player.name} 
                    width={48} 
                    height={48} 
                    className="rounded-full bg-gray-700 object-cover" 
                />
                <h3 className="text-white font-semibold text-base">{player.name}</h3>
              </div>
              <div className="bg-blue-600 text-white text-lg font-bold px-4 py-1 rounded-md">
                {player.rating}
              </div>
            </div>
          ))}
        </div>

        {(!allPlayers || allPlayers.length === 0) && (
          <p className="text-center text-gray-400 mt-10 text-lg">
            No top player data could be loaded at this time.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}