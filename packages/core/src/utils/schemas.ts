/**
 * SEO Schema generation utilities
 * Generates JSON-LD structured data for SEO
 */

import type { BrandConfig } from "@framecraft/config";

/**
 * Generate Organization JSON-LD schema for SEO
 * @param config Brand configuration
 */
export function getOrganizationSchema(config: BrandConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.siteName,
    legalName: config.legalName,
    url: config.siteUrl,
    logo: `${config.siteUrl}/assets/brand/logo-blue.png`,
    foundingDate: config.foundedYear?.toString(),
    contactPoint: {
      "@type": "ContactPoint",
      email: config.contactEmail,
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: "English",
    },
    ...(config.twitter
      ? {
          sameAs: [`https://twitter.com/${config.twitter.replace("@", "")}`],
        }
      : {}),
  };
}

/**
 * Generate WebSite JSON-LD schema for SEO
 * @param config Brand configuration
 */
export function getWebSiteSchema(config: BrandConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.siteName,
    url: config.siteUrl,
    description: config.defaultDescription,
    publisher: {
      "@type": "Organization",
      name: config.legalName,
    },
  };
}

/**
 * Generate LocalBusiness JSON-LD schema for SEO
 * @param config Brand configuration
 */
export function getLocalBusinessSchema(config: BrandConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: config.siteName,
    legalName: config.legalName,
    url: config.siteUrl,
    logo: `${config.siteUrl}/assets/brand/logo-blue.png`,
    description: config.defaultDescription,
    email: config.contactEmail,
    priceRange: "$$",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
  };
}
