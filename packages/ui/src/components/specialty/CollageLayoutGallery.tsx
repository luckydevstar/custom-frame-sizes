/**
 * Collage Layout Gallery Component
 *
 * Visual gallery of photo collage layout options with size-based filtering.
 * Users can filter by photo size (4×6, 5×7, 8×10, Square) using multi-select toggle buttons.
 *
 * Supports Layout Families: Groups of related layouts that differ only by photo size
 * are shown as a single card with size variant pills (e.g., "Two Portrait Photos"
 * available in 4×6, 5×7, 8×10, 11×14).
 */

"use client";

import { useState, useMemo } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  COLLAGE_LAYOUTS,
  getSizeFilterOptions,
  getFilterIdsFromDisplayIds,
  getStandaloneLayouts,
  LAYOUT_FAMILIES,
  type CollageLayoutType,
  type DisplaySizeId,
  type OpeningShape,
  type LayoutFamily,
  type LayoutFamilyId,
  type VariantSizeId,
  type CollageLayout,
} from "@framecraft/core";
import { cn } from "../../utils";
import { Heart, Circle, Square, Hexagon, PawPrint, X } from "lucide-react";

interface CollageLayoutGalleryProps {
  selectedLayout: CollageLayoutType;
  onLayoutChange: (layoutId: CollageLayoutType) => void;
  className?: string;
  compact?: boolean;
}

function getShapeIcon(shape: OpeningShape) {
  switch (shape) {
    case "circle":
      return Circle;
    case "oval":
      return Circle;
    case "heart":
      return Heart;
    case "paw":
      return PawPrint;
    case "hexagon":
      return Hexagon;
    case "rectangle":
    default:
      return Square;
  }
}

function LayoutThumbnail({ layoutId }: { layoutId: CollageLayoutType }) {
  const layout = COLLAGE_LAYOUTS.find((l) => l.id === layoutId);
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

        if (opening.shape === "circle") {
          fillClass = "fill-purple-50 dark:fill-purple-950";
          strokeClass = "stroke-purple-400 dark:stroke-purple-600";
        } else if (opening.shape === "oval") {
          fillClass = "fill-teal-50 dark:fill-teal-950";
          strokeClass = "stroke-teal-400 dark:stroke-teal-600";
        } else if (opening.shape === "heart") {
          fillClass = "fill-rose-50 dark:fill-rose-950";
          strokeClass = "stroke-rose-400 dark:stroke-rose-600";
        } else if (opening.shape === "paw") {
          fillClass = "fill-amber-50 dark:fill-amber-950";
          strokeClass = "stroke-amber-400 dark:stroke-amber-600";
        } else if (opening.shape === "hexagon") {
          fillClass = "fill-yellow-50 dark:fill-yellow-950";
          strokeClass = "stroke-yellow-400 dark:stroke-yellow-600";
        }

        if (opening.shape === "circle") {
          const r = Math.min(w, h) / 2;
          const cx = x + w / 2;
          const cy = y + h / 2;
          return (
            <circle
              key={`${layoutId}-${index}`}
              cx={cx}
              cy={cy}
              r={r}
              className={cn("stroke-2", fillClass, strokeClass)}
            />
          );
        }

        if (opening.shape === "oval") {
          const rx = w / 2;
          const ry = h / 2;
          const cx = x + w / 2;
          const cy = y + h / 2;
          return (
            <ellipse
              key={`${layoutId}-${index}`}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              className={cn("stroke-2", fillClass, strokeClass)}
            />
          );
        }

        if (opening.shape === "heart") {
          const heartScale = Math.min(w, h) / 24;
          const heartX = x + w / 2;
          const heartY = y + h / 2;
          const d = `M ${heartX} ${heartY + 8 * heartScale} 
                     C ${heartX - 12 * heartScale} ${heartY - 4 * heartScale} 
                       ${heartX - 12 * heartScale} ${heartY - 8 * heartScale} 
                       ${heartX} ${heartY - 3 * heartScale} 
                     C ${heartX + 12 * heartScale} ${heartY - 8 * heartScale} 
                       ${heartX + 12 * heartScale} ${heartY - 4 * heartScale} 
                       ${heartX} ${heartY + 8 * heartScale} Z`;
          return (
            <path
              key={`${layoutId}-${index}`}
              d={d}
              className={cn("stroke-2", fillClass, strokeClass)}
            />
          );
        }

        if (opening.shape === "hexagon") {
          const size = Math.min(w, h) / 2;
          const cx = x + w / 2;
          const cy = y + h / 2;
          const points = Array.from({ length: 6 }, (_, i) => {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            return `${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`;
          }).join(" ");
          return (
            <polygon
              key={`${layoutId}-${index}`}
              points={points}
              className={cn("stroke-2", fillClass, strokeClass)}
            />
          );
        }

        if (opening.shape === "paw") {
          const pawScale = Math.min(w, h) / 24;
          const pawX = x + w / 2;
          const pawY = y + h / 2;
          return (
            <g key={`${layoutId}-${index}`}>
              <ellipse
                cx={pawX}
                cy={pawY + 2 * pawScale}
                rx={5 * pawScale}
                ry={4 * pawScale}
                className={cn("stroke-2", fillClass, strokeClass)}
              />
              <circle
                cx={pawX - 5 * pawScale}
                cy={pawY - 4 * pawScale}
                r={2.5 * pawScale}
                className={cn("stroke-2", fillClass, strokeClass)}
              />
              <circle
                cx={pawX - 2 * pawScale}
                cy={pawY - 6 * pawScale}
                r={2.5 * pawScale}
                className={cn("stroke-2", fillClass, strokeClass)}
              />
              <circle
                cx={pawX + 2 * pawScale}
                cy={pawY - 6 * pawScale}
                r={2.5 * pawScale}
                className={cn("stroke-2", fillClass, strokeClass)}
              />
              <circle
                cx={pawX + 5 * pawScale}
                cy={pawY - 4 * pawScale}
                r={2.5 * pawScale}
                className={cn("stroke-2", fillClass, strokeClass)}
              />
            </g>
          );
        }

        return (
          <rect
            key={`${layoutId}-${index}`}
            x={x}
            y={y}
            width={w}
            height={h}
            className={cn("stroke-2", fillClass, strokeClass)}
            rx="1.5"
          />
        );
      })}
    </svg>
  );
}

