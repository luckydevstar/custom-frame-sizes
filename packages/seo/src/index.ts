/**
 * @framecraft/seo
 *
 * Brand-aware SEO helpers for FrameCraft storefronts. The package is pure
 * TypeScript (no React) and intentionally has zero hardcoded brand strings:
 * every helper is parameterized by a {@link BrandConfig}, so adding new stores
 * is just a matter of creating a new config object.
 *
 * Typical usage in an app:
 *
 * ```ts
 * // apps/<store>/src/lib/seo.ts
 * import { createSeo } from "@framecraft/seo";
 * import { brandConfig } from "../brand.config";
 *
 * export const seo = createSeo(brandConfig);
 * ```
 *
 * Then in pages:
 *
 * ```ts
 * import { seo } from "@/lib/seo";
 * export const metadata = seo.pageMetadata("/about", { title, description });
 * ```
 *
 * @packageDocumentation
 */

export { createSeo } from "./factory";
export type { BrandSeo } from "./factory";

// Metadata helpers (also exposed as standalone for tests / advanced use)
export {
  buildFrameProductMetaDescription,
  generateCategoryMetadata,
  generateDesignerMetadata,
  generateDetailMetadata,
  generatePageMetadata,
  getCanonicalUrl,
  getOgImage,
  getTwitterImage,
} from "./metadata";
export type { OpenGraphType, PageMetadataOptions } from "./metadata";

// Schemas
export {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  localBusinessSchema,
  organizationSchema,
  productSchema,
  websiteSchema,
} from "./schemas";
export type {
  BreadcrumbItem,
  FAQItem,
  ItemListEntry,
  JsonLdSchema,
  LocalBusinessOptions,
  OrganizationSchemaOptions,
  ProductSchemaOptions,
  WebsiteSchemaOptions,
} from "./schemas";

// Metadata routes
export { createManifest, createRobots, createSitemap } from "./routes";
export type {
  ChangeFreq,
  ManifestOptions,
  RobotsOptions,
  SitemapEntryInput,
  SitemapOptions,
} from "./routes";

// Preconnect helpers
export { SHARED_PRECONNECT_TARGETS, buildPreconnectLinks } from "./preconnect";
export type { PreconnectTarget } from "./preconnect";

// Internal (re-exported for convenience)
export { resolveSiteOrigin } from "./internal/origin";
export { DEFAULT_OG_PATH } from "./internal/constants";
