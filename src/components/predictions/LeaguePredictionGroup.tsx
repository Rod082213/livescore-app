"use client";

import { useState, Children, ReactNode } from 'react'; // <-- Import Children and ReactNode
import Image from 'next/image';
// REMOVE THE IMPORT for PredictionMatchCard. It shouldn't be here.

interface LeagueGroupProps {
  leagueName: string;
  leagueLogo: string;
  countryName: string;
  children: ReactNode; // <-- Accept children instead of a 'matches' array
}

const PREVIEW_COUNT = 4;

const LeaguePredictionGroup = ({ leagueName, leagueLogo, countryName, children }: LeagueGroupProps) => {
  const [showAll, setShowAll] = useState(false);

  // Convert the React children into a plain array so we can slice it
  const allMatchesAsArray = Children.toArray(children);

  const itemsToShow = showAll ? allMatchesAsArray : allMatchesAsArray.slice(0, PREVIEW_COUNT);
  
  return (
    <div className="mb-8">
      {/* League Header (this part is unchanged) */}
      <div className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-t-lg sticky top-0 z-10">
        <Image src={leagueLogo} alt={leagueName} width={32} height={32} />
        <div>
          <h2 className="font-bold text-lg text-white">{leagueName}</h2>
          <p className="text-sm text-gray-400">{countryName}</p>
        </div>
      </div>
      
      {/* Matches Grid now renders the items we sliced from children */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#1e2530] p-4 rounded-b-lg">
        {itemsToShow}
      </div>

      {/* Load More Button (logic is slightly adjusted for the array of children) */}
      {!showAll && allMatchesAsArray.length > PREVIEW_COUNT && (
        <div className="text-center -mt-2">
            <button
                onClick={() => setShowAll(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-b-lg transition-colors duration-200 w-full md:w-auto"
            >
                Load More ({allMatchesAsArray.length - PREVIEW_COUNT} more)
            </button>
        </div>
      )}
    </div>
  );
};

export default LeaguePredictionGroup;