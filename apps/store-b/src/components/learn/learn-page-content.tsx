"use client";

import { Badge } from "@framecraft/ui";
import { Card, CardDescription, CardHeader, CardTitle } from "@framecraft/ui/components/ui/card";
import { Award, BookOpen, Clock, Palette, Ruler, Shield } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const guides = [
  {
    title: "How to Measure for Frames",
    description:
      "Learn the proper way to measure your keepsakes and artwork for a perfect-fitting shadow box frame.",
    path: "/how-to-measure",
    icon: Ruler,
    readTime: "5 min",
    category: "Basics",
  },
  {
    title: "Mat Board Guide",
    description:
      "Choose the right backing colors, textures, and mat board configurations for your shadow box display.",
    path: "/mat-board-guide",
    icon: Palette,
    readTime: "6 min",
    category: "Materials",
  },
  {
    title: "Glazing Guide",
    description:
      "Compare acrylic glazing options including UV-protective coatings to keep your shadow box contents safe.",
    path: "/glazing-guide",
    icon: Shield,
    readTime: "7 min",
    category: "Materials",
  },
  {
    title: "Frame Size Chart",
    description:
      "Quick reference for standard shadow box sizes, depths, and frame dimensions.",
    path: "/frame-size-chart",
    icon: BookOpen,
    readTime: "4 min",
    category: "Reference",
  },
  {
    title: "Care Instructions",
    description:
      "Keep your shadow box frames looking beautiful with proper cleaning and maintenance tips.",
    path: "/care-instructions",
    icon: Shield,
    readTime: "5 min",
    category: "Maintenance",
  },
  {
    title: "Warranty Information",
    description:
      "Learn about our quality guarantee and what is covered under warranty for your shadow box.",
    path: "/warranty",
    icon: Award,
    readTime: "5 min",
    category: "Support",
  },
];

/** LearnPage.tsx from b-shadow-box-frames-original — CollectionPage schema + CTAs */
export function LearnPageContent() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shadow Box Guides & Inspiration",
    description:
      "Learn how to choose shadow box depth, arrange your keepsakes, select backing colors, and preserve memorabilia with our helpful guides.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">
            Shadow Box Guides & Inspiration
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            Building a beautiful shadow box starts with understanding the basics: how deep should it be, what backing
            color works best, and how do you arrange your keepsakes for maximum impact? Our guides walk you through
            every step so you can make confident choices and create a shadow box you will love for years.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {guides.map((guide) => {
              const Icon = guide.icon;
              return (
                <Link key={guide.path} href={guide.path} className="block h-full">
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

          <div className="mt-12 p-6 bg-card rounded-lg border">
            <h2 className="text-2xl font-semibold mb-3">Can&apos;t Find What You&apos;re Looking For?</h2>
            <p className="text-muted-foreground mb-4">
              Check out our FAQ or blog for more shadow box tips and ideas, or contact our team directly.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/faq" className="text-primary hover:underline" data-testid="link-faq">
                View FAQ →
              </Link>
              <Link href="/blog" className="text-primary hover:underline" data-testid="link-blog">
                Read Blog →
              </Link>
              <Link href="/contact" className="text-primary hover:underline" data-testid="link-contact">
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
