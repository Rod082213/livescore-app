// src/components/predictions/PredictionMatchRow.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Match } from '@/lib/types';
import { generatePredictionData } from '@/lib/predictions';
import { Clock } from 'lucide-react';

interface PredictionMatchRowProps {
  match: Match;
}

const PredictionMatchRow = ({ match }: PredictionMatchRowProps) => {
  // If team names are missing, we can't generate a prediction.
  if (!match.homeTeam?.name || !match.awayTeam?.name) {
    return null; // Or render a fallback state for this specific row
  }
  
  const { odds } = generatePredictionData(match.homeTeam.name, match.awayTeam.name);

  // Find the lowest odd to highlight the most likely outcome
  const oddsValues = { home: parseFloat(odds.home), draw: parseFloat(odds.draw), away: parseFloat(odds.away) };
  const minOdd = Math.min(oddsValues.home, oddsValues.draw, oddsValues.away);

  const getOddBgClass = (oddValue: number) => {
    return oddValue === minOdd ? 'bg-orange-500/80 text-white' : 'bg-gray-700/50';
  };

  return (
    <Link href={`/match/${match.id}`} className="block hover:bg-gray-800/60 rounded-lg transition-colors duration-200">
      <div className="flex items-center text-white p-3 border-b border-gray-700/50">
        {/* Match Time/Status */}
        <div className="w-16 text-center text-sm font-semibold">
          {match.status === 'UPCOMING' ? (
            <div className="flex flex-col items-center">
              <Clock size={16} className="mb-1" />
              <span>{match.time}</span>
            </div>
          ) : (
            <span className={`font-bold ${match.status === 'LIVE' ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
              {match.time}
            </span>
          )}
        </div>

        {/* Teams */}
        <div className="flex-1 flex flex-col gap-2 mx-4">
          <div className="flex items-center gap-3">
            <Image src={match.homeTeam.logo} alt={match.homeTeam.name} width={24} height={24} />
            <span className="font-medium">{match.homeTeam.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Image src={match.awayTeam.logo} alt={match.awayTeam.name} width={24} height={24} />
            <span className="font-medium">{match.awayTeam.name}</span>
          </div>
        </div>

        {/* Predictions */}
        <div className="flex items-center gap-2 font-bold text-sm">
          <div className={`w-20 text-center p-2 rounded-md transition-colors ${getOddBgClass(oddsValues.home)}`}>
            <span className="text-gray-300 mr-2">1</span>
            {odds.home}
          </div>
          <div className={`w-20 text-center p-2 rounded-md transition-colors ${getOddBgClass(oddsValues.draw)}`}>
            <span className="text-gray-300 mr-2">X</span>
            {odds.draw}
          </div>
          <div className={`w-20 text-center p-2 rounded-md transition-colors ${getOddBgClass(oddsValues.away)}`}>
            <span className="text-gray-300 mr-2">2</span>
            {odds.away}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PredictionMatchRow;