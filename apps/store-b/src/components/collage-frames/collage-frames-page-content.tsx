"use client";

/* eslint-disable react/no-unescaped-entities -- long-form landing copy migrated from origina-store-b */

import { KeyFeaturesBar, type Feature } from "@/components/marketing/key-features-bar";

import {
  collageFaqItems,
  collageFaqJsonLd,
  collageProductJsonLd,
} from "./collage-frames-json-ld";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
  Baby,
  Award,
  Camera,
  Frame,
  Gift,
  GraduationCap,
  Grid3X3,
  Heart,
  Images,
  Layers,
  Shield,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import { Button, Card, CollageLifestyleCarousel, Dialog, DialogContent, DialogTitle } from "@framecraft/ui";

import { useScrollToTop } from "@/hooks/use-scroll-to-top";

const CollageFrameDesignerDynamic = dynamic(
  () => import("@framecraft/ui").then((m) => ({ default: m.CollageFrameDesigner })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[560px] flex items-center justify-center bg-muted/20">
        <p className="text-muted-foreground">Loading designer…</p>
      </div>
    ),
  }
);

const collageFeatures: Feature[] = [
  {
    icon: Grid3X3,
    title: "20+ Layouts",
    subtitle: "Grids to Gallery Walls",
    testId: "feature-layouts"
  },
  {
    icon: Shield,
    title: "Light Protection",
    subtitle: "Framer's Grade Acrylic",
    testId: "feature-uv-protection"
  },
  {
    icon: Images,
    title: "Multi-Opening",
    subtitle: "2-25 Photo Openings",
    testId: "feature-multi-opening"
  },
  {
    icon: Frame,
    title: "Custom Sizes",
    subtitle: "4×4 to 16×20 Photos",
    testId: "feature-custom-sizes"
  }
];

