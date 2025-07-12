// src/lib/api.ts

import { Match, LeagueGroup, Standing, Player, ApiFixture, ApiOdd, ApiStanding, ApiPlayer, ApiLeague, MatchDetails, Article as IArticle } from "@/data/mockData";
import { isToday, format, isBefore, startOfDay } from 'date-fns';


const API_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;
const serverOptions = { method: 'GET', headers: { 'x-apisports-key': API_KEY as string }, next: { revalidate: 60 } };
const clientOptions = { method: 'GET', headers: { 'x-apisports-key': API_KEY as string } };

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
        id: apiFixture.fixture.id,
        time: time || '',
        status,
        homeTeam: { name: apiFixture.teams.home.name, logo: apiFixture.teams.home.logo },
        awayTeam: { name: apiFixture.teams.away.name, logo: apiFixture.teams.away.logo },
        score: `${apiFixture.goals.home ?? '-'} - ${apiFixture.goals.away ?? '-'}`,
        league: {
            id: apiFixture.league.id, name: apiFixture.league.name, logo: apiFixture.league.logo,
            country: apiFixture.league.country, flag: apiFixture.league.flag
        }
    };
    if (apiFixture.oddsData) {
        const bookmaker = apiFixture.oddsData.bookmakers.find((b: any) => b.id === 8) || apiFixture.oddsData.bookmakers[0];
        const matchWinnerBet = bookmaker?.bets.find((bet: any) => bet.id === 1);
        if (matchWinnerBet) {
            const homeOdd = matchWinnerBet.values.find((v: any) => v.value === 'Home')?.odd;
            const drawOdd = matchWinnerBet.values.find((v: any) => v.value === 'Draw')?.odd;
            const awayOdd = matchWinnerBet.values.find((v: any) => v.value === 'Away')?.odd;
            if (homeOdd && drawOdd && awayOdd) {
                match.odds = { home: parseFloat(homeOdd), draw: parseFloat(drawOdd), away: parseFloat(awayOdd) };
            }
        }
    }
    return match;
}

export function groupMatchesByLeague(matches: Match[]): LeagueGroup[] {
  if (!matches || matches.length === 0) return [];
  const grouped = matches.reduce((acc, match) => {
    const leagueName = match.league.name;
    if (!acc[leagueName]) {
      acc[leagueName] = { 
        leagueName: leagueName, leagueLogo: match.league.logo || '', 
        countryName: match.league.country || 'World', countryFlag: match.league.flag || '', 
        matches: [], 
      };
    }
    acc[leagueName].matches.push(match);
    return acc;
  }, {} as Record<string, LeagueGroup>);
  return Object.values(grouped);
}

function mapApiStandingToStanding(apiStanding: ApiStanding): Standing {
    return {
        rank: apiStanding.rank, team: { id: apiStanding.team.id, name: apiStanding.team.name, logo: apiStanding.team.logo },
        played: apiStanding.all.played, win: apiStanding.all.win,
        draw: apiStanding.all.draw, loss: apiStanding.all.loss,
        diff: apiStanding.goalsDiff.toString(), points: apiStanding.points,
        form: apiStanding.form.split('').slice(0, 5) as ('W' | 'D' | 'L')[]
    };
}

