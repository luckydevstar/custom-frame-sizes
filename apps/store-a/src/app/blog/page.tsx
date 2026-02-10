import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FileText, Clock, Calendar } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
} from "@framecraft/ui";
import { getBlogPosts, getAllTags, formatBlogDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Framing Blog - Tips, Guides & Inspiration | Custom Frame Sizes",
  description:
    "Expert tips on custom framing, mat selection, gallery walls, and more. Learn from professional framers.",
  openGraph: {
    title: "Framing Blog - Tips, Guides & Inspiration",
    description:
      "Expert tips, practical guides, and creative inspiration for all your framing projects.",
    type: "website",
  },
};

const POSTS_PER_PAGE = 6;

type PageProps = {
  searchParams: Promise<{ tag?: string; page?: string }>;
};

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedTag = params.tag ?? null;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const allPosts = getBlogPosts();
  const allTags = getAllTags();
  const filteredPosts =
    selectedTag === null ? allPosts : allPosts.filter((post) => post.tags.includes(selectedTag));

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const displayedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  function buildPageUrl(page: number, tag: string | null) {
    const sp = new URLSearchParams();
    if (tag) sp.set("tag", tag);
    if (page > 1) sp.set("page", String(page));
    const q = sp.toString();
    return q ? `/blog?${q}` : "/blog";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <FileText className="h-5 w-5" />
            <span className="text-sm font-medium">Company</span>
          </div>
          <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">
            Framing Blog
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Expert tips, practical guides, and creative inspiration for all your framing projects.
          </p>

          {/* Tag Filters */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold mb-3 text-muted-foreground">Filter by Topic</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/blog" data-testid="tag-all">
                <Badge
                  variant={selectedTag === null ? "default" : "outline"}
                  className="cursor-pointer hover:opacity-90"
                >
                  All Posts
                </Badge>
              </Link>
              {allTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  data-testid={`tag-${tag}`}
                >
                  <Badge
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer hover:opacity-90"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          {displayedPosts.length === 0 ? (
            <p className="text-muted-foreground py-8">
              No posts found. Explore our{" "}
              <Link href="/learn" className="text-primary underline hover:no-underline">
                guides
              </Link>{" "}
              for how to measure, choose mats, and care for your frames.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card
                    className="h-full hover-elevate cursor-pointer transition-all"
                    data-testid={`card-post-${post.slug}`}
                  >
                    {post.hero && (
                      <div className="relative aspect-video overflow-hidden rounded-t-lg">
                        <Image
                          src={post.hero}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
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
                      <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
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
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {currentPage === 1 ? (
                <Button variant="outline" disabled data-testid="button-prev-page">
                  Previous
                </Button>
              ) : (
                <Button variant="outline" asChild>
                  <Link
                    href={buildPageUrl(currentPage - 1, selectedTag)}
                    data-testid="button-prev-page"
                  >
                    Previous
                  </Link>
                </Button>
              )}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    asChild
                  >
                    <Link
                      href={buildPageUrl(page, selectedTag)}
                      data-testid={`button-page-${page}`}
                    >
                      {page}
                    </Link>
                  </Button>
                ))}
              </div>
              {currentPage === totalPages ? (
                <Button variant="outline" disabled data-testid="button-next-page">
                  Next
                </Button>
              ) : (
                <Button variant="outline" asChild>
                  <Link
                    href={buildPageUrl(currentPage + 1, selectedTag)}
                    data-testid="button-next-page"
                  >
                    Next
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
