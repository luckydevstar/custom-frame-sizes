import { seo } from "@/lib/seo";

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return seo.robots({
    disallow: ["/api/", "/admin/", "/cart/*", "/_next/", "/static/"],
    crawlDelay: 1,
    blockUserAgents: ["AhrefsBot", "SemrushBot", "DotBot"],
  });
}
