// src/lib/api.ts (Complete and Final with YouTube Highlights)

import { cache } from 'react';
import { Match, LeagueGroup, Standing, Player, ApiFixture, ApiOdd, ApiStanding, ApiPlayer, ApiLeague, MatchDetails } from "@/data/mockData";
import { format } from 'date-fns';
import { Highlight, NewsArticleSummary, NewsArticleDetail, Lineup, MatchLineupData } from './types';

// ==================================================================
// === FOOTBALL API CONFIGURATION (No Changes)                    ===
// ==================================================================
const FOOTBALL_API_URL = 'https://v3.football.api-sports.io';
const FOOTBALL_API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;

const footballServerOptions: RequestInit = {
  method: 'GET',
  headers: { 'x-apisports-key': FOOTBALL_API_KEY as string },
  next: { revalidate: 3600 } 
};

type Team = {
  id: number;
  name: string;
  logo: string;
};

// --- MAPPING FUNCTIONS (No Changes) ---
function mapStatus(status: any): { status: Match['status'], time?: string } {
    if (['FT', 'AET', 'PEN'].includes(status.short)) return { status: 'FT', time: 'FT' };
    if (status.short === 'HT') return { status: 'HT', time: 'HT' };
    if (status.short === 'NS') return { status: 'UPCOMING', time: 'Upcoming' };
    if (status.elapsed) return { status: 'LIVE', time: `${status.elapsed}'` };
    return { status: 'UPCOMING', time: status.short };
}
export function mapApiFixtureToMatch(apiFixture: any): Match | null {
    if (!apiFixture || !apiFixture.fixture || !apiFixture.league) return null;
    let { status, time } = mapStatus(apiFixture.fixture.status);
    if (status === 'UPCOMING' && apiFixture.fixture.date) {
        time = format(new Date(apiFixture.fixture.date), 'HH:mm');
    }
    const match: Match = {
        id: apiFixture.fixture.id, time: time || '', status,
        homeTeam: { name: apiFixture.teams.home.name, logo: apiFixture.teams.home.logo },
        awayTeam: { name: apiFixture.teams.away.name, logo: apiFixture.teams.away.logo },
        score: `${apiFixture.goals.home ?? '-'} - ${apiFixture.goals.away ?? '-'}`,
        league: { id: apiFixture.league.id, name: apiFixture.league.name, logo: apiFixture.league.logo, country: apiFixture.league.country, flag: apiFixture.league.flag }
    };
    return match;
}
export function groupMatchesByLeague(matches: Match[]): LeagueGroup[] {
  if (!matches || matches.length === 0) return [];
  const grouped = matches.reduce((acc, match) => {
    const leagueName = match.league.name;
    if (!acc[leagueName]) {
      acc[leagueName] = { leagueName: leagueName, leagueLogo: match.league.logo || '', countryName: match.league.country || 'World', countryFlag: match.league.flag || '', matches: [] };
    }
    acc[leagueName].matches.push(match);
    return acc;
  }, {} as Record<string, LeagueGroup>);
  return Object.values(grouped);
}
function mapApiStandingToStanding(apiStanding: ApiStanding): Standing {
    return {
        rank: apiStanding.rank, team: { id: apiStanding.team.id, name: apiStanding.team.name, logo: apiStanding.team.logo },
        played: apiStanding.all.played, win: apiStanding.all.win, draw: apiStanding.all.draw, loss: apiStanding.all.loss,
        diff: apiStanding.goalsDiff.toString(), points: apiStanding.points,
        form: apiStanding.form?.split('').slice(0, 5) as ('W' | 'D' | 'L')[] || []
    };
}

