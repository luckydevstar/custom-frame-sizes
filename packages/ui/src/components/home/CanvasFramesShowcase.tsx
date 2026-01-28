"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { getCanvasImageUrl } from "@framecraft/core";

interface CanvasStyle {
  id: string;
  sku: string;
  name: string;
  description: string;
  image: string;
  keywords?: string;
}

export interface CanvasFramesShowcaseProps {
  canvasStyles?: CanvasStyle[];
  canvasLink?: string;
}

const defaultCanvasStyles: CanvasStyle[] = [
  {
    id: "canvas-black",
    sku: "10117",
    name: "Black Canvas Float Frame",
    description: "Clean lines for modern art",
    image: getCanvasImageUrl("10117-lifestyle-a.jpg"),
    keywords: "black canvas frame, float frame, gallery canvas",
  },
  {
    id: "canvas-white",
    sku: "10764",
    name: "White Canvas Float Frame",
    description: "Bright and airy display",
    image: getCanvasImageUrl("10764-lifestyle-a.jpg"),
    keywords: "white canvas frame, float frame, modern canvas",
  },
  {
    id: "canvas-natural",
    sku: "10694",
    name: "Natural Wood Canvas Frame",
    description: "Warm wood grain finish",
    image: getCanvasImageUrl("10694-lifestyle-a.jpg"),
    keywords: "wood canvas frame, natural float frame",
  },
  {
    id: "canvas-gold",
    sku: "11345",
    name: "Gold Canvas Float Frame",
    description: "Classic elegance for any space",
    image: getCanvasImageUrl("11345-lifestyle-a.jpg"),
    keywords: "gold canvas frame, metallic canvas frame",
  },
];

export function CanvasFramesShowcase({
  canvasStyles = defaultCanvasStyles,
  canvasLink = "/canvas-frames",
}: CanvasFramesShowcaseProps) {
  return (
    <section className="py-10 sm:py-12 bg-muted/30" data-testid="section-canvas-frames">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl font-semibold mb-2" data-testid="text-canvas-heading">
            Canvas Float Frames
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Frame your canvas art with a floating effect. The small gap between canvas and frame
            adds depth and style.
          </p>
        </div>

        {/* Canvas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {canvasStyles.map((canvas) => (
            <Link key={canvas.id} href={`${canvasLink}?frame=${canvas.sku}`} className="group">
              <div
                className="relative rounded-lg overflow-hidden hover-elevate active-elevate-2 cursor-pointer"
                data-testid={`canvas-style-${canvas.id}`}
              >
                {/* Canvas Image */}
                <div className="aspect-[4/3] relative bg-muted">
                  <img
                    src={canvas.image}
                    alt={`${canvas.name} - ${canvas.description}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Subtle Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Text Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3
                      className="font-serif text-lg font-semibold mb-0.5"
                      data-testid={`text-canvas-name-${canvas.id}`}
                    >
                      {canvas.name}
                    </h3>
                    <p
                      className="text-sm text-white/90"
                      data-testid={`text-canvas-description-${canvas.id}`}
                    >
                      {canvas.description}
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
            Canvas float frames work with gallery-wrapped canvases of any size. Your artwork appears
            to float inside the frame for a professional look.
          </p>
        </div>

        {/* View All Canvas Frames Link */}
        <div className="text-center mt-6">
          <Link href={canvasLink}>
            <Button variant="default" size="lg" data-testid="button-view-all-canvas">
              Design Canvas Float Frame
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
