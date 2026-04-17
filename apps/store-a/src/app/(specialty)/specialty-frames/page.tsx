import { Button } from "@framecraft/ui";
import { Shirt, GraduationCap, Award, Box, Film } from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

import { generatePageMetadata } from "@/lib/seo-utils";

export const metadata: Metadata = generatePageMetadata("/specialty-frames", {
  title: "Specialty Frames | Jersey, Diploma, Certificate & More | CustomFrameSizes.com",
  description:
    "Custom specialty frames for jerseys, diplomas, certificates, shadowboxes, movie posters, and more. Design each type with our dedicated tools. Any size, professional materials.",
});

const categories = [
  {
    name: "Shadowbox Frames",
    description: "Display jerseys, medals, memorabilia, and 3D keepsakes with adjustable depth.",
    href: "/shadowbox-frames",
    icon: Box,
  },
  {
    name: "Diploma Frames",
    description: "College and university degrees with archival materials and UV glazing.",
    href: "/diploma-frames",
    icon: GraduationCap,
  },
  {
    name: "Certificate Frames",
    description: "Professional licenses, awards, and corporate credentials. Custom sizing.",
    href: "/certificate-frames",
    icon: Award,
  },
  {
    name: "Jersey Frames",
    description: "Sports jerseys and signed memorabilia in deep shadowbox-style frames.",
    href: "/jersey-frames",
    icon: Shirt,
  },
  {
    name: "Movie Poster Frames",
    description: "Standard and oversized poster sizes with mat and glazing options.",
    href: "/movie-poster-frames",
    icon: Film,
  },
];

export default function SpecialtyFramesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Specialty Frames</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Custom frames for jerseys, diplomas, certificates, shadowboxes, and other specialty
            items. Each category has its own designer so you get the right depth, size, and options
            for your piece.
          </p>
        </div>
      </section>

      {/* Description: 200–300 words */}
      <section className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">What Are Specialty Frames?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Specialty frames are built for specific types of content: diplomas and certificates
              need archival protection and often standard document sizes; shadowboxes need extra
              depth for jerseys, medals, and 3D memorabilia; movie posters and artwork may need
              large formats and specific aspect ratios. Instead of a one-size-fits-all frame, we
              offer dedicated category pages and designers for each. That way you get the right
              depth for a jersey, the right mat and glazing for a diploma, and the right size
              options for posters and certificates.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All our specialty frames are made to order with your exact dimensions. We use archival
              materials where preservation matters and offer UV-filtering glazing to protect against
              fading. Use the links below to go to the designer that fits your item—each page has a
              short description, benefits, and a link to 2–3 related guides so you can choose
              options with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Why Use Our Specialty Designers</h2>
            <ul className="grid md:grid-cols-2 gap-4 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Right depth and size for each item type (jersey vs. diploma vs. poster)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Archival and UV options where preservation matters</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Instant pricing and preview in each designer</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Custom sizing so you never trim or force your piece</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Gallery of categories with links */}
      <section className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Choose Your Specialty Frame Type</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="group block p-6 rounded-lg border bg-card hover:border-primary/40 transition-all"
                  >
                    <Icon className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{cat.description}</p>
                    <span className="inline-block mt-3 text-sm font-medium text-primary">
                      Design {cat.name} →
                    </span>
                  </Link>
                );
              })}
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
                  <span className="font-medium">How to Frame a Jersey</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Step-by-step jersey shadowbox framing.
                  </p>
                </Link>
              </li>
              <li>
                <Link
                  href="/learn"
                  className="block p-4 rounded-lg border bg-card hover:border-primary/30 transition-colors"
                >
                  <span className="font-medium">Picture Frame vs Shadowbox</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    When to choose a shadowbox over a flat frame.
                  </p>
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="block p-4 rounded-lg border bg-card hover:border-primary/30 transition-colors"
                >
                  <span className="font-medium">Framing FAQ</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Common questions about custom framing.
                  </p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">
            Not sure which type you need? Start with our main frame designer for art and photos.
          </p>
          <Button asChild variant="outline" size="lg">
            <Link href="/designer">Open Frame Designer</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
