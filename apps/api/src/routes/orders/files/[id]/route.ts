/**
 * Order File by ID Route Handler
 *
 * GET /api/orders/files/:id - Get specific order file by ID
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { withRouteHandler, sendSuccess } from "@/lib/route-handler";
import { validationError, notFoundError } from "@/lib/errors";
import { getOrderFileById } from "@/lib/order-file-utils";
import { applyRateLimit } from "@/lib/rate-limit-middleware";
import { sanitizeStoreId } from "@/lib/sanitization";

const handler = withRouteHandler({
  GET: async (req: VercelRequest, res: VercelResponse) => {
    // Get file ID from URL parameter
    const fileId = req.query.id as string;
    const siteId = req.query.siteId as string;

    if (!fileId) {
      throw validationError("File ID is required", {
        field: "id",
        reason: "File ID parameter is required",
      });
    }

    if (!siteId) {
      throw validationError("Site ID is required", {
        field: "siteId",
        reason: "siteId query parameter is required",
      });
    }

    // Sanitize site ID
    const sanitizedSiteId = sanitizeStoreId(siteId);

    // Get order file
    const file = await getOrderFileById(fileId, sanitizedSiteId);

    if (!file) {
      throw notFoundError("Order file", fileId);
    }

    // Return success response
    sendSuccess(res, { file });
  },
});

// Apply rate limiting
export default applyRateLimit("orders-files", handler);