// --- FOOTBALL API FETCHING FUNCTIONS (No Changes) ---
export const fetchDashboardData = cache(async (): Promise<LeagueGroup[]> => {
    if (!FOOTBALL_API_KEY) return [];
    try {
        const todayStr = new Date().toISOString().split('T')[0];
        const [liveResponse, todayResponse] = await Promise.all([
            fetch(`${FOOTBALL_API_URL}/fixtures?live=all`, footballServerOptions),
            fetch(`${FOOTBALL_API_URL}/fixtures?date=${todayStr}`, footballServerOptions)
        ]);
        if (!liveResponse.ok || !todayResponse.ok) return [];
        const liveData = await liveResponse.json();
        const todayData = await todayResponse.json();
        const allFixtures: ApiFixture[] = Array.from(new Map([...(liveData.response || []), ...(todayData.response || [])].map(f => [f.fixture.id, f])).values());
        const matches = allFixtures.map(mapApiFixtureToMatch).filter(Boolean) as Match[];
        matches.sort((a, b) => { const order = { 'LIVE': 1, 'HT': 2, 'UPCOMING': 3, 'FT': 4 }; return order[a.status] - order[b.status]; });
        return groupMatchesByLeague(matches);
    } catch (error) { return []; }
});
export const fetchTopLeagues = cache(async (): Promise<ApiLeague[]> => {
    if (!FOOTBALL_API_KEY) return [];
    try {
        const leagueIds = [39, 140, 135, 78, 61, 2, 3, 88, 94, 253];
        const responses = await Promise.all(leagueIds.map(id => fetch(`${FOOTBALL_API_URL}/leagues?id=${id}`, footballServerOptions)));
        const results = await Promise.all(responses.map(res => res.json()));
        return results.map(result => result.response[0]?.league).filter(Boolean);
    } catch (error) { return []; }
});
export const fetchStandings = cache(async (leagueId: string, season: string = "2024"): Promise<Standing[]> => {
    if (!FOOTBALL_API_KEY) return [];
    try {
        const response = await fetch(`${FOOTBALL_API_URL}/standings?league=${leagueId}&season=${season}`, footballServerOptions);
        if (!response.ok) return [];
        const data = await response.json();
        const standingsData = data.response[0]?.league?.standings[0];
        return standingsData ? standingsData.map(mapApiStandingToStanding) : [];
    } catch (error) { return []; }
});
export const fetchAllTeamsInLeague = cache(async (leagueId: string, season: string = "2024"): Promise<Team[]> => {
  if (!FOOTBALL_API_KEY || !leagueId) return [];
  try {
    const url = `${FOOTBALL_API_URL}/teams?league=${leagueId}&season=${season}`;
    const response = await fetch(url, footballServerOptions);
    if (!response.ok) {
      console.error(`API Error: Failed to fetch teams for league ${leagueId}`);
      return [];
    }
    const data = await response.json();
    const teams: Team[] = (data.response || []).map((item: any) => ({
      id: item.team.id,
      name: item.team.name,
      logo: item.team.logo,
    }));
    return teams;
  } catch (error) {
    console.error("Error in fetchAllTeamsInLeague:", error);
    return [];
  }
});
export const fetchAllTeamsFromAllLeagues = cache(async (): Promise<{ leagueName: string, teams: { id: number, name: string, logo: string }[] }[]> => {
    if (!FOOTBALL_API_KEY) return [];
    try {
        const leagueIds = [39, 140, 135, 78, 61, 2, 3, 88, 94, 253];
        const leagueDetailsPromises = leagueIds.map(id => fetch(`${FOOTBALL_API_URL}/leagues?id=${id}`, footballServerOptions).then(res => res.ok ? res.json() : null));
        const leagueDetailsResults = await Promise.all(leagueDetailsPromises);
        const leaguesMap = new Map(leagueDetailsResults.filter(Boolean).map(result => [result.response[0].league.id, result.response[0].league.name]));
        const teamsPromises = leagueIds.map(id => fetch(`${FOOTBALL_API_URL}/teams?league=${id}&season=2024`, footballServerOptions).then(res => res.ok ? res.json() : null));
        const teamsResults = await Promise.all(teamsPromises);
        return teamsResults.filter(Boolean).map(result => {
            const leagueId = result.parameters.league;
            const leagueName = leaguesMap.get(parseInt(leagueId)) || 'Unknown League';
            const teams = result.response.map((item: any) => ({ id: item.team.id, name: item.team.name, logo: item.team.logo }));
            return { leagueName, teams };
        });
    } catch (error) { return []; }
});
export const fetchTeamOfTheWeek = cache(async (leagueId: string = "39", season: string = "2024"): Promise<Player[]> => {
    if (!FOOTBALL_API_KEY) return [];
    try {
        const url = `${FOOTBALL_API_URL}/players/topscorers?season=${season}&league=${leagueId}`;
        const response = await fetch(url, footballServerOptions);
        if (!response.ok) return [];
        const data = await response.json();
        const topPlayers: ApiPlayer[] = data.response?.slice(0, 5) || [];
        return topPlayers.map(p => ({ name: p.player.name, rating: parseFloat(p.statistics[0].games.rating || '0').toFixed(1), logo: p.statistics[0].team.logo }));
    } catch (error) { return []; }
});
export const fetchAllTopPlayers = cache(async (leagueId: string = "39", season: string = "2024"): Promise<Player[]> => {
    if (!FOOTBALL_API_KEY) return [];
    try {
        const url = `${FOOTBALL_API_URL}/players/topscorers?season=${season}&league=${leagueId}`;
        const response = await fetch(url, footballServerOptions);
        if (!response.ok) return [];
        const data = await response.json();
        const topPlayers: ApiPlayer[] = data.response || [];
        return topPlayers.map(p => ({ name: p.player.name, rating: parseFloat(p.statistics[0].games.rating || '0').toFixed(1), logo: p.statistics[0].team.logo, id: p.player.id, teamName: p.statistics[0].team.name }));
    } catch (error) {
        console.error("Error in fetchAllTopPlayers:", error);
        return [];
    }
});
export const fetchTeamInfo = cache(async (teamId: string) => {
    if (!FOOTBALL_API_KEY) return null;
    try {
        const res = await fetch(`${FOOTBALL_API_URL}/teams?id=${teamId}`, footballServerOptions);
        if (!res.ok) return null;
        const data = await res.json();
        return data.response[0] || null;
    } catch (error) { return null; }
});
export const fetchTeamFixtures = cache(async (teamId: string, season: string = "2024") => {
    if (!FOOTBALL_API_KEY) return [];
    try {
        const res = await fetch(`${FOOTBALL_API_URL}/fixtures?team=${teamId}&season=${season}`, footballServerOptions);
        if (!res.ok) return [];
        const data = await res.json();
        return (data.response || []).map(mapApiFixtureToMatch).filter(Boolean) as Match[];
    } catch (error) { return []; }
});
export const fetchTeamSquad = cache(async (teamId: string) => {
    if (!FOOTBALL_API_KEY) return [];
    try {
        const res = await fetch(`${FOOTBALL_API_URL}/players/squads?team=${teamId}`, footballServerOptions);
        if (!res.ok) return [];
        const data = await res.json();
        return data.response[0]?.players || [];
    } catch (error) { return []; }
});
export const fetchMatchDetailsById = cache(async (id: string): Promise<MatchDetails | null> => {
    if (!FOOTBALL_API_KEY) return null;
    try {
        const fixtureRes = await fetch(`${FOOTBALL_API_URL}/fixtures?id=${id}`, footballServerOptions);
        if (!fixtureRes.ok) return null;
        const fixtureData = await fixtureRes.json();
        const apiFixture: ApiFixture = fixtureData.response?.[0];
        if (!apiFixture) return null;
        const match: MatchDetails = mapApiFixtureToMatch(apiFixture) as MatchDetails;
        // The fixture object is needed by the YouTube function, so we attach it here.
        match.fixture = apiFixture.fixture;
        const [eventsRes, statsRes] = await Promise.all([
            fetch(`${FOOTBALL_API_URL}/fixtures/events?fixture=${id}`, footballServerOptions),
            fetch(`${FOOTBALL_API_URL}/fixtures/statistics?fixture=${id}`, footballServerOptions),
        ]);
        if (eventsRes.ok) match.events = (await eventsRes.json()).response;
        if (statsRes.ok) {
            const statsData = await statsRes.json();
            if (statsData.response && statsData.response.length > 0) {
                const homeStatsRaw = statsData.response.find((s: any) => s.team.id === apiFixture.teams.home.id)?.statistics || [];
                const awayStatsRaw = statsData.response.find((s: any) => s.team.id === apiFixture.teams.away.id)?.statistics || [];
                const processedStats: Record<string, { home: any; away: any; }> = {};
                const allStatTypes = new Set([...homeStatsRaw.map((s: any) => s.type), ...awayStatsRaw.map((s: any) => s.type)]);
                allStatTypes.forEach(type => {
                    const homeValue = homeStatsRaw.find((s: any) => s.type === type)?.value ?? 0;
                    const awayValue = awayStatsRaw.find((s: any) => s.type === type)?.value ?? 0;
                    processedStats[type] = { home: homeValue, away: awayValue };
                });
                match.statistics = processedStats;
            }
        }
        return match;
    } catch (error) { return null; }
});


