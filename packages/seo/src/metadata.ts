/**
 * Brand-aware metadata helpers used by Next.js `app/*` `metadata`/`generateMetadata`
 * exports. All helpers take a {@link BrandConfig} (or are bound via {@link createSeo})
 * so per-store SEO never leaks into another brand at runtime.
 */

import type { BrandConfig } from "@framecraft/config";
import type { Metadata } from "next";

import { DEFAULT_OG_PATH, DEFAULT_TWITTER_PATH, META_LIMITS } from "./internal/constants";
import { buildCanonicalUrl, resolveSiteOrigin, toAbsoluteUrl } from "./internal/origin";

/** Open Graph `type` values accepted by Next.js `Metadata.openGraph`. */
export type OpenGraphType =
  | "website"
  | "article"
  | "profile"
  | "book"
  | "music.song"
  | "music.album"
  | "music.playlist"
  | "music.radio_station"
  | "video.movie"
  | "video.episode"
  | "video.tv_show"
  | "video.other";

export interface PageMetadataOptions {
  /** Page-level title; will be truncated to ~60 chars. */
  title: string;
  /** Page-level description; truncated to ~155 chars. */
  description: string;
  /** Optional list of keywords for `<meta name="keywords">`. */
  keywords?: string[];
  /** Override the OG type (default `"website"`). */
  ogType?: OpenGraphType;
  /** Custom OG image; absolute URL or path (defaults to `brand.seo.ogImage`). */
  ogImage?: string;
  /** Custom Twitter image; absolute URL or path (defaults to `brand.seo.twitterImage`). */
  twitterImage?: string;
  /** Override the OG-card title (defaults to `title`). */
  ogTitle?: string;
  /** Override the OG-card description (defaults to `description`). */
  ogDescription?: string;
  /** Override the Twitter-card title (defaults to `title`). */
  twitterTitle?: string;
  /** Override the Twitter-card description (defaults to `description`). */
  twitterDescription?: string;
  /** When true, marks the page noindex. */
  noindex?: boolean;
  /** Optional `robots` override; takes precedence over `noindex`. */
  robots?: Metadata["robots"];
}

/**
 * Generate Next.js {@link Metadata} for a route, parameterized by a {@link BrandConfig}.
 * The canonical URL is always built from the brand's origin to prevent cross-brand leakage.
 */
export function generatePageMetadata(
  brand: BrandConfig,
  pathname: string,
  options: PageMetadataOptions,
): Metadata {
  const origin = resolveSiteOrigin(brand);
  const canonical = buildCanonicalUrl(brand, pathname);

  const cleanTitle = clampLength(options.title, META_LIMITS.titleMax);
  const cleanDescription = clampLength(options.description, META_LIMITS.descriptionMax);

  const ogImageUrl = toAbsoluteUrl(
    origin,
    options.ogImage ?? brand.seo.ogImage ?? DEFAULT_OG_PATH,
  );
  const twitterImageUrl = toAbsoluteUrl(
    origin,
    options.twitterImage ?? brand.seo.twitterImage ?? ogImageUrl,
  );

  const robots: Metadata["robots"] =
    options.robots ??
    (options.noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          "max-snippet": -1,
          "max-image-preview": "large",
          "max-video-preview": -1,
        });

  return {
    title: cleanTitle,
    description: cleanDescription,
    keywords: options.keywords ?? brand.seo.keywords,
    robots,
    openGraph: {
      title: options.ogTitle ?? cleanTitle,
      description: options.ogDescription ?? cleanDescription,
      type: options.ogType ?? "website",
      url: canonical,
      siteName: brand.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: options.ogTitle ?? cleanTitle,
        },
      ],
      locale: getBrandLocale(brand),
    },
    twitter: {
      card: "summary_large_image",
      title: options.twitterTitle ?? options.ogTitle ?? cleanTitle,
      description: options.twitterDescription ?? options.ogDescription ?? cleanDescription,
      images: [twitterImageUrl],
    },
    alternates: {
      canonical,
      languages: getLocaleAlternates(brand),
    },
  };
}

/** Designer page (e.g. /designer, /shadowbox/designer). */
export function generateDesignerMetadata(
  brand: BrandConfig,
  options: {
    designerName: string;
    frameName: string;
    subtitle: string;
    pathname?: string;
    ogImage?: string;
  },
): Metadata {
  const slug = options.designerName.toLowerCase().replace(/\s+/g, "-");
  const pathname = options.pathname ?? `/${slug}/designer`;
  const title = `${options.designerName} Designer - Design Your Perfect ${options.frameName} | ${brand.name}`;
  const description = `${options.subtitle} Choose your size, frame style, mat colors, and glazing options. See instant pricing and preview your design in real-time.`;

  return generatePageMetadata(brand, pathname, {
    title,
    description,
    ogTitle: `${options.designerName} Designer - Interactive Builder`,
    ogDescription: options.subtitle,
    ogImage: options.ogImage,
  });
}

