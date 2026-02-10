import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Frame Care Instructions - How to Clean and Maintain Custom Frames | Custom Frame Sizes",
  description:
    "Learn how to properly clean and maintain your custom picture frames. Expert tips for protecting frames from sunlight, humidity, and damage to ensure lasting beauty.",
  openGraph: {
    title: "Frame Care Instructions - How to Clean and Maintain Custom Frames",
    description: "Expert tips for cleaning and maintaining your custom frames.",
    type: "website",
  },
};

export default function CareInstructionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Banner / Hero (from original content hero) */}
        <div
          className="mb-8 relative w-full h-64 rounded-lg overflow-hidden bg-muted"
          data-testid="banner-hero"
        >
          <Image
            src="/images/blog/botanical-frame-hero.png"
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
          <Heart className="h-5 w-5" />
          <span className="text-sm font-medium">Learn</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6" data-testid="heading-care-instructions">
          Frame Care Instructions - How to Clean and Maintain Custom Frames
        </h1>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-base leading-relaxed">
            Proper care and maintenance will keep your custom frames looking beautiful for years to
            come. Follow these simple guidelines to protect your investment and preserve your
            precious artwork and memories.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Cleaning Your Frames</h2>

          <h3 className="text-lg font-semibold text-foreground mt-6">Glass and Acrylic Glazing</h3>
          <p className="text-base leading-relaxed">
            <strong>For Glass Glazing</strong>: 1) Use a soft, lint-free microfiber cloth. 2) Spray
            glass cleaner on the cloth (never directly on the glass). 3) Wipe gently in circular
            motions. 4) Buff with a dry cloth for streak-free results. 5) Clean regularly to prevent
            dust buildup.
          </p>
          <p className="text-base leading-relaxed">
            <strong>For Acrylic (Plexiglass) Glazing</strong>: 1) Use only acrylic-specific cleaners
            or mild soap and water. 2) Never use glass cleaner (it can cause cloudiness). 3) Spray
            cleaner on a soft cloth, not directly on the acrylic. 4) Wipe gently to avoid
            scratching. 5) Use an anti-static spray to reduce dust attraction.
          </p>
          <p className="text-base leading-relaxed">
            <strong>What to Avoid</strong>: Ammonia-based cleaners on acrylic; paper towels (they
            can scratch); abrasive cleaners or scrubbing pads; excessive moisture near frame edges;
            spraying cleaner directly on the frame.
          </p>
          <p className="text-base leading-relaxed">
            Learn more about different glazing options in our{" "}
            <Link href="/glazing-guide" className="text-primary underline hover:no-underline">
              glazing guide
            </Link>
            .
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6">Cleaning Frame Molding</h3>
          <p className="text-base leading-relaxed">
            <strong>Wood Frames</strong>: Dust regularly with a soft, dry cloth. For deeper
            cleaning, use a slightly damp cloth and dry immediately. Avoid excess moisture that can
            damage the finish. For ornate frames, use a soft brush to reach details.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Metal Frames</strong>: Wipe with a dry microfiber cloth. For fingerprints, use a
            slightly damp cloth and dry thoroughly. Polish occasionally with appropriate metal
            cleaner. Avoid harsh chemicals.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Painted or Finished Frames</strong>: Dust with a soft, dry cloth; use minimal
            moisture; never use abrasive cleaners; test any cleaner on an inconspicuous area first;
            dry immediately after cleaning.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Protecting Frames from Sunlight
          </h2>
          <p className="text-base leading-relaxed">
            Sunlight is one of the biggest threats to framed artwork, causing fading, yellowing, and
            deterioration over time.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Choose Protective Glazing</strong>: The best defense is framer&apos;s grade
            acrylic or protective glass, which blocks 70–99% of harmful ultraviolet rays.
            Gallery-grade glazing blocks 99% of UV light.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Strategic Placement</strong>: Avoid hanging frames in direct sunlight; position
            frames on walls perpendicular to windows rather than directly across; use curtains or
            blinds to filter harsh afternoon sun; rotate artwork periodically if some sun exposure
            is unavoidable.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Signs of Sun Damage</strong>: Watch for yellowing of white mats or paper; fading
            of colors in photos or prints; brittleness of paper or artwork; discoloration of frame
            finish. If you notice these signs, relocate your frame immediately and consider
            protective glazing replacement.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Humidity and Temperature Considerations
          </h2>
          <p className="text-base leading-relaxed">
            <strong>Ideal Conditions</strong>: Temperature 65–75°F (18–24°C); humidity 40–50%
            relative humidity. Too dry: paper becomes brittle, wood cracks. Too humid: mold growth,
            warping, adhesive failure.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Problem Areas to Avoid</strong>: Bathrooms (high humidity and temperature
            swings); kitchens (grease, moisture, heat); basements (dampness, mold risk); attics
            (temperature extremes); directly over fireplaces; near exterior doors.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Hanging and Display Best Practices
          </h2>
          <p className="text-base leading-relaxed">
            <strong>Use Appropriate Hardware</strong>: Use wall anchors or hang from studs for
            frames over 20 pounds; choose picture hangers rated for your frame&apos;s weight; use
            two hooks for large frames for better stability.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Best Locations</strong>: Interior walls away from windows; climate-controlled
            living spaces; walls protected from direct sunlight. <strong>Avoid</strong>: Damp or
            humid areas; walls with active leaks; areas where frames might be bumped regularly.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">When to Reframe</h2>
          <p className="text-base leading-relaxed">Consider reframing when:</p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>
              <strong>Visible Damage</strong>: Cracked or broken glass/acrylic; loose or separated
              frame corners; warped or damaged mat board
            </li>
            <li>
              <strong>Preservation Concerns</strong>: Original framing used non-archival materials;
              valuable artwork deserves better protection
            </li>
            <li>
              <strong>Style Updates</strong>: Frame style no longer matches your decor; want to
              upgrade to protective glazing
            </li>
            <li>
              <strong>Protective Upgrades</strong>: Adding gallery-grade glazing; upgrading to
              archival mats; improving backing and dust protection
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Long-Term Preservation Tips
          </h2>
          <p className="text-base leading-relaxed">For valuable or irreplaceable artwork:</p>
          <ol className="list-decimal pl-6 space-y-1 text-base">
            <li>Use archival materials: archival mats, protective glazing, archival backing</li>
            <li>Professional framing: invest in expert framing for valuable pieces</li>
            <li>Document your collection: photograph frames and keep framing receipts</li>
            <li>Consider insuring valuable framed artwork</li>
          </ol>
          <p className="text-base leading-relaxed">
            <strong>Annual Frame Inspection</strong>: Once a year, inspect for loose corners or
            joints; cracked glass or acrylic; discolored or degraded mats; moisture or mold; loose
            hanging hardware; signs of insect damage.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Storage Guidelines</h2>
          <p className="text-base leading-relaxed">If you need to store framed artwork:</p>
          <ol className="list-decimal pl-6 space-y-1 text-base">
            <li>Clean thoroughly before storing</li>
            <li>Wrap in archival paper or bubble wrap</li>
            <li>Store vertically, never flat (prevents warping)</li>
            <li>Use climate-controlled space (not attics or basements)</li>
            <li>Keep away from moisture and temperature extremes</li>
            <li>Don&apos;t stack frames on top of each other</li>
          </ol>

          <h2 className="text-xl font-semibold text-foreground mt-8">Warranty Care Requirements</h2>
          <p className="text-base leading-relaxed">
            To maintain your frame warranty, follow these essential care guidelines: Clean frames
            using approved methods only; avoid modifications to the frame structure; report damage
            or defects promptly; keep frames in appropriate environmental conditions; use frames as
            intended (indoor display). See our complete{" "}
            <Link href="/warranty" className="text-primary underline hover:no-underline">
              warranty policy
            </Link>{" "}
            for coverage details and terms.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Quick Reference: Do&apos;s and Don&apos;ts
          </h2>
          <p className="text-base leading-relaxed">
            <strong>DO</strong>: ✓ Dust frames regularly with soft cloths ✓ Use appropriate cleaners
            for your glazing type ✓ Protect from direct sunlight and UV damage ✓ Maintain stable
            temperature and humidity ✓ Inspect frames annually ✓ Use proper hanging hardware
          </p>
          <p className="text-base leading-relaxed">
            <strong>DON&apos;T</strong>: ✗ Spray cleaner directly on glass or frame ✗ Use ammonia
            cleaners on acrylic ✗ Hang in bathrooms, kitchens, or damp areas ✗ Place in direct
            sunlight ✗ Ignore signs of damage ✗ Use abrasive cleaning materials
          </p>

          <p className="text-base leading-relaxed pt-4">
            For frame design and customization options, visit our{" "}
            <Link href="/picture-frames" className="text-primary underline hover:no-underline">
              frame designer
            </Link>{" "}
            to create your perfect custom frame.
          </p>
        </article>
      </div>
    </div>
  );
}
