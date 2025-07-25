'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // 1. Import the Link component

// Helper function to get initials from a name (your existing function)
const getInitials = (name: string) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// 2. Define a more specific type for the component props
interface SquadListProps {
  squad: any[];
  teamSlug: string; // Add teamSlug to receive the team's URL part
}

export default function SquadList({ squad, teamSlug }: SquadListProps) {
  const [filter, setFilter] = useState('All');

  if (!squad || squad.length === 0) {
    return <div className="bg-[#2b3341] rounded-lg p-4 text-center text-gray-400">Squad data not available.</div>;
  }

  const totalPlayers = squad.length;
  const averageAge = (squad.reduce((sum, player) => sum + player.age, 0) / totalPlayers).toFixed(1);
  const filteredSquad = filter === 'All' ? squad : squad.filter(p => p.position === filter);
  const positions = ['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Attacker'];

  return (
    <div className="bg-[#2b3341] rounded-lg p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white">Full Squad</h2>
        <div className="text-right text-sm">
          <p>Total Players: <span className="font-bold text-white">{totalPlayers}</span></p>
          <p>Average Age: <span className="font-bold text-white">{averageAge}</span></p>
        </div>
      </div>
      <div className="flex gap-2 mb-4 border-b border-gray-700 pb-4 overflow-x-auto">
        {positions.map(pos => (
          <button key={pos} onClick={() => setFilter(pos)}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${filter === pos ? 'bg-blue-500 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}>
            {pos}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredSquad.map((player: any) => (
          // 3. Wrap the entire player card div in the Link component
          <Link 
            href={`/teams-list/${teamSlug}/player/${player.id}`} 
            key={player.id} 
            className="text-center group"
          >
            <div className="relative w-20 h-20 mx-auto mb-2">
              {player.photo ? (
                <Image 
                  src={player.photo} 
                  alt={player.name} 
                  fill 
                  className="rounded-full object-cover bg-gray-700 transition-transform group-hover:scale-110" 
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center transition-transform group-hover:scale-110">
                  <span className="text-xl font-bold text-white">{getInitials(player.name)}</span>
                </div>
              )}
              <span className="absolute top-0 right-0 bg-gray-900 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#2b3341]">
                {player.number || '-'}
              </span>
            </div>
            <p className="text-white font-semibold truncate group-hover:text-blue-400 transition-colors">{player.name}</p>
            <p className="text-gray-400 text-sm">{player.age} years</p>
          </Link>
        ))}
      </div>
    </div>
  );
};