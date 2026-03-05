import type { Metadata } from "next";
import { CartClient } from "@framecraft/ui";

export const metadata: Metadata = {
  title: "Shopping Cart | CustomFrameSizes.com",
  description: "Review your custom frames and proceed to checkout.",
  openGraph: {
    title: "Shopping Cart",
    description: "Review your custom frames and proceed to checkout.",
  },
};

export default function CartPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <CartClient continueShoppingHref="/designer" onCheckout={undefined} />
    </div>
  );
}
