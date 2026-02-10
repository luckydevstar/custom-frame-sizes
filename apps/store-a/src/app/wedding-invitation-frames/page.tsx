import type { Metadata } from "next";
import { Heart, Shield, Award, Frame, Sparkles, Gift, Calendar, Users, Camera } from "lucide-react";
import { Card, WeddingInvitationFrameDesigner } from "@framecraft/ui";
import { RelatedProducts } from "@/components/RelatedProducts";
import { ScrollToDesignerButton } from "./scroll-button";

export const metadata: Metadata = {
  title: "Wedding Invitation Frame | Custom Frame Sizes for Wedding Invitations",
  description:
    "Frame your wedding invitation as a treasured keepsake. Custom-sized frames with double matting, UV protection, and optional photo display. Perfect first anniversary gift.",
  openGraph: {
    title: "Wedding Invitation Frame | Custom Frame Sizes",
    description:
      "Preserve your wedding invitation in a beautiful custom frame. Display with your wedding photo or RSVP card. Archival matting protects delicate papers.",
    type: "website",
    url: "/wedding-invitation-frames",
  },
  alternates: { canonical: "/wedding-invitation-frames" },
};

const weddingFeatures = [
  { icon: Heart, title: "Keepsake Quality", subtitle: "Professional-Grade Preservation" },
  { icon: Shield, title: "Archival Matting", subtitle: "Protects Delicate Papers" },
  { icon: Frame, title: "Multiple Layouts", subtitle: "Invite Only or With Photo" },
  { icon: Award, title: "Double Mat Option", subtitle: "Elegant Border Detail" },
];

const applications = [
  {
    icon: Heart,
    title: "Wedding Invitations",
    description: "Frame your formal invitation as a keepsake",
  },
  {
    icon: Camera,
    title: "Invite + Photo",
    description: "Display your invitation alongside a wedding portrait",
  },
  {
    icon: Calendar,
    title: "Save the Dates",
    description: "Preserve your save the date announcements",
  },
  { icon: Users, title: "RSVP Cards", description: "Include the response card in your display" },
  {
    icon: Sparkles,
    title: "Anniversary Gifts",
    description: "Perfect first anniversary paper gift idea",
  },
  {
    icon: Gift,
    title: "Bridal Shower Gifts",
    description: "Unique gift for the couple to cherish",
  },
];

const invitationSizes = [
  { name: "A2 Enclosure", size: "4.25×5.5" },
  { name: "A6 Card", size: "4.5×6.25" },
  { name: "A7 Standard", size: "5×7", popular: true },
  { name: "Boutique", size: "5.5×7.5" },
  { name: "Square Small", size: "5×5" },
  { name: "Square Large", size: "6×6" },
];

