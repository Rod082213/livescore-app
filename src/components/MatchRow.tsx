// src/components/MatchRow.tsx

"use client";

import { Match } from "@/data/mockData";
import { IPrediction } from "@/models/Prediction";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import { generateSlug } from "@/lib/utils";

interface MatchRowProps {
  match: Match & { prediction: IPredicion | null };
}

const MatchRow = ({ match }: MatchRowProps) => {
  const slug = generateSlug(match.homeTeam.name, match.awayTeam.name, match.id);

  const renderTimeOrStatus = () => {
    if (match.status === 'LIVE') return <p className="text-green-500 font-bold">{match.time}</p>;
    if (match.status === 'FT') return <p className="text-gray-400">FT</p>;
    return <p>{match.time?.split(' ')[0]}</p>;
  };

  return (
    <Link 
      href={`/match/${slug}`} 
      className="flex items-center p-3 text-sm text-gray-300 bg-[#2b3341] rounded-lg hover:bg-[#343c4c] transition-colors"
    >
      {/* Time/Status Column */}
      <div className="w-14 text-center flex-shrink-0">{renderTimeOrStatus()}</div>
      
      {/* Teams Column */}
      <div className="flex-grow mx-4">
        <div className="flex items-center gap-3">
          <Image src={match.homeTeam.logo} alt={match.homeTeam.name} width={20} height={20} className="object-contain"/>
          <span className="font-semibold text-white truncate">{match.homeTeam.name}</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Image src={match.awayTeam.logo} alt={match.awayTeam.name} width={20} height={20} className="object-contain"/>
          <span className="font-semibold text-white truncate">{match.awayTeam.name}</span>
        </div>
      </div>

      {/* --- THIS IS THE UPDATED BUTTON STYLING --- */}
      <div className="hidden md:flex justify-end items-center w-48 text-center font-semibold flex-shrink-0">
        <div
          // The CSS classes here have been changed to make the button blue and bold.
          className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md border border-blue-500/50 text-blue-400 font-bold text-xs hover:bg-blue-500/10 transition-colors"
        >
          <span>See Details</span>
          <ChevronRight size={16} />
        </div>
      </div>

      {/* Score/Placeholder Column */}
      <div className="flex flex-col items-center w-12 ml-auto md:ml-2 md:mr-2 text-gray-400 font-bold flex-shrink-0">
        {match.status !== 'UPCOMING' && match.score ? (
          <>
            <span>{match.score.split('-')[0].trim()}</span>
            <span>{match.score.split('-')[1].trim()}</span>
          </>
        ) : (
          <span>-</span>
        )}
      </div>

      {/* Favorite Icon */}
      <div className="hidden md:flex w-8 justify-center flex-shrink-0">
          <Star className="w-5 h-5 text-gray-500 hover:text-yellow-400"/>
      </div>
    </Link>
  );
};

export default MatchRow;