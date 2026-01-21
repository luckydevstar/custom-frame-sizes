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
  const siteName = (config as any).siteName ?? config.seo?.title ?? config.name ?? "";
  const legalName = (config as any).legalName ?? config.name ?? "";
  const siteUrl = (config as any).siteUrl ?? `https://${config.domain}`;
  const contactEmail = (config as any).contactEmail ?? "";
  const twitter = (config as any).twitter;
  const foundedYear = (config as any).foundedYear;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    legalName: legalName,
    url: siteUrl,
    logo: siteUrl ? `${siteUrl}/assets/brand/logo-blue.png` : "",
    foundingDate: foundedYear?.toString(),
    contactPoint: {
      "@type": "ContactPoint",
      email: contactEmail,
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: "English",
    },
    ...(twitter
      ? {
          sameAs: [`https://twitter.com/${twitter.replace("@", "")}`],
        }
      : {}),
  };
}

/**
 * Generate WebSite JSON-LD schema for SEO
 * @param config Brand configuration
 */
export function getWebSiteSchema(config: BrandConfig) {
  const siteName = (config as any).siteName ?? config.seo?.title ?? config.name ?? "";
  const siteUrl = (config as any).siteUrl ?? `https://${config.domain}`;
  const defaultDescription = (config as any).defaultDescription ?? config.seo?.description ?? "";
  const legalName = (config as any).legalName ?? config.name ?? "";

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: defaultDescription,
    publisher: {
      "@type": "Organization",
      name: legalName,
    },
  };
}

/**
 * Generate LocalBusiness JSON-LD schema for SEO
 * @param config Brand configuration
 */
export function getLocalBusinessSchema(config: BrandConfig) {
  const siteName = (config as any).siteName ?? config.seo?.title ?? config.name ?? "";
  const legalName = (config as any).legalName ?? config.name ?? "";
  const siteUrl = (config as any).siteUrl ?? `https://${config.domain}`;
  const defaultDescription = (config as any).defaultDescription ?? config.seo?.description ?? "";
  const contactEmail = (config as any).contactEmail ?? "";

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteName,
    legalName: legalName,
    url: siteUrl,
    logo: siteUrl ? `${siteUrl}/assets/brand/logo-blue.png` : "",
    description: defaultDescription,
    email: contactEmail,
    priceRange: "$$",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
  };
}
