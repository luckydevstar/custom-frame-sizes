"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

interface TermsOfServiceModalProps {
  children?: React.ReactNode;
  className?: string;
}

export function TermsOfServiceModal({ children, className }: TermsOfServiceModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={className || "text-primary hover:underline"}
          data-testid="button-terms-modal-trigger"
        >
          {children || "Terms of Service"}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh]" data-testid="dialog-terms-of-service">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6 text-sm text-muted-foreground">
            <div className="text-xs">
              <p className="font-semibold text-foreground">CustomFrameSizes.com</p>
              <p>Last Updated: January 2025</p>
            </div>

            <p>
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of the
              CustomFrameSizes.com website and services (the &quot;Site&quot;), operated by
              CustomPictureFrames LLC (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
            </p>
            <p>
              By accessing the Site, placing an order, creating an account, uploading content, or
              checking any required acknowledgment boxes, you agree to be bound by these Terms. If
              you do not agree, do not use the Site.
            </p>

            <section>
              <h3 className="font-semibold text-foreground mb-2">1. Company Information</h3>
              <p>
                <strong>Legal Entity:</strong> CustomPictureFrames LLC
              </p>
              <p className="mt-2">
                <strong>Business Address:</strong>
                <br />
                6 Shirley Ave
                <br />
                Somerset, NJ 08873
              </p>
              <p className="mt-2">
                <strong>Email:</strong> hello@customframesizes.com
              </p>
              <p>
                <strong>Phone:</strong> 1 (888) 874-7156
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">2. Eligibility</h3>
              <p>
                You must be at least 18 years old to use this Site or place an order. By using the
                Site, you represent that you meet this requirement.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">3. Accounts and Checkout</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>You may place orders as a guest or through a registered account</li>
                <li>You are responsible for maintaining the accuracy of your information</li>
                <li>You are responsible for all activity associated with your account</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                4. User-Uploaded Content (Images, Artwork, Files)
              </h3>

              <h4 className="font-medium text-foreground mt-3 mb-1">
                4.1 Ownership &amp; Authorization
              </h4>
              <p>
                By uploading any image, artwork, or file (&quot;Content&quot;), you represent and
                warrant that:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>You are the copyright owner of the Content, or</li>
                <li>
                  You have obtained all necessary rights, licenses, or permissions to reproduce the
                  Content
                </li>
              </ul>
              <p className="mt-2">
                This includes permission for printing, framing, and physical reproduction.
              </p>

              <h4 className="font-medium text-foreground mt-3 mb-1">4.2 License Grant</h4>
              <p>
                By uploading Content, you grant CustomPictureFrames LLC a limited, non-exclusive,
                royalty-free license to:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Reproduce</li>
                <li>Resize, crop, or format</li>
                <li>Print and manufacture</li>
              </ul>
              <p className="mt-2">
                Solely for the purpose of fulfilling your order and providing our services.
              </p>
              <p className="mt-2">
                We do not use uploaded images for marketing, resale, or promotional purposes.
              </p>

              <h4 className="font-medium text-foreground mt-3 mb-1">
                4.3 Image Retention & Deletion
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Uploaded images are retained for up to 60 days after order fulfillment</li>
                <li>Purpose: reorders and customer convenience only</li>
                <li>Images are automatically deleted after 60 days</li>
                <li>
                  Images are not permanently archived unless explicitly saved to a user account
                </li>
              </ul>

              <h4 className="font-medium text-foreground mt-3 mb-1">4.4 Prohibited Content</h4>
              <p>You may not upload Content that:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Infringes copyrights, trademarks, or publicity rights</li>
                <li>Is illegal, defamatory, or obscene</li>
                <li>Violates privacy or publicity rights of others</li>
              </ul>
              <p className="mt-2">
                We reserve the right to refuse, cancel, or remove any order containing prohibited or
                questionable content.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">5. Copyright Complaints (DMCA)</h3>
              <p>
                If you believe your copyrighted work has been infringed, you may submit a DMCA
                notice to:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> hello@customframesizes.com
              </p>
              <p className="mt-2">Include:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Identification of the copyrighted work</li>
                <li>Identification of the infringing material</li>
                <li>Contact information</li>
                <li>A statement of good-faith belief</li>
                <li>A statement under penalty of perjury</li>
                <li>Your physical or electronic signature</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">6. Indemnification</h3>
              <p>
                You agree to defend, indemnify, and hold harmless CustomPictureFrames LLC, its
                owners, employees, and agents from any claims, damages, losses, or expenses
                (including legal fees) arising from:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Content you upload</li>
                <li>Your violation of these Terms</li>
                <li>Any infringement or misuse of intellectual property</li>
              </ul>
              <p className="mt-2">This section survives termination.</p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">7. Orders, Pricing & Payment</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>All prices are listed in USD</li>
                <li>Custom products are made-to-order</li>
                <li>Payment is required before production begins</li>
                <li>We reserve the right to correct pricing errors</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                8. Custom Products, Refunds & Cancellations
              </h3>
              <p>Due to the custom nature of our products:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>All sales are final once production begins</li>
                <li>Cancellations may be accepted only before production</li>
                <li>Defective or damaged items will be remedied at our discretion</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">9. Limitation of Liability</h3>
              <p>To the maximum extent permitted by law:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>Our total liability shall not exceed the amount paid for the order at issue</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">10. Disclaimer of Warranties</h3>
              <p>
                The Site and services are provided &quot;as is&quot; and &quot;as available.&quot;
                We disclaim all warranties, express or implied, including fitness for a particular
                purpose.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">11. Termination</h3>
              <p>
                We may suspend or terminate access to the Site at any time for violations of these
                Terms or applicable law.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">12. Governing Law &amp; Venue</h3>
              <p>
                These Terms are governed by the laws of the State of New Jersey, without regard to
                conflict-of-law principles.
              </p>
              <p className="mt-2">
                Any disputes shall be brought exclusively in New Jersey state or federal courts.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">13. Changes to These Terms</h3>
              <p>
                We may update these Terms periodically. Updates will be posted with a revised
                &quot;Last Updated&quot; date. Continued use of the Site constitutes acceptance.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">14. Contact Us</h3>
              <p>For questions regarding these Terms:</p>
              <p className="mt-2">
                <strong>CustomPictureFrames LLC</strong>
                <br />
                <strong>Email:</strong> hello@customframesizes.com
                <br />
                <strong>Phone:</strong> 1 (888) 874-7156
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
