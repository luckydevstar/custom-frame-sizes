"use client";

import { memo, useMemo } from "react";
import type { MatConfig } from "./types";
import {
  getFrameStyleById,
  computePreviewLayout,
  getMatTilingStyle,
  getMatBevelColor,
} from "@framecraft/core";
import { getMatByName } from "@framecraft/config";

export interface MatPreviewLayout {
  scale: number;
  paddingPx: number;
  outerPx: { w: number; h: number };
  glassPx: { w: number; h: number };
  frameFacePx: number;
}

interface MatPreviewCanvasProps {
  config: MatConfig;
  configVersion: number;
  framePhotos: {
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  };
  containerWidth?: number;
  containerHeight?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const MatPreviewCanvas = memo(function MatPreviewCanvas({
  config,
  configVersion: _configVersion,
  framePhotos,
  containerWidth = 720,
  containerHeight = 700,
  className,
  style,
}: MatPreviewCanvasProps) {
  const selectedFrame = config.selectedFrameId
    ? (getFrameStyleById(config.selectedFrameId) ?? undefined)
    : undefined;

  // Compute layout dimensions following other designers' pattern
  const layout = useMemo(() => {
    const frameFace = selectedFrame?.mouldingWidth ?? 0;

    // Overall mat dimensions
    const matWidth = config.overallWIn;
    const matHeight = config.overallHIn;

    return computePreviewLayout({
      artW: matWidth,
      artH: matHeight,
      matBorderTop: 0, // Mat itself has no additional border (it IS the border)
      matBorderRight: 0,
      matBorderBottom: 0,
      matBorderLeft: 0,
      frameFace,
      containerWpx: containerWidth,
      containerHpx: containerHeight,
    });
  }, [
    config.overallWIn,
    config.overallHIn,
    selectedFrame?.mouldingWidth,
    containerWidth,
    containerHeight,
  ]);

  const hasFramePhotos =
    !!framePhotos.topUrl &&
    !!framePhotos.bottomUrl &&
    !!framePhotos.leftUrl &&
    !!framePhotos.rightUrl;

  const frameLipPx = useMemo(() => {
    if (!selectedFrame) return 0;
    const ratio = selectedFrame.rabbetInsetRatio ?? 0.92;
    return layout.frameFacePx * ratio;
  }, [layout.frameFacePx, selectedFrame]);

  // Get mat colors
  const topMat = getMatByName(config.topMat.color);
  const bottomMat = config.bottomMat ? getMatByName(config.bottomMat.color) : null;
  const topMatHex = topMat?.hexColor ?? "#FFFFFF";
  const bottomMatHex = bottomMat?.hexColor ?? "#000000";

  // Calculate opening dimensions in pixels
  const isDouble = config.singleOrDouble === "double" && config.bottomMat;
  const sourceOpenings =
    isDouble && config.bottomMat ? config.bottomMat.openings : config.topMat.openings;

  const opening = sourceOpenings[0]; // For now, support single opening (like original)
  const openingPx = useMemo(() => {
    if (!opening) return { top: 0, left: 0, width: 0, height: 0 };
    return {
      top: layout.scale * opening.yIn,
      left: layout.scale * opening.xIn,
      width: layout.scale * (opening.wIn ?? 0),
      height: layout.scale * (opening.hIn ?? 0),
    };
  }, [opening, layout.scale]);

  // Mat reveal for double mats
  const matRevealPx = useMemo(() => {
    return layout.scale * (config.matRevealWidth ?? 0.25);
  }, [layout.scale, config.matRevealWidth]);

  const bevelWidthPx = useMemo(() => {
    const width = layout.scale * 0.0625;
    return Math.max(1, isNaN(width) || !isFinite(width) ? 1 : width);
  }, [layout.scale]);

  // Mat layer styles (following CurrencyPreviewCanvas pattern)
  const matLayerStyle = (hex: string, name: string) => ({
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: hex,
    ...getMatTilingStyle(name, layout.scale, hex),
    boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.08)",
    transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
  });

  // V-groove rendering (decorative groove around opening)
  const renderVGroove = () => {
    if (!config.vGroove?.enabled || !config.vGroove.offsetIn || !opening) return null;

    const vGrooveOffset = layout.scale * config.vGroove.offsetIn;
    const isOval = opening.shape === "oval";

    return (
      <div
        style={{
          position: "absolute",
          top: `${openingPx.top - vGrooveOffset}px`,
          left: `${openingPx.left - vGrooveOffset}px`,
          width: `${openingPx.width + vGrooveOffset * 2}px`,
          height: `${openingPx.height + vGrooveOffset * 2}px`,
          border: "2px dashed rgba(0, 0, 0, 0.15)",
          borderRadius: isOval ? "50%" : opening.cornerStyle === "rounded" ? "6px" : "0",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />
    );
  };

  // Opening (artwork area) rendering
  const renderOpening = (bevelColor: string) => {
    const isOval = opening?.shape === "oval";
    const isRounded = opening?.cornerStyle === "rounded";

    return (
      <>
        {renderVGroove()}
        <div
          style={{
            position: "absolute",
            top: `${openingPx.top}px`,
            left: `${openingPx.left}px`,
            width: `${openingPx.width}px`,
            height: `${openingPx.height}px`,
            backgroundColor: "#1a1a1a", // Artwork placeholder
            boxShadow: `inset 0 0 0 ${bevelWidthPx}px ${bevelColor}, inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)`,
            borderRadius: isOval ? "50%" : isRounded ? "8px" : "0",
            transition: "all 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
          }}
        />
      </>
    );
  };

  // Double mat: bottom mat opening with reveal
  const renderDoubleMatOpening = (bevelColor: string) => {
    const isOval = opening?.shape === "oval";
    const isRounded = opening?.cornerStyle === "rounded";

    return (
      <>
        {renderVGroove()}
        <div
          style={{
            position: "absolute",
            top: `${openingPx.top}px`,
            left: `${openingPx.left}px`,
            width: `${openingPx.width}px`,
            height: `${openingPx.height}px`,
            backgroundColor: bottomMatHex,
            ...getMatTilingStyle(config.bottomMat?.color ?? "White", layout.scale, bottomMatHex),
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.08)",
            border: `${Math.max(1.5, layout.scale * 0.06)}px solid #E0E0E0`,
            borderRadius: isOval ? "50%" : isRounded ? "8px" : "0",
            transition: "all 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
          }}
        >
          {/* Inner opening (artwork area) */}
          <div
            style={{
              position: "absolute",
              top: `${matRevealPx}px`,
              left: `${matRevealPx}px`,
              right: `${matRevealPx}px`,
              bottom: `${matRevealPx}px`,
              backgroundColor: "#1a1a1a",
              boxShadow: `inset 0 0 0 ${bevelWidthPx}px ${bevelColor}, inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)`,
              borderRadius: isOval ? "50%" : isRounded ? "6px" : "0",
            }}
          />
        </div>
      </>
    );
  };

  // Inner mat content (sits inside frame lip with NO gap)
  const innerContent = (
    <div
      style={{
        position: "absolute",
        top: `${frameLipPx}px`,
        left: `${frameLipPx}px`,
        right: `${frameLipPx}px`,
        bottom: `${frameLipPx}px`,
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      {/* Top mat layer */}
      <div style={matLayerStyle(topMatHex, config.topMat.color)}>
        {isDouble && config.bottomMat
          ? renderDoubleMatOpening(getMatBevelColor(config.bottomMat.color))
          : renderOpening(getMatBevelColor(config.topMat.color))}
      </div>
    </div>
  );

  // Pattern from CurrencyPreviewCanvas: render frame rails with proper clip-path for mitered corners
  return (
    <div className={className} style={style} data-testid="mat-preview-canvas">
      {hasFramePhotos && selectedFrame ? (
        <div
          style={{
            width: `${layout.outerPx.w}px`,
            height: `${layout.outerPx.h}px`,
            position: "relative",
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.25))",
          }}
        >
          {/* Top rail */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: `${layout.frameFacePx}px`,
              backgroundImage: `url(${framePhotos.topUrl})`,
              backgroundSize: "auto 100%",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "left center",
              zIndex: 10,
              clipPath: `polygon(0 0, 100% 0, calc(100% - ${layout.frameFacePx}px) 100%, ${layout.frameFacePx}px 100%)`,
            }}
          />
          {/* Bottom rail */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: `${layout.frameFacePx}px`,
              backgroundImage: `url(${framePhotos.bottomUrl})`,
              backgroundSize: "auto 100%",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "left center",
              zIndex: 10,
              clipPath: `polygon(${layout.frameFacePx}px 0, calc(100% - ${layout.frameFacePx}px) 0, 100% 100%, 0 100%)`,
            }}
          />
          {/* Left rail */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: `${layout.frameFacePx}px`,
              backgroundImage: `url(${framePhotos.leftUrl})`,
              backgroundSize: "100% auto",
              backgroundRepeat: "repeat-y",
              backgroundPosition: "center top",
              zIndex: 10,
              clipPath: `polygon(0 0, 100% ${layout.frameFacePx}px, 100% calc(100% - ${layout.frameFacePx}px), 0 100%)`,
            }}
          />
          {/* Right rail */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: `${layout.frameFacePx}px`,
              backgroundImage: `url(${framePhotos.rightUrl})`,
              backgroundSize: "100% auto",
              backgroundRepeat: "repeat-y",
              backgroundPosition: "center top",
              zIndex: 10,
              clipPath: `polygon(0 ${layout.frameFacePx}px, 100% 0, 100% 100%, 0 calc(100% - ${layout.frameFacePx}px))`,
            }}
          />
          {innerContent}
        </div>
      ) : selectedFrame ? (
        // Frame selected but no photos loaded yet: show placeholder with border color
        <div
          style={{
            width: `${layout.outerPx.w}px`,
            height: `${layout.outerPx.h}px`,
            borderTop: `${frameLipPx}px solid ${selectedFrame.borderColor}`,
            borderLeft: `${frameLipPx}px solid ${selectedFrame.borderColor}`,
            borderRight: `${frameLipPx}px solid ${selectedFrame.color}`,
            borderBottom: `${frameLipPx}px solid ${selectedFrame.color}`,
            boxShadow:
              "inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.25)",
            position: "relative",
            transition: "border-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
          }}
        >
          {innerContent}
        </div>
      ) : (
        // No frame: show mat only with drop shadow
        <div
          style={{
            width: `${layout.outerPx.w}px`,
            height: `${layout.outerPx.h}px`,
            position: "relative",
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.25))",
          }}
        >
          {/* Top mat layer (no frame lip padding when no frame) */}
          <div style={matLayerStyle(topMatHex, config.topMat.color)}>
            {isDouble && config.bottomMat
              ? renderDoubleMatOpening(getMatBevelColor(config.bottomMat.color))
              : renderOpening(getMatBevelColor(config.topMat.color))}
          </div>
        </div>
      )}
    </div>
  );
});
