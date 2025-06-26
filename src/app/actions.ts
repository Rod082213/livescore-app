// src/app/actions.ts
"use server";

import { fetchMatchesForClient, fetchStandings } from "@/lib/api";

// ... (keep your existing actions)
export async function getMatchesByDate(date: Date) { /* ... */ }
export async function getStandingsForLeague(leagueId: string) { /* ... */ }


// ===== START: ADD THIS NEW SERVER ACTION =====
// This function will be called from our client component to get events for a specific fixture.
export async function getEventsForFixture(fixtureId: string) {
    const API_URL = 'https://v3.football.api-sports.io';
    const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;

    if (!API_KEY) {
        console.error("API Key is missing!");
        return [];
    }

    try {
        const response = await fetch(`${API_URL}/fixtures/events?fixture=${fixtureId}`, {
            method: 'GET',
            headers: { 'x-apisports-key': API_KEY },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return data.response || [];

    } catch (error) {
        console.error("Error fetching events for fixture:", error);
        return [];
    }
}
// ===== END: ADD THIS NEW SERVER ACTION =====