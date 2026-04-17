import type { Metadata } from "next";

import { OrderFulfillmentClient } from "./order-fulfillment-client";

export const metadata: Metadata = {
  title: "Order fulfillment",
  robots: { index: false, follow: false },
};

export default function OrderFulfillmentPage() {
  return <OrderFulfillmentClient />;
}
