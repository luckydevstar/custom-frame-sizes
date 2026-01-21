/**
 * Comic Layout Gallery Component
 *
 * Visual gallery of all 10 comic layout options with thumbnails.
 * Shows layout name, comic count, orientation, and selection state.
 */

import { Card } from "../ui/card";
import { COMIC_LAYOUTS, type ComicLayoutType } from "@framecraft/core";
import { cn } from "../../utils";

interface ComicLayoutGalleryProps {
  selectedLayout: ComicLayoutType;
  onLayoutChange: (layoutId: ComicLayoutType) => void;
  className?: string;
  compact?: boolean; // Mobile-optimized compact mode
}

/**
 * Generate SVG thumbnail for layout visualization
 * Uses realistic comic book proportions (modern comic: ~6.625" × 10.25" = 0.646 ratio)
 */
function LayoutThumbnail({ layoutId }: { layoutId: ComicLayoutType }) {
  const layout = COMIC_LAYOUTS.find((l) => l.id === layoutId);
  if (!layout) return null;

  const { rows, columns } = layout;
  const svgWidth = 120;
  const svgHeight = 80;
  const padding = 8;
  const spacing = 4;

  // Comic book aspect ratio: width / height = 0.646 (modern comic proportions)
  const comicAspectRatio = 0.646;

  // Calculate available space
  const availableWidth = svgWidth - padding * 2 - spacing * (columns - 1);
  const availableHeight = svgHeight - padding * 2 - spacing * (rows - 1);

  // Calculate comic dimensions to fit within available space while maintaining aspect ratio
  let cellWidth = availableWidth / columns;
  let cellHeight = cellWidth / comicAspectRatio;

  // If height exceeds available space, scale down based on height
  if (cellHeight > availableHeight / rows) {
    cellHeight = availableHeight / rows;
    cellWidth = cellHeight * comicAspectRatio;
  }

  // Center the layout if there's extra space
  const totalWidth = cellWidth * columns + spacing * (columns - 1);
  const totalHeight = cellHeight * rows + spacing * (rows - 1);
  const offsetX = padding + (availableWidth - totalWidth) / 2;
  const offsetY = padding + (availableHeight - totalHeight) / 2;

  // Generate comic book shapes for each opening
  const comics = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = offsetX + col * (cellWidth + spacing);
      const y = offsetY + row * (cellHeight + spacing);

      comics.push(
        <g key={`${row}-${col}`}>
          {/* Comic book rectangle with rounded corners */}
          <rect
            x={x}
            y={y}
            width={cellWidth}
            height={cellHeight}
            className="fill-blue-100 dark:fill-blue-900/30 stroke-blue-400 dark:stroke-blue-600"
            strokeWidth="1.5"
            rx="1.5"
          />
          {/* Subtle spine line to indicate it's a comic book */}
          <line
            x1={x + cellWidth * 0.08}
            y1={y + 2}
            x2={x + cellWidth * 0.08}
            y2={y + cellHeight - 2}
            className="stroke-blue-300 dark:stroke-blue-700"
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
      {comics}
    </svg>
  );
}

/**
 * Compact Layout Icon - Custom SVG showing actual layout arrangement
 */
function CompactLayoutIcon({ layoutId }: { layoutId: ComicLayoutType }) {
  const layout = COMIC_LAYOUTS.find((l) => l.id === layoutId);
  if (!layout) return null;

  const { rows, columns } = layout;
  const iconSize = 24;
  const padding = 2;
  const gap = 1.5;
  const comicAspectRatio = 0.646; // Width / Height for comic books

  // Calculate available space
  const availableWidth = iconSize - padding * 2 - gap * (columns - 1);
  const availableHeight = iconSize - padding * 2 - gap * (rows - 1);

  // Calculate comic cell dimensions
  let cellWidth = availableWidth / columns;
  let cellHeight = cellWidth / comicAspectRatio;

  // Scale down if height exceeds available space
  if (cellHeight > availableHeight / rows) {
    cellHeight = availableHeight / rows;
    cellWidth = cellHeight * comicAspectRatio;
  }

  // Center the layout
  const totalWidth = cellWidth * columns + gap * (columns - 1);
  const totalHeight = cellHeight * rows + gap * (rows - 1);
  const offsetX = padding + (availableWidth - totalWidth) / 2;
  const offsetY = padding + (availableHeight - totalHeight) / 2;

  // Generate rectangles for each comic
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

export function ComicLayoutGallery({
  selectedLayout,
  onLayoutChange,
  className,
  compact = false,
}: ComicLayoutGalleryProps) {
  // Compact mobile mode: 2-column grid with custom SVG icons
  if (compact) {
    return (
      <div className={cn("grid grid-cols-2 gap-2", className)}>
        {COMIC_LAYOUTS.map((layout) => {
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

  // Desktop mode: original design with SVG thumbnails
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4", className)}>
      {COMIC_LAYOUTS.map((layout) => {
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
            {/* Thumbnail */}
            <div className="mb-2 lg:mb-3" aria-hidden="true">
              <LayoutThumbnail layoutId={layout.id} />
            </div>

            {/* Layout Name */}
            <h3 className="font-semibold text-sm text-center" aria-hidden="true">
              {layout.displayName}
            </h3>
          </Card>
        );
      })}
    </div>
  );
}
