import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { brandConfig } from "@/brand.config";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Custom Frame Sizes",
  description:
    "Get in touch with our framing experts. We're here to help with your custom frame project.",
  openGraph: {
    title: "Contact Us",
    description:
      "Get in touch with our framing experts. We're here to help with your custom frame project.",
    type: "website",
  },
};

export default function ContactPage() {
  const contactEmail = (brandConfig.metadata?.contactEmail ??
    "hello@customframesizes.com") as string;
  const contactPhone = (brandConfig.metadata?.contactPhone ?? "1 (888) 874-7156") as string;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Mail className="h-5 w-5" />
          <span className="text-sm font-medium">Company</span>
        </div>
        <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">
          Contact Us
        </h1>
        <p className="text-muted-foreground mb-8">
          Have a question about custom framing? Our team is here to help. Fill out the form below
          and we&apos;ll get back to you within 24 hours.
        </p>

        <ContactForm contactEmail={contactEmail} contactPhone={contactPhone} />

        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Other Ways to Reach Us</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong className="text-foreground">Phone:</strong>{" "}
              <a
                href={`tel:${contactPhone.replace(/\D/g, "")}`}
                className="text-primary hover:underline"
                data-testid="link-contact-phone"
              >
                {contactPhone}
              </a>
            </p>
            <p>
              <strong className="text-foreground">Email:</strong>{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-primary hover:underline"
                data-testid="link-contact-email"
              >
                {contactEmail}
              </a>
            </p>
            <p>
              <strong className="text-foreground">Response Time:</strong> Within 24 hours on
              business days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
