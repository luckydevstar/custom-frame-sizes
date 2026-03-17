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

      // Get variant ID from env
      const variantId =
        process.env.NEXT_PUBLIC_SHOPIFY_FRAME_VARIANT_ID || "gid://shopify/ProductVariant/mock";

      // Clear cart cookie to force creation of a new cart
      // This prevents duplicate items when clicking checkout multiple times
      document.cookie = "framecraft_cart_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Create a FRESH cart
      const { createOrGetCart, addCartLines } =
        await import("@framecraft/core/services/framecraft-api");

      // Import pricing calculator to ensure prices match frontend
      const { calculatePricing } = await import("@framecraft/core/services/pricing");

      // Convert local cart items to API format with calculated prices
      const lines = items.map((item) => {
        // Calculate price using same engine as displayed in cart
        const pricing = calculatePricing(item.configuration!);
        const priceCents = Math.round(pricing.total * 100); // Convert dollars to cents

        return {
          merchandiseId: variantId,
          quantity: item.quantity,
          configuration: item.configuration!,
          priceCents, // Pass calculated price to backend
        };
      });

      // Create fresh cart (cookie is cleared, so this will create new)
      const cart = await createOrGetCart();
      await addCartLines(lines, cart.id);

      // Get checkout URL
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
