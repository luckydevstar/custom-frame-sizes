/**
 * API entrypoint: /api/orders/files/[id]
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { withRouteHandler, sendSuccess } from "../../../src/lib/route-handler";
import { validationError, notFoundError } from "../../../src/lib/errors";
import { getOrderFileById } from "../../../src/lib/order-file-utils";
import { applyRateLimit } from "../../../src/lib/rate-limit-middleware";
import { sanitizeStoreId } from "../../../src/lib/sanitization";

const handler = withRouteHandler({
  GET: async (req: VercelRequest, res: VercelResponse) => {
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

    const sanitizedSiteId = sanitizeStoreId(siteId);

    const file = await getOrderFileById(fileId, sanitizedSiteId);

    if (!file) {
      throw notFoundError("Order file", fileId);
    }

    sendSuccess(res, { file });
  },
});

export default applyRateLimit("orders-files", handler);
