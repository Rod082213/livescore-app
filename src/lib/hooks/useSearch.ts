// src/lib/hooks/useSearch.ts

'use client';

import { useState, useEffect, useCallback } from 'react';
import { searchEverything } from '@/app/actions';

type SearchResult = {
  leagues: any[];
  teams: any[];
};

export function useSearch(
    setSelectedTeam: (team: any | null) => void,
    setSelectedLeague: (league: any | null) => void
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({ leagues: [], teams: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const resetSearch = () => {
    setQuery('');
    setResults({ leagues: [], teams: [] });
    setIsLoading(false);
    setIsFocused(false);
  };
  
  const handleSelectTeam = (team: any) => {
    setSelectedTeam(team);
    resetSearch();
  };
  
  const handleSelectLeague = (league: any) => {
    setSelectedLeague(league);
    resetSearch();
  };

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const performSearch = useCallback(
    debounce(async (currentQuery: string) => {
      if (currentQuery.length < 3) {
        setResults({ leagues: [], teams: [] });
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const searchData = await searchEverything(currentQuery);
      setResults(searchData);
      setIsLoading(false);
    }, 500), 
    []
  );

  useEffect(() => {
    if (query.length > 0 && isFocused) {
        setIsLoading(true);
        performSearch(query);
    } else {
        setResults({ leagues: [], teams: [] });
        setIsLoading(false);
    }
  }, [query, isFocused, performSearch]);

  return { 
    query, 
    setQuery, 
    results, 
    isLoading,
    isFocused,
    setIsFocused,
    handleSelectTeam,
    handleSelectLeague,
  };
}