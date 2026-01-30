"use client";

import { Card } from "../ui/card";
import {
  CARD_LAYOUTS,
  getLayoutsGroupedByCategory,
  getAvailableLayoutsForFormatGrouped,
  type CardLayoutType,
} from "@framecraft/core";
import { cn } from "../../utils";
import { Sparkles } from "lucide-react";

interface CardLayoutGalleryProps {
  selectedLayout: CardLayoutType;
  onLayoutChange: (layoutId: CardLayoutType) => void;
  formatId?: string;
  matBorder?: number;
  brassPlaqueEnabled?: boolean;
  className?: string;
  compact?: boolean;
}

function LayoutThumbnail({ layoutId }: { layoutId: CardLayoutType }) {
  const layout = CARD_LAYOUTS.find((l) => l.id === layoutId);
  if (!layout) return null;
  const { rows, columns } = layout;
  const svgWidth = 120;
  const svgHeight = 80;
  const padding = 8;
  const spacing = 4;
  const cardAspectRatio = 0.571;
  const availableWidth = svgWidth - padding * 2 - spacing * (columns - 1);
  const availableHeight = svgHeight - padding * 2 - spacing * (rows - 1);
  let cellWidth = availableWidth / columns;
  let cellHeight = cellWidth / cardAspectRatio;
  if (cellHeight > availableHeight / rows) {
    cellHeight = availableHeight / rows;
    cellWidth = cellHeight * cardAspectRatio;
  }
  const totalWidth = cellWidth * columns + spacing * (columns - 1);
  const totalHeight = cellHeight * rows + spacing * (rows - 1);
  const offsetX = padding + (availableWidth - totalWidth) / 2;
  const offsetY = padding + (availableHeight - totalHeight) / 2;
  const cards = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = offsetX + col * (cellWidth + spacing);
      const y = offsetY + row * (cellHeight + spacing);
      cards.push(
        <g key={`${row}-${col}`}>
          <rect
            x={x}
            y={y}
            width={cellWidth}
            height={cellHeight}
            className="fill-blue-50 dark:fill-blue-950 stroke-blue-400 dark:stroke-blue-600"
            strokeWidth={1.5}
            rx={1.5}
          />
          <rect
            x={x + 1}
            y={y + 1}
            width={cellWidth - 2}
            height={cellHeight * 0.2}
            className="fill-red-400/40 dark:fill-red-500/30"
            rx={0.5}
          />
        </g>
      );
    }
  }
  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="mx-auto"
    >
      {cards}
    </svg>
  );
}

function CompactLayoutIcon({ layoutId }: { layoutId: CardLayoutType }) {
  const layout = CARD_LAYOUTS.find((l) => l.id === layoutId);
  if (!layout) return null;
  const { rows, columns } = layout;
  const iconSize = 24;
  const padding = 2;
  const gap = 1.5;
  const cardAspectRatio = 0.571;
  const availableWidth = iconSize - padding * 2 - gap * (columns - 1);
  const availableHeight = iconSize - padding * 2 - gap * (rows - 1);
  let cellWidth = availableWidth / columns;
  let cellHeight = cellWidth / cardAspectRatio;
  if (cellHeight > availableHeight / rows) {
    cellHeight = availableHeight / rows;
    cellWidth = cellHeight * cardAspectRatio;
  }
  const totalWidth = cellWidth * columns + gap * (columns - 1);
  const totalHeight = cellHeight * rows + gap * (rows - 1);
  const offsetX = padding + (availableWidth - totalWidth) / 2;
  const offsetY = padding + (availableHeight - totalHeight) / 2;
  const rectangles = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = offsetX + col * (cellWidth + gap);
      const y = offsetY + row * (cellHeight + gap);
      rectangles.push(
        <rect
          key={`${row}-${col}`}
          x={x}
          y={y}
          width={cellWidth}
          height={cellHeight}
          className="fill-current"
          rx={0.5}
        />
      );
    }
  }
  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox={`0 0 ${iconSize} ${iconSize}`}
      className="text-muted-foreground"
    >
      {rectangles}
    </svg>
  );
}

