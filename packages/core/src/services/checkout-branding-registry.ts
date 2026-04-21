/**
 * Checkout branding for cart line attributes (_brand_logo_url / _brand_home_url).
 *
 * Each storefront calls `syncCheckoutBrandingFromBrandConfig` from `StoreProvider` with that
 * app's `brand.config.ts` so `@framecraft/core` cart helpers do not depend on env-specific
 * logo URLs or on importing app code.
 */

import type { BrandConfig } from "@framecraft/config";

import type { BrandingMetadata } from "./framecraft-api";

let storeCheckout: BrandingMetadata | undefined;

function isCheckoutBrandingDebugEnabled(): boolean {
  return (
    typeof process !== "undefined" && process.env?.NEXT_PUBLIC_DEBUG_CHECKOUT_BRANDING === "1"
  );
}

function debugLog(message: string, data?: unknown): void {
  if (!isCheckoutBrandingDebugEnabled()) return;
  if (data !== undefined) {
    console.log(`[FrameCraft checkout branding] ${message}`, data);
  } else {
    console.log(`[FrameCraft checkout branding] ${message}`);
  }
}

export function syncCheckoutBrandingFromBrandConfig(config: BrandConfig): void {
  const c = config.checkout;
  if (!c?.logoUrl?.trim() && !c?.homeUrl?.trim()) {
    storeCheckout = undefined;
    debugLog("sync: brand config has no checkout.logoUrl / checkout.homeUrl — cleared store cache");
    return;
  }
  storeCheckout = {
    logoUrl: c.logoUrl?.trim() || undefined,
    homeUrl: c.homeUrl?.trim() || undefined,
  };
  debugLog("sync from brand.config.checkout", storeCheckout);
}

export function isCheckoutBrandingDebugOn(): boolean {
  return isCheckoutBrandingDebugEnabled();
}

/**
 * Log cart line attribute keys (and _brand_* values) from an API `cart` object — use instead of Vercel logs.
 */
export function logCheckoutBrandingCartSnapshot(label: string, cart: unknown): void {
  if (!isCheckoutBrandingDebugEnabled()) return;
  if (!cart || typeof cart !== "object") return;
  const c = cart as {
    id?: string;
    lines?: Array<{
      id?: string;
      attributes?: Array<{ key: string; value: string }>;
    }>;
  };
  const lines = c.lines ?? [];
  const summary = lines.map((line, i) => ({
    lineIndex: i,
    lineId: line.id,
    attributeKeys: (line.attributes ?? []).map((a) => a.key),
    brandAttrs: (line.attributes ?? []).filter((a) => a.key.startsWith("_brand_")),
  }));
  console.log(`[FrameCraft checkout branding][cart snapshot] ${label}`, {
    cartId: c.id,
    lineCount: lines.length,
    lines: summary,
  });
}

/** Log a full JSON response body (e.g. fresh-checkout) when debugging — redact if you add secrets later. */
export function logCheckoutBrandingJson(label: string, body: unknown): void {
  if (!isCheckoutBrandingDebugEnabled()) return;
  console.log(`[FrameCraft checkout branding][response] ${label}`, body);
}

function checkoutBrandingFromEnv(): BrandingMetadata | undefined {
  if (typeof process === "undefined") return undefined;
  const logoUrl = process.env?.NEXT_PUBLIC_CHECKOUT_LOGO_URL?.trim() || undefined;
  const homeUrl = process.env?.NEXT_PUBLIC_CHECKOUT_HOME_URL?.trim() || undefined;
  if (!logoUrl && !homeUrl) return undefined;
  return { logoUrl, homeUrl };
}

/**
 * Merge order: explicit argument → brand config (via StoreProvider) → optional env override.
 */
export function resolveCheckoutBrandingMetadata(
  explicit?: BrandingMetadata
): BrandingMetadata | undefined {
  const envBranding = checkoutBrandingFromEnv();
  const logoUrl =
    explicit?.logoUrl?.trim() || storeCheckout?.logoUrl || envBranding?.logoUrl;
  const homeUrl =
    explicit?.homeUrl?.trim() || storeCheckout?.homeUrl || envBranding?.homeUrl;
  if (!logoUrl && !homeUrl) {
    debugLog("resolve: no branding (explicit, store, or env)", {
      hasExplicit: Boolean(explicit?.logoUrl || explicit?.homeUrl),
      hasStore: Boolean(storeCheckout?.logoUrl || storeCheckout?.homeUrl),
      hasEnv: Boolean(envBranding?.logoUrl || envBranding?.homeUrl),
    });
    return undefined;
  }
  const resolved = { logoUrl, homeUrl };
  debugLog("resolve → will send to API", resolved);
  return resolved;
}
