/**
 * Playbill Preview Component
 *
 * Renders a realistic shadowbox frame preview showing:
 * - Frame molding (top, bottom, left, right)
 * - Mat configuration (single or double mat with reveal)
 * - Playbill and ticket openings
 * - Brass plaque (optional)
 */

"use client";

import { memo, useMemo } from "react";
import { FileText } from "lucide-react";
import type { FrameStyle } from "@framecraft/types";
import type { Mat } from "@framecraft/config";
import type { BrassNameplateConfig } from "@framecraft/types";
import type { PlaybillLayoutType } from "@framecraft/core";
import {
  PLAYBILL_LAYOUTS,
  DEFAULT_FRAME_MOLDING_WIDTH,
  getAdjustedFrameHeight,
  PLAQUE_BOTTOM_MARGIN,
  getMatTilingStyle,
  getMatBevelColor,
} from "@framecraft/core";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";

interface PlaybillPreviewProps {
  // Frame configuration
  framePhotos: {
    cornerUrl?: string;
    profileUrl?: string;
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  };
  selectedFrame: FrameStyle;

  // Mat configuration
  topMatColor: Mat;
  bottomMatColor: Mat;
  matType: "none" | "single" | "double";
  matReveal: number; // inches (typically 0.25")

  // Layout
  layoutId: PlaybillLayoutType;

  // Preview dimensions
  containerWidth: number;
  containerHeight: number;

  // Brass plaque
  brassNameplateConfig?: BrassNameplateConfig;

  // Device type
  isMobile: boolean;

  // Bottom weighted matting extra height (0.5" when enabled)
  bottomWeightedExtra?: number;

  // Playbill and ticket insert images (injectable from app level)
  playbillInserts?: string[];
  ticketInserts?: Array<{ image: string; alt: string }>;

  // Optional styling
  className?: string;
  style?: React.CSSProperties;
}

