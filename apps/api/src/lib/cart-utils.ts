/**
 * Cart Utilities
 *
 * Helper functions for cart operations using Shopify Storefront API.
 *
 * NOTE: Shopify Admin API does not support cart operations.
 * Carts are managed via Storefront API, which is safe for server-side use
 * when using a private Storefront API token.
 */

import { StorefrontClient } from "@framecraft/core";
import { createCart, addCartLines, updateCartLines, removeCartLines } from "@framecraft/core";
import { StoreConfigRegistry } from "@framecraft/core";
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
  lines?: Array<{
    merchandiseId: string;
    quantity: number;
    attributes?: Array<{ key: string; value: string }>;
  }>
): Promise<CartResponse> {
  // Get store configuration
  const storeConfig = StoreConfigRegistry.get(storeId);
  if (!storeConfig) {
    throw new Error(`Store configuration not found: ${storeId}`);
  }

  // Create Storefront API client
  const client = new StorefrontClient(storeConfig);

  // Create cart
  const cart = await createCart(client, lines || []);

  return cart;
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
  lines: Array<{
    merchandiseId: string;
    quantity: number;
    attributes?: Array<{ key: string; value: string }>;
  }>
): Promise<CartResponse> {
  const storeConfig = StoreConfigRegistry.get(storeId);
  if (!storeConfig) {
    throw new Error(`Store configuration not found: ${storeId}`);
  }

  const client = new StorefrontClient(storeConfig);
  const cart = await addCartLines(client, cartId, lines);

  return cart;
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
  const storeConfig = StoreConfigRegistry.get(storeId);
  if (!storeConfig) {
    throw new Error(`Store configuration not found: ${storeId}`);
  }

  const client = new StorefrontClient(storeConfig);
  const cart = await updateCartLines(client, cartId, lines);

  return cart;
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
  const storeConfig = StoreConfigRegistry.get(storeId);
  if (!storeConfig) {
    throw new Error(`Store configuration not found: ${storeId}`);
  }

  const client = new StorefrontClient(storeConfig);
  const cart = await removeCartLines(client, cartId, lineIds);

  return cart;
}
