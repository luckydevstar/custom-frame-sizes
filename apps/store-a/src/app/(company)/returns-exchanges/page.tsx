import type { Metadata } from "next";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Exchanges Policy - CustomFrameSizes.com | Custom Frame Sizes",
  description:
    "Learn about our return and exchange policy for custom-made frames, including damage reporting, manufacturing defects, and resolution options.",
  openGraph: {
    title: "Returns & Exchanges Policy - CustomFrameSizes.com",
    description:
      "Return and exchange policy for custom-made frames, damage reporting, and resolution options.",
    type: "website",
  },
};

export default function ReturnsExchangesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <RefreshCw className="h-5 w-5" />
          <span className="text-sm font-medium">Support</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6" data-testid="heading-returns-exchanges">
          Returns &amp; Exchanges Policy
        </h1>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-base font-medium text-foreground">
            <strong>CustomFrameSizes.com</strong>
            <br />
            <strong>Last Updated: January 2025</strong>
          </p>
          <p className="text-base leading-relaxed">
            Because all items sold on CustomFrameSizes.com are custom-made to customer
            specifications, our return and exchange policy differs from standard retail products.
          </p>
          <p className="text-base leading-relaxed">
            Please review this policy carefully before placing your order.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            1. Custom Orders - Final Sale
          </h2>
          <p className="text-base leading-relaxed">
            All frames sold on CustomFrameSizes.com are custom manufactured based on the size,
            style, materials, and configuration selected by the customer.
          </p>
          <p className="text-base leading-relaxed mt-2">As a result:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>All custom orders are final sale</li>
            <li>
              Custom items cannot be returned or exchanged due to: Customer measurement errors;
              incorrect size selection; design preference changes; color, style, or material
              preferences; &quot;Didn&apos;t like it&quot; or changed mind after delivery
            </li>
          </ul>
          <p className="text-base leading-relaxed mt-2">
            Custom frames cannot be resold or reused once manufactured.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            2. When We Will Make It Right
          </h2>
          <p className="text-base leading-relaxed">
            We stand behind our craftsmanship and will correct issues that are our responsibility.
          </p>
          <p className="text-base font-medium text-foreground mt-4">
            Eligible Issues (Our Responsibility)
          </p>
          <p className="text-base leading-relaxed mt-2">
            We will repair, remake, or replace your frame at no cost if:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>The frame arrives damaged during shipping</li>
            <li>There is a manufacturing defect</li>
            <li>The frame was produced incorrectly compared to your order specifications</li>
            <li>Materials or components are defective</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">3. Damage in Transit</h2>
          <p className="text-base font-medium text-foreground">Inspection Required Upon Delivery</p>
          <p className="text-base leading-relaxed mt-2">
            Please inspect your shipment immediately upon delivery.
          </p>
          <p className="text-base font-medium text-foreground mt-4">Reporting Deadline</p>
          <p className="text-base leading-relaxed mt-2">
            Damage must be reported within 48 hours of delivery.
          </p>
          <p className="text-base leading-relaxed mt-2">To report damage:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Email hello@customframesizes.com</li>
            <li>Include your order number</li>
            <li>Provide clear photos of: The damaged item; Packaging (inside and outside)</li>
          </ul>
          <p className="text-base leading-relaxed mt-2">
            Please retain all packaging materials until the claim is resolved.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">4. Manufacturing Defects</h2>
          <p className="text-base leading-relaxed">
            Manufacturing defects include, but are not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Loose or separated corners</li>
            <li>Warped or improperly joined frame components</li>
            <li>Incorrectly cut mats (our error)</li>
            <li>Defective glass or acrylic</li>
            <li>Production errors inconsistent with the approved order</li>
          </ul>
          <p className="text-base leading-relaxed mt-2">
            Defects must be reported within 30 days of delivery unless otherwise covered under{" "}
            <Link href="/warranty" className="text-primary underline hover:no-underline">
              warranty
            </Link>
            .
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            5. Resolution Options (At Our Discretion)
          </h2>
          <p className="text-base leading-relaxed">
            For eligible claims, we may offer one of the following remedies:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Repair of the item</li>
            <li>Remanufacture and replacement</li>
            <li>Store credit</li>
            <li>Refund (rare and typically only if replacement is not feasible)</li>
          </ul>
          <p className="text-base leading-relaxed mt-2">
            Refunds are not guaranteed and are issued only when replacement or repair is not
            possible.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            6. Non-Returnable &amp; Non-Refundable Items
          </h2>
          <p className="text-base leading-relaxed">
            The following are not eligible for return, exchange, or refund:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Custom frames made correctly to customer specifications</li>
            <li>Orders with customer-provided measurement errors</li>
            <li>Design or style preference changes</li>
            <li>Clearance or final-sale items</li>
            <li>Gift cards or store credit</li>
            <li>Items damaged due to misuse, modification, or improper handling after delivery</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">7. Shipping Responsibility</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              If the issue is our error or shipping damage, we will cover return shipping and
              replacement shipping
            </li>
            <li>Unauthorized returns will not be accepted</li>
            <li>Items returned without approval may be refused or discarded</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            8. No Satisfaction Guarantee on Custom Goods
          </h2>
          <p className="text-base leading-relaxed">
            Due to the custom-made nature of our products, we do not offer a satisfaction guarantee
            or &quot;trial period&quot; on custom frames.
          </p>
          <p className="text-base leading-relaxed mt-2">We strongly encourage customers to:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Double-check measurements before ordering</li>
            <li>Use our design tools and previews carefully</li>
            <li>
              <Link href="/contact" className="text-primary underline hover:no-underline">
                Contact us
              </Link>{" "}
              with questions prior to placing an order
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">9. How to Request Support</h2>
          <p className="text-base leading-relaxed">
            If you believe your order qualifies for correction:
          </p>
          <p className="text-base leading-relaxed mt-2">
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
          <p className="text-base leading-relaxed mt-2">
            Include your order number and a description of the issue.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">10. Policy Updates</h2>
          <p className="text-base leading-relaxed">
            This policy may be updated from time to time. The version in effect at the time of
            purchase governs your order.
          </p>
        </article>
      </div>
    </div>
  );
}
