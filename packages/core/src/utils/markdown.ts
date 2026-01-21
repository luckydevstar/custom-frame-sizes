/**
 * Markdown parsing and formatting utilities
 */

import matter from "gray-matter";

export interface PageFrontmatter {
  title: string;
  description: string;
  slug?: string;
  date?: string;
  tags?: string[];
  hero?: string;
  author?: string;
  category?: string;
  readingTime?: string;
}

export interface ParsedContent {
  frontmatter: PageFrontmatter;
  content: string;
  readingTime: string;
}

// Browser-compatible reading time calculation
function calculateReadingTime(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return "1 min read"; // Default for empty content
  }

  const wordsPerMinute = 200;
  const words = trimmed.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}

export function parseMarkdown(markdown: string): ParsedContent {
  const { data, content } = matter(markdown);

  return {
    frontmatter: data as PageFrontmatter,
    content,
    readingTime: calculateReadingTime(content),
  };
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
