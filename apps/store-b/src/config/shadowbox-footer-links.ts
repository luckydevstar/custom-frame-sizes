import type { FooterLinks } from "@framecraft/ui/components/layout";

/**
 * Footer columns from b-shadow-box-frames-original/content/config/footer-links.json
 * (source of truth for ShadowboxFrames.com)
 */
export const shadowboxFooterLinks: FooterLinks = {
  shop: [
    { label: "Shadowbox Designer", path: "/shadowbox" },
    { label: "Frame Designer", path: "/" },
    { label: "Browse by Color", path: "/shadowboxes/colors" },
    { label: "Frame Styles", path: "/picture-frames" },
    { label: "Order Samples", path: "/samples" },
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
    { label: "Quality Guarantee", path: "/warranty" },
  ],
  support: [
    { label: "FAQ", path: "/faq" },
    { label: "Shipping Policy", path: "/shipping-policy" },
    { label: "Returns & Exchanges", path: "/returns-exchanges" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms of Service", path: "/terms" },
  ],
};
