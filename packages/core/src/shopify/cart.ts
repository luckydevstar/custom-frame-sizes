/**
 * Shopify Cart API Functions
 *
 * GraphQL mutations and queries for cart management via Storefront API.
 * Used by the cart store for synchronization.
 *
 * @packageDocumentation
 */

import { createStorefrontClient } from "./storefront-client";
import { CartFields, ProductFields, VariantFields } from "./fragments";
import type { ShopifyAttribute } from "./serialization";

/**
 * Shopify Cart (from GraphQL response)
 */
export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  createdAt: string;
  updatedAt: string;
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        cost: {
          totalAmount: {
            amount: string;
            currencyCode: string;
          };
        };
        merchandise: {
          id: string;
          title: string;
          product: {
            id: string;
            title: string;
            handle: string;
          };
        };
        attributes: Array<{
          key: string;
          value: string;
        }>;
      };
    }>;
  };
}

/**
 * Cart line input for creating/adding items
 */
export interface CartLineInput {
  /**
   * Variant ID (GID format)
   */
  merchandiseId: string;

  /**
   * Quantity to add
   */
  quantity: number;

  /**
   * Custom attributes (for frame configuration)
   */
  attributes?: ShopifyAttribute[];
}

/**
 * Cart line update input
 */
export interface CartLineUpdateInput {
  /**
   * Line item ID (GID format)
   */
  id: string;

  /**
   * New quantity
   */
  quantity: number;

  /**
   * Updated attributes (optional)
   */
  attributes?: ShopifyAttribute[];
}

/**
 * User errors from Shopify mutations
 */
export interface UserError {
  field?: string[];
  message: string;
}

/**
 * Create a new cart
 *
 * Creates a new cart in Shopify with the provided line items.
 *
 * @param lines - Line items to add to the cart
 * @param storeId - Optional store identifier
 * @returns Promise resolving to created cart
 * @throws {ShopifyAPIError} If API returns an error
 * @throws {Error} If user errors occur
 *
 * @example
 * ```typescript
 * import { createCart } from '@framecraft/core/shopify';
 * import { serializeFrameConfiguration } from '@framecraft/core/shopify';
 *
 * const cart = await createCart([
 *   {
 *     merchandiseId: "gid://shopify/ProductVariant/123",
 *     quantity: 1,
 *     attributes: serializeFrameConfiguration(config),
 *   }
 * ]);
 *
 * console.log(cart.id);
 * console.log(cart.checkoutUrl);
 * ```
 */
export async function createCart(lines: CartLineInput[], storeId?: string): Promise<ShopifyCart> {
  if (!lines || lines.length === 0) {
    throw new Error("At least one line item is required to create a cart");
  }

  const client = createStorefrontClient(storeId);

  const mutation = `
    ${CartFields}
    ${ProductFields}
    ${VariantFields}
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  interface CartCreateResponse {
    cartCreate: {
      cart: ShopifyCart | null;
      userErrors: UserError[];
    };
  }

  const response = await client.mutation<CartCreateResponse>(mutation, {
    input: {
      lines,
    },
  });

  // Check for user errors
  if (response.cartCreate.userErrors && response.cartCreate.userErrors.length > 0) {
    const errors = response.cartCreate.userErrors.map((e) => e.message).join("; ");
    throw new Error(`Cart creation failed: ${errors}`);
  }

  if (!response.cartCreate.cart) {
    throw new Error("Cart creation failed: No cart returned");
  }

  return response.cartCreate.cart;
}

/**
 * Add lines to existing cart
 *
 * Adds one or more line items to an existing cart.
 *
 * @param cartId - Cart ID (GID format)
 * @param lines - Line items to add
 * @param storeId - Optional store identifier
 * @returns Promise resolving to updated cart
 * @throws {ShopifyAPIError} If API returns an error
 * @throws {Error} If user errors occur
 *
 * @example
 * ```typescript
 * import { addCartLines } from '@framecraft/core/shopify';
 *
 * const updatedCart = await addCartLines(
 *   "gid://shopify/Cart/abc123",
 *   [
 *     {
 *       merchandiseId: "gid://shopify/ProductVariant/456",
 *       quantity: 2,
 *     }
 *   ]
 * );
 * ```
 */
export async function addCartLines(
  cartId: string,
  lines: CartLineInput[],
  storeId?: string
): Promise<ShopifyCart> {
  if (!cartId) {
    throw new Error("Cart ID is required");
  }

  if (!lines || lines.length === 0) {
    throw new Error("At least one line item is required");
  }

  const client = createStorefrontClient(storeId);

  const mutation = `
    ${CartFields}
    ${ProductFields}
    ${VariantFields}
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  interface CartLinesAddResponse {
    cartLinesAdd: {
      cart: ShopifyCart | null;
      userErrors: UserError[];
    };
  }

  const response = await client.mutation<CartLinesAddResponse>(mutation, {
    cartId,
    lines,
  });

  // Check for user errors
  if (response.cartLinesAdd.userErrors && response.cartLinesAdd.userErrors.length > 0) {
    const errors = response.cartLinesAdd.userErrors.map((e) => e.message).join("; ");
    throw new Error(`Failed to add cart lines: ${errors}`);
  }

  if (!response.cartLinesAdd.cart) {
    throw new Error("Failed to add cart lines: No cart returned");
  }

  return response.cartLinesAdd.cart;
}

