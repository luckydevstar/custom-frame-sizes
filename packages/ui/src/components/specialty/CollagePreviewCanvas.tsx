/**
 * Collage Preview Canvas Component
 *
 * Renders a realistic picture frame preview showing:
 * - Frame molding (top, bottom, left, right)
 * - Mat configuration (single or double mat with reveal)
 * - Photo openings with support for shapes (rectangle, circle, oval, heart)
 * - Brass plaque (optional)
 */

"use client";

import { memo, useMemo } from "react";
import { Image } from "lucide-react";
import type { FrameStyle } from "@framecraft/types";
import type { Mat } from "@framecraft/config";
import type { BrassNameplateConfig } from "@framecraft/types";
import {
  type CollageLayoutType,
  type OpeningShape,
  type CollageLayout,
  COLLAGE_LAYOUTS,
  DEFAULT_FRAME_MOLDING_WIDTH,
  PLAQUE_FRAME_EXTENSION,
} from "@framecraft/core";
import {
  getMatTilingStyle,
  getMatBevelColor,
  getCollageImagePathsForLayout,
  getAvailableSets,
  getSchoolLayoutPresetImages,
  isSchoolDaysPresetLayout,
} from "@framecraft/core";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";
import { BOTTOM_WEIGHTED_EXTRA } from "./shared/BottomWeightedMatting";

const PLAQUE_BOTTOM_MARGIN = 1.0; // inches from bottom of frame

interface CollagePreviewCanvasProps {
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
  matType: "single" | "double";
  matReveal: number;
  layoutId: CollageLayoutType;
  layout?: CollageLayout;
  containerWidth: number;
  containerHeight: number;
  brassNameplateConfig?: BrassNameplateConfig;
  isMobile: boolean;
  randomSeed?: number;
  bottomWeighted?: boolean;
  className?: string;
  style?: React.CSSProperties;
  userPhotos?: Record<number, string>;
}

function getAdjustedFrameHeight(
  layout: ReturnType<typeof COLLAGE_LAYOUTS.find>,
  nameplateEnabled: boolean,
  bottomWeightedExtra: number = 0
): number {
  if (!layout) return 0;
  return layout.frameHeight + bottomWeightedExtra + (nameplateEnabled ? PLAQUE_FRAME_EXTENSION : 0);
}

function getPlaceholderImage(_shape: OpeningShape, index: number): string {
  const colors = ["#f3f4f6", "#e5e7eb", "#d1d5db"];
  const colorIndex = index % colors.length;

  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <rect fill="${colors[colorIndex]}" width="200" height="200"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280" font-family="sans-serif" font-size="14">Photo ${index + 1}</text>
    </svg>`
  )}`;
}

function generateShapeClipPath(
  shape: OpeningShape,
  id: string,
  width: number,
  height: number
): { clipPath: string; svgDef: JSX.Element | null } {
  switch (shape) {
    case "circle": {
      const r = Math.min(width, height) / 2;
      const cx = width / 2;
      const cy = height / 2;
      return {
        clipPath: `url(#${id})`,
        svgDef: (
          <clipPath id={id} key={id}>
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>
        ),
      };
    }
    case "oval": {
      const rx = width / 2;
      const ry = height / 2;
      const cx = width / 2;
      const cy = height / 2;
      return {
        clipPath: `url(#${id})`,
        svgDef: (
          <clipPath id={id} key={id}>
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
          </clipPath>
        ),
      };
    }
    case "heart": {
      const scale = Math.min(width, height) / 100;
      const offsetX = (width - 100 * scale) / 2;
      const offsetY = (height - 100 * scale) / 2;
      const path = `M ${50 * scale + offsetX},${90 * scale + offsetY} 
        C ${20 * scale + offsetX},${70 * scale + offsetY} 
          ${0 * scale + offsetX},${40 * scale + offsetY} 
          ${25 * scale + offsetX},${20 * scale + offsetY} 
        C ${40 * scale + offsetX},${10 * scale + offsetY} 
          ${50 * scale + offsetX},${15 * scale + offsetY} 
          ${50 * scale + offsetX},${25 * scale + offsetY} 
        C ${50 * scale + offsetX},${15 * scale + offsetY} 
          ${60 * scale + offsetX},${10 * scale + offsetY} 
          ${75 * scale + offsetX},${20 * scale + offsetY} 
        C ${100 * scale + offsetX},${40 * scale + offsetY} 
          ${80 * scale + offsetX},${70 * scale + offsetY} 
          ${50 * scale + offsetX},${90 * scale + offsetY} Z`;
      return {
        clipPath: `url(#${id})`,
        svgDef: (
          <clipPath id={id} key={id}>
            <path d={path} />
          </clipPath>
        ),
      };
    }
    case "rectangle":
    default:
      return {
        clipPath: "none",
        svgDef: null,
      };
  }
}

