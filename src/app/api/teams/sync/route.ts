// src/app/api/teams/sync/route.ts

import { NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Team from '@/models/Team';
import { fetchAllTeamsFromAllLeagues } from '@/lib/api'; 

export async function POST() {
  console.log('[SYNC] Received request to sync teams...');

  if (!process.env.NEXT_PUBLIC_FOOTBALL_API_KEY) {
      console.error('[SYNC-ERROR] Football API Key is not configured.');
      return NextResponse.json({ message: 'Server configuration error: Football API key missing.' }, { status: 500 });
  }

  try {
    console.log('[SYNC] Step 1: Fetching data from external Football API...');
    // Assuming the response for each team includes a `country` and `code` property from the API
    const leaguesWithTeams = await fetchAllTeamsFromAllLeagues();

    if (!leaguesWithTeams || leaguesWithTeams.length === 0) {
      console.error('[SYNC-ERROR] Step 1 Failed: Received no data from the external API.');
      return NextResponse.json({ message: 'Failed to fetch any data from the Football API.' }, { status: 502 });
    }
    console.log(`[SYNC] Step 1 Success: Fetched ${leaguesWithTeams.length} leagues from the API.`);

    const operations = [];
    for (const league of leaguesWithTeams) {
      // The API response for a team object now likely includes `team.country` and `team.code`
      for (const team of league.teams) {
        operations.push({
          updateOne: {
            filter: { apiId: team.id },
            update: {
              $set: {
                apiId: team.id,
                name: team.name,
                logoUrl: team.logo, 
                leagueName: league.leagueName,
                // --- NEW ---
                // We add the country data here. We provide fallbacks in case the API data is missing.
                countryName: team.country || 'Unknown',
                countryCode: team.code || 'XX', // 'XX' is a user-assigned code for unknown
              }
            },
            upsert: true,
          }
        });
      }
    }

    if (operations.length === 0) {
        console.warn('[SYNC] No team operations to perform.');
        return NextResponse.json({ message: 'No teams found to sync.' });
    }
    console.log(`[SYNC] Step 2: Prepared ${operations.length} database operations.`);

    console.log('[SYNC] Step 3: Connecting to MongoDB...');
    await connectToDB();
    console.log('[SYNC] MongoDB connected. Writing data...');
    
    const result = await Team.bulkWrite(operations);
    console.log('[SYNC] Step 3 Success: Bulk write complete!');
    console.log(`- New Teams Created: ${result.upsertedCount}`);
    console.log(`- Existing Teams Updated: ${result.modifiedCount}`);

    return NextResponse.json({
      message: 'Teams synced successfully!',
      created: result.upsertedCount,
      updated: result.modifiedCount,
    });

  } catch (error) {
    console.error('[SYNC-CRITICAL-ERROR] The sync process failed:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred during sync.', error: (error as Error).message },
      { status: 500 }
    );
  }
}