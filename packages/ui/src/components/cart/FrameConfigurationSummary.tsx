"use client";

import { getCardProductionCode } from "../../lib/card-production-codes";
import { getFrameStyleById, getMatColorById, getGlassTypeById } from "@framecraft/core";

import { cn } from "../../utils";

import type { FrameConfiguration } from "@framecraft/types";

export interface FrameConfigurationSummaryProps {
  config: FrameConfiguration;
  className?: string;
  /** Compact single-line style when true */
  compact?: boolean;
}

/**
 * Determine product type from frameStyleId
 */
function getProductType(frameStyleId?: string): 
  | "frame"
  | "foam-board"
  | "cleat-hanger"
  | "acrylic"
  | "acrylic-cleaner"
  | "security-hardware"
  | "brass-nameplate"
  | "mat-board"
  | "unknown" {
  if (!frameStyleId) return "unknown";
  
  const typeMap: Record<string, ReturnType<typeof getProductType>> = {
    "foam-board": "foam-board",
    "cleat-hanger": "cleat-hanger",
    "acrylic": "acrylic",
    "acrylic-cleaner": "acrylic-cleaner",
    "security-hardware": "security-hardware",
    "brass-nameplate": "brass-nameplate",
    "mat-board": "mat-board",
  };
  
  return typeMap[frameStyleId] || "frame";
}

/**
 * Renders a human-readable summary of a frame configuration (artwork size, frame, mats, glass).
 * For non-frame products, shows only relevant attributes.
 * Used on the cart page and anywhere we need to show "what's in this product" again.
 */
export function FrameConfigurationSummary({
  config,
  className,
  compact = false,
}: FrameConfigurationSummaryProps) {
  const productType = getProductType(config.frameStyleId);
  const frame = getFrameStyleById(config.frameStyleId);
  const matColor = config.matColorId ? getMatColorById(config.matColorId) : undefined;
  const matInnerColor = config.matInnerColorId
    ? getMatColorById(config.matInnerColorId)
    : undefined;
  const glass = config.glassTypeId ? getGlassTypeById(config.glassTypeId) : undefined;

  const frameName = frame?.name ?? config.frameStyleId;
  const matName = matColor?.name ?? config.matColorId ?? "—";
  const matInnerName = matInnerColor?.name ?? config.matInnerColorId ?? "—";
  const glassDisplay = glass?.name ?? config.glassTypeId ?? "";

  // Build rows based on product type
  const rows: { label: string; value: string }[] = [];

  // Graded card: interior manufacturing size + layout code
  if (
    config.cardFormatId &&
    typeof config.cardInteriorWidthIn === "number" &&
    typeof config.cardInteriorHeightIn === "number"
  ) {
    rows.push({
      label: "Interior Size",
      value: `${config.cardInteriorWidthIn}" × ${config.cardInteriorHeightIn}"`,
    });
    const layoutCode = getCardProductionCode(
      config.cardFormatId,
      config.cardLayoutId ?? ""
    );
    if (layoutCode) {
      rows.push({ label: "Layout", value: layoutCode });
    }
  } else {
    rows.push({ label: "Size", value: `${config.artworkWidth}" × ${config.artworkHeight}"` });
  }

  // Product-specific attributes
  switch (productType) {
    case "foam-board":
      if (config.orderSource) {
        const boardType = config.orderSource.replace("foam-board-", "");
        rows.push({
          label: "Type",
          value: boardType
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
        });
      }
      break;

    case "cleat-hanger":
      rows.push({ label: "Type", value: "12\" Heavy-Duty Metal Cleat Bar System" });
      break;

    case "acrylic":
      if (config.glassTypeId && glassDisplay) {
        rows.push({ label: "Glass Type", value: glassDisplay });
      }
      break;

    case "acrylic-cleaner":
      rows.push({ label: "Product", value: "Acrylic Cleaner & Polish" });
      break;

    case "security-hardware":
      rows.push({ label: "Type", value: "Professional Security Hardware" });
      break;

    case "brass-nameplate":
      rows.push({ label: "Product", value: "Brass Nameplate" });
      break;

    case "mat-board":
      if (config.matType !== "none") {
        rows.push({
          label: "Mat Type",
          value: config.matType === "double" ? "Double Mat" : "Single Mat",
        });
      }
      break;

    case "frame":
    default:
      // Full frame display for custom frames
      rows.push({ label: "Frame", value: frameName });
      rows.push({
        label: "Mat",
        value:
          config.matType === "none"
            ? "None"
            : config.matType === "single"
              ? `${matName} (${config.matBorderWidth}" border)`
              : `Double: ${matName} + ${matInnerName} (${config.matBorderWidth}" border, ${config.matRevealWidth}" reveal)`,
      });
      if (config.glassTypeId && glassDisplay) {
        rows.push({ label: "Glazing", value: glassDisplay });
      }
      rows.push({
        label: "Service",
        value: config.serviceType === "print-and-frame" ? "Print & frame" : "Frame only",
      });
      break;
  }

  if (compact) {
    const layoutCode =
      config.cardFormatId && config.cardLayoutId
        ? getCardProductionCode(config.cardFormatId, config.cardLayoutId)
        : undefined;
    const parts =
      config.cardFormatId &&
      typeof config.cardInteriorWidthIn === "number" &&
      typeof config.cardInteriorHeightIn === "number"
        ? [
            `${config.cardInteriorWidthIn}"×${config.cardInteriorHeightIn}"`,
            ...(layoutCode ? [layoutCode] : []),
          ]
        : [`${config.artworkWidth}"×${config.artworkHeight}"`];

    if (productType === "frame") {
      parts.push(frameName);
      parts.push(
        config.matType === "none"
          ? "No mat"
          : config.matType === "single"
            ? matName
            : `${matName} + ${matInnerName ?? "—"}`
      );
      if (glassDisplay) parts.push(glassDisplay);
    } else if (productType === "foam-board" && config.orderSource) {
      const boardType = config.orderSource.replace("foam-board-", "").replace(/-/g, " ");
      parts.push(boardType);
    }
    
    return <p className={cn("text-sm text-muted-foreground", className)}>{parts.join(" · ")}</p>;
  }

  return (
    <dl className={cn("grid gap-1 text-sm", className)}>
      {rows.map(({ label, value }) => (
        <div key={label} className="flex gap-2">
          <dt className="text-muted-foreground shrink-0">{label}:</dt>
          <dd className="text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
