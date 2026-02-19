import { NextRequest, NextResponse } from "next/server";
import { getFrameStyles, getFrameImageUrl, getStoreBaseAssetUrl } from "@framecraft/core";

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
        return getStoreBaseAssetUrl(localPath);
      }

      return undefined;
    };

    // Many frames (e.g. shadowbox 9448) use type "designer" with edge_top.jpg, edge_bottom.jpg, etc.
    // Resolve top/bottom/left/right from these when type "top"/"bottom" is not present.
    const getDesignerEdgeUrl = (
      edgeName: "edge_top" | "edge_bottom" | "edge_left" | "edge_right"
    ): string | undefined => {
      const img = frame.alternateImages?.find(
        (i: { type: string; url: string }) =>
          i.type === "designer" && i.url && i.url.includes(edgeName)
      );
      if (!img?.url) return undefined;
      const localPath = img.url.startsWith("/") ? img.url.slice(1) : img.url;
      return getStoreBaseAssetUrl(localPath);
    };

    // Get image URLs from alternateImages
    const cornerUrl = getImageByType("corner");
    const profileUrl = getImageByType("profile");
    const lifestyleUrl = getImageByType("lifestyle", true); // Random lifestyle

    // For top/bottom/left/right: frame.photos > type "top"/"bottom"/... > designer edge_* > getFrameImageUrl (top.jpg etc.)
    const topUrl = frame.photos?.topUrl
      ? getStoreBaseAssetUrl(
          frame.photos.topUrl.startsWith("/") ? frame.photos.topUrl.slice(1) : frame.photos.topUrl
        )
      : getImageByType("top") || getDesignerEdgeUrl("edge_top") || getFrameImageUrl(sku, "top");

    const bottomUrl = frame.photos?.bottomUrl
      ? getStoreBaseAssetUrl(
          frame.photos.bottomUrl.startsWith("/")
            ? frame.photos.bottomUrl.slice(1)
            : frame.photos.bottomUrl
        )
      : getImageByType("bottom") ||
        getDesignerEdgeUrl("edge_bottom") ||
        getFrameImageUrl(sku, "bottom");

    const leftUrl = frame.photos?.leftUrl
      ? getStoreBaseAssetUrl(
          frame.photos.leftUrl.startsWith("/")
            ? frame.photos.leftUrl.slice(1)
            : frame.photos.leftUrl
        )
      : getImageByType("left") || getDesignerEdgeUrl("edge_left") || getFrameImageUrl(sku, "left");

    const rightUrl = frame.photos?.rightUrl
      ? getStoreBaseAssetUrl(
          frame.photos.rightUrl.startsWith("/")
            ? frame.photos.rightUrl.slice(1)
            : frame.photos.rightUrl
        )
      : getImageByType("right") ||
        getDesignerEdgeUrl("edge_right") ||
        getFrameImageUrl(sku, "right");

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
