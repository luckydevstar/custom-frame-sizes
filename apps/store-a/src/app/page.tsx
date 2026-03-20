import { brandConfig } from "../brand.config";
import { Hero, ValueProps, SeoTextBlock, FrameStylesShowcase } from "@framecraft/ui";
import dynamic from "next/dynamic";
import { getFramesByCategory } from "@framecraft/core";
import type { Metadata } from "next";
import { Suspense } from "react";

// Dynamic imports for below-fold components to improve LCP
const FrameDesigner = dynamic(() => import("@framecraft/ui").then((m) => m.FrameDesigner), {
  loading: () => <div className="h-96 bg-muted/20 animate-pulse" />,
  ssr: true,
});

const TestimonialCarousel = dynamic(
  () => import("@framecraft/ui").then((m) => m.TestimonialCarousel),
  {
    loading: () => <div className="h-64 bg-muted/20 animate-pulse" />,
    ssr: true,
  }
);

const HowItWorks = dynamic(() => import("@framecraft/ui").then((m) => m.HowItWorks), {
  loading: () => <div className="h-72 bg-muted/20 animate-pulse" />,
  ssr: true,
});

const InspirationGallery = dynamic(
  () => import("@framecraft/ui").then((m) => m.InspirationGallery),
  {
    loading: () => <div className="h-96 bg-muted/20 animate-pulse" />,
    ssr: true,
  }
);

const FaqMini = dynamic(() => import("@framecraft/ui").then((m) => m.FaqMini), {
  loading: () => <div className="h-96 bg-muted/20 animate-pulse" />,
  ssr: true,
});

const ShadowboxShowcase = dynamic(() => import("@framecraft/ui").then((m) => m.ShadowboxShowcase), {
  loading: () => <div className="h-80 bg-muted/20 animate-pulse" />,
  ssr: true,
});

const CanvasFramesShowcase = dynamic(
  () => import("@framecraft/ui").then((m) => m.CanvasFramesShowcase),
  {
    loading: () => <div className="h-80 bg-muted/20 animate-pulse" />,
    ssr: true,
  }
);

const PrintAndFrameService = dynamic(
  () => import("@framecraft/ui").then((m) => m.PrintAndFrameService),
  {
    loading: () => <div className="h-80 bg-muted/20 animate-pulse" />,
    ssr: true,
  }
);

const MatDesignerShowcase = dynamic(
  () => import("@framecraft/ui").then((m) => m.MatDesignerShowcase),
  {
    loading: () => <div className="h-80 bg-muted/20 animate-pulse" />,
    ssr: true,
  }
);

const GlazingShowcase = dynamic(() => import("@framecraft/ui").then((m) => m.GlazingShowcase), {
  loading: () => <div className="h-80 bg-muted/20 animate-pulse" />,
  ssr: true,
});

const SpecialtyDesignersShowcase = dynamic(
  () => import("@framecraft/ui").then((m) => m.SpecialtyDesignersShowcase),
  {
    loading: () => <div className="h-80 bg-muted/20 animate-pulse" />,
    ssr: true,
  }
);

const EducationTeasers = dynamic(() => import("@framecraft/ui").then((m) => m.EducationTeasers), {
  loading: () => <div className="h-80 bg-muted/20 animate-pulse" />,
  ssr: true,
});
// Import store-specific data
import heroImagesDataRaw from "../data/heroImages.json";
import testimonialsData from "../data/testimonials.json";
import type { HeroImage } from "@framecraft/core";

