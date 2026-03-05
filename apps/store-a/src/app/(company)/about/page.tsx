import type { Metadata } from "next";
import Link from "next/link";
import {
  Ruler,
  Package,
  Users,
  Shield,
  Clock,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Repeat,
  Eye,
  DollarSign,
  Sliders,
  CreditCard,
} from "lucide-react";
import { Card, CardContent } from "@framecraft/ui";
import { Button } from "@framecraft/ui";

export const metadata: Metadata = {
  title: "About CustomFrameSizes.com – Precision Custom Framing | Custom Frame Sizes",
  description:
    "Custom framing built to your exact specifications. Every frame made to order with professional-grade materials. Standard production ships in 3–7 business days.",
  openGraph: {
    title: "About CustomFrameSizes.com – Precision Custom Framing",
    description: "Custom framing built to your exact specifications. Every frame made to order.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-muted/30 py-16 sm:py-20" data-testid="section-about-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1
            className="font-serif font-semibold mb-4 text-2xl md:text-3xl lg:text-4xl text-foreground"
            data-testid="text-about-title"
          >
            Precision Custom Framing, Without Compromise
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            CustomFrameSizes.com was built to deliver exact-size custom framing with consistency,
            clarity, and professional execution. Every frame we produce is made to order — sized
            precisely to your specifications and assembled with materials chosen for durability,
            presentation, and longevity.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Operated by CustomPictureFrames LLC, a custom framing manufacturer focused on precision
            production and dependable results.
          </p>
        </div>
      </section>

      {/* Exact Sizes Section */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
        data-testid="section-exact-sizes"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Ruler className="h-6 w-6 text-primary" />
              </div>
              <h2 className="font-serif font-semibold text-xl md:text-2xl text-foreground">
                Designed for Exact Sizes
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Most artwork doesn&apos;t fit standard dimensions — and forcing it to rarely ends
              well. Our platform exists to eliminate that compromise.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We manufacture frames to the exact size you specify, including fractional,
              non-standard, and oversized dimensions. No rounding. No guesswork. The frame is built
              to the artwork, not the other way around.
            </p>
          </div>
          <Card className="p-6">
            <CardContent className="p-0 space-y-4">
              <h3 className="font-semibold text-lg text-foreground">
                A More Controlled Framing Experience
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                CustomFrameSizes.com combines modern design tools with disciplined production
                processes, giving customers control without complexity.
              </p>
              <p className="text-muted-foreground text-sm font-medium text-foreground">
                Our interactive designer allows you to:
              </p>
              <ul className="space-y-3">
                {[
                  { icon: Ruler, text: "Specify exact dimensions" },
                  { icon: Sliders, text: "Choose frame profiles, matting, and glazing" },
                  { icon: Eye, text: "Preview your frame before ordering" },
                  { icon: DollarSign, text: "See pricing update in real time" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground text-sm font-medium pt-2">
                What you design is what we build.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Built for Consistency Section */}
      <section className="bg-muted/30 py-12 sm:py-16" data-testid="section-consistency">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Repeat className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h2 className="font-serif font-semibold mb-3 text-xl md:text-2xl text-foreground">
              Built for Consistency and Scale
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Many of our customers return because they need repeatable results — the same frame,
              built the same way, every time.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "Reorders with identical specifications",
              "Bulk and program-based framing",
              "Oversized and specialty projects",
              "Business, institutional, and collector needs",
            ].map((item, i) => (
              <Card key={i} className="p-4">
                <CardContent className="p-0 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-muted-foreground text-center mt-6">
            Whether you&apos;re ordering one frame or many, the process remains consistent.
          </p>
        </div>
      </section>

      {/* Materials Section */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
        data-testid="section-materials"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-serif font-semibold text-xl md:text-2xl text-foreground">
            Materials and Assembly Standards
          </h2>
        </div>
        <p className="text-muted-foreground leading-relaxed max-w-3xl mb-4">
          We work with professional-grade materials, including solid wood and metal frame profiles,
          archival mat boards, and quality glazing options. Each frame is assembled with care and
          inspected prior to shipment to ensure it meets our production standards.
        </p>
        <p className="text-muted-foreground font-medium text-foreground">
          Our focus is not novelty — it&apos;s reliability.
        </p>
      </section>

      {/* Transparent Pricing Section */}
      <section className="bg-muted/30 py-12 sm:py-16" data-testid="section-pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h2 className="font-serif font-semibold text-xl md:text-2xl text-foreground">
              Transparent Pricing, Clear Expectations
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-3xl mb-4">
            You&apos;ll see pricing as you build your frame. There are no hidden charges and no
            last-minute surprises.
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            Because every frame is custom-made to order, items are final sale when produced
            correctly. If a frame arrives damaged or does not meet production specifications, we
            address it promptly.
          </p>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
        data-testid="section-who-we-serve"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-serif font-semibold text-xl md:text-2xl text-foreground">
            Who We Serve
          </h2>
        </div>
        <p className="text-muted-foreground mb-6">
          CustomFrameSizes.com supports a wide range of customers, including:
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Individuals framing artwork, photos, and prints",
            "Collectors and enthusiasts framing specialty items",
            "Businesses ordering frames in volume or for resale",
            "Schools, teams, and organizations framing awards and memorabilia",
            "Designers and photographers requiring exact sizes",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground mt-6">
          Our process scales cleanly across use cases without sacrificing precision.
        </p>
      </section>

      {/* Quality & Production Section */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
        data-testid="section-quality"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-lg text-foreground">Quality You Can Rely On</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Every frame is inspected before it ships. Craftsmanship and manufacturing defects
                are covered under our quality guarantee, and issues caused by shipping damage are
                handled according to our shipping policy.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We take responsibility for how our frames are built — and we stand behind that work.
              </p>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-lg text-foreground">Production and Logistics</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Standard production:</span>{" "}
                  typically ships in 3–7 business days
                </li>
                <li>
                  <span className="font-medium text-foreground">Rush production:</span> available by
                  request
                </li>
                <li>
                  <span className="font-medium text-foreground">Shipping:</span> standard ground
                  service via major carriers
                </li>
                <li>
                  <span className="font-medium text-foreground">Local pickup &amp; drop-off:</span>{" "}
                  available in Somerset, NJ by appointment
                </li>
              </ul>
              <p className="text-muted-foreground text-sm mt-4">
                Our goal is to keep custom framing predictable, efficient, and professional from
                order to delivery.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="bg-muted/30 py-12 sm:py-16" data-testid="section-approach">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif font-semibold mb-4 text-xl md:text-2xl text-foreground">
            Our Approach
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We are not a retail framing counter and not a catalog of pre-made sizes. We operate as a
            precision custom framing manufacturer, designed to deliver accurate, repeatable results
            through a modern ordering experience.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            That approach allows us to serve both individual customers and organizations with the
            same level of care and consistency.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16" data-testid="section-cta">
        <Card className="p-8 text-center">
          <CardContent className="p-0">
            <h2 className="font-serif font-semibold mb-3 text-xl md:text-2xl text-foreground">
              Get Started
            </h2>
            <p className="text-muted-foreground mb-4">
              If precision matters — and standard sizes won&apos;t do — CustomFrameSizes.com was
              built for you.
            </p>
            <p className="text-muted-foreground mb-6">
              Design your frame online, or contact our team if you have questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/">
                <Button size="lg" data-testid="button-design-frame">
                  Design Your Frame
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" data-testid="button-contact">
                  Contact Us
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center text-sm text-muted-foreground">
              <a
                href="mailto:hello@customframesizes.com"
                className="flex items-center justify-center gap-2 hover:text-primary transition-colors"
                data-testid="link-email"
              >
                <Mail className="h-4 w-4" />
                hello@customframesizes.com
              </a>
              <a
                href="tel:+18888747156"
                className="flex items-center justify-center gap-2 hover:text-primary transition-colors"
                data-testid="link-phone"
              >
                <Phone className="h-4 w-4" />1 (888) 874-7156
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />6 Shirley Ave, Somerset, NJ 08873
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-muted-foreground italic mt-6">
          Custom framing, built to fit — exactly.
        </p>
      </section>
    </div>
  );
}
