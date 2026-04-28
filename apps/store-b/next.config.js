/** @type {import('next').NextConfig} */
const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Rewrite asset URLs to local API (assets_to_use). Path goes in URL so it is passed reliably.
const assetPrefixes = [
  'mats', 'canvas', 'magazine', 'comic', 'playbill', 'newspaper',
  'collage', 'card-frames', 'diploma', 'cd', 'ticket-frames', 'invitation-frames',
  'needlework', 'signature-frames', 'record-album', 'puzzle', 'sonogram', 'military',
  'blog', 'components', 'stock', 'movie-poster', 'shadowbox',
];
const assetRewrites = assetPrefixes.map((prefix) => ({
  source: `/${prefix}/:path*`,
  destination: `/api/asset/${prefix}/:path*`,
}));
const assetsRewrite = {
  source: '/assets/:path*',
  destination: '/api/asset/assets/:path*',
};

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Use SWC for faster minification
  async redirects() {
    return [
      // Add store-b specific redirects here
      { source: '/returns', destination: '/returns-exchanges', permanent: true },
      { source: '/jerseys', destination: '/jersey-frames', permanent: true },
      { source: '/shadowbox-designer', destination: '/shadowbox/designer', permanent: true },
    ];
  },
  async rewrites() {
    return [...assetRewrites, assetsRewrite];
  },
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
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '*.shadowboxframes.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.shadowboxframes.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.customframesizes.com',
      },
      {
        protocol: 'https',
        hostname: 'shared-assets.customframesizes.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@framecraft/ui', '@framecraft/core'],
  },
  webpack: (config, { isServer }) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /node_modules\/@opentelemetry\/instrumentation/ },
      { module: /node_modules\/require-in-the-middle/ },
    ];

    config.resolve.alias = {
      ...config.resolve.alias,
      '@framecraft/config': path.resolve(__dirname, '../../packages/config/src'),
      '@framecraft/core': path.resolve(__dirname, '../../packages/core/src'),
      '@framecraft/types': path.resolve(__dirname, '../../packages/types/src'),
      '@framecraft/data': path.resolve(__dirname, '../../packages/data/src'),
      '@framecraft/ui': path.resolve(__dirname, '../../packages/ui/src'),
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false,
        fs: false,
        net: false,
        tls: false,
        '@sentry/node': false,
      };

      config.externals = config.externals || [];
      config.externals.push({
        '@sentry/node': 'commonjs @sentry/node',
      });
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
