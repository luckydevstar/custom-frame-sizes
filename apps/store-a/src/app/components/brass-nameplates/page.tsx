import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles, Ruler, Palette, Type } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@framecraft/ui";
import { Badge } from "@framecraft/ui";
import { Button } from "@framecraft/ui";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@framecraft/ui";

export const metadata: Metadata = {
  title: "Custom Brass Nameplates - Laser Engraved Plaques | Custom Frame Sizes",
  description:
    "Order custom brass nameplates in any size from 1.5 to 12 inches. Laser-engraved with your text, choice of fonts, and decorative icons. Brass, silver, or black finishes.",
  keywords:
    "brass nameplate, custom nameplate, engraved plaque, brass plaque, personalized nameplate, laser engraved",
  openGraph: {
    title: "Custom Brass Nameplates - Laser Engraved Plaques",
    description:
      'Custom brass nameplates 1.5" to 12". Laser-engraved text, fonts, and decorative icons.',
    type: "website",
  },
};

const faqItems = [
  {
    question: "What sizes are available for custom nameplates?",
    answer:
      'Our brass nameplates can be made in any size from 1.5" to 12" in both width and height. You enter exact dimensions, and we cut to your specifications.',
  },
  {
    question: "What font options are available?",
    answer:
      "We offer five professional fonts: Georgia (classic serif), Arial (clean sans-serif), Cinzel (formal Roman-style), Dancing Script (elegant cursive), and Courier New (monospace).",
  },
  {
    question: "What finish options are available?",
    answer:
      "Choose from four finishes: Brass with Black Text, Silver with Black Text, Black with Gold Text, or Black with Silver Text. All feature laser-engraved text for durability.",
  },
  {
    question: "Can I add decorative icons?",
    answer:
      "Yes! Choose from our library of engravable icons including hearts, stars, anchors, crosses, flourishes, and more. Icons are laser-engraved along with your text.",
  },
];

export default function BrassNameplatesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/components"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            All Components
          </Link>

          <section className="mb-12">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Laser Engraved
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Custom Brass Nameplates
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Create personalized brass nameplates in any size from 1.5&quot; to 12&quot;. Add
              custom text, choose your finish, and include decorative icons.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <Ruler className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-base">Custom Sizes 1.5&quot;-12&quot;</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Any dimensions within range. We cut and engrave to your specs.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Palette className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-base">4 Finish Options</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Brass, silver, or black with contrasting engraved text.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Type className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-base">Decorative Icons</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Add engravable icons: hearts, stars, anchors, flourishes, and more.
                </CardContent>
              </Card>
            </div>

            <Button size="lg" asChild>
              <Link href="/contact">Order Custom Nameplate</Link>
            </Button>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Common Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      </div>
    </div>
  );
}