function getUniqueShapes(layoutId: CollageLayoutType): OpeningShape[] {
  const layout = COLLAGE_LAYOUTS.find((l) => l.id === layoutId);
  if (!layout) return [];
  const shapes = new Set(layout.openings.map((o) => o.shape));
  return Array.from(shapes);
}

interface SizeFilterButtonsProps {
  selectedSizes: DisplaySizeId[];
  onToggleSize: (sizeId: DisplaySizeId) => void;
  onClearFilters: () => void;
  compact?: boolean;
}

function SizeFilterButtons({
  selectedSizes,
  onToggleSize,
  onClearFilters,
  compact = false,
}: SizeFilterButtonsProps) {
  const sizeOptions = getSizeFilterOptions();
  const hasFilters = selectedSizes.length > 0;

  const rectangularSizes = sizeOptions.filter((o) => !o.isSquare);
  const squareSizes = sizeOptions.filter((o) => o.isSquare);

  const SizeButton = ({
    displayId,
    displayName,
    isSquare: _isSquare,
  }: {
    displayId: DisplaySizeId;
    displayName: string;
    isSquare: boolean;
  }) => {
    const isSelected = selectedSizes.includes(displayId);

    return (
      <button
        onClick={() => onToggleSize(displayId)}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-150",
          "border shadow-sm",
          compact ? "px-2.5 py-1.5 min-w-[42px]" : "px-3.5 py-2 min-w-[52px]",
          isSelected
            ? "bg-primary text-primary-foreground border-primary shadow-md"
            : "bg-background text-foreground border-border hover:bg-muted hover:border-muted-foreground/30"
        )}
        data-testid={`filter-size-${displayId}`}
      >
        {displayName}
      </button>
    );
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <div className="flex items-center gap-1.5">
          {rectangularSizes.map((opt) => (
            <SizeButton key={opt.displayId} {...opt} />
          ))}
        </div>
        <div className="w-px h-5 bg-border" />
        <div className="flex items-center gap-1.5">
          {squareSizes.map((opt) => (
            <SizeButton key={opt.displayId} {...opt} />
          ))}
        </div>
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            data-testid="filter-clear"
            title="Clear filters"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        {rectangularSizes.map((opt) => (
          <SizeButton key={opt.displayId} {...opt} />
        ))}
      </div>

      <div className="w-px h-6 bg-border" />

      <div className="flex items-center gap-2">
        {squareSizes.map((opt) => (
          <SizeButton key={opt.displayId} {...opt} />
        ))}
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="gap-1.5 text-muted-foreground ml-1"
          data-testid="filter-clear"
        >
          <X className="w-4 h-4" />
          <span>Clear</span>
        </Button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FAMILY LAYOUT CARD - Shows one card with size variant pills
