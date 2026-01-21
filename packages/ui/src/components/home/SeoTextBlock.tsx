import { useIntersectionAnimation } from "@framecraft/core";

interface SeoTextBlockProps {
  heading?: string;
  content?: string;
  links?: {
    shadowbox?: string;
    canvasFrames?: string;
    posterFrames?: string;
  };
}

const defaultHeading = "Custom Picture Frames in Any Size";
const defaultContent = `CustomFrameSizes.com specializes in custom picture frames built to your exact specifications using professional-grade materials. 
Order picture frames in popular sizes like 8x10, 11x14, 16x20, 18x24, and 24x36, or enter any custom dimension down to 
the 1/8 inch for a perfect fit. Our handcrafted picture frames are shipped directly from our U.S. workshop and available 
in styles including matte black, white gallery, walnut, gold, and natural wood finishes. Whether you need standard picture 
frames for photography and fine art, deep {shadowbox} for jerseys and three-dimensional memorabilia, or floating {canvasFrames} 
for gallery-wrapped prints, every custom picture frame includes precision construction and archival materials. 
Add custom-cut mat boards in any color, framer's grade acrylic glazing, and professional hanging hardware. Browse {posterFrames} 
in sizes from 11x17 to 27x40, explore shadowboxes for collectibles and medals, or design frames for unconventional 
sizes like 20x30 or 12x36. All picture frames come with our satisfaction guarantee and careful packaging for safe delivery.`;

export function SeoTextBlock({
  heading = defaultHeading,
  content = defaultContent,
  links = {
    shadowbox: "/shadowbox",
    canvasFrames: "/canvas-frames",
    posterFrames: "/movie-poster-frames",
  },
}: SeoTextBlockProps) {
  const ref = useIntersectionAnimation({ animationClass: "motion-fade-rise" });

  // Replace placeholders with actual links
  const processedContent = content
    .replace(
      /{shadowbox}/g,
      `<a href="${links.shadowbox}" class="text-primary hover:underline font-medium">shadowbox frames</a>`
    )
    .replace(
      /{canvasFrames}/g,
      `<a href="${links.canvasFrames}" class="text-primary hover:underline font-medium">canvas frames</a>`
    )
    .replace(
      /{posterFrames}/g,
      `<a href="${links.posterFrames}" class="text-primary hover:underline font-medium">poster frames</a>`
    );

  return (
    <section
      ref={ref}
      className="max-w-4xl mx-auto px-6 py-8 md:py-12"
      data-testid="section-seo-text"
    >
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <h2
          className="font-serif text-2xl md:text-3xl font-semibold mb-6 text-center"
          data-testid="text-seo-heading"
        >
          {heading}
        </h2>
        <div
          className="text-base leading-relaxed text-foreground/90"
          data-testid="text-seo-content"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </div>
    </section>
  );
}
