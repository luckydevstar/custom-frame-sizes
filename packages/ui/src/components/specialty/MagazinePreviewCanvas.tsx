"use client";

import { memo, useMemo } from "react";
import { BookOpen } from "lucide-react";
import type { FrameStyle } from "@framecraft/types";
import type { Mat } from "@framecraft/config";
import type { BrassNameplateConfig } from "@framecraft/types";
import type { MagazineLayoutType, MagazineManifest } from "@framecraft/core";
import {
  getPreviewScale,
  getMatTilingStyle,
  getMatBevelColor,
  getMagazineLayout,
  calculateMagazinePreviewDimensions,
  buildMagazineManifest,
  getMagazineSizeById,
  getFrameImageUrl,
} from "@framecraft/core";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";

interface MagazinePreviewCanvasProps {
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
  layout: MagazineLayoutType;
  sizeId: string;
  matBorder: number;
  manifest: MagazineManifest;
  previewScale: number;
  previewWidth: number;
  previewHeight: number;
  frameFaceWidth: number;
  isMobile: boolean;
  magazineCovers: string[];
  brassNameplateConfig?: BrassNameplateConfig;
  bottomWeightedExtra?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const MagazinePreviewCanvas = memo(function MagazinePreviewCanvas({
  framePhotos,
  selectedFrame,
  topMatColor,
  bottomMatColor,
  backingColor,
  matType,
  layout,
  sizeId,
  matBorder,
  manifest,
  previewScale,
  previewWidth,
  previewHeight,
  frameFaceWidth,
  isMobile,
  magazineCovers,
  brassNameplateConfig,
  bottomWeightedExtra: _bottomWeightedExtra = 0,
  className,
  style,
}: MagazinePreviewCanvasProps) {
  const clipPathIds = useMemo(() => {
    const nameplateEnabled = brassNameplateConfig?.enabled ? "true" : "false";
    const stableKey = `${layout}-${sizeId}-${matType}-${matBorder.toFixed(1)}-${nameplateEnabled}`;
    const instanceKey = `${previewWidth.toFixed(0)}-${previewHeight.toFixed(0)}`;
    return {
      bottomMat: `clippath-bottom-${stableKey}-${instanceKey}`,
      topMat: `clippath-top-${stableKey}-${instanceKey}`,
    };
  }, [
    layout,
    sizeId,
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

  const hasValidDimensions = useMemo(
    () =>
      previewWidth > 0 &&
      previewHeight > 0 &&
      frameFaceWidth > 0 &&
      manifest.openings.every((o) => o.width > 0 && o.height > 0),
    [previewWidth, previewHeight, frameFaceWidth, manifest.openings]
  );

  const bottomMatBevelColor = useMemo(
    () => getMatBevelColor(bottomMatColor.name),
    [bottomMatColor.name]
  );
  const topMatBevelColor = useMemo(() => getMatBevelColor(topMatColor.name), [topMatColor.name]);
  const frameLipPx = useMemo(
    () => frameFaceWidth * (selectedFrame.rabbetInsetRatio ?? 0.92),
    [frameFaceWidth, selectedFrame.rabbetInsetRatio]
  );
  const topMatTiling = useMemo(
    () => getMatTilingStyle(topMatColor.name, previewScale),
    [topMatColor.name, previewScale]
  );
  const bottomMatTiling = useMemo(
    () => getMatTilingStyle(bottomMatColor.name, previewScale),
    [bottomMatColor.name, previewScale]
  );

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
        data-testid="magazine-preview-canvas-loading"
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

  const hasFramePhotos =
    framePhotos.topUrl && framePhotos.bottomUrl && framePhotos.leftUrl && framePhotos.rightUrl;

  return (
    <div
      className={className}
      style={{ ...style, transition: "none" }}
      data-testid="magazine-preview-canvas"
    >
      {hasFramePhotos ? (
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
            }}
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
            }}
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
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  zIndex: 1,
                }}
                data-testid={`magazine-opening-${idx}`}
              >
                {magazineCovers[idx] ? (
                  <img
                    key={`cover-${idx}-${magazineCovers[idx]}`}
                    src={encodeURI(magazineCovers[idx]!)}
                    alt={`Magazine ${idx + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    data-testid={`magazine-cover-${idx}`}
                  />
                ) : (
                  <BookOpen
                    className="w-12 h-12 text-muted-foreground/30"
                    data-testid={`magazine-placeholder-${idx}`}
                  />
                )}
              </div>
            ))}
            {matType !== "none" && (
              <svg width="0" height="0" style={{ position: "absolute" }}>
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
                {manifest.openings.map((opening, idx) => (
                  <rect
                    key={`bottom-bevel-${idx}`}
                    x={Math.max(0, opening.x - frameLipPx + matRevealPx)}
                    y={Math.max(0, opening.y - frameLipPx + matRevealPx)}
                    width={Math.max(0, opening.width - 2 * matRevealPx)}
                    height={Math.max(0, opening.height - 2 * matRevealPx)}
                    fill="none"
                    stroke={bottomMatBevelColor}
                    strokeWidth={bevelWidthPx}
                    data-testid={`bottom-opening-bevel-${idx}`}
                  />
                ))}
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
                style={{ zIndex: matType === "double" ? 6 : 4 }}
              >
                {manifest.openings.map((opening, idx) => (
                  <rect
                    key={`top-bevel-${idx}`}
                    x={Math.max(0, opening.x - frameLipPx)}
                    y={Math.max(0, opening.y - frameLipPx)}
                    width={Math.max(0, opening.width)}
                    height={Math.max(0, opening.height)}
                    fill="none"
                    stroke={topMatBevelColor}
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

export function useMagazinePreviewState({
  sizeId,
  layoutId,
  matBorder,
  matReveal,
  matType,
  brassNameplateConfig,
  selectedFrame,
  containerWidth,
  containerHeight,
  bottomWeighted = false,
}: {
  sizeId: string;
  layoutId: MagazineLayoutType;
  matBorder: number;
  matReveal: number;
  matType: "none" | "single" | "double";
  matId?: string;
  matInnerId?: string;
  brassNameplateConfig?: BrassNameplateConfig;
  selectedFrame: FrameStyle;
  containerWidth: number;
  containerHeight: number;
  bottomWeighted?: boolean;
}) {
  const magazineSize = useMemo(() => getMagazineSizeById(sizeId), [sizeId]);
  const layout = useMemo(() => (layoutId ? getMagazineLayout(layoutId) : null), [layoutId]);
  const bottomWeightedExtra = bottomWeighted ? 0.5 : 0;

  const previewFrameDimensions = useMemo(() => {
    if (!layoutId) return { width: 16, height: 20 };
    const dimensions = calculateMagazinePreviewDimensions(
      layoutId,
      sizeId,
      matBorder,
      brassNameplateConfig?.enabled ?? false,
      matType
    );
    return {
      width: dimensions.width,
      height: dimensions.height + bottomWeightedExtra,
    };
  }, [layoutId, sizeId, matBorder, brassNameplateConfig?.enabled, bottomWeightedExtra, matType]);

  const baseFrameDimensions = useMemo(() => {
    if (!magazineSize || !layout) return { width: 0, height: 0 };
    const { width, height } = magazineSize;
    const { rows, columns, spacingFactor } = layout;
    const spacing = width * spacingFactor;
    const contentWidth = width * columns + spacing * (columns - 1);
    const contentHeight = height * rows + spacing * (rows - 1);
    const effectiveMatBorder = matType === "none" ? 0.25 : 2.0;
    const frameWidth = contentWidth + effectiveMatBorder * 2;
    const frameHeight = contentHeight + effectiveMatBorder * 2 + bottomWeightedExtra;
    return { width: frameWidth, height: frameHeight };
  }, [magazineSize, layout, bottomWeightedExtra, matType]);

  const previewScaleResult = useMemo(
    () =>
      getPreviewScale(
        baseFrameDimensions.width,
        baseFrameDimensions.height,
        containerWidth,
        containerHeight,
        100
      ),
    [baseFrameDimensions, containerWidth, containerHeight]
  );

  const manifest = useMemo(
    () =>
      buildMagazineManifest(
        layoutId,
        sizeId,
        matBorder,
        matReveal,
        previewScaleResult.pixelsPerInch,
        brassNameplateConfig?.enabled ?? false,
        bottomWeightedExtra,
        matType
      ),
    [
      layoutId,
      sizeId,
      matBorder,
      matReveal,
      previewScaleResult.pixelsPerInch,
      brassNameplateConfig?.enabled,
      bottomWeightedExtra,
      matType,
    ]
  );

  const previewWidth = useMemo(
    () => Math.round(previewFrameDimensions.width * previewScaleResult.scale),
    [previewFrameDimensions.width, previewScaleResult.scale]
  );
  const previewHeight = useMemo(
    () => Math.round(previewFrameDimensions.height * previewScaleResult.scale),
    [previewFrameDimensions.height, previewScaleResult.scale]
  );
  const frameFaceWidth = useMemo(
    () => selectedFrame.mouldingWidth * previewScaleResult.scale,
    [selectedFrame.mouldingWidth, previewScaleResult.scale]
  );

  const framePhotos = useMemo(() => {
    const sku = String(selectedFrame.sku ?? selectedFrame.id);
    return {
      cornerUrl: getFrameImageUrl(sku, "corner"),
      profileUrl: getFrameImageUrl(sku, "profile"),
      topUrl: getFrameImageUrl(sku, "top"),
      bottomUrl: getFrameImageUrl(sku, "bottom"),
      leftUrl: getFrameImageUrl(sku, "left"),
      rightUrl: getFrameImageUrl(sku, "right"),
    };
  }, [selectedFrame.sku, selectedFrame.id]);

  return {
    manifest,
    previewScale: previewScaleResult.scale,
    previewWidth,
    previewHeight,
    frameFaceWidth,
    previewFrameDimensions,
    baseFrameDimensions,
    framePhotos,
  };
}
