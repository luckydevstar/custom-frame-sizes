/**
 * Build cart store input from frame configuration and price.
 * Used when adding a custom frame to the cart (Cart Transform / Shopify Plus flow).
 *
 * Price is in dollars; stored cart item price is in cents.
 */

import { getFrameStyleById } from "../services/products";

import type { AddCartItemInput } from "../stores/cart-store";
import type { FrameConfiguration } from "@framecraft/types";

function formatInchesDisplay(inches: number): string {
  const rounded = Math.round(inches * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded);
}

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

  const isGradedCard = Boolean(config.cardFormatId && config.cardLayoutId);
  const title =
    options?.productTitle ?? (isGradedCard ? "Graded Card Frame" : "Custom Picture Frame");
  const frameName = frameStyle?.name ?? config.frameStyleId;

  let variantTitle: string;
  if (
    isGradedCard &&
    typeof config.cardInteriorWidthIn === "number" &&
    typeof config.cardInteriorHeightIn === "number" &&
    frameStyle
  ) {
    const mw = frameStyle.mouldingWidth ?? 0.75;
    const outerW = config.cardInteriorWidthIn + 2 * mw;
    const outerH = config.cardInteriorHeightIn + 2 * mw;
    variantTitle = `${frameName} - ${formatInchesDisplay(outerW)} × ${formatInchesDisplay(outerH)}`;
  } else {
    variantTitle = `${frameName} · ${config.artworkWidth}" × ${config.artworkHeight}"`;
  }

  return {
    variantId,
    productHandle: "custom-frame",
    title,
    variantTitle,
    imageUrl: options?.imageUrl ?? config.imageUrl ?? null,
    price: Math.round(priceDollars * 100), // store uses cents
    currency: "USD",
    quantity,
    configuration: config,
  };
}
