"use client";
import { useState } from 'react';
import { Match } from '@/data/mockData';
import Image from 'next/image';

const MatchRow = ({ match }: { match: Match }) => (
    <div className="flex items-center justify-between bg-[#1d222d] p-3 rounded-md">
        <div className="text-center text-xs text-gray-400 w-12">{match.status === 'FT' ? 'FT' : match.time}</div>
        <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Image src={match.homeTeam.logo} alt={match.homeTeam.name} width={20} height={20} />
                <span className="text-sm text-white">{match.homeTeam.name}</span>
            </div>
            <div className="flex items-center gap-2">
                <Image src={match.awayTeam.logo} alt={match.awayTeam.name} width={20} height={20} />
                <span className="text-sm text-white">{match.awayTeam.name}</span>
            </div>
        </div>
        <div className="flex flex-col items-center justify-center font-bold text-white w-8">
            <span>{match.score?.split(' - ')[0]}</span>
            <span>{match.score?.split(' - ')[1]}</span>
        </div>
        
    </div>
);

export default function MatchSchedule({ fixtures }: { fixtures: Match[] }) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'results'>('results');

  const upcomingFixtures = fixtures.filter(f => f.status === 'UPCOMING').sort((a,b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  const finishedFixtures = fixtures.filter(f => f.status === 'FT').sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const fixturesToShow = activeTab === 'upcoming' ? upcomingFixtures : finishedFixtures;

  return (
    <div className="bg-[#2b3341] rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white">Match Schedule</h2>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('upcoming')} className={`px-4 py-1 text-sm rounded-md ${activeTab === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-700'}`}>Upcoming</button>
          <button onClick={() => setActiveTab('results')} className={`px-4 py-1 text-sm rounded-md ${activeTab === 'results' ? 'bg-blue-500 text-white' : 'bg-gray-700'}`}>Results</button>
        </div>
      </div>
      <div className="space-y-2">
        {fixturesToShow.length > 0 ? (
          fixturesToShow.map(match => <MatchRow key={match.id} match={match} />)
        ) : (
          <p className="text-gray-400 text-center py-8">No {activeTab} matches found.</p>
        )}
      </div>
    </div>
  );
};