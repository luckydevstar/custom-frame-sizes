/**
 * Default preconnect targets shared across all storefronts.
 *
 * Render with `<link rel="preconnect" />` (and `<link rel="dns-prefetch" />`
 * as a fallback) in `app/layout.tsx`. Per-store extras can be passed alongside
 * via {@link buildPreconnectLinks}.
 */

export interface PreconnectTarget {
  href: string;
  /** When true, includes `crossOrigin="anonymous"` (needed for fonts/CDN buckets). */
  crossOrigin?: boolean;
}

/** Hosts the FrameCraft platform virtually always benefits from preconnecting to. */
export const SHARED_PRECONNECT_TARGETS: PreconnectTarget[] = [
  { href: "https://cdn.shopify.com" },
  { href: "https://fonts.googleapis.com" },
  { href: "https://fonts.gstatic.com", crossOrigin: true },
];

/** Combine shared defaults with per-app extras (e.g. R2 bucket, CDN domain). */
export function buildPreconnectLinks(
  extra: PreconnectTarget[] = [],
): PreconnectTarget[] {
  const map = new Map<string, PreconnectTarget>();
  for (const target of [...SHARED_PRECONNECT_TARGETS, ...extra]) {
    map.set(target.href, target);
  }
  return Array.from(map.values());
}
