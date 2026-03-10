/**
 * Cart Route Handler (Vercel API)
 * POST /api/cart - Create a new cart
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { withRouteHandler, sendSuccess } from "../shared/lib/route-handler";
import { validationError, shopifyApiError } from "../shared/lib/errors";
import { setCookie, CART_ID_COOKIE } from "../shared/lib/cookies";
import { CreateCartRequestSchema } from "../shared/types/requests";
import { createCartWithStorefront } from "../shared/lib/cart-utils";
import { ensureStoreConfig } from "../shared/lib/store-config";
import { applyRateLimit } from "../shared/lib/rate-limit-middleware";
import { sanitizeStoreId, sanitizeAttributes } from "../shared/lib/sanitization";
import { validateStoreIdOrThrow } from "../shared/lib/validation";

const handler = withRouteHandler({
  POST: async (req: VercelRequest, res: VercelResponse) => {
    // Validate request body
    const validationResult = CreateCartRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw validationError("Invalid request", {
        field: validationResult.error.errors[0]?.path?.join(".") ?? "unknown",
        reason: validationResult.error.errors[0]?.message ?? "Validation failed",
      });
    }

    let { storeId, lines } = validationResult.data;

    // Sanitize and validate store ID
    storeId = sanitizeStoreId(storeId);
    validateStoreIdOrThrow(storeId);

    // Register store config from env so core Storefront API can run
    ensureStoreConfig(storeId);

    // Sanitize attributes if present
    if (lines) {
      lines = lines.map(
        (line: {
          merchandiseId: string;
          quantity: number;
          attributes?: Array<{ key: string; value: string }>;
        }) => ({
          ...line,
          attributes: line.attributes ? sanitizeAttributes(line.attributes) : undefined,
        })
      );
    }

    // Create cart using Storefront API
    let cart;
    try {
      cart = await createCartWithStorefront(storeId, lines);
    } catch (error) {
      if (error instanceof Error) {
        throw shopifyApiError(`Failed to create cart: ${error.message}`, 502);
      }
      throw shopifyApiError("Failed to create cart", 502);
    }

    // Set HTTP-only cookie with cart ID
    setCookie(res, CART_ID_COOKIE, cart.id, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Return success response
    sendSuccess(
      res,
      {
        cartId: cart.id,
        cart,
      },
      201
    );
  },
});

// Apply rate limiting
export default applyRateLimit("cart", handler);
