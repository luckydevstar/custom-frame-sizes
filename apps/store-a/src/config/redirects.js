// Store-A canonical 301/302 redirects.
//
// Kept as a plain `.js` module (CommonJS) so `next.config.js` can `require()`
// it without going through TypeScript. Add new redirects here, never inline in
// `next.config.js`. CI can lint duplicates / conflicting destinations from
// this file alone.
//
// @type {import('next').NextConfig['redirects'] extends () => Promise<infer R> ? R : never}

const redirects = [
  { source: '/blog', destination: '/learn', permanent: true },
  { source: '/blog/:path*', destination: '/learn', permanent: true },
  { source: '/returns', destination: '/returns-exchanges', permanent: true },
  { source: '/business-services', destination: '/business', permanent: true },
  { source: '/frame-quality-guarantee', destination: '/warranty', permanent: true },
  // Legacy / mistaken URLs (SEO crawl C1)
  { source: '/frames', destination: '/frames/styles', permanent: true },
  { source: '/gallery', destination: '/samples', permanent: true },
  { source: '/print-and-frame', destination: '/designer', permanent: true },
  {
    source: '/frames/bronz-picture-frame',
    destination: '/frames/bronze-picture-frame',
    permanent: true,
  },
  { source: '/order-fulfillment', destination: '/', permanent: true },
];

module.exports = { redirects };
