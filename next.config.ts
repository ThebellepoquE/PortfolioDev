import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    inlineCss: true,
  },
  redirects() {
    return [
      {
        source: '/proyecto/lighton-encuestas',
        destination: '/proyecto/lighton-es',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
