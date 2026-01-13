/**
 * Enhanced Validation Utilities
 *
 * Provides additional validation beyond Zod schemas for security.
 */

import { z } from "zod";

/**
 * Shopify GID (Global ID) format validator
 * Format: gid://shopify/ResourceType/ID
 */
export function isValidShopifyGID(gid: string): boolean {
  const gidPattern = /^gid:\/\/shopify\/([A-Z][a-zA-Z]+)\/(\d+)$/;
  return gidPattern.test(gid);
}

/**
 * Validate variant ID (must be Shopify GID format)
 */
export function validateVariantId(variantId: string): void {
  if (!isValidShopifyGID(variantId)) {
    throw new z.ZodError([
      {
        code: "custom",
        path: ["merchandiseId"],
        message: "Variant ID must be in Shopify GID format (gid://shopify/ProductVariant/ID)",
      },
    ]);
  }

  // Ensure it's a ProductVariant GID
  if (!variantId.startsWith("gid://shopify/ProductVariant/")) {
    throw new z.ZodError([
      {
        code: "custom",
        path: ["merchandiseId"],
        message: "Variant ID must be a ProductVariant GID",
      },
    ]);
  }
}

/**
 * Validate line item ID (must be Shopify GID format)
 */
export function validateLineItemId(lineItemId: string): void {
  if (!isValidShopifyGID(lineItemId)) {
    throw new z.ZodError([
      {
        code: "custom",
        path: ["id"],
        message: "Line item ID must be in Shopify GID format",
      },
    ]);
  }
}

/**
 * Enhanced cart line input schema with additional validations
 */
export const EnhancedCartLineInputSchema = z
  .object({
    merchandiseId: z.string().min(1, "Variant ID is required"),
    quantity: z
      .number()
      .int()
      .min(1, "Quantity must be at least 1")
      .max(999, "Quantity cannot exceed 999"),
    attributes: z
      .array(
        z.object({
          key: z.string().min(1, "Attribute key is required").max(100, "Attribute key too long"),
          value: z.string().max(1000, "Attribute value too long"),
        })
      )
      .max(50, "Too many attributes")
      .optional(),
  })
  .refine(
    (data) => {
      try {
        validateVariantId(data.merchandiseId);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "Invalid variant ID format",
      path: ["merchandiseId"],
    }
  );

/**
 * Enhanced cart line update schema
 */
export const EnhancedCartLineUpdateSchema = z
  .object({
    id: z.string().min(1, "Line item ID is required"),
    quantity: z
      .number()
      .int()
      .min(0, "Quantity cannot be negative")
      .max(999, "Quantity cannot exceed 999"),
    attributes: z
      .array(
        z.object({
          key: z.string().min(1, "Attribute key is required").max(100, "Attribute key too long"),
          value: z.string().max(1000, "Attribute value too long"),
        })
      )
      .max(50, "Too many attributes")
      .optional(),
  })
  .refine(
    (data) => {
      try {
        validateLineItemId(data.id);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "Invalid line item ID format",
      path: ["id"],
    }
  );

/**
 * Store ID validation
 */
export function validateStoreId(storeId: string): boolean {
  // Store ID should be alphanumeric with hyphens/underscores, 1-50 chars
  const storeIdPattern = /^[a-zA-Z0-9_-]{1,50}$/;
  return storeIdPattern.test(storeId);
}

/**
 * Validate store ID and throw if invalid
 */
export function validateStoreIdOrThrow(storeId: string): void {
  if (!validateStoreId(storeId)) {
    throw new z.ZodError([
      {
        code: "custom",
        path: ["storeId"],
        message: "Store ID must be alphanumeric with hyphens/underscores, 1-50 characters",
      },
    ]);
  }
}

/**
 * Checkout request validation schema (placeholder for P1-058)
 */
export const CheckoutRequestSchema = z.object({
  storeId: z.string().min(1, "Store ID is required"),
  discountCode: z.string().max(50, "Discount code too long").optional(),
  shippingAddress: z
    .object({
      address1: z.string().max(200),
      address2: z.string().max(200).optional(),
      city: z.string().max(100),
      province: z.string().max(100).optional(),
      zip: z.string().max(20),
      country: z.string().length(2, "Country must be 2-letter code"),
    })
    .optional(),
  customerEmail: z.string().email("Invalid email format").max(255).optional(),
});

export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;
