"use client";

import { formatPrice, getFrameStyleById, getMatColorById, getStoreBaseAssetUrl } from "@framecraft/core";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

import { cn } from "../../utils";
import { Button } from "../ui/button";

import { FrameConfigurationSummary } from "./FrameConfigurationSummary";

import type { CartItem } from "@framecraft/core/stores";

export interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  className?: string;
}

/**
 * Get product display name from frameStyleId
 */
function getProductDisplayName(frameStyleId?: string): string {
  if (!frameStyleId) return "Custom Product";
  
  const nameMap: Record<string, string> = {
    "foam-board": "Foam Board",
    "cleat-hanger": "Cleat Hangers",
    "acrylic": "Acrylic Sheet",
    "acrylic-cleaner": "Acrylic Cleaner",
    "security-hardware": "Security Hardware",
    "brass-nameplate": "Brass Nameplate",
    "mat-board": "Mat Board",
  };
  
  return nameMap[frameStyleId] || "Custom Frame";
}

/**
 * Single cart line: image, title, configuration summary, price, quantity, remove.
 */
export function CartItemCard({ item, onQuantityChange, onRemove, className }: CartItemCardProps) {
  const unitPriceCents = item.price;
  const lineTotalCents = unitPriceCents * item.quantity;

  const config = item.configuration;
  const frame = config ? getFrameStyleById(config.frameStyleId) : undefined;
  const topMat =
    config?.matColorId ? getMatColorById(config.matColorId) : undefined;

  const productDisplayName = config?.cardFormatId
    ? "Graded Card Frame"
    : config
      ? getProductDisplayName(config.frameStyleId)
      : "Custom Product";

  const cardLifestyleImage = frame?.alternateImages?.find((img) => img.type === "card_lifestyle")?.url;
  // Graded card: prefer lifestyle hero over corner swatch (Finding #10)
  const frameCornerImage = frame
    ? frame.alternateImages?.find((img) => img.type === "corner")?.url ?? frame.thumbnail
    : null;
  const primaryFrameImage =
    config?.cardFormatId && cardLifestyleImage ? cardLifestyleImage : frameCornerImage;
  const frameSwatchUrl = primaryFrameImage ? getStoreBaseAssetUrl(primaryFrameImage) : null;
  const customerArtUrl = item.imageUrl ?? config?.imageUrl;
  const usePrintAndFrameArt =
    config?.serviceType === "print-and-frame" && customerArtUrl;

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm sm:flex-row sm:items-start",
        className
      )}
      data-testid={`cart-item-${item.id}`}
    >
      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-md bg-muted sm:h-28 sm:w-28">
        {usePrintAndFrameArt ? (
          <Image
            src={customerArtUrl as string}
            alt={`${frame?.name || "Custom frame"} with your artwork`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 112px, 112px"
            priority={false}
            unoptimized={customerArtUrl.startsWith("blob:") || customerArtUrl.startsWith("data:")}
          />
        ) : frameSwatchUrl ? (
          <img
            src={frameSwatchUrl}
            alt={`${frame?.name || "Frame"} corner swatch`}
            className="w-full h-full object-cover"
          />
        ) : item.imageUrl || config?.imageUrl ? (
          <Image
            src={(item.imageUrl ?? config?.imageUrl) as string}
            alt={`Custom ${frame?.name || "frame"} with ${topMat?.name || "mat"}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 112px, 112px"
            priority={false}
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 112 128'%3E%3Crect fill='%23e5e7eb' width='112' height='128'/%3E%3C/svg%3E"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-muted/80 p-2 text-center text-muted-foreground text-xs">
            <span className="font-medium">{productDisplayName}</span>
            <span>
              {config ? `${config.artworkWidth}" × ${config.artworkHeight}"` : "No preview"}
            </span>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <h3 className="font-medium leading-tight">{item.title}</h3>
        <p className="text-sm text-muted-foreground">{item.variantTitle}</p>
        {item.configuration && <FrameConfigurationSummary config={item.configuration} />}
      </div>

      <div className="flex flex-col items-end justify-between gap-2 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            aria-label="Decrease quantity"
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="min-w-[2rem] text-center text-sm font-medium" aria-live="polite">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            aria-label="Increase quantity"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold">{formatPrice(lineTotalCents / 100)}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            aria-label="Remove item"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
