/**
 * API entrypoint: POST /api/checkout
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { withRouteHandler, sendSuccess } from "../src/lib/route-handler";
import { validationError, notFoundError } from "../src/lib/errors";
import { getCookie, CART_ID_COOKIE } from "../src/lib/cookies";
import { CheckoutRequestSchema } from "../src/lib/validation";
import { createCheckoutUrl } from "../src/lib/checkout-utils";
import { ensureStoreConfig } from "../src/lib/store-config";
import { applyRateLimit } from "../src/lib/rate-limit-middleware";
import { sanitizeStoreId, sanitizeEmail } from "../src/lib/sanitization";
import { validateStoreIdOrThrow } from "../src/lib/validation";

const handler = withRouteHandler({
  POST: async (req: VercelRequest, res: VercelResponse) => {
    const cartId = getCookie(req, CART_ID_COOKIE);
    if (!cartId) {
      throw notFoundError("Cart", "Cart ID not found in cookie");
    }

    const validationResult = CheckoutRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw validationError("Invalid request", {
        field: validationResult.error.errors[0]?.path?.join(".") ?? "unknown",
        reason: validationResult.error.errors[0]?.message ?? "Validation failed",
      });
    }

    let { storeId, discountCode, customerEmail } = validationResult.data;

    storeId = sanitizeStoreId(storeId);
    validateStoreIdOrThrow(storeId);

    ensureStoreConfig(storeId);

    if (discountCode) {
      discountCode = discountCode.trim().toUpperCase().substring(0, 50);
    }

    if (customerEmail) {
      customerEmail = sanitizeEmail(customerEmail);
    }

    let checkoutData;
    try {
      checkoutData = await createCheckoutUrl(storeId, cartId, discountCode);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create checkout: ${error.message}`);
      }
      throw new Error("Failed to create checkout");
    }

    sendSuccess(res, {
      checkoutUrl: checkoutData.checkoutUrl,
      checkoutId: checkoutData.checkoutId,
      customerEmail: customerEmail || undefined,
    });
  },
});

export default applyRateLimit("checkout", handler);
