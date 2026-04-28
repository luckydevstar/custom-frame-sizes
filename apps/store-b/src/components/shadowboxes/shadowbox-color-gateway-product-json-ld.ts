/** Product JSON-LD — origina-store-b/client/src/pages/shadowboxes/*ShadowboxFrames.tsx */

import type { AlternateImage } from "@framecraft/types";
import type { FrameStyle } from "@framecraft/types";
import {
  getShadowboxColorHeroImage,
  resolveFramePhotoUrl,
  SHADOWBOX_COLOR_METADATA,
} from "@framecraft/core";

import type { ShadowboxGatewayColorName } from "./shadowbox-color-gateway-keys";

import {
  SHADOWBOX_GATEWAY_PRODUCT_RATING_VALUE,
  SHADOWBOX_GATEWAY_PRODUCT_REVIEW_COUNT,
} from "./shadowbox-color-gateway-seo";

function getCornerSource(frame: FrameStyle): AlternateImage | { url: string; alt: string } {
  const cornerImage = frame.alternateImages?.find((img) => img.type === "corner");
  return (
    cornerImage || {
      url: frame.thumbnail || "",
      alt: `${frame.name} shadowbox corner detail`,
    }
  );
}

function mpnSuffix(colorName: ShadowboxGatewayColorName): string {
  const map: Record<ShadowboxGatewayColorName, string> = {
    Black: "BLACK",
    White: "WHITE",
    Brown: "BROWN",
    Silver: "SILVER",
    Gold: "GOLD",
    Blue: "BLUE",
    Natural: "NATURAL",
  };
  return map[colorName];
}

/** Natural product schema uses bespoke name + description fallback in Helmet variant */
function productDescriptionFallback(
  colorName: ShadowboxGatewayColorName,
  frame: FrameStyle
): string {
  if (frame.shortDescription) return frame.shortDescription;
  if (colorName === "White") {
    return `Gallery-style white shadowbox frame with ${frame.usableDepth}" depth for memorabilia display`;
  }
  if (colorName === "Brown") {
    return `Warm brown shadowbox frame with ${frame.usableDepth}" depth for vintage and rustic displays`;
  }
  if (colorName === "Silver") {
    return `Professional silver shadowbox frame with ${frame.usableDepth}" depth for memorabilia display`;
  }
  if (colorName === "Natural") {
    return `Organic natural wood shadowbox frame with ${frame.usableDepth}" depth for memorabilia display`;
  }
  if (colorName === "Blue") {
    return `Distinctive blue shadowbox frame with ${frame.usableDepth}" depth for memorabilia display`;
  }
  return `Professional ${colorName.toLowerCase()} shadowbox frame with ${frame.usableDepth}" depth for memorabilia display`;
}

function productLdName(colorName: ShadowboxGatewayColorName, featuredName: string): string {
  if (colorName === "Natural") {
    return `${featuredName} - Natural Wood Shadowbox Frame`;
  }
  return `${featuredName} - ${colorName} Shadowbox Frame`;
}

export function buildShadowboxColorGatewayProductJsonLd(
  colorName: ShadowboxGatewayColorName,
  allFrames: FrameStyle[]
): Record<string, unknown> | null {
  const colorMeta = SHADOWBOX_COLOR_METADATA[colorName];
  if (!colorMeta) return null;
  const slug = colorMeta.slug;

  const searchColor = colorName === "Blue" ? "barn blue" : colorName.toLowerCase();

  const shadowboxFrames = allFrames.filter(
    (f) => f.category === "shadowbox" && f.colorName?.toLowerCase() === searchColor
  );

  if (shadowboxFrames.length === 0) return null;

  const featuredFrame = shadowboxFrames.reduce((prev, current) =>
    current.pricePerInch > prev.pricePerInch ? current : prev
  );

  const heroImage = getShadowboxColorHeroImage(colorName, allFrames as FrameStyle[]);

  const corner = getCornerSource(featuredFrame);
  const cornerUrlResolved = resolveFramePhotoUrl(corner.url);
  const lifestyleUrls =
    featuredFrame.alternateImages
      ?.filter((img) => img.type === "lifestyle")
      .slice(0, 2)
      .map((img) => resolveFramePhotoUrl(img.url)) ?? [];

  const offerUrl = `https://www.shadowboxframes.com/shadowboxes/colors/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productLdName(colorName, featuredFrame.name),
    description: productDescriptionFallback(colorName, featuredFrame),
    image: [heroImage.url, cornerUrlResolved, ...lifestyleUrls],
    sku: featuredFrame.id.toUpperCase(),
    mpn: `${featuredFrame.id.toUpperCase()}-${mpnSuffix(colorName)}`,
    url: `https://www.shadowboxframes.com/shadowbox?frame=${featuredFrame.id}`,
    category: "Shadowbox Frames",
    brand: {
      "@type": "Brand",
      name: "ShadowboxFrames",
    },
    offers: {
      "@type": "AggregateOffer",
      url: offerUrl,
      priceCurrency: "USD",
      lowPrice: Math.min(...shadowboxFrames.map((f) => f.pricePerInch)),
      highPrice: Math.max(...shadowboxFrames.map((f) => f.pricePerInch)),
      priceValidUntil: "2025-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "ShadowboxFrames",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SHADOWBOX_GATEWAY_PRODUCT_RATING_VALUE[colorName],
      reviewCount: SHADOWBOX_GATEWAY_PRODUCT_REVIEW_COUNT[colorName],
      bestRating: "5",
      worstRating: "1",
    },
  };
}
