import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Ruler, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Measure for Custom Frames | Custom Frame Sizes",
  description:
    "Learn how to accurately measure artwork and photos for custom framing. Step-by-step guide to measuring frame size vs. glass size and avoiding common mistakes.",
  openGraph: {
    title: "How to Measure for Custom Frames",
    description: "Step-by-step guide to measuring artwork and photos for custom framing.",
    type: "website",
  },
};

export default function HowToMeasurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Banner / Hero (from original content hero) */}
        <div
          className="mb-8 relative w-full h-64 rounded-lg overflow-hidden bg-muted"
          data-testid="banner-hero"
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
          data-testid="link-back-learn"
        >
          <ArrowLeft className="h-4 w-4" />
          All Guides
        </Link>
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Ruler className="h-5 w-5" />
          <span className="text-sm font-medium">Learn</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6" data-testid="heading-how-to-measure">
          How to Measure for Custom Frames
        </h1>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-base leading-relaxed">
            Getting accurate measurements is the foundation of perfect custom framing. Whether
            you&apos;re framing artwork, photos, or memorabilia, following these simple steps will
            ensure your frame fits exactly as intended.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Understanding Frame Measurements
          </h2>
          <p className="text-base leading-relaxed">
            Before you start measuring, it&apos;s important to understand the two key measurements
            in framing:
          </p>
          <p className="text-base leading-relaxed">
            <strong>Image Size (or Glass Size)</strong>: This is the size of the artwork or photo
            you want to frame. It&apos;s also the size of the glass that will protect your piece.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Frame Size</strong>: This is the overall outer dimensions of the frame itself.
            The frame size will always be larger than your image size to accommodate the frame
            molding.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            How to Measure Your Artwork
          </h2>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            Step 1: Use the Right Tools
          </h3>
          <p className="text-base leading-relaxed">For accurate measurements, you&apos;ll need:</p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>A rigid ruler or measuring tape (metal rulers work best)</li>
            <li>A flat, level surface</li>
            <li>Good lighting</li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            Step 2: Measure Width and Height
          </h3>
          <ol className="list-decimal pl-6 space-y-2 text-base">
            <li>Place your artwork on a flat surface</li>
            <li>Measure the width from left edge to right edge</li>
            <li>Measure the height from top edge to bottom edge</li>
            <li>Always measure in inches and to the nearest 1/8 inch</li>
          </ol>
          <p className="text-base leading-relaxed">
            <strong>Pro tip</strong>: Measure twice to confirm accuracy. Even a small error can
            result in a frame that doesn&apos;t fit properly.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            Step 3: Record Your Measurements
          </h3>
          <p className="text-base leading-relaxed">
            Write down your measurements as <strong>Width × Height</strong>. For example, if your
            photo measures 8 inches wide and 10 inches tall, record it as 8&quot; × 10&quot;.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Measuring for Mat Board</h2>
          <p className="text-base leading-relaxed">
            If you&apos;re planning to add a{" "}
            <Link href="/mat-board-guide" className="text-primary underline hover:no-underline">
              mat board
            </Link>{" "}
            to your frame, you&apos;ll need to account for the mat opening:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-base">
            <li>Measure your artwork as described above</li>
            <li>
              The mat opening should be slightly smaller than your artwork (typically 1/4&quot;
              smaller on each side)
            </li>
            <li>This allows the mat to overlap your artwork edges and hold it securely</li>
          </ol>
          <p className="text-base leading-relaxed">
            For example, for an 8&quot; × 10&quot; photo: Mat opening: 7.5&quot; × 9.5&quot; — This
            provides a 1/4&quot; overlap on all sides.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Common Measurement Mistakes to Avoid
          </h2>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            Mistake #1: Measuring the Frame Instead of the Artwork
          </h3>
          <p className="text-base leading-relaxed">
            If you&apos;re replacing an existing frame, measure the artwork itself, not the old
            frame. Frames can vary in molding width and depth.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            Mistake #2: Rounding Measurements
          </h3>
          <p className="text-base leading-relaxed">
            Always use precise measurements. Rounding 8.25&quot; to 8&quot; might seem minor, but it
            can result in gaps or an artwork that doesn&apos;t fit.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            Mistake #3: Mixing Up Width and Height
          </h3>
          <p className="text-base leading-relaxed">
            By convention, width is always listed first. An 8&quot; × 10&quot; frame is 8 inches
            wide and 10 inches tall (portrait orientation).
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            Mistake #4: Not Accounting for Thickness
          </h3>
          <p className="text-base leading-relaxed">
            For three-dimensional objects like jerseys or memorabilia, measure the depth as well.
            You&apos;ll need a shadow box frame with adequate depth.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Tips for Irregular Sizes</h2>

          <h3 className="text-lg font-semibold text-foreground mt-6">Non-Rectangular Artwork</h3>
          <p className="text-base leading-relaxed">For oval, circular, or irregular shapes:</p>
          <ol className="list-decimal pl-6 space-y-1 text-base">
            <li>Measure the widest point horizontally</li>
            <li>Measure the tallest point vertically</li>
            <li>Use these measurements to determine the frame size needed</li>
          </ol>

          <h3 className="text-lg font-semibold text-foreground mt-6">Warped or Bent Items</h3>
          <p className="text-base leading-relaxed">If your artwork is slightly warped:</p>
          <ol className="list-decimal pl-6 space-y-1 text-base">
            <li>Gently flatten it on a hard surface</li>
            <li>Measure as if it were flat</li>
            <li>Note the warping when ordering your frame</li>
            <li>Consider professional mounting to flatten the piece</li>
          </ol>

          <h3 className="text-lg font-semibold text-foreground mt-6">Oversized Artwork</h3>
          <p className="text-base leading-relaxed">For large pieces over 24&quot; × 36&quot;:</p>
          <ol className="list-decimal pl-6 space-y-1 text-base">
            <li>Use a long measuring tape or ruler</li>
            <li>Have someone help hold the artwork flat</li>
            <li>Measure from a corner reference point</li>
            <li>Double-check all measurements</li>
          </ol>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Measuring for Standard vs. Custom Sizes
          </h2>
          <p className="text-base leading-relaxed">
            Before ordering a custom frame, check our{" "}
            <Link href="/frame-size-chart" className="text-primary underline hover:no-underline">
              frame size chart
            </Link>{" "}
            to see if your artwork matches a standard size. Standard sizes are often more
            economical:
          </p>
          <p className="text-base leading-relaxed">
            <strong>Common Standard Sizes</strong>: 5&quot; × 7&quot;, 8&quot; × 10&quot;, 11&quot;
            × 14&quot;, 16&quot; × 20&quot;, 18&quot; × 24&quot;
          </p>
          <p className="text-base leading-relaxed">
            If your artwork is within 1/4&quot; of a standard size, consider trimming it (if
            possible) to fit a standard frame.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Final Checklist</h2>
          <p className="text-base leading-relaxed">Before placing your order:</p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>✓ Measure width and height to the nearest 1/8&quot;</li>
            <li>✓ Write measurements as Width × Height</li>
            <li>✓ Measure the artwork, not an old frame</li>
            <li>✓ Account for mat board overlap if using mats</li>
            <li>✓ Check if a standard size works for your piece</li>
            <li>✓ Note any special considerations (thickness, warping, irregular shape)</li>
          </ul>
          <p className="text-base leading-relaxed">
            Accurate measurements ensure your custom frame will showcase your artwork perfectly. If
            you&apos;re ever unsure, our customer service team is happy to help guide you through
            the measurement process.
          </p>
          <p className="text-base leading-relaxed pt-4">
            Ready to start designing? Visit our{" "}
            <Link href="/picture-frames" className="text-primary underline hover:no-underline">
              frame designer
            </Link>{" "}
            to create your perfect custom frame.
          </p>
        </article>
      </div>
    </div>
  );
}
