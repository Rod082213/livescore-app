// src/components/predictions/PredictionMatchCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Match } from '@/lib/types';
import { IPrediction } from '@/models/Prediction';
import { Hash } from 'lucide-react';

interface PredictionMatchCardProps {
  match: Match & { prediction: IPrediction | null };
}

export default function PredictionMatchCard({ match }: PredictionMatchCardProps) {
  const { prediction } = match;

  if (!prediction) {
    return (
      <div className="block bg-[#2b3341] rounded-lg p-5 text-white shadow-lg text-center">
        <p className="text-gray-400">Prediction data is unavailable for this match.</p>
      </div>
    );
  }

  let predictedOutcomeText = '';
  let predictedWinnerLogo: string | null = null;

  if (prediction.predictedOutcome === 'home') {
    predictedOutcomeText = 'Home Win';
    predictedWinnerLogo = match.homeTeam.logo;
  } else if (prediction.predictedOutcome === 'away') {
    predictedOutcomeText = 'Away Win';
    predictedWinnerLogo = match.awayTeam.logo;
  } else {
    predictedOutcomeText = 'Draw';
  }

  return (
    <Link 
      href={`/match/${match.id}`} 
      className="block bg-[#2b3341] rounded-lg p-5 text-white shadow-lg hover:ring-2 hover:ring-blue-500/80 transition-all duration-200"
    >
      <div className="bg-gray-800/50 p-4 rounded-lg text-center border-2 border-orange-500/50 mb-5">
        <p className="text-xs font-bold text-orange-400 mb-2 flex items-center justify-center gap-2">
          <Hash size={14} /> TODAYLIVESCORES PREDICTION
        </p>
        <div className="flex items-center justify-center gap-3 text-2xl font-bold text-white mb-2">
          {predictedWinnerLogo && <Image src={predictedWinnerLogo} alt="Predicted winner" width={32} height={32} />}
          <span>{predictedOutcomeText}</span>
        </div>
        <p className="text-lg font-semibold text-gray-300">{prediction.confidence}% Confidence</p>
      </div>

      <h4 className="text-center font-semibold text-gray-300 mb-4">Who will win?</h4>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center bg-gray-800/60 p-3 rounded-md">
          <div className="flex items-center gap-3">
            <Image src={match.homeTeam.logo} alt={match.homeTeam.name} width={24} height={24} />
            <span className="font-semibold">{match.homeTeam.name}</span>
          </div>
          {/* --- FINAL FIX FOR DISPLAY --- */}
          <span className="font-bold text-lg">{prediction.odds.home.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center bg-gray-800/60 p-3 rounded-md">
           <span className="font-semibold">Draw</span>
          {/* --- FINAL FIX FOR DISPLAY --- */}
          <span className="font-bold text-lg">{prediction.odds.draw.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center bg-gray-800/60 p-3 rounded-md">
          <div className="flex items-center gap-3">
            <Image src={match.awayTeam.logo} alt={match.awayTeam.name} width={24} height={24} />
            <span className="font-semibold">{match.awayTeam.name}</span>
          </div>
          {/* --- FINAL FIX FOR DISPLAY --- */}
          <span className="font-bold text-lg">{prediction.odds.away.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
};