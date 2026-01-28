"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight, Square, Circle, Heart, Star, Hexagon, Diamond } from "lucide-react";
import { useState, useEffect } from "react";
import { getSharedAssetUrl } from "@framecraft/core";

export function MatDesignerShowcase() {
  // Use one of the mat lifestyle images from CDN (attached_assets path)
  const [currentImage, setCurrentImage] = useState({
    url: getSharedAssetUrl("attached_assets/Mat_Lifestyle_(1)_1765923321072.jpeg"),
    alt: "Family selecting mat boards for photos at dining table",
  });

  useEffect(() => {
    // Randomly select from mat lifestyle images (using attached_assets path structure)
    const matImages = [
      {
        url: getSharedAssetUrl("attached_assets/Mat_Lifestyle_(1)_1765923321072.jpeg"),
        alt: "Family selecting mat boards for photos at dining table",
      },
      {
        url: getSharedAssetUrl("attached_assets/Mat_Lifestyle_(2)_1765923321072.jpeg"),
        alt: "Family reviewing matted photographs on coffee table",
      },
      {
        url: getSharedAssetUrl("attached_assets/Mat_Lifestyle_(3)_1765923321072.jpeg"),
        alt: "Couple laughing while sorting matted photos on floor",
      },
      {
        url: getSharedAssetUrl("attached_assets/Mat_Lifestyle_(10)_1765923321069.jpeg"),
        alt: "Family with toddler looking at matted photos",
      },
      {
        url: getSharedAssetUrl("attached_assets/Mat_Lifestyle_(15)_1765923298425.jpeg"),
        alt: "Family working on mat cutting project at dining table",
      },
    ];
    const randomIndex = Math.floor(Math.random() * matImages.length);
    const selectedImage = matImages[randomIndex];
    if (selectedImage) {
      setCurrentImage(selectedImage);
    }
  }, []);

  const features = [
    { label: "46 Colors", description: "Find your perfect match" },
    { label: "8 Shapes", description: "Rectangle to heart" },
    { label: "Double Mat", description: "Professional depth" },
    { label: "V-Groove", description: "Gallery finishing" },
  ];

  const shapes = [
    { icon: Square, label: "Rectangle" },
    { icon: Circle, label: "Circle" },
    { icon: Heart, label: "Heart" },
    { icon: Star, label: "Star" },
    { icon: Hexagon, label: "Hexagon" },
    { icon: Diamond, label: "Diamond" },
  ];

  return (
    <section className="py-10 sm:py-12 bg-muted/30" data-testid="section-mat-designer">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Content */}
            <div className="order-2 lg:order-1">
              <h2
                className="font-serif text-3xl sm:text-4xl font-semibold mb-3"
                data-testid="text-mat-heading"
              >
                Custom Mat Board Designer
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Design precision-cut mat boards in any size. Choose from 46 colors, 8 opening
                shapes, and professional finishing options.
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-lg border p-4"
                    data-testid={`mat-feature-${index}`}
                  >
                    <div className="font-semibold text-primary">{feature.label}</div>
                    <div className="text-sm text-muted-foreground">{feature.description}</div>
                  </div>
                ))}
              </div>

              {/* Shape Icons */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm text-muted-foreground">Opening shapes:</span>
                <div className="flex items-center gap-2">
                  {shapes.map((shape, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
                      title={shape.label}
                    >
                      <shape.icon className="w-4 h-4 text-primary" />
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link href="/mat-designer">
                <Button size="lg" data-testid="button-design-mat">
                  Design Your Mat Board
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              {/* Microcopy */}
              <p className="text-sm text-muted-foreground mt-4">
                Backing board included with every mat. Bulk pricing available.
              </p>
            </div>

            {/* Right: Featured Image */}
            <div className="order-1 lg:order-2">
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={currentImage.url}
                  alt={currentImage.alt}
                  className="w-full h-auto aspect-[4/3] object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/90 text-foreground backdrop-blur-sm">
                    Precision cut to 1/8&quot; accuracy
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Footer */}
          <div className="text-center mt-10 max-w-3xl mx-auto">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Custom mat boards add depth and protection to your framed artwork. Our precision
              cutting service delivers professional results in any size, with archival materials
              that protect your photos and prints for generations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
