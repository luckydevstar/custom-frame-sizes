/**
 * Brand-aware Next.js metadata-route builders for `app/sitemap.ts`,
 * `app/robots.ts`, and `app/manifest.ts`. Each app passes its `brandConfig`
 * (and any per-store extras) and exports the result.
 */

import type { BrandConfig } from "@framecraft/config";
import type { MetadataRoute } from "next";

import { resolveSiteOrigin } from "../internal/origin";

/* ------------------------------------------------------------------------- */
/*   Sitemap                                                                  */
/* ------------------------------------------------------------------------- */

export type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

export interface SitemapEntryInput {
  /** Path or absolute URL. */
  url: string;
  /** ISO date or Date; defaults to "now". */
  lastModified?: string | Date;
  changeFrequency?: ChangeFreq;
  priority?: number;
}

export interface SitemapOptions {
  /** Static, hand-curated entries (homepage, designer, etc.). */
  staticEntries: SitemapEntryInput[];
  /** Dynamic entries (e.g., one per frame style); concatenated after static. */
  dynamicEntries?: SitemapEntryInput[];
}

/** Build a Next.js sitemap from a brand config + entry definitions. */
export function createSitemap(
  brand: BrandConfig,
  options: SitemapOptions,
): MetadataRoute.Sitemap {
  const origin = resolveSiteOrigin(brand);
  const all = [...options.staticEntries, ...(options.dynamicEntries ?? [])];
  return all.map((entry) => ({
    url: toAbsolute(origin, entry.url),
    lastModified: normalizeDate(entry.lastModified) ?? new Date(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}

/* ------------------------------------------------------------------------- */
/*   Robots                                                                   */
/* ------------------------------------------------------------------------- */

/**
 * Single robots rule (matches Next.js's `MetadataRoute.Robots["rules"]` element shape
 * when supplied as an array — `userAgent` is required in that variant).
 */
type RobotsRule = {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
};

export interface RobotsOptions {
  /** Paths to disallow for the default `*` user agent. */
  disallow?: string[];
  /** Crawl delay seconds for the default user agent. */
  crawlDelay?: number;
  /** Bot user agents to fully block (e.g. AhrefsBot). */
  blockUserAgents?: string[];
  /** Sitemap URL (defaults to `${origin}/sitemap.xml`). */
  sitemapUrl?: string;
  /** Additional rule blocks (advanced). */
  extraRules?: RobotsRule[];
}

const DEFAULT_DISALLOW = ["/api/", "/admin/", "/cart/*", "/_next/", "/static/"];
const DEFAULT_BLOCKED_BOTS = ["AhrefsBot", "SemrushBot", "DotBot"];

/** Build a Next.js robots config from a brand config. */
export function createRobots(
  brand: BrandConfig,
  options: RobotsOptions = {},
): MetadataRoute.Robots {
  const origin = resolveSiteOrigin(brand);
  const sitemapUrl = options.sitemapUrl ?? `${origin}/sitemap.xml`;

  const baseRule: RobotsRule = {
    userAgent: "*",
    allow: "/",
    disallow: options.disallow ?? DEFAULT_DISALLOW,
    crawlDelay: options.crawlDelay ?? 1,
  };

  const blockedBots = options.blockUserAgents ?? DEFAULT_BLOCKED_BOTS;
  const blockedRule: RobotsRule | null =
    blockedBots.length > 0 ? { userAgent: blockedBots, disallow: "/" } : null;

  const rules: RobotsRule[] = [
    baseRule,
    ...(blockedRule ? [blockedRule] : []),
    ...(options.extraRules ?? []),
  ];

  return {
    rules,
    sitemap: sitemapUrl,
  };
}

/* ------------------------------------------------------------------------- */
/*   Manifest (PWA / install)                                                 */
/* ------------------------------------------------------------------------- */

export interface ManifestOptions {
  /** Override `name` (defaults to brand.name). */
  name?: string;
  /** Override `short_name` (defaults to brand.name). */
  shortName?: string;
  /** Override description (defaults to brand seo.description). */
  description?: string;
  /** Theme color hex/HSL string (defaults to brand primary or `#ffffff`). */
  themeColor?: string;
  /** Background color (defaults to white). */
  backgroundColor?: string;
  /** Start URL (defaults to `/`). */
  startUrl?: string;
  /** Display mode (defaults to `standalone`). */
  display?: MetadataRoute.Manifest["display"];
  /** Override icons. Defaults to `/favicon.svg` + `/favicon.ico`. */
  icons?: MetadataRoute.Manifest["icons"];
}

/** Build a Next.js manifest from a brand config. */
export function createManifest(
  brand: BrandConfig,
  options: ManifestOptions = {},
): MetadataRoute.Manifest {
  const themeColor = options.themeColor ?? brand.theme?.brandColors?.primary ?? "#ffffff";
  return {
    name: options.name ?? brand.name,
    short_name: options.shortName ?? brand.name,
    description: options.description ?? brand.seo.description,
    start_url: options.startUrl ?? "/",
    display: options.display ?? "standalone",
    background_color: options.backgroundColor ?? "#ffffff",
    theme_color: themeColor,
    icons:
      options.icons ?? [
        { src: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
        { src: "/favicon.ico", type: "image/x-icon", sizes: "32x32" },
      ],
  };
}

/* ------------------------------------------------------------------------- */
/*   Internal                                                                 */
/* ------------------------------------------------------------------------- */

function toAbsolute(origin: string, value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  const path = value.startsWith("/") ? value : `/${value}`;
  return `${origin}${path}`;
}

function normalizeDate(value: string | Date | undefined): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}
