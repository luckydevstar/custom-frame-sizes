"use client";

import {
  Card,
  CardContent,
} from "@framecraft/ui/components/ui/card";
import { Button } from "@framecraft/ui/components/ui/button";
import {
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  Mail,
  MapPin,
  Package,
  Phone,
  Repeat,
  Ruler,
  Shield,
  Sliders,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

/** origina-store-b/client/src/pages/AboutPage.tsx — structure, copy, and data-testids */
export function AboutPageContent() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About ShadowboxFrames.com",
    description:
      "Meet the shadow box specialist. We handcraft artisanal shadow box frames in our small-batch workshop, focused entirely on framing the moments that matter most.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero Section */}
      <section className="bg-muted/30 py-16 sm:py-20" data-testid="section-about-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1
            className="font-serif font-semibold mb-4"
            style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}
            data-testid="text-about-title"
          >
            About ShadowboxFrames.com
          </h1>
          <p
            className="text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            style={{ fontSize: "clamp(1rem, 3vw, 1.125rem)" }}
          >
            ShadowboxFrames.com exists for one reason: shadow boxes deserve a dedicated specialist.
            While other frame shops squeeze shadow boxes into the corner of their catalog, we built our
            entire workshop around them. Every tool, every material, and every member of our team is focused
            on crafting the finest shadow box frames you can find.
          </p>
          <p className="text-sm text-muted-foreground mt-4">The Shadow Box Specialist</p>
        </div>
      </section>

      {/* Exact Sizes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16" data-testid="section-exact-sizes">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Ruler className="h-6 w-6 text-primary" />
              </div>
              <h2
                className="font-serif font-semibold"
                style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}
              >
                Our Small-Batch Workshop
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We keep our operation intentionally small. Our workshop produces shadow boxes in careful
              batches, never rushing through orders or cutting corners. This approach means every frame gets
              the hands-on attention it needs, from the first cut of moulding to the final quality check
              before shipping.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You are not a ticket number here. You are a person with a story worth framing.
            </p>
          </div>
          <Card className="p-6">
            <CardContent className="p-0 space-y-4">
              <h3 className="font-semibold text-lg">An Artisanal Approach to Shadow Boxes</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Artisanal is not just a word we use. It describes how we work. Our craftspeople select each piece
                of moulding by hand, checking grain and finish quality before a single cut is made. Joints are
                fitted and glued with care. Backings are cut clean. Glazing is inspected for clarity. We treat
                every shadow box like it is going on our own wall, because the keepsakes inside matter to
                someone.
              </p>
              <ul className="space-y-3">
                {[
                  { icon: Ruler, text: "We do one thing and we do it exceptionally well" },
                  { icon: Sliders, text: "Every frame is built with individual attention" },
                  { icon: Eye, text: "Proudly crafted in our workshop in the United States" },
                  { icon: DollarSign, text: "Talk to real people who understand shadow boxes" },
                ].map((item, i) => (
                  <li key={item.text} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground text-sm font-medium pt-2">Shadow boxes are our entire focus.</p>
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
            <h2
              className="font-serif font-semibold mb-3"
              style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}
            >
              Why We Focus Exclusively on Shadow Boxes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Shadow boxes are different from flat frames. They require deeper mouldings, careful engineering for
              weight and structure, and an understanding of how three-dimensional objects interact with light,
              depth, and background. By focusing entirely on shadow boxes, we have developed a level of skill
              and material knowledge that generalist shops simply cannot match. This is our craft, and we are
              proud of it.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "Deeper mouldings engineered for weight",
              "Three-dimensional display expertise",
              "Specialized material knowledge",
              "Dedicated shadow box craftsmanship",
            ].map((item) => (
              <Card key={item} className="p-4">
                <CardContent className="p-0 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-muted-foreground text-center mt-6">This is what we do, and we do it with pride.</p>
        </div>
      </section>

      {/* Materials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16" data-testid="section-materials">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-serif font-semibold" style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}>
            Made in the USA, Built with Heart
          </h2>
        </div>
        <p className="text-muted-foreground leading-relaxed max-w-3xl mb-4">
          Every shadow box we sell is crafted in our American workshop by people who care about what they are
          building. We source our wood mouldings from responsible suppliers, our acid-free materials from trusted
          conservation vendors, and our glazing from American manufacturers. When you open a box from
          ShadowboxFrames.com, you are holding something made with real hands and genuine pride.
        </p>
        <p className="text-muted-foreground font-medium">Crafted with care, shipped with pride.</p>
      </section>

      {/* Transparent Pricing Section */}
      <section className="bg-muted/30 py-12 sm:py-16" data-testid="section-pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h2 className="font-serif font-semibold" style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}>
              What you see is what you pay
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-3xl mb-4">
            You&apos;ll see pricing as you build your frame. There are no hidden charges and no last-minute surprises.
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            Because every frame is custom-made to order, items are final sale when produced correctly. If a frame
            arrives damaged or does not meet production specifications, we address it promptly.
          </p>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16" data-testid="section-who-we-serve">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-serif font-semibold" style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}>
            The people behind the shadow boxes
          </h2>
        </div>
        <p className="text-muted-foreground mb-6">ShadowboxFrames.com supports a wide range of customers, including:</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Individuals framing artwork, photos, and prints",
            "Collectors and enthusiasts framing specialty items",
            "Businesses ordering frames in volume or for resale",
            "Schools, teams, and organizations framing awards and memorabilia",
            "Designers and photographers requiring exact sizes",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 p-3">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16" data-testid="section-quality">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-lg">Quality You Can Rely On</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Every frame is inspected before it ships. Craftsmanship and manufacturing defects are covered under our
                quality guarantee, and issues caused by shipping damage are handled according to our shipping policy.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We take responsibility for how our frames are built, and we stand behind that work.
              </p>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-lg">Production and Logistics</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Standard production:</span> typically ships in 3-7
                  business days
                </li>
                <li>
                  <span className="font-medium text-foreground">Rush production:</span> available by request
                </li>
                <li>
                  <span className="font-medium text-foreground">Shipping:</span> standard ground service via major
                  carriers
                </li>
                <li>
                  <span className="font-medium text-foreground">Local pickup & drop-off:</span> available in Somerset,
                  NJ by appointment
                </li>
              </ul>
              <p className="text-muted-foreground text-sm mt-4">
                Our goal is to keep custom framing predictable, efficient, and professional from order to delivery.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="bg-muted/30 py-12 sm:py-16" data-testid="section-approach">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif font-semibold mb-4" style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}>
            How we work
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We are not a retail framing counter and not a catalog of pre-made sizes. We operate as a precision custom
            framing manufacturer, designed to deliver accurate, repeatable results through a modern ordering
            experience.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            That approach allows us to serve both individual customers and organizations with the same level of care
            and consistency.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16" data-testid="section-cta">
        <Card className="p-8 text-center">
          <CardContent className="p-0">
            <h2 className="font-serif font-semibold mb-3" style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}>
              Build your first shadow box
            </h2>
            <p className="text-muted-foreground mb-4">
              If precision matters, and standard sizes won&apos;t do, ShadowboxFrames.com was built for you.
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
                href="mailto:hello@shadowboxframes.com"
                className="flex items-center justify-center gap-2 hover:text-primary transition-colors"
                data-testid="link-email"
              >
                <Mail className="h-4 w-4" />
                hello@shadowboxframes.com
              </a>
              <a
                href="tel:+18888747156"
                className="flex items-center justify-center gap-2 hover:text-primary transition-colors"
                data-testid="link-phone"
              >
                <Phone className="h-4 w-4" />
                1 (888) 874-7156
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>6 Shirley Ave, Somerset, NJ 08873</span>
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-muted-foreground italic mt-6">Custom framing, built to fit, exactly.</p>
      </section>
    </>
  );
}
