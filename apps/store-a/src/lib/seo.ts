/**
 * SEO Metadata Utilities
 * Provides consistent metadata generation across all pages
 */

import type { Metadata } from "next";
import { env } from "./env";

const SITE_DOMAIN = env.shopify.storeDomain || "store-a.example.com";
const SITE_URL = `https://${SITE_DOMAIN}`;
const OG_IMAGE = `${SITE_URL}/assets/og-image.jpg`;
const TWITTER_IMAGE = `${SITE_URL}/assets/twitter-image.jpg`;

/**
 * Generate complete metadata for a page
 * Ensures consistent title, description, OG, Twitter, and canonical format
 */
export function generateMetadata({
  title,
  description,
  canonical,
  ogImage = OG_IMAGE,
  twitterImage = TWITTER_IMAGE,
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
  type = "website",
  noindex = false,
}: {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  twitterImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  type?: "website" | "article";
  noindex?: boolean;
}): Metadata {
  // Ensure title and description are within optimal lengths
  const cleanTitle = title.substring(0, 60);
  const cleanDescription = description.substring(0, 155);

  return {
    title: cleanTitle,
    description: cleanDescription,
    robots: {
      index: !noindex,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    openGraph: {
      title: ogTitle || cleanTitle,
      description: ogDescription || cleanDescription,
      type: type as "website" | "article",
      url: canonical,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle || cleanTitle,
        },
      ],
      siteName: "CustomFrameSizes",
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle || cleanTitle,
      description: twitterDescription || cleanDescription,
      images: [twitterImage],
      creator: "@CustomFrameSizes",
    },
    alternates: {
      canonical,
    },
  };
}

/**
 * Designer page metadata
 * Used for frame designer, mat designer, shadowbox designer, etc.
 */
export function generateDesignerMetadata({
  designerName,
  frameName,
  subtitle,
}: {
  designerName: string;
  frameName: string;
  subtitle: string;
}): Metadata {
  const title = `${designerName} Designer - Design Your Perfect ${frameName} | CustomFrameSizes.com`;
  const description = `${subtitle} Choose your size, frame style, mat colors, and glazing options. See instant pricing and preview your design in real-time.`;

  return generateMetadata({
    title,
    description,
    canonical: `${SITE_URL}/${designerName.toLowerCase().replace(/\s+/g, "-")}/designer`,
    ogTitle: `${designerName} Designer - Interactive Builder`,
    ogDescription: subtitle,
  });
}

/**
 * Category/listing page metadata
 */
export function generateCategoryMetadata({
  categoryName,
  description,
  slug,
}: {
  categoryName: string;
  description: string;
  slug: string;
}): Metadata {
  const title = `${categoryName} | CustomFrameSizes.com`;

  return generateMetadata({
    title,
    description,
    canonical: `${SITE_URL}/${slug}`,
  });
}

/**
 * Detail page metadata (e.g., frame style detail)
 */
export function generateDetailMetadata({
  name,
  description,
  slug,
  ogImage,
}: {
  name: string;
  description: string;
  slug: string;
  ogImage?: string;
}): Metadata {
  const title = `${name} Frame - Custom Frame Designer | CustomFrameSizes.com`;

  return generateMetadata({
    title,
    description,
    canonical: `${SITE_URL}/${slug}`,
    ogImage: ogImage || OG_IMAGE,
    ogTitle: `${name} Frame - Design Your Custom Frame`,
  });
}

/**
 * Get canonical URL for a route
 */
export function getCanonicalUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Get OG image URL with optional fallback
 */
export function getOgImage(customImage?: string): string {
  return customImage || OG_IMAGE;
}
