/**
 * Request Type Definitions
 */

import { z } from "zod";

/**
 * Cart line item input schema
 */
export const CartLineInputSchema = z.object({
  merchandiseId: z.string().min(1, "Variant ID is required"),
  quantity: z.number().int().min(1).max(999),
  attributes: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

export type CartLineInput = z.infer<typeof CartLineInputSchema>;

/**
 * Create cart request schema
 */
export const CreateCartRequestSchema = z.object({
  storeId: z.string().min(1, "Store ID is required"),
  lines: z.array(CartLineInputSchema).optional(),
});

export type CreateCartRequest = z.infer<typeof CreateCartRequestSchema>;

/**
 * Cart line update input schema
 */
export const CartLineUpdateInputSchema = z.object({
  id: z.string().min(1, "Line item ID is required"),
  quantity: z.number().int().min(0).max(999),
  attributes: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

export type CartLineUpdateInput = z.infer<typeof CartLineUpdateInputSchema>;

/**
 * Update cart lines request schema
 */
export const UpdateCartLinesRequestSchema = z.object({
  operation: z.enum(["add", "update", "remove"]),
  lines: z.union([
    z.array(CartLineInputSchema), // for add
    z.array(CartLineUpdateInputSchema), // for update
    z.array(z.string()), // for remove (line item IDs)
  ]),
});

export type UpdateCartLinesRequest = z.infer<typeof UpdateCartLinesRequestSchema>;
