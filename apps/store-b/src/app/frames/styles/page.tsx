import type { Metadata } from "next";

import { PictureFramesGatewayIndex } from "@/components/picture-frame-gateway/picture-frames-gateway-index";
import { buildGatewayIndexMetadata } from "@/lib/picture-frames-gateway-data";

export const metadata: Metadata = buildGatewayIndexMetadata("styles");

export default function FramesStylesGatewayPage() {
  return <PictureFramesGatewayIndex kind="styles" />;
}
