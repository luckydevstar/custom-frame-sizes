import type { Metadata } from "next";
import Link from "next/link";
import { Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Policy - CustomFrameSizes.com | Custom Frame Sizes",
  description:
    "Learn about our shipping methods, production times, delivery options, tracking, and policies for custom picture frame orders at CustomFrameSizes.com.",
  openGraph: {
    title: "Shipping Policy - CustomFrameSizes.com",
    description:
      "Shipping methods, production times, delivery options, and policies for custom frame orders.",
    type: "website",
  },
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Truck className="h-5 w-5" />
          <span className="text-sm font-medium">Support</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6" data-testid="heading-shipping-policy">
          Shipping Policy
        </h1>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-base font-medium text-foreground">
            <strong>CustomFrameSizes.com</strong>
            <br />
            <strong>Last Updated: January 2025</strong>
          </p>
          <p className="text-base leading-relaxed">
            At CustomFrameSizes.com, every order is custom-made to order based on your exact
            specifications. Because of this, our shipping timelines and options differ from standard
            retail products.
          </p>
          <p className="text-base leading-relaxed">
            Please review this policy carefully before placing your order.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            1. Production Time (Before Shipment)
          </h2>
          <p className="text-base leading-relaxed">
            All frames are custom manufactured after your order is placed.
          </p>
          <p className="text-base leading-relaxed font-medium">Standard Production Time:</p>
          <p className="text-base leading-relaxed">3-7 business days before shipment</p>
          <p className="text-base leading-relaxed mt-2">Production time begins once:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Payment has been successfully processed</li>
            <li>All order details and specifications are confirmed</li>
            <li>Any required clarification has been completed</li>
          </ul>
          <p className="text-base leading-relaxed mt-2">
            Production time does not include carrier transit time.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">2. Shipping Methods</h2>
          <h3 className="text-lg font-semibold text-foreground mt-6">
            Standard Shipping (Default)
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>All orders ship using standard ground shipping</li>
            <li>Carriers may include UPS, USPS, or FedEx</li>
            <li>Carrier selection is based on package size, destination, and logistics</li>
          </ul>
          <p className="text-base leading-relaxed mt-2">
            We do not offer expedited shipping options at checkout.
          </p>
          <h3 className="text-lg font-semibold text-foreground mt-6">
            Rush Orders (By Request Only)
          </h3>
          <p className="text-base leading-relaxed">
            Rush service may be available by request, subject to approval. Rush service may include:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Accelerated production</li>
            <li>Expedited carrier service if required to meet a customer&apos;s need-by date</li>
          </ul>
          <p className="text-base font-medium text-foreground mt-4">Important Notes:</p>
          <ul className="list-disc pl-6 space-y-1 mt-1">
            <li>Rush availability is not guaranteed</li>
            <li>Rush production fees apply</li>
            <li>Expedited carrier fees may apply</li>
            <li>Rush orders are quoted and approved case-by-case</li>
            <li>Delivery dates may be guaranteed only when explicitly confirmed in writing</li>
          </ul>
          <p className="text-base leading-relaxed mt-2">
            To request a rush order,{" "}
            <Link href="/contact" className="text-primary underline hover:no-underline">
              contact us
            </Link>{" "}
            before placing your order.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">3. Shipping Destinations</h2>
          <p className="text-base leading-relaxed">
            We currently ship within the United States only.
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              <strong>Continental U.S.:</strong> Standard shipping rates apply
            </li>
            <li>
              <strong>Alaska &amp; Hawaii:</strong> Additional shipping surcharges apply
            </li>
            <li>
              <strong>PO Boxes:</strong> Not supported for frame shipments due to size restrictions
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">4. Shipping Costs</h2>
          <p className="text-base leading-relaxed">Shipping costs are calculated based on:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Package size and weight</li>
            <li>Destination address</li>
            <li>Carrier requirements (including oversize handling)</li>
          </ul>
          <p className="text-base leading-relaxed mt-2">
            Shipping costs are displayed at checkout before purchase.
          </p>
          <p className="text-base leading-relaxed mt-2">
            From time to time, we may offer promotional shipping discounts or free shipping offers.
            Any such promotions will be clearly disclosed at the time of purchase and do not alter
            this policy.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            5. Local Pickup &amp; Drop-Off (Somerset, NJ)
          </h2>
          <h3 className="text-lg font-semibold text-foreground mt-6">Local Pickup</h3>
          <p className="text-base leading-relaxed">Free local pickup is available at:</p>
          <p className="text-base font-medium text-foreground mt-2">
            6 Shirley Ave
            <br />
            Somerset, NJ 08873
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Pickup is free</li>
            <li>By appointment preferred (walk-ins accepted when possible)</li>
            <li>Pickup avoids carrier oversize shipping fees</li>
            <li>You will be notified when your order is ready</li>
          </ul>
          <h3 className="text-lg font-semibold text-foreground mt-6">
            Drop-Off for Professional Framing
          </h3>
          <p className="text-base leading-relaxed">
            Customers may drop off personal items for professional framing, including:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Artwork</li>
            <li>Memorabilia</li>
            <li>Jerseys</li>
            <li>Collectibles</li>
          </ul>
          <p className="text-base leading-relaxed mt-2">
            Drop-offs are accepted by appointment preferred to ensure staff availability and smooth
            building access.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">6. Tracking Information</h2>
          <p className="text-base leading-relaxed">
            Once your order ships, you will receive a confirmation email including:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Carrier name</li>
            <li>Tracking number</li>
            <li>Shipment status link</li>
          </ul>
          <p className="text-base leading-relaxed mt-2">
            Tracking updates are provided directly by the carrier.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            7. Delivery Expectations &amp; Responsibility
          </h2>
          <p className="text-base leading-relaxed">
            Delivery times provided by carriers are estimates only and may be affected by:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Weather conditions</li>
            <li>Carrier delays</li>
            <li>Peak shipping periods</li>
            <li>Destination location</li>
          </ul>
          <p className="text-base leading-relaxed mt-2">
            Once an order is marked &quot;Delivered&quot; by the carrier, responsibility for the
            package transfers to the recipient.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">8. Signature Confirmation</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Signature confirmation is not required by default</li>
            <li>Signature confirmation is available by customer request</li>
            <li>Additional fees apply for signature-required delivery</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">9. Damaged Shipments</h2>
          <p className="text-base leading-relaxed">
            Please inspect your shipment immediately upon delivery.
          </p>
          <p className="text-base font-medium text-foreground mt-4">Reporting Damage</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Report shipping damage within 48 hours of delivery</li>
            <li>Email hello@customframesizes.com</li>
            <li>
              Include: Order number; clear photos of the damaged item; photos of the packaging
              (inside and outside)
            </li>
          </ul>
          <p className="text-base leading-relaxed mt-2">
            Please retain all packaging materials until the claim is resolved.
          </p>
          <p className="text-base leading-relaxed mt-2">
            If damage is confirmed, we will repair, remake, or replace the item at no additional
            cost.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            10. Lost or Missing Packages
          </h2>
          <p className="text-base leading-relaxed">
            If a package is marked as delivered but cannot be located:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Check the delivery area and surrounding locations</li>
            <li>Confirm the shipping address</li>
            <li>Contact the carrier to initiate a trace</li>
            <li>Notify us within 5 days of the delivery scan</li>
          </ul>
          <p className="text-base leading-relaxed mt-2">
            We will assist with carrier claims as appropriate. Replacement is subject to carrier
            investigation outcomes.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            11. Address Accuracy &amp; Corrections
          </h2>
          <p className="text-base leading-relaxed">
            Customers are responsible for providing accurate shipping information.
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Address changes before shipment may be accommodated</li>
            <li>Address corrections after shipment may incur carrier fees</li>
            <li>
              Carrier-imposed address correction or rerouting fees will be passed through to the
              customer
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            12. Refused or Undeliverable Shipments
          </h2>
          <p className="text-base leading-relaxed">
            If a shipment is refused or returned due to incorrect address, failed delivery attempts,
            or customer refusal, shipping charges are non-refundable, and reshipment costs will
            apply.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            13. Holiday &amp; Peak Season Shipping
          </h2>
          <p className="text-base leading-relaxed">During peak seasons (November-December):</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Production and transit times may be extended</li>
            <li>Carrier delays are more common</li>
            <li>Rush service availability may be limited</li>
          </ul>
          <p className="text-base leading-relaxed mt-2">
            We recommend ordering well in advance for time-sensitive needs.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">14. Contact Us</h2>
          <p className="text-base leading-relaxed">For shipping questions or special requests:</p>
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
        </article>
      </div>
    </div>
  );
}