// ==================================================================
// === HIGHLIGHTS API SECTION (REPLACED WITH YOUTUBE API)         ===
// ==================================================================
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

export const getMatchHighlights = cache(async (matchDetails: MatchDetails): Promise<Highlight[]> => {
  // Only search YouTube for finished matches and if the API key is present.
  if (matchDetails.status !== 'FT' || !YOUTUBE_API_KEY) {
    return []; 
  }

  // Build a high-quality search query to get relevant results.
  const homeTeam = matchDetails.homeTeam.name;
  const awayTeam = matchDetails.awayTeam.name;
  const year = new Date(matchDetails.fixture.date).getFullYear(); 
  const searchQuery = `${homeTeam} vs ${awayTeam} ${year} highlights`;

  const params = new URLSearchParams({
    part: 'snippet',
    q: searchQuery,
    key: YOUTUBE_API_KEY,
    type: 'video',
    maxResults: '5',
    videoEmbeddable: 'true',
  });

  const url = `${YOUTUBE_API_URL}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 * 24 } // Cache results for 24 hours
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[YouTube API] Error:', errorData.error.message);
      return [];
    }

    const result = await response.json();
    
    // Map the YouTube API response to our app's internal `Highlight` type.
    if (result.items && result.items.length > 0) {
      return result.items.map((item: any): Highlight => ({
        id: item.id.videoId,
        title: item.snippet.title,
        embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`
      }));
    }

    return []; // Return an empty array if YouTube's search finds nothing.

  } catch (error) {
    console.error('[YouTube API] A critical fetch error occurred:', error);
    return [];
  }
});


