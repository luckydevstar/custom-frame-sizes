import { getStoreBaseAssetUrl, resolveFramePhotoUrl } from "@framecraft/core";

import type { PictureFramesGatewayItem } from "./picture-frames-gateway.types";

/** Resolved URL for gateway cards / detail hero — safe for client bundles. */
export function pictureFramesGatewayHeroSrc(item: PictureFramesGatewayItem): string | undefined {
  if (typeof item.imageUrl === "string" && item.imageUrl.trim() !== "") {
    return resolveFramePhotoUrl(item.imageUrl.trim());
  }
  if (typeof item.imageId === "string" && item.imageId.trim() !== "") {
    return getStoreBaseAssetUrl(`stock_images/${item.imageId.trim()}.jpg`);
  }
  return undefined;
}
