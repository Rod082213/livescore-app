// src/lib/predictions.ts

import 'server-only';
import dbConnect from './mongodb';
import Prediction, { IPrediction } from '@/models/Prediction';
import { Match, Odds } from '@/data/mockData';

// This private helper function is where we apply the fix.
const generateRawPredictionData = (homeTeamName: string, awayTeamName:string) => {
  const calculateTeamStrength = (name: string): number => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 70 + (Math.abs(hash) % 31);
  };

  const homeStrength = calculateTeamStrength(homeTeamName);
  const awayStrength = calculateTeamStrength(awayTeamName);
  
  const adjustedHomeStrength = homeStrength * 1.10;
  const drawProbability = 0.28;
  const remainingProbability = 1 - drawProbability;

  const totalStrength = adjustedHomeStrength + awayStrength;
  const homeWinProbability = (adjustedHomeStrength / totalStrength) * remainingProbability;
  const awayWinProbability = (awayStrength / totalStrength) * remainingProbability;

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

  // --- THIS IS THE FIX ---
  // We calculate the raw odd, then use .toFixed(2) to round it to a string,
  // and finally convert it back to a Number.
  const odds: Odds = {
    home: Number(clamp(1 / homeWinProbability, 1.10, 9.00).toFixed(2)),
    draw: Number(clamp(1 / drawProbability, 3.00, 5.50).toFixed(2)),
    away: Number(clamp(1 / awayWinProbability, 1.10, 9.00).toFixed(2)),
  };

  const probHome = 1 / odds.home;
  const probDraw = 1 / odds.draw;
  const probAway = 1 / odds.away;
  const totalProb = probHome + probDraw + probAway;

  let homePercent = Math.round((probHome / totalProb) * 100);
  let drawPercent = Math.round((probDraw / totalProb) * 100);
  let awayPercent = Math.round((probAway / totalProb) * 100);

  const totalPercent = homePercent + drawPercent + awayPercent;
  const diff = 100 - totalPercent;
  if (diff !== 0) {
    if (homePercent >= drawPercent && homePercent >= awayPercent) homePercent += diff;
    else if (drawPercent >= homePercent && drawPercent >= awayPercent) drawPercent += diff;
    else awayPercent += diff;
  }
  
  const percentages = { home: homePercent, draw: drawPercent, away: awayPercent };
  
  const confidence = Math.max(percentages.home, percentages.draw, percentages.away);
  let predictedOutcome: 'home' | 'draw' | 'away' = 'draw';
  if (confidence === percentages.home) predictedOutcome = 'home';
  else if (confidence === percentages.away) predictedOutcome = 'away';

  return { odds, percentages, confidence, predictedOutcome };
};

export const getMatchPrediction = async (match: Partial<Match>): Promise<IPrediction | null> => {
  if (!match?.id || !match.homeTeam?.name || !match.awayTeam?.name) {
    console.error(`[Prediction Error] getMatchPrediction called with invalid match object for match ID: ${match?.id}.`);
    return null;
  }
  
  try {
    await dbConnect();
    const existingPrediction = await Prediction.findOne({ matchId: match.id }).lean();
    
    if (existingPrediction) {
      return existingPrediction;
    }

    const newPredictionData = generateRawPredictionData(match.homeTeam.name, match.awayTeam.name);

    const predictionToSave = new Prediction({
      matchId: match.id,
      homeTeamName: match.homeTeam.name,
      awayTeamName: match.awayTeam.name,
      ...newPredictionData,
    });

    await predictionToSave.save();
    return predictionToSave.toObject();

  } catch (error) {
    console.error(`[Prediction DB/Logic Error] Failed for Match ID ${match.id}:`, error);
    return null;
  }
};