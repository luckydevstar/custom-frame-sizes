import { NextRequest, NextResponse } from "next/server";
import { getFrameStyles, getStoreBaseAssetUrl } from "@framecraft/core";

function getCdnBase(): string | null {
  const url = typeof process !== "undefined" && process.env?.NEXT_PUBLIC_CDN_STORE_A_URL;
  return url ? String(url).replace(/\/$/, "") : null;
}

function toFullUrl(path: string | undefined, cdnBase: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.startsWith("/") ? path.slice(1) : path;
  if (cdnBase) return `${cdnBase}/${clean}`;
  return getStoreBaseAssetUrl(clean);
}

/**
 * GET /api/frames/[sku]/photos
 * Returns frame photo URLs for a given SKU
 *
 * Uses store-a CDN URLs for all frame images
 *
 * Randomly selects from actual lifestyle images available in frames.json
 * Converts local paths to CDN URLs using getStoreBaseAssetUrl()
 *
 * Returns:
 * {
 *   sku: string,
 *   topUrl: string,
 *   bottomUrl: string,
 *   leftUrl: string,
 *   rightUrl: string,
 *   cornerUrl: string,
 *   profileUrl: string,
 *   lifestyleUrl: string,
 * }
 */
export async function GET(_request: NextRequest, { params }: { params: { sku: string } }) {
  const { sku } = params;

  if (!sku || typeof sku !== "string") {
    return NextResponse.json({ error: "SKU is required" }, { status: 400 });
  }

  try {
    // Find frame in JSON data
    const frames = getFrameStyles();
    const frame = frames.find((f) => f.sku === sku);

    if (!frame) {
      return NextResponse.json(
        { error: "Frame not found", message: `No frame found for SKU: ${sku}` },
        { status: 404 }
      );
    }

    const cdnBase = getCdnBase();

    // Helper function to get image URL by type from alternateImages
    const getImageByType = (type: string, pickRandom = false): string | undefined => {
      if (!frame.alternateImages) return undefined;

      const images = frame.alternateImages.filter(
        (img: { type: string; url: string }) => img.type === type
      );

      if (images.length === 0) return undefined;

      // Pick random if requested (for lifestyle images)
      const selectedImage = pickRandom
        ? images[Math.floor(Math.random() * images.length)]
        : images[0]; // Otherwise pick first one

      if (selectedImage?.url) {
        const localPath = selectedImage.url.startsWith("/")
          ? selectedImage.url.slice(1)
          : selectedImage.url;
        return toFullUrl(localPath, cdnBase);
      }

      return undefined;
    };

    // Many frames use type "designer" for edge images:
    // - edge_top.jpg, edge_bottom.jpg (e.g. shadowbox 9448)
    // - 10728_top.jpg, 10728_bottom.jpg (SKU-prefixed, e.g. bouquet frames 10727/10728/10729)
    const getDesignerEdgeUrl = (
      edgeName: "edge_top" | "edge_bottom" | "edge_left" | "edge_right"
    ): string | undefined => {
      const patterns = [
        edgeName, // edge_top, edge_bottom, etc.
        edgeName.replace("edge_", "_"), // _top, _bottom, _left, _right for SKU-prefixed filenames
      ];
      const img = frame.alternateImages?.find(
        (i: { type: string; url: string }) =>
          i.type === "designer" && i.url && patterns.some((p) => i.url.includes(p))
      );
      if (!img?.url) return undefined;
      const localPath = img.url.startsWith("/") ? img.url.slice(1) : img.url;
      return toFullUrl(localPath, cdnBase);
    };

    // Get image URLs from alternateImages
    const cornerUrl = getImageByType("corner");
    const profileUrl = getImageByType("profile");
    const lifestyleUrl = getImageByType("lifestyle", true); // Random lifestyle

    // For top/bottom/left/right: frame.photos > type "top"/"bottom"/... > designer edge_* > getFrameImageUrl (top.jpg etc.)
    const topUrl = frame.photos?.topUrl
      ? toFullUrl(
          frame.photos.topUrl.startsWith("/") ? frame.photos.topUrl.slice(1) : frame.photos.topUrl,
          cdnBase
        )
      : getImageByType("top") ||
        getDesignerEdgeUrl("edge_top") ||
        toFullUrl(`frames/${sku}/top.jpg`, cdnBase);

    const bottomUrl = frame.photos?.bottomUrl
      ? toFullUrl(
          frame.photos.bottomUrl.startsWith("/")
            ? frame.photos.bottomUrl.slice(1)
            : frame.photos.bottomUrl,
          cdnBase
        )
      : getImageByType("bottom") ||
        getDesignerEdgeUrl("edge_bottom") ||
        toFullUrl(`frames/${sku}/bottom.jpg`, cdnBase);

    const leftUrl = frame.photos?.leftUrl
      ? toFullUrl(
          frame.photos.leftUrl.startsWith("/")
            ? frame.photos.leftUrl.slice(1)
            : frame.photos.leftUrl,
          cdnBase
        )
      : getImageByType("left") ||
        getDesignerEdgeUrl("edge_left") ||
        toFullUrl(`frames/${sku}/left.jpg`, cdnBase);

    const rightUrl = frame.photos?.rightUrl
      ? toFullUrl(
          frame.photos.rightUrl.startsWith("/")
            ? frame.photos.rightUrl.slice(1)
            : frame.photos.rightUrl,
          cdnBase
        )
      : getImageByType("right") ||
        getDesignerEdgeUrl("edge_right") ||
        toFullUrl(`frames/${sku}/right.jpg`, cdnBase);

    return NextResponse.json({
      sku,
      cornerUrl,
      profileUrl,
      lifestyleUrl,
      topUrl,
      bottomUrl,
      leftUrl,
      rightUrl,
    });
  } catch (error) {
    console.error(`Error fetching frame photos for SKU ${sku}:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