// Type assertion for hero images data
const heroImagesData = heroImagesDataRaw as HeroImage[];

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
      {/* Hero - Video/visual at top for visibility */}
      <Hero
        title={brandConfig.branding?.tagline || "Custom Picture Frames in Any Size"}
        subtitle={
          brandConfig.branding?.valueProposition ||
          "Design your custom frame in minutes with exact dimensions"
        }
        ctaPrimary={{ label: "Start Designing", href: "#designer" }}
        ctaSecondary={{ label: "Browse Frames", href: "/picture-frames" }}
        heroImagesData={heroImagesData}
      />

      {/* H1 and Value Proposition */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-center mb-6">
            Custom Picture Frames | Any Size, Any Style
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-center mb-8 max-w-3xl mx-auto leading-relaxed">
            Design your perfect custom picture frame online. Choose from 100+ professional frame
            styles, any size from 4×4 to 60×60 inches, with instant pricing and real-time preview.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/designer"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Designing Now
            </a>
            <a
              href="/frames"
              className="inline-flex items-center justify-center px-8 py-3 border border-input bg-background rounded-lg font-semibold hover:bg-muted transition-colors"
            >
              Browse Frame Styles
            </a>
          </div>
        </div>
      </section>

      {/* Section 1: Design Your Perfect Frame Online */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold mb-4">Design Your Perfect Frame Online</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our interactive frame designer puts professional customization at your fingertips.
            Upload your artwork, enter exact dimensions, and visualize your finished frame with
            photorealistic rendering.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">100+</div>
            <p className="text-muted-foreground">Frame Styles to Choose From</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">4×4 to 60×60</div>
            <p className="text-muted-foreground">Any Size You Need (1/8&quot; Precision)</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">Instant</div>
            <p className="text-muted-foreground">Real-Time Pricing &amp; Preview</p>
          </div>
        </div>

        <div className="bg-muted/40 rounded-lg p-8 text-center">
          <p className="text-lg font-semibold mb-4">Ready to Create?</p>
          <a
            href="/designer"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Open Frame Designer
          </a>
        </div>
      </section>

      {/* Section 2: Why Choose Us */}
      <section className="bg-muted/20 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            Why Choose CustomFrameSizes?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Professional Quality</h3>
              <p className="text-muted-foreground">
                Premium hardwoods, museum-quality materials, and professional-grade glazing options
                ensure your framed artwork looks museum-quality for decades.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Custom Everything</h3>
              <p className="text-muted-foreground">
                Any size, any style, any configuration. From standard sizes to oversized specialty
                frames, we build exactly what you envision.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Precision Engineering</h3>
              <p className="text-muted-foreground">
                Our 1/8-inch precision cutting and digital rendering ensures every frame is cut to
                exact specifications and looks exactly like your preview.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Design Expertise</h3>
              <p className="text-muted-foreground">
                With 100+ frame styles and countless customization options, our designers have
                curated the perfect frames for any décor style or purpose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Popular Frame Sizes with Designer Links */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-bold text-center mb-12">Popular Frame Sizes</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { size: "8×10", desc: "Most Popular" },
            { size: "11×14", desc: "Portrait" },
            { size: "16×20", desc: "Large" },
            { size: "24×36", desc: "Poster Size" },
            { size: "5×7", desc: "Small" },
            { size: "12×12", desc: "Square" },
            { size: "18×24", desc: "Landscape" },
            { size: "30×40", desc: "Extra Large" },
          ].map((item) => (
            <a
              key={item.size}
              href={`/designer?size=${item.size}`}
              className="p-4 border rounded-lg text-center hover:border-primary hover:bg-muted/40 transition-colors group"
            >
              <div className="font-bold text-lg group-hover:text-primary transition-colors">
                {item.size}
              </div>
              <div className="text-sm text-muted-foreground">{item.desc}</div>
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Need a different size? Our designer handles any custom dimensions.
          </p>
          <a
            href="/designer"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            View All Sizes in Designer
          </a>
        </div>
      </section>

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

      {/* Print & Frame Service */}
      <PrintAndFrameService />

      {/* Section 5: Featured Designs Gallery */}
      <section className="bg-muted/20 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            Featured Frame Designs
          </h2>
          <FrameStylesShowcase frames={pictureFrames} />
          <div className="text-center mt-12">
            <a
              href="/frames"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              View All Frame Styles
            </a>
          </div>
        </div>
      </section>

      {/* Section 4: Customer Testimonials */}
      {showTestimonial && (
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>
          <TestimonialCarousel testimonialsData={testimonialsData} />
        </section>
      )}

      {/* Showcase Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--section-gap)" }}>
        {brandConfig.features?.showHomeTestimonial && <HowItWorks />}
        <ShadowboxShowcase frames={shadowboxFrames} />
        <MatDesignerShowcase />
        <CanvasFramesShowcase />
        <GlazingShowcase />
        <SpecialtyDesignersShowcase />
        <ValueProps />
        {brandConfig.features?.enableGallery && <InspirationGallery />}
        <EducationTeasers />
        <FaqMini />
        <SeoTextBlock />
      </div>
    </>
  );
}
