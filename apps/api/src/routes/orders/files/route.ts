/**
 * Order Files Route Handler
 *
 * POST /api/orders/files - Create order file metadata
 * GET /api/orders/files?orderId=...&siteId=... - Get order files
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { withRouteHandler, sendSuccess } from "@/lib/route-handler";
import { validationError } from "@/lib/errors";
import { CreateOrderFileRequestSchema } from "@/types/order-files";
import { createOrderFile, getOrderFiles, isValidShopifyOrderId } from "@/lib/order-file-utils";
import { applyRateLimit } from "@/lib/rate-limit-middleware";
import { sanitizeStoreId } from "@/lib/sanitization";

const handler = withRouteHandler({
  POST: async (req: VercelRequest, res: VercelResponse) => {
    // Validate request body
    const validationResult = CreateOrderFileRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw validationError("Invalid request", {
        field: validationResult.error.errors[0]?.path.join("."),
        reason: validationResult.error.errors[0]?.message,
      });
    }

    const data = validationResult.data;

    // Validate order ID format
    if (!isValidShopifyOrderId(data.orderId)) {
      throw validationError("Invalid order ID format", {
        field: "orderId",
        reason: "Order ID must be numeric or Shopify GID format",
      });
    }

    // Sanitize site ID
    const siteId = sanitizeStoreId(data.siteId);

    // Create order file
    const file = await createOrderFile({
      ...data,
      siteId,
    });

    // Return success response
    sendSuccess(res, { file }, 201);
  },

  GET: async (req: VercelRequest, res: VercelResponse) => {
    // Get query parameters
    const orderId = req.query.orderId as string;
    const siteId = req.query.siteId as string;

    // Validate required parameters
    if (!orderId) {
      throw validationError("Order ID is required", {
        field: "orderId",
        reason: "orderId query parameter is required",
      });
    }

    if (!siteId) {
      throw validationError("Site ID is required", {
        field: "siteId",
        reason: "siteId query parameter is required",
      });
    }

    // Validate order ID format
    if (!isValidShopifyOrderId(orderId)) {
      throw validationError("Invalid order ID format", {
        field: "orderId",
        reason: "Order ID must be numeric or Shopify GID format",
      });
    }

    // Sanitize site ID
    const sanitizedSiteId = sanitizeStoreId(siteId);

    // Get order files
    const files = await getOrderFiles(orderId, sanitizedSiteId);

    // Return success response
    sendSuccess(res, { files, count: files.length });
  },
});

// Apply rate limiting
export default applyRateLimit("orders-files", handler);
