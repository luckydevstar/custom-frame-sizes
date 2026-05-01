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
  /** Extra designer-specific attributes to append as additional rows */
  extraAttributes?: Record<string, string>;
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
  extraAttributes,
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

    case "brass-nameplate": {
      // Details are supplied via additionalInfo (set by BrassNameplateOrderModule).
      // Only add a fallback "Product" label if additionalInfo doesn't already supply one.
      if (!config.additionalInfo?.["Product Type"]) {
        rows.push({ label: "Product", value: "Brass Nameplate" });
      }
      break;
    }

    case "mat-board": {
      rows.push({
        label: "Mat Type",
        value: config.matType === "double" ? "Double Mat" : "Single Mat",
      });
      if (matColor) {
        rows.push({ label: "Color", value: matColor.name ?? config.matColorId ?? "—" });
      }
      if (config.matType === "double" && matInnerColor) {
        rows.push({ label: "Bottom Color", value: matInnerColor.name ?? config.matInnerColorId ?? "—" });
      }
      break;
    }

    case "frame":
    default: {
      // Detect CD/vinyl/shadowbox frames by orderSource — suppress internal border width label
      const isRecordOrCDFrame =
        config.orderSource?.startsWith("cd-frame-") ||
        config.orderSource?.startsWith("record-album-frame-");
      const isShadowbox = config.orderSource === "shadowbox";

      rows.push({ label: "Frame", value: frameName });
      if (config.matType !== "none") {
        if (isRecordOrCDFrame) {
          // For CD/vinyl, the mat border is an internal layout parameter — show color only
          rows.push({
            label: "Mat",
            value:
              config.matType === "double"
                ? `Double: ${matName} + ${matInnerName}`
                : matName,
          });
        } else {
          rows.push({
            label: "Mat",
            value:
              config.matType === "single"
                ? `${matName} (${config.matBorderWidth}" border)`
                : `Double: ${matName} + ${matInnerName} (${config.matBorderWidth}" border, ${config.matRevealWidth}" reveal)`,
          });
        }
      } else       if (!isShadowbox) {
        rows.push({ label: "Mat", value: "None" });
      }
      if (config.glassTypeId && glassDisplay) {
        rows.push({ label: "Glazing", value: glassDisplay });
      }
      // Shadowbox-specific rows — read directly from the persisted config
      if (isShadowbox && config.shadowboxInfo) {
        rows.push({ label: "Backing Color", value: config.shadowboxInfo.backingColor });
        rows.push({ label: "Depth", value: `${config.shadowboxInfo.depth}"` });
        if (config.shadowboxInfo.hardware === "security") {
          rows.push({ label: "Hardware", value: "Security Hardware" });
        }
      }
      if (!isShadowbox) {
        rows.push({
          label: "Service",
          value: config.serviceType === "print-and-frame" ? "Print & frame" : "Frame only",
        });
      }

      // Brass nameplate attached to this frame item
      const npCfg = config.brassNameplateConfig as
        | {
            enabled?: boolean;
            color?: string;
            font?: string;
            line1?: string;
            line2?: string;
            line3?: string;
            lines?: Array<{ text?: string }>;
          }
        | undefined;
      if (npCfg?.enabled) {
        const NP_COLOR_LABELS: Record<string, string> = {
          "brass-black": "Brass with Black Text",
          "silver-black": "Silver with Black Text",
          "black-gold": "Black with Gold Text",
          "black-silver": "Black with Silver Text",
        };
        rows.push({
          label: "Nameplate Color",
          value: NP_COLOR_LABELS[npCfg.color ?? ""] ?? npCfg.color ?? "",
        });
        // Flat format (line1/line2/line3) — used by most frame designers
        if (npCfg.line1?.trim()) rows.push({ label: "Nameplate Line 1", value: npCfg.line1.trim() });
        if (npCfg.line2?.trim()) rows.push({ label: "Nameplate Line 2", value: npCfg.line2.trim() });
        if (npCfg.line3?.trim()) rows.push({ label: "Nameplate Line 3", value: npCfg.line3.trim() });
        // Array format (lines[]) — used by standalone nameplate stored inside frame config
        if (Array.isArray(npCfg.lines)) {
          npCfg.lines.forEach((l, i) => {
            if (l.text?.trim()) rows.push({ label: `Nameplate Line ${i + 1}`, value: l.text.trim() });
          });
        }
      }
      break;
    }
  }

  // Append persisted additionalInfo from config (survives localStorage round-trips)
  if (config.additionalInfo) {
    for (const [label, value] of Object.entries(config.additionalInfo)) {
      if (value) rows.push({ label, value });
    }
  }

  // Append runtime-only extra attributes (from customAttributes on the cart item)
  if (extraAttributes) {
    for (const [label, value] of Object.entries(extraAttributes)) {
      // Skip if already added via additionalInfo to avoid duplicates
      if (value && !config.additionalInfo?.[label]) rows.push({ label, value });
    }
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
