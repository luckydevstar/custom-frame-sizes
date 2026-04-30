/**
 * Brand-aware schema.org JSON-LD generators.
 *
 * Every helper accepts a {@link BrandConfig} (or pre-built data) and returns a plain
 * object matching schema.org's JSON-LD shape. Use `<JsonLd schemas={[...]} />`
 * (from `@framecraft/ui`) to render them.
 */

import type { BrandConfig } from "@framecraft/config";

import { resolveSiteOrigin, toAbsoluteUrl } from "../internal/origin";

/** Generic JSON-LD payload. */
export type JsonLdSchema = Record<string, unknown>;

/* ------------------------------------------------------------------------- */
/*   Organization                                                             */
/* ------------------------------------------------------------------------- */

export interface OrganizationSchemaOptions {
  /** Override the description (defaults to brand seo.description). */
  description?: string;
  /** Override the logo URL (defaults to brand seo.ogImage). */
  logo?: string;
  /** Optional sameAs profile URLs. */
  socialProfiles?: string[];
}

/**
 * Build an Organization JSON-LD object for the brand. Pulls contact info from
 * `brand.metadata.contactPhone` / `contactEmail` and social profiles from
 * `brand.metadata.socialProfiles`.
 */
export function organizationSchema(
  brand: BrandConfig,
  options: OrganizationSchemaOptions = {},
): JsonLdSchema {
  const origin = resolveSiteOrigin(brand);
  const meta = (brand.metadata ?? {}) as Record<string, unknown>;
  const contactPhone = typeof meta.contactPhone === "string" ? meta.contactPhone : undefined;
  const contactEmail = typeof meta.contactEmail === "string" ? meta.contactEmail : undefined;
  const profiles =
    options.socialProfiles ??
    (Array.isArray(meta.socialProfiles)
      ? (meta.socialProfiles as string[]).filter((s) => typeof s === "string")
      : []);

  const schema: JsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: origin,
    description: options.description ?? brand.seo.description,
    logo: toAbsoluteUrl(origin, options.logo ?? brand.seo.ogImage ?? "/assets/og-image.jpg"),
  };

  if (contactPhone || contactEmail) {
    schema.contactPoint = {
      "@type": "ContactPoint",
      ...(contactPhone ? { telephone: contactPhone } : {}),
      ...(contactEmail ? { email: contactEmail } : {}),
      contactType: "Customer Service",
    };
  }

  if (profiles.length > 0) {
    schema.sameAs = profiles;
  }

  return schema;
}

/* ------------------------------------------------------------------------- */
/*   WebSite                                                                  */
/* ------------------------------------------------------------------------- */

export interface WebsiteSchemaOptions {
  /**
   * URL template for the SearchAction `target`. Use `{search_term_string}` as a
   * placeholder. Defaults to `${origin}/picture-frames?search={search_term_string}`.
   */
  searchUrlTemplate?: string;
}

