"use client";

import { ArrowRight, Circle, Square } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@framecraft/ui/components/ui/button";

import { MAT_LIFESTYLE_IMAGES } from "@/constants/mat-lifestyle-images";

/** origina-store-b/client/src/components/home/MatDesignerShowcase.tsx */

export function ShadowboxMatDesignerShowcase() {
  const [currentImage, setCurrentImage] = useState(MAT_LIFESTYLE_IMAGES[0]!);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * MAT_LIFESTYLE_IMAGES.length);
    const next = MAT_LIFESTYLE_IMAGES[randomIndex];
    if (next) setCurrentImage(next);
  }, []);

  const features = [
    { label: "50 Colors", description: "Find your perfect match" },
    { label: "2 Shapes", description: "Rectangle & oval" },
    { label: "Double Mat", description: "Professional depth" },
    { label: "V-Groove", description: "Gallery finishing" },
  ];

  const shapes = [
    { icon: Square, label: "Rectangle" },
    { icon: Circle, label: "Oval" },
  ];

  return (
    <section className="py-10 sm:py-12 bg-muted/30" data-testid="section-mat-designer">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-3" data-testid="text-mat-heading">
                Custom Mat Boards for Your Shadowbox
              </h2>
              <p className="text-lg text-muted-foreground mb-6">Add depth and dimension to your display</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {features.map((feature, index) => (
                  <div key={feature.label} className="bg-card rounded-lg border p-4" data-testid={`mat-feature-${index}`}>
                    <div className="font-semibold text-primary">{feature.label}</div>
                    <div className="text-sm text-muted-foreground">{feature.description}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm text-muted-foreground">Opening shapes:</span>
                <div className="flex items-center gap-2">
                  {shapes.map((shape) => (
                    <div
                      key={shape.label}
                      className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
                      title={shape.label}
                    >
                      <shape.icon className="w-4 h-4 text-primary" />
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/mat-designer">
                <Button variant="outline" size="lg" data-testid="button-design-mat">
                  Design Your Mat Board
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <p className="text-sm text-muted-foreground mt-4">
                Backing board included with every mat order. Bulk pricing available.
              </p>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImage.url}
                  alt={currentImage.alt}
                  className="w-full h-auto aspect-[4/3] object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/90 text-foreground backdrop-blur-sm">
                    Precision cut to 1/8&quot; accuracy
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10 max-w-3xl mx-auto">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Custom mat boards add depth and protection to your shadowbox and picture frame displays.
              Our precision cutting service delivers professional results in any size, with acid-free
              materials that protect your items for years to come.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
