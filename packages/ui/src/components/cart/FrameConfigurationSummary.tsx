"use client";

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
 * Renders a human-readable summary of a frame configuration (artwork size, frame, mats, glass).
 * Used on the cart page and anywhere we need to show "what's in this frame" again.
 */
export function FrameConfigurationSummary({
  config,
  className,
  compact = false,
}: FrameConfigurationSummaryProps) {
  const frame = getFrameStyleById(config.frameStyleId);
  const matColor = getMatColorById(config.matColorId);
  const matInnerColor = config.matInnerColorId
    ? getMatColorById(config.matInnerColorId)
    : undefined;
  const glass = getGlassTypeById(config.glassTypeId);

  const frameName = frame?.name ?? config.frameStyleId;
  const matName = matColor?.name ?? config.matColorId;
  const matInnerName = matInnerColor?.name ?? config.matInnerColorId;
  const glassName = glass?.name ?? config.glassTypeId;

  const rows: { label: string; value: string }[] = [
    { label: "Artwork size", value: `${config.artworkWidth}" × ${config.artworkHeight}"` },
    { label: "Frame", value: frameName },
    {
      label: "Mat",
      value:
        config.matType === "none"
          ? "None"
          : config.matType === "single"
            ? `${matName} (${config.matBorderWidth}" border)`
            : `Double: ${matName} + ${matInnerName ?? "—"} (${config.matBorderWidth}" border, ${config.matRevealWidth}" reveal)`,
    },
    { label: "Glazing", value: glassName },
    {
      label: "Service",
      value: config.serviceType === "print-and-frame" ? "Print & frame" : "Frame only",
    },
  ];

  if (compact) {
    const parts = [
      `${config.artworkWidth}"×${config.artworkHeight}"`,
      frameName,
      config.matType === "none"
        ? "No mat"
        : config.matType === "single"
          ? matName
          : `${matName} + ${matInnerName ?? "—"}`,
      glassName,
    ];
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
