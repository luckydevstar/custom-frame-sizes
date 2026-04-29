/** @type {import('next').NextConfig} */
const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Rewrite asset URLs to local API (assets_to_use). Path goes in URL so it is passed reliably.
// Note: 'frames' is NOT included here because /frames/colors, /frames/styles, /frames/sizes are
// app routes. Frames asset rewriting is done in middleware so we can exclude those paths.
const assetPrefixes = [
  'mats', 'canvas', 'magazine', 'comic', 'playbill', 'newspaper',
  'collage', 'card-frames', 'diploma', 'cd', 'ticket-frames', 'invitation-frames',
  'needlework', 'signature-frames', 'record-album', 'puzzle', 'sonogram', 'military',
  'blog', 'components', 'stock', 'movie-poster',
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
      { source: '/blog', destination: '/learn', permanent: true },
      { source: '/blog/:path*', destination: '/learn', permanent: true },
      { source: '/returns', destination: '/returns-exchanges', permanent: true },
      { source: '/business-services', destination: '/business', permanent: true },
      { source: '/frame-quality-guarantee', destination: '/warranty', permanent: true },
      // Legacy / mistaken URLs (SEO crawl C1)
      { source: '/frames', destination: '/frames/styles', permanent: true },
      { source: '/gallery', destination: '/samples', permanent: true },
      { source: '/print-and-frame', destination: '/designer', permanent: true },
      { source: '/frames/bronz-picture-frame', destination: '/frames/bronze-picture-frame', permanent: true },
      { source: '/order-fulfillment', destination: '/', permanent: true },
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
        hostname: '*.customframesizes.com',
      },
      {
        protocol: 'https',
        hostname: 'novuspolish.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@framecraft/ui', '@framecraft/core'],
  },
  webpack: (config, { isServer }) => {
    // Suppress "Critical dependency" warnings from Sentry/OpenTelemetry node_modules
    // (dynamic require in @sentry/node and require-in-the-middle; harmless in our setup)
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /node_modules\/@opentelemetry\/instrumentation/ },
      { module: /node_modules\/require-in-the-middle/ },
    ];

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

module.exports = withBundleAnalyzer(nextConfig);

