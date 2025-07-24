// src/lib/apiUtils.ts
import { format } from 'date-fns';
import { Match, LeagueGroup } from './types'; // Assuming types are in a separate file

// --- MAPPING FUNCTIONS ---

// This function is only used by mapApiFixtureToMatch, so it doesn't need to be exported.
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
            id: apiFixture.league.id, 
            name: apiFixture.league.name, 
            logo: apiFixture.league.logo, 
            country: apiFixture.league.country, 
            flag: apiFixture.league.flag,
        }
    };
    return match;
}

export function groupMatchesByLeague(matches: Match[]): LeagueGroup[] {
  if (!matches || matches.length === 0) return [];
  
  const grouped = matches.reduce((acc, match) => {
    const leagueName = match.league.name;
    if (!acc[leagueName]) {
      acc[leagueName] = { 
        leagueName: leagueName, 
        leagueLogo: match.league.logo || '', 
        countryName: match.league.country || 'World', 
        countryFlag: match.league.flag || '', 
        matches: [] 
      };
    }
    acc[leagueName].matches.push(match);
    return acc;
  }, {} as Record<string, LeagueGroup>);
  
  return Object.values(grouped);
}