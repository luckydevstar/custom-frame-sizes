import type { Metadata } from "next";

import { PictureFramesGatewayIndex } from "@/components/picture-frame-gateway/picture-frames-gateway-index";
import { buildGatewayIndexMetadata } from "@/lib/picture-frames-gateway-data";

export const metadata: Metadata = buildGatewayIndexMetadata("colors");

export default function FramesColorsGatewayPage() {
  return <PictureFramesGatewayIndex kind="colors" />;
}