// ═══════════════════════════════════════════════════════════════════════════

interface FamilyLayoutCardProps {
  family: LayoutFamily;
  selectedLayoutId: CollageLayoutType;
  selectedVariantSize: VariantSizeId;
  onSelectVariant: (
    familyId: LayoutFamilyId,
    sizeId: VariantSizeId,
    layoutId: CollageLayoutType
  ) => void;
  compact?: boolean;
}

function FamilyLayoutCard({
  family,
  selectedLayoutId,
  selectedVariantSize,
  onSelectVariant,
  compact = false,
}: FamilyLayoutCardProps) {
  const currentVariant =
    family.variants.find((v) => v.sizeId === selectedVariantSize) ?? family.variants[0];
  const currentLayout = currentVariant
    ? COLLAGE_LAYOUTS.find((l) => l.id === currentVariant.layoutId)
    : undefined;
  if (!currentVariant || !currentLayout) return null;

  const isAnyVariantSelected = family.variants.some((v) => v.layoutId === selectedLayoutId);

  const handleCardClick = () => {
    onSelectVariant(family.familyId, selectedVariantSize, currentVariant.layoutId);
  };

  const handleSizePillClick = (
    e: React.MouseEvent,
    sizeId: VariantSizeId,
    layoutId: CollageLayoutType
  ) => {
    e.stopPropagation();
    onSelectVariant(family.familyId, sizeId, layoutId);
  };

  if (compact) {
    return (
      <Card
        className={cn(
          "p-2 cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[140px]",
          isAnyVariantSelected && "ring-2 ring-primary bg-primary/5"
        )}
        onClick={handleCardClick}
        data-testid={`button-select-family-${family.familyId}`}
      >
        <LayoutThumbnail layoutId={currentVariant.layoutId} />
        <div className="text-center w-full">
          <div className="text-xs font-semibold">{family.name}</div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Badge variant="secondary" className="text-[10px] px-1 py-0">
              {currentLayout.openingCount} photos
            </Badge>
          </div>
          <div className="flex items-center justify-center gap-1 mt-1.5 flex-wrap">
            {family.variants.map((variant) => (
              <button
                key={variant.sizeId}
                onClick={(e) => handleSizePillClick(e, variant.sizeId, variant.layoutId)}
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-sm transition-all",
                  variant.sizeId === selectedVariantSize
                    ? "bg-primary text-primary-foreground font-medium"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
                data-testid={`button-variant-${family.familyId}-${variant.sizeId}`}
              >
                {variant.displayName}
              </button>
            ))}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">
            {currentLayout.frameWidth}&quot; × {currentLayout.frameHeight}&quot;
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer hover-elevate active-elevate-2",
        isAnyVariantSelected && "ring-2 ring-primary bg-primary/5"
      )}
      onClick={handleCardClick}
      data-testid={`button-select-family-${family.familyId}`}
    >
      <LayoutThumbnail layoutId={currentVariant.layoutId} />
      <div className="mt-3 space-y-1.5">
        <h4 className="font-semibold text-sm leading-tight">{family.name}</h4>
        <p className="text-xs text-muted-foreground line-clamp-1">{family.description}</p>

        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {family.variants.map((variant) => {
            const variantLayout = COLLAGE_LAYOUTS.find((l) => l.id === variant.layoutId);
            return (
              <button
                key={variant.sizeId}
                onClick={(e) => handleSizePillClick(e, variant.sizeId, variant.layoutId)}
                className={cn(
                  "text-xs px-2 py-1 rounded-md transition-all border",
                  variant.sizeId === selectedVariantSize
                    ? "bg-primary text-primary-foreground border-primary font-medium shadow-sm"
                    : "bg-background text-foreground border-border hover:bg-muted hover:border-muted-foreground/30"
                )}
                title={
                  variantLayout
                    ? `${variantLayout.frameWidth}&quot; × ${variantLayout.frameHeight}&quot;`
                    : ""
                }
                data-testid={`button-variant-${family.familyId}-${variant.sizeId}`}
              >
                {variant.displayName}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 flex-wrap pt-0.5">
          <Badge variant="secondary" className="text-xs">
            {currentLayout.openingCount} {currentLayout.openingCount === 1 ? "photo" : "photos"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {currentLayout.frameWidth}&quot; × {currentLayout.frameHeight}&quot;
          </span>
        </div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STANDALONE LAYOUT CARD - Regular layout card (not part of a family)
// ═══════════════════════════════════════════════════════════════════════════

interface StandaloneLayoutCardProps {
  layout: CollageLayout;
  isSelected: boolean;
  onSelect: () => void;
  compact?: boolean;
}

function StandaloneLayoutCard({
  layout,
  isSelected,
  onSelect,
  compact = false,
}: StandaloneLayoutCardProps) {
  const shapes = getUniqueShapes(layout.id);

  if (compact) {
    return (
      <Card
        className={cn(
          "p-2 cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[120px]",
          isSelected && "ring-2 ring-primary bg-primary/5"
        )}
        onClick={onSelect}
        data-testid={`button-select-layout-${layout.id}`}
      >
        <LayoutThumbnail layoutId={layout.id} />
        <div className="text-center">
          <div className="text-xs font-semibold">{layout.name}</div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Badge variant="secondary" className="text-[10px] px-1 py-0">
              {layout.openingCount} photos
            </Badge>
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {layout.photoSizeLabel || `${layout.frameWidth}" × ${layout.frameHeight}"`}
          </div>
          {shapes.length > 0 && shapes.some((s) => s !== "rectangle") && (
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {shapes.map((shape, idx) => {
                const ShapeIcon = getShapeIcon(shape);
                return <ShapeIcon key={idx} className="w-3 h-3 text-muted-foreground" />;
              })}
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer hover-elevate active-elevate-2",
        isSelected && "ring-2 ring-primary bg-primary/5"
      )}
      onClick={onSelect}
      data-testid={`button-select-layout-${layout.id}`}
    >
      <LayoutThumbnail layoutId={layout.id} />
      <div className="mt-3 space-y-1.5">
        <h4 className="font-semibold text-sm leading-tight">{layout.name}</h4>
        <p className="text-xs text-muted-foreground line-clamp-1">{layout.description}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {layout.openingCount} {layout.openingCount === 1 ? "photo" : "photos"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {layout.photoSizeLabel || `${layout.frameWidth}" × ${layout.frameHeight}"`}
          </span>
        </div>
        {shapes.length > 0 && shapes.some((s) => s !== "rectangle") && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Shapes:</span>
            {shapes.map((shape, idx) => {
              const ShapeIcon = getShapeIcon(shape);
              return (
                <ShapeIcon
                  key={idx}
                  className={cn(
                    "w-4 h-4",
                    shape === "heart"
                      ? "text-rose-500"
                      : shape === "circle"
                        ? "text-purple-500"
                        : shape === "oval"
                          ? "text-teal-500"
                          : "text-blue-500"
                  )}
                />
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN GALLERY COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function CollageLayoutGallery({
  selectedLayout,
  onLayoutChange,
  className,
  compact = false,
}: CollageLayoutGalleryProps) {
  const [selectedDisplaySizes, setSelectedDisplaySizes] = useState<DisplaySizeId[]>([]);

  // Track selected size per family (defaults to hero size)
  const [familySelectedSizes, setFamilySelectedSizes] = useState<
    Record<LayoutFamilyId, VariantSizeId>
  >(() => {
    const initial: Record<LayoutFamilyId, VariantSizeId> = {} as Record<
      LayoutFamilyId,
      VariantSizeId
    >;
    LAYOUT_FAMILIES.forEach((family) => {
      initial[family.familyId] = family.heroSizeId;
    });
    return initial;
  });

  // Get standalone layouts (not part of any family)
  const standaloneLayouts = useMemo(() => getStandaloneLayouts(), []);

  // Filter layouts based on selected sizes
  const filteredStandaloneLayouts = useMemo(() => {
    if (selectedDisplaySizes.length === 0) {
      return standaloneLayouts;
    }
    const filterIds = getFilterIdsFromDisplayIds(selectedDisplaySizes);
    return standaloneLayouts.filter((layout) =>
      filterIds.some((size) => layout.supportedSizes.includes(size))
    );
  }, [standaloneLayouts, selectedDisplaySizes]);

  // Filter families - show if ANY variant matches the filter
  const filteredFamilies = useMemo(() => {
    if (selectedDisplaySizes.length === 0) {
      return LAYOUT_FAMILIES;
    }
    const filterIds = getFilterIdsFromDisplayIds(selectedDisplaySizes);
    return LAYOUT_FAMILIES.filter((family) =>
      family.variants.some((variant) => {
        const layout = COLLAGE_LAYOUTS.find((l) => l.id === variant.layoutId);
        return layout && filterIds.some((size) => layout.supportedSizes.includes(size));
      })
    );
  }, [selectedDisplaySizes]);

  // Auto-select matching size on families when global filter changes
  useMemo(() => {
    if (selectedDisplaySizes.length === 1) {
      const displayId = selectedDisplaySizes[0];
      if (displayId === undefined) return;
      const variantSize = displayIdToVariantSize(displayId);
      if (variantSize) {
        setFamilySelectedSizes((prev) => {
          const updated = { ...prev };
          LAYOUT_FAMILIES.forEach((family) => {
            if (family.variants.some((v) => v.sizeId === variantSize)) {
              updated[family.familyId] = variantSize;
            }
          });
          return updated;
        });
      }
    }
  }, [selectedDisplaySizes]);

  const handleToggleSize = (displayId: DisplaySizeId) => {
    setSelectedDisplaySizes((prev) =>
      prev.includes(displayId) ? prev.filter((s) => s !== displayId) : [...prev, displayId]
    );
  };

  const handleClearFilters = () => {
    setSelectedDisplaySizes([]);
  };

  const handleSelectFamilyVariant = (
    familyId: LayoutFamilyId,
    sizeId: VariantSizeId,
    layoutId: CollageLayoutType
  ) => {
    setFamilySelectedSizes((prev) => ({ ...prev, [familyId]: sizeId }));
    onLayoutChange(layoutId);
  };

  const totalCount = filteredFamilies.length + filteredStandaloneLayouts.length;

  if (compact) {
    return (
      <div className={cn("space-y-2", className)}>
        <SizeFilterButtons
          selectedSizes={selectedDisplaySizes}
          onToggleSize={handleToggleSize}
          onClearFilters={handleClearFilters}
          compact={true}
        />

        {totalCount === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              No layouts match your selected sizes.
            </p>
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              Show All Layouts
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filteredFamilies.map((family) => (
              <FamilyLayoutCard
                key={family.familyId}
                family={family}
                selectedLayoutId={selectedLayout}
                selectedVariantSize={familySelectedSizes[family.familyId]}
                onSelectVariant={handleSelectFamilyVariant}
                compact={true}
              />
            ))}
            {filteredStandaloneLayouts.map((layout) => (
              <StandaloneLayoutCard
                key={layout.id}
                layout={layout}
                isSelected={selectedLayout === layout.id}
                onSelect={() => onLayoutChange(layout.id)}
                compact={true}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-4 space-y-2">
        <SizeFilterButtons
          selectedSizes={selectedDisplaySizes}
          onToggleSize={handleToggleSize}
          onClearFilters={handleClearFilters}
        />

        <p className="text-sm text-muted-foreground">
          {selectedDisplaySizes.length === 0
            ? `Showing all ${totalCount} layouts. Select photo sizes above to filter.`
            : `Showing ${totalCount} layouts compatible with selected sizes.`}
        </p>
      </div>

      {totalCount === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No layouts match your selected photo sizes.</p>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters & Show All
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFamilies.map((family) => (
            <FamilyLayoutCard
              key={family.familyId}
              family={family}
              selectedLayoutId={selectedLayout}
              selectedVariantSize={familySelectedSizes[family.familyId]}
              onSelectVariant={handleSelectFamilyVariant}
            />
          ))}
          {filteredStandaloneLayouts.map((layout) => (
            <StandaloneLayoutCard
              key={layout.id}
              layout={layout}
              isSelected={selectedLayout === layout.id}
              onSelect={() => onLayoutChange(layout.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Maps display size ID to variant size ID for family auto-selection
 */
function displayIdToVariantSize(displayId: DisplaySizeId): VariantSizeId | null {
  const mapping: Record<DisplaySizeId, VariantSizeId | null> = {
    "4x6": "4x6",
    "5x7": "5x7",
    "8x10": "8x10",
    "11x14": "11x14",
    "16x20": "16x20",
    "4x4": null,
    "5x5": null,
    "8x8": null,
  };
  return mapping[displayId] ?? null;
}
