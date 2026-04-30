import { loadPictureFramesGateway } from "@/lib/picture-frames-gateway-data";
import type { PictureFramesGatewayKind } from "@/lib/picture-frames-gateway.types";

import { PictureFramesGatewayIndexContent } from "./picture-frames-gateway-index-content";

export function PictureFramesGatewayIndex({ kind }: { kind: PictureFramesGatewayKind }) {
  const { items, title, description } = loadPictureFramesGateway(kind);
  return (
    <PictureFramesGatewayIndexContent
      gatewayKind={kind}
      items={items}
      title={title}
      description={description}
    />
  );
}
