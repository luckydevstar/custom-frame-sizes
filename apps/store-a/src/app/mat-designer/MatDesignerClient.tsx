"use client";

import { useState } from "react";
import Link from "next/link";
import { MatConfigurator, TrustBox, BulkPricingModal } from "@framecraft/ui";
import { getStoreBaseAssetUrl } from "@framecraft/core";

export function MatDesignerClient() {
  const [isBulkPricingOpen, setIsBulkPricingOpen] = useState(false);
  // basePrice optional until mat pricing is available in store
  const basePrice: number | undefined = undefined;

  return (
    <div className="container mx-auto px-6 py-8 max-w-screen-2xl">
      {/* Hero Section - Compact */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="heading-hero">
          Custom Mat Board Designer
        </h1>
        <p
          className="text-base text-muted-foreground max-w-2xl mx-auto"
          data-testid="text-hero-description"
        >
          Design custom mats in any size. Choose from 46 colors, single or double mats, and various
          opening shapes. See your design and pricing instantly, order in minutes.
        </p>
        <p
          className="text-sm text-muted-foreground max-w-xl mx-auto mt-2 mb-4"
          data-testid="text-bulk-savings-intro"
        >
          Save up to 30% when you order multi-packs — volume pricing starts at 10 mats.
        </p>
        <button
          type="button"
          className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20 transition-colors"
          data-testid="button-view-bulk-pricing-header"
          onClick={() => setIsBulkPricingOpen(true)}
        >
          <span className="text-sm font-medium text-primary">View Bulk Pricing</span>
        </button>
      </div>

      {/* Bulk Pricing Modal */}
      <BulkPricingModal
        open={isBulkPricingOpen}
        onOpenChange={setIsBulkPricingOpen}
        basePrice={basePrice}
      />

      {/* Main Designer Tool - Above the Fold */}
      <MatConfigurator />

      {/* TrustBox */}
      <div className="text-center mt-12 mb-8">
        <TrustBox />
      </div>

      {/* SEO Content Block */}
      <div className="mt-16 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold mb-6" data-testid="heading-professional-mat-cutting">
              Custom Mat Cutting in Any Size
            </h2>
            <p className="text-base leading-relaxed mb-6" data-testid="text-mat-cutting-intro">
              We cut picture mats to your exact specifications—any size, any dimension. Our designer
              gives you full control over mat width, opening size, shape, and color. Perfect for
              photographers, artists, galleries, and anyone framing artwork that doesn&apos;t fit
              standard sizes.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getStoreBaseAssetUrl("frames/8446/lifestyle_6.jpg")}
              alt="Professional mat board framing showcasing clean white mat presentation with contemporary artwork in modern interior"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold mt-8 mb-4"
            data-testid="heading-double-mat-construction"
          >
            Single or Double Mat — Your Choice
          </h2>
          <p className="text-base leading-relaxed mb-6" data-testid="text-double-mat-description">
            Single mats work great for clean, minimal presentations. Double mats add a second layer
            with a thin reveal border (typically 1/8 to 1/4 inch) showing between the opening and
            outer mat. This creates depth and lets you add a contrasting color accent. Double mats
            are standard in professional framing because they look more sophisticated and create
            extra spacing between your art and the glass. You can also add V-groove decorative
            detail for visual interest.
          </p>

          <h2
            className="text-2xl md:text-3xl font-bold mt-8 mb-4"
            data-testid="heading-conservation-colors"
          >
            46 Mat Colors — Neutrals to Bold
          </h2>
          <p
            className="text-base leading-relaxed mb-6"
            data-testid="text-conservation-colors-description"
          >
            Choose from 46 professional mat colors. Neutrals include whites, off-whites, creams,
            blacks, and grays that work with any artwork. Premium colors add earth tones, jewel
            tones, and specialty hues for projects that need more personality. All mats use the same
            quality materials professional framers rely on.
          </p>

          <div className="rounded-lg overflow-hidden my-8 not-prose">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getStoreBaseAssetUrl("frames/6711/lifestyle_1.jpg")}
              alt="Professional-grade mat board presentation featuring white matting with precision beveled edges creating depth and professional gallery aesthetic"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <h2
            className="text-2xl md:text-3xl font-bold mt-8 mb-4"
            data-testid="heading-opening-shapes"
          >
            Opening Shapes — Rectangle to Specialty
          </h2>
          <p
            className="text-base leading-relaxed mb-6"
            data-testid="text-opening-shapes-description"
          >
            Choose rectangle (most common), oval, circle, arch, heart, star, diamond, or hexagon
            openings for your mat. Each shape cuts to 1/8-inch precision with a clean beveled edge.
            Rectangles work for nearly everything. Ovals and circles are popular for portraits.
            Specialty shapes add creative flair to kids&apos; art and themed projects.
          </p>

          <h2
            className="text-2xl md:text-3xl font-bold mt-8 mb-4"
            data-testid="heading-v-groove-detail"
          >
            V-Groove Decorative Detail
          </h2>
          <p className="text-base leading-relaxed mb-6" data-testid="text-v-groove-description">
            V-groove is a decorative mat cutting technique that creates an elegant, precise groove
            in the mat surface outside your opening. The groove appears as a subtle channel that
            adds visual interest and a professional gallery look. V-groove creates dimension and
            draws the eye to your artwork without requiring a double mat, though it works
            beautifully with double mats too.
          </p>

          <div className="rounded-lg overflow-hidden my-8 not-prose">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getStoreBaseAssetUrl("frames/6301/lifestyle_5.jpg")}
              alt="Double mat board construction showing sophisticated layered matting technique with contrasting mat colors creating elegant dimensional reveal"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <h2
            className="text-2xl md:text-3xl font-bold mt-8 mb-4"
            data-testid="heading-technical-specs"
          >
            Mat Specifications
          </h2>
          <div className="text-base leading-relaxed mb-6">
            <ul className="list-disc pl-6 space-y-2">
              <li data-testid="spec-precision-measurements">
                <strong>Cutting Precision:</strong> 1/8-inch increments (professional framing
                standard)
              </li>
              <li data-testid="spec-opening-shapes">
                <strong>Opening Shapes:</strong> Rectangle, oval, circle, arch, heart, star,
                diamond, hexagon
              </li>
              <li data-testid="spec-mat-colors">
                <strong>Color Selection:</strong> 46 professional mat colors
              </li>
              <li data-testid="spec-mat-configurations">
                <strong>Mat Options:</strong> Single or double mat with adjustable reveal width
              </li>
              <li data-testid="spec-v-groove">
                <strong>V-Groove:</strong> Optional decorative groove for added visual interest
              </li>
              <li data-testid="spec-minimum-border">
                <strong>Minimum Borders:</strong> 2 inches on all sides for structural strength
              </li>
              <li data-testid="spec-standard-overlap">
                <strong>Standard Overlap:</strong> 1/4 inch holds artwork securely
              </li>
              <li data-testid="spec-backing-boards">
                <strong>Backing Boards:</strong> Included with every mat at no extra charge
              </li>
            </ul>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4" data-testid="heading-use-cases">
            What Custom Mats Work Best For
          </h2>
          <div className="text-base leading-relaxed mb-6">
            <ul className="list-disc pl-6 space-y-2">
              <li data-testid="use-case-fine-art">
                <strong>Fine Art &amp; Prints:</strong> Original artwork, drawings, watercolors, and
                prints that need professional presentation
              </li>
              <li data-testid="use-case-photography">
                <strong>Photography:</strong> Portfolio prints, exhibition photos, and limited
                editions that deserve quality matting
              </li>
              <li data-testid="use-case-documents">
                <strong>Certificates &amp; Documents:</strong> Diplomas, awards, historical
                documents, and memorabilia
              </li>
              <li data-testid="use-case-single-presentations">
                <strong>Single Frame Presentations:</strong> Gallery walls, museum displays, and
                professional portfolios requiring consistent matting
              </li>
            </ul>
          </div>

          <div className="rounded-lg overflow-hidden my-8 not-prose">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getStoreBaseAssetUrl("frames/6711/lifestyle_7.jpg")}
              alt="Conservation-grade mat board protecting fine art photography with archival white matting demonstrating professional preservation standards"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <h2
            className="text-2xl md:text-3xl font-bold mt-8 mb-4"
            data-testid="heading-complete-your-mat"
          >
            Complete Your Mat
          </h2>
          <p className="text-base leading-relaxed mb-6" data-testid="text-complete-your-mat-intro">
            Every custom mat includes professional finishing touches. We&apos;ve made it easy to get
            everything you need for a complete framing project.
          </p>
          <div className="text-base leading-relaxed mb-6">
            <ul className="list-disc pl-6 space-y-2">
              <li data-testid="complete-backing-boards">
                <strong>Backing Boards Included:</strong> Every mat comes with a backing board at no
                extra charge. The backing provides structural support and keeps your artwork flat
                and secure.
              </li>
              <li data-testid="complete-mat-show-kits">
                <strong>Clear Self-Seal Bags Available:</strong> Protect and present your mats
                professionally with our mat show kits—clear bags that keep mats clean and ready for
                display or delivery.
              </li>
              <li data-testid="complete-custom-frames">
                <strong>Add a Custom Frame:</strong> Complete your project by pairing your mat with
                a custom frame. We offer hundreds of frame styles in any size to match your mat
                perfectly.
              </li>
              <li data-testid="complete-bulk-pricing">
                <strong>Bulk Pricing on 10+ Units:</strong> Order 10 or more mats and save with our
                volume pricing. Perfect for photographers, artists, galleries, and professional
                framers.
              </li>
            </ul>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4" data-testid="heading-learn-more">
            Mat Board Resources
          </h2>
          <p className="text-base leading-relaxed mb-4" data-testid="text-learn-more-intro">
            Learn more about mat selection and framing techniques:
          </p>
          <div className="text-base leading-relaxed mb-6">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <Link
                  href="/resources/mat-color-selection-guide"
                  className="text-primary hover:underline"
                  data-testid="link-learn-more-color-guide"
                >
                  Mat Color Selection Guide
                </Link>{" "}
                — How to choose colors that make your artwork pop
              </li>
              <li>
                <Link
                  href="/resources/mat-border-calculations"
                  className="text-primary hover:underline"
                  data-testid="link-learn-more-border-calculations"
                >
                  Mat Border Calculations
                </Link>{" "}
                — Professional proportions and spacing formulas
              </li>
              <li>
                <Link
                  href="/resources/professional-mounting-techniques"
                  className="text-primary hover:underline"
                  data-testid="link-learn-more-mounting"
                >
                  Mounting Techniques
                </Link>{" "}
                — Hinge mounting, corner mounting, and attachment methods
              </li>
              <li>
                <Link
                  href="/resources/common-mat-cutting-mistakes"
                  className="text-primary hover:underline"
                  data-testid="link-learn-more-mistakes"
                >
                  Common Mat Mistakes
                </Link>{" "}
                — Avoiding measurement errors and design problems
              </li>
              <li>
                <Link
                  href="/resources/mat-board-vs-mounting-board"
                  className="text-primary hover:underline"
                  data-testid="link-learn-more-mat-vs-mounting"
                >
                  Mat Board vs. Mounting Board
                </Link>{" "}
                — Different backing materials explained
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
