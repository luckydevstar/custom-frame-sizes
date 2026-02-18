/** @type {import('next').NextConfig} */
const path = require('path');

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

module.exports = nextConfig;

