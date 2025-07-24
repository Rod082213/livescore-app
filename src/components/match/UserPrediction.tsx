// src/components/match/UserPrediction.tsx

"use client";

import Image from "next/image";
import { Odds } from "@/data/mockData";

// Define the shape of the props this component receives
interface UserPredictionProps {
  teams: { home: { name: string; logo: string }; away: { name: string; logo: string } };
  // The odds object contains the numbers we need to format
  odds: Odds;
}

const UserPrediction = ({ teams, odds }: UserPredictionProps) => {

  // --- THIS IS THE FIX ---
  // We check if the odds exist, then format each number to 2 decimal places.
  // The '.toFixed(2)' method converts the long number into a clean string (e.g., 2.55439 -> "2.55").
  const formattedHomeOdd = odds?.home ? odds.home.toFixed(2) : '-';
  const formattedDrawOdd = odds?.draw ? odds.draw.toFixed(2) : '-';
  const formattedAwayOdd = odds?.away ? odds.away.toFixed(2) : '-';
  
  // Find the lowest odd to highlight the most likely outcome
  const minOdd = odds ? Math.min(odds.home, odds.draw, odds.away) : null;

  // This helper function determines the background color for the highlighted odd.
  const getRowClass = (currentOdd: number | undefined) => {
    if (currentOdd && currentOdd === minOdd) {
      return 'bg-blue-600/80 ring-2 ring-blue-500'; // Highlight class
    }
    return 'bg-gray-800/60'; // Default class
  };

  return (
    <div className="space-y-3">
      <h4 className="text-center font-semibold text-gray-300 mb-4">Who will win?</h4>
      
      {/* Home Row */}
      <div className={`flex justify-between items-center p-3 rounded-md transition-all ${getRowClass(odds?.home)}`}>
        <div className="flex items-center gap-3">
          <Image src={teams.home.logo} alt={teams.home.name} width={24} height={24} className="object-contain" />
          <span className="font-semibold">{teams.home.name}</span>
        </div>
        {/* We now display the clean, formatted number */}
        <span className="font-bold text-lg tracking-wider">{formattedHomeOdd}</span>
      </div>
      
      {/* Draw Row */}
      <div className={`flex justify-between items-center p-3 rounded-md transition-all ${getRowClass(odds?.draw)}`}>
        <span className="font-semibold">Draw</span>
        {/* We now display the clean, formatted number */}
        <span className="font-bold text-lg tracking-wider">{formattedDrawOdd}</span>
      </div>

      {/* Away Row */}
      <div className={`flex justify-between items-center p-3 rounded-md transition-all ${getRowClass(odds?.away)}`}>
        <div className="flex items-center gap-3">
          <Image src={teams.away.logo} alt={teams.away.name} width={24} height={24} className="object-contain" />
          <span className="font-semibold">{teams.away.name}</span>
        </div>
        {/* We now display the clean, formatted number */}
        <span className="font-bold text-lg tracking-wider">{formattedAwayOdd}</span>
      </div>
    </div>
  );
}

export default UserPrediction;