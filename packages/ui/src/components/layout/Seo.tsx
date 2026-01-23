"use client";

import { Helmet } from "react-helmet-async";

export interface BrandConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  ogImage: string;
  twitter?: string;
}

export interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  canonicalUrl?: string;
  noindex?: boolean;
  schema?: object;
  keywords?: string;
  brandConfig: BrandConfig;
}

export function Seo({
  title,
  description,
  image,
  article = false,
  publishedTime,
  modifiedTime,
  author,
  tags,
  canonicalUrl,
  noindex = false,
  schema,
  keywords,
  brandConfig,
}: SeoProps) {
  const pageTitle = title ? `${title} | ${brandConfig.siteName}` : brandConfig.defaultTitle;

  const effectiveDescription = description || brandConfig.defaultDescription;
  const effectiveImage = image || brandConfig.ogImage;

  const fullImageUrl = effectiveImage.startsWith("http")
    ? effectiveImage
    : `${brandConfig.siteUrl}${effectiveImage}`;

  const canonical =
    canonicalUrl || (typeof window !== "undefined" ? window.location.href : brandConfig.siteUrl);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={effectiveDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:site_name" content={brandConfig.siteName} />
      <meta property="og:title" content={title || brandConfig.defaultTitle} />
      <meta property="og:description" content={effectiveDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={article ? "article" : "website"} />

      {article && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {article && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {article && author && <meta property="article:author" content={author} />}
      {article &&
        tags &&
        tags.map((tag) => <meta key={tag} property="article:tag" content={tag} />)}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {brandConfig.twitter && <meta name="twitter:site" content={brandConfig.twitter} />}
      <meta name="twitter:title" content={title || brandConfig.defaultTitle} />
      <meta name="twitter:description" content={effectiveDescription} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Structured Data (JSON-LD) */}
      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Helmet>
  );
}
