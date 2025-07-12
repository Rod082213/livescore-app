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
  league: {
    id: number;
    name: string;
    logo: string;
    country: string;
    flag: string;
  };
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

export interface Standing {
  rank: number;
  team: { id: number, name: string, logo: string }; // Added ID to team
  played: number;
  win: number;
  draw: number;
  loss: number;
  diff: string;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface Player {
  name: string;
  rating: string;
  logo: string;
  position?: { top?: string; left?: string; right?: string; bottom?: string; transform?: string };
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellowcard' | 'redcard' | 'substitution';
  teamLogo: string;
  player?: string;
  detail?: string;
}

export interface MatchStat {
  type: string;
  home: number | string;
  away: number | string;
}

// Interfaces for API responses (internal use)
export interface ApiFixture {
  fixture: any;
  league: any;
  teams: any;
  goals: any;
  oddsData?: any; // Add this to hold odds
}
export interface ApiOdd {
    fixture: { id: number };
    bookmakers: any[];
}
export interface ApiStanding {
    rank: number;
    team: { id: number; name: string; logo: string };
    all: { played: number; win: number; draw: number; loss: number; };
    goalsDiff: number;
    points: number;
    form: string;
}
export interface ApiPlayer {
    player: { id: number; name: string; photo: string; };
    statistics: { games: { rating: string }; team: { logo: string } }[];
}
export interface ApiLeague {
    id: number;
    name: string;
    logo: string;
}
export interface MatchDetails extends Match {
    leagueName?: string;
    venue?: string;
    date?: string;
    events?: any[];
    h2h?: any[];
    form?: { home: string; away: string; };
    predictions?: { home: number; draw: number; away: number; };
    statistics?: Record<string, { home: any; away: any; }>;
}
export interface Article {
    id: string;
    category: string;
    title: string;
    imageUrl: string;
    date: string;
}