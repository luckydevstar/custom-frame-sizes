/**
 * API entrypoint: /api/orders/files
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { withRouteHandler, sendSuccess } from "../../src/lib/route-handler";
import { validationError } from "../../src/lib/errors";
import { CreateOrderFileRequestSchema } from "../../src/types/order-files";
import {
  createOrderFile,
  getOrderFiles,
  isValidShopifyOrderId,
} from "../../src/lib/order-file-utils";
import { applyRateLimit } from "../../src/lib/rate-limit-middleware";
import { sanitizeStoreId } from "../../src/lib/sanitization";

const handler = withRouteHandler({
  POST: async (req: VercelRequest, res: VercelResponse) => {
    const validationResult = CreateOrderFileRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      throw validationError("Invalid request", {
        field: validationResult.error.errors[0]?.path?.join(".") ?? "unknown",
        reason: validationResult.error.errors[0]?.message ?? "Validation failed",
      });
    }

    const data = validationResult.data;

    if (!isValidShopifyOrderId(data.orderId)) {
      throw validationError("Invalid order ID format", {
        field: "orderId",
        reason: "Order ID must be numeric or Shopify GID format",
      });
    }

    const siteId = sanitizeStoreId(data.siteId);

    const file = await createOrderFile({
      ...data,
      siteId,
    });

    sendSuccess(res, { file }, 201);
  },

  GET: async (req: VercelRequest, res: VercelResponse) => {
    const orderId = req.query.orderId as string;
    const siteId = req.query.siteId as string;

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

    if (!isValidShopifyOrderId(orderId)) {
      throw validationError("Invalid order ID format", {
        field: "orderId",
        reason: "Order ID must be numeric or Shopify GID format",
      });
    }

    const sanitizedSiteId = sanitizeStoreId(siteId);

    const files = await getOrderFiles(orderId, sanitizedSiteId);

    sendSuccess(res, { files, count: files.length });
  },
});

export default applyRateLimit("orders-files", handler);
