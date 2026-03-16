"use client";

import { useEffect } from "react";
import { CartClient } from "@framecraft/ui";
import { useCartStore } from "@framecraft/core/stores";

export function CartPageClient() {
  const setLoading = useCartStore((state) => state._setLoading);
  const setError = useCartStore((state) => state._setError);
  const items = useCartStore((state) => state.items);

  // Clear any stale cart errors (like old Shopify store-config issues) when the cart page loads
  useEffect(() => {
    setError(null);
  }, [setError]);

  const handleCheckout = async () => {
    setError(null);
    setLoading(true);

    try {
      // If no items in cart, show error
      if (items.length === 0) {
        setError("Your cart is empty. Please add items before checkout.");
        setLoading(false);
        return;
      }

      // Sync all cart items to backend before checkout
      // This ensures backend cart matches UI cart, even if some items weren't synced during add-to-cart
      const { createOrGetCart, addCartLines } =
        await import("@framecraft/core/services/framecraft-api");

      // Get variant ID from env
      const variantId =
        process.env.NEXT_PUBLIC_SHOPIFY_FRAME_VARIANT_ID || "gid://shopify/ProductVariant/mock";

      // Create/get backend cart
      const cart = await createOrGetCart();

      // Add all items from local cart to backend cart
      const lines = items.map((item) => ({
        merchandiseId: variantId,
        quantity: item.quantity,
        configuration: item.configuration!,
      }));

      await addCartLines(lines, cart.id);

      // Now get checkout URL
      const { getCheckoutUrl } = await import("@framecraft/core/services/framecraft-api");
      const checkoutUrl = await getCheckoutUrl(cart.id);
      window.location.href = checkoutUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <CartClient continueShoppingHref="/designer" onCheckout={handleCheckout} />
    </div>
  );
}
