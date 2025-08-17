import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (not recommended for production)
const rateLimitMap: Map<string, { count: number; timestamp: number }> = new Map();
const RATE_LIMIT = 60; // requests
const WINDOW_SIZE = 60 * 1000; // 1 minute

export function middleware(request: NextRequest) {
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'anonymous';
  const now = Date.now();
  const entry = rateLimitMap.get(ip) ?? { count: 0, timestamp: now };
  if (now - entry.timestamp > WINDOW_SIZE) {
    // Reset window
    entry.count = 0;
    entry.timestamp = now;
  }
  entry.count += 1;
  rateLimitMap.set(ip, entry);
  if (entry.count > RATE_LIMIT) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export const config = {
  matcher: '/api/:path*',
};