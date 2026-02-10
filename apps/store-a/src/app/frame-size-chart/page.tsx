import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Frame Size Chart - Standard Picture Frame Sizes Reference | Custom Frame Sizes",
  description:
    "Complete reference chart of standard picture frame sizes including photo prints, posters, and artwork. Learn when to choose standard vs. custom frame sizes.",
  openGraph: {
    title: "Frame Size Chart - Standard Picture Frame Sizes Reference",
    description: "Reference chart of standard frame sizes for photos, posters, and art prints.",
    type: "website",
  },
};

export default function FrameSizeChartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Banner / Hero (from original content hero) */}
        <div
          className="mb-8 relative w-full h-64 rounded-lg overflow-hidden bg-muted"
          data-testid="banner-hero"
        >
          <Image
            src="/images/blog/vinyl-frame-hero.png"
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
          <BookOpen className="h-5 w-5" />
          <span className="text-sm font-medium">Learn</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6" data-testid="heading-frame-size-chart">
          Frame Size Chart - Standard Picture Frame Sizes Reference
        </h1>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-base leading-relaxed">
            Choosing the right frame size is essential for showcasing your artwork, photos, and
            prints. While custom sizes are always available, standard frame sizes are often more
            economical and readily available. Use this comprehensive guide to find the perfect size
            for your framing needs.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Common Standard Frame Sizes
          </h2>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            Small Frames (Perfect for Photos and Small Prints)
          </h3>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>
              <strong>4×6 inches</strong> — Standard photo print size; great for tabletop frames;
              ideal for snapshots and casual photos; perfect for multi-frame displays.
            </li>
            <li>
              <strong>5×7 inches</strong> — Popular photo size; excellent for portraits; works well
              on desks and shelves; common for school photos.
            </li>
            <li>
              <strong>8×10 inches</strong> — Most popular frame size; versatile for photos and art
              prints; perfect for wall displays; standard portrait size.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            Medium Frames (Ideal for Artwork and Larger Photos)
          </h3>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>
              <strong>11×14 inches</strong> — Common art print size; great for matted 8×10 photos;
              perfect for home and office displays; popular for certificates and diplomas.
            </li>
            <li>
              <strong>12×16 inches</strong> — Good for larger art prints; works well for landscape
              photography; nice size for statement pieces.
            </li>
            <li>
              <strong>16×20 inches</strong> — Large display size; excellent for poster prints;
              perfect for matted 11×14 artwork; great focal point in a room.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            Large Frames (Statement Pieces and Posters)
          </h3>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>
              <strong>18×24 inches</strong> — Standard poster size; impressive wall statement;
              common for art reproductions; perfect for matted 16×20 photos.
            </li>
            <li>
              <strong>20×24 inches</strong> — Large artwork display; professional presentation; good
              for gallery-style displays.
            </li>
            <li>
              <strong>24×36 inches</strong> — Movie poster size; major wall statement; excellent for
              large art prints; requires substantial wall space.
            </li>
            <li>
              <strong>27×40 inches</strong> — Full-size movie poster; dramatic wall piece;
              commercial art displays; collector&apos;s items and special pieces.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">Photo Print Size Chart</h2>
          <p className="text-base leading-relaxed">
            Understanding photo print sizes helps you choose frames that fit perfectly without
            custom sizing:
          </p>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse border border-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-2 text-left font-semibold">Print Size</th>
                  <th className="border border-border p-2 text-left font-semibold">Common Use</th>
                  <th className="border border-border p-2 text-left font-semibold">
                    Recommended Frame with Mat
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2">4×6&quot;</td>
                  <td className="border border-border p-2">Standard prints</td>
                  <td className="border border-border p-2">5×7&quot; or 8×10&quot;</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">5×7&quot;</td>
                  <td className="border border-border p-2">Portraits</td>
                  <td className="border border-border p-2">8×10&quot; or 11×14&quot;</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">8×10&quot;</td>
                  <td className="border border-border p-2">Wall photos</td>
                  <td className="border border-border p-2">11×14&quot; or 16×20&quot;</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">11×14&quot;</td>
                  <td className="border border-border p-2">Large prints</td>
                  <td className="border border-border p-2">16×20&quot; or 18×24&quot;</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">16×20&quot;</td>
                  <td className="border border-border p-2">Statement photos</td>
                  <td className="border border-border p-2">20×24&quot; or 24×30&quot;</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-foreground mt-8">Poster and Art Print Sizes</h2>
          <p className="text-base leading-relaxed">
            <strong>Small Posters</strong>: 11×17 inches (Tabloid), 12×18 inches, 16×20 inches.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Medium Posters</strong>: 18×24 inches (Architectural D), 20×30 inches, 24×36
            inches (Standard movie poster).
          </p>
          <p className="text-base leading-relaxed">
            <strong>Large Posters</strong>: 27×40 inches (One-sheet movie poster), 36×48 inches
            (Large format).
          </p>
          <p className="text-base leading-relaxed">
            <strong>Fine Art Print Sizes</strong>: Professional art prints typically come in 8×10,
            11×14, 16×20, 18×24, 24×30, and 30×40 inches.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Aspect Ratios and Proportions
          </h2>
          <p className="text-base leading-relaxed">
            <strong>2:3 Ratio (Most Common Photos)</strong>: 4×6&quot;, 8×12&quot;, 12×18&quot;,
            16×24&quot;, 20×30&quot; — Standard DSLR camera format; classic photo proportion.
          </p>
          <p className="text-base leading-relaxed">
            <strong>4:5 Ratio (Portrait Orientation)</strong>: 8×10&quot;, 11×14&quot;, 16×20&quot;,
            20×24&quot; — Common for professional portraits; traditional frame proportion.
          </p>
          <p className="text-base leading-relaxed">
            <strong>5:7 Ratio</strong>: 5×7&quot;, 10×14&quot;, 15×21&quot; — Popular photo print
            size; slightly narrower than 4:5.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Square Formats</strong>: 8×8&quot;, 10×10&quot;, 12×12&quot;, 16×16&quot;,
            20×20&quot; — Instagram-inspired; modern, contemporary look; great for gallery walls.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Using Mat Boards with Standard Sizes
          </h2>
          <p className="text-base leading-relaxed">
            Mat boards allow you to frame smaller artwork in larger standard frames. Common mat
            configurations:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>
              <strong>8×10 frame with mat</strong>: 5×7 opening (2&quot; mat on top/sides, 2.5&quot;
              bottom); 4×6 opening (3&quot; mat on all sides)
            </li>
            <li>
              <strong>11×14 frame with mat</strong>: 8×10 opening (standard 2–2.5&quot; mat); 5×7
              opening (3–4&quot; mat)
            </li>
            <li>
              <strong>16×20 frame with mat</strong>: 11×14 opening (2.5–3&quot; mat); 8×10 opening
              (4–5&quot; mat for dramatic effect)
            </li>
          </ul>
          <p className="text-base leading-relaxed">
            Learn more about mat selection in our{" "}
            <Link href="/mat-board-guide" className="text-primary underline hover:no-underline">
              mat board guide
            </Link>
            .
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            When to Choose Standard vs. Custom Sizes
          </h2>
          <p className="text-base leading-relaxed">
            <strong>Choose Standard Sizes When</strong>: Your artwork matches a common size exactly;
            you want the most economical option; you&apos;re framing mass-produced prints or
            posters; you can trim your artwork slightly to fit; you&apos;re creating a gallery wall
            with multiple frames; you need frames quickly.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Choose Custom Sizes When</strong>: Your artwork is an irregular or non-standard
            size; you&apos;re framing original artwork that can&apos;t be trimmed; standard sizes
            would require excessive matting; you want exact proportions for a specific space;
            you&apos;re framing valuable or irreplaceable pieces; the artwork has specific
            dimensional requirements.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            International Paper Sizes (ISO Standards)
          </h2>
          <p className="text-base leading-relaxed">
            If you&apos;re framing international prints or documents:{" "}
            <strong>A-Series (Common in Europe and worldwide)</strong> — A4: 8.3×11.7 inches
            (210×297mm); A3: 11.7×16.5 inches (297×420mm); A2: 16.5×23.4 inches (420×594mm). These
            don&apos;t match US standard frame sizes, so custom framing may be necessary.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Specialty Frame Sizes</h2>
          <p className="text-base leading-relaxed">
            <strong>Certificate and Diploma Frames</strong>: 8.5×11 inches (standard letter size);
            11×14 inches (with mat for 8.5×11); 11×17 inches (large certificates).
          </p>
          <p className="text-base leading-relaxed">
            <strong>Panoramic Frames</strong>: 10×20 inches; 12×36 inches; 20×60 inches; great for
            landscape photography.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Square Frames</strong>: 8×8, 12×12, 16×16, 20×20 inches — popular for Instagram
            prints and modern displays.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Tips for Measuring and Selecting Sizes
          </h2>
          <ol className="list-decimal pl-6 space-y-1 text-base">
            <li>
              Measure your artwork accurately using our{" "}
              <Link href="/how-to-measure" className="text-primary underline hover:no-underline">
                measuring guide
              </Link>
            </li>
            <li>Consider the display location — larger walls need larger frames</li>
            <li>Account for mat board if you&apos;re adding matting</li>
            <li>Think about orientation — portrait (vertical) vs. landscape (horizontal)</li>
            <li>Plan for groupings — consistent sizes create cohesive gallery walls</li>
          </ol>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Size Selection Based on Room and Purpose
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>
              <strong>Bedroom</strong>: Small to medium frames (5×7&quot;, 8×10&quot;, 11×14&quot;);
              personal photos and artwork; multiple frames or gallery walls work well.
            </li>
            <li>
              <strong>Living Room</strong>: Medium to large frames (16×20&quot;, 18×24&quot;,
              24×36&quot;); statement pieces and focal points.
            </li>
            <li>
              <strong>Office/Study</strong>: Small to medium frames (8×10&quot;, 11×14&quot;);
              diplomas, certificates, inspirational quotes.
            </li>
            <li>
              <strong>Hallway</strong>: Varied sizes in gallery wall arrangement; or uniform sizes
              in linear arrangement.
            </li>
            <li>
              <strong>Dining Room</strong>: Medium to large frames (16×20&quot;, 20×24&quot;);
              artistic prints, family photos.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">Quick Size Comparison</h2>
          <p className="text-base leading-relaxed">To visualize standard frame sizes:</p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>
              <strong>4×6&quot;</strong> — About the size of a postcard
            </li>
            <li>
              <strong>5×7&quot;</strong> — Similar to a standard greeting card
            </li>
            <li>
              <strong>8×10&quot;</strong> — Slightly larger than a sheet of paper
            </li>
            <li>
              <strong>11×14&quot;</strong> — About the size of a notebook
            </li>
            <li>
              <strong>16×20&quot;</strong> — Roughly the size of a magazine
            </li>
            <li>
              <strong>24×36&quot;</strong> — Approximately the size of a small poster
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">Getting Started</h2>
          <p className="text-base leading-relaxed">Ready to choose your frame size?</p>
          <ol className="list-decimal pl-6 space-y-1 text-base">
            <li>
              Measure your artwork carefully (see{" "}
              <Link href="/how-to-measure" className="text-primary underline hover:no-underline">
                how to measure
              </Link>
              )
            </li>
            <li>Check this chart to see if a standard size works</li>
            <li>Consider adding a mat to use standard frames</li>
            <li>
              Design your frame using our{" "}
              <Link href="/picture-frames" className="text-primary underline hover:no-underline">
                frame designer
              </Link>
            </li>
            <li>Preview before ordering to ensure perfect fit</li>
          </ol>
          <p className="text-base leading-relaxed">
            Whether you choose a standard size or create a custom frame, our{" "}
            <Link href="/picture-frames" className="text-primary underline hover:no-underline">
              frame designer
            </Link>{" "}
            makes it easy to visualize your options and create the perfect frame for your artwork.
          </p>
          <p className="text-base leading-relaxed">
            Not sure which size to choose? Our customer service team is happy to help you select the
            perfect frame size for your project.
          </p>
        </article>
      </div>
    </div>
  );
}
