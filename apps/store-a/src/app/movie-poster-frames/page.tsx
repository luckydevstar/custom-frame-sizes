import type { Metadata } from "next";
import { MoviePosterFramesContent } from "./movie-poster-frames-content";

const baseUrl = "https://customframesizes.com";
const pageUrl = `${baseUrl}/movie-poster-frames`;

export const metadata: Metadata = {
  title: "Movie Poster Frames | Custom Onesheet Poster Framing | CustomFrameSizes.com",
  description:
    "Frame your onesheet movie posters with professional-grade custom frames. Choose from standard US Onesheet (27×40), British Quad, vintage sizes, and more. Archival matting and framer's grade acrylic included.",
  openGraph: {
    title: "Movie Poster Frames | Custom Onesheet Poster Framing",
    description:
      "Frame your onesheet movie posters with professional-grade custom frames. Standard US Onesheet, British Quad, vintage sizes, and custom options available.",
    type: "website",
    url: pageUrl,
  },
  alternates: { canonical: pageUrl },
};

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

export default function MoviePosterFramesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <MoviePosterFramesContent />
    </>
  );
}
