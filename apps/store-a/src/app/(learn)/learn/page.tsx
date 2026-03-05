import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@framecraft/ui";
import { Badge } from "@framecraft/ui";
import { Clock, BookOpen, Palette, Shield, Ruler, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Learn - Framing Guides & Resources | Custom Frame Sizes",
  description:
    "Comprehensive guides to help you measure, design, and care for your custom frames. Learn about mats, glazing, gallery walls, and more.",
  openGraph: {
    title: "Learn - Framing Guides & Resources",
    description:
      "Comprehensive guides to help you measure, design, and care for your custom frames.",
    type: "website",
  },
};

const guides = [
  {
    title: "How to Measure for Frames",
    description:
      "Learn the proper way to measure your artwork and photos for perfect-fitting custom frames.",
    path: "/how-to-measure",
    icon: Ruler,
    readTime: "5 min",
    category: "Basics",
  },
  {
    title: "Mat Board Guide",
    description:
      "Everything you need to know about choosing mat boards, colors, and configurations for your frames.",
    path: "/mat-board-guide",
    icon: Palette,
    readTime: "6 min",
    category: "Materials",
  },
  {
    title: "Glazing Guide",
    description:
      "Compare glass and acrylic options, UV protection, and anti-glare solutions for your frames.",
    path: "/glazing-guide",
    icon: Shield,
    readTime: "7 min",
    category: "Materials",
  },
  {
    title: "Frame Size Chart",
    description: "Quick reference for standard photo, poster, and art print sizes.",
    path: "/frame-size-chart",
    icon: BookOpen,
    readTime: "4 min",
    category: "Reference",
  },
  {
    title: "Care Instructions",
    description: "Keep your frames looking beautiful with proper cleaning and maintenance.",
    path: "/care-instructions",
    icon: Shield,
    readTime: "5 min",
    category: "Maintenance",
  },
  {
    title: "Warranty Information",
    description: "Learn about our quality guarantee and what's covered under warranty.",
    path: "/warranty",
    icon: Award,
    readTime: "5 min",
    category: "Support",
  },
];

export default function LearnPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Framing Guides & Resources",
    description: "Comprehensive guides to help you create the perfect custom frame",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">
            Framing Guides &amp; Resources
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            Everything you need to know about creating the perfect custom frame. From measuring
            basics to advanced design tips.
          </p>

          {/* Framing Guides & Resources - 2 columns, 6 items */}
          <section aria-labelledby="guides-heading">
            <h2 id="guides-heading" className="sr-only">
              Framing Guides &amp; Resources
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {guides.map((guide) => {
                const Icon = guide.icon;
                return (
                  <Link key={guide.path} href={guide.path}>
                    <Card
                      className="h-full hover-elevate cursor-pointer transition-all"
                      data-testid={`card-guide-${guide.path.slice(1)}`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {guide.category}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {guide.readTime}
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-2">{guide.title}</CardTitle>
                        <CardDescription>{guide.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Can't Find What You're Looking For? */}
          <div className="mt-12 p-6 bg-card rounded-lg border" data-testid="section-cant-find">
            <h2 className="text-2xl font-semibold mb-3">
              Can&apos;t Find What You&apos;re Looking For?
            </h2>
            <p className="text-muted-foreground mb-4">
              Check out our FAQ or blog for more detailed information, or contact our team directly.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/faq" className="text-primary hover:underline" data-testid="link-faq">
                View FAQ →
              </Link>
              <Link href="/blog" className="text-primary hover:underline" data-testid="link-blog">
                Read Blog →
              </Link>
              <Link
                href="/contact"
                className="text-primary hover:underline"
                data-testid="link-contact"
              >
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </div>
  );
}
