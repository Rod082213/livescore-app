// src/app/api/youtube-highlights-by-date/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { fetchYoutubeHighlightsByDate } from '@/lib/api'; // Reuse our server-side fetcher

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');

  if (!date) {
    return new NextResponse('Date parameter is required', { status: 400 });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new NextResponse('Invalid date format. Use YYYY-MM-DD.', { status: 400 });
  }

  try {
    const highlights = await fetchYoutubeHighlightsByDate(date);
    return NextResponse.json(highlights);
  } catch (error) {
    console.error(`Error in /api/youtube-highlights-by-date for date ${date}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}