// src/lib/predictions.ts

const calculateTeamStrength = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 70 + (Math.abs(hash) % 31);
};

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
  const odds = {
    home: clamp(1 / homeWinProbability, 1.10, 9.00),
    draw: clamp(1 / drawProbability, 3.00, 5.50),
    away: clamp(1 / awayWinProbability, 1.10, 9.00),
  };
  return odds;
};

export function generateMockPredictions(homeTeamName: string, awayTeamName: string) {
  const predictedOdds = predictOdds(homeTeamName, awayTeamName);
  const probHome = 1 / predictedOdds.home;
  const probDraw = 1 / predictedOdds.draw;
  const probAway = 1 / predictedOdds.away;
  const totalProb = probHome + probDraw + probAway;
  let homePercent = Math.round((probHome / totalProb) * 100);
  let drawPercent = Math.round((probDraw / totalProb) * 100);
  let awayPercent = Math.round((probAway / totalProb) * 100);
  const totalPercent = homePercent + drawPercent + awayPercent;
  const diff = 100 - totalPercent;
  if (diff !== 0) {
    if (homePercent > awayPercent && homePercent > drawPercent) {
      homePercent += diff;
    } else if (awayPercent > homePercent && awayPercent > drawPercent) {
      awayPercent += diff;
    } else {
      drawPercent += diff;
    }
  }
  return {
    home: homePercent,
    draw: drawPercent,
    away: awayPercent,
  };
}