"use client";

import { Card } from "../ui/card";
import { MAGAZINE_LAYOUTS, type MagazineLayoutType } from "@framecraft/core";
import { cn } from "../../utils";

interface MagazineLayoutGalleryProps {
  selectedLayout: MagazineLayoutType;
  onLayoutChange: (layoutId: MagazineLayoutType) => void;
  className?: string;
  compact?: boolean;
  layouts?: typeof MAGAZINE_LAYOUTS;
}

function LayoutThumbnail({ layoutId }: { layoutId: MagazineLayoutType }) {
  const layout = MAGAZINE_LAYOUTS.find((l) => l.id === layoutId);
  if (!layout) return null;
  const { rows, columns } = layout;
  const svgWidth = 120;
  const svgHeight = 80;
  const padding = 8;
  const spacing = 4;
  const magazineAspectRatio = 0.7;
  const availableWidth = svgWidth - padding * 2 - spacing * (columns - 1);
  const availableHeight = svgHeight - padding * 2 - spacing * (rows - 1);
  let cellWidth = availableWidth / columns;
  let cellHeight = cellWidth / magazineAspectRatio;
  if (cellHeight > availableHeight / rows) {
    cellHeight = availableHeight / rows;
    cellWidth = cellHeight * magazineAspectRatio;
  }
  const totalWidth = cellWidth * columns + spacing * (columns - 1);
  const totalHeight = cellHeight * rows + spacing * (rows - 1);
  const offsetX = padding + (availableWidth - totalWidth) / 2;
  const offsetY = padding + (availableHeight - totalHeight) / 2;
  const magazines: React.ReactNode[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = offsetX + col * (cellWidth + spacing);
      const y = offsetY + row * (cellHeight + spacing);
      magazines.push(
        <g key={`${row}-${col}`}>
          <rect
            x={x}
            y={y}
            width={cellWidth}
            height={cellHeight}
            className="fill-purple-100 dark:fill-purple-900/30 stroke-purple-400 dark:stroke-purple-600"
            strokeWidth="1.5"
            rx="1.5"
          />
          <line
            x1={x + cellWidth * 0.1}
            y1={y + 2}
            x2={x + cellWidth * 0.1}
            y2={y + cellHeight - 2}
            className="stroke-purple-300 dark:stroke-purple-700"
            strokeWidth="0.5"
            opacity="0.6"
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
      {magazines}
    </svg>
  );
}

function CompactLayoutIcon({ layoutId }: { layoutId: MagazineLayoutType }) {
  const layout = MAGAZINE_LAYOUTS.find((l) => l.id === layoutId);
  if (!layout) return null;
  const { rows, columns } = layout;
  const iconSize = 24;
  const padding = 2;
  const gap = 1.5;
  const magazineAspectRatio = 0.7;
  const availableWidth = iconSize - padding * 2 - gap * (columns - 1);
  const availableHeight = iconSize - padding * 2 - gap * (rows - 1);
  let cellWidth = availableWidth / columns;
  let cellHeight = cellWidth / magazineAspectRatio;
  if (cellHeight > availableHeight / rows) {
    cellHeight = availableHeight / rows;
    cellWidth = cellHeight * magazineAspectRatio;
  }
  const totalWidth = cellWidth * columns + gap * (columns - 1);
  const totalHeight = cellHeight * rows + gap * (rows - 1);
  const offsetX = padding + (availableWidth - totalWidth) / 2;
  const offsetY = padding + (availableHeight - totalHeight) / 2;
  const rectangles: React.ReactNode[] = [];
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
          rx="0.5"
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

export function MagazineLayoutGallery({
  selectedLayout,
  onLayoutChange,
  className,
  compact = false,
  layouts = MAGAZINE_LAYOUTS,
}: MagazineLayoutGalleryProps) {
  if (compact) {
    return (
      <div className={cn("grid grid-cols-2 gap-2", className)}>
        {layouts.map((layout) => {
          const isSelected = selectedLayout === layout.id;
          return (
            <Card
              key={layout.id}
              className={cn(
                "p-2 cursor-pointer hover-elevate flex flex-col items-center justify-center gap-2 min-h-[70px]",
                isSelected && "ring-2 ring-primary bg-primary/5"
              )}
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
              <span className="text-xs font-medium text-center leading-tight" aria-hidden="true">
                {layout.displayName}
              </span>
            </Card>
          );
        })}
      </div>
    );
  }
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4", className)}>
      {layouts.map((layout) => {
        const isSelected = selectedLayout === layout.id;
        return (
          <Card
            key={layout.id}
            className={cn(
              "p-3 sm:p-3 lg:p-4 cursor-pointer hover-elevate min-h-[180px] sm:min-h-[180px] lg:min-h-0",
              isSelected && "ring-2 ring-primary bg-primary/5"
            )}
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
    </div>
  );
}
