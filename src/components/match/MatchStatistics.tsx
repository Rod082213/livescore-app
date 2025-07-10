// src/components/match/MatchStatistics.tsx
"use client";

import { BarChartHorizontal } from 'lucide-react';

const StatBar = ({ homeValue, awayValue }: { homeValue: any, awayValue: any }) => {
    const home = Number(String(homeValue).replace('%','')) || 0;
    const away = Number(String(awayValue).replace('%','')) || 0;
    const total = home + away;

    if (total === 0) {
        return <div className="w-full h-1.5 bg-gray-700 rounded-full" />;
    }

    const homePercentage = (home / total) * 100;
    const awayPercentage = (away / total) * 100;

    return (
        <div className="w-full flex h-1.5 rounded-full bg-lime-300 overflow-hidden">
            <div 
                className="bg-sky-400" 
                style={{ width: `${homePercentage}%` }}
            ></div>
        </div>
    );
};

const MatchStatistics = ({ statistics, status }: { statistics?: Record<string, { home: any; away: any; }>, status: string }) => {
  
  const hasStats = statistics && Object.keys(statistics).length > 0;

  return (
    <div className="bg-[#2b3341] rounded-lg p-6">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <BarChartHorizontal size={20} /> Match Statistics
      </h3>
      
      {hasStats ? (
        <div className="space-y-4">
          {Object.entries(statistics).map(([type, values]) => (
            <div key={type}>
              <div className="flex justify-between items-center mb-1 text-sm font-semibold text-white">
                <span className="w-12 text-left">{values.home ?? '0'}</span>
                <span className="text-gray-400">{type}</span>
                <span className="w-12 text-right">{values.away ?? '0'}</span>
              </div>
              <StatBar homeValue={values.home} awayValue={values.away} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          {status === 'UPCOMING'
            ? 'Statistics will be available once the match starts.'
            : 'No statistics were recorded for this match.'
          }
        </div>
      )}
    </div>
  );
};

export default MatchStatistics;