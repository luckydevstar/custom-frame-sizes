/**
 * API entrypoint: POST /api/cart
 *
 * This is a self-contained handler for Vercel Functions. It mirrors the logic
 * from src/routes/cart/route.ts but lives under api/ so that Vercel's
 * TypeScript runtime can bundle it without importing TS files outside api/.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { withRouteHandler, sendSuccess } from "../src/lib/route-handler";
import { validationError, shopifyApiError } from "../src/lib/errors";
import { setCookie, CART_ID_COOKIE } from "../src/lib/cookies";
import { CreateCartRequestSchema } from "../src/types/requests";
import { createCartWithStorefront } from "../src/lib/cart-utils";
import { ensureStoreConfig } from "../src/lib/store-config";
import { applyRateLimit } from "../src/lib/rate-limit-middleware";
import { sanitizeStoreId, sanitizeAttributes } from "../src/lib/sanitization";
import { validateStoreIdOrThrow } from "../src/lib/validation";

const handler = withRouteHandler({
  POST: async (req: VercelRequest, res: VercelResponse) => {
    const validationResult = CreateCartRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw validationError("Invalid request", {
        field: validationResult.error.errors[0]?.path?.join(".") ?? "unknown",
        reason: validationResult.error.errors[0]?.message ?? "Validation failed",
      });
    }

    let { storeId, lines } = validationResult.data;

    storeId = sanitizeStoreId(storeId);
    validateStoreIdOrThrow(storeId);

    ensureStoreConfig(storeId);

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

    let cart;
    try {
      cart = await createCartWithStorefront(storeId, lines);
    } catch (error) {
      if (error instanceof Error) {
        throw shopifyApiError(`Failed to create cart: ${error.message}`, 502);
      }
      throw shopifyApiError("Failed to create cart", 502);
    }

    setCookie(res, CART_ID_COOKIE, cart.id, {
      maxAge: 30 * 24 * 60 * 60,
    });

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

export default applyRateLimit("cart", handler);
