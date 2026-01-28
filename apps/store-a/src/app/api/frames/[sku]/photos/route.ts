import { NextRequest, NextResponse } from "next/server";
import { getFrameStyles } from "@framecraft/core";
import { getSharedAssetUrl } from "@framecraft/core";
import fs from "fs";
import path from "path";

/**
 * GET /api/frames/[sku]/photos
 * Returns frame photo URLs for a given SKU
 *
 * Reads from filesystem at public/frames/{sku}/ directory
 * Falls back to frame data JSON if directory doesn't exist
 *
 * Returns:
 * {
 *   sku: string,
 *   topUrl: string | undefined,
 *   bottomUrl: string | undefined,
 *   leftUrl: string | undefined,
 *   rightUrl: string | undefined,
 *   cornerUrl: string | undefined,
 *   profileUrl: string | undefined,
 *   lifestyleUrl: string | undefined,
 * }
 */
export async function GET(request: NextRequest, { params }: { params: { sku: string } }) {
  const { sku } = params;

  if (!sku || typeof sku !== "string") {
    return NextResponse.json({ error: "SKU is required" }, { status: 400 });
  }

  try {
    // Get public directory path
    const publicPath = path.join(process.cwd(), "public", "frames", sku);

    // Check if directory exists
    if (!fs.existsSync(publicPath)) {
      // Fallback: Try to find frame in JSON data
      const frames = getFrameStyles();
      const frame = frames.find((f) => f.sku === sku);

      if (frame && frame.photos) {
        // Convert frame.photos URLs to CDN URLs if available
        return NextResponse.json({
          sku,
          cornerUrl: frame.photos.cornerUrl
            ? getSharedAssetUrl(frame.photos.cornerUrl.replace(/^\//, ""))
            : undefined,
          profileUrl: frame.photos.profileUrl
            ? getSharedAssetUrl(frame.photos.profileUrl.replace(/^\//, ""))
            : undefined,
          lifestyleUrl: frame.photos.lifestyleUrl
            ? getSharedAssetUrl(frame.photos.lifestyleUrl.replace(/^\//, ""))
            : undefined,
          topUrl: frame.photos.topUrl
            ? getSharedAssetUrl(frame.photos.topUrl.replace(/^\//, ""))
            : undefined,
          bottomUrl: frame.photos.bottomUrl
            ? getSharedAssetUrl(frame.photos.bottomUrl.replace(/^\//, ""))
            : undefined,
          leftUrl: frame.photos.leftUrl
            ? getSharedAssetUrl(frame.photos.leftUrl.replace(/^\//, ""))
            : undefined,
          rightUrl: frame.photos.rightUrl
            ? getSharedAssetUrl(frame.photos.rightUrl.replace(/^\//, ""))
            : undefined,
        });
      }

      return NextResponse.json(
        {
          error: "Frame photos not found",
          message: `No photos found for SKU: ${sku}`,
        },
        { status: 404 }
      );
    }

    // Read local directory
    const files = fs.readdirSync(publicPath);

    // Helper to find file with various extensions
    // Supports both standard naming (top.jpg) and SKU-prefixed naming (10772_top.jpg)
    const findFile = (basename: string): string | undefined => {
      const extensions = [".jpg", ".jpeg", ".png", ".webp"];
      for (const ext of extensions) {
        // First try exact match for standard naming (e.g., 'top.jpg')
        const file = files.find((f) => f.toLowerCase() === `${basename}${ext}`);
        if (file) {
          // Use CDN URL helper to get proper URL (CDN or local)
          return getSharedAssetUrl(`frames/${sku}/${file}`);
        }

        // Fallback: try with SKU prefix (e.g., '10772_top.jpg')
        const fileWithSku = files.find((f) => f.toLowerCase() === `${sku}_${basename}${ext}`);
        if (fileWithSku) {
          return getSharedAssetUrl(`frames/${sku}/${fileWithSku}`);
        }
      }
      return undefined;
    };

    // Helper to find file by pattern match (prioritize standard naming over variants)
    const findFileByPattern = (pattern: string): string | undefined => {
      // First try exact match for standard naming (A variant)
      const exactFile = findFile(pattern);
      if (exactFile) return exactFile;

      // Fall back to pattern match only if standard naming doesn't exist
      // Exclude B/C variants by filtering them out
      const file = files.find(
        (f) =>
          f.toLowerCase().includes(pattern.toLowerCase()) &&
          !f.toLowerCase().includes("-b.") &&
          !f.toLowerCase().includes("-c.") &&
          !f.toLowerCase().includes("_b.") &&
          !f.toLowerCase().includes("_c.")
      );
      return file ? getSharedAssetUrl(`frames/${sku}/${file}`) : undefined;
    };

    // Map files to photo categories - four pre-oriented images for 2D rendering
    const photoSet = {
      sku,
      // Four pre-oriented frame images (top, bottom, left, right)
      topUrl: findFile("top"),
      bottomUrl: findFile("bottom"),
      leftUrl: findFile("left"),
      rightUrl: findFile("right"),
      // Additional photos for gallery view - prioritize standard naming
      cornerUrl: findFileByPattern("corner"),
      // Profile images may be named "profile" or "pro-a" (variant A pattern)
      profileUrl: findFileByPattern("profile") || findFileByPattern("-pro-a"),
      lifestyleUrl: findFileByPattern("lifestyle"),
    };

    return NextResponse.json(photoSet);
  } catch (error) {
    console.error(`Error fetching frame photos for SKU ${sku}:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
