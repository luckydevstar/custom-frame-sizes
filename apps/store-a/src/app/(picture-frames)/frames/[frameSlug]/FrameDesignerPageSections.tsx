"use client";

import { useState } from "react";
import { ArrowRight, Award, Eye, Shield, Sparkles } from "lucide-react";
import { FrameDetailCarousel, ImageGallery } from "@framecraft/ui/components/shared";
import type { GalleryImage } from "@framecraft/ui/components/shared";
import { Button } from "@framecraft/ui";
import type { FrameStyle } from "@framecraft/types";
import type { FramePageContent } from "./frame-page-content";

const FEATURE_ICONS = [Sparkles, Shield, Award, Eye] as const;
const PERFECT_FOR_ICON = Award;

export interface FrameDesignerPageSectionsProps {
  frame: FrameStyle;
  lifestyleImages: GalleryImage[];
  pageContent: FramePageContent;
}

export function FrameDesignerPageSections({
  frame,
  lifestyleImages,
  pageContent,
}: FrameDesignerPageSectionsProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const styleInspirationSubtitle =
    frame.id === "light-oak"
      ? "See how Light Oak frames bring warm natural wood character and versatile casual style to your spaces"
      : `See how ${frame.name} frames transform fine art and cherished memories`;

  return (
    <>
      {/* 1. Style Inspiration Carousel - match original */}
      {lifestyleImages.length > 0 && (
        <section className="container mx-auto px-4 py-12 md:py-16 border-b">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2
                className="text-2xl md:text-3xl font-bold mb-2"
                data-testid="heading-style-inspiration"
              >
                Style Inspiration
              </h2>
              <p className="text-muted-foreground">{styleInspirationSubtitle}</p>
            </div>
            <FrameDetailCarousel
              images={lifestyleImages}
              onImageClick={(index) => {
                setGalleryIndex(index);
                setGalleryOpen(true);
              }}
            />
          </div>
        </section>
      )}

      {/* 2. Design & Craftsmanship - dynamic from frame-page-content */}
      {pageContent.designBody && (
        <section className="container mx-auto px-4 py-8 md:py-12 border-b bg-muted/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              {pageContent.designHeading}
            </h2>
            <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground text-center">
              <p>{pageContent.designBody}</p>
            </div>
          </div>
        </section>
      )}

      <ImageGallery
        images={lifestyleImages}
        initialIndex={galleryIndex}
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
      />

      {/* 3. Key Features Bar - match original KeyFeaturesBar */}
      <section className="border-y bg-muted/20">
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            {pageContent.keyFeatures.map((feature, i) => {
              const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length] ?? Award;
              return (
                <div key={feature.testId} className="text-center" data-testid={feature.testId}>
                  <Icon className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                  <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                    {feature.title}
                  </p>
                  <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                    {feature.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Technical Specifications - dynamic from frame-page-content */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2
              className="text-2xl md:text-3xl font-bold mb-2"
              data-testid="heading-specifications"
            >
              Technical Specifications
            </h2>
            <p className="text-muted-foreground">{pageContent.specSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {pageContent.specs.map((row) => (
              <div
                key={row.testId}
                className="flex justify-between border-b pb-2"
                data-testid={row.testId}
              >
                <span className="font-medium">{row.label}</span>
                <span className="text-muted-foreground">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Perfect For - dynamic from frame-page-content */}
      <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2" data-testid="heading-perfect-for">
              Perfect For
            </h2>
            <p className="text-muted-foreground">{pageContent.perfectForSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {pageContent.perfectFor.map((item) => (
              <div key={item.testId} className="flex gap-3" data-testid={item.testId}>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <PERFECT_FOR_ICON className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Final CTA - match original */}
      <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{pageContent.finalCtaHeading}</h2>
          <p className="text-muted-foreground mb-6">{pageContent.finalCtaSubtext}</p>
          <Button
            size="lg"
            className="min-h-11"
            onClick={() => {
              document
                .querySelector("[data-designer-anchor]")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            data-testid="button-design-frame-cta"
          >
            Start Designing Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </>
  );
}
