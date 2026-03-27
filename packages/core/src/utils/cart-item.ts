/**
 * Build cart store input from frame configuration and price.
 * Used when adding a custom frame to the cart (Cart Transform / Shopify Plus flow).
 *
 * Price is in dollars; stored cart item price is in cents.
 */

import { getFrameStyleById } from "../services/products";

import type { AddCartItemInput } from "../stores/cart-store";
import type { FrameConfiguration } from "@framecraft/types";

const DEFAULT_FRAME_VARIANT_ID =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SHOPIFY_FRAME_VARIANT_ID) || null;
const MOCK_VARIANT_ID = "gid://shopify/ProductVariant/mock";

/**
 * Create AddCartItemInput for the cart store from a frame configuration.
 *
 * @param config - Frame configuration from the designer
 * @param priceDollars - Total price for one unit (in dollars)
 * @param quantity - Quantity to add
 * @param options - Optional image URL and product title override
 */
export function createCartItemFromFrameConfig(
  config: FrameConfiguration,
  priceDollars: number,
  quantity: number = 1,
  options?: { imageUrl?: string | null; productTitle?: string }
): AddCartItemInput {
  const frameStyle = getFrameStyleById(config.frameStyleId);
  const variantId =
    (frameStyle as { shopifyVariantId?: string | null })?.shopifyVariantId ||
    DEFAULT_FRAME_VARIANT_ID ||
    MOCK_VARIANT_ID;

  const title = options?.productTitle ?? "Custom Picture Frame";
  const frameName = frameStyle?.name ?? config.frameStyleId;

  return {
    variantId,
    productHandle: "custom-frame",
    title,
    variantTitle: `${frameName} · ${config.artworkWidth}" × ${config.artworkHeight}"`,
    imageUrl: options?.imageUrl ?? config.imageUrl ?? null,
    price: Math.round(priceDollars * 100), // store uses cents
    currency: "USD",
    quantity,
    configuration: config,
  };
}