function generateShapeBorderPath(
  shape: OpeningShape,
  x: number,
  y: number,
  width: number,
  height: number
): JSX.Element {
  switch (shape) {
    case "circle": {
      const r = Math.min(width, height) / 2;
      const cx = x + width / 2;
      const cy = y + height / 2;
      return <circle cx={cx} cy={cy} r={r} fill="none" />;
    }
    case "oval": {
      const rx = width / 2;
      const ry = height / 2;
      const cx = x + width / 2;
      const cy = y + height / 2;
      return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" />;
    }
    case "heart": {
      const scale = Math.min(width, height) / 100;
      const offsetX = x + (width - 100 * scale) / 2;
      const offsetY = y + (height - 100 * scale) / 2;
      const path = `M ${50 * scale + offsetX},${90 * scale + offsetY} 
        C ${20 * scale + offsetX},${70 * scale + offsetY} 
          ${0 * scale + offsetX},${40 * scale + offsetY} 
          ${25 * scale + offsetX},${20 * scale + offsetY} 
        C ${40 * scale + offsetX},${10 * scale + offsetY} 
          ${50 * scale + offsetX},${15 * scale + offsetY} 
          ${50 * scale + offsetX},${25 * scale + offsetY} 
        C ${50 * scale + offsetX},${15 * scale + offsetY} 
          ${60 * scale + offsetX},${10 * scale + offsetY} 
          ${75 * scale + offsetX},${20 * scale + offsetY} 
        C ${100 * scale + offsetX},${40 * scale + offsetY} 
          ${80 * scale + offsetX},${70 * scale + offsetY} 
          ${50 * scale + offsetX},${90 * scale + offsetY} Z`;
      return <path d={path} fill="none" />;
    }
    case "rectangle":
    default:
      return <rect x={x} y={y} width={width} height={height} fill="none" />;
  }
}

