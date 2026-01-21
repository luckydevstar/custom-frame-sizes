import { Link } from "wouter";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import type { FrameStyle } from "@framecraft/types";

interface FrameStylesShowcaseProps {
  frames: FrameStyle[];
  curatedOrder?: string[];
  allFramesLink?: string;
}

export function FrameStylesShowcase({
  frames,
  curatedOrder,
  allFramesLink = "/picture-frames",
}: FrameStylesShowcaseProps) {
  // Default curated order if not provided
  const defaultOrder = curatedOrder || [
    "black-wood",
    "white-wood",
    "gold-bamboo",
    "natural-picture-frame",
    "silver-wood",
    "museum-bronze",
    "brown-picture-frame",
    "modern-black",
    "modern-white",
    "modern-silver",
    "modern-gold",
    "modern-blue",
    "modern-red",
    "brown-bamboo",
    "wide-brown-bamboo",
    "barnwood-white",
    "barnwood-gray",
    "barnwood-brown",
    "barnwood-black",
    "museum-gold",
    "museum-silver",
    "museum-black",
    "wide-black",
    "wide-brown",
    "wide-picture-frame",
    "wide-museum-silver",
    "wide-museum-gold",
    "antique-gold",
    "royal-gold",
    "simple-picture-frame",
    "antique-silver",
    "iron-ore-silver",
    "bronz-picture-frame",
    "light-oak",
    "executive-brown",
    "white-wash-wood",
    "coastal-white",
    "blue-wood",
    "red-wood",
    "pink-wood",
    "black-peak",
  ];

  // Create a map for quick lookup
  const framesMap = new Map(frames.map((frame) => [frame.id, frame]));

  // Build frame styles in curated order, only including featured frames
  const frameStyles = defaultOrder
    .map((id) => framesMap.get(id))
    .filter((frame): frame is FrameStyle => frame !== undefined && frame.featured === true)
    .map((frame) => {
      // Find corner image from alternateImages
      const cornerImage = frame.alternateImages?.find((img) => img.type === "corner");

      return {
        id: frame.id,
        name: frame.name,
        description:
          frame.shortDescription || frame.featuredDescription || "Premium custom framing",
        image: cornerImage?.url || frame.thumbnail,
        alt: cornerImage?.alt || `${frame.name} corner detail`,
        keywords: `${frame.name.toLowerCase()}, custom ${frame.name.toLowerCase()}`,
      };
    });

  return (
    <section className="py-10 sm:py-12 bg-muted/30" data-testid="section-frame-styles">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2
            className="font-serif text-3xl font-semibold mb-2"
            data-testid="text-frame-styles-heading"
          >
            Popular Frame Styles
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Explore our curated selection of premium custom frames, available in any size you need
          </p>
        </div>

        {/* Frame Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {frameStyles.map((frame) => (
            <Link
              key={frame.id}
              href={`/frames/${frame.id}`}
              data-testid={`link-frame-${frame.id}`}
            >
              <div
                className="group relative rounded-lg overflow-hidden hover-elevate cursor-pointer"
                data-testid={`frame-style-${frame.id}`}
              >
                {/* Frame Image */}
                <div className="aspect-[4/3] relative">
                  <img
                    src={frame.image}
                    alt={frame.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Subtle Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                  {/* Text Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3
                      className="font-serif text-lg font-semibold mb-0.5"
                      data-testid={`text-frame-name-${frame.id}`}
                    >
                      {frame.name} Frame
                    </h3>
                    <p
                      className="text-sm text-white/90"
                      data-testid={`text-frame-description-${frame.id}`}
                    >
                      {frame.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* SEO-Rich Footer Text */}
        <div className="text-center mt-8 max-w-3xl mx-auto">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every custom picture frame is handcrafted to your exact specifications with
            professional-grade materials. Our picture frames are available in popular sizes
            including 5x7, 8x10, 11x14, 16x20, 18x24, 20x30, and 24x36, plus any custom size from
            4×4 inches to 32×40 inches with precision down to 1/8 inch.
          </p>
        </div>

        {/* View All Frames Link */}
        <div className="text-center mt-6">
          <Link href={allFramesLink}>
            <Button variant="default" size="lg" data-testid="button-view-all-frames">
              View All Frame Styles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
