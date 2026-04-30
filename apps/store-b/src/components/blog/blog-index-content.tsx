"use client";

import Link from "next/link";
import { useState } from "react";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@framecraft/ui";
import { Calendar, Clock } from "lucide-react";

import type { BlogPostSummary } from "@/lib/blog-posts";
import { formatBlogDate } from "@/lib/format-blog-date";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

const POSTS_PER_PAGE = 6;

export function BlogIndexContent({ posts }: { posts: BlogPostSummary[] }) {
  useScrollToTop();

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const allTags = getAllTagsFromPosts(posts);
  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const displayedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-4xl font-bold" data-testid="text-page-title">
          Shadow Box Ideas & Inspiration
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          From your first shadow box to your fiftieth, there is always something new to learn. Our blog is where we
          share the tips, tricks, and creative ideas we have picked up from years of building shadow boxes by hand.
          Think of it as friendly advice from the people who do this every day.
        </p>

        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Explore by topic</h2>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedTag === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                setSelectedTag(null);
                setCurrentPage(1);
              }}
              data-testid="tag-all"
            >
              All Posts
            </Badge>
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTagClick(tag)}
                data-testid={`tag-${tag}`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block h-full">
              <Card
                className="hover-elevate h-full cursor-pointer transition-all"
                data-testid={`card-post-${post.slug}`}
              >
                {post.hero ? (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img src={post.hero} alt={post.title} className="h-full w-full object-cover" />
                  </div>
                ) : null}
                <CardHeader>
                  <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatBlogDate(post.date)}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readingTime}
                    </div>
                  </div>
                  <CardTitle className="mb-2 text-xl">{post.title}</CardTitle>
                  <CardDescription>{post.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {totalPages > 1 ? (
          <div className="mt-12 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              data-testid="button-prev-page"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                  data-testid={`button-page-${page}`}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              data-testid="button-next-page"
            >
              Next
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function getAllTagsFromPosts(posts: BlogPostSummary[]): string[] {
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