export const CollagePreviewCanvas = memo(function CollagePreviewCanvas({
  framePhotos,
  selectedFrame,
  topMatColor,
  bottomMatColor,
  matType,
  matReveal,
  layoutId,
  layout: providedLayout,
  containerWidth,
  containerHeight,
  brassNameplateConfig,
  isMobile,
  randomSeed = 0,
  bottomWeighted = false,
  className,
  style,
  userPhotos = {},
}: CollagePreviewCanvasProps) {
  const layout = useMemo(() => {
    if (providedLayout) return providedLayout;
    return COLLAGE_LAYOUTS.find((l) => l.id === layoutId);
  }, [layoutId, providedLayout]);

  const bottomWeightedExtra = bottomWeighted ? BOTTOM_WEIGHTED_EXTRA : 0;

  const { previewWidth, previewHeight, scale, frameFaceWidth } = useMemo(() => {
    if (!layout) return { previewWidth: 0, previewHeight: 0, scale: 0, frameFaceWidth: 0 };
    const adjustedHeight = getAdjustedFrameHeight(
      layout,
      brassNameplateConfig?.enabled || false,
      bottomWeightedExtra
    );

    const frameAspectRatio = layout.frameWidth / adjustedHeight;
    const containerAspectRatio = containerWidth / containerHeight;

    let width: number;
    let height: number;

    if (frameAspectRatio > containerAspectRatio) {
      width = containerWidth * 0.98;
      height = width / frameAspectRatio;
    } else {
      height = containerHeight * 0.98;
      width = height * frameAspectRatio;
    }

    const scaleValue = width / layout.frameWidth;
    const faceWidth = scaleValue * DEFAULT_FRAME_MOLDING_WIDTH;

    return {
      previewWidth: width,
      previewHeight: height,
      scale: scaleValue,
      frameFaceWidth: faceWidth,
    };
  }, [layout, containerWidth, containerHeight, brassNameplateConfig?.enabled, bottomWeightedExtra]);

  const matRevealPx = scale * matReveal;

  const topMatTiling = useMemo(() => {
    return getMatTilingStyle(topMatColor.name, scale);
  }, [topMatColor.name, scale]);

  const bottomMatTiling = useMemo(() => {
    return getMatTilingStyle(bottomMatColor.name, scale);
  }, [bottomMatColor.name, scale]);

  const MAT_BEVEL_WIDTH = 0.08;

  const bevelColor = useMemo(() => {
    return getMatBevelColor(bottomMatColor.name);
  }, [bottomMatColor.name]);

  const bevelBorderWidth = useMemo(() => {
    return Math.max(1.5, MAT_BEVEL_WIDTH * scale);
  }, [scale]);

  // Get images for collage openings
  // For school-days and k12-school-years layouts, use preset images
  // For other layouts, use set-cohesion logic with rotating photo sets
  const collageInsertPaths = useMemo(() => {
    if (!layout) return [];

    // Check for school layout preset images first
    const presetImages = getSchoolLayoutPresetImages(layoutId);
    if (presetImages) {
      return presetImages;
    }

    // Standard collage inserts with set-cohesion logic
    // Combine randomSeed with layoutId for unique images each visit, consistent within session
    const combinedSeed = `${layoutId}-${randomSeed}`;

    // Rotate through available sets based on layout + seed to use all 3 sets
    const availableSets = getAvailableSets();
    const seedNum = combinedSeed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const selectedSet = availableSets[seedNum % availableSets.length];

    return getCollageImagePathsForLayout(layout.openings.length, combinedSeed, selectedSet);
  }, [layout, layoutId, randomSeed]);

  const nameplateDimensions = useMemo(() => {
    if (!brassNameplateConfig?.enabled) return null;

    const plaqueWidth = scale * 4.5 * 0.8;
    const plaqueHeight = scale * 1.5 * 0.8;
    const bottomMargin = scale * PLAQUE_BOTTOM_MARGIN;

    const plaqueX = (previewWidth - plaqueWidth) / 2;
    const plaqueY = previewHeight - frameFaceWidth - bottomMargin - plaqueHeight;

    return {
      width: plaqueWidth,
      height: plaqueHeight,
      x: plaqueX,
      y: plaqueY,
    };
  }, [brassNameplateConfig?.enabled, scale, previewWidth, previewHeight, frameFaceWidth]);

  // Compute mat area dimensions directly from layout interior (frameSize minus molding)
  // This ensures layout coordinates map exactly to mat area pixels
  const frameMouldingPx = layout ? scale * DEFAULT_FRAME_MOLDING_WIDTH : 0;
  const matAreaWidth = layout ? (layout.frameWidth - 2 * DEFAULT_FRAME_MOLDING_WIDTH) * scale : 0;
  const matAreaHeight = layout
    ? (layout.frameHeight + bottomWeightedExtra - 2 * DEFAULT_FRAME_MOLDING_WIDTH) * scale
    : 0;

  const clipPathDefs = useMemo(() => {
    if (!layout) return [];
    const defs: JSX.Element[] = [];
    layout.openings.forEach((opening, idx) => {
      if (opening.shape !== "rectangle") {
        const w = opening.width * scale - (matType === "double" ? 2 * matRevealPx : 0);
        const h = opening.height * scale - (matType === "double" ? 2 * matRevealPx : 0);
        const { svgDef } = generateShapeClipPath(opening.shape, `clip-${layoutId}-${idx}`, w, h);
        if (svgDef) defs.push(svgDef);
      }
    });
    return defs;
  }, [layout, layoutId, scale, matType, matRevealPx]);

  if (!layout) {
    return (
      <div className={className} style={style}>
        <div className="flex items-center justify-center h-full">
          <Image className="w-12 h-12 text-muted-foreground/30 animate-pulse" />
        </div>
      </div>
    );
  }

  const dropShadow = isMobile
    ? "drop-shadow(0 4px 12px rgba(0,0,0,0.20))"
    : "drop-shadow(0 8px 24px rgba(0,0,0,0.25))";

  return (
    <div
      className={className}
      style={{
        ...style,
        position: "relative",
        width: `${previewWidth}px`,
        height: `${previewHeight}px`,
        margin: "0 auto",
        filter: dropShadow,
      }}
      data-testid="collage-preview-canvas"
    >
      {framePhotos.topUrl &&
      framePhotos.bottomUrl &&
      framePhotos.leftUrl &&
      framePhotos.rightUrl ? (
        <>
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
              bottom: 0,
              left: 0,
              width: `${frameFaceWidth}px`,
              backgroundImage: `url(${framePhotos.leftUrl})`,
              backgroundSize: "100% auto",
              backgroundRepeat: "repeat-y",
              backgroundPosition: "center top",
              zIndex: 10,
              clipPath: `polygon(0 0, 100% ${frameFaceWidth}px, 100% calc(100% - ${frameFaceWidth}px), 0 100%)`,
            }}
          />

          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              width: `${frameFaceWidth}px`,
              backgroundImage: `url(${framePhotos.rightUrl})`,
              backgroundSize: "100% auto",
              backgroundRepeat: "repeat-y",
              backgroundPosition: "center top",
              zIndex: 10,
              clipPath: `polygon(0 ${frameFaceWidth}px, 100% 0, 100% 100%, 0 calc(100% - ${frameFaceWidth}px))`,
            }}
          />
        </>
      ) : (
        <>
          {/* Fallback frame rendering using frame colors when photos aren't available */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: `${frameFaceWidth}px`,
              background: `linear-gradient(180deg, ${selectedFrame.color} 0%, ${selectedFrame.borderColor} 100%)`,
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
              background: `linear-gradient(0deg, ${selectedFrame.color} 0%, ${selectedFrame.borderColor} 100%)`,
              zIndex: 10,
              clipPath: `polygon(${frameFaceWidth}px 0, calc(100% - ${frameFaceWidth}px) 0, 100% 100%, 0 100%)`,
            }}
          />

          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: `${frameFaceWidth}px`,
              background: `linear-gradient(90deg, ${selectedFrame.color} 0%, ${selectedFrame.borderColor} 100%)`,
              zIndex: 10,
              clipPath: `polygon(0 0, 100% ${frameFaceWidth}px, 100% calc(100% - ${frameFaceWidth}px), 0 100%)`,
            }}
          />

          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              width: `${frameFaceWidth}px`,
              background: `linear-gradient(270deg, ${selectedFrame.color} 0%, ${selectedFrame.borderColor} 100%)`,
              zIndex: 10,
              clipPath: `polygon(0 ${frameFaceWidth}px, 100% 0, 100% 100%, 0 calc(100% - ${frameFaceWidth}px))`,
            }}
          />
        </>
      )}

      <div
        style={{
          position: "absolute",
          top: `${frameMouldingPx}px`,
          left: `${frameMouldingPx}px`,
          width: `${matAreaWidth}px`,
          height: `${matAreaHeight}px`,
          zIndex: 5,
        }}
      >
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>{clipPathDefs}</defs>
        </svg>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            ...bottomMatTiling,
          }}
        />

        {brassNameplateConfig?.enabled &&
          (() => {
            const plaqueExtensionPx = scale * PLAQUE_FRAME_EXTENSION;
            return (
              <div
                style={{
                  position: "absolute",
                  top: `${matAreaHeight}px`,
                  left: 0,
                  width: "100%",
                  height: `${plaqueExtensionPx}px`,
                  ...(matType === "double" ? topMatTiling : bottomMatTiling),
                }}
              />
            );
          })()}

        {matType === "double" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              ...topMatTiling,
            }}
          />
        )}

        {matType === "double" && (
          <svg
            className="absolute inset-0 pointer-events-none"
            width={matAreaWidth}
            height={matAreaHeight}
            style={{ zIndex: 4 }}
          >
            {layout.openings.map((opening, idx) => {
              const x = opening.x * scale + matRevealPx;
              const y = opening.y * scale + matRevealPx;
              const w = opening.width * scale - 2 * matRevealPx;
              const h = opening.height * scale - 2 * matRevealPx;
              return (
                <g key={`bottom-bevel-${idx}`} stroke={bevelColor} strokeWidth={bevelBorderWidth}>
                  {generateShapeBorderPath(
                    opening.shape,
                    Math.max(0, x),
                    Math.max(0, y),
                    Math.max(0, w),
                    Math.max(0, h)
                  )}
                </g>
              );
            })}
          </svg>
        )}

        <svg
          className="absolute inset-0 pointer-events-none"
          width={matAreaWidth}
          height={matAreaHeight}
          style={{ zIndex: 6 }}
        >
          {layout.openings.map((opening, idx) => {
            const x = opening.x * scale;
            const y = opening.y * scale;
            const w = opening.width * scale;
            const h = opening.height * scale;
            return (
              <g key={`top-bevel-${idx}`} stroke={bevelColor} strokeWidth={bevelBorderWidth}>
                {generateShapeBorderPath(
                  opening.shape,
                  Math.max(0, x),
                  Math.max(0, y),
                  Math.max(0, w),
                  Math.max(0, h)
                )}
              </g>
            );
          })}
        </svg>

        {layout.openings.map((opening, index) => {
          const x = opening.x * scale;
          const y = opening.y * scale;
          const w = opening.width * scale;
          const h = opening.height * scale;
          const revealPx = matType === "double" ? matRevealPx : 0;

          // Priority: user uploaded photo > preset insert image > placeholder
          const userPhoto = userPhotos[index];
          const insertImagePath = collageInsertPaths[index];
          const imageSrc =
            userPhoto || insertImagePath || getPlaceholderImage(opening.shape, index);
          const clipId = `clip-${layoutId}-${index}`;
          const isNonRect = opening.shape !== "rectangle";

          return (
            <div key={`opening-${index}`}>
              {matType === "double" && (
                <div
                  style={{
                    position: "absolute",
                    left: `${x}px`,
                    top: `${y}px`,
                    width: `${w}px`,
                    height: `${h}px`,
                    backgroundColor: bottomMatColor.hexColor,
                    ...bottomMatTiling,
                    clipPath: isNonRect ? `url(#${clipId}-reveal)` : undefined,
                    overflow: "hidden",
                  }}
                >
                  {isNonRect && (
                    <svg width="0" height="0" style={{ position: "absolute" }}>
                      <defs>
                        {(() => {
                          const { svgDef } = generateShapeClipPath(
                            opening.shape,
                            `${clipId}-reveal`,
                            w,
                            h
                          );
                          return svgDef;
                        })()}
                      </defs>
                    </svg>
                  )}
                </div>
              )}

              <div
                style={{
                  position: "absolute",
                  left: `${x + revealPx}px`,
                  top: `${y + revealPx}px`,
                  width: `${w - 2 * revealPx}px`,
                  height: `${h - 2 * revealPx}px`,
                  overflow: "hidden",
                  clipPath: isNonRect ? `url(#${clipId})` : undefined,
                }}
              >
                <img
                  src={imageSrc}
                  alt={`Vintage family photo collage insert ${index + 1} - warm toned portrait`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: isSchoolDaysPresetLayout(layoutId)
                      ? index === 0
                        ? "center 40%"
                        : "center 30%"
                      : "center",
                    borderRadius: opening.shape === "rectangle" ? "2px" : undefined,
                  }}
                  loading="lazy"
                  data-testid={`img-collage-photo-${index}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {brassNameplateConfig?.enabled && nameplateDimensions && (
        <div
          style={{
            position: "absolute",
            left: `${nameplateDimensions.x}px`,
            top: `${nameplateDimensions.y}px`,
            width: `${nameplateDimensions.width}px`,
            height: `${nameplateDimensions.height}px`,
            zIndex: 15,
          }}
        >
          <BrassNameplatePreview config={brassNameplateConfig} scale={scale * 0.8} />
        </div>
      )}
    </div>
  );
});
