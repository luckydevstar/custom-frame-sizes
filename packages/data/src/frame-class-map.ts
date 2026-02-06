/**
 * Frame class → SKU map (from xlsx).
 * Frame classes: picture | shadowbox-full | shadowbox-subset | canvas.
 * Used to assign frameClass to each frame for designer/asset grouping.
 */

export type FrameClass = "picture" | "shadowbox-full" | "shadowbox-subset" | "canvas";

/** SKUs per frame class (from xlsx). Subset takes precedence over shadowbox-full for 10727, 10728, 10729. */
const PICTURE_SKUS = new Set([
  "206",
  "6301",
  "6711",
  "8446",
  "8575",
  "8576",
  "8694",
  "8744",
  "8745",
  "8750",
  "8752",
  "8837",
  "8838",
  "8981",
  "8989",
  "9135",
  "9160",
  "9163",
  "9667",
  "9885",
  "9932",
  "9935",
  "10485",
  "10569",
  "10570",
  "10587",
  "10588",
  "10618",
  "10712",
  "10713",
  "10714",
  "10783",
  "10827",
  "10828",
  "10829",
  "10832",
  "10833",
  "10928",
  "11153",
  "11239",
]);

const SHADOWBOX_SUBSET_SKUS = new Set(["10727", "10728", "10729"]);

const SHADOWBOX_FULL_SKUS = new Set([
  "8693",
  "8990",
  "9448",
  "9785",
  "9959",
  "10474",
  "10475",
  "10478",
  "10479",
  "10772",
  "10774",
  "10775",
  "10776",
  "10779",
  "10781",
  "10897",
  "10960",
  "84154",
  "84159",
  "84161",
  "84162",
]);

const CANVAS_SKUS = new Set([
  "10104",
  "10105",
  "10117",
  "10426",
  "10427",
  "10428",
  "10494",
  "10495",
  "10564",
  "10565",
  "10627",
  "10694",
  "10764",
  "10765",
  "10766",
  "10767",
  "11345",
  "11351",
]);

/** Map SKU → frameClass. Order: subset > canvas > shadowbox-full > picture. */
export function getFrameClass(sku: string): FrameClass {
  if (SHADOWBOX_SUBSET_SKUS.has(sku)) return "shadowbox-subset";
  if (CANVAS_SKUS.has(sku)) return "canvas";
  if (SHADOWBOX_FULL_SKUS.has(sku)) return "shadowbox-full";
  if (PICTURE_SKUS.has(sku)) return "picture";
  return "picture";
}

/** All SKUs that have a defined frame class (for lookup/validation). */
export const FRAME_CLASS_SKUS: Record<FrameClass, string[]> = {
  picture: [...PICTURE_SKUS],
  "shadowbox-subset": [...SHADOWBOX_SUBSET_SKUS],
  "shadowbox-full": [...SHADOWBOX_FULL_SKUS],
  canvas: [...CANVAS_SKUS],
};
