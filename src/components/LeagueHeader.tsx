// src/components/LeagueHeader.tsx
import Image from 'next/image';
import { Star, ChevronDown } from 'lucide-react';

const LeagueHeader = () => {
  return (
    <div className="bg-[#2b3341] rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image src="https://media.api-sports.io/football/leagues/39.png" alt="League Logo" width={64} height={64} />
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Premier League
            <Star className="w-5 h-5 text-gray-500 hover:text-yellow-400 cursor-pointer" />
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
            <Image src="https://media.api-sports.io/flags/gb.svg" alt="England" width={16} height={16} />
            England
            <button className="flex items-center gap-1">2024/2025 <ChevronDown size={16} /></button>
          </div>
        </div>
      </div>
      <div className="text-right text-gray-400 text-sm">
        <p>17 Aug</p>
        <div className="w-full h-1 bg-gray-600 rounded-full my-1"><div className="w-1/4 bg-blue-500 h-1 rounded-full"></div></div>
        <p>25 May</p>
      </div>
    </div>
  );
};
export default LeagueHeader;