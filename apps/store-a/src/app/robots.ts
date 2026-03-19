import { MetadataRoute } from "next";
import { env } from "@/lib/env";

const baseUrl = env.shopify.storeDomain
  ? `https://${env.shopify.storeDomain}`
  : "https://customframesizes.com";

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
