/**
 * Footer Component
 *
 * Layout component for site footer with links, newsletter signup, and contact info.
 * Updated for Next.js App Router and store-config awareness (P2-004).
 *
 * @packageDocumentation
 */

"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Phone, Mail } from "lucide-react";
import { useStoreConfig } from "@framecraft/core";

export interface FooterLink {
  label: string;
  path: string;
}

export interface FooterLinks {
  shop?: FooterLink[];
  learn?: FooterLink[];
  company?: FooterLink[];
  support?: FooterLink[];
}

export interface FooterProps {
  /**
   * Footer link groups
   * If not provided, will use defaults or empty
   */
  links?: FooterLinks;

  /**
   * Newsletter signup handler
   * If not provided, form will submit but do nothing
   */
  onNewsletterSubmit?: (email: string) => void;
}

// Default footer links (can be overridden via props or store config)
// These match the original project's footer-links.json structure
const defaultLinks: FooterLinks = {
  shop: [
    { label: "Frame Designer", path: "/" },
    { label: "Shop by Color", path: "/frames/colors" },
    { label: "Frame Styles", path: "/picture-frames" },
    { label: "Components", path: "/components" },
    { label: "Order Samples", path: "/samples" },
    { label: "Gallery Wall Guide", path: "/gallery-wall-guide" },
    { label: "Frame Size Chart", path: "/frame-size-chart" },
  ],
  learn: [
    { label: "All Guides", path: "/learn" },
    { label: "How to Measure", path: "/how-to-measure" },
    { label: "Mat Board Guide", path: "/mat-board-guide" },
    { label: "Glazing Guide", path: "/glazing-guide" },
    { label: "Care Instructions", path: "/care-instructions" },
  ],
  company: [
    { label: "About Us", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "Business Services", path: "/business" },
    { label: "Contact", path: "/contact" },
    { label: "Frame Quality Guarantee", path: "/warranty" },
  ],
  support: [
    { label: "FAQ", path: "/faq" },
    { label: "Shipping Policy", path: "/shipping-policy" },
    { label: "Returns & Exchanges", path: "/returns-exchanges" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms of Service", path: "/terms" },
  ],
};

export function Footer({ links, onNewsletterSubmit }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const storeConfig = useStoreConfig();

  // Get contact info from store config
  const siteName = storeConfig.name || "Store";
  const contactPhone = (storeConfig.metadata?.contactPhone as string) || undefined;
  const contactEmail = (storeConfig.metadata?.contactEmail as string) || undefined;

  // Use provided links or defaults
  const footerLinks = links || defaultLinks;

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (onNewsletterSubmit) {
      onNewsletterSubmit(email);
    }
    // TODO: Wire to email service when ready
  };

  const renderLinkColumn = (title: string, links: FooterLink[] = []) => {
    if (links.length === 0) return null;

    return (
      <div>
        <h3 className="font-semibold text-base mb-4">{title}</h3>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <footer className="border-t bg-card mt-auto" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {renderLinkColumn("Shop", footerLinks.shop)}
          {renderLinkColumn("Learn", footerLinks.learn)}
          {renderLinkColumn("Company", footerLinks.company)}
          {renderLinkColumn("Support", footerLinks.support)}

          {/* Newsletter Column */}
          <div>
            <h3 className="font-semibold text-base mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Get framing tips and exclusive offers
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <Input
                type="email"
                id="newsletter-email"
                name="email"
                placeholder="Enter your email"
                required
                aria-required="true"
                aria-label="Email address for newsletter"
                className="text-sm"
                data-testid="input-newsletter-email"
              />
              <Button
                type="submit"
                size="sm"
                className="w-full"
                data-testid="button-newsletter-submit"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Contact Info Row */}
        {(contactPhone || contactEmail) && (
          <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-sm">
            {contactPhone && (
              <a
                href={`tel:${contactPhone.replace(/\D/g, "")}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-phone"
              >
                <Phone className="h-4 w-4" />
                <span>{contactPhone}</span>
              </a>
            )}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-email"
              >
                <Mail className="h-4 w-4" />
                <span>{contactEmail}</span>
              </a>
            )}
          </div>
        )}

        {/* Bottom Bar */}
        <div className="border-t mt-6 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            © {currentYear} {siteName}. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <Link
              href="/privacy-policy"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-privacy"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-terms"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-contact"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
