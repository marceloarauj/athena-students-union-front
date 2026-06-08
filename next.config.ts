import type { NextConfig } from 'next';
import pkg from './package.json';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:5252';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
  },
  async rewrites() {
    return [
      {
        source: '/tarefas',
        destination: '/tasks',
      },
      {
        source: '/api/:path*',
        destination: `${API_BASE_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
