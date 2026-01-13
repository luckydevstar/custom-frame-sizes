/**
 * Brand Configuration Validation Schema
 *
 * Zod schemas for validating brand/store configurations at runtime.
 */

import { z } from "zod";

/**
 * HSL color schema (format: "h s% l%")
 */
const hslColorSchema = z.string().regex(/^\d+\s+\d+%\s+\d+%$/, "Invalid HSL format");

/**
 * Theme override schema
 */
const themeOverrideSchema = z.object({
  colors: z
    .object({
      primary: hslColorSchema.optional(),
      primaryForeground: hslColorSchema.optional(),
      secondary: hslColorSchema.optional(),
      secondaryForeground: hslColorSchema.optional(),
      accent: hslColorSchema.optional(),
      accentForeground: hslColorSchema.optional(),
      background: hslColorSchema.optional(),
      foreground: hslColorSchema.optional(),
      card: hslColorSchema.optional(),
      cardForeground: hslColorSchema.optional(),
      muted: hslColorSchema.optional(),
      mutedForeground: hslColorSchema.optional(),
      destructive: hslColorSchema.optional(),
      destructiveForeground: hslColorSchema.optional(),
      border: hslColorSchema.optional(),
      input: hslColorSchema.optional(),
      ring: hslColorSchema.optional(),
    })
    .optional(),
  typography: z
    .object({
      fonts: z
        .object({
          heading: z.string().optional(),
          body: z.string().optional(),
          accent: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  spacing: z.record(z.string()).optional(),
  layout: z.record(z.unknown()).optional(),
  brandColors: z
    .object({
      primary: z.string().optional(),
      secondary: z.string().optional(),
      accent: z.string().optional(),
    })
    .optional(),
  logo: z
    .object({
      src: z.string().url("Logo src must be a valid URL"),
      alt: z.string().min(1, "Logo alt text is required"),
      width: z.string().optional(),
      height: z.string().optional(),
    })
    .optional(),
});

/**
 * Component overrides schema
 */
const componentOverridesSchema = z.record(z.string(), z.string());

/**
 * Navigation override schema
 */
const navigationOverrideSchema = z.object({
  mainNav: z.record(z.unknown()).optional(),
  footerNav: z.record(z.unknown()).optional(),
  customItems: z.array(z.unknown()).optional(),
});

/**
 * SEO configuration schema
 */
const seoConfigSchema = z.object({
  title: z.string().min(1, "SEO title is required"),
  description: z.string().min(1, "SEO description is required"),
  keywords: z.array(z.string()).optional(),
  ogImage: z.string().url("OG image must be a valid URL").optional(),
  twitterImage: z.string().url("Twitter image must be a valid URL").optional(),
  canonicalUrl: z.string().url("Canonical URL must be a valid URL").optional(),
});

/**
 * Shopify configuration schema
 */
const shopifyConfigSchema = z.object({
  domain: z.string().min(1, "Shopify domain is required"),
  storefrontAccessToken: z.string().min(1, "Storefront access token is required"),
  apiVersion: z.string().optional(),
});

/**
 * Branding schema
 */
const brandingSchema = z.object({
  tagline: z.string().optional(),
  valueProposition: z.string().optional(),
  targetAudience: z.string().optional(),
});

/**
 * Complete brand configuration schema
 */
export const brandConfigSchema = z.object({
  storeId: z.string().min(1, "Store ID is required"),
  name: z.string().min(1, "Store name is required"),
  domain: z.string().min(1, "Store domain is required"),
  shopify: shopifyConfigSchema,
  theme: themeOverrideSchema.optional(),
  features: z.record(z.boolean()).optional(),
  navigation: navigationOverrideSchema.optional(),
  componentOverrides: componentOverridesSchema.optional(),
  seo: seoConfigSchema,
  branding: brandingSchema.optional(),
  metadata: z
    .object({
      isActive: z.boolean().optional(),
      createdAt: z.string().optional(),
      updatedAt: z.string().optional(),
    })
    .passthrough()
    .optional(),
});

/**
 * Validate brand configuration
 *
 * @param config Configuration to validate
 * @returns Validation result
 */
export function validateBrandConfig(config: unknown): {
  success: boolean;
  data?: z.infer<typeof brandConfigSchema>;
  errors?: z.ZodError;
} {
  const result = brandConfigSchema.safeParse(config);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Validate and throw if invalid
 *
 * @param config Configuration to validate
 * @throws ZodError if validation fails
 */
export function assertBrandConfig(
  config: unknown
): asserts config is z.infer<typeof brandConfigSchema> {
  brandConfigSchema.parse(config);
}
