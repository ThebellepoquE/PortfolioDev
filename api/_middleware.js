// Vercel Edge Middleware - Rate limiting y protección básica

const RATE_LIMIT = 100; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in ms

// Simple in-memory rate limiting (resets on cold start)
const requestCounts = new Map();

// Blocked user agents (malicious bots)
const blockedUserAgents = [
  'semrushbot',
  'ahrefsbot', 
  'mj12bot',
  'dotbot',
  'blexbot',
  'seekport',
];

export default function middleware(request) {
  const url = new URL(request.url);
  
  // Skip static assets
  if (url.pathname.match(/\.(js|css|ico|png|jpg|jpeg|svg|woff2?)$/)) {
    return;
  }
  
  // Check user agent
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  for (const blocked of blockedUserAgents) {
    if (userAgent.includes(blocked)) {
      return new Response('Forbidden', { status: 403 });
    }
  }
  
  // Rate limiting by IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const now = Date.now();
  const windowStart = now - RATE_WINDOW;
  
  // Clean old entries
  for (const [key, data] of requestCounts.entries()) {
    if (data.timestamp < windowStart) {
      requestCounts.delete(key);
    }
  }
  
  // Check rate limit
  const ipData = requestCounts.get(ip) || { count: 0, timestamp: now };
  if (ipData.timestamp < windowStart) {
    ipData.count = 0;
    ipData.timestamp = now;
  }
  
  ipData.count++;
  requestCounts.set(ip, ipData);
  
  if (ipData.count > RATE_LIMIT) {
    return new Response('Too Many Requests', { 
      status: 429,
      headers: { 'Retry-After': '60' }
    });
  }
  
  // Continue to app
  return;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
