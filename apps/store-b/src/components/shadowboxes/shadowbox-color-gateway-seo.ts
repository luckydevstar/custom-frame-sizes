/**
 * Helmet SEO — origina-store-b/client/src/pages/shadowboxes/*ShadowboxFrames.tsx
 */

import type { Metadata } from "next";

import type { ShadowboxGatewayColorName } from "./shadowbox-color-gateway-keys";

export interface ShadowboxGatewaySeoBlock {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
}

/** Canonical URLs match legacy: https://www.shadowboxframes.com/shadowboxes/colors/{slug} */
export const SHADOWBOX_GATEWAY_SEO: Record<ShadowboxGatewayColorName, ShadowboxGatewaySeoBlock> = {
  Black: {
    title: "Black Shadowbox Frames - Professional Display Cases for Jerseys & Medals | ShadowboxFrames",
    description:
      "Professional black shadowbox frames in depths from 0.875 to 3.5 inches for sports jerseys, military medals, vinyl records, and collectibles. Professional-grade preservation with framer's grade acrylic, solid wood construction, and archival materials. Custom sizes available.",
    keywords: [
      "black shadowbox frames",
      "jersey display case",
      "black shadow box",
      "sports memorabilia frames",
      "military medal display case",
      "black deep frame",
      "vinyl record frame",
      "black display case",
      "3D display frame",
      "memorabilia shadow box",
    ],
    ogTitle: "Black Shadowbox Frames - Professional Display Cases | ShadowboxFrames",
    ogDescription:
      "Professional black shadowbox frames in multiple depths for sports jerseys, military medals, and collectibles. Professional-grade preservation with UV protection.",
  },
  White: {
    title: "White Shadowbox Frames - Gallery Display Cases for Artwork & Memorabilia | ShadowboxFrames",
    description:
      "Gallery-style white shadowbox frames in depths from 0.875 to 3.5 inches for artwork, signed memorabilia, wedding keepsakes, and vinyl records. Professional-grade preservation with framer's grade acrylic, solid wood construction, and archival materials. Custom sizes available.",
    keywords: [
      "white shadowbox frames",
      "white shadow box",
      "white display case",
      "gallery display frame",
      "white deep frame",
      "artwork display case",
      "wedding memorabilia frame",
      "white picture frame",
      "3D display frame",
      "white shadow box frame",
    ],
    ogTitle: "White Shadowbox Frames - Gallery Display Cases | ShadowboxFrames",
    ogDescription:
      "Gallery-style white shadowbox frames in multiple depths for artwork, signed memorabilia, and wedding keepsakes. Professional-grade preservation with UV protection.",
  },
  Brown: {
    title: "Brown Shadowbox Frames - Vintage Display Cases for Heirlooms & Memorabilia | ShadowboxFrames",
    description:
      "Warm brown shadowbox frames in depths from 0.875 to 3.5 inches for vintage memorabilia, family heirlooms, antique photos, and rustic collections. Professional-grade preservation with framer's grade acrylic, solid wood construction, and archival materials. Custom sizes available.",
    keywords: [
      "brown shadowbox frames",
      "brown shadow box",
      "vintage display case",
      "brown deep frame",
      "rustic shadowbox",
      "heirloom display frame",
      "wood shadowbox frame",
      "brown display case",
      "antique frame",
      "traditional shadow box",
    ],
    ogTitle: "Brown Shadowbox Frames - Vintage Display Cases | ShadowboxFrames",
    ogDescription:
      "Warm brown shadowbox frames in multiple depths for vintage memorabilia, family heirlooms, and rustic collections. Professional-grade preservation with UV protection.",
  },
  Silver: {
    title: "Silver Shadowbox Frames - Modern Display Cases for Athletic Medals & Awards | ShadowboxFrames",
    description:
      "Elegant silver shadowbox frames in depths from 0.875 to 3.5 inches for athletic medals, corporate awards, modern achievements, and contemporary styling. Professional-grade preservation with framer's grade acrylic, solid wood construction, and acid-free materials. Custom sizes available.",
    keywords: [
      "silver shadowbox frames",
      "silver shadow box",
      "silver display case",
      "metallic shadowbox",
      "silver deep frame",
      "athletic medal frame",
      "corporate award frame",
      "modern shadowbox",
      "silver picture frame",
      "contemporary shadow box",
    ],
    ogTitle: "Silver Shadowbox Frames - Modern Display Cases | ShadowboxFrames",
    ogDescription:
      "Elegant silver shadowbox frames in multiple depths for athletic medals, corporate awards, and modern achievements. Professional-grade preservation with UV protection.",
  },
  Gold: {
    title: "Gold Shadowbox Frames - Premium Display Cases for Championships & Awards | ShadowboxFrames",
    description:
      "Premium gold shadowbox frames in depths from 0.875 to 3.5 inches for championship rings, military medals, formal awards, and prestige displays. Professional-grade preservation with framer's grade acrylic, solid wood construction, and acid-free materials. Custom sizes available.",
    keywords: [
      "gold shadowbox frames",
      "gold shadow box",
      "championship display case",
      "gold deep frame",
      "award display frame",
      "military medal frame",
      "gold picture frame",
      "prestige shadowbox",
      "trophy display case",
      "gold shadow box frame",
    ],
    ogTitle: "Gold Shadowbox Frames - Premium Display Cases | ShadowboxFrames",
    ogDescription:
      "Premium gold shadowbox frames in multiple depths for championship rings, military medals, and formal awards. Professional-grade preservation with UV protection.",
  },
  Blue: {
    title: "Blue Shadowbox Frames - Unique Display Cases for Nautical & Team Memorabilia | ShadowboxFrames",
    description:
      "Distinctive blue shadowbox frames in depths from 0.875 to 3.5 inches for nautical memorabilia, school colors, unique themed displays, and coastal décor. Professional-grade preservation with framer's grade acrylic, solid wood construction, and acid-free materials. Custom sizes available.",
    keywords: [
      "blue shadowbox frames",
      "blue shadow box",
      "nautical display case",
      "blue deep frame",
      "school spirit frame",
      "coastal shadowbox",
      "navy shadowbox frame",
      "blue display case",
      "team color frame",
      "unique shadow box",
    ],
    ogTitle: "Blue Shadowbox Frames - Unique Display Cases | ShadowboxFrames",
    ogDescription:
      "Distinctive blue shadowbox frames in multiple depths for nautical memorabilia, school colors, and unique themed displays. Professional-grade preservation with UV protection.",
  },
  Natural: {
    title: "Natural Shadowbox Frames - Organic Display Cases for Versatile Styling | ShadowboxFrames",
    description:
      "Organic natural wood shadowbox frames in depths from 0.875 to 3.5 inches for vintage items, nature collections, rustic displays, and transitional décor. Professional-grade preservation with framer's grade acrylic, solid wood construction, and archival materials. Custom sizes available.",
    keywords: [
      "natural shadowbox frames",
      "natural wood shadow box",
      "natural display case",
      "organic shadowbox",
      "wood grain frame",
      "natural deep frame",
      "eco-friendly display case",
      "rustic shadowbox frame",
      "farmhouse shadow box",
      "natural wood display",
    ],
    ogTitle: "Natural Shadowbox Frames - Organic Display Cases | ShadowboxFrames",
    ogDescription:
      "Organic natural wood shadowbox frames in multiple depths for vintage items, nature collections, and rustic displays. Professional-grade preservation with UV protection.",
  },
};

/** Product JSON-LD aggregateRating.reviewCount from origina per color page */
export const SHADOWBOX_GATEWAY_PRODUCT_REVIEW_COUNT: Record<ShadowboxGatewayColorName, string> = {
  Black: "287",
  White: "243",
  Brown: "218",
  Silver: "231",
  Gold: "287",
  Blue: "204",
  Natural: "256",
};

/** Product JSON-LD aggregateRating.ratingValue from origina per color page */
export const SHADOWBOX_GATEWAY_PRODUCT_RATING_VALUE: Record<ShadowboxGatewayColorName, string> = {
  Black: "4.8",
  White: "4.8",
  Brown: "4.7",
  Silver: "4.8",
  Gold: "4.9",
  Blue: "4.7",
  Natural: "4.8",
};

export function shadowboxGatewayMetadata(
  seo: ShadowboxGatewaySeoBlock,
  gatewayPath: string,
  ogImageUrl: string,
  slug: string
): Metadata {
  const url = `https://www.shadowboxframes.com${gatewayPath}`;
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: `https://www.shadowboxframes.com/shadowboxes/colors/${slug}` },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      type: "website",
      url,
      images: [{ url: ogImageUrl }],
    },
  };
}
