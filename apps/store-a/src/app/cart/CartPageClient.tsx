"use client";

import { getMatById } from "@framecraft/config";
import {
  logCheckoutBrandingCartSnapshot,
  logCheckoutBrandingJson,
  resolveCheckoutBrandingMetadata,
} from "@framecraft/core";
import { getFrameStyleById } from "@framecraft/core/services/products";
import { useCartStore } from "@framecraft/core/stores";
import { CartClient, getCardProductionCode } from "@framecraft/ui";
import { useEffect } from "react";

function matBoardLabel(matId: string | undefined): string | undefined {
  if (!matId) return undefined;
  const m = getMatById(matId);
  if (!m) return matId;
  const sku = m.sizes?.["32x40"]?.sku ?? m.sizes?.["40x60"]?.sku;
  return sku ? `${m.name} (${sku})` : m.name;
}

export function CartPageClient() {
  const setLoading = useCartStore((state) => state._setLoading);
  const setError = useCartStore((state) => state._setError);
  const clearCart = useCartStore((state) => state.clearCart);
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

      const { calculatePricing } = await import("@framecraft/core/services/pricing");

      // Convert local cart items to API format (BFF builds line-item properties for packing slip)
      const lines = items.map((item, lineIndex) => {
        let priceCents: number;

        if (item.configuration) {
          try {
            const pricing = calculatePricing(item.configuration);
            priceCents = Math.round(pricing.total * 100);
          } catch {
            priceCents = item.price || 0;
          }
        } else {
          priceCents = item.price || 0;
        }

        const cfg = item.configuration;
        const frame = cfg ? getFrameStyleById(cfg.frameStyleId) : undefined;
        const cardProductionCode =
          cfg?.cardFormatId && cfg.cardLayoutId
            ? getCardProductionCode(cfg.cardFormatId, cfg.cardLayoutId)
            : undefined;

        return {
          merchandiseId: variantId,
          quantity: item.quantity,
          priceCents,
          configuration: cfg,
          packing: cfg
            ? {
                frameDisplayName: frame?.name,
                frameSku: frame?.sku,
                matOuterLabel: matBoardLabel(cfg.matColorId),
                matInnerLabel: matBoardLabel(cfg.matInnerColorId),
                lineIndex: lineIndex + 1,
                cardProductionCode,
                cardInteriorWidthIn: cfg.cardInteriorWidthIn,
                cardInteriorHeightIn: cfg.cardInteriorHeightIn,
              }
            : undefined,
        };
      });

      // CRITICAL: Get a fresh checkout URL with current items
      // The backend will handle clearing old carts and creating a new fresh one
      const apiBase = (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) || "";

      const branding = resolveCheckoutBrandingMetadata();

      const freshCheckoutRes = await fetch(`${apiBase}/api/cart/fresh-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(branding ? { lines, branding } : { lines }),
        credentials: "include",
      });

      const freshCheckoutData = (await freshCheckoutRes.json()) as {
        success?: boolean;
        checkoutUrl?: string;
        cartId?: string;
        cart?: { id?: string; lines?: Array<{ id?: string; attributes?: Array<{ key: string; value: string }> }> };
        error?: { message?: string };
      };

      logCheckoutBrandingJson("POST /api/cart/fresh-checkout response", freshCheckoutData);
      if (freshCheckoutData.cart) {
        logCheckoutBrandingCartSnapshot("fresh-checkout (cart returned by API)", freshCheckoutData.cart);
      }

      if (!freshCheckoutData.success || !freshCheckoutData.checkoutUrl) {
        throw new Error(freshCheckoutData.error?.message || "Failed to create fresh checkout");
      }

      // Checkout URL is valid; clear local cart before leaving so a return/abandon
      // does not show stale items (Finding #6).
      clearCart();
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
