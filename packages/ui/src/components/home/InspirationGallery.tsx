"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useRotatingImages } from "@framecraft/core";
import { useIntersectionAnimation } from "@framecraft/core";
import { RotatingImage } from "../marketing/RotatingImage";

export interface InspirationGalleryProps {
  galleryLink?: string;
  imageCategory?: string;
  imageCount?: number;
}

export function InspirationGallery({
  galleryLink = "/gallery",
  imageCategory = "inspiration",
  imageCount = 6,
}: InspirationGalleryProps) {
  const { images: rotatingImages } = useRotatingImages(
    imageCategory as "howItWorks" | "valueProps" | "inspiration" | "educationTeasers",
    { count: imageCount }
  );
  const titleRef = useIntersectionAnimation({ animationClass: "motion-fade-rise" });
  const galleryRef = useIntersectionAnimation({ stagger: true, animationClass: "motion-scale-in" });

  return (
    <section
      className="max-w-7xl mx-auto px-6 py-8 md:py-12"
      data-testid="section-inspiration-gallery"
    >
      <div ref={titleRef} className="text-center mb-12">
        <h2
          className="font-serif text-3xl md:text-4xl font-semibold mb-4"
          data-testid="text-inspiration-title"
        >
          Get Inspired
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore beautiful framing possibilities for your home
        </p>
      </div>

      <div ref={galleryRef} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {rotatingImages.map((image, index) => (
          <Link key={`${image.src}-${index}`} href={galleryLink}>
            <div
              className="group relative overflow-hidden rounded-lg cursor-pointer"
              data-testid={`link-gallery-image-${index + 1}`}
            >
              <RotatingImage
                src={image.src}
                alt={image.alt}
                aspectRatio="1/1"
                overlayOpacity={0}
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" size="lg" asChild>
          <Link href={galleryLink} data-testid="button-view-gallery">
            View Full Gallery
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
