import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogPostContent } from "@/components/blog/blog-post-content";
import { buildBlogPostingJsonLd, buildBlogPostMetadata } from "@/lib/blog-metadata";
import { getAdjacentBlogPosts, getBlogPost, getBlogPosts } from "@/lib/blog-posts";

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) {
    return {};
  }

  return buildBlogPostMetadata(post);
}

export default function BlogSlugPage({ params }: PageProps) {
  const post = getBlogPost(params.slug);
  if (!post) {
    notFound();
  }

  const { prev, next } = getAdjacentBlogPosts(params.slug);
  const jsonLd = buildBlogPostingJsonLd(post);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostContent post={post} prevPost={prev} nextPost={next} />
    </>
  );
}
