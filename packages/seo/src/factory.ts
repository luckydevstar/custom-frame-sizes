/**
 * `createSeo(brand)` returns a brand-bound facade over all helpers in this
 * package. Apps typically call this once (e.g. in `apps/<store>/src/lib/seo.ts`)
 * and re-export the resulting object so page modules don't have to thread
 * `brandConfig` through every helper.
 */

import type { BrandConfig } from "@framecraft/config";
import type { Metadata, MetadataRoute } from "next";

import { resolveSiteOrigin } from "./internal/origin";
import {
  buildFrameProductMetaDescription,
  generateCategoryMetadata,
  generateDesignerMetadata,
  generateDetailMetadata,
  generatePageMetadata,
  getCanonicalUrl,
  getOgImage,
  getTwitterImage,
  type PageMetadataOptions,
} from "./metadata";
import { type PreconnectTarget, buildPreconnectLinks } from "./preconnect";
import {
  type ManifestOptions,
  type RobotsOptions,
  type SitemapOptions,
  createManifest,
  createRobots,
  createSitemap,
} from "./routes";
import {
  type BreadcrumbItem,
  type FAQItem,
  type ItemListEntry,
  type LocalBusinessOptions,
  type OrganizationSchemaOptions,
  type ProductSchemaOptions,
  type WebsiteSchemaOptions,
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  localBusinessSchema,
  organizationSchema,
  productSchema,
  websiteSchema,
} from "./schemas";

export interface BrandSeo {
  /** Resolved origin (no trailing slash). */
  readonly siteOrigin: string;
  /** The underlying brand config (read-only). */
  readonly brand: BrandConfig;

  /** Canonical URL for `pathname`. */
  canonical(pathname: string): string;
  /** Resolve OG image URL with optional override. */
  ogImage(override?: string): string;
  /** Resolve Twitter image URL with optional override. */
  twitterImage(override?: string): string;

  pageMetadata(pathname: string, options: PageMetadataOptions): Metadata;
  designerMetadata(options: Parameters<typeof generateDesignerMetadata>[1]): Metadata;
  categoryMetadata(options: Parameters<typeof generateCategoryMetadata>[1]): Metadata;
  detailMetadata(options: Parameters<typeof generateDetailMetadata>[1]): Metadata;
  productMetaDescription(options: Parameters<typeof buildFrameProductMetaDescription>[1]): string;

  organizationSchema(options?: OrganizationSchemaOptions): Record<string, unknown>;
  websiteSchema(options?: WebsiteSchemaOptions): Record<string, unknown>;
  productSchema(options: ProductSchemaOptions): Record<string, unknown>;
  breadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown>;
  faqSchema(items: FAQItem[]): Record<string, unknown>;
  itemListSchema(items: ItemListEntry[], options?: { listName?: string }): Record<string, unknown>;
  localBusinessSchema(options?: LocalBusinessOptions): Record<string, unknown>;

  sitemap(options: SitemapOptions): MetadataRoute.Sitemap;
  robots(options?: RobotsOptions): MetadataRoute.Robots;
  manifest(options?: ManifestOptions): MetadataRoute.Manifest;
  preconnectTargets(extra?: PreconnectTarget[]): PreconnectTarget[];
}

/** Bind every helper in this package to a single {@link BrandConfig}. */
export function createSeo(brand: BrandConfig): BrandSeo {
  const siteOrigin = resolveSiteOrigin(brand);

  return {
    siteOrigin,
    brand,

    canonical: (pathname) => getCanonicalUrl(brand, pathname),
    ogImage: (override) => getOgImage(brand, override),
    twitterImage: (override) => getTwitterImage(brand, override),

    pageMetadata: (pathname, options) => generatePageMetadata(brand, pathname, options),
    designerMetadata: (options) => generateDesignerMetadata(brand, options),
    categoryMetadata: (options) => generateCategoryMetadata(brand, options),
    detailMetadata: (options) => generateDetailMetadata(brand, options),
    productMetaDescription: (options) => buildFrameProductMetaDescription(brand, options),

    organizationSchema: (options) => organizationSchema(brand, options),
    websiteSchema: (options) => websiteSchema(brand, options),
    productSchema: (options) => productSchema(brand, options),
    breadcrumbSchema: (items) => breadcrumbSchema(brand, items),
    faqSchema: (items) => faqSchema(items),
    itemListSchema: (items, options) => itemListSchema(brand, items, options),
    localBusinessSchema: (options) => localBusinessSchema(brand, options),

    sitemap: (options) => createSitemap(brand, options),
    robots: (options) => createRobots(brand, options),
    manifest: (options) => createManifest(brand, options),
    preconnectTargets: (extra) => buildPreconnectLinks(extra),
  };
}
