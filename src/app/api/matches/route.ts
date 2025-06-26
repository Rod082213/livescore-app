// src/app/api/matches/route.ts
import { NextResponse } from 'next/server';
import { fetchServerSideMatchesAndOdds } from '@/lib/api'; // We will create this in the next step

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }
    
    const matches = await fetchServerSideMatchesAndOdds(date);
    return NextResponse.json(matches);
  } catch (error) {
    console.error('[API Route Error]', error);
    return NextResponse.json({ error: 'Failed to fetch match data' }, { status: 500 });
  }
}