/**
 * Store-A SEO facade.
 *
 * Thin wrapper around `@framecraft/seo`, bound to this app's `brandConfig`.
 * The legacy export surface (`generateMetadata`, `generateOrganizationSchema`,
 * etc.) is preserved so all existing page modules keep compiling. New code
 * should prefer `import { seo } from "@/lib/seo"` and use the bound facade.
 */

import {
  buildFrameProductMetaDescription as sharedBuildFrameProductMetaDescription,
  createSeo,
  generateCategoryMetadata as sharedGenerateCategoryMetadata,
  generateDesignerMetadata as sharedGenerateDesignerMetadata,
  generateDetailMetadata as sharedGenerateDetailMetadata,
  generatePageMetadata as sharedGeneratePageMetadata,
} from "@framecraft/seo";

import { brandConfig } from "../brand.config";

import type { Metadata } from "next";

/** Brand-bound SEO facade for store-a. */
export const seo = createSeo(brandConfig);

/** Public site origin (no trailing slash). */
export const siteUrl = seo.siteOrigin;

/* ------------------------------------------------------------------------- */
/*   Legacy `generateMetadata({ canonical, ... })` shim                       */
/* ------------------------------------------------------------------------- */

/**
 * Legacy helper from the original store-a `lib/seo.ts`. Now delegates to
 * `@framecraft/seo.generatePageMetadata` while keeping the historical
 * `{ canonical }` argument shape for backward compatibility.
 */
export function generateMetadata({
  title,
  description,
  canonical,
  ogImage,
  twitterImage,
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
  return sharedGeneratePageMetadata(brandConfig, canonicalToPathname(canonical), {
    title,
    description,
    ogImage,
    twitterImage,
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
    ogType: type,
    noindex,
  });
}

export const generatePageMetadata = (...args: Parameters<typeof sharedGeneratePageMetadata>) =>
  sharedGeneratePageMetadata(...args);

export function generateDesignerMetadata(args: {
  designerName: string;
  frameName: string;
  subtitle: string;
}): Metadata {
  return sharedGenerateDesignerMetadata(brandConfig, args);
}

export function generateCategoryMetadata(args: {
  categoryName: string;
  description: string;
  slug: string;
}): Metadata {
  return sharedGenerateCategoryMetadata(brandConfig, args);
}

export function generateDetailMetadata(args: {
  name: string;
  description: string;
  slug: string;
  ogImage?: string;
}): Metadata {
  return sharedGenerateDetailMetadata(brandConfig, args);
}

export function buildFrameProductMetaDescription(args: {
  name: string;
  shortDescription?: string | null;
  featuredDescription?: string | null;
}): string {
  return sharedBuildFrameProductMetaDescription(brandConfig, args);
}

/** Canonical URL helper bound to this app. */
export function getCanonicalUrl(path: string): string {
  return seo.canonical(path);
}

/** OG image URL helper bound to this app. */
export function getOgImage(customImage?: string): string {
  return seo.ogImage(customImage);
}

/* ------------------------------------------------------------------------- */
/*   Legacy schema generators (return JSON strings — preserved API)           */
/* ------------------------------------------------------------------------- */

export interface OrganizationSchemaProps {
  name?: string;
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  socialProfiles?: string[];
  logo?: string;
}

export function generateOrganizationSchema(props: OrganizationSchemaProps = {}): string {
  return JSON.stringify(
    seo.organizationSchema({
      description: props.description,
      logo: props.logo,
      socialProfiles: props.socialProfiles,
    }),
  );
}

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

export function generateProductSchema(props: ProductSchemaProps): string {
  return JSON.stringify(
    seo.productSchema({
      ...props,
      brandName: props.brand,
    }),
  );
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): string {
  return JSON.stringify(seo.breadcrumbSchema(items));
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(items: FAQItem[]): string {
  return JSON.stringify(seo.faqSchema(items));
}

export function generateWebsiteSchema(searchUrl?: string): string {
  return JSON.stringify(seo.websiteSchema({ searchUrlTemplate: searchUrl }));
}

/* ------------------------------------------------------------------------- */
/*   Internal                                                                 */
/* ------------------------------------------------------------------------- */

function canonicalToPathname(canonical: string): string {
  if (canonical.startsWith("/")) return canonical;
  try {
    const url = new URL(canonical);
    return url.pathname || "/";
  } catch {
    return "/";
  }
}
