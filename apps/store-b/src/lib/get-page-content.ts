import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import type { Metadata } from "next";

import { env } from "./env";

export interface PageContent {
  slug: string;
  title: string;
  description: string;
  category?: string;
  hero?: string;
  content: string;
  readingTime: string;
}

function calculateReadingTime(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return "1 min read";
  }
  const wordsPerMinute = 200;
  const words = trimmed.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}

const siteOrigin = (env.siteOrigin ?? "https://www.shadowboxframes.com").replace(/\/$/, "");

export function getPageContent(slug: string): PageContent | undefined {
  const fullPath = path.join(process.cwd(), "content/pages", `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return undefined;
  }

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const d = data as Record<string, unknown>;

  const title = typeof d.title === "string" ? d.title : "";
  const description = typeof d.description === "string" ? d.description : "";
  const category = typeof d.category === "string" ? d.category : undefined;
  const hero = typeof d.hero === "string" ? d.hero : undefined;

  return {
    slug,
    title,
    description,
    category,
    hero,
    content,
    readingTime: calculateReadingTime(content),
  };
}

/** Next.js Metadata for markdown-backed guide / generic pages — mirrors original GenericPage.tsx <Seo />. */
export function buildGuideMetadata(slug: string): Metadata {
  const page = getPageContent(slug);
  if (!page?.title) {
    return {};
  }

  const ogImage =
    page.hero?.startsWith("http") === true || page.hero?.startsWith("//") === true
      ? page.hero
      : page.hero
        ? `${siteOrigin}${page.hero}`
        : undefined;

  return {
    title: page.title,
    description: page.description,
    ...(ogImage
      ? {
          openGraph: {
            title: page.title,
            description: page.description,
            images: [{ url: ogImage }],
          },
        }
      : {}),
  };
}
