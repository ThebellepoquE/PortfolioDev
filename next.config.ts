import type { NextConfig } from 'next';

/**
 * Security headers for every response.
 *
 * Declared here instead of vercel.json so they are versioned with the app and
 * survive a change of hosting. A Content-Security-Policy is intentionally
 * absent: `experimental.inlineCss` emits inline <style> tags, so a strict
 * style-src needs build-time hashes or a nonce before it can be enabled.
 */
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()',
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  typedRoutes: true,
  experimental: {
    inlineCss: true,
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  redirects() {
    return [
      {
        source: '/proyecto/lighton-encuestas',
        destination: '/proyecto/lighton-es',
        // permanent -> 308. Next.js never emits a 301 unless statusCode: 301 is set.
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