export async function fetchDashboardData(): Promise<LeagueGroup[]> {
    if (!API_KEY) { return []; }
    const todayStr = new Date().toISOString().split('T')[0];
    const [liveResponse, todayResponse] = await Promise.all([ fetch(`${API_URL}/fixtures?live=all`, serverOptions), fetch(`${API_URL}/fixtures?date=${todayStr}`, serverOptions) ]);
    if (!liveResponse.ok || !todayResponse.ok) { return []; }
    const liveData = await liveResponse.json();
    const todayData = await todayResponse.json();
    const allFixtures: ApiFixture[] = Array.from(new Map([...(liveData.response || []), ...(todayData.response || [])].map(f => [f.fixture.id, f])).values());
    if (allFixtures.length === 0) { return []; }
    const fixtureIds = allFixtures.map(f => f.fixture.id);
    let oddsMap: { [key: number]: ApiOdd } = {};
    if (fixtureIds.length > 0) {
        const oddsResults = await Promise.all(fixtureIds.map(id => fetch(`${API_URL}/odds?fixture=${id}`, serverOptions).then(res => res.ok ? res.json() : null)));
        oddsResults.forEach(result => { if (result && result.response && result.response.length > 0) { oddsMap[result.response[0].fixture.id] = result.response[0]; }});
    }
    allFixtures.forEach(fixture => { fixture.oddsData = oddsMap[fixture.fixture.id]; });
    const matches = allFixtures.map(mapApiFixtureToMatch).filter(Boolean) as Match[];
    matches.sort((a, b) => { const order = { 'LIVE': 1, 'HT': 2, 'UPCOMING': 3, 'FT': 4 }; return order[a.status] - order[b.status]; });
    return groupMatchesByLeague(matches);
}

export async function fetchMatchesForClient(date: Date): Promise<LeagueGroup[]> {
    if (!API_KEY) { return []; }
    let fixtures: ApiFixture[] = [];
    try {
        if (isToday(date)) {
            const [liveResponse, todayResponse] = await Promise.all([ fetch(`${API_URL}/fixtures?live=all`, clientOptions), fetch(`${API_URL}/fixtures?date=${format(date, 'yyyy-MM-dd')}`, clientOptions) ]);
            if (!liveResponse.ok || !todayResponse.ok) return [];
            const liveData = await liveResponse.json();
            const todayData = await todayResponse.json();
            fixtures = Array.from(new Map([...(liveData.response || []), ...(todayData.response || [])].map(f => [f.fixture.id, f])).values());
        } else {
            const response = await fetch(`${API_URL}/fixtures?date=${format(date, 'yyyy-MM-dd')}`, clientOptions);
            if (!response.ok) return [];
            fixtures = (await response.json()).response || [];
        }
        if (fixtures.length === 0) return [];
        const fixtureIds = fixtures.map(f => f.fixture.id);
        let oddsMap: { [key: number]: ApiOdd } = {};
        if (fixtureIds.length > 0) {
            const oddsResults = await Promise.all(fixtureIds.map(id => fetch(`${API_URL}/odds?fixture=${id}`, clientOptions).then(res => res.ok ? res.json() : null)));
            oddsResults.forEach(result => { if (result && result.response.length > 0) { oddsMap[result.response[0].fixture.id] = result.response[0]; }});
        }
        fixtures.forEach(fixture => { fixture.oddsData = oddsMap[fixture.fixture.id]; });
        const matches = fixtures.map(mapApiFixtureToMatch).filter(Boolean) as Match[];
        matches.sort((a, b) => { const order = { 'LIVE': 1, 'HT': 2, 'UPCOMING': 3, 'FT': 4 }; return order[a.status] - order[b.status]; });
        return groupMatchesByLeague(matches);
    } catch(e) { return [] }
}

export async function fetchTopLeagues(): Promise<ApiLeague[]> {
    if (!API_KEY) { return []; }
    const leagueIds = [39, 140, 135, 78, 61, 2, 3, 88, 94, 253];
    try {
        const responses = await Promise.all(leagueIds.map(id => fetch(`${API_URL}/leagues?id=${id}`, serverOptions)));
        for (const response of responses) { if (!response.ok) return []; }
        const results = await Promise.all(responses.map(res => res.json()));
        return results.map(result => result.response[0]?.league).filter(Boolean);
    } catch (error) { return []; }
}

export async function fetchStandings(leagueId: string, season: string = "2023"): Promise<Standing[]> {
    if (!API_KEY) { return []; }
    try {
        const response = await fetch(`${API_URL}/standings?league=${leagueId}&season=${season}`, serverOptions);
        if (!response.ok) return [];
        const data = await response.json();
        const standingsData = data.response[0]?.league?.standings[0];
        return standingsData ? standingsData.map(mapApiStandingToStanding) : [];
    } catch (error) { return []; }
}

