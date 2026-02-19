import { getFrameStyles, getStoreBaseAssetUrl } from "@framecraft/core";
import type { FrameStyle } from "@framecraft/types";

const MILITARY_ALT_KEYWORDS = [
  "military",
  "veteran",
  "medal",
  "vfw",
  "flag",
  "service",
  "armed forces",
  "memorial",
  "ribbon",
  "dog tag",
  "rank insignia",
];

function altIsMilitaryRelated(alt: string): boolean {
  const lower = alt.toLowerCase();
  return MILITARY_ALT_KEYWORDS.some((k) => lower.includes(k));
}

/**
 * Collects lifestyle images from shadowbox frames that depict military/veteran
 * displays. Uses existing frame data only — no new uploads. All URLs are
 * resolved via getStoreBaseAssetUrl for CDN/local.
 */
export function getMilitaryLifestyleImages(): { url: string; alt: string }[] {
  const frames = getFrameStyles();
  const shadowboxFrames = frames.filter((f) => f.category === "shadowbox");
  const seen = new Set<string>();
  const result: { url: string; alt: string }[] = [];
  const maxImages = 8;

  for (const frame of shadowboxFrames) {
    const lifestyleImages =
      frame.alternateImages?.filter(
        (img) => img.type === "lifestyle" && altIsMilitaryRelated(img.alt ?? "")
      ) ?? [];
    for (const img of lifestyleImages) {
      const localPath = img.url.startsWith("/") ? img.url.slice(1) : img.url;
      if (seen.has(localPath) || result.length >= maxImages) continue;
      seen.add(localPath);
      result.push({
        url: getStoreBaseAssetUrl(localPath),
        alt: img.alt ?? "Military shadowbox display",
      });
    }
    if (result.length >= maxImages) break;
  }

  return result;
}

/**
 * Returns shadowbox frames suitable for military display. Used for the
 * "Frame options" showcase. Prefers frames with deeper depth (e.g. 2").
 */
export function getMilitaryShadowboxFrames(): FrameStyle[] {
  const frames = getFrameStyles();
  const shadowbox = frames.filter((f) => f.category === "shadowbox");
  // Prefer frames with usableDepth >= 1.25 for medals; then sort by depth desc, take 6
  const sorted = [...shadowbox].sort((a, b) => {
    const depthA = a.usableDepth ?? 0;
    const depthB = b.usableDepth ?? 0;
    return depthB - depthA;
  });
  return sorted.slice(0, 6);
}

/**
 * Corner/thumbnail URL for a frame for use in military page showcase.
 */
export function getFrameCornerImage(frame: FrameStyle): { url: string; alt: string } {
  const cornerImage = frame.alternateImages?.find((img) => img.type === "corner");
  if (cornerImage) {
    const localPath = cornerImage.url.startsWith("/") ? cornerImage.url.slice(1) : cornerImage.url;
    return {
      url: getStoreBaseAssetUrl(localPath),
      alt: cornerImage.alt ?? `${frame.name} frame corner`,
    };
  }
  const thumb = frame.thumbnail;
  const localPath = thumb?.startsWith("/") ? thumb.slice(1) : (thumb ?? "");
  return {
    url: getStoreBaseAssetUrl(localPath),
    alt: `${frame.name} frame`,
  };
}
