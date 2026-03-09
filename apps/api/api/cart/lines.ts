/**
 * API entrypoint: PATCH /api/cart/lines
 *
 * Self-contained version of the cart lines handler for Vercel Functions.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { withRouteHandler, sendSuccess, ApiError } from "../../src/lib/route-handler";
import { validationError, notFoundError } from "../../src/lib/errors";
import { getCookie, CART_ID_COOKIE } from "../../src/lib/cookies";
import { UpdateCartLinesRequestSchema } from "../../src/types/requests";
import { addLinesToCart, updateLinesInCart, removeLinesFromCart } from "../../src/lib/cart-utils";
import { ensureStoreConfig } from "../../src/lib/store-config";
import { applyRateLimit } from "../../src/lib/rate-limit-middleware";
import { sanitizeStoreId, sanitizeAttributes } from "../../src/lib/sanitization";
import { validateStoreIdOrThrow } from "../../src/lib/validation";

const handler = withRouteHandler({
  PATCH: async (req: VercelRequest, res: VercelResponse) => {
    const cartId = getCookie(req, CART_ID_COOKIE);
    if (!cartId) {
      throw notFoundError("Cart", "Cart ID not found in cookie");
    }

    const validationResult = UpdateCartLinesRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw validationError("Invalid request", {
        field: validationResult.error.errors[0]?.path?.join(".") ?? "unknown",
        reason: validationResult.error.errors[0]?.message ?? "Validation failed",
      });
    }

    const { operation, lines } = validationResult.data;

    let storeId = req.body.storeId || req.headers["x-store-id"];
    if (!storeId || typeof storeId !== "string") {
      throw validationError("Store ID is required", {
        field: "storeId",
        reason: "Store ID must be provided in request body or X-Store-ID header",
      });
    }

    storeId = sanitizeStoreId(storeId);
    validateStoreIdOrThrow(storeId);

    ensureStoreConfig(storeId);

    let cart;
    try {
      switch (operation) {
        case "add": {
          if (!Array.isArray(lines) || lines.length === 0) {
            throw validationError("Lines array is required for add operation");
          }
          const addLines = lines as Array<{
            merchandiseId: string;
            quantity: number;
            attributes?: Array<{ key: string; value: string }>;
          }>;
          const sanitizedLines = addLines.map((line) => ({
            ...line,
            attributes: line.attributes ? sanitizeAttributes(line.attributes) : undefined,
          }));
          cart = await addLinesToCart(storeId, cartId, sanitizedLines);
          break;
        }

        case "update": {
          if (!Array.isArray(lines) || lines.length === 0) {
            throw validationError("Lines array is required for update operation");
          }
          const updateLines = lines as Array<{
            id: string;
            quantity: number;
            attributes?: Array<{ key: string; value: string }>;
          }>;
          const sanitizedLines = updateLines.map((line) => ({
            ...line,
            attributes: line.attributes ? sanitizeAttributes(line.attributes) : undefined,
          }));
          cart = await updateLinesInCart(storeId, cartId, sanitizedLines);
          break;
        }

        case "remove": {
          if (!Array.isArray(lines) || lines.length === 0) {
            throw validationError("Line IDs array is required for remove operation");
          }
          const lineIds = lines as string[];
          cart = await removeLinesFromCart(storeId, cartId, lineIds);
          break;
        }

        default:
          throw validationError(`Unknown operation: ${operation}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiError(
          "SHOPIFY_API_ERROR",
          `Failed to ${operation} cart lines: ${error.message}`,
          502
        );
      }
      throw new ApiError("SHOPIFY_API_ERROR", `Failed to ${operation} cart lines`, 502);
    }

    sendSuccess(res, { cart });
  },
});

export default applyRateLimit("cart-lines", handler);
