// src/components/MatchDetailHeader.tsx
import { Match } from '@/data/mockData';
import Image from 'next/image';
import { Shield } from 'lucide-react';

const MatchDetailHeader = ({ match }: { match: Match }) => {
  return (
    <div className="bg-[#2b3341] rounded-lg p-6 text-center">
      <div className="flex justify-center items-center gap-2 text-gray-400 mb-4">
        <Shield size={16} />
        <span className="font-semibold">{match.league}</span>
      </div>
      <div className="grid grid-cols-3 items-center">
        <div className="flex flex-col items-center gap-3">
          <Image src={match.homeTeam.logo} alt={match.homeTeam.name} width={80} height={80} className="h-16 w-16 md:h-20 md:w-20 object-contain"/>
          <h2 className="text-xl md:text-2xl font-bold text-white">{match.homeTeam.name}</h2>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="text-4xl md:text-6xl font-bold text-white">{match.status === 'UPCOMING' ? match.time : match.score}</div>
          <p className="text-sm text-gray-400">{match.status}</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Image src={match.awayTeam.logo} alt={match.awayTeam.name} width={80} height={80} className="h-16 w-16 md:h-20 md:w-20 object-contain"/>
          <h2 className="text-xl md:text-2xl font-bold text-white">{match.awayTeam.name}</h2>
        </div>
      </div>
    </div>
  );
};
export default MatchDetailHeader;