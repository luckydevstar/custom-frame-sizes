"use client";

import { useMemo } from "react";
import { Card } from "../ui/card";
import { Ticket, Camera, Image } from "lucide-react";
import { cn } from "../../utils";
import {
  TICKET_STUB_LAYOUTS,
  TICKET_PHOTO_SIZES,
  TICKET_POSTER_SIZES,
  type TicketStubLayoutType,
  type TicketPhotoSizeId,
  type TicketPosterSizeId,
} from "@framecraft/core";

interface TicketStubLayoutGalleryProps {
  selectedLayout: TicketStubLayoutType;
  onLayoutChange: (layoutId: TicketStubLayoutType) => void;
  selectedPhotoSize?: TicketPhotoSizeId;
  onPhotoSizeChange?: (sizeId: TicketPhotoSizeId) => void;
  selectedPosterSize?: TicketPosterSizeId;
  onPosterSizeChange?: (sizeId: TicketPosterSizeId) => void;
  className?: string;
  compact?: boolean;
}

function getUniqueLayoutsByName() {
  const layoutsByName = new Map<string, (typeof TICKET_STUB_LAYOUTS)[0]>();
  for (const layout of TICKET_STUB_LAYOUTS) {
    const existing = layoutsByName.get(layout.name);
    if (!existing) {
      layoutsByName.set(layout.name, layout);
    } else if (layout.photoSize === "5x7" && existing.photoSize !== "5x7") {
      layoutsByName.set(layout.name, layout);
    } else if (layout.posterSize === "18x24" && existing.posterSize !== "18x24") {
      layoutsByName.set(layout.name, layout);
    }
  }
  return Array.from(layoutsByName.values());
}

export function getLayoutVariantsByName(name: string) {
  return TICKET_STUB_LAYOUTS.filter((l) => l.name === name);
}

function hasPhotoSizeVariants(name: string): boolean {
  const variants = getLayoutVariantsByName(name);
  return variants.length > 1 && variants.some((v) => v.photoSize !== undefined);
}

function hasPosterSizeVariants(name: string): boolean {
  const variants = getLayoutVariantsByName(name);
  return variants.length > 1 && variants.some((v) => v.posterSize !== undefined);
}

function isLayoutNameSelected(layoutName: string, selectedLayout: TicketStubLayoutType): boolean {
  const variants = getLayoutVariantsByName(layoutName);
  return variants.some((v) => v.id === selectedLayout);
}

