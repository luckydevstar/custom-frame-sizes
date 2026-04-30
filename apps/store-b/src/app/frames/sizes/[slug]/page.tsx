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
  return loadPictureFramesGateway("sizes").items.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const item = findPictureFramesGatewayItem("sizes", params.slug);
  if (!item) return {};
  return buildGatewayDetailMetadata("sizes", item);
}

export default function FramesSizesDetailPage({ params }: PageProps) {
  const item = findPictureFramesGatewayItem("sizes", params.slug);
  if (!item) notFound();

  return <PictureFramesGatewayDetailContent gatewayKind="sizes" item={item} />;
}
