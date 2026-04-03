import { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo";

const baseUrl = siteUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/cart/*", "/_next/", "/static/"],
        crawlDelay: 1,
      },
      // Block bad bots
      {
        userAgent: ["AhrefsBot", "SemrushBot", "DotBot"],
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
