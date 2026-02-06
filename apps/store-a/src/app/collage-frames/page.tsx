import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import {
  Grid3X3,
  Images,
  Shield,
  Award,
  Frame,
  Layers,
  Sparkles,
  Heart,
  GraduationCap,
  Users,
  Camera,
  Gift,
} from "lucide-react";
import { Card } from "@framecraft/ui";
import { CollageLifestyleSection } from "./CollageLifestyleSection";
import { brandConfig } from "../../brand.config";
import { ScrollToDesignerButton } from "./scroll-button";

const CollageFrameDesigner = dynamic(
  () => import("@framecraft/ui").then((mod) => ({ default: mod.CollageFrameDesigner })),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Multi Opening Frames | Multi Photo Frames & Collage Mats | Custom Frame Sizes",
  description:
    "Custom multi opening frames with multi opening mats for 2-25 photos. Display family pictures in a multi photo frame with 20+ layouts, framer's grade acrylic, and archival matting. Fits photo sizes 4×4 to 16×20.",
  keywords:
    "collage frame, multi opening frame, multi opening mat, photo collage frame, multi photo frame, family photo frame, picture collage frame, gallery wall frame, multiple opening frame, custom collage frame, wedding collage frame, baby collage frame",
  openGraph: {
    title: "Multi Opening Frames | Multi Photo Frames & Collage Mats",
    description:
      "Display 2-25 photos in one multi opening frame. 20+ layouts for family photos, weddings, and milestone memories with framer's grade acrylic and archival matting.",
    type: "website",
    url: "/collage-frames",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multi Opening Frames | Multi Photo Frames & Collage Mats",
    description:
      "Display 2-25 photos in one multi photo frame. 20+ layouts with framer's grade acrylic and archival matting.",
  },
  alternates: { canonical: "/collage-frames" },
};

const applications = [
  {
    icon: Heart,
    title: "Wedding Photo Displays",
    description: "Showcase your special day in one frame",
  },
  {
    icon: GraduationCap,
    title: "Baby's First Year",
    description: "Capture monthly milestones together",
  },
  {
    icon: GraduationCap,
    title: "School Year Memories",
    description: "Display K-12 photos in one piece",
  },
  { icon: Users, title: "Family Portraits", description: "Combine generations in gallery style" },
  {
    icon: Camera,
    title: "Travel Photo Collections",
    description: "Frame your adventures together",
  },
  { icon: Gift, title: "Anniversary Gifts", description: "Perfect for milestone celebrations" },
];

const faqs = [
  {
    question: "What is a collage frame?",
    answer:
      "A collage frame is a multi photo frame with multiple openings cut into one mat board. Each opening holds a separate photo, letting you display 2 to 12 or more photos in one piece. Collage frames are also called multi opening frames.",
  },
  {
    question: "What is a multi opening mat?",
    answer:
      "A multi opening mat is a mat board with multiple cutouts to hold several photos in one frame. The mat separates and highlights each photo while creating a unified gallery look. Our multi opening mats are precision-cut for standard photo sizes from 4×4 to 16×20 inches.",
  },
  {
    question: "What photo sizes work with collage frames?",
    answer:
      "Our collage frames accommodate standard photo sizes: 4×4, 4×6, 5×7, 8×10, 11×14, and 16×20 inches. Each layout is designed for a specific photo size, though many layouts work with multiple sizes. The designer shows your exact frame dimensions based on your photo size selection.",
  },
  {
    question: "Can I mix portrait and landscape photos?",
    answer:
      "Yes! Many of our multi-opening layouts include both portrait and landscape openings. This lets you mix photo orientations in the same frame. Check the Mixed Orientation category for layouts designed specifically for this purpose.",
  },
  {
    question: "How do I choose the right collage layout?",
    answer:
      "Consider how many photos you want to display and their orientations. Simple grids work well for uniform photos. Gallery layouts feature one large photo with smaller surrounding images. Creative layouts offer circles, ovals, and hearts for unique displays.",
  },
  {
    question: "Can I add text or a nameplate?",
    answer:
      "Yes! Add an optional brass engraved nameplate to any collage frame. This works well for family names, wedding dates, baby names, or graduation years. The nameplate appears below the mat openings.",
  },
  {
    question: "What mat colors are available?",
    answer:
      "Choose from 50+ mat colors including whites, creams, blacks, and accent colors. You can also select a double mat with a reveal color for added depth. Premium options include suede and linen textures.",
  },
  {
    question: "Do multi opening frames include light protection?",
    answer:
      "Yes! All multi photo frames include framer's grade acrylic glazing. This blocks harmful light that causes photos to fade. Upgrade to non-glare acrylic to reduce reflections in bright rooms.",
  },
];

