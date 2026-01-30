"use client";

import { memo, useMemo } from "react";
import { BookOpen } from "lucide-react";
import type { FrameStyle } from "@framecraft/types";
import type { Mat } from "@framecraft/config";
import type { BrassNameplateConfig } from "@framecraft/types";
import type { CardLayoutType } from "@framecraft/core";
import type { MatManifest } from "@framecraft/core";
import {
  buildMatManifest,
  getPreviewScale,
  getMatTilingStyle,
  getCardLayout,
  calculateCardFrameSize,
  calculateCardPreviewDimensions,
  getCardFormatById,
  getFrameImageUrl,
} from "@framecraft/core";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";

interface CardPreviewCanvasProps {
  framePhotos: {
    cornerUrl?: string;
    profileUrl?: string;
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  };
  selectedFrame: FrameStyle;
  topMatColor: Mat;
  bottomMatColor: Mat;
  backingColor: Mat;
  matType: "none" | "single" | "double";
  layout: CardLayoutType;
  formatId: string;
  matBorder: number;
  manifest: MatManifest;
  previewScale: number;
  previewWidth: number;
  previewHeight: number;
  frameFaceWidth: number;
  isMobile: boolean;
  cardImages: string[];
  brassNameplateConfig?: BrassNameplateConfig;
  className?: string;
  style?: React.CSSProperties;
}

