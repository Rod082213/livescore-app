// src/components/MatchRow.tsx (UPDATED)

import { Match } from "@/data/mockData";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { generateSlug } from "@/lib/utils";
import { predictOdds } from "@/lib/predictions"; // <--- 1. IMPORT THE NEW FUNCTION

const MatchRow = ({ match }: { match: Match }) => {
  const slug = generateSlug(match.homeTeam.name, match.awayTeam.name, match.id);

  // --- 2. LOGIC FOR HANDLING REAL OR PREDICTED ODDS ---
  // If real odds exist, use them. Otherwise, generate predicted odds.
  const areOddsPredicted = !match.odds;
  const displayOdds = match.odds || predictOdds(match.homeTeam.name, match.awayTeam.name);

  // Determine the minimum odd to highlight the favorite, using the displayOdds.
  const minOdd = Math.min(displayOdds.home, displayOdds.draw, displayOdds.away);

  // Handle different time/status displays
  const renderTimeOrStatus = () => {
    if (match.status === 'LIVE') {
      return <p className="text-green-500 font-bold">{match.time}</p>;
    }
    if (match.status === 'FT') {
      return <p className="text-gray-400">FT</p>;
    }
    const timeString = match.time?.split(' ')[0];
    return <p>{timeString}</p>;
  };

  return (
    <Link 
      href={`/match/${slug}`} 
      className="flex items-center p-3 text-sm text-gray-300 bg-[#2b3341] rounded-lg hover:bg-[#343c4c] transition-colors"
    >
      {/* Time/Status Column */}
      <div className="w-14 text-center flex-shrink-0">
        {renderTimeOrStatus()}
      </div>
      
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

      {/* --- 3. UPDATED ODDS COLUMN --- */}
      {/* This column now always displays odds, either real or predicted. */}
      <div className="hidden md:flex justify-around items-center w-48 text-center font-semibold flex-shrink-0">
        <span 
          title={areOddsPredicted ? "Predicted Odd" : "Home Win Odd"}
          className={`px-2 py-1 rounded-md transition-colors ${
            displayOdds.home === minOdd 
              ? areOddsPredicted ? 'bg-blue-900/50 text-white' : 'bg-yellow-800/70 text-white' // Style predicted favorites differently
              : 'text-gray-300'
          }`}
        >
          {displayOdds.home.toFixed(2)}
        </span>
        <span 
          title={areOddsPredicted ? "Predicted Odd" : "Draw Odd"}
          className={`px-2 py-1 rounded-md transition-colors ${
            displayOdds.draw === minOdd 
              ? areOddsPredicted ? 'bg-blue-900/50 text-white' : 'bg-yellow-800/70 text-white'
              : 'text-gray-300'
          }`}
        >
          {displayOdds.draw.toFixed(2)}
        </span>
        <span
          title={areOddsPredicted ? "Predicted Odd" : "Away Win Odd"}
          className={`px-2 py-1 rounded-md transition-colors ${
            displayOdds.away === minOdd 
              ? areOddsPredicted ? 'bg-blue-900/50 text-white' : 'bg-yellow-800/70 text-white'
              : 'text-gray-300'
          }`}
        >
          {displayOdds.away.toFixed(2)}
        </span>
      </div>

      {/* Score/Placeholder Column */}
      <div className="flex flex-col items-center w-12 ml-auto md:ml-2 md:mr-2 text-gray-400 font-bold flex-shrink-0">
        {match.status !== 'UPCOMING' && match.score ? (
          <>
            <span>{match.score.split('-')[0].trim()}</span>
            <span>{match.score.split('-')[1].trim()}</span>
          </>
        ) : (
          <>
            <span>-</span>
            <span>-</span>
          </>
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