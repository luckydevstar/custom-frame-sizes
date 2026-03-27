import { getStoreBaseAssetUrl } from "@framecraft/core";
import { Button } from "@framecraft/ui";
import { GraduationCap, Shield, Ruler, Award, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diploma Frames | Custom College & University Diploma Framing | CustomFrameSizes.com",
  description:
    "Custom diploma frames for college and university degrees. Museum-grade archival framing with UV glazing. Any size, including honors seals and tassels. Design your diploma frame online.",
  openGraph: {
    title: "Diploma Frames | Custom College & University Framing",
    description:
      "Museum-grade diploma frames with archival materials and UV protection. Custom sizing for any institution. Design online with instant pricing.",
    type: "website",
    url: "/diploma-frames",
  },
  alternates: { canonical: "/diploma-frames" },
};

export default function DiplomaFramesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">College &amp; University</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Diploma Frames</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Display your degree with museum-grade diploma frames. Custom sizing for any institution,
            with archival materials and UV-filtering glazing to protect your achievement for life.
          </p>
          <Button asChild size="lg">
            <Link href="/diploma-certificate-frames">Design Your Diploma Frame</Link>
          </Button>
        </div>
      </section>

      {/* Description: 200–300 words */}
      <section className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Why Frame Your Diploma?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A diploma represents years of hard work and achievement. Framing it properly protects
              the document from light, humidity, and handling while giving it a professional
              presence in your home or office. Diploma frames are deeper than standard picture
              frames to accommodate raised seals, ribbons, and tassels that many institutions
              attach. Custom diploma framing ensures the exact dimensions of your document—whether
              8.5×11, 11×14, or an unusual size—fit with appropriate mat borders and no trimming or
              forcing.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We build diploma frames to order with archival mat board, acid-free backing, and
              UV-filtering glazing (acrylic or glass) so the paper and ink stay stable for decades.
              Our designer supports standard college and university sizes, professional license
              dimensions, and international formats like A4. You choose the frame style, mat color
              and width, and glazing; we build and ship your frame ready to display. Ideal for
              bachelor&apos;s and master&apos;s degrees, doctoral diplomas, and professional
              certifications.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Benefits of Custom Diploma Frames
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <Shield className="w-8 h-8 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold mb-1">UV Protection</h3>
                  <p className="text-sm text-muted-foreground">
                    Museum-grade glazing blocks harmful light so your diploma won&apos;t fade or
                    yellow over time.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Ruler className="w-8 h-8 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold mb-1">Exact Sizing</h3>
                  <p className="text-sm text-muted-foreground">
                    Any size from 8×10 to large university formats. We support seals, tassels, and
                    odd dimensions.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Award className="w-8 h-8 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold mb-1">Archival Materials</h3>
                  <p className="text-sm text-muted-foreground">
                    Acid-free mats and backing keep your document safe for generations.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <BookOpen className="w-8 h-8 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold mb-1">Professional Look</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose from classic and modern frame styles to match your office or home décor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery placeholder / CTA */}
      <section className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-muted/30">
                <Image
                  src={getStoreBaseAssetUrl("frames/8446/lifestyle_2.jpg")}
                  alt="Custom framed diploma displayed in professional setting"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Ready to Frame Your Diploma?</h2>
                <p className="text-muted-foreground mb-6">
                  Use our diploma and certificate designer to choose your size, frame style, mat,
                  and glazing. Instant pricing and a realistic preview.
                </p>
                <Button asChild size="lg">
                  <Link href="/diploma-certificate-frames">Open Diploma Designer</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related guides */}
      <section className="border-t py-12 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Related Guides</h2>
            <ul className="grid md:grid-cols-3 gap-4">
              <li>
                <Link
                  href="/learn"
                  className="block p-4 rounded-lg border bg-card hover:border-primary/30 transition-colors"
                >
                  <span className="font-medium">How to Measure for a Diploma Frame</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get the right dimensions for your degree.
                  </p>
                </Link>
              </li>
              <li>
                <Link
                  href="/learn"
                  className="block p-4 rounded-lg border bg-card hover:border-primary/30 transition-colors"
                >
                  <span className="font-medium">UV Glass vs Regular Glass</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Why archival glazing matters for diplomas.
                  </p>
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="block p-4 rounded-lg border bg-card hover:border-primary/30 transition-colors"
                >
                  <span className="font-medium">Diploma Framing FAQ</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Common questions about diploma frames.
                  </p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