export const CardPreviewCanvas = memo(function CardPreviewCanvas({
  framePhotos,
  selectedFrame,
  topMatColor,
  bottomMatColor,
  backingColor,
  matType,
  layout,
  formatId,
  matBorder,
  manifest,
  previewScale,
  previewWidth,
  previewHeight,
  frameFaceWidth,
  isMobile,
  cardImages,
  brassNameplateConfig,
  className,
  style,
}: CardPreviewCanvasProps) {
  const clipPathIds = useMemo(() => {
    const nameplateEnabled = brassNameplateConfig?.enabled ? "true" : "false";
    const stableKey = `${layout}-${formatId}-${matType}-${matBorder.toFixed(1)}-${nameplateEnabled}`;
    const instanceKey = `${previewWidth.toFixed(0)}-${previewHeight.toFixed(0)}`;
    return {
      bottomMat: `clippath-bottom-${stableKey}-${instanceKey}`,
      topMat: `clippath-top-${stableKey}-${instanceKey}`,
    };
  }, [
    layout,
    formatId,
    matType,
    matBorder,
    brassNameplateConfig?.enabled,
    previewWidth,
    previewHeight,
  ]);

  const matRevealPx = useMemo(() => {
    const revealInches = manifest.matReveal ?? 0.25;
    return previewScale * revealInches;
  }, [previewScale, manifest.matReveal]);

  const bevelWidthPx = useMemo(() => {
    const width = previewScale * 0.06;
    return Math.max(1, isNaN(width) || !isFinite(width) ? 1 : width);
  }, [previewScale]);

  const hasValidDimensions = useMemo(() => {
    return (
      previewWidth > 0 &&
      previewHeight > 0 &&
      frameFaceWidth > 0 &&
      manifest.openings.every((opening) => opening.width > 0 && opening.height > 0)
    );
  }, [previewWidth, previewHeight, frameFaceWidth, manifest.openings]);

  const frameLipPx = useMemo(() => {
    const ratio = selectedFrame.rabbetInsetRatio ?? 0.92;
    return frameFaceWidth * ratio;
  }, [frameFaceWidth, selectedFrame.rabbetInsetRatio]);

  const topMatTiling = useMemo(() => {
    return getMatTilingStyle(topMatColor.name, previewScale);
  }, [topMatColor.name, previewScale]);

  const bottomMatTiling = useMemo(() => {
    return getMatTilingStyle(bottomMatColor.name, previewScale);
  }, [bottomMatColor.name, previewScale]);

  const nameplateDimensions = useMemo(() => {
    if (!brassNameplateConfig?.enabled) return null;
    const plaqueWidth = previewScale * 4.5 * 0.8;
    const plaqueHeight = previewScale * 1.5 * 0.8;
    const bottomMargin = previewScale * 0.85;
    const plaqueX = (previewWidth - plaqueWidth) / 2 - previewScale * 0.5;
    const plaqueY = previewHeight - frameFaceWidth - bottomMargin - plaqueHeight;
    return { width: plaqueWidth, height: plaqueHeight, x: plaqueX, y: plaqueY };
  }, [brassNameplateConfig?.enabled, previewScale, previewWidth, previewHeight, frameFaceWidth]);

  const bottomMatPath = useMemo(() => {
    if (manifest.openings.length === 0) return "";
    const matWidth = Math.max(0, previewWidth - frameLipPx * 2);
    const matHeight = Math.max(0, previewHeight - frameLipPx * 2);
    const fullRect = `M 0,0 L ${matWidth},0 L ${matWidth},${matHeight} L 0,${matHeight} Z`;
    const revealPx = matType === "double" ? matRevealPx : 0;
    const openingRects = manifest.openings
      .map((opening) => {
        const x = Math.max(0, opening.x - frameLipPx + revealPx);
        const y = Math.max(0, opening.y - frameLipPx + revealPx);
        const w = Math.max(0, opening.width - 2 * revealPx);
        const h = Math.max(0, opening.height - 2 * revealPx);
        return `M ${x},${y} L ${x + w},${y} L ${x + w},${y + h} L ${x},${y + h} Z`;
      })
      .join(" ");
    return `${fullRect} ${openingRects}`;
  }, [manifest.openings, previewWidth, previewHeight, frameLipPx, matType, matRevealPx]);

  const topMatPath = useMemo(() => {
    if (matType !== "double" || manifest.openings.length === 0) return "";
    const matWidth = Math.max(0, previewWidth - frameLipPx * 2);
    const matHeight = Math.max(0, previewHeight - frameLipPx * 2);
    const fullRect = `M 0,0 L ${matWidth},0 L ${matWidth},${matHeight} L 0,${matHeight} Z`;
    const openingRects = manifest.openings
      .map((opening) => {
        const x = Math.max(0, opening.x - frameLipPx);
        const y = Math.max(0, opening.y - frameLipPx);
        const w = Math.max(0, opening.width);
        const h = Math.max(0, opening.height);
        return `M ${x},${y} L ${x + w},${y} L ${x + w},${y + h} L ${x},${y + h} Z`;
      })
      .join(" ");
    return `${fullRect} ${openingRects}`;
  }, [matType, manifest.openings, previewWidth, previewHeight, frameLipPx]);

  const dropShadow = isMobile
    ? "drop-shadow(0 4px 12px rgba(0,0,0,0.20))"
    : "drop-shadow(0 8px 24px rgba(0,0,0,0.25))";

  if (!hasValidDimensions) {
    return (
      <div
        className={className}
        style={{ ...style, transition: "none" }}
        data-testid="card-preview-canvas-loading"
      >
        <div
          className="flex items-center justify-center"
          style={{ width: "100%", height: "400px" }}
        >
          <BookOpen className="w-12 h-12 text-muted-foreground/30 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ ...style, transition: "none" }}
      data-testid="card-preview-canvas"
    >
      {framePhotos.topUrl &&
      framePhotos.bottomUrl &&
      framePhotos.leftUrl &&
      framePhotos.rightUrl ? (
        <div
          className="transition-none"
          style={{
            width: `${previewWidth}px`,
            height: `${previewHeight}px`,
            position: "relative",
            backgroundColor: topMatColor.hexColor || "#FFFFFF",
            filter: dropShadow,
          }}
          data-testid="preview-frame-container"
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: `${frameFaceWidth}px`,
              backgroundImage: `url(${framePhotos.topUrl})`,
              backgroundSize: "auto 100%",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "left center",
              zIndex: 10,
              clipPath: `polygon(0 0, 100% 0, calc(100% - ${frameFaceWidth}px) 100%, ${frameFaceWidth}px 100%)`,
            }}
            data-testid="frame-piece-top"
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: `${frameFaceWidth}px`,
              backgroundImage: `url(${framePhotos.bottomUrl})`,
              backgroundSize: "auto 100%",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "left center",
              zIndex: 10,
              clipPath: `polygon(${frameFaceWidth}px 0, calc(100% - ${frameFaceWidth}px) 0, 100% 100%, 0 100%)`,
            }}
            data-testid="frame-piece-bottom"
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: `${frameFaceWidth}px`,
              backgroundImage: `url(${framePhotos.leftUrl})`,
              backgroundSize: "100% auto",
              backgroundRepeat: "repeat-y",
              backgroundPosition: "center top",
              zIndex: 9,
              clipPath: `polygon(0 0, 100% ${frameFaceWidth}px, 100% calc(100% - ${frameFaceWidth}px), 0 100%)`,
            }}
            data-testid="frame-piece-left"
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: `${frameFaceWidth}px`,
              backgroundImage: `url(${framePhotos.rightUrl})`,
              backgroundSize: "100% auto",
              backgroundRepeat: "repeat-y",
              backgroundPosition: "center top",
              zIndex: 9,
              clipPath: `polygon(0 ${frameFaceWidth}px, 100% 0, 100% 100%, 0 calc(100% - ${frameFaceWidth}px))`,
            }}
            data-testid="frame-piece-right"
          />
          <div
            style={{
              position: "absolute",
              top: `${frameLipPx}px`,
              left: `${frameLipPx}px`,
              right: `${frameLipPx}px`,
              bottom: `${frameLipPx}px`,
              overflow: "hidden",
            }}
          >
            {manifest.openings.map((opening, idx) => (
              <div
                key={`opening-${idx}`}
                style={{
                  position: "absolute",
                  left: `${opening.x - frameLipPx}px`,
                  top: `${opening.y - frameLipPx}px`,
                  width: `${opening.width}px`,
                  height: `${opening.height}px`,
                  backgroundColor: backingColor.hexColor || "#FFFFFF",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08), inset 0 0 1px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  overflow: "hidden",
                  zIndex: 1,
                }}
                data-testid={`card-opening-${idx}`}
              >
                {cardImages[idx] ? (
                  <img
                    src={encodeURI(cardImages[idx])}
                    alt={`Card ${idx + 1}`}
                    style={{
                      position: "absolute",
                      left: "2.5%",
                      top: "2.5%",
                      width: "95%",
                      height: "95%",
                      objectFit: "fill",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    data-testid={`card-cover-${idx}`}
                  />
                ) : (
                  <BookOpen
                    className="w-12 h-12 text-muted-foreground/30"
                    data-testid={`card-placeholder-${idx}`}
                  />
                )}
              </div>
            ))}
            {matType !== "none" && (
              <svg width={0} height={0} style={{ position: "absolute" }}>
                <defs>
                  <clipPath
                    id={clipPathIds.bottomMat}
                    clipPathUnits="userSpaceOnUse"
                    clipRule="evenodd"
                  >
                    <path d={bottomMatPath} />
                  </clipPath>
                  {matType === "double" && (
                    <clipPath
                      id={clipPathIds.topMat}
                      clipPathUnits="userSpaceOnUse"
                      clipRule="evenodd"
                    >
                      <path d={topMatPath} />
                    </clipPath>
                  )}
                </defs>
              </svg>
            )}
            {matType !== "none" && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: bottomMatColor.hexColor || "#FFFFFF",
                  backgroundImage: bottomMatTiling.backgroundImage,
                  backgroundSize: bottomMatTiling.backgroundSize,
                  backgroundRepeat: bottomMatTiling.backgroundRepeat,
                  clipPath: `url(#${clipPathIds.bottomMat})`,
                  zIndex: 2,
                }}
                data-testid="bottom-mat-layer"
              />
            )}
            {matType === "double" && (
              <svg
                className="absolute inset-0 pointer-events-none"
                width={Math.max(0, previewWidth - frameLipPx * 2)}
                height={Math.max(0, previewHeight - frameLipPx * 2)}
                style={{ zIndex: 4 }}
              >
                {manifest.openings.map((opening, idx) => {
                  const revealPx = matRevealPx;
                  return (
                    <rect
                      key={`bottom-bevel-${idx}`}
                      x={Math.max(0, opening.x - frameLipPx + revealPx)}
                      y={Math.max(0, opening.y - frameLipPx + revealPx)}
                      width={Math.max(0, opening.width - 2 * revealPx)}
                      height={Math.max(0, opening.height - 2 * revealPx)}
                      fill="none"
                      stroke="#eeeeee"
                      strokeWidth={bevelWidthPx}
                      data-testid={`bottom-opening-bevel-${idx}`}
                    />
                  );
                })}
              </svg>
            )}
            {matType === "double" && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: topMatColor.hexColor || "#FFFFFF",
                  backgroundImage: topMatTiling.backgroundImage,
                  backgroundSize: topMatTiling.backgroundSize,
                  backgroundRepeat: topMatTiling.backgroundRepeat,
                  clipPath: `url(#${clipPathIds.topMat})`,
                  zIndex: 5,
                }}
                data-testid="top-mat-layer"
              />
            )}
            {matType !== "none" && (
              <svg
                className="absolute inset-0 pointer-events-none"
                width={Math.max(0, previewWidth - frameLipPx * 2)}
                height={Math.max(0, previewHeight - frameLipPx * 2)}
                style={{ zIndex: 6 }}
              >
                {manifest.openings.map((opening, idx) => (
                  <rect
                    key={`top-bevel-${idx}`}
                    x={Math.max(0, opening.x - frameLipPx)}
                    y={Math.max(0, opening.y - frameLipPx)}
                    width={Math.max(0, opening.width)}
                    height={Math.max(0, opening.height)}
                    fill="none"
                    stroke="#eeeeee"
                    strokeWidth={bevelWidthPx}
                    data-testid={`top-opening-bevel-${idx}`}
                  />
                ))}
              </svg>
            )}
            {nameplateDimensions && brassNameplateConfig && (
              <div
                style={{
                  position: "absolute",
                  left: `${nameplateDimensions.x - frameLipPx}px`,
                  top: `${nameplateDimensions.y - frameLipPx}px`,
                  zIndex: 5,
                }}
                data-testid="brass-nameplate-container"
              >
                <BrassNameplatePreview config={brassNameplateConfig} scale={previewScale / 150} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="transition-none"
          style={{
            width: `${previewWidth}px`,
            height: `${previewHeight}px`,
            position: "relative",
            backgroundColor: "#e5e5e5",
            border: `${frameFaceWidth}px solid ${selectedFrame.color || "#8B4513"}`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          }}
          data-testid="preview-fallback-container"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Frame preview unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
});

