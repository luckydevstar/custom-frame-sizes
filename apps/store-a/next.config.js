/** @type {import('next').NextConfig} */
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
};

module.exports = nextConfig;

