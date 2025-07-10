// src/lib/api.ts

import { Match, LeagueGroup, Standing, Player, ApiFixture, ApiOdd, ApiStanding, ApiPlayer, ApiLeague, MatchDetails, Article as IArticle } from "@/data/mockData";
import { isToday, format, isBefore, startOfDay } from 'date-fns';
import dbConnect from './mongodb';
import ArticleModel from '../models/Article';
import { generateNewsSlug } from './utils';

async function generateArticleContent(title: string): Promise<string> {
    const teams = title.match(/(Chelsea|PSG|Inter Milan|San Siro|Real Madrid|Barcelona|Liverpool|Manchester United)/gi) || [];
    let content = `
        <p class="lead">In the ever-churning world of football transfers, speculation is a constant companion. The latest wave of rumors has linked several high-profile players to major clubs, but a prominent journalist is urging fans to temper their expectations.</p>
        <h2>Setting the Record Straight</h2>
        <p>Speaking on a popular sports broadcast, the journalist directly addressed the recent reports. "While these names are exciting for the fans and make for great headlines, my sources indicate that these are not the primary targets for the club at this moment," he stated emphatically. He explained that the club's strategy is focused on a different set of profiles that align more closely with the coach's tactical vision and the club's financial framework.</p>
        <h2>Why The Rumors Started</h2>
        <p>The speculation likely gained traction due to a combination of factors. Player availability, the ongoing search by top clubs to strengthen their squads, and the powerful influence of player agents all contribute to a fertile ground for transfer rumors. "It's a classic pre-season scenario," the journalist added. "Agents are exploring options for their clients, and clubs are being offered dozens of players. It's crucial to distinguish between a preliminary inquiry and a concrete negotiation, and right now, we are very much in the early stages for many of these stories."</p>
    `;

    if (teams.length > 0) {
        content += `
            <h2>Focus on ${teams.join(' & ')}</h2>
            <p>The focus for clubs like ${teams.join(', ')} remains on building a cohesive unit for the upcoming season. For many, the priority is to add specific reinforcements in key areas identified by the management, rather than making opportunistic signings based on name recognition alone. The journalist concluded, "Fans should keep an eye on official channels and trusted sources. While the transfer window can be unpredictable, the current strategy is one of precision, not just speculation."</p>
        `;
    }
    return Promise.resolve(content);
}

function mapStatus(status: any): { status: Match['status'], time?: string } {
    if (['FT', 'AET', 'PEN'].includes(status.short)) return { status: 'FT', time: 'FT' };
    if (status.short === 'HT') return { status: 'HT', time: 'HT' };
    if (status.short === 'NS') return { status: 'UPCOMING', time: 'Upcoming' };
    if (status.elapsed) return { status: 'LIVE', time: `${status.elapsed}'` };
    return { status: 'UPCOMING', time: status.short };
}

export function mapApiFixtureToMatch(apiFixture: any): Match | null {
    if (!apiFixture || !apiFixture.fixture) return null;
    let { status, time } = mapStatus(apiFixture.fixture.status);
    if (status === 'UPCOMING' && apiFixture.fixture.date) {
        time = format(new Date(apiFixture.fixture.date), 'HH:mm');
    }
    const match: Match = {
        id: apiFixture.fixture.id, time: time || '', status,
        homeTeam: { name: apiFixture.teams.home.name, logo: apiFixture.teams.home.logo },
        awayTeam: { name: apiFixture.teams.away.name, logo: apiFixture.teams.away.logo },
        score: `${apiFixture.goals.home ?? '0'} - ${apiFixture.goals.away ?? '0'}`,
        league: apiFixture.league.name, leagueLogo: apiFixture.league.logo,
        countryName: apiFixture.league.country, countryFlag: apiFixture.league.flag,
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
    const leagueName = match.league;
    if (!acc[leagueName]) {
      acc[leagueName] = { leagueName: leagueName, leagueLogo: match.leagueLogo || '', countryName: match.countryName || 'World', countryFlag: match.countryFlag || '', matches: [], };
    }
    acc[leagueName].matches.push(match);
    return acc;
  }, {} as Record<string, LeagueGroup>);
  return Object.values(grouped);
}

