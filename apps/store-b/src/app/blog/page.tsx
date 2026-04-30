import type { Metadata } from "next";

import { BlogIndexContent } from "@/components/blog/blog-index-content";
import { blogIndexJsonLd, blogIndexMetadata } from "@/lib/blog-metadata";
import { getBlogSummaries } from "@/lib/blog-posts";

export const metadata: Metadata = blogIndexMetadata;

export default function BlogPage() {
  const posts = getBlogSummaries();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogIndexJsonLd) }}
      />
      <BlogIndexContent posts={posts} />
    </>
  );
}
