/**
 * Cart Lines Route Handler
 *
 * PATCH /api/cart/lines - Update cart line items (add, update, remove)
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { withRouteHandler, sendSuccess, ApiError } from "@/lib/route-handler";
import { validationError, notFoundError } from "@/lib/errors";
import { getCookie, CART_ID_COOKIE } from "@/lib/cookies";
import { UpdateCartLinesRequestSchema } from "@/types/requests";
import { addLinesToCart, updateLinesInCart, removeLinesFromCart } from "@/lib/cart-utils";
import { applyRateLimit } from "@/lib/rate-limit-middleware";
import { sanitizeStoreId, sanitizeAttributes } from "@/lib/sanitization";
import { validateStoreIdOrThrow } from "@/lib/validation";

const handler = withRouteHandler({
  PATCH: async (req: VercelRequest, res: VercelResponse) => {
    // Get cart ID from cookie
    const cartId = getCookie(req, CART_ID_COOKIE);
    if (!cartId) {
      throw notFoundError("Cart", "Cart ID not found in cookie");
    }

    // Validate request body
    const validationResult = UpdateCartLinesRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw validationError("Invalid request", {
        field: validationResult.error.errors[0]?.path.join("."),
        reason: validationResult.error.errors[0]?.message,
      });
    }

    const { operation, lines } = validationResult.data;

    // Get storeId from request (could also come from cookie or header)
    let storeId = req.body.storeId || req.headers["x-store-id"];
    if (!storeId || typeof storeId !== "string") {
      throw validationError("Store ID is required", {
        field: "storeId",
        reason: "Store ID must be provided in request body or X-Store-ID header",
      });
    }

    // Sanitize and validate store ID
    storeId = sanitizeStoreId(storeId);
    validateStoreIdOrThrow(storeId);

    // Execute operation based on type
    let cart;
    try {
      switch (operation) {
        case "add": {
          if (!Array.isArray(lines) || lines.length === 0) {
            throw validationError("Lines array is required for add operation");
          }
          // Type assertion: lines is CartLineInput[] for add operation
          const addLines = lines as Array<{
            merchandiseId: string;
            quantity: number;
            attributes?: Array<{ key: string; value: string }>;
          }>;
          // Sanitize attributes
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
          // Type assertion: lines is CartLineUpdateInput[] for update operation
          const updateLines = lines as Array<{
            id: string;
            quantity: number;
            attributes?: Array<{ key: string; value: string }>;
          }>;
          // Sanitize attributes
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
          // Type assertion: lines is string[] for remove operation
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

    // Return success response
    sendSuccess(res, { cart });
  },
});

// Apply rate limiting
export default applyRateLimit("cart-lines", handler);
