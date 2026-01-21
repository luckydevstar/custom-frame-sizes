/**
 * Playbill Layout Gallery Component
 *
 * Visual gallery of playbill layout options.
 * Shows layout name, playbill count, ticket count, and frame dimensions.
 */

import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { PLAYBILL_LAYOUTS, type PlaybillLayoutType } from "@framecraft/core";
import { cn } from "../../utils";
import { Ticket, FileText } from "lucide-react";

interface PlaybillLayoutGalleryProps {
  selectedLayout: PlaybillLayoutType;
  onLayoutChange: (layoutId: PlaybillLayoutType) => void;
  className?: string;
  compact?: boolean; // Mobile-optimized compact mode
}

/**
 * Generate SVG thumbnail for layout visualization
 * Shows playbills (portrait) and tickets (landscape)
 */
function LayoutThumbnail({ layoutId }: { layoutId: PlaybillLayoutType }) {
  const layout = PLAYBILL_LAYOUTS.find((l) => l.id === layoutId);
  if (!layout) return null;

  const svgWidth = 120;
  const svgHeight = 80;
  const padding = 8;
  const spacing = 2;

  // Calculate layout bounds
  const minX = Math.min(...layout.openings.map((o) => o.x));
  const maxX = Math.max(...layout.openings.map((o) => o.x + o.width));
  const minY = Math.min(...layout.openings.map((o) => o.y));
  const maxY = Math.max(...layout.openings.map((o) => o.y + o.height));

  const layoutWidth = maxX - minX;
  const layoutHeight = maxY - minY;

  // Calculate scale to fit within SVG
  const scaleX = (svgWidth - padding * 2) / layoutWidth;
  const scaleY = (svgHeight - padding * 2) / layoutHeight;
  const scale = Math.min(scaleX, scaleY);

  // Center offset
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

        const isPlaybill = opening.type === "playbill";

        return (
          <g key={`${layoutId}-${index}`}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              className={cn(
                "stroke-2",
                isPlaybill
                  ? "fill-amber-50 dark:fill-amber-950 stroke-amber-400 dark:stroke-amber-600"
                  : "fill-blue-50 dark:fill-blue-950 stroke-blue-400 dark:stroke-blue-600"
              )}
              rx="1.5"
            />
            {/* Icon indicator */}
            {isPlaybill ? (
              <foreignObject x={x + w / 2 - 6} y={y + h / 2 - 6} width="12" height="12">
                <FileText className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              </foreignObject>
            ) : (
              <foreignObject x={x + w / 2 - 5} y={y + h / 2 - 5} width="10" height="10">
                <Ticket className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
              </foreignObject>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function PlaybillLayoutGallery({
  selectedLayout,
  onLayoutChange,
  className,
  compact = false,
}: PlaybillLayoutGalleryProps) {
  // Compact mobile mode: 2-column grid, no categories
  if (compact) {
    return (
      <div className={cn("grid grid-cols-2 gap-2", className)}>
        {PLAYBILL_LAYOUTS.map((layout) => {
          const isSelected = selectedLayout === layout.id;

          return (
            <Card
              key={layout.id}
              className={cn(
                "p-2 cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[120px]",
                isSelected && "ring-2 ring-primary bg-primary/5"
              )}
              onClick={() => onLayoutChange(layout.id)}
              data-testid={`button-select-layout-${layout.id}`}
            >
              <LayoutThumbnail layoutId={layout.id} />
              <div className="text-center">
                <div className="text-xs font-semibold">{layout.name}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {layout.playbillCount > 0 && (
                    <Badge variant="secondary" className="text-[10px] px-1 py-0">
                      {layout.playbillCount} <FileText className="w-2.5 h-2.5 ml-0.5 inline" />
                    </Badge>
                  )}
                  {layout.ticketCount > 0 && (
                    <Badge variant="secondary" className="text-[10px] px-1 py-0">
                      {layout.ticketCount} <Ticket className="w-2.5 h-2.5 ml-0.5 inline" />
                    </Badge>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {layout.frameWidth}&quot; × {layout.frameHeight}&quot;
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  // Desktop: Single unified grid - clean and scannable
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {PLAYBILL_LAYOUTS.map((layout) => {
        const isSelected = selectedLayout === layout.id;

        return (
          <Card
            key={layout.id}
            className={cn(
              "p-4 cursor-pointer hover-elevate active-elevate-2",
              isSelected && "ring-2 ring-primary bg-primary/5"
            )}
            onClick={() => onLayoutChange(layout.id)}
            data-testid={`button-select-layout-${layout.id}`}
          >
            <LayoutThumbnail layoutId={layout.id} />
            <div className="mt-3 space-y-1.5">
              <h4 className="font-semibold text-sm leading-tight">{layout.name}</h4>
              <div className="text-xs text-muted-foreground">
                {layout.frameWidth}&quot; × {layout.frameHeight}&quot;
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
