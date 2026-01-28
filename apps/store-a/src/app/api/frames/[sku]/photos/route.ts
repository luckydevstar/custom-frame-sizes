import { NextRequest, NextResponse } from "next/server";
import { getFrameStyles, getFrameImageUrl, getSharedAssetUrl } from "@framecraft/core";

/**
 * GET /api/frames/[sku]/photos
 * Returns frame photo URLs for a given SKU
 *
 * Uses CDN URLs (Cloudflare R2) for all frame images
 *
 * Randomly selects from actual lifestyle images available in frames.json
 * Converts local paths to CDN URLs using getSharedAssetUrl()
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
        return getSharedAssetUrl(localPath);
      }

      return undefined;
    };

    // Get image URLs from alternateImages
    const cornerUrl = getImageByType("corner");
    const profileUrl = getImageByType("profile");
    const lifestyleUrl = getImageByType("lifestyle", true); // Random lifestyle

    // For top/bottom/left/right, check frame.photos first, then fallback to alternateImages
    const topUrl = frame.photos?.topUrl
      ? getSharedAssetUrl(
          frame.photos.topUrl.startsWith("/") ? frame.photos.topUrl.slice(1) : frame.photos.topUrl
        )
      : getImageByType("top") || getFrameImageUrl(sku, "top");

    const bottomUrl = frame.photos?.bottomUrl
      ? getSharedAssetUrl(
          frame.photos.bottomUrl.startsWith("/")
            ? frame.photos.bottomUrl.slice(1)
            : frame.photos.bottomUrl
        )
      : getImageByType("bottom") || getFrameImageUrl(sku, "bottom");

    const leftUrl = frame.photos?.leftUrl
      ? getSharedAssetUrl(
          frame.photos.leftUrl.startsWith("/")
            ? frame.photos.leftUrl.slice(1)
            : frame.photos.leftUrl
        )
      : getImageByType("left") || getFrameImageUrl(sku, "left");

    const rightUrl = frame.photos?.rightUrl
      ? getSharedAssetUrl(
          frame.photos.rightUrl.startsWith("/")
            ? frame.photos.rightUrl.slice(1)
            : frame.photos.rightUrl
        )
      : getImageByType("right") || getFrameImageUrl(sku, "right");

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