export const PlaybillPreview = memo(function PlaybillPreview({
  framePhotos,
  selectedFrame,
  topMatColor,
  bottomMatColor,
  matType,
  matReveal,
  layoutId,
  containerWidth,
  containerHeight,
  brassNameplateConfig,
  isMobile,
  bottomWeightedExtra = 0,
  playbillInserts = [],
  ticketInserts = [],
  className,
  style,
}: PlaybillPreviewProps) {
  // Get layout configuration
  const layout = useMemo(() => {
    return PLAYBILL_LAYOUTS.find((l) => l.id === layoutId);
  }, [layoutId]);

  // Use provided insert images or empty arrays
  // App level should provide getRandomPlaybillInserts(layout.playbillCount) and getRandomTicketInserts(layout.ticketCount)
  const playbillImages = useMemo(() => {
    if (!layout) return [];
    return playbillInserts.slice(0, layout.playbillCount);
  }, [playbillInserts, layout]);

  const ticketImages = useMemo(() => {
    if (!layout) return [];
    return ticketInserts.slice(0, layout.ticketCount);
  }, [ticketInserts, layout]);

  // Calculate preview dimensions and scale
  const {
    previewWidth,
    previewHeight,
    scale,
    frameFaceWidth,
    adjustedFrameHeight: _adjustedFrameHeight,
  } = useMemo(() => {
    if (!layout) {
      return {
        previewWidth: 0,
        previewHeight: 0,
        scale: 1,
        frameFaceWidth: 0,
        adjustedFrameHeight: 0,
      };
    }

    // Get adjusted frame height (adds space for plaque and bottom weighted matting if enabled)
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
      // Frame is wider than container - fit to width
      width = containerWidth * 0.98; // 98% of container for minimal padding
      height = width / frameAspectRatio;
    } else {
      // Frame is taller than container - fit to height
      height = containerHeight * 0.98; // 98% of container for minimal padding
      width = height * frameAspectRatio;
    }

    // Calculate scale (pixels per inch)
    const scaleValue = width / layout.frameWidth;

    // Frame molding width in pixels
    const faceWidth = scaleValue * DEFAULT_FRAME_MOLDING_WIDTH;

    return {
      previewWidth: width,
      previewHeight: height,
      scale: scaleValue,
      frameFaceWidth: faceWidth,
      adjustedFrameHeight: adjustedHeight,
    };
  }, [layout, containerWidth, containerHeight, brassNameplateConfig?.enabled, bottomWeightedExtra]);

  // Calculate frame lip (rabbet inset)
  const frameLipPx = useMemo(() => {
    const ratio = selectedFrame.rabbetInsetRatio ?? 0.92;
    return frameFaceWidth * ratio;
  }, [frameFaceWidth, selectedFrame.rabbetInsetRatio]);

  // Mat reveal in pixels
  const matRevealPx = scale * matReveal;

  // Calculate mat tiling styles
  const topMatTiling = useMemo(() => {
    return getMatTilingStyle(topMatColor.name, scale);
  }, [topMatColor.name, scale]);

  const bottomMatTiling = useMemo(() => {
    return getMatTilingStyle(bottomMatColor.name, scale);
  }, [bottomMatColor.name, scale]);

  // Mat bevel constants
  const MAT_BEVEL_WIDTH = 0.08; // 0.08" mat beveled edge (standard across all designers)

  // Bevel color (edge of mat openings)
  const bevelColor = useMemo(() => {
    return getMatBevelColor(bottomMatColor.name);
  }, [bottomMatColor.name]);

  // Calculate bevel border width (ensure minimum 1.5px for visibility)
  // Note: scale is already in pixels/inch, so we multiply MAT_BEVEL_WIDTH directly by scale
  const bevelBorderWidth = useMemo(() => {
    return Math.max(1.5, MAT_BEVEL_WIDTH * scale);
  }, [scale]);

  // Calculate brass plaque dimensions
  const nameplateDimensions = useMemo(() => {
    if (!brassNameplateConfig?.enabled) return null;

    const plaqueWidth = scale * 4.5 * 0.8; // 3.6 inches for preview
    const plaqueHeight = scale * 1.5 * 0.8; // 1.2 inches for preview
    const bottomMargin = scale * PLAQUE_BOTTOM_MARGIN; // 1.0" from bottom of frame

    // Center horizontally, position 1" from bottom
    const plaqueX = (previewWidth - plaqueWidth) / 2;
    const plaqueY = previewHeight - frameFaceWidth - bottomMargin - plaqueHeight;

    return {
      width: plaqueWidth,
      height: plaqueHeight,
      x: plaqueX,
      y: plaqueY,
    };
  }, [brassNameplateConfig?.enabled, scale, previewWidth, previewHeight, frameFaceWidth]);

  // Early return after all hooks
  if (!layout) {
    return (
      <div className={className} style={style}>
        <div className="flex items-center justify-center h-full">
          <FileText className="w-12 h-12 text-muted-foreground/30 animate-pulse" />
        </div>
      </div>
    );
  }

  // Generate SVG paths for mats
  // IMPORTANT: Mat area includes frame height + bottomWeightedExtra (but NOT plaque extension)
  // This shows the extra bottom mat border for bottom-weighted matting,
  // while keeping openings from shifting downward when plaque is enabled
  const matAreaWidth = previewWidth - frameLipPx * 2;
  const originalPreviewHeight = scale * (layout.frameHeight + bottomWeightedExtra);
  const matAreaHeight = originalPreviewHeight - frameLipPx * 2;

  // Drop shadow
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
      data-testid="playbill-preview-canvas"
    >
      {/* Frame molding */}
      {framePhotos.topUrl &&
        framePhotos.bottomUrl &&
        framePhotos.leftUrl &&
        framePhotos.rightUrl && (
          <>
            {/* Top */}
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

            {/* Bottom */}
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

            {/* Left */}
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

            {/* Right */}
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
        )}

      {/* Mat area (base height) */}
      <div
        style={{
          position: "absolute",
          top: `${frameLipPx}px`,
          left: `${frameLipPx}px`,
          width: `${matAreaWidth}px`,
          height: `${matAreaHeight}px`,
          zIndex: 5,
        }}
      >
        {/* Bottom/inner mat */}
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

        {/* Mat extension filler for plaque zone (when plaque enabled) */}
        {brassNameplateConfig?.enabled &&
          (() => {
            const plaqueExtensionPx = scale * 0.75; // PLAQUE_FRAME_EXTENSION = 0.75"
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

        {/* Top/outer mat (double mat only) */}
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

        {/* Bottom mat borders (#eeeeee) - around SMALLER openings (inset by reveal) */}
        {matType === "double" && (
          <svg
            className="absolute inset-0 pointer-events-none"
            width={matAreaWidth}
            height={matAreaHeight}
            style={{ zIndex: 4 }}
          >
            {layout.openings.map((opening, idx) => {
              const x = opening.x * scale - frameLipPx + matRevealPx;
              const y = opening.y * scale - frameLipPx + matRevealPx;
              const w = opening.width * scale - 2 * matRevealPx;
              const h = opening.height * scale - 2 * matRevealPx;
              return (
                <rect
                  key={`bottom-bevel-${idx}`}
                  x={Math.max(0, x)}
                  y={Math.max(0, y)}
                  width={Math.max(0, w)}
                  height={Math.max(0, h)}
                  fill="none"
                  stroke={bevelColor}
                  strokeWidth={bevelBorderWidth}
                />
              );
            })}
          </svg>
        )}

        {/* Top mat borders (#eeeeee) - around LARGER openings */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={matAreaWidth}
          height={matAreaHeight}
          style={{ zIndex: 6 }}
        >
          {layout.openings.map((opening, idx) => {
            const x = opening.x * scale - frameLipPx;
            const y = opening.y * scale - frameLipPx;
            const w = opening.width * scale;
            const h = opening.height * scale;
            return (
              <rect
                key={`top-bevel-${idx}`}
                x={Math.max(0, x)}
                y={Math.max(0, y)}
                width={Math.max(0, w)}
                height={Math.max(0, h)}
                fill="none"
                stroke={bevelColor}
                strokeWidth={bevelBorderWidth}
              />
            );
          })}
        </svg>

        {/* Openings */}
        {(() => {
          let playbillIndex = 0;
          let ticketIndex = 0;
          return layout.openings.map((opening, index) => {
            const x = opening.x * scale - frameLipPx;
            const y = opening.y * scale - frameLipPx;
            const w = opening.width * scale;
            const h = opening.height * scale;
            const revealPx = matType === "double" ? matRevealPx : 0;

            // Get insert image based on opening type
            const playbillImageUrl =
              opening.type === "playbill" ? playbillImages[playbillIndex++] : null;
            const ticket = opening.type === "ticket" ? ticketImages[ticketIndex++] : null;

            return (
              <div key={`opening-${index}`}>
                {/* Top mat reveal cutout (double mat only) */}
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
                    }}
                  />
                )}

                {/* Opening content area */}
                <div
                  style={{
                    position: "absolute",
                    left: `${x + revealPx}px`,
                    top: `${y + revealPx}px`,
                    width: `${w - 2 * revealPx}px`,
                    height: `${h - 2 * revealPx}px`,
                    overflow: "hidden",
                  }}
                >
                  {opening.type === "playbill"
                    ? /* Playbill insert image */
                      playbillImageUrl && (
                        <img
                          src={playbillImageUrl}
                          alt="Playbill insert"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "2px",
                          }}
                          loading="lazy"
                          data-testid={`playbill-insert-${index}`}
                        />
                      )
                    : /* Ticket insert image */
                      ticket && (
                        <img
                          src={ticket.image}
                          alt={ticket.alt}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "2px",
                          }}
                          loading="lazy"
                          data-testid={`img-playbill-ticket-${index}`}
                        />
                      )}
                </div>
              </div>
            );
          });
        })()}
      </div>

      {/* Brass plaque */}
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
