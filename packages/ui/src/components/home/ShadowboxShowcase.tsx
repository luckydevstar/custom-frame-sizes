"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import type { FrameStyle } from "@framecraft/types";

export interface ShadowboxShowcaseProps {
  frames: FrameStyle[];
  shadowboxLink?: string;
}

export function ShadowboxShowcase({
  frames = [],
  shadowboxLink = "/shadowbox",
}: ShadowboxShowcaseProps) {
  // Get all shadowbox frames
  const shadowboxFrames = frames.filter((frame) => frame.category === "shadowbox");

  // Map to the display format with corner images
  const shadowboxStyles = shadowboxFrames.map((frame) => {
    // Find first corner image from alternateImages
    const cornerImage = frame.alternateImages?.find((img) => img.type === "corner");

    return {
      id: frame.id,
      name: frame.name,
      description: frame.shortDescription || "Custom deep frame for memorabilia",
      image: cornerImage?.url || frame.thumbnail,
      alt: cornerImage?.alt || `${frame.name} corner detail`,
      usableDepth: frame.usableDepth,
    };
  });

  return (
    <section className="py-10 sm:py-12" data-testid="section-shadowbox-frames">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2
            className="font-serif text-3xl font-semibold mb-2"
            data-testid="text-shadowbox-heading"
          >
            Shadowbox Frames
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Deep frames designed for 3D objects, medals, jerseys, and cherished memorabilia
          </p>
        </div>

        {/* Shadowbox Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {shadowboxStyles.map((shadowbox) => (
            <Link
              key={shadowbox.id}
              href={`${shadowboxLink}/${shadowbox.id}`}
              data-testid={`link-shadowbox-${shadowbox.id}`}
            >
              <div
                className="group relative rounded-lg overflow-hidden hover-elevate cursor-pointer"
                data-testid={`shadowbox-${shadowbox.id}`}
              >
                {/* Shadowbox Corner Image */}
                <div className="aspect-[4/3] relative">
                  <img
                    src={shadowbox.image}
                    alt={shadowbox.alt}
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
                      data-testid={`text-shadowbox-name-${shadowbox.id}`}
                    >
                      {shadowbox.name}
                    </h3>
                    <p
                      className="text-sm text-white/90"
                      data-testid={`text-shadowbox-description-${shadowbox.id}`}
                    >
                      {shadowbox.description}
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
            Our custom shadowbox frames feature deep profiles (0.5-2 inches) to display
            three-dimensional objects like jerseys, medals, and collectibles. Shadowboxes are
            available in popular sizes including 11x14, 16x20, 18x24, 22x28, and 24x36, or any
            custom size built to your exact specifications with professional-grade construction and
            framer&apos;s grade acrylic glazing.
          </p>
        </div>

        {/* View All Shadowboxes Link */}
        <div className="text-center mt-6">
          <Link href={shadowboxLink}>
            <Button variant="default" size="lg" data-testid="button-view-all-shadowboxes">
              Explore Shadowbox Frames
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
