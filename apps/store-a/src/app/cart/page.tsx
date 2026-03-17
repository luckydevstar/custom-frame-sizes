import type { Metadata } from "next";
import { CartPageClient } from "./CartPageClient";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
  title: "Shopping Cart | CustomFrameSizes.com",
  description:
    "Review your custom frames, update quantities, and proceed to secure checkout. See real-time pricing and order summary.",
  canonical: "https://customframesizes.com/cart",
  ogTitle: "Your Shopping Cart",
  ogDescription: "Review your custom frames and proceed to checkout.",
  noindex: true,
});

export default function CartPage() {
  return <CartPageClient />;
}