export async function fetchAllTeamsFromAllLeagues(): Promise<{ leagueName: string, teams: { id: number, name: string, logo: string }[] }[]> {
    if (!API_KEY) { return []; }
    try {
        const leagueIds = [39, 140, 135, 78, 61, 2, 3, 88, 94, 253];
        const allLeaguesPromise = leagueIds.map(id => fetch(`${API_URL}/standings?league=${id}&season=2023`, serverOptions).then(res => res.ok ? res.json() : null));
        const results = await Promise.all(allLeaguesPromise);
        return results.filter(result => result && result.response && result.response.length > 0).map(result => {
            const leagueInfo = result.response[0].league;
            const teams = leagueInfo.standings[0].map((s: ApiStanding) => ({ id: s.team.id, name: s.team.name, logo: s.team.logo, }));
            return { leagueName: leagueInfo.name, teams: teams };
        });
    } catch (error) { return []; }
}

export async function fetchTeamOfTheWeek(leagueId: string = "39", season: string = "2023"): Promise<Player[]> {
    if (!API_KEY) return [];
    try {
        const topScorersUrl = `${API_URL}/players/topscorers?season=${season}&league=${leagueId}`;
        const topScorersResponse = await fetch(topScorersUrl, serverOptions);
        if (!topScorersResponse.ok) return [];
        const topScorersData = await topScorersResponse.json();
        const topPlayers: ApiPlayer[] = topScorersData.response?.slice(0, 5) || [];
        if (topPlayers.length === 0) return [];
        const playerDetailPromises = topPlayers.map(playerData => fetch(`${API_URL}/players?id=${playerData.player.id}&season=${season}`, serverOptions).then(res => res.ok ? res.json() : null));
        const playerStatsResults = await Promise.all(playerDetailPromises);
        return topPlayers.map((playerData, index) => {
            const detailedStatsData = playerStatsResults[index];
            const teamLogo = detailedStatsData?.response[0]?.statistics[0]?.team?.logo || '';
            const rating = parseFloat(playerData.statistics[0].games.rating || '0').toFixed(1);
            return { name: playerData.player.name, rating, logo: teamLogo };
        });
    } catch (error) { return []; }
}

export async function fetchAllTopPlayers(leagueId: string = "39", season: string = "2023"): Promise<Player[]> {
    if (!API_KEY) return [];
    try {
        const topScorersUrl = `${API_URL}/players/topscorers?season=${season}&league=${leagueId}`;
        const topScorersResponse = await fetch(topScorersUrl, serverOptions);
        if (!topScorersResponse.ok) return [];
        const topScorersData = await topScorersResponse.json();
        const topPlayers: ApiPlayer[] = topScorersData.response || [];
        if (topPlayers.length === 0) return [];
        const playerDetailPromises = topPlayers.map(playerData => fetch(`${API_URL}/players?id=${playerData.player.id}&season=${season}`, serverOptions).then(res => res.ok ? res.json() : null));
        const playerStatsResults = await Promise.all(playerDetailPromises);
        return topPlayers.map((playerData, index) => {
            const detailedStatsData = playerStatsResults[index];
            const teamLogo = detailedStatsData?.response[0]?.statistics[0]?.team?.logo || '';
            const rating = parseFloat(playerData.statistics[0].games.rating || '0').toFixed(1);
            return { name: playerData.player.name, rating, logo: teamLogo };
        });
    } catch (error) { return []; }
}

export async function fetchTeamInfo(teamId: string) {
    if (!API_KEY) return null;
    try {
        const res = await fetch(`${API_URL}/teams?id=${teamId}`, serverOptions);
        if (!res.ok) return null;
        const data = await res.json();
        return data.response[0] || null;
    } catch (error) { return null; }
}

