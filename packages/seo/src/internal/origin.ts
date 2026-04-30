/**
 * Brand-aware origin / canonical URL helpers.
 *
 * Every helper in @framecraft/seo derives its origin from `BrandConfig.seo.canonicalUrl`
 * (or `BrandConfig.domain` as a fallback). There is intentionally NO hardcoded
 * fallback hostname — a misconfigured store should fail loudly, not silently leak
 * another brand's URLs into metadata.
 */

import type { BrandConfig } from "@framecraft/config";

/**
 * Resolve a normalized site origin (e.g. `https://www.example.com`, no trailing slash)
 * from a {@link BrandConfig}. Throws if neither `seo.canonicalUrl` nor `domain` is set.
 */
export function resolveSiteOrigin(brand: BrandConfig): string {
  const fromCanonical = brand.seo?.canonicalUrl;
  if (fromCanonical) {
    return stripTrailingSlash(fromCanonical);
  }

  const domain = brand.domain;
  if (domain) {
    const withScheme = /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;
    return stripTrailingSlash(withScheme);
  }

  throw new Error(
    `[@framecraft/seo] BrandConfig for "${brand.storeId}" is missing both seo.canonicalUrl and domain — cannot resolve site origin.`,
  );
}

/**
 * Resolve absolute URL from a path or absolute URL.
 *
 * - `/foo` → `${origin}/foo`
 * - `foo` → `${origin}/foo`
 * - `https://x/y` → returned unchanged
 */
export function toAbsoluteUrl(origin: string, value: string): string {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  const path = value.startsWith("/") ? value : `/${value}`;
  return `${origin}${path}`;
}

/** Build a canonical URL for `pathname` against the brand's origin (root path renders as origin + "/"). */
export function buildCanonicalUrl(brand: BrandConfig, pathname: string): string {
  const origin = resolveSiteOrigin(brand);
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const normalized = path === "/" ? "/" : path.replace(/\/+$/, "");
  return `${origin}${normalized}`;
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}
