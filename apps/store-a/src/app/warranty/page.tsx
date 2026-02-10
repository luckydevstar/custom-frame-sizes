import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Frame Quality Guarantee - CustomFrameSizes.com | Custom Frame Sizes",
  description:
    "Learn about our lifetime craftsmanship warranty and quality guarantee for custom picture frames at CustomFrameSizes.com.",
  openGraph: {
    title: "Frame Quality Guarantee - CustomFrameSizes.com",
    description: "Lifetime craftsmanship warranty and quality guarantee for custom frames.",
    type: "website",
  },
};

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Shield className="h-5 w-5" />
          <span className="text-sm font-medium">Company</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6" data-testid="heading-warranty">
          Frame Quality Guarantee - CustomFrameSizes.com
        </h1>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-base font-medium text-foreground">
            <strong>CustomFrameSizes.com</strong>
            <br />
            <strong>Last Updated: January 2025</strong>
          </p>
          <p className="text-base leading-relaxed">
            At CustomFrameSizes.com, every frame is custom built with care, precision, and
            professional materials. We stand behind our craftsmanship and are committed to
            delivering frames that meet our quality standards.
          </p>
          <p className="text-base leading-relaxed">
            This Warranty Policy covers manufacturing and craftsmanship defects only and is separate
            from our{" "}
            <Link href="/returns-exchanges" className="text-primary underline hover:no-underline">
              Returns &amp; Exchanges Policy
            </Link>
            .
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Our Quality Commitment</h2>
          <p className="text-base leading-relaxed">Every custom frame is:</p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Made to order based on your specifications</li>
            <li>Constructed using professional-grade materials</li>
            <li>Inspected prior to shipment for accuracy and finish</li>
            <li>Packaged securely for safe delivery</li>
          </ul>
          <p className="text-base leading-relaxed">
            If a frame does not meet our quality standards, we will correct it.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Lifetime Craftsmanship Warranty
          </h2>
          <p className="text-base leading-relaxed">
            We offer a lifetime craftsmanship warranty on all custom frames.
          </p>
          <p className="text-base leading-relaxed">
            This covers defects related to how the frame was manufactured or assembled, including:
          </p>
          <h3 className="text-lg font-semibold text-foreground mt-6">
            Covered Craftsmanship Issues
          </h3>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Loose or separated corner joints</li>
            <li>Structural frame failures</li>
            <li>Improper frame assembly</li>
            <li>Incorrect mat cutting (our error)</li>
            <li>Improper installation of glazing, backing, or hardware</li>
            <li>Measurement errors caused by our production process</li>
          </ul>
          <p className="text-base leading-relaxed">
            If a covered craftsmanship issue occurs, we will repair or replace the affected
            component at no cost.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Limited Materials Warranty</h2>
          <p className="text-base leading-relaxed">
            We warrant that materials used in your frame are free from manufacturing defects at the
            time of delivery.
          </p>
          <p className="text-base leading-relaxed">This includes:</p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Glass or acrylic defects present upon arrival</li>
            <li>Mat board defects caused by manufacturing flaws</li>
            <li>Hardware defects present upon arrival</li>
          </ul>
          <p className="text-base leading-relaxed">
            This warranty does not cover normal aging, environmental exposure, or wear over time.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">What Is NOT Covered</h2>
          <p className="text-base leading-relaxed">This warranty does not cover:</p>
          <h3 className="text-lg font-semibold text-foreground mt-6">
            Normal Wear &amp; Environmental Effects
          </h3>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Scratches from cleaning or handling</li>
            <li>Fading or discoloration from sunlight exposure</li>
            <li>Minor finish changes over time</li>
            <li>Dust accumulation</li>
          </ul>
          <h3 className="text-lg font-semibold text-foreground mt-6">Damage or Misuse</h3>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Impact damage, drops, or accidents</li>
            <li>Water, moisture, or humidity damage</li>
            <li>Improper hanging or installation</li>
            <li>Damage caused by pets or environmental factors</li>
          </ul>
          <h3 className="text-lg font-semibold text-foreground mt-6">Improper Care or Storage</h3>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Use of harsh or abrasive cleaning chemicals</li>
            <li>Exposure to extreme temperatures or humidity</li>
            <li>Mold or mildew from damp environments</li>
            <li>Outdoor or bathroom display</li>
          </ul>
          <h3 className="text-lg font-semibold text-foreground mt-6">Customer Errors</h3>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Incorrect dimensions provided by the customer</li>
            <li>Artwork that does not fit due to customer measurement errors</li>
            <li>Design or configuration choices selected at checkout</li>
          </ul>
          <h3 className="text-lg font-semibold text-foreground mt-6">Shipping Damage</h3>
          <p className="text-base leading-relaxed">
            Shipping damage is not a warranty issue and must be reported under our{" "}
            <Link href="/shipping-policy" className="text-primary underline hover:no-underline">
              Shipping Policy
            </Link>
            .
          </p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Inspect shipments immediately upon delivery</li>
            <li>Report damage within 48 hours</li>
            <li>Retain all packaging materials</li>
            <li>Provide clear photos of damage and packaging</li>
          </ul>
          <p className="text-base leading-relaxed">
            Shipping-related claims reported outside this window may not be covered.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Warranty Resolution</h2>
          <p className="text-base leading-relaxed">
            For approved warranty claims, resolution may include:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Repair of the affected component</li>
            <li>Replacement of the affected component or frame</li>
          </ul>
          <p className="text-base leading-relaxed">
            Refunds are not guaranteed and are issued only when repair or replacement is not
            feasible.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            How to Submit a Warranty Claim
          </h2>
          <p className="text-base leading-relaxed">To submit a claim, contact us at:</p>
          <p className="text-base leading-relaxed">
            <strong>Email:</strong>{" "}
            <a
              href="mailto:hello@customframesizes.com"
              className="text-primary underline hover:no-underline"
            >
              hello@customframesizes.com
            </a>
          </p>
          <p className="text-base leading-relaxed">
            <strong>Phone:</strong>{" "}
            <a href="tel:+18888747156" className="text-primary underline hover:no-underline">
              1 (888) 874-7156
            </a>
          </p>
          <p className="text-base leading-relaxed">Please include:</p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Order number</li>
            <li>Description of the issue</li>
            <li>Clear photos showing the defect</li>
          </ul>
          <p className="text-base leading-relaxed">Claims are reviewed within 1-2 business days.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            Proper Care &amp; Warranty Validity
          </h2>
          <p className="text-base leading-relaxed">To maintain warranty coverage:</p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>Display frames indoors in climate-controlled environments</li>
            <li>Use proper hanging hardware</li>
            <li>Clean only with appropriate materials</li>
            <li>Avoid direct sunlight, moisture, and extreme temperatures</li>
          </ul>
          <p className="text-base leading-relaxed">
            Modifying the frame or removing original components voids this warranty.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Policy Updates</h2>
          <p className="text-base leading-relaxed">
            This warranty applies to frames purchased while this policy is in effect. We reserve the
            right to update this policy at any time.
          </p>
        </article>
      </div>
    </div>
  );
}
