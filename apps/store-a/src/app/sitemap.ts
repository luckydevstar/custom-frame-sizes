import { getFramesByCategory } from "@framecraft/core";
import { MetadataRoute } from "next";

import { getBlogPosts } from "@/lib/blog";
import { env } from "@/lib/env";

const baseUrl = env.shopify.storeDomain
  ? `https://${env.shopify.storeDomain}`
  : "https://customframesizes.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/designer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mat-designer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shadowbox/designer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/diploma/designer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/certificate/designer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Company pages
    {
      url: `${baseUrl}/about`,
      lastModified: oneMonthAgo,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: oneMonthAgo,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    // Category landing pages
    {
      url: `${baseUrl}/picture-frames`,
      lastModified: oneMonthAgo,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shadowbox-frames`,
      lastModified: oneMonthAgo,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/diploma-frames`,
      lastModified: oneMonthAgo,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/certificate-frames`,
      lastModified: oneMonthAgo,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/specialty-frames`,
      lastModified: oneMonthAgo,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    // Learn/Resources pages
    {
      url: `${baseUrl}/faq`,
      lastModified: oneMonthAgo,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: oneMonthAgo,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
  ];

  let blogPostEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = getBlogPosts();
    blogPostEntries = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }));
  } catch {
    blogPostEntries = [];
  }

  // Dynamic frame detail pages
  try {
    const frameCategories: Array<"picture" | "shadowbox"> = ["picture", "shadowbox"];
    const dynamicPages: MetadataRoute.Sitemap = [];

    for (const category of frameCategories) {
      try {
        const frames = getFramesByCategory(category);
        frames.forEach((frame) => {
          dynamicPages.push({
            url: `${baseUrl}/frames/${frame.id}`,
            lastModified: oneMonthAgo,
            changeFrequency: "monthly",
            priority: 0.7,
          });
        });
      } catch {
        // Skip if category doesn't exist
      }
    }

    return [...staticPages, ...blogPostEntries, ...dynamicPages];
  } catch {
    // If dynamic detail pages fail, still include blog URLs
    return [...staticPages, ...blogPostEntries];
  }
}
