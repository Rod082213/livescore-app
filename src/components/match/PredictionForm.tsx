// src/components/match/PredictionForm.tsx (or MatchPrediction.tsx)
"use client";

import Image from 'next/image';
import { TrendingUp, CheckCircle, XCircle, Hash, AlertTriangle } from 'lucide-react'; // Added AlertTriangle icon
import { generatePredictionData } from '@/lib/predictions';
import UserPrediction from './UserPrediction';

const FormPill = ({ result }: { result: string }) => { /* ... (code unchanged) ... */ };

interface MatchPredictionProps {
  form?: { home: string; away: string };
  teams: { home: { name: string; logo: string }; away: { name:string; logo: string }};
  status: string;
  score: string;
}

const MatchPrediction = ({ form, teams, status, score }: MatchPredictionProps) => {
    // --- DEFENSIVE CHECK ---
    // If for any reason the teams data is incomplete, show a graceful fallback and stop.
    if (!teams?.home?.name || !teams?.away?.name) {
      return (
        <div className="bg-[#2b3341] rounded-lg p-6 text-white text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-yellow-500 mb-3" />
            <h3 className="text-lg font-bold">Prediction Unavailable</h3>
            <p className="text-sm text-gray-400">Match data is incomplete for this fixture.</p>
        </div>
      );
    }
    // --- END OF CHECK ---

    const { odds, percentages } = generatePredictionData(teams.home.name, teams.away.name);

    // ... The rest of your component logic for determining the winner and rendering ...
    // This part remains exactly the same as the previous version.
    
    const confidence = Math.max(percentages.home, percentages.draw, percentages.away);
    let predictedOutcome: 'home' | 'draw' | 'away';
    let predictedOutcomeText = '';
    let predictedWinnerLogo: string | null = null;

    if (confidence === percentages.home) {
        predictedOutcome = 'home';
        predictedOutcomeText = 'Home Win';
        predictedWinnerLogo = teams.home.logo;
    } else if (confidence === percentages.away) {
        predictedOutcome = 'away';
        predictedOutcomeText = 'Away Win';
        predictedWinnerLogo = teams.away.logo;
    } else {
        predictedOutcome = 'draw';
        predictedOutcomeText = 'Draw';
    }

    const isFinished = status === 'FT';
    let isPredictionHit = false;
    let actualOutcomeText = '';

    if (isFinished) {
        const [homeScoreStr, awayScoreStr] = score.split(' - ');
        const homeScore = parseInt(homeScoreStr);
        const awayScore = parseInt(awayScoreStr);
        let actualOutcome: 'home' | 'draw' | 'away';
        if (homeScore > awayScore) { actualOutcome = 'home'; actualOutcomeText = 'Home Win'; } 
        else if (awayScore > homeScore) { actualOutcome = 'away'; actualOutcomeText = 'Away Win'; } 
        else { actualOutcome = 'draw'; actualOutcomeText = 'Draw'; }
        isPredictionHit = predictedOutcome === actualOutcome;
    }

    return (
        <div className="bg-[#2b3341] rounded-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={20} /> Match Prediction
            </h3>
            {isFinished ? (
                <div className={`p-4 rounded-lg text-center border-2 ${isPredictionHit ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'}`}>
                    <div className={`flex items-center justify-center gap-2 font-bold text-lg mb-1 ${isPredictionHit ? 'text-green-400' : 'text-red-400'}`}>
                        {isPredictionHit ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        <span>{isPredictionHit ? 'PREDICTION HIT!' : 'PREDICTION MISSED'}</span>
                    </div>
                    <p className="text-xl font-bold text-white">{actualOutcomeText}</p>
                </div>
            ) : (
                <div className="bg-gray-800/50 p-4 rounded-lg text-center border-2 border-orange-500/50">
                    <p className="text-xs font-bold text-orange-400 mb-2 flex items-center justify-center gap-2"><Hash size={14} /> TODAYLIVESCORES PREDICTION</p>
                    <div className="flex items-center justify-center gap-3 text-2xl font-bold text-white mb-2">
                        {predictedWinnerLogo && <Image src={predictedWinnerLogo} alt="Predicted winner" width={32} height={32} />}
                        <span>{predictedOutcomeText}</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-300">{confidence}% Confidence</p>
                </div>
            )}
            {form && (form.home || form.away) && (
              <div className="space-y-3 my-6 border-t border-gray-700/50 pt-4">
                  {/* ... form logic ... */}
              </div>
            )}
            <div className="border-t border-gray-700/50 pt-4 mt-6">
              <UserPrediction teams={teams} odds={odds} />
            </div>
            <p className="text-xs text-gray-500 text-center mt-6">
              Predictions are based on an algorithmic analysis and are for informational purposes only.
            </p>
        </div>
    );
};

export default MatchPrediction;