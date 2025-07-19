// src/lib/predictions.ts

// This function creates a consistent "strength" value based on a team's name
const calculateTeamStrength = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return 70 + (Math.abs(hash) % 31);
};

// --- THIS FUNCTION IS NOW EXPORTED AGAIN ---
// It returns raw numbers, which is what MatchRow needs for its calculations.
export const predictOdds = (homeTeamName: string, awayTeamName: string) => {
  const homeStrength = calculateTeamStrength(homeTeamName);
  const awayStrength = calculateTeamStrength(awayTeamName);
  
  const adjustedHomeStrength = homeStrength * 1.10;
  const drawProbability = 0.28;
  const remainingProbability = 1 - drawProbability;

  const totalStrength = adjustedHomeStrength + awayStrength;
  const homeWinProbability = (adjustedHomeStrength / totalStrength) * remainingProbability;
  const awayWinProbability = (awayStrength / totalStrength) * remainingProbability;

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

  return {
    home: clamp(1 / homeWinProbability, 1.10, 9.00),
    draw: clamp(1 / drawProbability, 3.00, 5.50),
    away: clamp(1 / awayWinProbability, 1.10, 9.00),
  };
};

// This function converts odds to percentages (internal helper)
const convertOddsToPercentages = (odds: { home: number; draw: number; away: number; }) => {
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
  
  return { home: homePercent, draw: drawPercent, away: awayPercent };
};

// This function is used by the main PredictionForm/MatchPrediction component.
export function generatePredictionData(homeTeamName: string, awayTeamName: string) {
  const odds = predictOdds(homeTeamName, awayTeamName);
  const percentages = convertOddsToPercentages(odds);

  return {
    odds: {
      home: odds.home.toFixed(2),
      draw: odds.draw.toFixed(2),
      away: odds.away.toFixed(2),
    },
    percentages
  };
}