// src/components/MatchRow.tsx

"use client";

import { useState } from "react";
import { Match, Odds } from "@/data/mockData"; // Assuming Odds type is exported
import Image from "next/image";
import Link from "next/link";
import { Star, TrendingUp, Loader2 } from "lucide-react"; // Import Loader2
import { generateSlug } from "@/lib/utils";
import { predictOdds } from "@/lib/predictions";

const MatchRow = ({ match }: { match: Match }) => {
  const slug = generateSlug(match.homeTeam.name, match.awayTeam.name, match.id);

  // --- 1. ADD NEW STATE FOR LOADING AND STORING ODDS ---
  const [areOddsVisible, setAreOddsVisible] = useState(false);
  const [isLoadingOdds, setIsLoadingOdds] = useState(false);
  const [displayOdds, setDisplayOdds] = useState<Odds | null>(null);

  // Handle different time/status displays
  const renderTimeOrStatus = () => {
    if (match.status === 'LIVE') return <p className="text-green-500 font-bold">{match.time}</p>;
    if (match.status === 'FT') return <p className="text-gray-400">FT</p>;
    return <p>{match.time?.split(' ')[0]}</p>;
  };

  // --- 2. UPDATE THE CLICK HANDLER ---
  const handleShowOdds = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setIsLoadingOdds(true);

    // Simulate a small network delay so the preloader is visible
    await new Promise(resolve => setTimeout(resolve, 300));

    // Calculate and store the odds
    const calculatedOdds = match.odds || predictOdds(match.homeTeam.name, match.awayTeam.name);
    setDisplayOdds(calculatedOdds);

    setIsLoadingOdds(false);
    setAreOddsVisible(true);
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

      {/* --- 3. UPDATED CONDITIONAL RENDERING FOR ODDS/BUTTON --- */}
      <div className="hidden md:flex justify-around items-center w-48 text-center font-semibold flex-shrink-0">
        {areOddsVisible && displayOdds ? (
          // --- RENDER ODDS ---
          <>
            {((): JSX.Element => {
              const areOddsPredicted = !match.odds;
              const minOdd = Math.min(displayOdds.home, displayOdds.draw, displayOdds.away);
              const getOddClass = (odd: number) => `px-2 py-1 rounded-md transition-colors ${ odd === minOdd ? 'bg-blue-900/50 text-white' : 'text-gray-300' }`;

              return (
                <>
                  <span title={areOddsPredicted ? "Predicted Odd" : "Home Win Odd"} className={getOddClass(displayOdds.home)}>
                    {displayOdds.home.toFixed(2)}
                  </span>
                  <span title={areOddsPredicted ? "Predicted Odd" : "Draw Odd"} className={getOddClass(displayOdds.draw)}>
                    {displayOdds.draw.toFixed(2)}
                  </span>
                  <span title={areOddsPredicted ? "Predicted Odd" : "Away Win Odd"} className={getOddClass(displayOdds.away)}>
                    {displayOdds.away.toFixed(2)}
                  </span>
                </>
              );
            })()}
          </>
        ) : (
          // --- RENDER BUTTON (WITH PRELOADER LOGIC) ---
          <button
            onClick={handleShowOdds}
            disabled={isLoadingOdds} // Disable button while loading
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md border border-blue-500/50 text-blue-400 font-semibold text-xs hover:bg-blue-500/10 transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoadingOdds ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <TrendingUp size={16} />
                Show Odds
              </>
            )}
          </button>
        )}
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