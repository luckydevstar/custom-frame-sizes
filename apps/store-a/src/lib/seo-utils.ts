/**
 * SEO Metadata Utilities
 * 
 * Helpers for generating proper page-specific canonical URLs and metadata
 */

export function getCanonicalUrl(pathname: string, domain: string = "https://www.customframesizes.com"): string {
  // Ensure pathname starts with /
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  // Remove trailing slash except for root
  const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");
  return `${domain}${normalizedPath}`;
}

/**
 * Generate page metadata with proper canonical URL
 */
export function generatePageMetadata(
  pathname: string,
  {
    title,
    description,
    ogType = "website",
    keywords,
    domain = "https://www.customframesizes.com",
  }: {
    title: string;
    description: string;
    ogType?: string;
    keywords?: string[];
    domain?: string;
  }
) {
  const canonical = getCanonicalUrl(pathname, domain);

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: ogType,
      url: canonical,
    },
    alternates: {
      canonical,
    },
  };
}
