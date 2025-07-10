// src/data/challenge.ts

export interface MatchToPredict {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string; // URL to team logo
  awayLogo: string; // URL to team logo
}

export const challengeData = {
  // Set an end date 5 days and 20 hours from now
  endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000),
  title: "Weekly Challenge",
  description: "Correctly predict the scores for all three matches below to win a prize!",
  matches: [
    { id: 1, homeTeam: 'Manchester United', awayTeam: 'Liverpool', homeLogo: '/teams/manutd.png', awayLogo: '/teams/liverpool.png' },
    { id: 2, homeTeam: 'Real Madrid', awayTeam: 'Barcelona', homeLogo: '/teams/realmadrid.png', awayLogo: '/teams/barcelona.png' },
    { id: 3, homeTeam: 'Juventus', awayTeam: 'Inter Milan', homeLogo: '/teams/juventus.png', awayLogo: '/teams/inter.png' },
  ] as MatchToPredict[],
  reward: {
    couponCode: "WINNER25",
    ctaText: "Claim Your 25% Discount!",
    ctaLink: "https://www.sponsor-platform.com/claim",
  }
};