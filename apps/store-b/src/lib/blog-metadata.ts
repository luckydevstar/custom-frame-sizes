import type { Metadata } from "next";

import { brandConfig } from "../brand.config";
import type { BlogPost } from "./blog-posts";
import { env } from "./env";

export const blogSiteOrigin = (
  env.siteOrigin ?? `https://${env.shopify.storeDomain ?? "www.shadowboxframes.com"}`
).replace(/\/$/, "");

function absOgImage(url: string | undefined): string | undefined {
  if (!url) {
    return undefined;
  }
  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  }
  return `${blogSiteOrigin}${url.startsWith("/") ? "" : "/"}${url}`;
}

export const blogIndexJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "ShadowboxFrames.com Blog",
  description:
    "Shadow box ideas, arrangement tips, and preservation advice for framing your most meaningful keepsakes",
};

const defaultOg = brandConfig.seo.ogImage;

export const blogIndexMetadata: Metadata = {
  title: "Shadow Box Ideas & Inspiration | ShadowboxFrames.com",
  description:
    "Shadow box inspiration, display ideas, and framing tips from our workshop team.",
  alternates: { canonical: `${blogSiteOrigin}/blog` },
  openGraph: {
    type: "website",
    url: `${blogSiteOrigin}/blog`,
    title: "Shadow Box Ideas & Inspiration | ShadowboxFrames.com",
    description:
      "Shadow box inspiration, display ideas, and framing tips from our workshop team.",
    ...(defaultOg ? { images: [defaultOg] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "Shadow Box Ideas & Inspiration | ShadowboxFrames.com",
    description:
      "Shadow box inspiration, display ideas, and framing tips from our workshop team.",
    ...(defaultOg ? { images: [defaultOg] } : {}),
  },
};

export function buildBlogPostMetadata(post: BlogPost): Metadata {
  const canonical = `${blogSiteOrigin}/blog/${post.slug}`;
  const pageTitle = post.title.includes("ShadowboxFrames")
    ? post.title
    : `${post.title} | ShadowboxFrames.com`;

  const ogImage = absOgImage(post.hero) ?? defaultOg;
  const ogImages = ogImage ? [ogImage] : [];

  return {
    title: pageTitle,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: post.title,
      description: post.description,
      ...(ogImages.length ? { images: ogImages } : {}),
      publishedTime: post.date ? `${post.date}T12:00:00.000Z` : undefined,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      ...(ogImages.length ? { images: ogImages } : {}),
    },
  };
}

export function buildBlogPostingJsonLd(post: BlogPost): object {
  const image = absOgImage(post.hero);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    ...(image ? { image } : {}),
  };
}
