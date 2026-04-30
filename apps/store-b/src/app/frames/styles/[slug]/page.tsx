import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PictureFramesGatewayDetailContent } from "@/components/picture-frame-gateway/picture-frames-gateway-detail-content";
import {
  buildGatewayDetailMetadata,
  findPictureFramesGatewayItem,
  loadPictureFramesGateway,
} from "@/lib/picture-frames-gateway-data";

type PageProps = { params: { slug: string } };

export function generateStaticParams(): Array<{ slug: string }> {
  return loadPictureFramesGateway("styles").items.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const item = findPictureFramesGatewayItem("styles", params.slug);
  if (!item) return {};
  return buildGatewayDetailMetadata("styles", item);
}

export default function FramesStylesDetailPage({ params }: PageProps) {
  const item = findPictureFramesGatewayItem("styles", params.slug);
  if (!item) notFound();

  return <PictureFramesGatewayDetailContent gatewayKind="styles" item={item} />;
}