function LayoutThumbnail({ layoutId }: { layoutId: TicketStubLayoutType }) {
  const layout = TICKET_STUB_LAYOUTS.find((l) => l.id === layoutId);
  if (!layout) return null;

  const svgWidth = 120;
  const svgHeight = 80;
  const padding = 8;
  const spacing = 2;

  const minX = Math.min(...layout.openings.map((o) => o.x));
  const maxX = Math.max(...layout.openings.map((o) => o.x + o.width));
  const minY = Math.min(...layout.openings.map((o) => o.y));
  const maxY = Math.max(...layout.openings.map((o) => o.y + o.height));
  const layoutWidth = maxX - minX;
  const layoutHeight = maxY - minY;
  const scaleX = (svgWidth - padding * 2) / layoutWidth;
  const scaleY = (svgHeight - padding * 2) / layoutHeight;
  const scale = Math.min(scaleX, scaleY);
  const offsetX = padding + (svgWidth - padding * 2 - layoutWidth * scale) / 2;
  const offsetY = padding + (svgHeight - padding * 2 - layoutHeight * scale) / 2;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="mx-auto"
    >
      {layout.openings.map((opening, index) => {
        const x = offsetX + (opening.x - minX) * scale;
        const y = offsetY + (opening.y - minY) * scale;
        const w = opening.width * scale - spacing;
        const h = opening.height * scale - spacing;
        let fillClass = "fill-blue-50 dark:fill-blue-950";
        let strokeClass = "stroke-blue-400 dark:stroke-blue-600";
        let Icon = Ticket;
        if (opening.type === "photo") {
          fillClass = "fill-purple-50 dark:fill-purple-950";
          strokeClass = "stroke-purple-400 dark:stroke-purple-600";
          Icon = Camera;
        } else if (opening.type === "poster") {
          fillClass = "fill-amber-50 dark:fill-amber-950";
          strokeClass = "stroke-amber-400 dark:stroke-amber-600";
          Icon = Image;
        }
        return (
          <g key={`${layoutId}-${index}`}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              className={cn("stroke-2", fillClass, strokeClass)}
              rx="1.5"
            />
            <foreignObject x={x + w / 2 - 6} y={y + h / 2 - 6} width="12" height="12">
              <Icon
                className={cn(
                  "w-3 h-3",
                  opening.type === "photo"
                    ? "text-purple-600 dark:text-purple-400"
                    : opening.type === "poster"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-blue-600 dark:text-blue-400"
                )}
              />
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
}

export function TicketStubLayoutGallery({
  selectedLayout,
  onLayoutChange,
  selectedPhotoSize,
  onPhotoSizeChange,
  selectedPosterSize,
  onPosterSizeChange,
  className,
  compact = false,
}: TicketStubLayoutGalleryProps) {
  const uniqueLayouts = useMemo(() => getUniqueLayoutsByName(), []);

  const handleLayoutClick = (layout: (typeof TICKET_STUB_LAYOUTS)[0]) => {
    const variants = getLayoutVariantsByName(layout.name);
    if (variants.length === 1) {
      onLayoutChange(variants[0]!.id);
    } else {
      const alreadyInFamily = variants.some((v) => v.id === selectedLayout);
      if (!alreadyInFamily) {
        let defaultVariant = variants[0]!;
        if (hasPhotoSizeVariants(layout.name)) {
          defaultVariant = variants.find((v) => v.photoSize === "5x7") || variants[0]!;
          if (onPhotoSizeChange && defaultVariant.photoSize)
            onPhotoSizeChange(defaultVariant.photoSize);
        } else if (hasPosterSizeVariants(layout.name)) {
          defaultVariant = variants.find((v) => v.posterSize === "18x24") || variants[0]!;
          if (onPosterSizeChange && defaultVariant.posterSize)
            onPosterSizeChange(defaultVariant.posterSize);
        }
        onLayoutChange(defaultVariant.id);
      }
    }
  };

  const handlePhotoSizePillClick = (
    e: React.MouseEvent,
    sizeId: TicketPhotoSizeId,
    layoutId: TicketStubLayoutType
  ) => {
    e.stopPropagation();
    onLayoutChange(layoutId);
    onPhotoSizeChange?.(sizeId);
  };

  const handlePosterSizePillClick = (
    e: React.MouseEvent,
    sizeId: TicketPosterSizeId,
    layoutId: TicketStubLayoutType
  ) => {
    e.stopPropagation();
    onLayoutChange(layoutId);
    onPosterSizeChange?.(sizeId);
  };

  if (compact) {
    return (
      <div className={cn("grid grid-cols-2 gap-2", className)}>
        {uniqueLayouts.map((layout) => {
          const isSelected = isLayoutNameSelected(layout.name, selectedLayout);
          const variants = getLayoutVariantsByName(layout.name);
          const layoutHasPhotoVariants = hasPhotoSizeVariants(layout.name);
          const layoutHasPosterVariants = hasPosterSizeVariants(layout.name);
          const hasVariants = layoutHasPhotoVariants || layoutHasPosterVariants;
          const selectedVariant = variants.find((v) => v.id === selectedLayout);
          const displayLayout = selectedVariant || layout;
          return (
            <Card
              key={layout.id}
              className={cn(
                "p-2 cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[140px]",
                isSelected && "ring-2 ring-primary bg-primary/5"
              )}
              onClick={() => handleLayoutClick(layout)}
              data-testid={`button-select-layout-${layout.id}`}
            >
              <LayoutThumbnail layoutId={displayLayout.id} />
              <div className="text-center w-full">
                <div className="text-xs font-semibold">{layout.name}</div>
                <p className="text-[10px] text-muted-foreground line-clamp-1 px-1">
                  {layout.description}
                </p>
                {layoutHasPhotoVariants && (
                  <div className="flex flex-wrap justify-center gap-1 mt-1.5 px-1">
                    {(Object.keys(TICKET_PHOTO_SIZES) as TicketPhotoSizeId[]).map((sizeId) => {
                      const size = TICKET_PHOTO_SIZES[sizeId];
                      const variant = variants.find((v) => v.photoSize === sizeId);
                      if (!variant) return null;
                      const isThisSizeSelected = isSelected && selectedPhotoSize === sizeId;
                      return (
                        <button
                          key={sizeId}
                          type="button"
                          onClick={(e) => handlePhotoSizePillClick(e, sizeId, variant.id)}
                          className={cn(
                            "px-1.5 py-0.5 text-[10px] rounded border transition-colors",
                            isThisSizeSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted/50 border-border"
                          )}
                          data-testid={`button-size-mobile-${sizeId}`}
                        >
                          {size.displayName}
                        </button>
                      );
                    })}
                  </div>
                )}
                {layoutHasPosterVariants && (
                  <div className="flex flex-wrap justify-center gap-1 mt-1.5 px-1">
                    {(Object.keys(TICKET_POSTER_SIZES) as TicketPosterSizeId[]).map((sizeId) => {
                      const size = TICKET_POSTER_SIZES[sizeId];
                      const variant = variants.find((v) => v.posterSize === sizeId);
                      if (!variant) return null;
                      const isThisSizeSelected = isSelected && selectedPosterSize === sizeId;
                      return (
                        <button
                          key={sizeId}
                          type="button"
                          onClick={(e) => handlePosterSizePillClick(e, sizeId, variant.id)}
                          className={cn(
                            "px-1.5 py-0.5 text-[10px] rounded border transition-colors",
                            isThisSizeSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted/50 border-border"
                          )}
                          data-testid={`button-poster-size-mobile-${sizeId}`}
                        >
                          {size.displayName}
                        </button>
                      );
                    })}
                  </div>
                )}
                {!hasVariants && (
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {layout.frameWidth}&quot; × {layout.frameHeight}&quot;
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {uniqueLayouts.map((layout) => {
        const isSelected = isLayoutNameSelected(layout.name, selectedLayout);
        const variants = getLayoutVariantsByName(layout.name);
        const layoutHasPhotoVariants = hasPhotoSizeVariants(layout.name);
        const layoutHasPosterVariants = hasPosterSizeVariants(layout.name);
        const hasVariants = layoutHasPhotoVariants || layoutHasPosterVariants;
        const selectedVariant = variants.find((v) => v.id === selectedLayout);
        const displayLayout = selectedVariant || layout;
        return (
          <Card
            key={layout.id}
            className={cn(
              "p-4 cursor-pointer hover-elevate active-elevate-2",
              isSelected && "ring-2 ring-primary bg-primary/5"
            )}
            onClick={() => handleLayoutClick(layout)}
            data-testid={`button-select-layout-${layout.id}`}
          >
            <LayoutThumbnail layoutId={displayLayout.id} />
            <div className="mt-3 space-y-1.5">
              <h4 className="font-semibold text-sm leading-tight">{layout.name}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{layout.description}</p>
              {layoutHasPhotoVariants && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(Object.keys(TICKET_PHOTO_SIZES) as TicketPhotoSizeId[]).map((sizeId) => {
                    const size = TICKET_PHOTO_SIZES[sizeId];
                    const variant = variants.find((v) => v.photoSize === sizeId);
                    if (!variant) return null;
                    const isThisSizeSelected = isSelected && selectedPhotoSize === sizeId;
                    return (
                      <button
                        key={sizeId}
                        type="button"
                        onClick={(e) => handlePhotoSizePillClick(e, sizeId, variant.id)}
                        className={cn(
                          "px-2 py-1 text-xs rounded-md border transition-colors",
                          isThisSizeSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/50 border-border hover:bg-muted"
                        )}
                        data-testid={`button-size-${sizeId}`}
                      >
                        {size.displayName}
                      </button>
                    );
                  })}
                </div>
              )}
              {layoutHasPosterVariants && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(Object.keys(TICKET_POSTER_SIZES) as TicketPosterSizeId[]).map((sizeId) => {
                    const size = TICKET_POSTER_SIZES[sizeId];
                    const variant = variants.find((v) => v.posterSize === sizeId);
                    if (!variant) return null;
                    const isThisSizeSelected = isSelected && selectedPosterSize === sizeId;
                    return (
                      <button
                        key={sizeId}
                        type="button"
                        onClick={(e) => handlePosterSizePillClick(e, sizeId, variant.id)}
                        className={cn(
                          "px-2 py-1 text-xs rounded-md border transition-colors",
                          isThisSizeSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/50 border-border hover:bg-muted"
                        )}
                        data-testid={`button-poster-size-${sizeId}`}
                      >
                        {size.displayName}
                      </button>
                    );
                  })}
                </div>
              )}
              {!hasVariants && (
                <div className="text-xs text-muted-foreground">
                  {layout.frameWidth}&quot; × {layout.frameHeight}&quot;
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
