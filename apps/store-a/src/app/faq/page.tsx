import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions - Custom Picture Frames | Custom Frame Sizes",
  description:
    "Get answers to common questions about custom picture frames, sizes, shipping, local pickup, returns, and quality at CustomFrameSizes.com.",
  openGraph: {
    title: "Frequently Asked Questions - Custom Picture Frames",
    description:
      "Common questions about custom framing, ordering, materials, pricing, shipping, and our quality guarantee.",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I order a custom picture frame?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use our online frame designer to create your custom frame. Upload your image, enter your exact size, choose your frame style, matting, and glazing. You'll see a live preview and real-time pricing before adding your frame to the cart. Every frame is made to your exact specifications.",
      },
    },
    {
      "@type": "Question",
      name: "Can I order a frame in a non-standard size?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Custom sizes are our specialty. You can enter virtually any size you need — including fractional and oversized dimensions. We build frames to fit your artwork, not the other way around.",
      },
    },
    {
      "@type": "Question",
      name: "What glazing options do you offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Standard Glass – clear and affordable; Framer's-Grade Acrylic – lightweight, shatter-resistant, blocks UV light; Premium Non-Glare Acrylic – reduces reflections. Acrylic is recommended for larger frames and shipping safety.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to make a custom frame?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All frames are custom made to order. Standard production time: 3-7 business days before shipment. Production time does not include carrier transit time.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer local pickup?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Free local pickup is available at 6 Shirley Ave, Somerset, NJ 08873. Appointments are preferred, but walk-ins are welcome when possible.",
      },
    },
    {
      "@type": "Question",
      name: "Can I return a custom picture frame?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because all frames are custom made, custom frames are final sale when produced correctly to your specifications. We will gladly repair, remake, or replace any frame that arrives damaged or has a manufacturing defect. See our Returns & Exchanges Policy for full details.",
      },
    },
    {
      "@type": "Question",
      name: "What warranty do you offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We stand behind our craftsmanship. Manufacturing defects and workmanship issues are covered under our warranty. If something isn't right, contact us and we'll review your order.",
      },
    },
  ],
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <HelpCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Support</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-faq">
          Frequently Asked Questions – Custom Picture Frames
        </h1>
        <p className="text-muted-foreground mb-6">
          Have questions about custom picture frames, sizes, shipping, or local pickup? You&apos;re
          in the right place.
        </p>
        <p className="text-muted-foreground mb-10">
          Still need help? Contact us at{" "}
          <a
            href="mailto:hello@customframesizes.com"
            className="text-primary underline hover:no-underline"
          >
            hello@customframesizes.com
          </a>{" "}
          or{" "}
          <a href="tel:+18888747156" className="text-primary underline hover:no-underline">
            1 (888) 874-7156
          </a>
          .
        </p>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              Ordering Custom Picture Frames
            </h2>
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  How do I order a custom picture frame?
                </h3>
                <p className="text-base leading-relaxed mt-1">
                  Use our online frame designer to create your custom frame. Upload your image,
                  enter your exact size, choose your frame style, matting, and glazing. You&apos;ll
                  see a live preview and real-time pricing before adding your frame to the cart.
                  Every frame is made to your exact specifications.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Can I order a frame in a non-standard size?
                </h3>
                <p className="text-base leading-relaxed mt-1">
                  Yes. Custom sizes are our specialty. You can enter virtually any size you need —
                  including fractional and oversized dimensions. We build frames to fit your
                  artwork, not the other way around.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  How do I measure artwork for a custom frame?
                </h3>
                <p className="text-base leading-relaxed mt-1">
                  Measure the visible width and height of your artwork or photo. If you plan to add
                  matting, the opening size will be adjusted automatically in the designer. Our{" "}
                  <Link
                    href="/how-to-measure"
                    className="text-primary underline hover:no-underline"
                  >
                    measuring guide
                  </Link>{" "}
                  walks you through the process step by step.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Can I save my custom frame design?
                </h3>
                <p className="text-base leading-relaxed mt-1">
                  Yes. If you create a free account, you can save designs and return later to edit
                  or order. Guest checkout is also available if you prefer not to create an account.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Frame Materials &amp; Options</h2>
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  What frame styles do you offer?
                </h3>
                <p className="text-base leading-relaxed mt-1">
                  We offer a wide selection of custom picture frame styles, including:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Solid wood frames</li>
                  <li>Modern metal frames</li>
                  <li>Gallery and museum-style frames</li>
                  <li>Rustic and barn-wood looks</li>
                  <li>Contemporary and traditional profiles</li>
                </ul>
                <p className="text-base leading-relaxed mt-2">
                  All styles are available in multiple finishes and colors.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  What glazing options do you offer?
                </h3>
                <p className="text-base leading-relaxed mt-1">You can choose from:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>
                    <strong>Standard Glass</strong> – clear and affordable
                  </li>
                  <li>
                    <strong>Framer&apos;s-Grade Acrylic</strong> – lightweight, shatter-resistant,
                    blocks UV light
                  </li>
                  <li>
                    <strong>Premium Non-Glare Acrylic</strong> – reduces reflections
                  </li>
                </ul>
                <p className="text-base leading-relaxed mt-2">
                  Acrylic is recommended for larger frames and shipping safety.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  What is mat board and should I use it?
                </h3>
                <p className="text-base leading-relaxed mt-1">
                  Mat board adds space between your artwork and the glazing, enhances presentation,
                  and protects your art. While optional, matting is highly recommended for a
                  professional look. Single and double matting options are available.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              Production, Shipping &amp; Pickup
            </h2>
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  How long does it take to make a custom frame?
                </h3>
                <p className="text-base leading-relaxed mt-1">
                  All frames are custom made to order.
                </p>
                <p className="text-base leading-relaxed mt-2">
                  <strong>Standard production time:</strong> 3-7 business days before shipment
                </p>
                <p className="text-base leading-relaxed mt-1">
                  Production time does not include carrier transit time.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Do you offer expedited or rush orders?
                </h3>
                <p className="text-base leading-relaxed mt-1">
                  We do not offer expedited shipping at checkout. However, rush production may be
                  available by request for an additional fee.
                </p>
                <p className="text-base leading-relaxed mt-2">Rush orders:</p>
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Are approved case-by-case</li>
                  <li>May include faster production and/or expedited shipping</li>
                  <li>Are quoted individually based on size, materials, and deadline</li>
                </ul>
                <p className="text-base leading-relaxed mt-2">
                  Contact us before ordering if you have a time-sensitive project.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Do you offer free shipping?
                </h3>
                <p className="text-base leading-relaxed mt-1">
                  Shipping costs are calculated at checkout based on frame size, weight, and
                  destination. From time to time, we may offer promotional shipping discounts, which
                  will be clearly shown during checkout.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Do you offer local pickup?
                </h3>
                <p className="text-base leading-relaxed mt-1">
                  Yes. Free local pickup is available at:
                </p>
                <p className="text-base font-medium text-foreground mt-2">
                  6 Shirley Ave
                  <br />
                  Somerset, NJ 08873
                </p>
                <p className="text-base leading-relaxed mt-2">
                  Appointments are preferred, but walk-ins are welcome when possible. Local pickup
                  avoids oversize shipping fees on large frames.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Can I drop off artwork, jerseys, or memorabilia?
                </h3>
                <p className="text-base leading-relaxed mt-1">
                  Yes. We accept drop-offs for professional custom framing of:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Artwork</li>
                  <li>Jerseys</li>
                  <li>Memorabilia</li>
                  <li>Collectibles</li>
                </ul>
                <p className="text-base leading-relaxed mt-2">
                  Appointments are recommended to ensure staff availability and smooth building
                  access.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Returns, Damage &amp; Quality</h2>
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Can I return a custom picture frame?
                </h3>
                <p className="text-base leading-relaxed mt-1">
                  Because all frames are custom made, custom frames are final sale when produced
                  correctly to your specifications. We will gladly repair, remake, or replace any
                  frame that arrives damaged or has a manufacturing defect. See our{" "}
                  <Link
                    href="/returns-exchanges"
                    className="text-primary underline hover:no-underline"
                  >
                    Returns &amp; Exchanges Policy
                  </Link>{" "}
                  for full details.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  What if my frame arrives damaged?
                </h3>
                <p className="text-base leading-relaxed mt-1">
                  Inspect your package immediately. If damage occurs:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Take photos of the box and frame</li>
                  <li>Contact us within 48 hours of delivery</li>
                  <li>Keep all packaging materials</li>
                </ul>
                <p className="text-base leading-relaxed mt-2">We will make it right.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  What warranty do you offer?
                </h3>
                <p className="text-base leading-relaxed mt-1">
                  We stand behind our craftsmanship. Manufacturing defects and workmanship issues
                  are covered under our warranty. If something isn&apos;t right, contact us and
                  we&apos;ll review your order.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Additional Questions</h2>
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Do you ship internationally?
                </h3>
                <p className="text-base leading-relaxed mt-1">
                  We currently ship within the United States only. Alaska and Hawaii may incur
                  additional shipping surcharges.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Can I track my order?</h3>
                <p className="text-base leading-relaxed mt-1">
                  Yes. Once your order ships, you&apos;ll receive a tracking number by email.
                </p>
              </div>
            </div>
          </section>

          <section className="pt-6 border-t">
            <h2 className="text-xl font-semibold text-foreground">Still Have Questions?</h2>
            <p className="text-base leading-relaxed mt-2">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:hello@customframesizes.com"
                className="text-primary underline hover:no-underline"
              >
                hello@customframesizes.com
              </a>
            </p>
            <p className="text-base leading-relaxed mt-1">
              <strong>Phone:</strong>{" "}
              <a href="tel:+18888747156" className="text-primary underline hover:no-underline">
                1 (888) 874-7156
              </a>
            </p>
            <p className="text-base leading-relaxed mt-1">
              <strong>Hours:</strong> Monday-Friday, 9am-5pm EST
            </p>
            <p className="text-base leading-relaxed mt-4">
              Ready to create your custom frame?{" "}
              <Link href="/" className="text-primary underline hover:no-underline">
                Start designing today
              </Link>
              .
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
