import type { Metadata } from "next";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service - CustomFrameSizes.com | Custom Frame Sizes",
  description:
    "Terms and conditions for using CustomFrameSizes.com, including ordering, user-uploaded content, copyright, refunds, and legal disclaimers.",
  openGraph: {
    title: "Terms of Service - CustomFrameSizes.com",
    description: "Terms governing use of our site and services.",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <FileText className="h-5 w-5" />
          <span className="text-sm font-medium">Support</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6" data-testid="heading-terms">
          Terms of Service
        </h1>

        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-base font-medium text-foreground">
            <strong>CustomFrameSizes.com</strong>
            <br />
            <strong>Last Updated: January 2025</strong>
          </p>
          <p className="text-base leading-relaxed">
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of the
            CustomFrameSizes.com website and services (the &quot;Site&quot;), operated by
            CustomPictureFrames LLC (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
          </p>
          <p className="text-base leading-relaxed">
            By accessing the Site, placing an order, creating an account, uploading content, or
            checking any required acknowledgment boxes, you agree to be bound by these Terms. If you
            do not agree, do not use the Site.
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

          <h2 className="text-xl font-semibold text-foreground mt-8">2. Eligibility</h2>
          <p className="text-base leading-relaxed">
            You must be at least 18 years old to use this Site or place an order. By using the Site,
            you represent that you meet this requirement.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">3. Accounts and Checkout</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You may place orders as a guest or through a registered account</li>
            <li>You are responsible for maintaining the accuracy of your information</li>
            <li>You are responsible for all activity associated with your account</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            4. User-Uploaded Content (Images, Artwork, Files)
          </h2>
          <h3 className="text-lg font-semibold text-foreground mt-6">
            4.1 Ownership &amp; Authorization (User Representation)
          </h3>
          <p className="text-base leading-relaxed">
            By uploading any image, artwork, or file (&quot;Content&quot;), you represent and
            warrant that: You are the copyright owner of the Content or you have obtained all
            necessary rights, licenses, or permissions to reproduce the Content. This includes
            permission for printing, framing, and physical reproduction.
          </p>
          <h3 className="text-lg font-semibold text-foreground mt-6">
            4.2 License Grant (Limited &amp; Purpose-Specific)
          </h3>
          <p className="text-base leading-relaxed">
            By uploading Content, you grant CustomPictureFrames LLC a limited, non-exclusive,
            royalty-free license to: Reproduce; Resize, crop, or format; Print and manufacture —
            solely for the purpose of fulfilling your order and providing our services. We do not
            use uploaded images for marketing, resale, or promotional purposes.
          </p>
          <h3 className="text-lg font-semibold text-foreground mt-6">
            4.3 Image Retention &amp; Deletion
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Uploaded images are retained for up to 60 days after order fulfillment</li>
            <li>Purpose: reorders and customer convenience only</li>
            <li>Images are automatically deleted after 60 days</li>
            <li>Images are not permanently archived unless explicitly saved to a user account</li>
          </ul>
          <h3 className="text-lg font-semibold text-foreground mt-6">4.4 Prohibited Content</h3>
          <p className="text-base leading-relaxed">
            You may not upload Content that: Infringes copyrights, trademarks, or publicity rights;
            is illegal, defamatory, or obscene; violates privacy or publicity rights of others. We
            reserve the right to refuse, cancel, or remove any order containing prohibited or
            questionable content.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            5. Copyright Complaints (DMCA)
          </h2>
          <p className="text-base leading-relaxed">
            If you believe your copyrighted work has been infringed, you may submit a DMCA notice
            to:{" "}
            <a
              href="mailto:hello@customframesizes.com"
              className="text-primary underline hover:no-underline"
            >
              hello@customframesizes.com
            </a>
            . Include: Identification of the copyrighted work; identification of the infringing
            material; contact information; a statement of good-faith belief; a statement under
            penalty of perjury; your physical or electronic signature.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">6. Indemnification</h2>
          <p className="text-base leading-relaxed">
            You agree to defend, indemnify, and hold harmless CustomPictureFrames LLC, its owners,
            employees, and agents from any claims, damages, losses, or expenses (including legal
            fees) arising from: Content you upload; your violation of these Terms; any infringement
            or misuse of intellectual property. This section survives termination.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            7. Orders, Pricing &amp; Payment
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>All prices are listed in USD</li>
            <li>Custom products are made-to-order</li>
            <li>Payment is required before production begins</li>
            <li>We reserve the right to correct pricing errors</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            8. Custom Products, Refunds &amp; Cancellations
          </h2>
          <p className="text-base leading-relaxed">Due to the custom nature of our products:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>All sales are final once production begins</li>
            <li>Cancellations may be accepted only before production</li>
            <li>Defective or damaged items will be remedied at our discretion</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">9. Limitation of Liability</h2>
          <p className="text-base leading-relaxed">
            To the maximum extent permitted by law: We are not liable for indirect, incidental, or
            consequential damages; our total liability shall not exceed the amount paid for the
            order at issue.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            10. Disclaimer of Warranties
          </h2>
          <p className="text-base leading-relaxed">
            The Site and services are provided &quot;as is&quot; and &quot;as available.&quot; We
            disclaim all warranties, express or implied, including fitness for a particular purpose.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">11. Termination</h2>
          <p className="text-base leading-relaxed">
            We may suspend or terminate access to the Site at any time for violations of these Terms
            or applicable law.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">
            12. Governing Law &amp; Venue
          </h2>
          <p className="text-base leading-relaxed">
            These Terms are governed by the laws of the State of New Jersey, without regard to
            conflict-of-law principles. Any disputes shall be brought exclusively in New Jersey
            state or federal courts.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">13. Changes to These Terms</h2>
          <p className="text-base leading-relaxed">
            We may update these Terms periodically. Updates will be posted with a revised &quot;Last
            Updated&quot; date. Continued use of the Site constitutes acceptance.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">14. Contact Us</h2>
          <p className="text-base leading-relaxed">For questions regarding these Terms:</p>
          <p className="text-base leading-relaxed mt-2">
            <strong>CustomPictureFrames LLC</strong>
            <br />
            <strong>Email:</strong>{" "}
            <a
              href="mailto:hello@customframesizes.com"
              className="text-primary underline hover:no-underline"
            >
              hello@customframesizes.com
            </a>
            <br />
            <strong>Phone:</strong> 1 (888) 874-7156
          </p>
        </article>
      </div>
    </div>
  );
}
