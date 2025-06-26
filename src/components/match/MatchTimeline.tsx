import { BarChartHorizontal } from 'lucide-react';

const getHomeBarWidth = (home: any, away: any): string => {
  if (typeof home === 'string' && home.includes('%')) return home;
  const homeVal = Number(home) || 0;
  const awayVal = Number(away) || 0;
  const total = homeVal + awayVal;
  if (total === 0) return '50%';
  return `${(homeVal / total) * 100}%`;
};

// Add matchStatus to the props
const MatchStatistics = ({ statistics, matchStatus }: { statistics?: Record<string, { home: any; away: any; }>, matchStatus: string }) => {
  
  // Check if stats are available
  const hasStats = statistics && Object.keys(statistics).length > 0;

  return (
    <div className="bg-[#2b3341] rounded-lg p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <BarChartHorizontal size={20} /> Match Statistics
      </h3>
      
      {/* If stats exist, display them */}
      {hasStats ? (
        <div className="space-y-4">
          {Object.entries(statistics).map(([type, values]) => (
            <div key={type}>
              <div className="flex justify-between items-center mb-1 text-sm font-semibold text-white">
                <span>{values.home ?? '-'}</span>
                <span className="text-gray-400">{type}</span>
                <span>{values.away ?? '-'}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 flex">
                <div 
                  className="bg-blue-500 h-2 rounded-l-full" 
                  style={{ width: getHomeBarWidth(values.home, values.away) }}
                ></div>
                <div className="bg-gray-500 h-2 rounded-r-full flex-grow"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // If no stats, show a message based on the match status
        <div className="text-center text-gray-400 py-8">
          {matchStatus === 'UPCOMING'
            ? 'Statistics will be available once the match starts.'
            : 'No statistics were recorded for this match.'
          }
        </div>
      )}
    </div>
  );
};

export default MatchStatistics;