export async function fetchTeamFixtures(teamId: string, season: string = "2023") {
    if (!API_KEY) return [];
    try {
        const res = await fetch(`${API_URL}/fixtures?team=${teamId}&season=${season}`, serverOptions);
        if (!res.ok) return [];
        const data = await res.json();
        return (data.response || []).map(mapApiFixtureToMatch).filter(Boolean) as Match[];
    } catch (error) { return []; }
}

export async function fetchTeamSquad(teamId: string) {
    if (!API_KEY) return [];
    try {
        const res = await fetch(`${API_URL}/players/squads?team=${teamId}`, serverOptions);
        if (!res.ok) return [];
        const data = await res.json();
        return data.response[0]?.players || [];
    } catch (error) { return []; }
}


// --- NEWS FUNCTIONS ---




export async function fetchMatchDetailsById(id: string): Promise<MatchDetails | null> {
    if (!API_KEY) { return null; }
    try {
        const fixtureRes = await fetch(`${API_URL}/fixtures?id=${id}`, serverOptions);
        if (!fixtureRes.ok) return null;
        const fixtureData = await fixtureRes.json();
        const apiFixture: ApiFixture = fixtureData.response?.[0];
        if (!apiFixture) return null;
        const { home, away } = apiFixture.teams;
        const { league } = apiFixture;
        const [h2hRes, standingsRes, oddsRes, eventsRes, statsRes] = await Promise.all([
            fetch(`${API_URL}/fixtures/headtohead?h2h=${home.id}-${away.id}&last=5`, serverOptions),
            fetch(`${API_URL}/standings?league=${league.id}&season=${league.season}`, serverOptions),
            fetch(`${API_URL}/odds?fixture=${id}`, serverOptions),
            fetch(`${API_URL}/fixtures/events?fixture=${id}`, serverOptions),
            fetch(`${API_URL}/fixtures/statistics?fixture=${id}`, serverOptions),
        ]);
        const match: MatchDetails = mapApiFixtureToMatch(apiFixture) as MatchDetails;
        if (eventsRes.ok) match.events = (await eventsRes.json()).response;
        if (h2hRes.ok) match.h2h = (await h2hRes.json()).response;
        if (standingsRes.ok) {
            const standingsData = await standingsRes.json();
            const standings = standingsData.response[0]?.league?.standings[0] || [];
            match.form = { home: standings.find((t: any) => t.team.id === home.id)?.form || '-----', away: standings.find((t: any) => t.team.id === away.id)?.form || '-----' };
        }
        if (oddsRes.ok) {
            const oddsData = await oddsRes.json();
            const bookmaker = oddsData.response[0]?.bookmakers.find((b: any) => b.id === 8) || oddsData.response[0]?.bookmakers[0];
            const matchWinnerBet = bookmaker?.bets.find((bet: any) => bet.id === 1);
            if (matchWinnerBet) {
                const homeOdd = parseFloat(matchWinnerBet.values.find((v: any) => v.value === 'Home')?.odd || '0');
                const drawOdd = parseFloat(matchWinnerBet.values.find((v: any) => v.value === 'Draw')?.odd || '0');
                const awayOdd = parseFloat(matchWinnerBet.values.find((v: any) => v.value === 'Away')?.odd || '0');
                if (homeOdd && drawOdd && awayOdd) {
                    const totalInv = (1 / homeOdd) + (1 / drawOdd) + (1 / awayOdd);
                    match.predictions = { home: Math.round(((1 / homeOdd) / totalInv) * 100), draw: Math.round(((1 / drawOdd) / totalInv) * 100), away: Math.round(((1 / awayOdd) / totalInv) * 100), };
                }
            }
        }
        if (statsRes.ok) {
            const statsData = await statsRes.json();
            if (statsData.response && statsData.response.length > 0) {
                const homeStatsRaw = statsData.response.find((s: any) => s.team.id === home.id)?.statistics || [];
                const awayStatsRaw = statsData.response.find((s: any) => s.team.id === away.id)?.statistics || [];
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
}