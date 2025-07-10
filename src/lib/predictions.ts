// src/lib/predictions.ts

/**
 * A simple hashing function to convert a team name into a numeric strength score.
 * This is deterministic: the same name will always produce the same score.
 * We use a modulo operator to keep the strength within a reasonable range (e.g., 70-100).
 * @param name The name of the team.
 * @returns A number representing the team's base strength.
 */
const calculateTeamStrength = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  // Use modulo to map the hash to a strength score between 70 and 100
  return 70 + (Math.abs(hash) % 31);
};

/**
 * Predicts betting odds for a match based on team names.
 * @param homeTeamName The name of the home team.
 * @param awayTeamName The name of the away team.
 * @returns An object containing the predicted odds for home, draw, and away.
 */
export const predictOdds = (homeTeamName: string, awayTeamName: string) => {
  // 1. Calculate base strength for each team
  const homeStrength = calculateTeamStrength(homeTeamName);
  const awayStrength = calculateTeamStrength(awayTeamName);

  // 2. Apply a home-field advantage (e.g., a 10% boost)
  const adjustedHomeStrength = homeStrength * 1.10;

  // 3. Define a base probability for a draw (e.g., ~28%)
  const drawProbability = 0.28;
  const remainingProbability = 1 - drawProbability;

  // 4. Distribute the remaining probability based on relative team strengths
  const totalStrength = adjustedHomeStrength + awayStrength;
  const homeWinProbability = (adjustedHomeStrength / totalStrength) * remainingProbability;
  const awayWinProbability = (awayStrength / totalStrength) * remainingProbability;

  // 5. Convert probabilities to betting odds (Odds = 1 / Probability)
  // We clamp the odds to make them look more realistic (e.g., between 1.10 and 9.00)
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

  const odds = {
    home: clamp(1 / homeWinProbability, 1.10, 9.00),
    draw: clamp(1 / drawProbability, 3.00, 5.50),
    away: clamp(1 / awayWinProbability, 1.10, 9.00),
  };

  return odds;
};