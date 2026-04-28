import { getFrameSlug, getFrameStyles } from "@framecraft/core";

/** Resolve `/shadowbox/:slug` pathname segment → internal frame ID (SEO slug === getFrameSlug). */
export function getShadowboxFrameIdBySlug(slug: string): string | null {
  for (const frame of getFrameStyles()) {
    if (frame.category !== "shadowbox") continue;
    if (getFrameSlug(frame.id) === slug) return frame.id;
  }
  return null;
}
