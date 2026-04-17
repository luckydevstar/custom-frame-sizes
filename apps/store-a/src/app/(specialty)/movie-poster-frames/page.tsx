import { Suspense } from "react";

import { generatePageMetadata } from "@/lib/seo-utils";

import { MoviePosterFramesContent } from "./movie-poster-frames-content";

import type { Metadata } from "next";

const baseUrl = "https://www.customframesizes.com";

export const metadata: Metadata = generatePageMetadata("/movie-poster-frames", {
  title: "Movie Poster Frames | Custom Onesheet Poster Framing | CustomFrameSizes.com",
  description:
    "Frame your onesheet movie posters with professional-grade custom frames. Choose from standard US Onesheet (27×40), British Quad, vintage sizes, and more. Archival matting and framer's grade acrylic included.",
  domain: baseUrl,
  ogImage: `${baseUrl}/assets/og-image.jpg`,
});

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Onesheet Movie Poster Frames",
  description:
    "Professional-grade custom frames for onesheet movie posters with archival matting and framer's grade acrylic glazing. Available in US Onesheet (27×40), British Quad (27×39), vintage sizes (27×41), and custom sizes.",
  category: "Movie Poster Framing",
  sku: "MOVIE-POSTER-FRAME-CUSTOM",
  brand: { "@type": "Brand", name: "Custom Frame Sizes" },
  offers: {
    "@type": "AggregateOffer",
    availability: "https://schema.org/InStock",
    priceCurrency: "USD",
    lowPrice: "129",
    highPrice: "399",
  },
};

function MoviePosterFallback() {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-muted/20">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function MoviePosterFramesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Suspense fallback={<MoviePosterFallback />}>
        <MoviePosterFramesContent />
      </Suspense>
    </>
  );
}
