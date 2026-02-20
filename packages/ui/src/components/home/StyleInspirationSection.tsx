"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export interface StyleInspirationSectionProps {
  /** Optional link for the CTA (e.g. light oak frame designer) */
  ctaLink?: string;
  /** Optional CTA label */
  ctaLabel?: string;
}

export function StyleInspirationSection({
  ctaLink = "/frames/light-oak",
  ctaLabel = "Explore Light Oak Frames",
}: StyleInspirationSectionProps = {}) {
  return (
    <section className="py-10 sm:py-12 bg-background" data-testid="section-style-inspiration">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h2
          className="font-serif text-3xl md:text-4xl font-semibold mb-3"
          data-testid="text-style-inspiration-heading"
        >
          Style Inspiration
        </h2>
        <p
          className="text-lg md:text-xl text-muted-foreground mb-8"
          data-testid="text-style-inspiration-tagline"
        >
          Warm Oak Simplicity with Natural Grain Beauty
        </p>
        <Button variant="outline" size="lg" asChild>
          <Link href={ctaLink} data-testid="button-style-inspiration-cta">
            {ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
