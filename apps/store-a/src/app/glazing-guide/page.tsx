import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Glazing Guide - Choosing the Right Glass for Your Custom Frame | Custom Frame Sizes",
  description:
    "Complete guide to frame glazing options. Compare standard glass vs. acrylic, UV protection, non-glare, and gallery-grade glazing to protect and showcase your artwork.",
  openGraph: {
    title: "Glazing Guide - Choosing the Right Glass for Your Custom Frame",
    description:
      "Compare glass and acrylic, UV protection, and anti-glare solutions for your frames.",
    type: "website",
  },
};

const HERO_IMAGE = "/images/blog/frame-studio-hero.png";

export default function GlazingGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Banner / Hero (from original GenericPage hero) */}
        <div
          className="mb-8 relative w-full h-64 rounded-lg overflow-hidden bg-muted"
          data-testid="banner-hero"
        >
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
          data-testid="link-back-learn"
        >
          <ArrowLeft className="h-4 w-4" />
          All Guides
        </Link>
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium">Learn</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6" data-testid="heading-glazing-guide">
          Glazing Guide - Choosing the Right Glass for Your Custom Frame
        </h1>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-base leading-relaxed">
            Glazing is the protective covering that goes over your artwork in a frame—typically
            glass or acrylic. While it might seem like a minor detail, choosing the right glazing
            can make a significant difference in how your artwork looks and how well it&apos;s
            protected over time.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Glass vs. Acrylic: The Fundamental Choice
          </h2>

          <h3 className="text-lg font-semibold text-foreground mt-6">Standard Glass</h3>
          <p className="text-base leading-relaxed font-semibold">Advantages:</p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Crystal-clear optical clarity</li>
            <li>Scratch-resistant surface</li>
            <li>Premium look and feel</li>
            <li>Doesn&apos;t yellow over time</li>
            <li>More affordable than specialty options</li>
          </ul>
          <p className="text-base leading-relaxed font-semibold">Disadvantages:</p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Heavy, especially in large sizes</li>
            <li>Fragile and can shatter</li>
            <li>Not ideal for shipping or high-traffic areas</li>
            <li>Reflects light more than some acrylic options</li>
          </ul>
          <p className="text-base leading-relaxed">
            <strong>Best for:</strong> Most standard framing projects, artwork displayed in safe
            locations, traditional framing applications.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6">Acrylic (Plexiglass)</h3>
          <p className="text-base leading-relaxed font-semibold">Advantages:</p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Lightweight (about half the weight of glass)</li>
            <li>Shatter-resistant and safer</li>
            <li>Excellent for shipping</li>
            <li>Good for large frames (over 24×36)</li>
            <li>Better for homes with children or pets</li>
          </ul>
          <p className="text-base leading-relaxed font-semibold">Disadvantages:</p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Scratches more easily than glass</li>
            <li>Can attract dust due to static</li>
            <li>May have slight distortion in cheaper versions</li>
            <li>Can yellow over time (in low-quality versions)</li>
          </ul>
          <p className="text-base leading-relaxed">
            <strong>Best for:</strong> Large frames, frames being shipped, children&apos;s rooms,
            high-traffic areas, lightweight installations.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            UV Protection: Essential for Preservation
          </h2>
          <p className="text-base leading-relaxed">
            Ultraviolet (UV) light is one of the biggest enemies of artwork, causing fading,
            yellowing, and deterioration over time. Protective glazing filters out harmful rays
            while maintaining clarity.
          </p>
          <p className="text-base leading-relaxed font-semibold">
            Standard UV Protection (Framer&apos;s Grade Acrylic):
          </p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Blocks 70–99% of UV light</li>
            <li>Moderate price increase over standard glass</li>
            <li>Suitable for most artwork protection needs</li>
            <li>Essential for photographs, prints, and watercolors</li>
          </ul>
          <p className="text-base leading-relaxed font-semibold">
            Premium UV Protection (Archival Glazing):
          </p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Blocks 99% of UV light</li>
            <li>Professional-grade protection</li>
            <li>Recommended for valuable or irreplaceable artwork</li>
            <li>Investment-grade preservation</li>
          </ul>
          <p className="text-base leading-relaxed font-semibold">When to use UV protection:</p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Artwork in rooms with natural light</li>
            <li>Valuable or sentimental pieces</li>
            <li>Photographs (especially color photos)</li>
            <li>Original artwork or limited editions</li>
            <li>Any piece you want to preserve for decades</li>
          </ul>
          <p className="text-base leading-relaxed font-semibold">When to skip it:</p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Mass-produced posters you plan to replace</li>
            <li>Artwork in windowless rooms</li>
            <li>Very budget-conscious projects</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">Non-Glare vs. Clear Glass</h2>
          <p className="text-base leading-relaxed font-semibold">
            Clear Glass (Standard) — Characteristics:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Maximum clarity and sharpness</li>
            <li>Reflects light and surroundings</li>
            <li>Can create glare in bright rooms</li>
            <li>Best optical quality</li>
          </ul>
          <p className="text-base leading-relaxed">
            <strong>Best for:</strong> Artwork displayed in controlled lighting, locations without
            direct light, situations where maximum clarity is priority.
          </p>
          <p className="text-base leading-relaxed font-semibold">
            Non-Glare Glass — Characteristics:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Etched or treated surface reduces reflections</li>
            <li>Eliminates glare from windows or lighting</li>
            <li>Slight reduction in sharpness (subtle &quot;soft&quot; effect)</li>
            <li>Can appear slightly cloudy if not touching artwork</li>
          </ul>
          <p className="text-base leading-relaxed">
            <strong>Best for:</strong> Bright rooms, areas with unavoidable glare, artwork across
            from windows, spaces with overhead lighting.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Important note:</strong> Non-glare glass works best when it&apos;s close to the
            artwork. If you&apos;re using a thick mat or deep frame, non-glare glass may appear
            hazy. In these cases, standard clear glass might be better.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Gallery-Grade Glazing: The Premium Option
          </h2>
          <p className="text-base leading-relaxed">
            Gallery-grade glazing (also called premium anti-reflective glazing) combines the best
            features:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Virtually invisible, with 99% optical clarity</li>
            <li>99% UV protection</li>
            <li>Anti-reflective coating eliminates glare</li>
            <li>Does not require contact with artwork (unlike non-glare)</li>
            <li>True color representation</li>
          </ul>
          <p className="text-base leading-relaxed">
            <strong>Best for:</strong> Original artwork, limited edition prints, valuable
            photographs, family heirlooms, professional or gallery-quality displays.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Making Your Decision: Which Glazing Is Right for You?
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li>
              <strong>Budget-Friendly Projects</strong>: Standard glass or acrylic — mass-produced
              prints, posters and decorative pieces.
            </li>
            <li>
              <strong>Everyday Framing</strong>: Framer&apos;s grade acrylic or protective glass —
              family photos, personal artwork, most standard framing needs.
            </li>
            <li>
              <strong>Bright Rooms with Glare</strong>: Non-glare glass or gallery-grade glazing.
            </li>
            <li>
              <strong>Valuable or Irreplaceable Pieces</strong>: Gallery-grade glazing with UV
              protection.
            </li>
            <li>
              <strong>Large Frames or Shipping</strong>: Acrylic (framer&apos;s grade acrylic for
              added protection).
            </li>
            <li>
              <strong>High-Traffic or Child-Safe Areas</strong>: Acrylic (any type).
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">Special Considerations</h2>
          <p className="text-base leading-relaxed">
            <strong>Thickness:</strong> Standard glazing is typically 2.0–2.5mm thick. For very
            large frames (over 30×40), consider thicker glazing (3–4mm) for added stability and
            reduced bowing.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Cleaning and Maintenance:</strong> Glass: Easy to clean with standard glass
            cleaner. Acrylic: Requires special acrylic cleaner (glass cleaner can cause cloudiness).
            See our{" "}
            <Link href="/care-instructions" className="text-primary underline hover:no-underline">
              care instructions
            </Link>{" "}
            for detailed cleaning guidance.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Climate and Location:</strong> High humidity: Glass is better (acrylic can
            warp). Earthquake zones: Acrylic is safer (won&apos;t shatter). Coastal areas: UV
            protection is essential (sun and salt air).
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Glazing Quick Reference</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse border border-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-2 text-left font-semibold">Glazing Type</th>
                  <th className="border border-border p-2 text-left font-semibold">Clarity</th>
                  <th className="border border-border p-2 text-left font-semibold">UV Block</th>
                  <th className="border border-border p-2 text-left font-semibold">Glare</th>
                  <th className="border border-border p-2 text-left font-semibold">Price</th>
                  <th className="border border-border p-2 text-left font-semibold">Best Use</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2">Standard Glass</td>
                  <td className="border border-border p-2">Excellent</td>
                  <td className="border border-border p-2">None</td>
                  <td className="border border-border p-2">High</td>
                  <td className="border border-border p-2">$</td>
                  <td className="border border-border p-2">Basic framing</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">UV Glass</td>
                  <td className="border border-border p-2">Excellent</td>
                  <td className="border border-border p-2">70-99%</td>
                  <td className="border border-border p-2">High</td>
                  <td className="border border-border p-2">$$</td>
                  <td className="border border-border p-2">Photo protection</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">Non-Glare Glass</td>
                  <td className="border border-border p-2">Good</td>
                  <td className="border border-border p-2">Varies</td>
                  <td className="border border-border p-2">None</td>
                  <td className="border border-border p-2">$$</td>
                  <td className="border border-border p-2">Bright rooms</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">Gallery-Grade Glazing</td>
                  <td className="border border-border p-2">Exceptional</td>
                  <td className="border border-border p-2">99%</td>
                  <td className="border border-border p-2">None</td>
                  <td className="border border-border p-2">$$$$</td>
                  <td className="border border-border p-2">Valuable art</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">Standard Acrylic</td>
                  <td className="border border-border p-2">Good</td>
                  <td className="border border-border p-2">None</td>
                  <td className="border border-border p-2">Medium</td>
                  <td className="border border-border p-2">$</td>
                  <td className="border border-border p-2">Large/shipped</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">UV Acrylic</td>
                  <td className="border border-border p-2">Good</td>
                  <td className="border border-border p-2">70-99%</td>
                  <td className="border border-border p-2">Medium</td>
                  <td className="border border-border p-2">$$</td>
                  <td className="border border-border p-2">Protected large frames</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-foreground mt-8">Getting Started</h2>
          <p className="text-base leading-relaxed">When using our frame designer:</p>
          <ol className="list-decimal pl-6 space-y-1 text-base">
            <li>Start by considering where the frame will be displayed</li>
            <li>Assess the value and replaceability of your artwork</li>
            <li>Factor in your budget</li>
            <li>Preview different glazing options in our tool</li>
          </ol>
          <p className="text-base leading-relaxed pt-4">
            Ready to design your perfect frame? Visit our{" "}
            <Link href="/picture-frames" className="text-primary underline hover:no-underline">
              frame designer
            </Link>{" "}
            to explore glazing options with live preview.
          </p>
        </article>
      </div>
    </div>
  );
}
