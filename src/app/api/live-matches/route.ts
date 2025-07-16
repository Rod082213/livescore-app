// src/app/api/live-matches/route.ts
import { NextResponse } from 'next/server';
import { fetchLiveMatches } from '@/lib/api';

// This route is a lightweight endpoint specifically for polling.
export async function GET() {
  try {
    const liveMatches = await fetchLiveMatches();
    return NextResponse.json(liveMatches);
  } catch (error) {
    console.error(`Error in /api/live-matches:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}