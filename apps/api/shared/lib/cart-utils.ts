/**
 * Cart Utilities
 *
 * Helper functions for cart operations using Shopify Storefront API.
 *
 * NOTE: Shopify Admin API does not support cart operations.
 * Carts are managed via Storefront API, which is safe for server-side use
 * when using a private Storefront API token.
 */

import {
  createCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
  type CartLineInput,
} from "@framecraft/core";
import type { CartResponse } from "../types/responses";

/**
 * Create a new cart using Storefront API
 *
 * @param storeId - Store identifier
 * @param lines - Optional initial cart lines
 * @returns Cart response
 */
export async function createCartWithStorefront(
  storeId: string,
  lines?: CartLineInput[]
): Promise<CartResponse> {
  // Create cart - function handles store config internally
  const cart = await createCart(lines || [], storeId);

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
 * Add lines to an existing cart
 *
 * @param storeId - Store identifier
 * @param cartId - Cart ID
 * @param lines - Lines to add
 * @returns Updated cart response
 */
export async function addLinesToCart(
  storeId: string,
  cartId: string,
  lines: CartLineInput[]
): Promise<CartResponse> {
  const cart = await addCartLines(cartId, lines, storeId);

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
 * Update lines in an existing cart
 *
 * @param storeId - Store identifier
 * @param cartId - Cart ID
 * @param lines - Lines to update
 * @returns Updated cart response
 */
export async function updateLinesInCart(
  storeId: string,
  cartId: string,
  lines: Array<{
    id: string;
    quantity: number;
    attributes?: Array<{ key: string; value: string }>;
  }>
): Promise<CartResponse> {
  const cart = await updateCartLines(cartId, lines, storeId);

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
 * Remove lines from an existing cart
 *
 * @param storeId - Store identifier
 * @param cartId - Cart ID
 * @param lineIds - Line item IDs to remove
 * @returns Updated cart response
 */
export async function removeLinesFromCart(
  storeId: string,
  cartId: string,
  lineIds: string[]
): Promise<CartResponse> {
  const cart = await removeCartLines(cartId, lineIds, storeId);

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
