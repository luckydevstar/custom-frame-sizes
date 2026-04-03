import { ArrowLeft, Images } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";

import { generateMetadata, getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
  title: "Gallery Wall Guide | Plan, Layout & Hang Multi-Frame Walls | CustomFrameSizes.com",
  description:
    "Plan a cohesive gallery wall: spacing, layout templates, hardware, and mixed sizes. Pair with our custom frames for a polished, professional look.",
  canonical: getCanonicalUrl("/gallery-wall-guide"),
  ogTitle: "Gallery wall planning guide",
  ogDescription:
    "Layout ideas, spacing rules, and hanging tips for multi-frame gallery walls using custom sizes.",
});

export default function GalleryWallGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div
          className="mb-8 relative w-full h-56 sm:h-64 rounded-lg overflow-hidden bg-muted"
          data-testid="banner-gallery-wall"
        >
          <Image
            src="/images/blog/frame-studio-hero.png"
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          All Guides
        </Link>
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Images className="h-5 w-5" />
          <span className="text-sm font-medium">Learn</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Gallery wall guide</h1>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-base leading-relaxed">
            A gallery wall turns a blank area into a focal point. The keys are consistent spacing, a
            clear visual rhythm, and frames sized for your art—not the other way around. Use this
            guide to plan before you order.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Start with your wall and art
          </h2>
          <p className="text-base leading-relaxed">
            Measure the wall area you want to fill. Gather everything you might hang—photos, prints,
            objects in shadow boxes—and note each piece&apos;s approximate size. Mixed sizes are
            fine; balance them with a simple grid, a single center line, or a loose salon-style
            layout with even gaps between frames.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Spacing and alignment</h2>
          <p className="text-base leading-relaxed">
            A common rule is{" "}
            <strong className="text-foreground">2–3 inches between frame edges</strong> for a clean
            grid. For salon walls, keep the gaps visually similar even if frames differ. Mark a
            level baseline or centerline on the wall with painter&apos;s tape before you install
            hardware.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Hardware and weight</h2>
          <p className="text-base leading-relaxed">
            Use anchors or studs for heavier pieces. For public spaces or valuable art, consider{" "}
            <Link href="/components/security-hardware-kit" className="text-primary underline">
              security-style hardware
            </Link>{" "}
            and{" "}
            <Link href="/components/cleat-hangers" className="text-primary underline">
              cleat systems
            </Link>{" "}
            for wide or heavy frames. Our{" "}
            <Link href="/how-to-measure" className="text-primary underline">
              measuring guide
            </Link>{" "}
            helps you order glass and mats to the right opening sizes.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Go deeper</h2>
          <p className="text-base leading-relaxed">
            For layout templates, row-and-column ideas, and styling tips, read our pillar article{" "}
            <Link href="/blog/gallery-wall-layouts" className="text-primary underline">
              Gallery wall layouts
            </Link>
            . When you&apos;re ready to build frames to exact sizes, use the{" "}
            <Link href="/designer" className="text-primary underline">
              custom frame designer
            </Link>
            .
          </p>
        </article>
      </div>
    </div>
  );
}
