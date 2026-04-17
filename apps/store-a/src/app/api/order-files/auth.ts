import { NextRequest } from "next/server";

/** When FULFILLMENT_DASHBOARD_SECRET is set, require Authorization: Bearer <secret>. */
export function assertFulfillmentAuth(request: NextRequest): boolean {
  const secret = process.env.FULFILLMENT_DASHBOARD_SECRET;
  if (!secret) return true;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}
