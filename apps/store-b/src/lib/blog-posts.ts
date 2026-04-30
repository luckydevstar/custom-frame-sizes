import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  hero?: string;
  author: string;
  content: string;
  readingTime: string;
}

export type BlogPostSummary = Omit<BlogPost, "content">;

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

function normalizeDate(raw: unknown): string {
  if (typeof raw === "string") {
    return raw;
  }
  if (raw instanceof Date) {
    return raw.toISOString().slice(0, 10);
  }
  return "";
}

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function loadBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const posts: BlogPost[] = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const d = data as Record<string, unknown>;
    const tagsRaw = d.tags;
    const tags = Array.isArray(tagsRaw)
      ? tagsRaw.filter((t): t is string => typeof t === "string")
      : [];

    posts.push({
      slug,
      title: typeof d.title === "string" ? d.title : "",
      description: typeof d.description === "string" ? d.description : "",
      date: normalizeDate(d.date),
      tags,
      hero: typeof d.hero === "string" ? d.hero : undefined,
      author: typeof d.author === "string" ? d.author : "ShadowboxFrames Team",
      content,
      readingTime: calculateReadingTime(content),
    });
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPosts(): BlogPost[] {
  return loadBlogPosts();
}

export function getBlogSummaries(): BlogPostSummary[] {
  return getBlogPosts().map(({ content: _omit, ...rest }) => rest);
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((post) => post.slug === slug);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getBlogPosts().forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function getAdjacentBlogPosts(slug: string): {
  prev: Pick<BlogPost, "slug" | "title"> | null;
  next: Pick<BlogPost, "slug" | "title"> | null;
} {
  const posts = getBlogPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) {
    return { prev: null, next: null };
  }

  const prev = index > 0 ? posts[index - 1] : null;
  const next = index < posts.length - 1 ? posts[index + 1] : null;

  return {
    prev: prev ? { slug: prev.slug, title: prev.title } : null,
    next: next ? { slug: next.slug, title: next.title } : null,
  };
}
