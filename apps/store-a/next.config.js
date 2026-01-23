/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@framecraft/ui',
    '@framecraft/core',
    '@framecraft/config',
    '@framecraft/types',
    '@framecraft/data',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.myshopify.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@framecraft/ui', '@framecraft/core'],
  },
  webpack: (config, { isServer }) => {
    // Resolve TypeScript source files for @framecraft packages
    config.resolve.alias = {
      ...config.resolve.alias,
      '@framecraft/config': path.resolve(__dirname, '../../packages/config/src'),
      '@framecraft/core': path.resolve(__dirname, '../../packages/core/src'),
      '@framecraft/types': path.resolve(__dirname, '../../packages/types/src'),
      '@framecraft/data': path.resolve(__dirname, '../../packages/data/src'),
      '@framecraft/ui': path.resolve(__dirname, '../../packages/ui/src'),
    };
    return config;
  },
};

module.exports = nextConfig;

