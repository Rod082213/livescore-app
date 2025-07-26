// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // --- DEBUGGING LOG ---
  console.log(`--- Middleware running for path: ${pathname} ---`);
  // --------------------

  const apiURL = new URL(`/api/redirects${pathname}`, request.url);
  
  try {
    const response = await fetch(apiURL, { cache: 'no-store' });

    // --- DEBUGGING LOG ---
    console.log(`API response status for ${pathname}: ${response.status}`);
    // --------------------

    if (response.ok) {
      const data = await response.json();
      if (data.destination) {
        // --- DEBUGGING LOG ---
        console.log(`✅ Redirecting to: ${data.destination}`);
        // --------------------
        return NextResponse.redirect(new URL(data.destination, request.url), 308);
      }
    }
  } catch (error) {
    console.error('Middleware fetch error:', error);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|admin).*)',
  ],
};