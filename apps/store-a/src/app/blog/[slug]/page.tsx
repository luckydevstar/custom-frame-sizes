import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Button, Card, CardContent, Badge } from "@framecraft/ui";
import { Clock, Calendar, User, ArrowLeft, ArrowRight } from "lucide-react";
import { getBlogPost, getBlogPosts, formatBlogDate } from "@/lib/blog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Custom Frame Sizes Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <Link href="/blog">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  const allPosts = getBlogPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/blog">
        <Button variant="ghost" className="mb-6" data-testid="link-back-to-blog">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>
      </Link>

      {post.hero && (
        <div className="mb-8 relative w-full h-96 rounded-lg overflow-hidden bg-muted">
          <Image
            src={post.hero}
            alt=""
            fill
            className="object-cover"
            data-testid="img-post-hero"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-4" data-testid="text-post-title">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
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
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
              <Badge variant="secondary" data-testid={`tag-${tag}`}>
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            a: ({ href, children }) => {
              const url = href ?? "#";
              if (url.startsWith("/") && !url.startsWith("//")) {
                return (
                  <Link href={url} className="text-primary hover:underline">
                    {children}
                  </Link>
                );
              }
              return (
                <a
                  href={url}
                  className="text-primary hover:underline"
                  target={url.startsWith("http") ? "_blank" : undefined}
                  rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {children}
                </a>
              );
            },
            h2: ({ node: _node, ...props }) => <h2 {...props} className="scroll-mt-20 mt-8 mb-4" />,
            h3: ({ node: _node, ...props }) => <h3 {...props} className="scroll-mt-20 mt-6 mb-3" />,
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <Card className="mb-8 bg-muted/50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2" data-testid="text-author">
            About {post.author}
          </h3>
          <p className="text-sm text-muted-foreground">
            Professional framing experts helping you create the perfect custom frame for any
            project.
          </p>
        </CardContent>
      </Card>

      {(prevPost || nextPost) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t">
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`} data-testid="link-prev-post">
              <Card className="h-full hover-elevate cursor-pointer">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" />
                    Previous Post
                  </p>
                  <h4 className="font-semibold text-sm">{prevPost.title}</h4>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`} data-testid="link-next-post">
              <Card className="h-full hover-elevate cursor-pointer">
                <CardContent className="p-4 text-right">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center justify-end gap-1">
                    Next Post
                    <ArrowRight className="h-3 w-3" />
                  </p>
                  <h4 className="font-semibold text-sm">{nextPost.title}</h4>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </article>
  );
}
