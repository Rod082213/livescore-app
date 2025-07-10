// src/app/actions.ts

"use server";

import { format } from 'date-fns';
import { groupMatchesByLeague, mapApiFixtureToMatch, fetchStandings } from "@/lib/api";
import { LeagueGroup, Match, ApiFixture, ApiOdd, Standing } from "@/data/mockData";

const API_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;

const serverOptions = {
  method: 'GET',
  headers: { 'x-apisports-key': API_KEY as string },
  next: { revalidate: 3600 }
};

export async function getMatchesByDate(date: Date): Promise<LeagueGroup[]> {
  if (!API_KEY) {
    return [];
  }
  const dateString = format(date, 'yyyy-MM-dd');
  const url = `${API_URL}/fixtures?date=${dateString}`;
  try {
    const response = await fetch(url, serverOptions);
    if (!response.ok) {
        return [];
    }
    const data = await response.json();
    const fixtures: ApiFixture[] = data.response || [];
    if (fixtures.length === 0) {
      return [];
    }
    const fixtureIds = fixtures.map(f => f.fixture.id);
    let oddsMap: { [key: number]: ApiOdd } = {};
    if (fixtureIds.length > 0) {
      const oddsPromises = fixtureIds.map(id => 
        fetch(`${API_URL}/odds?fixture=${id}`, serverOptions).then(res => res.ok ? res.json() : null)
      );
      const oddsResults = await Promise.all(oddsPromises);
      oddsResults.forEach(result => {
        if (result && result.response && result.response.length > 0) {
          const oddData = result.response[0];
          oddsMap[oddData.fixture.id] = oddData;
        }
      });
    }
    fixtures.forEach(fixture => {
      fixture.oddsData = oddsMap[fixture.fixture.id];
    });
    const matches = fixtures.map(mapApiFixtureToMatch).filter(Boolean) as Match[];
    matches.sort((a, b) => {
        const order = { 'LIVE': 1, 'HT': 2, 'UPCOMING': 3, 'FT': 4 };
        return order[a.status] - order[b.status];
    });
    return groupMatchesByLeague(matches);
  } catch (error) {
    return [];
  }
}

export async function getStandingsForLeague(leagueId: string): Promise<Standing[]> {
    return await fetchStandings(leagueId);
}

export async function getEventsForFixture(fixtureId: string) {
    if (!API_KEY) {
        return [];
    }
    try {
        const response = await fetch(`${API_URL}/fixtures/events?fixture=${fixtureId}`, {
            method: 'GET',
            headers: { 'x-apisports-key': API_KEY },
            next: { revalidate: 30 }
        });
        if (!response.ok) {
            return [];
        }
        const data = await response.json();
        return data.response || [];
    } catch (error) {
        return [];
    }
}

export async function searchEverything(query: string) {
  if (!query || query.length < 3) {
    return { leagues: [], teams: [] };
  }
  if (!API_KEY) {
    return { leagues: [], teams: [] };
  }

  const encodedQuery = encodeURIComponent(query);
  const leagueSearchUrl = `${API_URL}/leagues?search=${encodedQuery}`;
  const teamSearchUrl = `${API_URL}/teams?search=${encodedQuery}`;

  try {
    const [leagueRes, teamRes] = await Promise.all([
      fetch(leagueSearchUrl, serverOptions),
      fetch(teamSearchUrl, serverOptions)
    ]);

    if (!leagueRes.ok || !teamRes.ok) {
      return { leagues: [], teams: [] };
    }

    const leagueData = await leagueRes.json();
    const teamData = await teamRes.json();

    const leagues = leagueData.response || [];
    const teams = teamData.response || [];

    return { leagues, teams };
  } catch (error) {
    return { leagues: [], teams: [] };
  }
}