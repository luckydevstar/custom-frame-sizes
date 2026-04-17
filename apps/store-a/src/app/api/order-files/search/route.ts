import { NextRequest } from "next/server";

import { assertFulfillmentAuth } from "../auth";
import { searchOrdersAdmin } from "@/lib/shopify-admin-order-files";
import { isShopifyAdminConfigured } from "@/lib/shopify-admin-token";

/**
 * GET /api/order-files/search?q=...
 * Returns matching orders (legacy had order-id only; this adds search).
 */
export async function GET(request: NextRequest): Promise<Response> {
  if (!assertFulfillmentAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return Response.json({ success: false, error: "Query must be at least 2 characters", orders: [] }, { status: 400 });
  }

  if (!isShopifyAdminConfigured()) {
    return Response.json({
      success: false,
      error:
        "Shopify Admin is not configured (set SHOPIFY_STORE_DOMAIN and SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET, or SHOPIFY_ADMIN_ACCESS_TOKEN).",
      orders: [],
    });
  }

  try {
    const orders = await searchOrdersAdmin(q);
    return Response.json({ success: true, orders });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ success: false, error: message, orders: [] }, { status: 500 });
  }
}