export function useCardPreviewState({
  formatId,
  layoutId,
  matBorder,
  matReveal,
  matType: _matType,
  brassNameplateConfig,
  selectedFrame,
  containerWidth,
  containerHeight,
  cardImages: externalCardImages,
  bottomWeightedExtra = 0,
}: {
  formatId: string;
  layoutId: CardLayoutType;
  matBorder: number;
  matReveal: number;
  matType: "none" | "single" | "double";
  brassNameplateConfig?: BrassNameplateConfig;
  selectedFrame: FrameStyle;
  containerWidth: number;
  containerHeight: number;
  cardImages?: string[];
  bottomWeightedExtra?: number;
}) {
  const format = useMemo(() => getCardFormatById(formatId), [formatId]);
  const layout = useMemo(() => {
    if (!layoutId) return null;
    return getCardLayout(layoutId);
  }, [layoutId]);

  const previewFrameDimensions = useMemo(() => {
    if (!layoutId) return { width: 16, height: 20 + bottomWeightedExtra };
    const dimensions = calculateCardPreviewDimensions(
      layoutId,
      formatId,
      matBorder,
      brassNameplateConfig?.enabled || false
    );
    return { width: dimensions.width, height: dimensions.height + bottomWeightedExtra };
  }, [layoutId, formatId, matBorder, brassNameplateConfig?.enabled, bottomWeightedExtra]);

  const baseFrameDimensions = useMemo(() => {
    if (!format || !layout) return { width: 0, height: 0 };
    const { cardWidth, cardHeight } = format;
    const { rows, columns, spacingFactor } = layout;
    const spacing = cardWidth * spacingFactor;
    const contentWidth = cardWidth * columns + spacing * (columns - 1);
    const contentHeight = cardHeight * rows + spacing * (rows - 1);
    const FIXED_MAT_BORDER = 2.0;
    const frameWidth = contentWidth + FIXED_MAT_BORDER * 2;
    const frameHeight = contentHeight + FIXED_MAT_BORDER * 2 + bottomWeightedExtra;
    return { width: frameWidth, height: frameHeight };
  }, [format, layout, bottomWeightedExtra]);

  const frameDimensions = useMemo(() => {
    if (!layoutId) return { width: 16, height: 20 + bottomWeightedExtra };
    const dimensions = calculateCardFrameSize(
      layoutId,
      formatId,
      matBorder,
      brassNameplateConfig?.enabled || false
    );
    return { width: dimensions.width, height: dimensions.height + bottomWeightedExtra };
  }, [layoutId, formatId, matBorder, brassNameplateConfig?.enabled, bottomWeightedExtra]);

  const previewDimensions = useMemo(() => {
    const frameFaceWidth = selectedFrame.mouldingWidth || 0.75;
    const isMobile = containerWidth < 768;
    const previewMargin = isMobile ? 8 : 24;
    const frameAspectRatio = previewFrameDimensions.height / previewFrameDimensions.width;
    const containerAspectRatio = containerHeight / containerWidth;
    const aspectRatioDiff = Math.abs(frameAspectRatio - containerAspectRatio);
    let effectiveHeight = containerHeight;
    if (aspectRatioDiff > 0.3 && containerWidth > 0) {
      const availableWidth = containerWidth - previewMargin;
      effectiveHeight = availableWidth * frameAspectRatio + previewMargin;
    }
    const scaleResult = getPreviewScale(
      previewFrameDimensions.width,
      previewFrameDimensions.height,
      containerWidth - previewMargin,
      effectiveHeight - previewMargin,
      999
    );
    const frameFaceWidthPx = scaleResult.pixelsPerInch * frameFaceWidth;
    return {
      scale: scaleResult.pixelsPerInch,
      previewWidth: scaleResult.previewWidth,
      previewHeight: scaleResult.previewHeight,
      frameFaceWidth: frameFaceWidthPx,
      isMobile,
    };
  }, [previewFrameDimensions, selectedFrame.mouldingWidth, containerWidth, containerHeight]);

  const manifest = useMemo(() => {
    if (!format || !layout) {
      return { openings: [], frameWidth: 0, frameHeight: 0, matBorder: 0, matReveal: 0 };
    }
    const { cardWidth, cardHeight } = format;
    const { rows, columns, spacingFactor } = layout;
    const pixelsPerInch = previewDimensions.scale;
    return buildMatManifest(
      baseFrameDimensions.width,
      baseFrameDimensions.height,
      matBorder,
      matReveal,
      rows,
      columns,
      cardWidth,
      cardHeight,
      spacingFactor,
      pixelsPerInch
    );
  }, [format, layout, baseFrameDimensions, matBorder, matReveal, previewDimensions.scale]);

  const cardImages = useMemo(() => {
    if (externalCardImages && externalCardImages.length > 0) return externalCardImages;
    return [];
  }, [externalCardImages]);

  const framePhotos = useMemo(() => {
    const frameSku = String(selectedFrame.sku || selectedFrame.id);
    return {
      cornerUrl: getFrameImageUrl(frameSku, "corner"),
      profileUrl: getFrameImageUrl(frameSku, "profile"),
      topUrl: getFrameImageUrl(frameSku, "top"),
      bottomUrl: getFrameImageUrl(frameSku, "bottom"),
      leftUrl: getFrameImageUrl(frameSku, "left"),
      rightUrl: getFrameImageUrl(frameSku, "right"),
    };
  }, [selectedFrame.sku, selectedFrame.id]);

  return {
    frameDimensions,
    baseFrameDimensions,
    previewScale: previewDimensions.scale,
    previewWidth: previewDimensions.previewWidth,
    previewHeight: previewDimensions.previewHeight,
    frameFaceWidth: previewDimensions.frameFaceWidth,
    isMobile: previewDimensions.isMobile,
    manifest,
    cardImages,
    framePhotos,
  };
}
