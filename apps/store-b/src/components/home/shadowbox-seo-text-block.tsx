import Link from "next/link";

/** b-shadow-box-frames-original/client/src/components/home/SeoTextBlock.tsx (structure + copy) */
export function ShadowboxSeoTextBlock() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-8 md:py-12" data-testid="section-seo-text">
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <h2
          className="font-serif text-2xl md:text-3xl font-semibold mb-6 text-center"
          data-testid="text-seo-heading"
        >
          Custom Shadow Box Frames in Any Size
        </h2>
        <p className="text-base leading-relaxed text-foreground/90" data-testid="text-seo-content">
          ShadowboxFrames.com specializes in handcrafted shadow box frames built to display your story. A shadow box frame
          is a deep, enclosed frame designed to hold and protect three-dimensional objects like military medals, sports
          jerseys, wedding bouquets, baby keepsakes, and collectibles. Our online frame designer gives you full control
          over every specification: frame dimensions down to 1/8 in. increments, frame depth from ¾ in. to 3 in., single
          or double acid-free mat boards in 50 colors, 2 mat opening shapes (rectangle and oval), and your choice of
          standard or non-glare framer&apos;s grade acrylic glazing. Every{" "}
          <Link href="/shadowbox" className="text-primary hover:underline font-medium" data-testid="link-shadowboxes">
            shadow box frame
          </Link>{" "}
          is precision-cut and handcrafted in our workshop using premium materials that meet professional framing
          standards. In addition to shadow box frames, we also offer standard{" "}
          <Link href="/picture-frames" className="text-primary hover:underline font-medium" data-testid="link-picture-frames">
            picture frames
          </Link>{" "}
          in 24+ styles, floating{" "}
          <Link href="/canvas-frames" className="text-primary hover:underline font-medium" data-testid="link-canvas-frames">
            canvas frames
          </Link>
          , and specialty designers for jerseys, diplomas, records, comics, and{" "}
          <Link
            href="/movie-poster-frames"
            className="text-primary hover:underline font-medium"
            data-testid="link-poster-frames"
          >
            poster frames
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
