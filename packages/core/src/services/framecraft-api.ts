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

export interface BrandingMetadata {
  logoUrl?: string;
  homeUrl?: string;
  /** Cart attribute `_fc_store_code` — webhook writes Shopify metafield `custom.store_code`. */
  storeCode?: string;
}

export interface FramecraftCart {
  id: string;
  checkoutUrl?: string | null;
  /** Cart-level attributes (e.g. `_fc_brand_*` for checkout UI extension). */
  attributes?: Array<{ key: string; value: string }>;
  cost: {
    subtotalAmount?: { amount: string; currencyCode: string };
    totalAmount?: { amount: string; currencyCode: string };
  };
  lines: Array<{
    id: string;
    quantity: number;
    attributes?: Array<{ key: string; value: string }>;
    merchandise: { id: string; title?: string };
  }>;
}

function debugCheckoutApi(message: string, data?: unknown): void {
  if (typeof process === "undefined" || process.env?.NEXT_PUBLIC_DEBUG_CHECKOUT_BRANDING !== "1") {
    return;
  }
  if (data !== undefined) {
    console.log(`[FrameCraft checkout branding][API] ${message}`, data);
  } else {
    console.log(`[FrameCraft checkout branding][API] ${message}`);
  }
}

/** Echo of Shopify cart from API — confirms branding cart + line attributes without Vercel logs. */
function logCartEchoIfDebug(method: string, path: string, cart: FramecraftCart): void {
  if (typeof process === "undefined" || process.env?.NEXT_PUBLIC_DEBUG_CHECKOUT_BRANDING !== "1") {
    return;
  }
  const summary = cart.lines.map((line, i) => ({
    lineIndex: i,
    lineId: line.id,
    attributeKeys: (line.attributes ?? []).map((a) => a.key),
    brandAttrs: (line.attributes ?? []).filter(
      (a) => a.key.startsWith("_brand_") || a.key.startsWith("fc_brand_")
    ),
  }));
  console.log(`[FrameCraft checkout branding][API response] ${method} ${path}`, {
    cartId: cart.id,
    cartAttributeKeys: (cart.attributes ?? []).map((a) => a.key),
    cartBrandAttrs: (cart.attributes ?? []).filter((a) => a.key.startsWith("_fc_brand_")),
    lineCount: cart.lines.length,
    lines: summary,
  });
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const base = getApiBase();
  const url = base ? `${base}${path}` : path;
  if (path.includes("/api/cart") && body && typeof body === "object") {
    const b = body as Record<string, unknown>;
    if (b.branding != null) {
      debugCheckoutApi(`${method} ${path} body includes branding`, b.branding);
    }
  }
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
  const payload = data as { cart?: FramecraftCart };
  if (payload.cart && path.includes("/api/cart")) {
    logCartEchoIfDebug(method, path, payload.cart);
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
 * Add configured lines to the cart with optional branding metadata.
 * cartId can be omitted if cookie is set.
 */
export async function addCartLines(
  lines: FramecraftCartLineInput[],
  cartId?: string,
  branding?: BrandingMetadata
): Promise<FramecraftCart> {
  const body = cartId ? { cartId, lines, branding } : { lines, branding };
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
