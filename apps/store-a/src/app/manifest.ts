import { seo } from "@/lib/seo";

import type { MetadataRoute } from "next";

/**
 * Web App Manifest for store-a.
 *
 * Drives Add-to-Home-Screen + theme-color on mobile browsers. Theme color is
 * read from the brand config (`theme.brandColors.primary`) so each storefront
 * has its own identity without code changes.
 */
export default function manifest(): MetadataRoute.Manifest {
  return seo.manifest({
    backgroundColor: "#ffffff",
  });
}
