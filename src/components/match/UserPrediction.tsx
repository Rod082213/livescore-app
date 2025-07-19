// src/components/match/UserPrediction.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';

interface UserPredictionProps {
  teams: { home: { name: string; logo: string }; away: { name:string; logo: string }};
  odds: { home: string; draw: string; away: string };
}

export default function UserPrediction({ teams, odds }: UserPredictionProps) {
  const [selected, setSelected] = useState<'home' | 'draw' | 'away' | null>(null);

  const getButtonClass = (outcome: 'home' | 'draw' | 'away') => {
    const baseClass = "w-full text-left p-3 rounded-lg transition-all duration-200 border-2";
    if (selected === outcome) {
      return `${baseClass} bg-blue-600 border-blue-400 shadow-lg`;
    }
    return `${baseClass} bg-gray-700/50 border-transparent hover:bg-gray-700`;
  };

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-center text-gray-300 text-sm">Who will win?</h4>
      
      <button onClick={() => setSelected('home')} className={getButtonClass('home')}>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2 font-bold">
            <Image src={teams.home.logo} alt={teams.home.name} width={20} height={20} />
            {teams.home.name}
          </span>
          <span className="font-bold text-lg">{odds.home}</span>
        </div>
      </button>

      <button onClick={() => setSelected('draw')} className={getButtonClass('draw')}>
        <div className="flex justify-between items-center">
          <span className="font-bold">Draw</span>
          <span className="font-bold text-lg">{odds.draw}</span>
        </div>
      </button>

      <button onClick={() => setSelected('away')} className={getButtonClass('away')}>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2 font-bold">
            <Image src={teams.away.logo} alt={teams.away.name} width={20} height={20} />
            {teams.away.name}
          </span>
          <span className="font-bold text-lg">{odds.away}</span>
        </div>
      </button>
    </div>
  );
}