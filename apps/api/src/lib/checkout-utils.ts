/**
 * Checkout Utilities
 *
 * Helper functions for checkout operations using Shopify Storefront API.
 */

import { StorefrontClient } from "@framecraft/core";
import { StoreConfigRegistry } from "@framecraft/core";
import { getCart } from "@framecraft/core";
import type { CartResponse } from "@/types/responses";

/**
 * Get cart by ID
 */
export async function getCartById(storeId: string, cartId: string): Promise<CartResponse> {
  const storeConfig = StoreConfigRegistry.get(storeId);
  if (!storeConfig) {
    throw new Error(`Store configuration not found: ${storeId}`);
  }

  const client = new StorefrontClient(storeConfig);
  const cart = await getCart(client, cartId);

  return cart;
}

/**
 * Create checkout URL from cart
 *
 * Note: Shopify Storefront API carts already have a checkoutUrl.
 * This function validates the cart and returns the checkout URL.
 */
export async function createCheckoutUrl(
  storeId: string,
  cartId: string,
  discountCode?: string
): Promise<{ checkoutUrl: string; checkoutId: string }> {
  // Get cart
  const cart = await getCartById(storeId, cartId);

  // Validate cart has items
  if (!cart.lines.edges || cart.lines.edges.length === 0) {
    throw new Error("Cart is empty. Cannot create checkout.");
  }

  // Build checkout URL with discount code if provided
  let checkoutUrl = cart.checkoutUrl;

  if (discountCode) {
    // Add discount code to checkout URL
    const url = new URL(checkoutUrl);
    url.searchParams.set("discount", discountCode);
    checkoutUrl = url.toString();
  }

  // Extract checkout ID from URL (format: /checkouts/{id})
  const checkoutIdMatch = checkoutUrl.match(/\/checkouts\/([a-zA-Z0-9]+)/);
  const checkoutId = checkoutIdMatch ? checkoutIdMatch[1] : cart.id;

  return {
    checkoutUrl,
    checkoutId,
  };
}
