"use client";

import { useState, useMemo, useEffect } from "react";
import { LeagueGroup, Match } from "@/data/mockData";
import Image from "next/image";
import MatchRow from "./MatchRow";
import DateNavigator from "./DateNavigator";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";

interface MatchListContainerProps {
  matches: LeagueGroup[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  isLoading: boolean;
  activeTab: 'all' | 'live' | 'finished' | 'upcoming';
  setActiveTab: (tab: 'all' | 'live' | 'finished' | 'upcoming') => void;
  liveMatchCount: number;
}

const MatchListContainer = ({ 
    matches, 
    selectedDate, 
    onDateChange, 
    isLoading,
    activeTab,
    setActiveTab,
    liveMatchCount
}: MatchListContainerProps) => {

  const [currentPage, setCurrentPage] = useState(1);
  const MATCHES_PER_PAGE = 20;

  useEffect(() => {
    setCurrentPage(1);
  }, [matches, activeTab, selectedDate]);

  const { paginatedMatches, totalPages } = useMemo(() => {
    const allMatches = matches.flatMap(group => 
        group.matches.map(match => ({ ...match, leagueInfo: group }))
    );
    
    const totalMatches = allMatches.length;
    const totalPages = Math.ceil(totalMatches / MATCHES_PER_PAGE);
    const startIndex = (currentPage - 1) * MATCHES_PER_PAGE;
    const endIndex = startIndex + MATCHES_PER_PAGE;
    const paginatedMatches = allMatches.slice(startIndex, endIndex);

    return { paginatedMatches, totalPages };
  }, [matches, currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <main className="flex-grow">
      <div className="flex items-center border-b border-gray-700 mb-4">
         {['all', 'live', 'finished', 'upcoming'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
          >
            <div className="flex items-center justify-center gap-2">
              {tab === 'live' && (<span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>)}
              <span>{tab}</span>
              {tab === 'live' && liveMatchCount > 0 && (
                <span className="text-green-400 font-medium text-xs">
                  {liveMatchCount}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
      
      <DateNavigator selectedDate={selectedDate} onDateChange={onDateChange} />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      ) : matches.length > 0 ? (
        <>
          <div className="space-y-2">
            {paginatedMatches.map((match, index, array) => {
              const showHeader = index === 0 || match.leagueInfo.leagueName !== array[index - 1].leagueInfo.leagueName;
              return (
                <div key={match.id}>
                  {showHeader && (
                    <div className="flex items-center gap-3 p-3 mt-4">
                      <Image src={match.leagueInfo.leagueLogo} alt={match.leagueInfo.leagueName} width={24} height={24} />
                      <div>
                        <p className="text-gray-400 text-xs">{match.leagueInfo.countryName}</p>
                        <p className="text-white font-semibold text-sm">{match.leagueInfo.leagueName}</p>
                      </div>
                    </div>
                  )}
                  <MatchRow match={match} />
                </div>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={16} />
                Previous
              </button>
              <span className="font-semibold text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 text-gray-400 bg-[#2b3341] rounded-lg">
          <h3 className="text-xl font-semibold">No Matches Found</h3>
          <p>There are no matches for the selected criteria.</p>
        </div>
      )}
    </main>
  );
};

export default MatchListContainer;