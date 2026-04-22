import type { Metadata } from "next";

import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us | ShadowboxFrames.com",
  description:
    "Get in touch with ShadowboxFrames.com. Contact our team with questions about custom shadowbox frames.",
};

export default function ContactPage() {
  return (
    <div className="space-y-0">
      <section className="bg-gradient-to-b from-card to-background px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Have questions? We&apos;d love to hear from you. Get in touch with our team.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">
          <ContactForm />

          <div className="space-y-8">
            <h2 className="font-serif text-2xl font-bold">Get in Touch</h2>

            <div className="space-y-2">
              <h3 className="font-semibold">Phone</h3>
              <a href="tel:1-888-874-7156" className="text-accent hover:text-accent/80 transition-colors">
                1 (888) 874-7156
              </a>
              <p className="text-sm text-muted-foreground">Available Monday–Friday, 9 AM–5 PM EST</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Email</h3>
              <a
                href="mailto:hello@ShadowboxFrames.com"
                className="text-accent hover:text-accent/80 transition-colors"
              >
                hello@ShadowboxFrames.com
              </a>
              <p className="text-sm text-muted-foreground">We typically respond within 24 hours</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Business Hours</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Monday–Friday: 9 AM–5 PM EST</p>
                <p>Saturday–Sunday: Closed</p>
              </div>
            </div>

            <div className="pt-6 border-t border-border space-y-4">
              <p className="text-sm text-muted-foreground">
                For custom frame inquiries, design consultations, or bulk orders, please reach out to us directly.
                Our team is excited to help you create the perfect shadowbox frame.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
