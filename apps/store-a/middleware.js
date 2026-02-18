import { NextResponse } from 'next/server';

/**
 * Rewrite /frames/* to the asset API only when the path is not an app route.
 * App routes: /frames/colors, /frames/colors/:slug, /frames/styles, /frames/styles/:slug, /frames/sizes
 */
const FRAMES_PAGE_PREFIXES = ['/frames/colors', '/frames/styles', '/frames/sizes'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/frames/')) {
    return NextResponse.next();
  }

  const isPageRoute = FRAMES_PAGE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'));
  if (isPageRoute) {
    return NextResponse.next();
  }

  const pathAfterFrames = pathname.slice(8) || ''; // skip '/frames/'
  const url = request.nextUrl.clone();
  url.pathname = `/api/asset/frames/${pathAfterFrames}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: '/frames/:path*',
};
