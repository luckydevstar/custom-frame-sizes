/** Shared types for `/frames/colors`, `/frames/sizes`, `/frames/styles` gateways (GatewayPage.tsx). */

export type PictureFramesGatewayKind = "colors" | "sizes" | "styles";

export interface PictureFramesGatewayItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageId?: string;
  imageUrl?: string;
  featured?: boolean;
  popular?: boolean;
  hex?: string;
  material?: string;
  finish?: string;
  mouldingWidth?: string;
  range?: string;
  dimensions?: string[];
  useCases?: string[];
  note?: string;
  sku?: string;
}

export interface LoadedPictureFramesGateway {
  items: PictureFramesGatewayItem[];
  title: string;
  description: string;
}
