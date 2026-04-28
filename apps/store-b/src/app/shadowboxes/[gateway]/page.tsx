import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { FrameStyle } from "@framecraft/types";
import { getFrameStyles, getShadowboxColorHeroImage, SHADOWBOX_COLOR_METADATA } from "@framecraft/core";

import { ShadowboxColorGatewayPageContent } from "@/components/shadowboxes/shadowbox-color-gateway-page-content";
import {
  SHADOWBOX_COLOR_GATEWAY_SEGMENTS,
  shadowboxGatewaySegmentToColorName,
} from "@/components/shadowboxes/shadowbox-color-gateway-keys";
import {
  SHADOWBOX_GATEWAY_SEO,
  shadowboxGatewayMetadata,
} from "@/components/shadowboxes/shadowbox-color-gateway-seo";

export function generateStaticParams() {
  return SHADOWBOX_COLOR_GATEWAY_SEGMENTS.map((gateway) => ({ gateway }));
}

export function generateMetadata(props: { params: { gateway: string } }): Metadata {
  const { gateway } = props.params;
  const colorName = shadowboxGatewaySegmentToColorName(gateway);
  if (!colorName) return {};

  const seo = SHADOWBOX_GATEWAY_SEO[colorName];
  const colorMeta = SHADOWBOX_COLOR_METADATA[colorName];
  if (!seo || !colorMeta) return {};

  const slug = colorMeta.slug;
  const frames = getFrameStyles() as FrameStyle[];
  const hero = getShadowboxColorHeroImage(colorName, frames);

  return shadowboxGatewayMetadata(seo, `/shadowboxes/${gateway}`, hero.url, slug);
}

export default function ShadowboxColorGatewayPage(props: { params: { gateway: string } }) {
  const { gateway } = props.params;
  const colorName = shadowboxGatewaySegmentToColorName(gateway);
  if (!colorName) notFound();

  return <ShadowboxColorGatewayPageContent colorName={colorName} />;
}
