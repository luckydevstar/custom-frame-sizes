import { getFramesByCategory } from "@framecraft/core";

import { seo } from "@/lib/seo";

import type { MetadataRoute } from "next";

/**
 * Sitemap for store-a. Composed via `@framecraft/seo.createSitemap` so:
 *   - canonical URLs are derived from the brand config (no hardcoded host)
 *   - featured frames are bumped to higher priority
 *   - lastModified for the homepage uses the build timestamp; static pages
 *     fall back to a recent-ish date so crawlers see meaningful timestamps.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const staticEntries = [
    { url: "/", lastModified: now, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: "/designer", lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: "/mat-designer", lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: "/shadowbox/designer", lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: "/diploma/designer", lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: "/certificate/designer", lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    // Company pages
    { url: "/about", lastModified: oneMonthAgo, changeFrequency: "yearly" as const, priority: 0.6 },
    { url: "/contact", lastModified: oneMonthAgo, changeFrequency: "yearly" as const, priority: 0.6 },
    // Category landing pages
    { url: "/picture-frames", lastModified: oneMonthAgo, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: "/shadowbox-frames", lastModified: oneMonthAgo, changeFrequency: "monthly" as const, priority: 0.75 },
    { url: "/diploma-frames", lastModified: oneMonthAgo, changeFrequency: "monthly" as const, priority: 0.75 },
    { url: "/certificate-frames", lastModified: oneMonthAgo, changeFrequency: "monthly" as const, priority: 0.75 },
    { url: "/specialty-frames", lastModified: oneMonthAgo, changeFrequency: "monthly" as const, priority: 0.75 },
    // Learn / resources pages
    { url: "/faq", lastModified: oneMonthAgo, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: "/learn", lastModified: oneMonthAgo, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: "/gallery-wall-guide", lastModified: oneMonthAgo, changeFrequency: "monthly" as const, priority: 0.65 },
    { url: "/components", lastModified: oneMonthAgo, changeFrequency: "monthly" as const, priority: 0.65 },
  ];

  const dynamicEntries: { url: string; lastModified: Date; changeFrequency: "monthly"; priority: number }[] = [];
  try {
    for (const category of ["picture", "shadowbox"] as const) {
      const frames = getFramesByCategory(category);
      for (const frame of frames) {
        dynamicEntries.push({
          url: `/frames/${frame.id}`,
          lastModified: oneMonthAgo,
          changeFrequency: "monthly",
          priority: frame.featured ? 0.8 : 0.65,
        });
      }
    }
  } catch {
    // Catalog unavailable at build time — keep static entries only.
  }

  return seo.sitemap({ staticEntries, dynamicEntries });
}
