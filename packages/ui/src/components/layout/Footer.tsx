/**
 * Footer Component
 *
 * Layout component for site footer with links, newsletter signup, and contact info.
 *
 * NOTE: This is a simplified version created for P1-012. The full Footer component
 * has dependencies on config files (footerLinks, brandConfig) that will be extracted
 * to the @framecraft/config package in future tickets (P1-024, etc.). This component
 * will be enhanced once those dependencies are available.
 */

import { Link } from "wouter";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Phone, Mail } from "lucide-react";

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

export interface FooterConfig {
  /**
   * Site/brand name for copyright
   */
  siteName?: string;

  /**
   * Contact phone number
   */
  contactPhone?: string;

  /**
   * Contact email address
   */
  contactEmail?: string;

  /**
   * Footer link groups
   */
  links?: FooterLinks;

  /**
   * Newsletter signup handler
   */
  onNewsletterSubmit?: (email: string) => void;
}

export interface FooterProps {
  /**
   * Footer configuration
   */
  config?: FooterConfig;
}

const defaultConfig: FooterConfig = {
  siteName: "CustomFrameSizes.com",
  contactPhone: "1 (888) 874-7156",
  contactEmail: "hello@CustomFrameSizes.com",
  links: {
    shop: [],
    learn: [],
    company: [],
    support: [],
  },
};

export function Footer({ config = defaultConfig }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const footerConfig = { ...defaultConfig, ...config };

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (footerConfig.onNewsletterSubmit) {
      footerConfig.onNewsletterSubmit(email);
    }
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
          {renderLinkColumn("Shop", footerConfig.links?.shop)}
          {renderLinkColumn("Learn", footerConfig.links?.learn)}
          {renderLinkColumn("Company", footerConfig.links?.company)}
          {renderLinkColumn("Support", footerConfig.links?.support)}

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
        {(footerConfig.contactPhone || footerConfig.contactEmail) && (
          <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-sm">
            {footerConfig.contactPhone && (
              <a
                href={`tel:${footerConfig.contactPhone.replace(/\D/g, "")}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-phone"
              >
                <Phone className="h-4 w-4" />
                <span>{footerConfig.contactPhone}</span>
              </a>
            )}
            {footerConfig.contactEmail && (
              <a
                href={`mailto:${footerConfig.contactEmail}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-email"
              >
                <Mail className="h-4 w-4" />
                <span>{footerConfig.contactEmail}</span>
              </a>
            )}
          </div>
        )}

        {/* Bottom Bar */}
        <div className="border-t mt-6 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {footerConfig.siteName && (
            <p className="text-sm text-muted-foreground" data-testid="text-copyright">
              © {currentYear} {footerConfig.siteName}. All rights reserved.
            </p>
          )}
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
