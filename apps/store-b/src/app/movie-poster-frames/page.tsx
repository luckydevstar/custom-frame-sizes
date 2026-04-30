import type { Metadata } from "next";

import { MoviePosterFramesPageContent } from "@/components/movie-poster-frames/movie-poster-frames-page-content";

const pageUrl = "https://www.shadowboxframes.com/movie-poster-frames";

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Onesheet Movie Poster Frames",
  description:
    "Professional-grade custom frames for onesheet movie posters with archival matting and framer's grade acrylic glazing. Available in US Onesheet (27×40), British Quad (27×39), vintage sizes (27×41), and custom sizes.",
  category: "Movie Poster Framing",
  sku: "MOVIE-POSTER-FRAME-CUSTOM",
  brand: {
    "@type": "Brand",
    name: "ShadowboxFrames",
  },
  offers: {
    "@type": "AggregateOffer",
    availability: "https://schema.org/InStock",
    priceCurrency: "USD",
    lowPrice: "129",
    highPrice: "399",
  },
};

/** b-shadow-box-frames-original/client/src/pages/MoviePosterFrames.tsx */
export const metadata: Metadata = {
  title: "Movie Poster Frames | Custom Onesheet Poster Framing | ShadowboxFrames.com",
  description:
    "Frame your onesheet movie posters with professional-grade custom frames. Choose from standard US Onesheet (27×40), British Quad, vintage sizes, and more. Archival matting and framer's grade acrylic included.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Movie Poster Frames | Custom Onesheet Poster Framing",
    description:
      "Frame your onesheet movie posters with professional-grade custom frames. Standard US Onesheet, British Quad, vintage sizes, and custom options available.",
    type: "website",
    url: pageUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Movie Poster Frames | Custom Onesheet Poster Framing",
    description:
      "Professional custom frames for onesheet posters—standard sizes, archival matting, framer's grade acrylic.",
  },
};

export default function MoviePosterFramesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <MoviePosterFramesPageContent />
    </>
  );
}
