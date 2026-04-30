"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react";

import { Badge, Button, Card, CardContent } from "@framecraft/ui";

import type { BlogPost } from "@/lib/blog-posts";
import { formatBlogDate } from "@/lib/format-blog-date";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

const markdownComponents: Components = {
  a: ({ ...props }) => <a {...props} className="text-primary hover:underline" />,
  h2: ({ ...props }) => <h2 {...props} className="scroll-mt-20" />,
  h3: ({ ...props }) => <h3 {...props} className="scroll-mt-20" />,
};

export function BlogPostContent({
  post,
  prevPost,
  nextPost,
}: {
  post: BlogPost;
  prevPost: Pick<BlogPost, "slug" | "title"> | null;
  nextPost: Pick<BlogPost, "slug" | "title"> | null;
}) {
  useScrollToTop();

  return (
    <article className="container mx-auto max-w-4xl px-4 py-8">
      <Link href="/blog">
        <Button variant="ghost" className="mb-6" data-testid="link-back-to-blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>
      </Link>

      {post.hero ? (
        <div className="mb-8 overflow-hidden rounded-lg">
          <img
            src={post.hero}
            alt={post.title}
            className="h-96 w-full object-cover"
            data-testid="img-post-hero"
          />
        </div>
      ) : null}

      <div className="mb-6">
        <h1 className="mb-4 text-4xl font-bold" data-testid="text-post-title">
          {post.title}
        </h1>
        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {post.author}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatBlogDate(post.date)}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readingTime}
          </div>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" data-testid={`tag-${tag}`}>
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="prose prose-slate mb-12 max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={markdownComponents}>
          {post.content}
        </ReactMarkdown>
      </div>

      <Card className="mb-8 bg-muted/50">
        <CardContent className="p-6">
          <h3 className="mb-2 font-semibold" data-testid="text-author">
            About {post.author}
          </h3>
          <p className="text-sm text-muted-foreground">
            Shadowbox and custom framing specialists sharing practical knowledge for collectors, hobbyists, and display
            enthusiasts.
          </p>
        </CardContent>
      </Card>

      {prevPost || nextPost ? (
        <div className="grid grid-cols-1 gap-4 border-t pt-8 md:grid-cols-2">
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`}>
              <Card className="hover-elevate h-full cursor-pointer" data-testid="link-prev-post">
                <CardContent className="p-4">
                  <p className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowLeft className="h-3 w-3" />
                    Previous Post
                  </p>
                  <h4 className="text-sm font-semibold">{prevPost.title}</h4>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`}>
              <Card className="hover-elevate h-full cursor-pointer" data-testid="link-next-post">
                <CardContent className="p-4 text-right">
                  <p className="mb-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    Next Post
                    <ArrowRight className="h-3 w-3" />
                  </p>
                  <h4 className="text-sm font-semibold">{nextPost.title}</h4>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <div />
          )}
        </div>
      ) : null}
    </article>
  );
}
