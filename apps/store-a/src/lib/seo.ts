/**
 * SEO Metadata Utilities
 * Provides consistent metadata generation across all pages
 */

import { env } from "./env";

import type { Metadata } from "next";

const FRAME_META_PREFIX = "custom picture frame in any size from 4×4 to 32×40.";
const FRAME_META_SUFFIX = "Instant pricing at CustomFrameSizes.com.";
/** Align with generateMetadata description cap (155) and plan target 120–160. */
const FRAME_META_MAX = 155;
const FRAME_META_MIN = 120;

function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function stripTrailingPeriod(s: string): string {
  return s.endsWith(".") ? s.slice(0, -1).trimEnd() : s;
}

function truncateTagline(tagline: string, maxLen: number): string {
  if (tagline.length <= maxLen) return tagline;
  const slice = tagline.slice(0, Math.max(0, maxLen - 1)).trimEnd();
  const lastSpace = slice.lastIndexOf(" ");
  if (lastSpace > maxLen * 0.45) return `${slice.slice(0, lastSpace)}…`;
  return `${slice}…`;
}

/**
 * Meta description for picture-frame product pages (120–155 chars before global trim).
 * @see docs/CFS_PRELAUNCH_FIXES_PLAN.md P1 #12
 */
export function buildFrameProductMetaDescription({
  name,
  shortDescription,
  featuredDescription,
}: {
  name: string;
  shortDescription?: string | null;
  featuredDescription?: string | null;
}): string {
  const base = `${name} ${FRAME_META_PREFIX}`;
  const shortT = normalizeWhitespace(shortDescription || "");
  const featT = normalizeWhitespace(featuredDescription || "");
  const tagline = stripTrailingPeriod(shortT || featT);
  const filler = "Choose dimensions, mat, and glazing.";

  const withMiddle = (middle: string) => `${base} ${middle}. ${FRAME_META_SUFFIX}`;
  const maxMiddleLen = FRAME_META_MAX - base.length - 3 - FRAME_META_SUFFIX.length;

  let middle = tagline || filler;
  let desc = withMiddle(middle);

  if (desc.length < FRAME_META_MIN && tagline) {
    middle = `${tagline}. ${filler}`;
    desc = withMiddle(middle);
  }

  if (desc.length > FRAME_META_MAX && maxMiddleLen > 12) {
    middle = truncateTagline(middle, maxMiddleLen);
    desc = withMiddle(middle);
  }

  if (desc.length > FRAME_META_MAX) {
    desc = desc.slice(0, FRAME_META_MAX);
  }

  return desc;
}

const SITE_DOMAIN = env.shopify.storeDomain || "www.customframesizes.com";
const SITE_URL = `https://${SITE_DOMAIN}`;
/** Public site origin (https + hostname); use for sitemap, robots, and JSON-LD fallbacks */
export const siteUrl = SITE_URL;
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

/**
 * Organization Schema
 * Centralized organization data for all pages
 */
export interface OrganizationSchemaProps {
  name?: string;
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  socialProfiles?: string[];
  logo?: string;
}

export function generateOrganizationSchema({
  name = "CustomFrameSizes",
  description = "Custom picture frames, mats, and specialty framing solutions for any size and style.",
  contactPhone,
  contactEmail,
  socialProfiles = [
    "https://www.facebook.com/customframesizes",
    "https://www.instagram.com/customframesizes",
    "https://www.pinterest.com/customframesizes",
  ],
  logo = OG_IMAGE,
}: OrganizationSchemaProps = {}): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    description,
    url: SITE_URL,
    logo,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: contactPhone,
      email: contactEmail,
      contactType: "Customer Service",
    },
    sameAs: socialProfiles,
  });
}

/**
 * Product Schema
 * Used for designer pages and product detail pages
 */
export interface ProductSchemaProps {
  name: string;
  description: string;
  brand?: string;
  lowPrice?: number;
  highPrice?: number;
  priceCurrency?: string;
  priceValidUntil?: string;
  availability?:
    | "https://schema.org/InStock"
    | "https://schema.org/OutOfStock"
    | "https://schema.org/PreOrder";
  ratingValue?: number;
  reviewCount?: number;
  image?: string;
  url?: string;
  material?: string;
  additionalProperties?: Array<{ name: string; value: string }>;
}

export function generateProductSchema({
  name,
  description,
  brand = "CustomFrameSizes",
  lowPrice = 25,
  highPrice = 500,
  priceCurrency = "USD",
  priceValidUntil,
  availability = "https://schema.org/InStock",
  ratingValue,
  reviewCount,
  image,
  url,
  material,
  additionalProperties = [],
}: ProductSchemaProps): string {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency,
      lowPrice,
      highPrice,
      availability,
    },
  };

  if (priceValidUntil) {
    const currentOffers = schema.offers as Record<string, unknown>;
    schema.offers = {
      ...currentOffers,
      priceValidUntil,
    };
  }

  if (image) {
    schema.image = image;
  }

  if (url) {
    schema.url = url;
  }

  if (material) {
    schema.material = material;
  }

  if (ratingValue && reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: ratingValue.toString(),
      reviewCount: reviewCount.toString(),
    };
  }

  if (additionalProperties.length > 0) {
    schema.additionalProperty = additionalProperties.map((prop) => ({
      "@type": "PropertyValue",
      name: prop.name,
      value: prop.value,
    }));
  }

  return JSON.stringify(schema);
}

/**
 * BreadcrumbList Schema
 * For category and detail pages
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

/**
 * FAQ Schema
 * For FAQ pages
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(items: FAQItem[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });
}

/**
 * WebSite Schema
 * For site-wide search configuration
 */
export function generateWebsiteSchema(
  searchUrl: string = `${SITE_URL}/picture-frames?search={search_term_string}`,
): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CustomFrameSizes",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: searchUrl,
      },
      "query-input": "required name=search_term_string",
    },
  });
}
