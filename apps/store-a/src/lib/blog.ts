import fs from "fs";
import path from "path";
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

function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function getBlogDir(): string {
  if (process.env.BLOG_CONTENT_DIR) {
    return path.isAbsolute(process.env.BLOG_CONTENT_DIR)
      ? process.env.BLOG_CONTENT_DIR
      : path.join(process.cwd(), process.env.BLOG_CONTENT_DIR);
  }
  return BLOG_DIR;
}

export function getBlogPosts(): BlogPost[] {
  const dir = getBlogDir();
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const posts: BlogPost[] = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(raw);

    const tags = Array.isArray(data.tags) ? data.tags : [];
    posts.push({
      slug,
      title: data.title ?? "",
      description: data.description ?? "",
      date: data.date ?? "",
      tags,
      hero: data.hero,
      author: data.author ?? "CustomFrameSizes Team",
      content,
      readingTime: readingTime(content),
    });
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(slug: string): BlogPost | null {
  const dir = getBlogDir();
  const filePath = path.join(dir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const tags = Array.isArray(data.tags) ? data.tags : [];

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    date: data.date ?? "",
    tags,
    hero: data.hero,
    author: data.author ?? "CustomFrameSizes Team",
    content,
    readingTime: readingTime(content),
  };
}

export function getAllTags(): string[] {
  const posts = getBlogPosts();
  const set = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

export function formatBlogDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