export default function CollageFramesPage() {
  const pageUrl = `${brandConfig.seo?.canonicalUrl || ""}/collage-frames`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Custom Collage Frames",
    description:
      "Multi photo frames for displaying 2-25 photos in custom layouts. Choose from 20+ professional arrangements with archival matting and framer's grade acrylic for family photos, weddings, and milestone memories.",
    brand: { "@type": "Brand", name: "Custom Frame Sizes" },
    offers: {
      "@type": "AggregateOffer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
    },
    category: "Picture Frames",
    itemCondition: "https://schema.org/NewCondition",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: brandConfig.seo?.canonicalUrl || "" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Specialty Framing",
        item: `${brandConfig.seo?.canonicalUrl || ""}/specialty-framing`,
      },
      { "@type": "ListItem", position: 3, name: "Collage Frames", item: pageUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
              <Grid3X3 className="w-4 h-4 text-primary" aria-hidden />
              <span className="text-sm font-medium text-primary" data-testid="badge-hero">
                Multi-Opening Picture Frames
              </span>
            </div>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight"
              data-testid="heading-hero"
            >
              Collage Frames in Custom Sizes
            </h1>
            <p
              className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto"
              data-testid="text-hero-description"
            >
              Show multiple photos in one multi opening frame with precision-cut mats. Pick from 20+
              layouts for family photos, wedding memories, and milestone collections. Every multi
              photo frame includes framer&apos;s grade acrylic and archival matting.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Images className="w-4 h-4" aria-hidden />
                <span>2-25 Photo Openings</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" aria-hidden />
                <span>Framer&apos;s Grade Acrylic</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" aria-hidden />
                <span>50+ Mat Colors</span>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <ScrollToDesignerButton />
            </div>
          </div>
        </section>

        {/* Benefit Bar */}
        <section className="border-y bg-muted/20">
          <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
            <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
              <div className="text-center" data-testid="feature-layouts">
                <Grid3X3 className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">20+ Layouts</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Grids to Gallery Walls
                </p>
              </div>
              <div className="text-center" data-testid="feature-uv-protection">
                <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                  Light Protection
                </p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Framer&apos;s Grade Acrylic
                </p>
              </div>
              <div className="text-center" data-testid="feature-multi-opening">
                <Images className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Multi-Opening</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  2-25 Photo Openings
                </p>
              </div>
              <div className="text-center" data-testid="feature-custom-sizes">
                <Frame className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Custom Sizes</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  4×4 to 16×20 Photos
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Designer Section */}
        <section
          id="design-tool"
          className="container mx-auto px-4 py-12 md:py-16 border-t scroll-mt-20"
          data-testid="designer-section"
        >
          <Suspense
            fallback={
              <div className="min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Loading designer...</p>
              </div>
            }
          >
            <CollageFrameDesigner />
          </Suspense>
        </section>

        {/* Lifestyle Carousel Section */}
        <CollageLifestyleSection />

        {/* What Is a Multi Opening Frame */}
        <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              data-testid="heading-what-are-collage-frames"
            >
              What Is a Multi Opening Frame?
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-muted-foreground mb-4 leading-relaxed">
                A multi opening frame shows several photos in one picture frame. A multi opening mat
                holds each photo in its own cutout, creating a gallery look. This lets you tell a
                story—a wedding day, baby&apos;s first year, or family trip—in one piece.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Multi photo frames work for standard sizes from 4×4 to 16×20 inches. Each layout is
                precision-cut so photos fit perfectly. Pick grid patterns for same-size photos,
                mixed layouts for different angles, or shapes like circles and hearts.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose a Multi Opening Frame */}
        <section className="container mx-auto px-4 py-12 md:py-16 border-t">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="heading-why-choose">
                Why Choose a Multi Opening Frame
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                One frame tells a complete story
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Grid3X3 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">20+ Professional Layouts</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose from simple grids, gallery walls, mixed orientations, and creative
                      shapes. Each layout is designed for visual balance.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Shield className="w-6 h-6 text-primary" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Framer&apos;s Grade Acrylic</h3>
                    <p className="text-sm text-muted-foreground">
                      Blocks harmful light that fades photos over time. Non-glare option available
                      for bright rooms.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Archival Mat Board</h3>
                    <p className="text-sm text-muted-foreground">
                      Professional-grade matting prevents yellowing and photo damage. Your memories
                      stay vibrant for decades.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Images className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Precision-Cut Multi Opening Mats</h3>
                    <p className="text-sm text-muted-foreground">
                      Each multi opening mat is cut to exact photo sizes. Photos fit perfectly
                      without trimming or cropping.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Layers className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Double Mat Option</h3>
                    <p className="text-sm text-muted-foreground">
                      Add a reveal color between photos and the top mat. Creates depth and visual
                      interest around each opening.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Optional Brass Nameplate</h3>
                    <p className="text-sm text-muted-foreground">
                      Add engraved text for family names, wedding dates, or special occasions. Makes
                      a thoughtful personalized gift.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Layout Categories */}
        <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              data-testid="heading-layout-categories"
            >
              Multi Opening Frame Layout Options
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Four layout categories for every photo collection. Each category offers multiple
              configurations for different photo counts and orientations.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="font-semibold mb-2">Simple Grid Layouts</h3>
                <p className="text-sm text-muted-foreground">
                  Uniform rectangular openings in 2, 3, 4, 6, 9, or 12-photo grids. Best for photos
                  of the same size and orientation.
                </p>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-2">Mixed Orientation Layouts</h3>
                <p className="text-sm text-muted-foreground">
                  Combine portrait and landscape photos in one frame. Perfect when your photo
                  collection has varied orientations.
                </p>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-2">Gallery Wall Layouts</h3>
                <p className="text-sm text-muted-foreground">
                  Feature one large photo surrounded by smaller images. Creates a focal point with
                  supporting photos around it.
                </p>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-2">Creative Shape Layouts</h3>
                <p className="text-sm text-muted-foreground">
                  Circles, ovals, and hearts for unique presentations. Popular for baby photos,
                  romantic themes, and artistic displays.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="container mx-auto px-4 py-12 md:py-16 border-t">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2
                className="text-3xl md:text-4xl font-bold mb-3"
                data-testid="heading-applications"
              >
                Popular Uses for Multi Photo Frames
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Multi opening frames for life&apos;s milestone moments
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((app, idx) => {
                const Icon = app.icon;
                return (
                  <Card key={idx} className="p-6" data-testid={`application-card-${idx}`}>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{app.title}</h3>
                        <p className="text-sm text-muted-foreground">{app.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="heading-faq">
                Multi Opening Frame Questions
              </h2>
              <p className="text-muted-foreground">
                Common questions about multi photo frames and collage displays
              </p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <Card key={idx} className="p-6" data-testid={`faq-card-${idx}`}>
                  <h3 className="font-semibold mb-2 text-lg">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