export function websiteSchema(
  brand: BrandConfig,
  options: WebsiteSchemaOptions = {},
): JsonLdSchema {
  const origin = resolveSiteOrigin(brand);
  const target =
    options.searchUrlTemplate ?? `${origin}/picture-frames?search={search_term_string}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.name,
    url: origin,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: target,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/* ------------------------------------------------------------------------- */
/*   Product (AggregateOffer)                                                 */
/* ------------------------------------------------------------------------- */

export interface ProductSchemaOptions {
  name: string;
  description: string;
  brandName?: string;
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
  /** Image absolute URL or path; resolved against the brand origin. */
  image?: string;
  /** Page URL absolute or path; resolved against the brand origin. */
  url?: string;
  material?: string;
  additionalProperties?: Array<{ name: string; value: string }>;
}

export function productSchema(
  brand: BrandConfig,
  options: ProductSchemaOptions,
): JsonLdSchema {
  const origin = resolveSiteOrigin(brand);
  const schema: JsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: options.name,
    description: options.description,
    brand: {
      "@type": "Brand",
      name: options.brandName ?? brand.name,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: options.priceCurrency ?? "USD",
      lowPrice: options.lowPrice ?? 25,
      highPrice: options.highPrice ?? 500,
      availability: options.availability ?? "https://schema.org/InStock",
      ...(options.priceValidUntil ? { priceValidUntil: options.priceValidUntil } : {}),
    },
  };

  if (options.image) schema.image = toAbsoluteUrl(origin, options.image);
  if (options.url) schema.url = toAbsoluteUrl(origin, options.url);
  if (options.material) schema.material = options.material;
  if (options.ratingValue && options.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: options.ratingValue.toString(),
      reviewCount: options.reviewCount.toString(),
    };
  }
  if (options.additionalProperties && options.additionalProperties.length > 0) {
    schema.additionalProperty = options.additionalProperties.map((prop) => ({
      "@type": "PropertyValue",
      name: prop.name,
      value: prop.value,
    }));
  }

  return schema;
}

/* ------------------------------------------------------------------------- */
/*   BreadcrumbList                                                           */
/* ------------------------------------------------------------------------- */

export interface BreadcrumbItem {
  name: string;
  /** Absolute or relative URL. */
  url: string;
}

export function breadcrumbSchema(
  brand: BrandConfig,
  items: BreadcrumbItem[],
): JsonLdSchema {
  const origin = resolveSiteOrigin(brand);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(origin, item.url),
    })),
  };
}

/* ------------------------------------------------------------------------- */
/*   FAQPage                                                                  */
/* ------------------------------------------------------------------------- */

export interface FAQItem {
  question: string;
  answer: string;
}

export function faqSchema(items: FAQItem[]): JsonLdSchema {
  return {
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
  };
}

/* ------------------------------------------------------------------------- */
/*   ItemList / CollectionPage                                                */
/* ------------------------------------------------------------------------- */

export interface ItemListEntry {
  name: string;
  /** Absolute or relative URL. */
  url: string;
  /** Optional image absolute URL or path. */
  image?: string;
}

/**
 * Build an `ItemList` JSON-LD payload for category/listing pages so SERPs can
 * render rich list previews of products. Limit is 100 by schema.org spec.
 */
export function itemListSchema(
  brand: BrandConfig,
  items: ItemListEntry[],
  options: { listName?: string } = {},
): JsonLdSchema {
  const origin = resolveSiteOrigin(brand);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    ...(options.listName ? { name: options.listName } : {}),
    numberOfItems: items.length,
    itemListElement: items.slice(0, 100).map((entry, index) => {
      const item: JsonLdSchema = {
        "@type": "ListItem",
        position: index + 1,
        name: entry.name,
        url: toAbsoluteUrl(origin, entry.url),
      };
      if (entry.image) {
        item.image = toAbsoluteUrl(origin, entry.image);
      }
      return item;
    }),
  };
}

/* ------------------------------------------------------------------------- */
/*   LocalBusiness                                                            */
/* ------------------------------------------------------------------------- */

export interface LocalBusinessOptions {
  /** Telephone (defaults to `metadata.contactPhone`). */
  telephone?: string;
  /** Email (defaults to `metadata.contactEmail`). */
  email?: string;
  /** Optional address fields. */
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  /** Optional geo coordinates. */
  geo?: { latitude: number; longitude: number };
  /** OpeningHoursSpecification entries. */
  openingHours?: string[];
}

export function localBusinessSchema(
  brand: BrandConfig,
  options: LocalBusinessOptions = {},
): JsonLdSchema {
  const origin = resolveSiteOrigin(brand);
  const meta = (brand.metadata ?? {}) as Record<string, unknown>;
  const telephone = options.telephone ?? (typeof meta.contactPhone === "string" ? meta.contactPhone : undefined);
  const email = options.email ?? (typeof meta.contactEmail === "string" ? meta.contactEmail : undefined);

  const schema: JsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: brand.name,
    url: origin,
    image: toAbsoluteUrl(origin, brand.seo.ogImage ?? "/assets/og-image.jpg"),
  };

  if (telephone) schema.telephone = telephone;
  if (email) schema.email = email;
  if (options.address) {
    schema.address = { "@type": "PostalAddress", ...options.address };
  }
  if (options.geo) {
    schema.geo = { "@type": "GeoCoordinates", ...options.geo };
  }
  if (options.openingHours && options.openingHours.length > 0) {
    schema.openingHours = options.openingHours;
  }

  return schema;
}
