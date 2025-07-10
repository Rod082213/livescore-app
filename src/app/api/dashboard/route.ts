// src/app/api/dashboard/route.ts (CONFIRM THIS IS YOUR CODE)

import { NextResponse } from 'next/server';
// These imports will now work correctly because of the fix in api.ts
import { groupMatchesByLeague, mapApiFixtureToMatch } from '@/lib/api';
import { Match, ApiFixture, ApiOdd } from '@/data/mockData';

const API_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;
const clientOptions = { 
    method: 'GET', 
    headers: { 'x-apisports-key': API_KEY as string },
    next: { revalidate: 60 } 
};

export async function GET() {
    if (!API_KEY) {
        return NextResponse.json({ error: "API Key is missing!" }, { status: 500 });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const liveUrl = `${API_URL}/fixtures?live=all`;
    const todayUrl = `${API_URL}/fixtures?date=${todayStr}`;

    try {
        const [liveResponse, todayResponse] = await Promise.all([
            fetch(liveUrl, clientOptions),
            fetch(todayUrl, clientOptions)
        ]);

        if (!liveResponse.ok || !todayResponse.ok) {
            return NextResponse.json({ error: "One or more API calls failed" }, { status: 502 });
        }

        const liveData = await liveResponse.json();
        const todayData = await todayResponse.json();

        const allFixtures: ApiFixture[] = [...(liveData.response || []), ...(todayData.response || [])];
        const uniqueFixtures = Array.from(new Map(allFixtures.map(f => [f.fixture.id, f])).values());

        if (uniqueFixtures.length === 0) {
            return NextResponse.json([]);
        }

        const fixtureIds = uniqueFixtures.map(f => f.fixture.id);
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

        uniqueFixtures.forEach(fixture => { fixture.oddsData = oddsMap[fixture.fixture.id]; });

        const matches = uniqueFixtures.map(mapApiFixtureToMatch).filter(Boolean) as Match[];
        matches.sort((a, b) => {
            const order = { 'LIVE': 1, 'HT': 2, 'UPCOMING': 3, 'FT': 4 };
            return order[a.status] - order[b.status];
        });

        const groupedData = groupMatchesByLeague(matches);
        return NextResponse.json(groupedData);

    } catch (error) {
        console.error("Error in dashboard API route:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
    }
}