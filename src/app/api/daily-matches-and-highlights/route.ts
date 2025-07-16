// src/app/api/daily-matches-and-highlights/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { fetchDailyMatchesAndHighlights } from '@/lib/api'; // Reuse our server-side fetcher

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new NextResponse('Valid date parameter (YYYY-MM-DD) is required', { status: 400 });
  }

  try {
    const dailyData = await fetchDailyMatchesAndHighlights(date);
    return NextResponse.json(dailyData);
  } catch (error) {
    console.error(`Error in /api/daily-matches-and-highlights for date ${date}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}