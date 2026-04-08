/**
 * Brand Attribute Utilities
 * 
 * Helper functions for managing the _brand attribute on Shopify carts.
 * Used for multi-brand checkout branding.
 * 
 * @packageDocumentation
 */

import type { ShopifyAttribute } from "./serialization";

/**
 * Store/brand identifier
 */
export type BrandIdentifier = "CFS" | "CAH" | string;

/**
 * Create a brand attribute for cart operations
 * 
 * @param brand - Brand identifier (e.g., "CFS", "CAH")
 * @returns Brand attribute object
 * 
 * @example
 * ```typescript
 * const brandAttr = createBrandAttribute("CFS");
 * // { key: "_brand", value: "CFS" }
 * ```
 */
export function createBrandAttribute(brand: BrandIdentifier): ShopifyAttribute {
  return {
    key: "_brand",
    value: brand,
  };
}

/**
 * Get brand from store domain
 * 
 * Maps a Shopify domain to a brand identifier.
 * Used to automatically determine brand when creating carts.
 * 
 * @param domain - Shopify domain (e.g., "store-a.myshopify.com")
 * @returns Brand identifier
 * 
 * @example
 * ```typescript
 * const brand = getBrandFromDomain("store-a.myshopify.com");
 * // "CFS"
 * ```
 */
export function getBrandFromDomain(domain?: string): BrandIdentifier {
  if (!domain) return "CFS";

  // Map domains to brands
  const brandMap: Record<string, BrandIdentifier> = {
    "store-a": "CFS",
    "store-b": "CAH",
    "customframesizes": "CFS",
    "countryarthouse": "CAH",
  };

  // Check exact matches first
  for (const [key, brand] of Object.entries(brandMap)) {
    if (domain.includes(key)) {
      return brand;
    }
  }

  // Default to CFS if no match
  return "CFS";
}

/**
 * Get brand from environment
 * 
 * Reads the NEXT_PUBLIC_BRAND_ID environment variable
 * or determines it from the store domain.
 * 
 * @returns Brand identifier
 */
export function getBrandIdentifier(): BrandIdentifier {
  if (typeof window !== "undefined") {
    // Client-side: use window.location or process.env
    const envBrand = (process.env.NEXT_PUBLIC_BRAND_ID as BrandIdentifier) || undefined;
    if (envBrand) return envBrand;

    // Try to extract from window.location.hostname
    const hostname = window.location.hostname;
    return getBrandFromDomain(hostname);
  }

  // Server-side: use process.env or provided domain
  const envBrand = (process.env.NEXT_PUBLIC_BRAND_ID as BrandIdentifier) || undefined;
  if (envBrand) return envBrand;

  const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  return getBrandFromDomain(domain);
}
