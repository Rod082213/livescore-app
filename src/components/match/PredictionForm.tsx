// src/components/match/PredictionForm.tsx (or MatchPrediction.tsx)

"use client";

import Image from 'next/image';
import { TrendingUp, CheckCircle, XCircle, Hash, AlertTriangle } from 'lucide-react';
import UserPrediction from './UserPrediction';
import { IPrediction } from '@/models/Prediction'; // Import the type for our prediction prop

// --- THIS IS THE MOST IMPORTANT CHANGE: THE BAD IMPORT IS GONE ---
// import { generatePredictionData } from '@/lib/predictions'; // <-- THIS LINE HAS BEEN DELETED.

// This helper component is fine, no changes needed.
const FormPill = ({ result }: { result: string }) => { /* ... (code unchanged) ... */ };

// --- THE COMPONENT PROPS ARE UPDATED ---
// It no longer needs 'form'. It now accepts the full, sanitized prediction object from the server.
interface MatchPredictionProps {
  teams: { home: { name: string; logo: string }; away: { name: string; logo: string } };
  status: string;
  score: string;
  prediction: IPrediction | null; // The page will pass the fetched prediction data here. It can be null if fetching fails.
}

const MatchPrediction = ({ teams, status, score, prediction }: MatchPredictionProps) => {
    // --- DEFENSIVE CHECKS ---
    // This check for team data is still good.
    if (!teams?.home?.name || !teams?.away?.name) {
      return (
        <div className="bg-[#2b3341] rounded-lg p-6 text-white text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-yellow-500 mb-3" />
            <h3 className="text-lg font-bold">Prediction Unavailable</h3>
            <p className="text-sm text-gray-400">Match data is incomplete for this fixture.</p>
        </div>
      );
    }
    
    // --- THIS IS THE NEW DEFENSIVE CHECK ---
    // If the server failed to provide a prediction, show a graceful fallback.
    // This replaces the call to generatePredictionData.
    if (!prediction) {
      return (
        <div className="bg-[#2b3341] rounded-lg p-6 text-white text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-yellow-500 mb-3" />
            <h3 className="text-lg font-bold">Prediction Unavailable</h3>
            <p className="text-sm text-gray-400">Could not calculate prediction for this fixture.</p>
        </div>
      );
    }
    // --- END OF NEW LOGIC ---

    // We now destructure the data directly from the 'prediction' prop.
    const { odds, confidence, predictedOutcome } = prediction;
    
    // The rest of your component's display logic is almost identical.
    // It just uses the variables we got from the prop.
    let predictedOutcomeText = '';
    let predictedWinnerLogo: string | null = null;

    if (predictedOutcome === 'home') {
        predictedOutcomeText = 'Home Win';
        predictedWinnerLogo = teams.home.logo;
    } else if (predictedOutcome === 'away') {
        predictedOutcomeText = 'Away Win';
        predictedWinnerLogo = teams.away.logo;
    } else {
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
            
            {/* The UserPrediction component needs the 'odds' which we now get from the prop */}
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