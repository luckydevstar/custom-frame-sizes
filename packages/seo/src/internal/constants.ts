/** Default OG image path; brands override via `seo.ogImage`. */
export const DEFAULT_OG_PATH = "/assets/og-image.jpg";

/** Default Twitter image path; brands override via `seo.twitterImage`. */
export const DEFAULT_TWITTER_PATH = "/assets/og-image.jpg";

/** Soft caps used when truncating titles/descriptions for SERPs. */
export const META_LIMITS = {
  titleMax: 60,
  descriptionMax: 155,
  descriptionMin: 120,
} as const;