/** Category / collection landing page. */
export function generateCategoryMetadata(
  brand: BrandConfig,
  options: {
    categoryName: string;
    description: string;
    slug: string;
    ogImage?: string;
  },
): Metadata {
  const title = `${options.categoryName} | ${brand.name}`;
  return generatePageMetadata(brand, `/${options.slug}`, {
    title,
    description: options.description,
    ogImage: options.ogImage,
  });
}

/** Product detail page (e.g. an individual frame style). */
export function generateDetailMetadata(
  brand: BrandConfig,
  options: {
    name: string;
    description: string;
    slug: string;
    ogImage?: string;
  },
): Metadata {
  const title = `${options.name} Frame - Custom Frame Designer | ${brand.name}`;
  return generatePageMetadata(brand, `/${options.slug}`, {
    title,
    description: options.description,
    ogTitle: `${options.name} Frame - Design Your Custom Frame`,
    ogImage: options.ogImage,
  });
}

/**
 * Build a meta description for a frame product page (120–155 chars before global trim).
 *
 * Mirrors the legacy `buildFrameProductMetaDescription` but is brand-aware: the
 * suffix references the brand name (instead of hard-coding "CustomFrameSizes").
 */
export function buildFrameProductMetaDescription(
  brand: BrandConfig,
  options: {
    name: string;
    shortDescription?: string | null;
    featuredDescription?: string | null;
    /** Override the prefix sentence (default tuned for picture frames). */
    prefix?: string;
  },
): string {
  const prefix =
    options.prefix ??
    "custom picture frame in any size from 4×4 to 32×40.";
  const suffix = `Instant pricing at ${brand.name}.`;
  const max = META_LIMITS.descriptionMax;
  const min = META_LIMITS.descriptionMin;

  const base = `${options.name} ${prefix}`;
  const shortT = normalizeWhitespace(options.shortDescription ?? "");
  const featT = normalizeWhitespace(options.featuredDescription ?? "");
  const tagline = stripTrailingPeriod(shortT || featT);
  const filler = "Choose dimensions, mat, and glazing.";

  const withMiddle = (middle: string) => `${base} ${middle}. ${suffix}`;
  const maxMiddleLen = max - base.length - 3 - suffix.length;

  let middle = tagline || filler;
  let desc = withMiddle(middle);

  if (desc.length < min && tagline) {
    middle = `${tagline}. ${filler}`;
    desc = withMiddle(middle);
  }

  if (desc.length > max && maxMiddleLen > 12) {
    middle = truncateTagline(middle, maxMiddleLen);
    desc = withMiddle(middle);
  }

  if (desc.length > max) {
    desc = desc.slice(0, max);
  }

  return desc;
}

/** Public re-export so callers don't need to import from `@framecraft/seo/internal/*`. */
export const getCanonicalUrl = buildCanonicalUrl;

/** Resolve OG image URL with optional override. */
export function getOgImage(brand: BrandConfig, override?: string): string {
  const origin = resolveSiteOrigin(brand);
  const target = override ?? brand.seo.ogImage ?? DEFAULT_OG_PATH;
  return toAbsoluteUrl(origin, target);
}

/** Resolve Twitter image URL with optional override. */
export function getTwitterImage(brand: BrandConfig, override?: string): string {
  const origin = resolveSiteOrigin(brand);
  const target = override ?? brand.seo.twitterImage ?? brand.seo.ogImage ?? DEFAULT_TWITTER_PATH;
  return toAbsoluteUrl(origin, target);
}

/* ------------------------------------------------------------------------- */
/*   Internal helpers                                                         */
/* ------------------------------------------------------------------------- */

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function stripTrailingPeriod(value: string): string {
  return value.endsWith(".") ? value.slice(0, -1).trimEnd() : value;
}

function truncateTagline(tagline: string, maxLen: number): string {
  if (tagline.length <= maxLen) return tagline;
  const slice = tagline.slice(0, Math.max(0, maxLen - 1)).trimEnd();
  const lastSpace = slice.lastIndexOf(" ");
  if (lastSpace > maxLen * 0.45) return `${slice.slice(0, lastSpace)}…`;
  return `${slice}…`;
}

function clampLength(value: string, maxLen: number): string {
  return value.length <= maxLen ? value : value.slice(0, maxLen);
}

function getBrandLocale(brand: BrandConfig): string {
  const meta = brand.metadata as Record<string, unknown> | undefined;
  const candidate = meta?.locale;
  return typeof candidate === "string" && candidate.length > 0 ? candidate : "en_US";
}

function getLocaleAlternates(
  brand: BrandConfig,
): Record<string, string> | undefined {
  const meta = brand.metadata as Record<string, unknown> | undefined;
  const alternates = meta?.localeAlternates;
  if (!alternates || typeof alternates !== "object") {
    return undefined;
  }
  const entries = Object.entries(alternates as Record<string, unknown>).filter(
    ([, value]) => typeof value === "string" && value.length > 0,
  ) as [string, string][];
  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries);
}
