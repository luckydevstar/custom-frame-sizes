import { NextRequest } from "next/server";

import { assertFulfillmentAuth } from "../auth";
import {
  fetchShopifyOrderById,
  mapOrderToOrderFiles,
  parseShopifyOrderId,
} from "@/lib/shopify-admin-order-files";
import { isShopifyAdminConfigured } from "@/lib/shopify-admin-token";

/**
 * GET /api/order-files/[orderId]
 * Legacy-compatible: { success, orderFiles }.
 * Server env: SHOPIFY_STORE_DOMAIN + (SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET or SHOPIFY_ADMIN_ACCESS_TOKEN).
 */
export async function GET(
  request: NextRequest,
  context: { params: { orderId: string } }
): Promise<Response> {
  if (!assertFulfillmentAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId: raw } = context.params;
  const orderId = parseShopifyOrderId(decodeURIComponent(raw));
  if (!orderId) {
    return Response.json(
      { success: false, error: "Invalid order id. Use numeric id, #1001, or gid://shopify/Order/…" },
      { status: 400 }
    );
  }

  if (!isShopifyAdminConfigured()) {
    return Response.json({
      success: false,
      error:
        "Shopify Admin is not configured (set SHOPIFY_STORE_DOMAIN and SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET, or SHOPIFY_ADMIN_ACCESS_TOKEN).",
      orderFiles: [],
    });
  }

  try {
    const data = await fetchShopifyOrderById(orderId);
    if (!data) {
      return Response.json({ success: false, error: "Order not found", orderFiles: [] }, { status: 404 });
    }

    const orderFiles = mapOrderToOrderFiles(data.order);
    return Response.json({ success: true, orderFiles });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ success: false, error: message, orderFiles: [] }, { status: 500 });
  }
}
