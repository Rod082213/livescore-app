// src/app/api/highlights/route.ts
import { NextResponse, NextRequest } from 'next/server';

const HIGHLIGHTLY_API_KEY = process.env.HIGHLIGHTLY_API_KEY;
const HIGHLIGHTLY_HOST = 'sports.highlightly.net';

export async function GET(request: NextRequest) {
  if (!HIGHLIGHTLY_API_KEY) {
    return new NextResponse('API Key not configured', { status: 500 });
  }

  // Get the matchId from the query parameters (e.g., /api/highlights?matchId=123)
  const searchParams = request.nextUrl.searchParams;
  const matchId = searchParams.get('matchId');

  if (!matchId) {
    return new NextResponse('matchId is required', { status: 400 });
  }

  const url = `https://${HIGHLIGHTLY_HOST}/football/highlights/match/${matchId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': HIGHLIGHTLY_HOST,
        'x-rapidapi-key': HIGHLIGHTLY_API_KEY,
      },
      // Short cache for client-side fetches
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      // It's okay if a match is not found (404), just return empty
      if (response.status === 404) {
        return NextResponse.json([]);
      }
      // For other errors, log them
      console.error(`Highlightly API error: ${response.status}`);
      return new NextResponse(response.statusText, { status: response.status });
    }

    const result = await response.json();
    // Forward the result to the client component
    return NextResponse.json(result.data || result);

  } catch (error) {
    console.error('[API_ROUTE_HIGHLIGHTS] Fetch error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}