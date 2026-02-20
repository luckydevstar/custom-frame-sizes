import { NextResponse } from 'next/server';

/**
 * Rewrite /frames/* to the asset API only when the path is not an app route.
 * App routes: /frames/colors, /frames/colors/:slug, /frames/styles, /frames/styles/:slug, /frames/sizes
 *
 * Also rewrite shared asset paths (e.g. /jersey/lifestyle/..., /puck/lifestyle/...)
 * so getSharedAssetUrl() relative paths are served from /api/asset when CDN is not set.
 */
const FRAMES_PAGE_PREFIXES = ['/frames/colors', '/frames/styles', '/frames/sizes'];

/** Path prefixes for shared assets (under assets_to_use/shared_assets). Must match getSharedAssetUrl usage. */
const SHARED_ASSET_PREFIXES = [
  '/jersey/',
  '/puck/',
  '/currency/',
  '/ticket-frames/',
  '/signature-frames/',
  '/collage/',
  '/record-album/',
  '/comic/',
  '/card-frames/',
  '/playbill/',
  '/movie-poster/',
  '/diploma/',
  '/newspaper/',
  '/needlework/',
  '/sonogram/',
  '/invitation-frames/',
  '/puzzle/',
  '/canvas/',
  '/mats/',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Shared assets: /jersey/lifestyle/... -> /api/asset/jersey/lifestyle/...
  const sharedPrefix = SHARED_ASSET_PREFIXES.find((p) => pathname.startsWith(p));
  if (sharedPrefix) {
    const pathAfterPrefix = pathname.slice(1); // leading slash removed so path is "jersey/lifestyle/..."
    const url = request.nextUrl.clone();
    url.pathname = `/api/asset/${pathAfterPrefix}`;
    return NextResponse.rewrite(url);
  }

  if (!pathname.startsWith('/frames/')) {
    return NextResponse.next();
  }

  const isPageRoute = FRAMES_PAGE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'));
  if (isPageRoute) {
    return NextResponse.next();
  }

  const pathAfterFrames = pathname.slice(8) || ''; // skip '/frames/'
  const segments = pathAfterFrames.split('/').filter(Boolean);
  // Single segment (e.g. /frames/light-oak) = frame designer page; do not rewrite to asset API
  if (segments.length <= 1) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/api/asset/frames/${pathAfterFrames}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    '/frames/:path*',
    '/jersey/:path*',
    '/puck/:path*',
    '/currency/:path*',
    '/ticket-frames/:path*',
    '/signature-frames/:path*',
    '/collage/:path*',
    '/record-album/:path*',
    '/comic/:path*',
    '/card-frames/:path*',
    '/playbill/:path*',
    '/movie-poster/:path*',
    '/diploma/:path*',
    '/newspaper/:path*',
    '/needlework/:path*',
    '/sonogram/:path*',
    '/invitation-frames/:path*',
    '/puzzle/:path*',
    '/canvas/:path*',
    '/mats/:path*',
  ],
};
