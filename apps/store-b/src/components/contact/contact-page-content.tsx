"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  useToast,
} from "@framecraft/ui";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { brandConfig } from "@/brand.config";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must be less than 2000 characters"),
  honeypot: z.string().max(0, "Bot detected"),
});

type ContactFormData = z.infer<typeof contactSchema>;

/** origina-store-b/content/_meta/site.json — mirrored via brandConfig */

function getSiteContact() {
  const meta = brandConfig.metadata ?? {};
  return {
    siteName: brandConfig.name,
    contactEmail: String(meta.contactEmail ?? "hello@ShadowboxFrames.com"),
    contactPhone: String(meta.contactPhone ?? "1 (888) 874-7156"),
  };
}

/** origina-store-b/client/src/pages/ContactPage.tsx */
export function ContactPageContent() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const { toast } = useToast();
  const [formStartTime] = useState(() => Date.now());
  const site = getSiteContact();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      honeypot: "",
    },
  });

  const schemaLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    description:
      "Reach our shadow box specialists by email, phone, or form. We are here to help you design the handcrafted shadow box frame your keepsake deserves.",
    mainEntity: {
      "@type": "LocalBusiness",
      name: site.siteName,
      email: site.contactEmail,
      telephone: site.contactPhone,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Service",
        email: site.contactEmail,
        telephone: site.contactPhone,
      },
    },
  };

  const onSubmit = (data: ContactFormData) => {
    const timeElapsed = Date.now() - formStartTime;
    if (timeElapsed < 2000) {
      toast({
        title: "Error",
        description: "Please take your time filling out the form.",
        variant: "destructive",
      });
      return;
    }

    if (data.honeypot) {
      return;
    }

    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });

    form.reset();
  };

  const telHref = `tel:${site.contactPhone.replace(/\D/g, "")}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLd) }}
      />

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">
          Get in Touch
        </h1>
        <p className="text-muted-foreground mb-8">
          Have a keepsake you want to frame? Curious about shadow box depths, materials, or design
          options? Our team of shadow box specialists is here to help. Reach out by email, phone, or
          the form below and we will get back to you promptly.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="honeypot"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} tabIndex={-1} autoComplete="off" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="name" data-testid="input-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} autoComplete="email" data-testid="input-email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} autoComplete="tel" data-testid="input-phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject *</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-subject" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message *</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={6} data-testid="input-message" />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    {field.value.length} / 2000 characters
                  </p>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
              data-testid="button-submit-contact"
            >
              Send Message
            </Button>
          </form>
        </Form>

        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-semibold mb-4">Other Ways to Reach Us</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong>Phone:</strong>{" "}
              <a
                href={telHref}
                className="text-primary hover:underline"
                data-testid="link-contact-phone"
              >
                {site.contactPhone}
              </a>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${site.contactEmail}`}
                className="text-primary hover:underline"
                data-testid="link-contact-email"
              >
                {site.contactEmail}
              </a>
            </p>
            <p>
              <strong>Response Time:</strong> Within 24 hours on business days
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
