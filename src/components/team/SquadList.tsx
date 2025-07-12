"use client";
import { useState } from 'react';
import Image from 'next/image';

export default function SquadList({ squad }: { squad: any[] }) {
  const [filter, setFilter] = useState('All');

  if (!squad || squad.length === 0) {
    return <div className="bg-[#2b3341] rounded-lg p-4 text-center text-gray-400">Squad data not available.</div>;
  }

  const totalPlayers = squad.length;
  const averageAge = (squad.reduce((sum, player) => sum + player.age, 0) / totalPlayers).toFixed(1);
  const filteredSquad = filter === 'All' ? squad : squad.filter(p => p.position === filter);
  const positions = ['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Attacker'];

  return (
    <div className="bg-[#2b3341] rounded-lg p-4">
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
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${filter === pos ? 'bg-blue-500 text-white font-bold' : 'bg-gray-700'}`}>
            {pos}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {filteredSquad.map((player: any) => (
          <div key={player.id} className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-2">
              <Image src={player.photo} alt={player.name} fill className="rounded-full object-cover bg-gray-700" />
              <span className="absolute top-0 right-0 bg-gray-900 text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-600">{player.number || '-'}</span>
            </div>
            <p className="text-white font-semibold">{player.name}</p>
            <p className="text-gray-400 text-sm">{player.age} years</p>
          </div>
        ))}
      </div>
    </div>
  );
};