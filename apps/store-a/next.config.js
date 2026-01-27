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

    // Exclude server-only packages from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Node.js built-ins
        async_hooks: false,
        fs: false,
        net: false,
        tls: false,
        // Server-only Sentry package
        '@sentry/node': false,
      };

      // Exclude @sentry/node from being bundled in client
      config.externals = config.externals || [];
      config.externals.push({
        '@sentry/node': 'commonjs @sentry/node',
      });
    }

    return config;
  },
};

module.exports = nextConfig;

