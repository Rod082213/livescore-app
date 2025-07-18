// src/components/DashboardWrapper.tsx

'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import MatchListContainer from '@/components/MatchListContainer';
import SportsNav from '@/components/SportsNav';
import SearchResults from '@/components/SearchResults';
import SearchModal from '@/components/SearchModal';
import { getMatchesByDate, searchEverything } from '@/app/actions';
import { LeagueGroup, Match, Team, News } from '@/data/mockData';
import { XCircle, Search } from 'lucide-react';

const isToday = (someDate: Date) => {
  const today = new Date();
  return someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear();
};

const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
};

interface DashboardWrapperProps {
  initialMatches: LeagueGroup[];
  initialTopLeagues: LeagueGroup[];
  initialTeamOfTheWeek: Team[];
  initialLatestNews: (News & { slug: string })[];
  initialFeaturedMatch: Match | null;
}

export default function DashboardWrapper({
  initialMatches,
  initialTopLeagues,
  initialTeamOfTheWeek,
  initialLatestNews,
  initialFeaturedMatch,
}: DashboardWrapperProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<LeagueGroup[]>(initialMatches);
  const [featuredMatch, setFeaturedMatch] = useState<Match | null>(initialFeaturedMatch);
  
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{leagues: any[], teams: any[]}>({leagues: [], teams: []});
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'finished' | 'upcoming'>('all');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const performSearch = useCallback(
    debounce(async (currentQuery: string) => {
      if (currentQuery.length < 3) {
        setSearchResults({ leagues: [], teams: [] });
        setIsSearchLoading(false);
        return;
      }
      setIsSearchLoading(true);
      const data = await searchEverything(currentQuery);
      setSearchResults(data);
      setIsSearchLoading(false);
    }, 500),
    []
  );

  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  useEffect(() => {
    const isViewingToday = isToday(selectedDate);
    let pollingInterval: NodeJS.Timeout | null = null;

    if (!isViewingToday) {
      const loadHistoricData = async () => {
        setIsLoading(true);
        const newMatches = await getMatchesByDate(selectedDate);
        setMatches(newMatches || []);
        setIsLoading(false);
      };
      loadHistoricData();
    } else {
      const loadDashboardData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('/api/dashboard');
          if (!response.ok) throw new Error('Proxy API failed');
          const updatedMatches = await response.json();
          setMatches(updatedMatches);
        } catch (error) {}
        setIsLoading(false);
      };
      
      const isInitialRender = JSON.stringify(matches) === JSON.stringify(initialMatches);
      if (!isInitialRender) {
        loadDashboardData();
      }

      pollingInterval = setInterval(async () => {
        try {
          const response = await fetch('/api/dashboard');
          if (!response.ok) return;
          const polledMatches = await response.json();
          setMatches(polledMatches);
        } catch (error) {}
      }, 15000);
    }
    return () => { if (pollingInterval) clearInterval(pollingInterval); };
  }, [selectedDate]);

  const liveMatchCount = (matches || []).reduce((count, group) => {
    return count + group.matches.filter(match => match.status === 'LIVE' || match.status === 'HT').length;
  }, 0);

  const filteredMatches = useMemo(() => {
    let dataToFilter = matches || [];
    const lowerCaseQuery = query.toLowerCase();

    if (query.length >= 3) {
      dataToFilter = dataToFilter.map(group => ({
          ...group,
          matches: group.matches.filter(match => 
              match.homeTeam.name.toLowerCase().includes(lowerCaseQuery) ||
              match.awayTeam.name.toLowerCase().includes(lowerCaseQuery) ||
              group.leagueName.toLowerCase().includes(lowerCaseQuery)
          )
      })).filter(group => group.matches.length > 0);
    }
    
    return dataToFilter.map(group => ({
        ...group,
        matches: group.matches.filter(match => {
          if (activeTab === 'live') return match.status === 'LIVE' || match.status === 'HT';
          if (activeTab === 'finished') return match.status === 'FT';
          if (activeTab === 'upcoming') return match.status === 'UPCOMING';
          return true;
        }),
      })).filter(group => group.matches.length > 0);
  }, [matches, query, activeTab]);
  
  const handleSelectAndClose = (itemName: string) => {
    setQuery(itemName);
    setIsSearchFocused(false);
    setIsSearchModalOpen(false);
  };
  
  const searchBarComponent = (
    <div 
        ref={searchContainerRef}
        className="w-full relative"
    >
        <div className="w-full flex items-center bg-[#2b3341] rounded-full px-4">
          <Search className="text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search competitions or teams..."
            className="w-full bg-transparent text-white placeholder-gray-400 py-2 px-3 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
          />
        </div>
        {isSearchFocused && query.length >= 3 && (
          <SearchResults 
            results={searchResults}
            isLoading={isSearchLoading}
            onSelectTeam={(team) => handleSelectAndClose(team.name)}
            onSelectLeague={(league) => handleSelectAndClose(league.name)}
          />
        )}
    </div>
  );
 

  return (
    <>
      <Header onSearchToggle={() => setIsSearchModalOpen(true)}>
        {searchBarComponent}
      </Header>

      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)}
      >
        {searchBarComponent}
      </SearchModal>

      <SportsNav liveMatchCount={liveMatchCount} />
      <div className="container mx-auto px-4 py-6">
        <div className="lg:flex lg:gap-6">
          <aside className="w-full lg:w-64 lg:order-1 flex-shrink-0 mb-6 lg:mb-0 lg:sticky lg:top-4 lg:self-start">
            <LeftSidebar teamOfTheWeek={initialTeamOfTheWeek} latestNews={initialLatestNews} />
          </aside>
          <main className="w-full lg:flex-1 lg:order-2 lg:min-w-0">
            {(query.length >= 3) && (
                <div className="bg-gray-800 p-3 rounded-lg mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-sm">Showing results for:</span>
                        <span className="font-semibold text-white">{query}</span>
                    </div>
                    <button onClick={() => setQuery('')} className="text-gray-400 hover:text-white">
                        <XCircle size={20} />
                    </button>
                </div>
            )}
            <MatchListContainer 
              matches={filteredMatches}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              isLoading={isLoading}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              liveMatchCount={liveMatchCount}
            />
          </main>
          <aside className="hidden lg:block lg:w-72 lg:order-3 flex-shrink-0 lg:sticky lg:top-4 lg:self-start">
            <RightSidebar initialTopLeagues={initialTopLeagues} initialFeaturedMatch={featuredMatch} />
          </aside>
        </div>
      </div>
    </>
  );
}