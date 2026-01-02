export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// Rate limiting simple (por IP)
const rateLimit = new Map();

// User agents maliciosos conocidos
const blockedUserAgents = [
  'masscan',
  'nmap',
  'sqlmap',
  'nikto',
  'w3af',
  'acunetix',
  'burpsuite',
  'metasploit',
];

export default function middleware(request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  
  // Bloquear user agents maliciosos (excepto bots legítimos)
  const isBlocked = blockedUserAgents.some(agent => userAgent.includes(agent));
  const isLegitBot = userAgent.includes('googlebot') || userAgent.includes('bingbot');
  
  if (isBlocked && !isLegitBot) {
    return new Response('Forbidden', { status: 403 });
  }

  // Rate limiting: 100 requests por minuto por IP
  const now = Date.now();
  const limit = rateLimit.get(ip);
  
  if (limit) {
    if (now < limit.resetTime) {
      if (limit.count >= 100) {
        return new Response('Too Many Requests', { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((limit.resetTime - now) / 1000).toString()
          }
        });
      }
      limit.count++;
    } else {
      rateLimit.set(ip, { count: 1, resetTime: now + 60000 });
    }
  } else {
    rateLimit.set(ip, { count: 1, resetTime: now + 60000 });
  }

  // Limpiar entradas antiguas
  if (Math.random() < 0.01) {
    for (const [key, value] of rateLimit.entries()) {
      if (now > value.resetTime) {
        rateLimit.delete(key);
      }
    }
  }

  return null; // Continue to next middleware/page
}
