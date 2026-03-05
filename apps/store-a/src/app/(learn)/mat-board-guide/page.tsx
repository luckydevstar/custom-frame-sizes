import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Layers, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Mat Board Guide - Choosing the Perfect Mat for Your Frame | Custom Frame Sizes",
  description:
    "Complete guide to mat board for custom frames. Learn about single vs. double mats, choosing mat width, mat colors, and how mats enhance your artwork.",
  openGraph: {
    title: "Mat Board Guide - Choosing the Perfect Mat for Your Frame",
    description: "Complete guide to mat board, colors, and configurations for custom frames.",
    type: "website",
  },
};

export default function MatBoardGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Banner / Hero (from original content hero) */}
        <div
          className="mb-8 relative w-full h-64 rounded-lg overflow-hidden bg-muted"
          data-testid="banner-hero"
        >
          <Image
            src="/images/blog/botanical-frame-hero.png"
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
          data-testid="link-back-learn"
        >
          <ArrowLeft className="h-4 w-4" />
          All Guides
        </Link>
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Layers className="h-5 w-5" />
          <span className="text-sm font-medium">Learn</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6" data-testid="heading-mat-board-guide">
          Mat Board Guide - Choosing the Perfect Mat for Your Frame
        </h1>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-base leading-relaxed">
            Mat board (also called matting) is one of the most important elements of custom framing.
            The right mat can transform your artwork, create visual breathing room, and add a
            professional, gallery-quality finish to any frame.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">What Is Mat Board?</h2>
          <p className="text-base leading-relaxed">
            Mat board is a thick, firm paperboard that sits between your artwork and the frame
            glass. It has a window opening (called the mat opening) that displays your artwork while
            covering the edges.
          </p>
          <p className="text-base leading-relaxed">Mat board serves several important purposes:</p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>
              <strong>Visual Enhancement</strong>: Creates space between the artwork and frame,
              preventing a cramped appearance and drawing the eye to your piece.
            </li>
            <li>
              <strong>Protection</strong>: Keeps your artwork from touching the glass, preventing
              moisture damage, sticking, and degradation over time.
            </li>
            <li>
              <strong>Flexibility</strong>: Allows you to use standard frame sizes for non-standard
              artwork by filling the gap between the art and frame.
            </li>
            <li>
              <strong>Professionalism</strong>: Gives your framed piece a polished, gallery-quality
              appearance.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">Single Mat vs. Double Mat</h2>

          <h3 className="text-lg font-semibold text-foreground mt-6">Single Mat</h3>
          <p className="text-base leading-relaxed">
            A single mat uses one layer of mat board with a single window opening. This is the most
            common and economical option.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Best for</strong>: Simple, clean presentations; casual or everyday framing;
            budget-conscious projects; modern, minimalist aesthetics.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6">Double Mat (Layered Mat)</h3>
          <p className="text-base leading-relaxed">
            A double mat uses two layers of mat board, with the bottom mat visible as a thin reveal
            (usually 1/4&quot;) around the window opening.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Best for</strong>: Adding depth and dimension; creating color contrast;
            professional or formal presentations; valuable artwork or photographs; adding visual
            interest without overwhelming the art.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Popular double mat combinations</strong>: White top mat with colored reveal
            (navy, black, burgundy); Cream top mat with gold or brown reveal; Matching colors in
            different shades for subtle depth.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Choosing Mat Width</h2>
          <p className="text-base leading-relaxed">
            Mat width refers to the border between your artwork edge and the frame&apos;s inner
            edge. Choosing the right width creates balance and visual appeal.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6">Standard Mat Widths</h3>
          <p className="text-base leading-relaxed">
            <strong>Narrow (1.5&quot; – 2&quot;)</strong>: Best for small frames (5×7, 8×10);
            modern, minimalist look; good for collages or gallery walls with multiple frames.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Medium (2.5&quot; – 3&quot;)</strong>: Most versatile and popular choice; works
            for medium frames (11×14, 16×20); provides good visual breathing room; suitable for most
            artwork types.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Wide (3.5&quot; – 4&quot;+)</strong>: Best for larger frames (20×24 and up);
            creates dramatic, gallery-quality presentation; ideal for valuable or special pieces;
            prevents large frames from overwhelming smaller artwork.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6">The Bottom Mat Rule</h3>
          <p className="text-base leading-relaxed">
            For a professional look, make the bottom mat border slightly wider than the top and
            sides (typically 1/4&quot; to 1/2&quot; wider). This creates visual balance and prevents
            the optical illusion of the artwork appearing to sink. For example, with a medium mat:
            Top and sides: 2.5&quot;; Bottom: 3&quot;.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Mat Color Selection Basics</h2>
          <p className="text-base leading-relaxed">
            Choosing mat colors can feel overwhelming, but a few simple principles will guide you:
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            Neutral Colors (Most Versatile)
          </h3>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>
              <strong>White</strong>: Clean, classic, works with everything. The most popular
              choice.
            </li>
            <li>
              <strong>Cream/Off-White</strong>: Softer than white, warmer feel, excellent for
              vintage photos or traditional artwork.
            </li>
            <li>
              <strong>Black</strong>: Bold, modern, creates high contrast. Best for contemporary art
              or dramatic presentations.
            </li>
            <li>
              <strong>Gray</strong>: Sophisticated neutral that works well with black and white
              photography.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mt-6">Colored Mats</h3>
          <p className="text-base leading-relaxed">
            Colored mats can enhance your artwork when chosen thoughtfully:
          </p>
          <ol className="list-decimal pl-6 space-y-1 text-base">
            <li>
              <strong>Match a color in the artwork</strong>: Pull a secondary color from your piece
              for a coordinated look
            </li>
            <li>
              <strong>Complement the room</strong>: Choose mat colors that work with your decor
            </li>
            <li>
              <strong>Create contrast</strong>: Use opposing colors for bold, eye-catching results
            </li>
            <li>
              <strong>Stay subtle</strong>: When in doubt, choose muted or pastel versions of colors
            </li>
          </ol>
          <p className="text-base leading-relaxed">
            <strong>Warning</strong>: Bright or bold mat colors can overpower artwork. Use vibrant
            colors sparingly and intentionally. For more in-depth guidance on mat colors, check out
            our{" "}
            <Link href="/blog" className="text-primary underline hover:no-underline">
              blog
            </Link>
            .
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Conservation vs. Standard Mat Board
          </h2>
          <p className="text-base leading-relaxed">
            <strong>Standard Mat Board</strong>: Most affordable option; suitable for most framing
            projects; good for prints, posters, and casual artwork.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Archival Mat Board</strong>: Premium, archival-quality material; prevents
            yellowing and deterioration; essential for valuable artwork, original pieces, or family
            photos; worth the investment for pieces you want to preserve long-term.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Special Mat Considerations</h2>
          <p className="text-base leading-relaxed">
            <strong>Multiple Openings</strong>: For collages, diplomas with photos, or series of
            related images, you can create custom mats with multiple openings. This creates a
            unified presentation for multiple pieces.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Specialty Shapes</strong>: Mat openings don&apos;t have to be rectangular. Oval,
            circular, and custom-shaped openings can add elegance and uniqueness to your framed
            pieces.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Fabric Mats</strong>: Fabric-covered mats (linen, silk, suede) add texture and
            luxury to special pieces like wedding invitations, certificates, or fine art.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Mat Board and Frame Style</h2>
          <p className="text-base leading-relaxed">
            Your mat board choice should harmonize with your frame selection:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>
              <strong>Ornate, traditional frames</strong>: Pair with neutral or cream mats, consider
              double mats
            </li>
            <li>
              <strong>Modern, minimalist frames</strong>: Simple single mats in white, black, or
              gray
            </li>
            <li>
              <strong>Rustic wood frames</strong>: Cream, tan, or natural-toned mats
            </li>
            <li>
              <strong>Metal frames</strong>: Clean white or black mats for contemporary look
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">Getting Started</h2>
          <p className="text-base leading-relaxed">When designing your custom frame:</p>
          <ol className="list-decimal pl-6 space-y-1 text-base">
            <li>Start with a neutral mat (white, cream, or black)</li>
            <li>Decide if you want a single or double mat</li>
            <li>Choose a mat width based on your frame size</li>
            <li>
              Preview your design with our{" "}
              <Link href="/picture-frames" className="text-primary underline hover:no-underline">
                frame designer
              </Link>{" "}
              tool
            </li>
            <li>Adjust colors and dimensions until you&apos;re satisfied</li>
          </ol>
          <p className="text-base leading-relaxed">
            For more guidance on creating beautiful framed artwork, explore our{" "}
            <Link href="/glazing-guide" className="text-primary underline hover:no-underline">
              glazing guide
            </Link>
            .
          </p>
          <p className="text-base leading-relaxed pt-4">
            The right mat board transforms good framing into great framing. Take your time to
            experiment with different options—you&apos;ll be amazed at the difference the perfect
            mat can make.
          </p>
        </article>
      </div>
    </div>
  );
}