function mapApiStandingToStanding(apiStanding: ApiStanding): Standing {
    return {
        rank: apiStanding.rank, team: { name: apiStanding.team.name, logo: apiStanding.team.logo },
        played: apiStanding.all.played, win: apiStanding.all.win,
        draw: apiStanding.all.draw, loss: apiStanding.all.loss,
        diff: apiStanding.goalsDiff.toString(), points: apiStanding.points,
        form: apiStanding.form.split('').slice(0, 5) as ('W' | 'D' | 'L')[]
    };
}

function mapApiPlayerToPlayer(apiPlayer: ApiPlayer, index: number): Player {
    const positions = [
        { bottom: '5%', left: '50%', transform: 'translateX(-50%)' }, { bottom: '25%', left: '10%' }, { bottom: '20%', left: '35%' }, { bottom: '20%', right: '35%' }, { bottom: '25%', right: '10%' }, { top: '45%', left: '25%' }, { top: '45%', right: '25%' }, { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }, { top: '15%', left: '20%' }, { top: '10%', left: '50%', transform: 'translateX(-50%)' }, { top: '15%', right: '20%' }
    ];
    return {
        name: apiPlayer.player.name, rating: parseFloat(apiPlayer.statistics[0].games.rating || '0').toFixed(1),
        logo: apiPlayer.player.photo, position: positions[index % positions.length]
    };
}

const API_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;
const serverOptions = { method: 'GET', headers: { 'x-apisports-key': API_KEY as string }, next: { revalidate: 60 } };
const clientOptions = { method: 'GET', headers: { 'x-apisports-key': API_KEY as string } };

export async function fetchDashboardData(): Promise<LeagueGroup[]> {
    if (!API_KEY) { return []; }
    const todayStr = new Date().toISOString().split('T')[0];
    const liveUrl = `${API_URL}/fixtures?live=all`;
    const todayUrl = `${API_URL}/fixtures?date=${todayStr}`;
    try {
        const [liveResponse, todayResponse] = await Promise.all([ fetch(liveUrl, serverOptions), fetch(todayUrl, serverOptions) ]);
        if (!liveResponse.ok || !todayResponse.ok) { return []; }
        const liveData = await liveResponse.json();
        const todayData = await todayResponse.json();
        const allFixtures: ApiFixture[] = [...(liveData.response || []), ...(todayData.response || [])];
        const uniqueFixtures = Array.from(new Map(allFixtures.map(f => [f.fixture.id, f])).values());
        if (uniqueFixtures.length === 0) { return []; }
        const fixtureIds = uniqueFixtures.map(f => f.fixture.id);
        let oddsMap: { [key: number]: ApiOdd } = {};
        if (fixtureIds.length > 0) {
            const oddsPromises = fixtureIds.map(id => fetch(`${API_URL}/odds?fixture=${id}`, serverOptions).then(res => res.ok ? res.json() : null));
            const oddsResults = await Promise.all(oddsPromises);
            oddsResults.forEach(result => {
                if (result && result.response && result.response.length > 0) {
                    const oddData = result.response[0];
                    oddsMap[oddData.fixture.id] = oddData;
                }
            });
        }
        uniqueFixtures.forEach(fixture => { fixture.oddsData = oddsMap[fixture.fixture.id]; });
        const matches = uniqueFixtures.map(mapApiFixtureToMatch).filter(Boolean) as Match[];
        matches.sort((a, b) => { const order = { 'LIVE': 1, 'HT': 2, 'UPCOMING': 3, 'FT': 4 }; return order[a.status] - order[b.status]; });
        return groupMatchesByLeague(matches);
    } catch (error) { return []; }
}

