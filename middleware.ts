import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

/**
 * Middleware to set appropriate cache headers for static assets
 *
 * Strategy:
 * - Static assets (_next/static/): 1 year immutable cache
 * - HTML pages: 1 hour cache (allows updates)
 * - Fonts & CSS: 1 year immutable cache
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  // Static Next.js assets - cache forever (hash-based versioning)
  if (pathname.startsWith("/_next/static/")) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  // Optimized images from Next.js Image component
  if (pathname.startsWith("/_next/image")) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  // Font files - cache forever
  if (pathname.match(/\.(woff2?|ttf)$/)) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  // CSS and JavaScript files - cache forever (versioned by hash)
  if (pathname.match(/\.(css|js)$/)) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  // HTML pages and dynamic routes - shorter cache
  if (pathname === "/" || pathname.endsWith(".html") || !pathname.includes(".")) {
    response.headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
  }

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths that should not be cached
    "/((?!api|_next/data|favicon.ico).*)",
  ],
};