function CollectorTipCard({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <Card
        className={cn(
          "p-3 flex items-center gap-3 col-span-2 relative overflow-hidden",
          "bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20",
          "border-amber-200/50 dark:border-amber-800/30"
        )}
        data-testid="card-collector-tip"
      >
        <div className="flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-7 w-7 text-amber-600 dark:text-amber-400" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-amber-900 dark:text-amber-100">
            Collector&apos;s Tip
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Framer&apos;s grade acrylic helps protect your cards from fading over time.
          </p>
        </div>
      </Card>
    );
  }
  return (
    <Card
      className={cn(
        "p-4 lg:p-5 flex items-center gap-4 lg:gap-6 relative overflow-hidden",
        "sm:col-span-2 lg:col-span-2 xl:col-span-3",
        "bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20",
        "border-amber-200/50 dark:border-amber-800/30",
        "min-h-[180px] sm:min-h-[180px] lg:min-h-0"
      )}
      data-testid="card-collector-tip"
    >
      <div className="flex items-center justify-center flex-shrink-0">
        <Sparkles
          className="h-14 w-14 lg:h-16 lg:w-16 text-amber-600 dark:text-amber-400"
          strokeWidth={1.5}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base lg:text-lg text-amber-900 dark:text-amber-100 mb-1">
          Collector&apos;s Tip
        </h3>
        <p className="text-sm lg:text-base text-muted-foreground">
          Framer&apos;s grade acrylic helps protect your graded cards from fading and yellowing over
          time.
        </p>
      </div>
    </Card>
  );
}

const CATEGORY_LABELS = {
  single: "Single Card",
  row: "Horizontal Rows",
  stack: "Vertical Stacks",
  grid: "Grids",
};

const CATEGORY_DESCRIPTIONS = {
  single: "Display one graded card",
  row: "Side-by-side panoramic layouts",
  stack: "Vertically stacked layouts",
  grid: "Multi-row, multi-column layouts",
};

export function CardLayoutGallery({
  selectedLayout,
  onLayoutChange,
  formatId = "psa",
  matBorder = 2.0,
  brassPlaqueEnabled = false,
  className,
  compact = false,
}: CardLayoutGalleryProps) {
  const groupedLayouts = formatId
    ? getAvailableLayoutsForFormatGrouped(formatId, matBorder, brassPlaqueEnabled)
    : getLayoutsGroupedByCategory();

  if (compact) {
    return (
      <div className={cn("space-y-6", className)}>
        {(["single", "row", "stack", "grid"] as const).map((category) => {
          const layouts = groupedLayouts[category];
          if (!layouts || layouts.length === 0) return null;
          return (
            <div key={category}>
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-foreground">
                  {CATEGORY_LABELS[category]}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {CATEGORY_DESCRIPTIONS[category]}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {layouts.map((layout) => {
                  const isSelected = selectedLayout === layout.id;
                  return (
                    <Card
                      key={layout.id}
                      className={cn(
                        "p-2 cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[70px]",
                        isSelected && "ring-2 ring-primary bg-primary/5"
                      )}
                      style={{ transition: "none", transform: "none", willChange: "auto" }}
                      onClick={() => onLayoutChange(layout.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onLayoutChange(layout.id);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-pressed={isSelected}
                      aria-label={layout.description}
                      data-testid={`button-select-layout-${layout.id}`}
                    >
                      <CompactLayoutIcon layoutId={layout.id} />
                      <span
                        className="text-xs font-medium text-center leading-tight"
                        aria-hidden="true"
                      >
                        {layout.displayName}
                      </span>
                    </Card>
                  );
                })}
                {category === "single" && <CollectorTipCard compact />}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6 lg:space-y-8", className)}>
      {(["single", "row", "stack", "grid"] as const).map((category) => {
        const layouts = groupedLayouts[category];
        if (!layouts || layouts.length === 0) return null;
        return (
          <div key={category}>
            <div className="mb-4">
              <h4 className="text-base font-semibold text-foreground">
                {CATEGORY_LABELS[category]}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {CATEGORY_DESCRIPTIONS[category]}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
              {layouts.map((layout) => {
                const isSelected = selectedLayout === layout.id;
                return (
                  <Card
                    key={layout.id}
                    className={cn(
                      "p-3 sm:p-3 lg:p-4 cursor-pointer min-h-[180px] sm:min-h-[180px] lg:min-h-0",
                      isSelected && "ring-2 ring-primary bg-primary/5"
                    )}
                    style={{ transition: "none", transform: "none", willChange: "auto" }}
                    onClick={() => onLayoutChange(layout.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onLayoutChange(layout.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSelected}
                    aria-label={layout.description}
                    data-testid={`button-select-layout-${layout.id}`}
                  >
                    <div className="mb-2 lg:mb-3" aria-hidden="true">
                      <LayoutThumbnail layoutId={layout.id} />
                    </div>
                    <h3 className="font-semibold text-sm text-center" aria-hidden="true">
                      {layout.displayName}
                    </h3>
                  </Card>
                );
              })}
              {category === "single" && <CollectorTipCard />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
