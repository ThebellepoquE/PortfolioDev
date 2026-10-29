import { describe, expect, it } from 'vitest';
import nextConfig from './next.config';

/** Reads one compiled header rule as a key/value map. */
async function headersFor(source: string) {
  const rules = await nextConfig.headers?.();
  const rule = rules?.find((entry) => entry.source === source);
  if (!rule) throw new Error(`No header rule declared for source ${source}`);

  return Object.fromEntries(rule.headers.map((header) => [header.key, header.value]));
}

describe('next.config security headers', () => {
  it('does not advertise the framework in responses', () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });

  it('sends transport hardening headers on every route', async () => {
    const headers = await headersFor('/(.*)');

    expect(headers['Strict-Transport-Security']).toBe('max-age=31536000; includeSubDomains');
    expect(headers['X-Frame-Options']).toBe('DENY');
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['Cross-Origin-Opener-Policy']).toBe('same-origin');
    expect(headers['Permissions-Policy']).toContain('camera=()');
    expect(headers['Permissions-Policy']).toContain('geolocation=()');
  });

  it('offers AVIF before WebP to next/image', () => {
    expect(nextConfig.images?.formats).toEqual(['image/avif', 'image/webp']);
  });

  it('keeps the retired project slug as a permanent redirect', async () => {
    const redirects = await nextConfig.redirects?.();

    expect(redirects).toContainEqual({
      source: '/proyecto/lighton-encuestas',
      destination: '/proyecto/lighton-es',
      permanent: true,
    });
  });
});
