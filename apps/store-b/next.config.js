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
  'components', 'stock', 'movie-poster', 'shadowbox',
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
      { source: '/frames', destination: '/picture-frames', permanent: false },
      { source: '/diploma-frames', destination: '/diploma-certificate-frames', permanent: true },
      { source: '/returns', destination: '/returns-exchanges', permanent: true },
      { source: '/jerseys', destination: '/jersey-frames', permanent: true },
      { source: '/shadowbox-designer', destination: '/shadowbox/designer', permanent: true },
      { source: '/specialty/mat-designer', destination: '/mat-designer', permanent: true },
      { source: '/specialty/bouquet', destination: '/bouquet-frames', permanent: true },
      { source: '/specialty/record-album-frames', destination: '/record-album-frames', permanent: true },
      { source: '/specialty/cd-frames', destination: '/cd-frames', permanent: true },
      { source: '/specialty/movie-poster', destination: '/movie-poster-frames', permanent: true },
      { source: '/specialty/collage', destination: '/collage-frames', permanent: true },
      { source: '/specialty/ticket', destination: '/ticket-frames', permanent: true },
      { source: '/photo-collage-frames', destination: '/collage-frames', permanent: true },
      { source: '/collage-frames/designer', destination: '/collage-frames', permanent: true },
      { source: '/ticket-stub-frames', destination: '/ticket-frames', permanent: true },
      { source: '/magazine-frame-sizes', destination: '/magazine-sizes-guide', permanent: true },
      { source: '/comic-book-frame', destination: '/comic-book-frames', permanent: true },
      { source: '/designer/comic-book-frame', destination: '/comic-book-frames', permanent: true },
      { source: '/playbill-frames/designer', destination: '/playbill-frames', permanent: true },
      { source: '/newspaper-frames/designer', destination: '/newspaper-frames', permanent: true },
      { source: '/shadowbox/deep-frames', destination: '/shadowbox/deep-shadowbox-frames', permanent: true },
      { source: '/shadowbox/depth-guide', destination: '/shadowbox/deep-shadowbox-frames', permanent: true },
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
    instrumentationHook: true,
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
      // Per-app product data injection. Resolves to this app's isolated data
      // folder so shared core/config modules statically embed store-specific
      // JSON at module-load time. See packages/core/src/services/products.ts.
      '@framecraft/store-data': path.resolve(__dirname, 'src/data'),
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
