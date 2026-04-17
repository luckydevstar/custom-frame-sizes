/**
 * SEO Metadata Utilities
 *
 * Helpers for generating proper page-specific canonical URLs and metadata
 */

import type { Metadata } from "next";

/** Open Graph `type` values accepted by Next.js `Metadata.openGraph` */
type OpenGraphType =
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

export function getCanonicalUrl(pathname: string, domain: string = "https://www.customframesizes.com"): string {
  // Ensure pathname starts with /
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  // Remove trailing slash except for root
  const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");
  return `${domain}${normalizedPath}`;
}

/**
 * Generate page metadata with proper canonical URL
 */
const DEFAULT_OG_PATH = "/assets/og-image.jpg";

export function generatePageMetadata(
  pathname: string,
  {
    title,
    description,
    ogType = "website",
    keywords,
    domain = "https://www.customframesizes.com",
    ogImage,
    twitterImage,
    robots,
  }: {
    title: string;
    description: string;
    ogType?: OpenGraphType;
    keywords?: string[];
    domain?: string;
    /** Absolute URL or path starting with / — defaults to /assets/og-image.jpg on domain */
    ogImage?: string;
    twitterImage?: string;
    robots?: Metadata["robots"];
  }
): Metadata {
  const canonical = getCanonicalUrl(pathname, domain);
  const ogUrl =
    ogImage == null
      ? `${domain}${DEFAULT_OG_PATH}`
      : ogImage.startsWith("http")
        ? ogImage
        : `${domain}${ogImage.startsWith("/") ? ogImage : DEFAULT_OG_PATH}`;
  const twUrl =
    twitterImage && twitterImage.startsWith("http")
      ? twitterImage
      : twitterImage?.startsWith("/")
        ? `${domain}${twitterImage}`
        : ogUrl;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: ogType,
      url: canonical,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [twUrl],
    },
    alternates: {
      canonical,
    },
    ...(robots ? { robots } : {}),
  };
}
