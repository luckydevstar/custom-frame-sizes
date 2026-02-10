import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - CustomFrameSizes.com | Custom Frame Sizes",
  description:
    "Learn how CustomFrameSizes.com collects, uses, and protects your personal information, including uploaded images, order data, and privacy rights.",
  openGraph: {
    title: "Privacy Policy - CustomFrameSizes.com",
    description:
      "How we collect, use, and protect your information when you use our site and place orders.",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Shield className="h-5 w-5" />
          <span className="text-sm font-medium">Support</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6" data-testid="heading-privacy-policy">
          Privacy Policy
        </h1>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-base font-medium text-foreground">
            <strong>CustomFrameSizes.com</strong>
            <br />
            <strong>Last Updated: January 2025</strong>
          </p>
          <p className="text-base leading-relaxed">
            CustomPictureFrames LLC (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates
            CustomFrameSizes.com (the &quot;Site&quot;). We are committed to protecting your privacy
            and handling your information responsibly.
          </p>
          <p className="text-base leading-relaxed">
            This Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our Site, create an account, upload images, or place an
            order.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">1. Company Information</h2>
          <p className="text-base leading-relaxed">
            <strong>Legal Entity:</strong> CustomPictureFrames LLC
          </p>
          <p className="text-base leading-relaxed mt-2">
            <strong>Business Address:</strong>
            <br />6 Shirley Ave
            <br />
            Somerset, NJ 08873
          </p>
          <p className="text-base leading-relaxed mt-2">
            <strong>Email:</strong> hello@customframesizes.com
          </p>
          <p className="text-base leading-relaxed">
            <strong>Phone:</strong> 1 (888) 874-7156
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">2. Information We Collect</h2>
          <h3 className="text-lg font-semibold text-foreground mt-6">
            2.1 Personal Information You Provide
          </h3>
          <p className="text-base leading-relaxed">
            We collect personal information you voluntarily provide, including when you: Create an
            account; place an order (guest or registered checkout); upload images for printing or
            framing; contact customer support; subscribe to marketing communications (if
            applicable).
          </p>
          <p className="text-base leading-relaxed mt-2">This information may include:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Billing and shipping addresses</li>
            <li>Order details</li>
            <li>Communications with customer support</li>
          </ul>
          <p className="text-base leading-relaxed mt-2">
            Payment information is processed securely by third-party payment processors. We do not
            store full credit card numbers.
          </p>
          <h3 className="text-lg font-semibold text-foreground mt-6">
            2.2 Automatically Collected Information
          </h3>
          <p className="text-base leading-relaxed">
            When you visit the Site, we automatically collect certain technical information,
            including: IP address; browser type and device information; operating system; pages
            visited and time spent; referring URLs; cookies and similar tracking technologies. This
            information is used for security, analytics, and site performance.
          </p>
          <h3 className="text-lg font-semibold text-foreground mt-6">
            2.3 User-Uploaded Images and Files
          </h3>
          <p className="text-base leading-relaxed">
            When you upload images or artwork for printing or framing (&quot;Uploaded
            Content&quot;): Images are used solely to fulfill your order; images are not reviewed
            for content except as necessary for production; images are not used for marketing,
            advertising, or promotional purposes; images are treated as confidential.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            3. Image Storage, Retention &amp; Deletion
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Uploaded images are retained for up to 60 days after order fulfillment</li>
            <li>Purpose: reorders and customer convenience only</li>
            <li>Images are automatically deleted after the 60-day retention period</li>
            <li>Images may be deleted sooner upon customer request</li>
            <li>
              Images are not permanently archived unless explicitly saved to a customer account
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            4. How We Use Your Information
          </h2>
          <p className="text-base leading-relaxed">We use your information to:</p>
          <h3 className="text-lg font-semibold text-foreground mt-6">4.1 Provide Our Services</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Process and fulfill custom orders</li>
            <li>Manufacture and ship framed products</li>
            <li>Manage accounts and guest checkouts</li>
            <li>Provide customer support</li>
            <li>Communicate order confirmations and shipping updates</li>
          </ul>
          <h3 className="text-lg font-semibold text-foreground mt-6">
            4.2 Improve and Operate the Site
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Analyze site usage and performance</li>
            <li>Improve design tools and user experience</li>
            <li>Detect and prevent fraud or abuse</li>
            <li>Maintain site security and reliability</li>
          </ul>
          <h3 className="text-lg font-semibold text-foreground mt-6">
            4.3 Marketing Communications
          </h3>
          <p className="text-base leading-relaxed">
            If you opt in, we may send promotional emails about products or offers. You may opt out
            at any time by using the unsubscribe link or contacting us directly. We do not use
            uploaded customer images for marketing purposes.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            5. Cookies &amp; Tracking Technologies
          </h2>
          <p className="text-base leading-relaxed">
            We use cookies and similar technologies to support Site functionality and analytics.
          </p>
          <p className="text-base font-medium text-foreground mt-4">Types of Cookies Used:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              <strong>Essential Cookies:</strong> Required for Site operation (cart, checkout,
              login)
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand Site usage and performance
            </li>
            <li>
              <strong>Preference Cookies:</strong> Remember user settings and choices
            </li>
          </ul>
          <p className="text-base leading-relaxed mt-2">
            You may control cookies through your browser settings. Disabling certain cookies may
            affect Site functionality.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            6. Information Sharing &amp; Disclosure
          </h2>
          <p className="text-base leading-relaxed">We do not sell personal information.</p>
          <p className="text-base leading-relaxed mt-2">
            We may share information with trusted third parties only as necessary to operate our
            business, including:
          </p>
          <h3 className="text-lg font-semibold text-foreground mt-6">6.1 Service Providers</h3>
          <p className="text-base leading-relaxed">
            Payment processors; shipping carriers; email service providers; cloud hosting and
            infrastructure providers; analytics providers. These providers are contractually
            obligated to use your information only to perform services on our behalf and to protect
            it appropriately.
          </p>
          <h3 className="text-lg font-semibold text-foreground mt-6">6.2 Legal Requirements</h3>
          <p className="text-base leading-relaxed">
            We may disclose information if required to: Comply with applicable laws or legal
            processes; respond to lawful government requests; enforce our{" "}
            <Link href="/terms" className="text-primary underline hover:no-underline">
              Terms of Service
            </Link>
            ; protect the rights, safety, or property of our company or others.
          </p>
          <h3 className="text-lg font-semibold text-foreground mt-6">6.3 Business Transfers</h3>
          <p className="text-base leading-relaxed">
            If CustomPictureFrames LLC is involved in a merger, acquisition, or asset sale, customer
            information may be transferred as part of that transaction. We will provide notice if
            required by law.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">7. Data Security</h2>
          <p className="text-base leading-relaxed">
            We implement reasonable administrative, technical, and physical safeguards, including:
            SSL encryption for data transmission; secure servers and access controls; limited
            internal access to personal data; PCI-compliant payment processing. No system is 100%
            secure, but we continuously work to protect your information.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">8. Your Privacy Rights</h2>
          <h3 className="text-lg font-semibold text-foreground mt-6">
            8.1 Access &amp; Correction
          </h3>
          <p className="text-base leading-relaxed">
            You may request: Access to personal information we hold; correction of inaccurate or
            incomplete information.
          </p>
          <h3 className="text-lg font-semibold text-foreground mt-6">
            8.2 Deletion &amp; Portability
          </h3>
          <p className="text-base leading-relaxed">
            You may request: Deletion of your personal data; a copy of your data in a portable
            format. Certain information may be retained for legal, accounting, or operational
            purposes.
          </p>
          <h3 className="text-lg font-semibold text-foreground mt-6">8.3 Marketing Preferences</h3>
          <p className="text-base leading-relaxed">
            You may opt out of marketing communications at any time.
          </p>
          <h3 className="text-lg font-semibold text-foreground mt-6">
            8.4 California Privacy Rights (CCPA)
          </h3>
          <p className="text-base leading-relaxed">
            California residents have the right to: Know what personal information is collected;
            request deletion of personal information; confirm that personal information is not sold.
            We do not sell personal information. Requests may be submitted to
            hello@customframesizes.com with &quot;Privacy Request&quot; in the subject line.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">9. International Visitors</h2>
          <p className="text-base leading-relaxed">
            CustomFrameSizes.com is operated from the United States. We do not intentionally target
            customers in the European Union. If you access the Site from outside the U.S., your
            information may be transferred to and processed in the United States.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            10. Children&apos;s Privacy
          </h2>
          <p className="text-base leading-relaxed">
            Our services are not directed to individuals under 18 years of age. We do not knowingly
            collect personal information from children.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">11. Third-Party Links</h2>
          <p className="text-base leading-relaxed">
            Our Site may contain links to third-party websites. We are not responsible for their
            privacy practices and encourage you to review their policies separately.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">12. Changes to This Policy</h2>
          <p className="text-base leading-relaxed">
            We may update this Privacy Policy from time to time. Updates will be posted on this page
            with a revised &quot;Last Updated&quot; date. Continued use of the Site constitutes
            acceptance of the updated policy.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">13. Contact Us</h2>
          <p className="text-base leading-relaxed">
            If you have questions or requests regarding this Privacy Policy:
          </p>
          <p className="text-base leading-relaxed mt-2">
            <strong>CustomPictureFrames LLC</strong>
            <br />
            <strong>Email:</strong> hello@customframesizes.com
            <br />
            <strong>Phone:</strong> 1 (888) 874-7156
            <br />
            <strong>Address:</strong> 6 Shirley Ave, Somerset, NJ 08873
          </p>
        </article>
      </div>
    </div>
  );
}
