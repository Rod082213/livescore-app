// src/components/MatchListContainer.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { LeagueGroup } from "@/data/mockData";
import { getMatchesByDate } from "@/app/actions";
import Image from "next/image";
import MatchRow from "./MatchRow";
import Link from "next/link";
import DateNavigator from "./DateNavigator";
import { Loader2 } from "lucide-react";

interface MatchListContainerProps {
  initialMatches: LeagueGroup[];
}

const MatchListContainer = ({ initialMatches }: MatchListContainerProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'finished' | 'upcoming'>('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [groupedMatches, setGroupedMatches] = useState<LeagueGroup[]>(initialMatches);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    const loadMatchesForNewDate = async () => {
      setIsLoading(true);
      const matches = await getMatchesByDate(selectedDate);
      setGroupedMatches(matches);
      setIsLoading(false);
    };
    loadMatchesForNewDate();
  }, [selectedDate]);

  const filteredMatchesByTab = (groupedMatches || []).map(group => ({
    ...group,
    matches: group.matches.filter(match => {
      if (activeTab === 'live') return match.status === 'LIVE' || match.status === 'HT';
      if (activeTab === 'finished') return match.status === 'FT';
      if (activeTab === 'upcoming') return match.status === 'UPCOMING';
      return true;
    }),
  })).filter(group => group.matches.length > 0);

  const liveMatchCount = (groupedMatches || []).reduce((count, group) => {
    return count + group.matches.filter(match => match.status === 'LIVE' || match.status === 'HT').length;
  }, 0);

  return (
    <main className="flex-grow">
      {/* Tabs */}
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
      
      {/* Date Navigator */}
      <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {/* Match Groups */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      ) : filteredMatchesByTab.length > 0 ? (
        <div className="space-y-6">
          {filteredMatchesByTab.map(group => (
            <div key={group.leagueName}>
              {/* ===== START: UPDATED LEAGUE HEADER ===== */}
              {/* This is now a simple header without a background or link */}
              <div className="flex items-center gap-3 p-3">
                  <Image src={group.leagueLogo} alt={group.leagueName} width={24} height={24} />
                  <div>
                    <p className="text-gray-400 text-xs">{group.countryName}</p>
                    <p className="text-white font-semibold text-sm">{group.leagueName}</p>
                  </div>
              </div>
              {/* ===== END: UPDATED LEAGUE HEADER ===== */}

              {/* ===== START: UPDATED MATCH LIST CONTAINER ===== */}
              {/* Removed old headers and dividers. Now just provides spacing for the new MatchRow cards. */}
              <div className="space-y-2">
                {group.matches.map(match => <MatchRow key={match.id} match={match} />)}
              </div>
              {/* ===== END: UPDATED MATCH LIST CONTAINER ===== */}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 bg-[#2b3341] rounded-lg">
          <h3 className="text-xl font-semibold">No Matches Scheduled</h3>
          <p>There are no matches for the selected criteria.</p>
        </div>
      )}
    </main>
  );
};

export default MatchListContainer;