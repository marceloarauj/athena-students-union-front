import type { NextConfig } from 'next';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:5252';

const nextConfig: NextConfig = {
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