/**
 * Update cart lines
 *
 * Updates quantities or attributes of existing cart lines.
 *
 * @param cartId - Cart ID (GID format)
 * @param lines - Line items to update
 * @param storeId - Optional store identifier
 * @returns Promise resolving to updated cart
 * @throws {ShopifyAPIError} If API returns an error
 * @throws {Error} If user errors occur
 *
 * @example
 * ```typescript
 * import { updateCartLines } from '@framecraft/core/shopify';
 *
 * const updatedCart = await updateCartLines(
 *   "gid://shopify/Cart/abc123",
 *   [
 *     {
 *       id: "gid://shopify/CartLine/123",
 *       quantity: 3,
 *     }
 *   ]
 * );
 * ```
 */
export async function updateCartLines(
  cartId: string,
  lines: CartLineUpdateInput[],
  storeId?: string
): Promise<ShopifyCart> {
  if (!cartId) {
    throw new Error("Cart ID is required");
  }

  if (!lines || lines.length === 0) {
    throw new Error("At least one line item is required");
  }

  const client = createStorefrontClient(storeId);

  const mutation = `
    ${CartFields}
    ${ProductFields}
    ${VariantFields}
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  interface CartLinesUpdateResponse {
    cartLinesUpdate: {
      cart: ShopifyCart | null;
      userErrors: UserError[];
    };
  }

  const response = await client.mutation<CartLinesUpdateResponse>(mutation, {
    cartId,
    lines,
  });

  // Check for user errors
  if (response.cartLinesUpdate.userErrors && response.cartLinesUpdate.userErrors.length > 0) {
    const errors = response.cartLinesUpdate.userErrors.map((e) => e.message).join("; ");
    throw new Error(`Failed to update cart lines: ${errors}`);
  }

  if (!response.cartLinesUpdate.cart) {
    throw new Error("Failed to update cart lines: No cart returned");
  }

  return response.cartLinesUpdate.cart;
}

/**
 * Remove lines from cart
 *
 * Removes one or more line items from the cart.
 *
 * @param cartId - Cart ID (GID format)
 * @param lineIds - Line item IDs to remove (GID format)
 * @param storeId - Optional store identifier
 * @returns Promise resolving to updated cart
 * @throws {ShopifyAPIError} If API returns an error
 * @throws {Error} If user errors occur
 *
 * @example
 * ```typescript
 * import { removeCartLines } from '@framecraft/core/shopify';
 *
 * const updatedCart = await removeCartLines(
 *   "gid://shopify/Cart/abc123",
 *   [
 *     "gid://shopify/CartLine/123",
 *     "gid://shopify/CartLine/456"
 *   ]
 * );
 * ```
 */
export async function removeCartLines(
  cartId: string,
  lineIds: string[],
  storeId?: string
): Promise<ShopifyCart> {
  if (!cartId) {
    throw new Error("Cart ID is required");
  }

  if (!lineIds || lineIds.length === 0) {
    throw new Error("At least one line ID is required");
  }

  const client = createStorefrontClient(storeId);

  const mutation = `
    ${CartFields}
    ${ProductFields}
    ${VariantFields}
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  interface CartLinesRemoveResponse {
    cartLinesRemove: {
      cart: ShopifyCart | null;
      userErrors: UserError[];
    };
  }

  const response = await client.mutation<CartLinesRemoveResponse>(mutation, {
    cartId,
    lineIds,
  });

  // Check for user errors
  if (response.cartLinesRemove.userErrors && response.cartLinesRemove.userErrors.length > 0) {
    const errors = response.cartLinesRemove.userErrors.map((e) => e.message).join("; ");
    throw new Error(`Failed to remove cart lines: ${errors}`);
  }

  if (!response.cartLinesRemove.cart) {
    throw new Error("Failed to remove cart lines: No cart returned");
  }

  return response.cartLinesRemove.cart;
}

/**
 * Get cart by ID
 *
 * Retrieves a cart from Shopify by its ID.
 *
 * @param cartId - Cart ID (GID format)
 * @param storeId - Optional store identifier
 * @returns Promise resolving to cart or null if not found
 * @throws {ShopifyAPIError} If API returns an error
 *
 * @example
 * ```typescript
 * import { getCart } from '@framecraft/core/shopify';
 *
 * const cart = await getCart("gid://shopify/Cart/abc123");
 * if (cart) {
 *   console.log(`Cart has ${cart.totalQuantity} items`);
 * }
 * ```
 */
export async function getCart(cartId: string, storeId?: string): Promise<ShopifyCart | null> {
  if (!cartId) {
    throw new Error("Cart ID is required");
  }

  const client = createStorefrontClient(storeId);

  const query = `
    ${CartFields}
    ${ProductFields}
    ${VariantFields}
    query GetCart($id: ID!) {
      cart(id: $id) {
        ...CartFields
      }
    }
  `;

  interface GetCartResponse {
    cart: ShopifyCart | null;
  }

  const response = await client.query<GetCartResponse>(query, {
    id: cartId,
  });

  return response.cart;
}
