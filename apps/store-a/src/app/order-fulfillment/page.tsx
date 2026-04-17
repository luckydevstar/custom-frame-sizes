import type { Metadata } from "next";

import { generatePageMetadata } from "@/lib/seo-utils";

import { OrderFulfillmentClient } from "./order-fulfillment-client";

export const metadata: Metadata = generatePageMetadata("/order-fulfillment", {
  title: "Order fulfillment",
  description:
    "Internal manufacturing dashboard: production files tied to Shopify orders (staff use only).",
  robots: { index: false, follow: false },
});

export default function OrderFulfillmentPage() {
  return <OrderFulfillmentClient />;
}
