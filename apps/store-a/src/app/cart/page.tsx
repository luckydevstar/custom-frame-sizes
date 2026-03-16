import type { Metadata } from "next";
import { CartPageClient } from "./CartPageClient";

export const metadata: Metadata = {
  title: "Shopping Cart | CustomFrameSizes.com",
  description: "Review your custom frames and proceed to checkout.",
  openGraph: {
    title: "Shopping Cart",
    description: "Review your custom frames and proceed to checkout.",
  },
};

export default function CartPage() {
  return <CartPageClient />;
}
