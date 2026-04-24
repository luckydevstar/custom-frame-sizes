"use client";

import { getFramesByCategory, type HeroImage } from "@framecraft/core";
import {
  FaqMini,
  GlazingShowcase,
  Hero,
  HowItWorks,
  MatDesignerShowcase,
  ShadowboxDesigner,
  ShadowboxShowcase,
  SpecialtyDesignersShowcase,
  TestimonialCarousel,
  ValueProps,
} from "@framecraft/ui";
import heroImagesDataRaw from "@/data/heroImages.json";

import { brandConfig } from "@/brand.config";
import {
  shadowboxHomeFaqs,
  shadowboxHowItWorksConfig,
  shadowboxValuePropsConfig,
} from "@/config/shadowbox-home";
import { FinalCta } from "./final-cta";
import { HeroTrustStrip } from "./hero-trust-strip";
import { ShadowboxSeoTextBlock } from "./shadowbox-seo-text-block";
import { WeAlsoOffer } from "./we-also-offer";

const heroImagesData = heroImagesDataRaw as HeroImage[];

/** b-shadow-box-frames-original/config/home.sections.ts */
const homeSections = {
  howItWorks: true,
  valueProps: true,
  faqMini: true,
} as const;

/**
 * Homepage structure from b-shadow-box-frames-original/client/src/pages/Home.tsx
 * (shared UI blocks from @framecraft/ui; copy/layout from original only).
 */
export function HomePageContent() {
  const showTestimonial = brandConfig.features?.showHomeTestimonial ?? true;
  const shadowboxFrames = getFramesByCategory("shadowbox");

  return (
    <div>
      <Hero
        title="Display Your Story"
        subtitle="Design your custom shadowbox frame in minutes."
        ctaPrimary={{ label: "Design Your Shadowbox", href: "#designer" }}
        ctaSecondary={{ label: "Browse Shadow Boxes", href: "/shadowbox" }}
        heroImagesData={heroImagesData}
        config={{
          overlayColor: "#0D0D0D",
          overlayOpacity: 0.45,
          maxHeightPx: 500,
          heightDesktop: "40vh",
          heightMobile: "35vh",
          objectPosition: "center center",
        }}
        showTrustIndicators
        titleEmphasisLastWord
      />
      <HeroTrustStrip />

      <div id="designer" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <p className="hidden md:block text-lg text-muted-foreground max-w-2xl mx-auto">
            Design a shadow box frame built to display what matters most.
          </p>
          <p className="md:hidden text-base text-muted-foreground max-w-2xl mx-auto">
            Tap Customize to set your size, mat, and depth. Switch to Preview to see your shadow box frame in real time.
          </p>
        </div>
        <ShadowboxDesigner />

        <div className="text-center mt-16 max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl font-semibold mb-4" data-testid="text-why-builder">
            Shadow Box Frames Built for What Matters Most
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Design custom shadow box frames in any size, from compact 8×10 display cases to large-format 30×40 jersey
            frames. Choose your size down to 1/8 in. increments, pick your frame depth from ¾ in. to 3 in., select from
            50 mat colors, and preview your design in real time. Whether you&apos;re framing medals, dried bouquets, or
            signed memorabilia, what you see is what you&apos;ll receive.
          </p>
        </div>
      </div>

      <div className="flex flex-col home-section-stack">
        {homeSections.howItWorks && <HowItWorks config={shadowboxHowItWorksConfig} />}
        {showTestimonial && <TestimonialCarousel />}
        {homeSections.valueProps && <ValueProps config={shadowboxValuePropsConfig} />}
        <ShadowboxShowcase
          frames={shadowboxFrames}
          shadowboxLink="/shadowbox"
          variant="shadowboxframes"
        />
        <GlazingShowcase />
        <MatDesignerShowcase />
        <SpecialtyDesignersShowcase />
        {homeSections.faqMini && (
          <FaqMini
            faqs={shadowboxHomeFaqs}
            sectionTitle="Questions we hear most"
            sectionSubtitle="Quick answers about our handcrafted shadow box frames."
            viewAllStyle="link"
          />
        )}
        <ShadowboxSeoTextBlock />
        <FinalCta />
        <WeAlsoOffer />
      </div>
    </div>
  );
}