export async function fetchMatchesForClient(date: Date): Promise<LeagueGroup[]> {
    if (!API_KEY) { return []; }
    let fixtures: ApiFixture[] = [];
    try {
        if (isToday(date)) {
            const liveUrl = `${API_URL}/fixtures?live=all`;
            const todayUrl = `${API_URL}/fixtures?date=${format(date, 'yyyy-MM-dd')}`;
            const [liveResponse, todayResponse] = await Promise.all([ fetch(liveUrl, clientOptions), fetch(todayUrl, clientOptions) ]);
            if (!liveResponse.ok || !todayResponse.ok) { return []; }
            const liveData = await liveResponse.json();
            const todayData = await todayResponse.json();
            fixtures = Array.from(new Map([...(liveData.response || []), ...(todayData.response || [])].map(f => [f.fixture.id, f])).values());
        } else {
            const dateString = format(date, 'yyyy-MM-dd');
            const url = `${API_URL}/fixtures?date=${dateString}`;
            const response = await fetch(url, clientOptions);
            if (!response.ok) return [];
            fixtures = (await response.json()).response || [];
        }
        if (fixtures.length === 0) return [];
        const fixtureIds = fixtures.map(f => f.fixture.id);
        let oddsMap: { [key: number]: ApiOdd } = {};
        if (fixtureIds.length > 0) {
            const oddsPromises = fixtureIds.map(id => fetch(`${API_URL}/odds?fixture=${id}`, clientOptions).then(res => res.ok ? res.json() : null));
            const oddsResults = await Promise.all(oddsPromises);
            oddsResults.forEach(result => {
                if (result && result.response && result.response.length > 0) {
                    const oddData = result.response[0];
                    oddsMap[oddData.fixture.id] = oddData;
                }
            });
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

export async function fetchTeamOfTheWeek(leagueId: string = "39", season: string = "2023"): Promise<Player[]> {
    if (!API_KEY) { return []; }
    try {
        const topScorersUrl = `${API_URL}/players/topscorers?season=${season}&league=${leagueId}`;
        const topScorersResponse = await fetch(topScorersUrl, serverOptions);
        if (!topScorersResponse.ok) { return []; }
        const topScorersData = await topScorersResponse.json();
        const topPlayers: ApiPlayer[] = topScorersData.response?.slice(0, 5) || [];
        if (topPlayers.length === 0) { return []; }
        const playerDetailPromises = topPlayers.map(playerData => fetch(`${API_URL}/players?id=${playerData.player.id}&season=${season}`, serverOptions).then(res => res.ok ? res.json() : null));
        const playerStatsResults = await Promise.all(playerDetailPromises);
        return topPlayers.map((playerData, index) => {
            const detailedStatsData = playerStatsResults[index];
            const teamLogo = detailedStatsData?.response[0]?.statistics[0]?.team?.logo || '';
            const rating = parseFloat(playerData.statistics[0].games.rating || '0').toFixed(1);
            return { name: playerData.player.name, rating: rating, logo: teamLogo };
        });
    } catch (error) { return []; }
}

async function fetchFromNewsApiAndSave() {
  await dbConnect();
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  if (!NEWS_API_KEY) return;
  const newsApiUrl = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&category=sports&language=en&size=10`;
  try {
    const response = await fetch(newsApiUrl);
    if (!response.ok) throw new Error('Failed to fetch from newsdata.io');
    const data = await response.json();
    if (data.status !== 'success' || !data.results) return;

    const articlesToSave = data.results.map((apiArticle: any) => ({
      apiId: apiArticle.article_id,
      slug: generateNewsSlug(apiArticle.title),
      category: "SPORTS",
      title: apiArticle.title,
      imageUrl: apiArticle.image_url || '/placeholder-news.png',
      publishedAt: new Date(apiArticle.pubDate),
    }));

    await ArticleModel.insertMany(articlesToSave, { ordered: false });
  } catch (error: any) {
    if (error.code !== 11000) {
        console.error("Error fetching/saving news:", error);
    }
  }
}

export async function fetchLatestNews(): Promise<(IArticle & { slug: string })[]> {
  await dbConnect();
  try {
    const latestArticle = await ArticleModel.findOne().sort({ createdAt: -1 });
    let needsFetch = true;
    if (latestArticle) {
        const today = startOfDay(new Date());
        if (!isBefore(startOfDay(latestArticle.createdAt), today)) {
            needsFetch = false;
        }
    }
    if (needsFetch) {
        await fetchFromNewsApiAndSave();
    }
    const articlesFromDb = await ArticleModel.find().sort({ publishedAt: -1 }).limit(3);
    return articlesFromDb.map(doc => ({
      id: doc.apiId,
      slug: doc.slug,
      category: doc.category,
      title: doc.title,
      imageUrl: doc.imageUrl,
      date: format(new Date(doc.publishedAt), 'MMM d, yyyy'),
    }));
  } catch (error) {
    return [];
  }
}

export async function fetchAllNews(): Promise<(IArticle & { snippet: string, slug: string })[]> {
  await dbConnect();
  try {
    const articlesFromDb = await ArticleModel.find().sort({ publishedAt: -1 });
    return articlesFromDb.map(doc => ({
      id: doc.apiId,
      slug: doc.slug,
      category: doc.category,
      title: doc.title,
      imageUrl: doc.imageUrl,
      date: format(new Date(doc.publishedAt), 'MMM d, yyyy'),
      snippet: "Click to read the full story about this breaking news in the world of sports..."
    }));
  } catch (error) {
    return [];
  }
}

export async function fetchNewsBySlug(slug: string): Promise<(IArticle & { content?: string }) | null> {
  await dbConnect();
  try {
    const articleDoc = await ArticleModel.findOne({ slug: slug });
    if (!articleDoc) return null;
    const generatedContent = await generateArticleContent(articleDoc.title);
    return {
      id: articleDoc.apiId,
      slug: articleDoc.slug,
      category: articleDoc.category,
      title: articleDoc.title,
      imageUrl: articleDoc.imageUrl,
      date: format(new Date(articleDoc.publishedAt), 'MMM d, yyyy'),
      content: generatedContent
    };
  } catch (error) {
    return null;
  }
}

export async function fetchMatchDetailsById(id: string): Promise<MatchDetails | null> {
    if (!API_KEY) {
        return null;
    }
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
        
        match.leagueName = league.name;
        match.venue = apiFixture.fixture.venue?.name ? `${apiFixture.fixture.venue.name}, ${apiFixture.fixture.venue.city}` : 'N/A';
        match.date = new Date(apiFixture.fixture.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

        if (eventsRes.ok) match.events = (await eventsRes.json()).response;
        if (h2hRes.ok) match.h2h = (await h2hRes.json()).response;

        if (standingsRes.ok) {
            const standingsData = await standingsRes.json();
            const standings = standingsData.response[0]?.league?.standings[0] || [];
            match.form = {
                home: standings.find((t: any) => t.team.id === home.id)?.form || '-----',
                away: standings.find((t: any) => t.team.id === away.id)?.form || '-----'
            };
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
                    match.predictions = {
                        home: Math.round(((1 / homeOdd) / totalInv) * 100),
                        draw: Math.round(((1 / drawOdd) / totalInv) * 100),
                        away: Math.round(((1 / awayOdd) / totalInv) * 100),
                    };
                }
            }
        }

        if (statsRes.ok) {
            const statsData = await statsRes.json();
            if (statsData.response && statsData.response.length > 0) {
                const homeStatsRaw = statsData.response.find((s: any) => s.team.id === home.id)?.statistics || [];
                const awayStatsRaw = statsData.response.find((s: any) => s.team.id === away.id)?.statistics || [];
                
                const processedStats: Record<string, { home: any; away: any; }> = {};

                const allStatTypes = new Set([
                    ...homeStatsRaw.map((s: any) => s.type),
                    ...awayStatsRaw.map((s: any) => s.type)
                ]);

                allStatTypes.forEach(type => {
                    const homeValue = homeStatsRaw.find((s: any) => s.type === type)?.value ?? 0;
                    const awayValue = awayStatsRaw.find((s: any) => s.type === type)?.value ?? 0;
                    processedStats[type] = { home: homeValue, away: awayValue };
                });
                
                match.statistics = processedStats;
            }
        }
        
        return match;

    } catch (error) {
        return null;
    }
}