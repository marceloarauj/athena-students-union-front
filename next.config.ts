import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/tarefas',
        destination: '/tasks',
      },
    ];
  },
};

export default nextConfig;
