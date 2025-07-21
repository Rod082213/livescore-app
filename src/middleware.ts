import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // This is the key part. It tells the middleware to IGNORE
  // all requests that are for API routes, Next.js internal files,
  // or static files (like images).
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/static/') ||
    request.nextUrl.pathname.includes('.') // Ignore files with extensions (e.g., .png, .ico)
  ) {
    return NextResponse.next(); // Let the request pass through
  }

  // If you have other logic for redirecting or rewriting URLs,
  // it can go here. For now, we'll just let all other requests pass.
  return NextResponse.next();
}