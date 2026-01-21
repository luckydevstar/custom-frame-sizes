/**
 * Checkout Utilities
 *
 * Helper functions for checkout operations using Shopify Storefront API.
 */

import { getCart } from "@framecraft/core";
import type { CartResponse } from "../types/responses";

/**
 * Get cart by ID
 */
export async function getCartById(storeId: string, cartId: string): Promise<CartResponse> {
  const cart = await getCart(cartId, storeId);

  if (!cart) {
    throw new Error("Cart not found");
  }

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    cost: {
      totalAmount: {
        amount: cart.cost.totalAmount.amount,
        currencyCode: cart.cost.totalAmount.currencyCode,
      },
    },
    lines: {
      edges: cart.lines.edges.map(
        (edge: {
          node: {
            id: string;
            quantity: number;
            merchandise: { id: string; title: string; product: { id: string; title: string } };
          };
        }) => ({
          node: {
            id: edge.node.id,
            quantity: edge.node.quantity,
            merchandise: {
              id: edge.node.merchandise.id,
              title: edge.node.merchandise.title,
              product: {
                id: edge.node.merchandise.product.id,
                title: edge.node.merchandise.product.title,
              },
            },
          },
        })
      ),
    },
  };
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
  if (!cart.lines || !cart.lines.edges || cart.lines.edges.length === 0) {
    throw new Error("Cart is empty. Cannot create checkout.");
  }

  // Build checkout URL with discount code if provided
  let checkoutUrl = cart.checkoutUrl || "";

  if (!checkoutUrl) {
    throw new Error("Cart does not have a checkout URL");
  }

  if (discountCode) {
    // Add discount code to checkout URL
    const url = new URL(checkoutUrl);
    url.searchParams.set("discount", discountCode);
    checkoutUrl = url.toString();
  }

  // Extract checkout ID from URL (format: /checkouts/{id})
  const checkoutIdMatch = checkoutUrl.match(/\/checkouts\/([a-zA-Z0-9]+)/);
  const checkoutId = checkoutIdMatch ? checkoutIdMatch[1] : cart.id || "";

  if (!checkoutId) {
    throw new Error("Could not extract checkout ID from cart");
  }

  return {
    checkoutUrl,
    checkoutId,
  };
}
