/**
 * Checkout Route Handler
 *
 * POST /api/checkout - Create checkout URL from cart
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { withRouteHandler, sendSuccess } from "@/lib/route-handler";
import { validationError, notFoundError } from "@/lib/errors";
import { getCookie, CART_ID_COOKIE } from "@/lib/cookies";
import { CheckoutRequestSchema } from "@/lib/validation";
import { createCheckoutUrl } from "@/lib/checkout-utils";
import { applyRateLimit } from "@/lib/rate-limit-middleware";
import { sanitizeStoreId, sanitizeEmail } from "@/lib/sanitization";
import { validateStoreIdOrThrow } from "@/lib/validation";

const handler = withRouteHandler({
  POST: async (req: VercelRequest, res: VercelResponse) => {
    // Get cart ID from cookie
    const cartId = getCookie(req, CART_ID_COOKIE);
    if (!cartId) {
      throw notFoundError("Cart", "Cart ID not found in cookie");
    }

    // Validate request body
    const validationResult = CheckoutRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw validationError("Invalid request", {
        field: validationResult.error.errors[0]?.path.join("."),
        reason: validationResult.error.errors[0]?.message,
      });
    }

    let { storeId, discountCode, customerEmail } = validationResult.data;

    // Sanitize and validate store ID
    storeId = sanitizeStoreId(storeId);
    validateStoreIdOrThrow(storeId);

    // Sanitize discount code if provided
    if (discountCode) {
      discountCode = discountCode.trim().toUpperCase().substring(0, 50);
    }

    // Sanitize email if provided
    if (customerEmail) {
      customerEmail = sanitizeEmail(customerEmail);
    }

    // Create checkout URL
    let checkoutData;
    try {
      checkoutData = await createCheckoutUrl(storeId, cartId, discountCode);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create checkout: ${error.message}`);
      }
      throw new Error("Failed to create checkout");
    }

    // Return success response
    sendSuccess(res, {
      checkoutUrl: checkoutData.checkoutUrl,
      checkoutId: checkoutData.checkoutId,
      customerEmail: customerEmail || undefined,
    });
  },
});

// Apply rate limiting
export default applyRateLimit("checkout", handler);
