// src/components/SearchResults.tsx

import Image from 'next/image';
import { Loader2, Shield, Users } from 'lucide-react';

type SearchResultsProps = {
  results: {
    leagues: any[];
    teams: any[];
  };
  isLoading: boolean;
  onSelectTeam: () => void;
  onSelectLeague: () => void;
};

export default function SearchResults({ results, isLoading, onSelectTeam, onSelectLeague }: SearchResultsProps) {
  const hasResults = results.leagues.length > 0 || results.teams.length > 0;

  return (
    <div className="absolute top-full mt-2 w-full max-w-lg bg-[#2b3341] rounded-lg shadow-lg overflow-hidden border border-gray-700 z-50">
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : hasResults ? (
        <div>
          {results.leagues.length > 0 && (
            <div className="p-2">
              <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase px-2 mb-1">
                <Shield size={14} /> Leagues
              </h3>
              <ul>
                {results.leagues.slice(0, 5).map(({ league, country }) => (
                  <li key={league.id}>
                    <button onClick={onSelectLeague} className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-700/50 text-left">
                      <Image src={league.logo} alt={league.name} width={24} height={24} />
                      <div>
                        <p className="text-sm font-semibold text-white">{league.name}</p>
                        <p className="text-xs text-gray-400">{country.name}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {results.teams.length > 0 && (
            <div className="p-2 border-t border-gray-700">
              <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase px-2 mb-1">
                <Users size={14} /> Teams
              </h3>
              <ul>
                {results.teams.slice(0, 5).map(({ team }) => (
                  <li key={team.id}>
                    <button onClick={onSelectTeam} className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-700/50 text-left">
                      <Image src={team.logo} alt={team.name} width={24} height={24} />
                      <p className="text-sm font-semibold text-white">{team.name}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 text-center text-sm text-gray-400">
          No results found for your query.
        </div>
      )}
    </div>
  );
}