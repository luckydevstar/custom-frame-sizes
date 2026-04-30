import { getFrameSlug, getFrameStyleById, getFrameStyles } from "@framecraft/core";

import type { FrameStyle } from "@framecraft/types";

/**
 * Resolves catalogue frame rows for `/frames/[slug]`.
 *
 * Accepts raw frame ids (`wide-black`), SEO URLs from {@link getFrameSlug} (`wide-black-frame`),
 * or any slug where `getFrameSlug(frame.id) === slug`.
 */
export function resolvePictureFrameSlug(slug: string): FrameStyle | undefined {
  const byExactId = getFrameStyleById(slug);
  if (byExactId) {
    return byExactId;
  }

  if (slug.endsWith("-frame")) {
    const stripped = slug.slice(0, -"-frame".length);
    const byStrip = getFrameStyleById(stripped);
    if (byStrip) {
      return byStrip;
    }
  }

  for (const frame of getFrameStyles()) {
    if (getFrameSlug(frame.id) === slug) {
      return frame;
    }
  }

  return undefined;
}

export function canonicalPictureFrameSlug(frame: FrameStyle): string {
  return getFrameSlug(frame.id);
}
