import { brandConfig } from "../brand.config";
import {
  Hero,
  FrameDesigner,
  TestimonialCarousel,
  HowItWorks,
  ValueProps,
  InspirationGallery,
  FaqMini,
  SeoTextBlock,
  FrameStylesShowcase,
  ShadowboxShowcase,
  CanvasFramesShowcase,
} from "@framecraft/ui";
import { getFramesByCategory } from "@framecraft/core";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: brandConfig.seo.title,
  description: brandConfig.seo.description,
  keywords: brandConfig.seo.keywords?.join(", "),
  openGraph: {
    title: brandConfig.seo.title,
    description: brandConfig.seo.description,
    images: brandConfig.seo.ogImage ? [brandConfig.seo.ogImage] : [],
    type: "website",
    url: brandConfig.seo.canonicalUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: brandConfig.seo.title,
    description: brandConfig.seo.description,
    images: brandConfig.seo.twitterImage ? [brandConfig.seo.twitterImage] : [],
  },
  alternates: {
    canonical: brandConfig.seo.canonicalUrl,
  },
};

export default function HomePage() {
  const showTestimonial = brandConfig.features?.showHomeTestimonial ?? true;

  // Get frames data for showcase components
  const pictureFrames = getFramesByCategory("picture");
  const shadowboxFrames = getFramesByCategory("shadowbox");

  return (
    <>
      {/* Structured Data - Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Custom Frame",
            brand: {
              "@type": "Brand",
              name: brandConfig.name,
            },
            material: "Wood (premium hardwoods)",
            additionalProperty: {
              "@type": "PropertyValue",
              name: "Sizing Granularity",
              value: "1/8 inch",
            },
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "USD",
              lowPrice: "25",
              highPrice: "300",
              availability: "https://schema.org/InStock",
              url: brandConfig.seo.canonicalUrl,
            },
          }),
        }}
      />

      {/* Structured Data - Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: brandConfig.name,
            url: brandConfig.seo.canonicalUrl,
            logo: brandConfig.seo.ogImage,
            contactPoint: {
              "@type": "ContactPoint",
              telephone: brandConfig.metadata?.contactPhone,
              email: brandConfig.metadata?.contactEmail,
              contactType: "Customer Service",
            },
          }),
        }}
      />

      {/* Structured Data - WebSite Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: brandConfig.name,
            url: brandConfig.seo.canonicalUrl,
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${brandConfig.seo.canonicalUrl}/picture-frames?search={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      <Hero
        title={brandConfig.branding?.tagline || "Custom Picture Frames in Any Size"}
        subtitle={
          brandConfig.branding?.valueProposition ||
          "Design your custom frame in minutes with exact dimensions"
        }
        ctaPrimary={{ label: "Start Designing", href: "#designer" }}
        ctaSecondary={{ label: "Browse Frames", href: "/picture-frames" }}
      />

      {showTestimonial && <TestimonialCarousel />}

      {/* Frame Designer Section */}
      <div id="designer" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          {/* Desktop text */}
          <p className="hidden md:block text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your image and customize every detail to create a frame that&apos;s uniquely
            yours
          </p>
          {/* Mobile text */}
          <p className="md:hidden text-base text-muted-foreground max-w-2xl mx-auto">
            Start by tapping Customize to adjust your size, mat, and finish. Switch to Preview
            anytime to see it in real time.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="min-h-[600px] flex items-center justify-center">
              Loading designer...
            </div>
          }
        >
          <FrameDesigner />
        </Suspense>

        {/* Mid-page SEO content */}
        <div className="text-center mt-16 max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl font-semibold mb-4" data-testid="text-why-builder">
            Picture Frames in Custom Sizes with Professional Precision
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Design custom picture frames in any size—from standard 8x10 and 16x20 frames to
            oversized 24x36 and 30x40 picture frames. Enter your exact dimensions down to 1/8&quot;
            increments, visualize your frame in real-time with our photo-based rendering, and
            configure every detail with professional-grade accuracy. Whether you need picture
            frames, shadowbox frames, or mat boards, what you see is exactly what you&apos;ll
            receive.
          </p>
        </div>
      </div>

      {/* Showcase Sections */}
      <div className="flex flex-col gap-12 md:gap-16">
        <FrameStylesShowcase frames={pictureFrames} />
        <ShadowboxShowcase frames={shadowboxFrames} />
        <CanvasFramesShowcase />

        {/* Conditional Sections */}
        {brandConfig.features?.showHomeTestimonial && <HowItWorks />}
        <ValueProps />
        {brandConfig.features?.enableGallery && <InspirationGallery />}
        <FaqMini />
        <SeoTextBlock />
      </div>
    </>
  );
}
