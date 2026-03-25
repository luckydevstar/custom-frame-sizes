/**
 * FrameCraft Backend API Client
 *
 * Calls the deployed FrameCraft API (e.g. https://dev-api.customframesizes.com) for
 * cart create/get, add lines with configuration, and checkout URL.
 * Set NEXT_PUBLIC_API_URL to the API base (e.g. https://dev-api.customframesizes.com).
 * Uses credentials: "include" so the API can set/read the cart cookie when same-site or CORS allows.
 */

import type { FrameConfiguration } from "@framecraft/types";

const getApiBase = (): string => {
  const base = (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) || "";
  return base.replace(/\/$/, "");
};

export function isFramecraftApiConfigured(): boolean {
  return getApiBase().length > 0;
}

export interface FramecraftCartLineInput {
  merchandiseId: string;
  quantity: number;
  configuration: FrameConfiguration;
  priceCents?: number; // Optional: pre-calculated price in cents from frontend
}

export interface FramecraftCart {
  id: string;
  checkoutUrl?: string | null;
  cost: {
    subtotalAmount?: { amount: string; currencyCode: string };
    totalAmount?: { amount: string; currencyCode: string };
  };
  lines: Array<{ id: string; quantity: number; merchandise: { id: string; title?: string } }>;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const base = getApiBase();
  const url = base ? `${base}${path}` : path;
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  const data = (await res.json()) as {
    success?: boolean;
    error?: { code: string; message: string };
    cart?: FramecraftCart;
    checkoutUrl?: string;
  };
  if (!res.ok) {
    const msg = data?.error?.message || res.statusText;
    throw new Error(`${res.status}: ${msg}`);
  }
  if (data.success === false && data.error) {
    throw new Error(data.error.message || data.error.code || "API error");
  }
  return data as T;
}

/**
 * Create a new cart or get existing cart by id/cookie.
 *
 * @param cartId - Cart ID to retrieve. If null, forces creation of new cart. If undefined, uses cookie.
 */
export async function createOrGetCart(cartId?: string | null): Promise<FramecraftCart> {
  const body = cartId !== undefined ? { cartId } : {};
  const data = await request<{ cart: FramecraftCart }>("POST", "/api/cart", body);
  if (!data.cart) throw new Error("No cart in response");
  return data.cart;
}

/**
 * Add configured lines to the cart. cartId can be omitted if cookie is set.
 */
export async function addCartLines(
  lines: FramecraftCartLineInput[],
  cartId?: string
): Promise<FramecraftCart> {
  const body = cartId ? { cartId, lines } : { lines };
  const data = await request<{ cart: FramecraftCart }>("POST", "/api/cart/lines", body);
  if (!data.cart) throw new Error("No cart in response");
  return data.cart;
}

/**
 * Get checkout URL for the current cart (uses cookie if no cartId).
 */
export async function getCheckoutUrl(cartId?: string): Promise<string> {
  const data = await request<{ checkoutUrl: string }>(
    "POST",
    "/api/checkout",
    cartId ? { cartId } : {}
  );
  if (!data.checkoutUrl) throw new Error("No checkout URL in response");
  return data.checkoutUrl;
}
