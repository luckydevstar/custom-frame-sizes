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

      // CRITICAL: Clear ALL Shopify-related cookies to force a fresh session
      // This prevents Shopify from associating the new cart with old checkout sessions
      const cookies = document.cookie.split(";");
      cookies.forEach((cookie) => {
        const name = cookie.split("=")[0]?.trim();
        // Clear any Shopify cookies (cart, checkout, session)
        if (
          name &&
          (name.includes("shopify") || name.includes("cart") || name.includes("checkout"))
        ) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        }
      });

      // Import serialization and pricing functions
      const { serializeFrameConfiguration } = await import("@framecraft/core/shopify");
      const { calculatePricing } = await import("@framecraft/core/services/pricing");

      // Convert local cart items to API format with serialized configuration
      const lines = items.map((item) => {
        // Calculate price using same engine as displayed in cart
        const pricing = calculatePricing(item.configuration!);
        const priceCents = Math.round(pricing.total * 100); // Convert dollars to cents

        // Serialize configuration to Shopify attributes format
        const attributes = serializeFrameConfiguration(item.configuration!);

        return {
          merchandiseId: variantId,
          quantity: item.quantity,
          attributes, // Pre-serialized for Shopify
          priceCents,
          configuration: item.configuration, // Send raw config for backend processing
        };
      });

      // CRITICAL: Get a fresh checkout URL with current items
      // The backend will handle clearing old carts and creating a new fresh one
      const apiBase = (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) || "";

      const freshCheckoutRes = await fetch(`${apiBase}/api/cart/fresh-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
        credentials: "include",
      });

      const freshCheckoutData = await freshCheckoutRes.json();

      if (!freshCheckoutData.success || !freshCheckoutData.checkoutUrl) {
        throw new Error(freshCheckoutData.error?.message || "Failed to create fresh checkout");
      }

      window.location.href = freshCheckoutData.checkoutUrl;
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