const faqs = [
  {
    question: "What size frame do I need for a wedding invitation?",
    answer:
      "Most wedding invitations are 5×7 inches (A7 size), which is the most common. Other popular sizes include 4.25×5.5 inches (A2), 4.5×6.25 inches (A6), and square formats like 5×5 or 6×6 inches. Our designer automatically calculates the correct frame size based on your invitation dimensions.",
  },
  {
    question: "Can I frame my invitation with a wedding photo?",
    answer:
      "Yes! Our dual-opening layout allows you to display your wedding invitation alongside a wedding photo. Choose from common photo sizes like 4×6, 5×7, or 8×10 to create a beautiful paired display.",
  },
  {
    question: "What's the difference between single and double mat?",
    answer:
      "A single mat provides a clean, simple border around your invitation. A double mat adds a thin accent color visible between the top mat and the opening, creating an elegant layered effect that's perfect for formal invitations. White over gold or ivory accents are popular wedding choices.",
  },
  {
    question: "Will framing damage my wedding invitation?",
    answer:
      "No. We use acid-free mat boards that protect paper from yellowing and deterioration. The invitation is held securely but not permanently mounted, so it can be removed in the future if needed. UV-protective glazing prevents fading from light exposure.",
  },
  {
    question: "Can I include the RSVP card with my invitation?",
    answer:
      "Yes! Our Invite + RSVP layout creates two openings sized for your invitation and response card. The cards are displayed side by side with consistent matting for a cohesive look.",
  },
  {
    question: "What mat colors work best for wedding invitations?",
    answer:
      "Classic choices include White, Ivory, or Cream as the primary mat, with Gold, Champagne, or Silver as accent colors for double matting. We also offer colors to match specific wedding palettes like blush pink, sage green, or navy blue.",
  },
  {
    question: "How do I measure my wedding invitation?",
    answer:
      "Measure just the printed card itself, not the envelope. Measure the width and height in inches. If your invitation has a deckled (rough) edge, measure to the outermost points. Our designer adds the appropriate mat overlap to hold the card securely.",
  },
  {
    question: "Is this a good anniversary gift?",
    answer:
      "Absolutely! Framing a wedding invitation is a meaningful first anniversary gift since paper is the traditional first anniversary material. It's also perfect for milestone anniversaries to celebrate the day it all began.",
  },
  {
    question: "Can I add personalized text to the frame?",
    answer:
      "Yes! Add an optional brass nameplate engraved with names, wedding date, or a special message. Choose from multiple fonts and finish colors to complement your frame and invitation style.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function WeddingInvitationFramesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-rose-50/50 to-background dark:from-rose-950/20 dark:to-background py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 mb-4">
                <Heart className="w-8 h-8 text-rose-600 dark:text-rose-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Wedding Invitation Frames</h1>
              <p className="text-lg text-muted-foreground">
                Transform your wedding invitation into a timeless keepsake. Custom frames sized
                exactly for your invitation, with optional dual openings to display alongside your
                wedding photo or RSVP card.
              </p>
              <div className="mt-6">
                <ScrollToDesignerButton />
              </div>
            </div>

            {/* Key Features Bar */}
            <section className="border-y bg-muted/20">
              <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
                  {weddingFeatures.map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <div key={i} className="text-center">
                        <Icon className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                        <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                          {f.title}
                        </p>
                        <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                          {f.subtitle}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </section>

        <section id="design-tool" className="py-8 lg:py-12 scroll-mt-20">
          <div className="container mx-auto px-4">
            <WeddingInvitationFrameDesigner embedded />
          </div>
        </section>

        {/* Common Invitation Sizes */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Common Wedding Invitation Sizes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {invitationSizes.map((item) => (
                <Card
                  key={item.name}
                  className={`p-4 text-center ${item.popular ? "ring-2 ring-primary" : ""}`}
                  data-testid={`card-size-${item.name.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <div className="text-lg font-bold">{item.size}&quot;</div>
                  <div className="text-sm text-muted-foreground">{item.name}</div>
                  {item.popular && <div className="text-xs text-primary mt-1">Most Popular</div>}
                </Card>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don&apos;t see your size? Enter custom dimensions in the designer above.
            </p>
          </div>
        </section>

        {/* Applications Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Perfect For</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {applications.map((app) => (
                <Card
                  key={app.title}
                  className="p-4 flex items-start gap-3"
                  data-testid={`card-application-${app.title.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/30 shrink-0">
                    <app.icon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{app.title}</h3>
                    <p className="text-sm text-muted-foreground">{app.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Matting Guide */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-6">Choosing Your Mat Colors</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-5">
                  <h3 className="font-semibold mb-3">Classic Wedding Combinations</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-white border" />
                      <div className="w-4 h-4 rounded-full bg-amber-400" />
                      <span>White over Gold - Timeless elegance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-50 border" />
                      <div className="w-4 h-4 rounded-full bg-amber-600" />
                      <span>Ivory over Champagne - Warm sophistication</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-white border" />
                      <div className="w-4 h-4 rounded-full bg-gray-400" />
                      <span>White over Silver - Modern luxury</span>
                    </li>
                  </ul>
                </Card>
                <Card className="p-5">
                  <h3 className="font-semibold mb-3">Match Your Wedding Colors</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Our mat palette includes popular wedding accent colors:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Blush Pink",
                      "Sage Green",
                      "Dusty Blue",
                      "Navy",
                      "Burgundy",
                      "Champagne",
                    ].map((color) => (
                      <span
                        key={color}
                        className="text-xs px-2 py-1 rounded-full bg-background border"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-5" data-testid={`faq-${index}`}>
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Related Products */}
        <RelatedProducts
          productKeys={[
            "preserved-bouquet",
            "signature-frames",
            "picture-frames",
            "certificate-frames",
            "collage-frames",
          ]}
          columns={5}
        />
      </div>
    </>
  );
}