// ==================================================================
// === NEWS API FUNCTIONS (No Changes)                            ===
// ==================================================================
const NEWS_API_BASE_URL = "https://news.todaylivescores.com";

export const fetchNewsList = cache(async (): Promise<NewsArticleSummary[]> => {
  try {
    const res = await fetch(`${NEWS_API_BASE_URL}/api/news`, { next: { revalidate: 600 } });
    if (!res.ok) {
      console.error(`News API returned an error: ${res.statusText}`);
      return [];
    }
    const apiResponse = await res.json();
    return apiResponse.data || [];
  } catch (error) {
    console.error('Error fetching news list:', error);
    return [];
  }
});

export const fetchNewsBySlug = cache(async (slug: string): Promise<NewsArticleDetail | null> => {
  if (!slug) return null;
  try {
    const res = await fetch(`${NEWS_API_BASE_URL}/api/news/slug/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      if (res.status !== 404) {
        console.error(`News API returned an error for slug '${slug}': ${res.statusText}`);
      }
      return null;
    }
    const apiResponse = await res.json();
    return apiResponse;
  } catch (error) {
    console.error(`Error fetching news article by slug '${slug}':`, error);
    return null;
  }
});

export const fetchMatchLineups = cache(async (fixtureId: string): Promise<MatchLineupData | null> => {
  if (!FOOTBALL_API_KEY) return null;

  try {
    const response = await fetch(`${FOOTBALL_API_URL}/fixtures/lineups?fixture=${fixtureId}`, footballServerOptions);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (!data.response || data.response.length < 2) {
      return null; // We need lineups for both teams
    }

    // The API returns an array, usually with the home team first.
    // We'll process them into a more structured home/away object.
    const homeLineupData = data.response[0];
    const awayLineupData = data.response[1];

    const processLineup = (lineupData: any): Lineup => {
      return {
        team: {
          id: lineupData.team.id,
          name: lineupData.team.name,
          logo: lineupData.team.logo,
        },
        formation: lineupData.formation,
        startXI: lineupData.startXI.map((p: any) => p.player),
        substitutes: lineupData.substitutes.map((p: any) => p.player),
      };
    };

    const lineups: MatchLineupData = {
      home: processLineup(homeLineupData),
      away: processLineup(awayLineupData),
    };

    return lineups;
  } catch (error) {
    console.error(`Error fetching lineups for fixture ${fixtureId}:`, error);
    return null;
  }
});


export interface DailyPageData {
  liveWithStreams: { match: Match; stream: Highlight | null }[]; // Changed from liveMatches
  upcomingMatches: Match[];
  finishedWithHighlights: { match: Match; highlight: Highlight }[];
}
export const fetchDailyMatchesAndHighlights = cache(async (date: string): Promise<DailyPageData> => {
  // 1. Fetch all fixtures for the date (no change here)
  const fixturesResponse = await fetch(`${FOOTBALL_API_URL}/fixtures?date=${date}`, footballServerOptions);
  if (!fixturesResponse.ok) {
    return { liveWithStreams: [], upcomingMatches: [], finishedWithHighlights: [] };
  }
  const fixturesData = await fixturesResponse.json();
  const allFixtures: ApiFixture[] = fixturesData.response || [];

  // 2. Categorize and process in parallel
  const liveMatchPromises = [];
  const upcomingMatches: Match[] = [];
  const finishedHighlightPromises = [];

  for (const fixture of allFixtures) {
    const match = mapApiFixtureToMatch(fixture);
    if (!match) continue;

    if (match.status === 'LIVE' || match.status === 'HT') {
      // For live matches, create a promise to search for a stream
      liveMatchPromises.push(
        searchForLiveStream(match).then(stream => ({ match, stream }))
      );
    } else if (match.status === 'UPCOMING') {
      upcomingMatches.push(match);
    } else if (match.status === 'FT') {
      // For finished matches, create a promise to search for highlights (your existing logic)
      finishedHighlightPromises.push(
         getMatchHighlights({ ...match, fixture: fixture.fixture }).then(highlights => {
             // We now only care about the first highlight found
             if (highlights && highlights.length > 0) {
                 return { match, highlight: highlights[0] };
             }
             return null;
         })
      );
    }
  }

  // 3. Wait for all API calls to YouTube to complete
  const liveWithStreams = await Promise.all(liveMatchPromises);
  const finishedWithHighlights = (await Promise.all(finishedHighlightPromises)).filter(Boolean);

  return {
    liveWithStreams,
    upcomingMatches,
    finishedWithHighlights
  };
});

export const fetchLiveMatches = cache(async (): Promise<Match[]> => {
  if (!FOOTBALL_API_KEY) return [];
  try {
    const response = await fetch(`${FOOTBALL_API_URL}/fixtures?live=all`, footballServerOptions);
    if (!response.ok) {
      console.error("Failed to fetch live matches from Football API");
      return [];
    }
    
    const data = await response.json();
    const liveFixtures: ApiFixture[] = data.response || [];
    
    // Use the existing mapApiFixtureToMatch to ensure consistent data structure
    return liveFixtures.map(mapApiFixtureToMatch).filter((m): m is Match => m !== null);
  } catch (error) {
    console.error("Error in fetchLiveMatches:", error);
    return [];
  }
});


export const searchForLiveStream = cache(async (match: Match): Promise<Highlight | null> => {
  if (!YOUTUBE_API_KEY) return null;

  // Build a search query specifically for live streams
  const searchQuery = `${match.homeTeam.name} vs ${match.awayTeam.name} live stream`;

  const params = new URLSearchParams({
    part: 'snippet',
    q: searchQuery,
    key: YOUTUBE_API_KEY,
    type: 'video',
    eventType: 'live', // <-- This is the crucial parameter for live streams
    maxResults: '1',
  });

  const url = `${YOUTUBE_API_URL}?${params.toString()}`;

  try {
    // We don't cache live stream search results for long
    const response = await fetch(url, { next: { revalidate: 60 * 5 } }); // Cache for 5 mins
    if (!response.ok) return null;

    const result = await response.json();
    if (result.items && result.items.length > 0) {
      const item = result.items[0];
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
      };
    }
    return null;
  } catch (error) {
    console.error(`[YouTube Live Search] Error for match ${match.id}:`, error);
    return null;
  }
});


export const getLiveStreamForMatch = cache(async (matchId: string): Promise<Highlight | null> => {
  // 1. Fetch the match details first.
  // Because `fetchMatchDetailsById` is also cached, this call is automatically
  // de-duplicated by Next.js and will not cause a second network request on the page.
  const matchDetails = await fetchMatchDetailsById(matchId);

  // 2. If we can't get the match details, we can't search for a stream.
  if (!matchDetails) {
    console.error(`[getLiveStreamForMatch] Could not find match details for ID: ${matchId}`);
    return null;
  }
  
  // 3. Use your existing `searchForLiveStream` function with the fetched details.
  // This reuses your code and keeps the YouTube search logic in one place.
  return searchForLiveStream(matchDetails);
});