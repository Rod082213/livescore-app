// src/data/mockData.ts

export interface Team {
  name: string;
  logo: string;
}

export interface Match {
  id: number;
  time: string;
  status: 'LIVE' | 'FT' | 'HT' | 'UPCOMING';
  homeTeam: Team;
  awayTeam: Team;
  score?: string;
  odds?: {
    home: number;
    draw: number;
    away: number;
  };
  // Properties for grouping
  league: string;
  leagueLogo?: string;
  countryName?: string;
  countryFlag?: string;
}

export interface LeagueGroup {
  leagueName: string;
  leagueLogo: string;
  countryName: string;
  countryFlag: string;
  matches: Match[];
}

export const topLeagues = [
  { id: 2, name: 'Champions League', logo: 'https://media.api-sports.io/football/leagues/2.png' },
  { id: 3, name: 'Europa League', logo: 'https://media.api-sports.io/football/leagues/3.png' },
  { id: 39, name: 'Premier League', logo: 'https://media.api-sports.io/football/leagues/39.png' },
  { id: 140, name: 'La Liga', logo: 'https://media.api-sports.io/football/leagues/140.png' },
  { id: 78, name: 'Bundesliga', logo: 'https://media.api-sports.io/football/leagues/78.png' },
];

// --- Mock Data for Full Standings Table (League Detail Page) ---
export interface Standing {
  rank: number;
  team: Team;
  played: number;
  win: number;
  draw: number;
  loss: number;
  diff: string;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export const mockStandings: Standing[] = [
  { rank: 1, team: { name: 'Palmeiras', logo: 'https://media.api-sports.io/football/teams/121.png' }, played: 3, win: 1, draw: 2, loss: 0, diff: '+2', points: 5, form: ['D', 'W', 'D'] },
  { rank: 2, team: { name: 'Inter Miami', logo: 'https://media.api-sports.io/football/teams/26.png' }, played: 3, win: 1, draw: 2, loss: 0, diff: '+1', points: 5, form: ['D', 'W', 'D'] },
  // ... add more mock standings if needed
];

// --- Mock Data for Team of the Week (League Detail Page) ---
export interface Player {
  name: string;
  rating: string;
  logo: string;
  position: { top?: string; left?: string; right?: string; bottom?: string; transform?: string };
}

export const mockTeamOfTheWeek: Player[] = [
  { name: 'T. Courtois', rating: '9.1', logo: 'https://media.api-sports.io/football/players/184.png', position: { bottom: '5%', left: '50%', transform: 'translateX(-50%)' } },
  { name: 'P. Barrios', rating: '9.4', logo: 'https://media.api-sports.io/football/players/1628.png', position: { bottom: '25%', left: '10%' } },
  // ... add more mock players if needed
];

// --- Mock Data for Standings WIDGET (Right Sidebar) ---
export interface MiniStanding {
  rank: number;
  team: Team;
  played: number;
  points: number;
}

export const mockWidgetStandings: MiniStanding[] = [
  { rank: 1, team: { name: 'Man City', logo: 'https://media.api-sports.io/football/teams/50.png' }, played: 5, points: 13 },
  { rank: 2, team: { name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png' }, played: 5, points: 12 },
  // ... add more mock widget standings if needed
];

// --- NEW: Mock Data for Match Summary Page ---
export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellowcard' | 'redcard' | 'substitution';
  teamLogo: string;
  player?: string;
  detail?: string;
}

export const mockMatchEvents: MatchEvent[] = [
  { minute: 78, type: 'goal', teamLogo: 'https://media.api-sports.io/football/teams/212.png', player: 'Evanilson', detail: '1 - 0' },
  { minute: 65, type: 'yellowcard', teamLogo: 'https://media.api-sports.io/football/teams/646.png', player: 'A. Dieng' },
  { minute: 46, type: 'substitution', teamLogo: 'https://media.api-sports.io/football/teams/212.png', detail: 'In: Galeno, Out: Jaime' },
  { minute: 25, type: 'yellowcard', teamLogo: 'https://media.api-sports.io/football/teams/212.png', player: 'S. Eustáquio' },
];

export interface MatchStat {
  type: string;
  home: number | string;
  away: number | string;
}

export const mockMatchStats: MatchStat[] = [
  { type: 'Ball Possession', home: '62%', away: '38%' },
  { type: 'Total Shots', home: 15, away: 8 },
  { type: 'Shots on Goal', home: 6, away: 2 },
  { type: 'Fouls', home: 11, away: 14 },
  { type: 'Corner Kicks', home: 7, away: 3 },
];

// --- Original Mock Matches (useful for fallback or testing non-football sports) ---
export const mockMatches: Match[] = [
    { id: 3, league: 'NBA', sport: 'Basketball', homeTeam: { name: 'LA Lakers', logo: '/logos/lakers.png' }, awayTeam: { name: 'GS Warriors', logo: '/logos/warriors.png' }, score: '102 - 98', status: 'LIVE', time: '4th Q' },
    { id: 5, league: 'ATP Finals', sport: 'Tennis', homeTeam: { name: 'N. Djokovic', logo: '/logos/djokovic.png' }, awayTeam: { name: 'C. Alcaraz', logo: '/logos/alcaraz.png' }, score: '6-3, 2-1', status: 'LIVE', time: '2nd Set' },
];