export function CollageFramesPageContent() {
  useScrollToTop();
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);
  const [fullscreenImageUrl, setFullscreenImageUrl] = useState('');
  const [fullscreenImageAlt, setFullscreenImageAlt] = useState('');

  const handleImageClick = (url: string, alt: string) => {
    setFullscreenImageUrl(url);
    setFullscreenImageAlt(alt);
    setShowFullscreenImage(true);
  };

  const applications = [
    { icon: Heart, title: "Wedding Photo Displays", description: "Showcase your special day in one frame" },
    { icon: Baby, title: "Baby's First Year", description: "Capture monthly milestones together" },
    { icon: GraduationCap, title: "School Year Memories", description: "Display K-12 photos in one piece" },
    { icon: Users, title: "Family Portraits", description: "Combine generations in gallery style" },
    { icon: Camera, title: "Travel Photo Collections", description: "Frame your adventures together" },
    { icon: Gift, title: "Anniversary Gifts", description: "Ideal for milestone celebrations" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collageProductJsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collageFaqJsonLd) }} />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
              <Grid3X3 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary" data-testid="badge-hero">
                Photo Collage Frames
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight" data-testid="heading-hero">
              Custom Photo Collage Frames
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto" data-testid="text-hero-description">
              Custom multi-opening frames with 2 to 12 photo windows. Grid, staggered, and mixed layouts with acid-free matting.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Images className="w-4 h-4" aria-hidden="true" />
                <span>2-25 Photo Openings</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" aria-hidden="true" />
                <span>Framer's Grade Acrylic</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" aria-hidden="true" />
                <span>50+ Mat Colors</span>
              </div>
            </div>
          </div>
        </section>

        <KeyFeaturesBar features={collageFeatures} />

        {/* Designer Section */}
        <section className="border-t">
          <CollageFrameDesignerDynamic />
        </section>

        {/* Lifestyle Carousel Section */}
        <section className="border-t">
          <CollageLifestyleCarousel onImageClick={handleImageClick} />
        </section>

        {/* What Are Collage Frames - Educational Content for SEO */}
        <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" data-testid="heading-what-are-collage-frames">
              What goes into a multi-opening display
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-muted-foreground mb-4 leading-relaxed">
                A multi opening frame shows several photos in one picture frame. A multi opening mat holds each photo in its own cutout, creating a gallery look. This lets you tell a story, a wedding day, baby's first year, or family trip, in one piece.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Multi photo frames work for standard sizes from 4×4 to 16×20 inches. Each layout is precision-cut so photos fit perfectly. Pick grid patterns for same-size photos, mixed layouts for different angles, or shapes like circles and hearts.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Our Collage Frames */}
        <section className="container mx-auto px-4 py-12 md:py-16 border-t">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="heading-why-choose">
                Why group photos in one frame
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
                      Choose from simple grids, gallery walls, mixed orientations, and creative shapes. Each layout is designed for visual balance.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Shield className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Framer's Grade Acrylic</h3>
                    <p className="text-sm text-muted-foreground">
                      Blocks harmful light that fades photos over time. Non-glare option available for bright rooms.
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
                      Professional-grade matting prevents yellowing and photo damage. Your memories stay vibrant for decades.
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
                    <h3 className="font-semibold mb-2">Multi-opening mats cut to fit</h3>
                    <p className="text-sm text-muted-foreground">
                      Each multi opening mat is cut to exact photo sizes. Photos fit perfectly without trimming or cropping.
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
                      Add a reveal color between photos and the top mat. Creates depth and visual interest around each opening.
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
                      Add engraved text for family names, wedding dates, or special occasions. Makes a thoughtful personalized gift.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Collage Layout Categories */}
        <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-layout-categories">
              Collage layout choices
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Four layout categories for every photo collection. Each category offers multiple configurations for different photo counts and orientations.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="font-semibold mb-2">Simple Grid Layouts</h3>
                <p className="text-sm text-muted-foreground">
                  Uniform rectangular openings in 2, 3, 4, 6, 9, or 12-photo grids. Best for photos of the same size and orientation.
                </p>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-2">Mixed Orientation Layouts</h3>
                <p className="text-sm text-muted-foreground">
                  Combine portrait and landscape photos in one frame. Perfect when your photo collection has varied orientations.
                </p>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-2">Gallery Wall Layouts</h3>
                <p className="text-sm text-muted-foreground">
                  Feature one large photo surrounded by smaller images. Creates a focal point with supporting photos around it.
                </p>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-2">Creative Shape Layouts</h3>
                <p className="text-sm text-muted-foreground">
                  Circles, ovals, and hearts for unique presentations. Popular for baby photos, romantic themes, and artistic displays.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Applications/Use Cases */}
        <section className="container mx-auto px-4 py-12 md:py-16 border-t">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="heading-applications">
                What people frame in collage layouts
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Multi opening frames for life's milestone moments
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((app, idx) => {
                const Icon = app.icon;
                return (
                  <Card 
                    key={idx} 
                    className="p-6 hover-elevate active-elevate-2 transition-all"
                    data-testid={`application-card-${idx}`}
                  >
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
                Collage frame questions
              </h2>
              <p className="text-muted-foreground">
                Common questions about multi photo frames and collage displays
              </p>
            </div>

            <div className="space-y-4">
              {collageFaqItems.map((faq, idx) => (
                <Card key={idx} className="p-6" data-testid={`faq-card-${idx}`}>
                  <h3 className="font-semibold mb-2 text-lg">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Fullscreen Image Dialog */}
      <Dialog open={showFullscreenImage} onOpenChange={setShowFullscreenImage}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
          <div className="p-4 flex items-center justify-between border-b">
            <DialogTitle>Lifestyle Photo</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFullscreenImage(false)}
              data-testid="button-close-fullscreen"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-6 flex items-center justify-center bg-muted/30">
            {fullscreenImageUrl && (
              <img 
                src={fullscreenImageUrl} 
                alt={fullscreenImageAlt}
                className="max-w-full max-h-[70vh] object-contain" 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
