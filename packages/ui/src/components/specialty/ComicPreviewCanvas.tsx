import { memo, useMemo } from "react";
import { BookOpen } from "lucide-react";
import type { FrameStyle } from "@framecraft/types";
import type { Mat } from "@framecraft/config";
import type { BrassNameplateConfig } from "@framecraft/types";
import type { ComicLayoutType } from "@framecraft/core";
import type { MatManifest } from "@framecraft/core";
import {
  buildMatManifest,
  getPreviewScale,
  getMatTilingStyle,
  getMatBevelColor,
  getComicLayout,
  calculateComicFrameSize,
  calculateComicPreviewDimensions,
  getComicFormatById,
} from "@framecraft/core";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";

interface ComicPreviewCanvasProps {
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
  backingColor: Mat;
  matType: "none" | "single" | "double";

  // Layout and dimensions
  layout: ComicLayoutType;
  formatId: string; // For stable clipPath IDs
  matBorder: number; // For stable clipPath IDs
  manifest: MatManifest;
  previewScale: number;
  previewWidth: number;
  previewHeight: number;
  frameFaceWidth: number;
  isMobile: boolean; // For responsive shadow scaling

  // Comic covers (injectable from app level)
  comicCovers: string[];

  // Brass plaque
  brassNameplateConfig?: BrassNameplateConfig;

  // Optional styling
  className?: string;
  style?: React.CSSProperties;
}

export const ComicPreviewCanvas = memo(function ComicPreviewCanvas({
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
  comicCovers,
  brassNameplateConfig,
  className,
  style,
}: ComicPreviewCanvasProps) {
  // Generate unique clipPath IDs per preview instance
  // Include preview dimensions to ensure fullscreen and regular previews have distinct IDs
  // This prevents DOM ID collisions when both previews are mounted simultaneously
  const clipPathIds = useMemo(() => {
    const nameplateEnabled = brassNameplateConfig?.enabled ? "true" : "false";
    const stableKey = `${layout}-${formatId}-${matType}-${matBorder.toFixed(1)}-${nameplateEnabled}`;
    // Include dimensions to make IDs unique per instance (fixes fullscreen/regular preview collision)
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

  // Calculate mat reveal in pixels (uses manifest value, defaults to 0.25" only if undefined/null)
  // CRITICAL: Use ?? instead of || to prevent 0 from being falsy and triggering fallback
  const matRevealPx = useMemo(() => {
    const revealInches = manifest.matReveal ?? 0.25;
    return previewScale * revealInches;
  }, [previewScale, manifest.matReveal]);

  // Border width calculation for opening borders (0.06 inches)
  const bevelWidthPx = useMemo(() => {
    const width = previewScale * 0.06;
    return Math.max(1, isNaN(width) || !isFinite(width) ? 1 : width);
  }, [previewScale]);

  // Safety guard: Ensure all dimensions are positive to prevent SVG errors
  // This guards against race conditions during layout transitions
  const hasValidDimensions = useMemo(() => {
    return (
      previewWidth > 0 &&
      previewHeight > 0 &&
      frameFaceWidth > 0 &&
      manifest.openings.every((opening) => opening.width > 0 && opening.height > 0)
    );
  }, [previewWidth, previewHeight, frameFaceWidth, manifest.openings]);

  // Bevel color based on bottom mat (the mat that shows at opening edges)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _bevelColor = useMemo(() => {
    return getMatBevelColor(bottomMatColor.name);
  }, [bottomMatColor.name]);

  // Frame lip positioning - accounts for frame rabbet inset ratio
  const frameLipPx = useMemo(() => {
    const ratio = selectedFrame.rabbetInsetRatio ?? 0.92;
    return frameFaceWidth * ratio;
  }, [frameFaceWidth, selectedFrame.rabbetInsetRatio]);

  // Calculate mat tiling styles
  const topMatTiling = useMemo(() => {
    return getMatTilingStyle(topMatColor.name, previewScale);
  }, [topMatColor.name, previewScale]);

  const bottomMatTiling = useMemo(() => {
    return getMatTilingStyle(bottomMatColor.name, previewScale);
  }, [bottomMatColor.name, previewScale]);

  // Calculate brass plaque dimensions and position
  const nameplateDimensions = useMemo(() => {
    if (!brassNameplateConfig?.enabled) return null;

    // Scale down by 20% for preview (0.8x)
    const plaqueWidth = previewScale * 4.5 * 0.8; // 3.6 inches for preview
    const plaqueHeight = previewScale * 1.5 * 0.8; // 1.2 inches for preview
    const bottomMargin = previewScale * 0.85; // 0.85" from bottom of frame (0.7" + 0.15")

    // Position plaque offset 0.5" left of center, 0.85" from bottom
    const plaqueX = (previewWidth - plaqueWidth) / 2 - previewScale * 0.5;
    const plaqueY = previewHeight - frameFaceWidth - bottomMargin - plaqueHeight;

    return {
      width: plaqueWidth,
      height: plaqueHeight,
      x: plaqueX,
      y: plaqueY,
    };
  }, [brassNameplateConfig?.enabled, previewScale, previewWidth, previewHeight, frameFaceWidth]);

  // Generate SVG path for bottom mat (SMALLER openings - inset by reveal)
  // This creates the colored border that shows through the top mat
  // Coordinates must be relative to mat area (inside frame lip), not full preview
  const bottomMatPath = useMemo(() => {
    if (manifest.openings.length === 0) return "";

    // Mat area dimensions (inside frame lip) - guard against negative values
    const matWidth = Math.max(0, previewWidth - frameLipPx * 2);
    const matHeight = Math.max(0, previewHeight - frameLipPx * 2);

    // Start with full rectangle (outer boundary of mat area)
    const fullRect = `M 0,0 L ${matWidth},0 L ${matWidth},${matHeight} L 0,${matHeight} Z`;

    // Bottom mat has SMALLER openings (inset by reveal) to show colored border
    const revealPx = matType === "double" ? matRevealPx : 0;
    const openingRects = manifest.openings
      .map((opening) => {
        // Move position inward by reveal amount
        const x = Math.max(0, opening.x - frameLipPx + revealPx);
        const y = Math.max(0, opening.y - frameLipPx + revealPx);
        // Reduce dimensions by 2x reveal (both sides) - guard against negative values
        const w = Math.max(0, opening.width - 2 * revealPx);
        const h = Math.max(0, opening.height - 2 * revealPx);
        return `M ${x},${y} L ${x + w},${y} L ${x + w},${y + h} L ${x},${y + h} Z`;
      })
      .join(" ");

    return `${fullRect} ${openingRects}`;
  }, [manifest.openings, previewWidth, previewHeight, frameLipPx, matType, matRevealPx]);

  // Generate SVG path for top mat (REGULAR openings - no inset)
  // This covers most of the bottom mat, allowing the reveal to show through
  // Coordinates must be relative to mat area (inside frame lip), not full preview
  const topMatPath = useMemo(() => {
    if (matType !== "double" || manifest.openings.length === 0) return "";

    // Mat area dimensions (inside frame lip) - guard against negative values
    const matWidth = Math.max(0, previewWidth - frameLipPx * 2);
    const matHeight = Math.max(0, previewHeight - frameLipPx * 2);

    // Start with full rectangle (outer boundary of mat area)
    const fullRect = `M 0,0 L ${matWidth},0 L ${matWidth},${matHeight} L 0,${matHeight} Z`;

    // Top mat has REGULAR openings (no inset) - larger than bottom mat
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

  // Responsive drop shadow: smaller on mobile for less clearance, full on desktop
  const dropShadow = isMobile
    ? "drop-shadow(0 4px 12px rgba(0,0,0,0.20))" // Mobile: compact shadow
    : "drop-shadow(0 8px 24px rgba(0,0,0,0.25))"; // Desktop: full depth

  // Early return if dimensions are invalid to prevent SVG errors
  if (!hasValidDimensions) {
    return (
      <div
        className={className}
        style={{ ...style, transition: "none" }}
        data-testid="comic-preview-canvas-loading"
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
      data-testid="comic-preview-canvas"
    >
      {framePhotos.topUrl &&
      framePhotos.bottomUrl &&
      framePhotos.leftUrl &&
      framePhotos.rightUrl ? (
        // Photo-based preview with four-piece frame construction
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
          {/* Frame pieces */}
          {/* Top frame piece */}
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
              clipPath: `polygon(
                0 0,
                100% 0,
                calc(100% - ${frameFaceWidth}px) 100%,
                ${frameFaceWidth}px 100%
              )`,
            }}
            data-testid="frame-piece-top"
          />

          {/* Bottom frame piece */}
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
              clipPath: `polygon(
                ${frameFaceWidth}px 0,
                calc(100% - ${frameFaceWidth}px) 0,
                100% 100%,
                0 100%
              )`,
            }}
            data-testid="frame-piece-bottom"
          />

          {/* Left frame piece */}
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
            data-testid="frame-piece-left"
          />

          {/* Right frame piece */}
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
            data-testid="frame-piece-right"
          />

          {/* Mat area (inside frame lip) */}
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
            {/* Comic openings (backing color visible through openings) */}
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
                data-testid={`comic-opening-${idx}`}
              >
                {/* Comic cover image (95% size - 5% smaller for subtle inset) */}
                {comicCovers[idx] ? (
                  <img
                    key={`cover-${idx}-${comicCovers[idx]}`}
                    src={encodeURI(comicCovers[idx])}
                    alt={`Comic ${idx + 1}`}
                    style={{
                      width: "95%",
                      height: "95%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      console.error("[Comic Preview] Failed to load cover:", comicCovers[idx]);
                      e.currentTarget.style.display = "none";
                    }}
                    data-testid={`comic-cover-${idx}`}
                  />
                ) : (
                  <BookOpen
                    className="w-12 h-12 text-muted-foreground/30"
                    data-testid={`comic-placeholder-${idx}`}
                  />
                )}
              </div>
            ))}

            {/* SVG Definitions for clip paths */}
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

            {/* Bottom mat layer (shows colored reveal at opening edges) */}
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

            {/* Bottom mat borders (#eeeeee, 0.08") - around SMALLER openings (inset by reveal) */}
            {matType === "double" && (
              <svg
                className="absolute inset-0 pointer-events-none"
                width={Math.max(0, previewWidth - frameLipPx * 2)}
                height={Math.max(0, previewHeight - frameLipPx * 2)}
                style={{ zIndex: 4 }}
              >
                {manifest.openings.map((opening, idx) => {
                  // Bottom mat borders sit at the outer edge of bottom mat (where it meets reveal)
                  // NO additional inset - stroke straddles the edge (half on mat, half on reveal)
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

            {/* Top mat layer (double mat only - covers most of bottom mat) */}
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

            {/* Top mat borders (#eeeeee, 0.08") - around LARGER openings */}
            {matType !== "none" && (
              <svg
                className="absolute inset-0 pointer-events-none"
                width={Math.max(0, previewWidth - frameLipPx * 2)}
                height={Math.max(0, previewHeight - frameLipPx * 2)}
                style={{ zIndex: 6 }}
              >
                {manifest.openings.map((opening, idx) => {
                  // Top mat borders sit at the inner edge of top mat opening
                  // NO inset - stroke straddles the edge (half on mat, half on comic)
                  return (
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
                  );
                })}
              </svg>
            )}

            {/* Brass plaque (if enabled) */}
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
        // Fallback: Simple preview without frame photos
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

/**
 * Hook for managing comic preview state
 * Consolidates preview sizing, manifest building, and cover generation
 */
export function useComicPreviewState({
  formatId,
  layoutId,
  matBorder,
  matReveal,
  matType: _matType,
  matId: _matId,
  matInnerId: _matInnerId,
  brassNameplateConfig,
  selectedFrame,
  containerWidth,
  containerHeight,
  bottomWeightedExtra = 0,
  // Comic covers can be provided directly, or use getCoversForConfig if provided
  comicCovers,
  getCoversForConfig,
}: {
  formatId: string;
  layoutId: ComicLayoutType;
  matBorder: number;
  matReveal: number;
  matType: "none" | "single" | "double";
  matId: string;
  matInnerId?: string;
  brassNameplateConfig?: BrassNameplateConfig;
  selectedFrame: FrameStyle;
  containerWidth: number;
  containerHeight: number;
  bottomWeightedExtra?: number;
  // Comic covers can be provided directly, or use getCoversForConfig if provided
  comicCovers?: string[];
  getCoversForConfig?: (formatId: string, layoutId: ComicLayoutType, count: number) => string[];
}) {
  // Get comic format and layout details
  const format = useMemo(() => getComicFormatById(formatId), [formatId]);
  const layout = useMemo(() => {
    // Return null if no layout selected yet
    if (!layoutId) {
      return null;
    }
    return getComicLayout(layoutId);
  }, [layoutId]);

  // Calculate preview frame dimensions using fixed 2" mat border for on-screen rendering
  const previewFrameDimensions = useMemo(() => {
    // Return default dimensions if no layout selected yet
    if (!layoutId) {
      return { width: 16, height: 20 + bottomWeightedExtra };
    }

    const dimensions = calculateComicPreviewDimensions(
      layoutId,
      formatId,
      matBorder,
      brassNameplateConfig?.enabled || false
    );

    return {
      width: dimensions.width,
      height: dimensions.height + bottomWeightedExtra,
    };
  }, [layoutId, formatId, matBorder, brassNameplateConfig?.enabled, bottomWeightedExtra]);

  // Calculate base frame dimensions (without plaque) for manifest calculations
  const baseFrameDimensions = useMemo(() => {
    if (!format || !layout) return { width: 0, height: 0 };

    const { comicWidth, comicHeight } = format;
    const { rows, columns, spacingFactor } = layout;

    // Calculate spacing between comics
    const spacing = comicWidth * spacingFactor;

    // Calculate total content area
    const contentWidth = comicWidth * columns + spacing * (columns - 1);
    const contentHeight = comicHeight * rows + spacing * (rows - 1);

    // Fixed 2-inch mat border on all sides for on-screen rendering
    const FIXED_MAT_BORDER = 2.0;
    const frameWidth = contentWidth + FIXED_MAT_BORDER * 2;
    const frameHeight = contentHeight + FIXED_MAT_BORDER * 2 + bottomWeightedExtra;

    return { width: frameWidth, height: frameHeight };
  }, [format, layout, bottomWeightedExtra]);

  // Calculate total frame dimensions including plaque using centralized function
  // This ensures pricing and preview use the same dimensions
  const frameDimensions = useMemo(() => {
    // Return default dimensions if no layout selected yet
    if (!layoutId) {
      return { width: 16, height: 20 + bottomWeightedExtra };
    }

    const dimensions = calculateComicFrameSize(
      layoutId,
      formatId,
      matBorder,
      brassNameplateConfig?.enabled || false
    );

    return {
      width: dimensions.width,
      height: dimensions.height + bottomWeightedExtra,
    };
  }, [layoutId, formatId, matBorder, brassNameplateConfig?.enabled, bottomWeightedExtra]);

  // Calculate preview scale and dimensions using preview frame dimensions (not manufacturing)
  const previewDimensions = useMemo(() => {
    const frameFaceWidth = selectedFrame.mouldingWidth || 0.75;

    // Responsive margin: 8px mobile (<768px), 24px desktop
    // Align with Tailwind md: breakpoint and useIsMobile() hook (768px)
    // Smaller margin on mobile maximizes preview size without sacrificing drop shadow
    const isMobile = containerWidth < 768;
    const previewMargin = isMobile ? 8 : 24;

    // Guard against stale container dimensions during layout transitions
    // Calculate expected aspect ratio and compare with actual container aspect ratio
    const frameAspectRatio = previewFrameDimensions.height / previewFrameDimensions.width;
    const containerAspectRatio = containerHeight / containerWidth;
    const aspectRatioDiff = Math.abs(frameAspectRatio - containerAspectRatio);

    // If aspect ratios differ significantly (>30%), container dimensions are likely stale
    // Use estimated height based on frame aspect ratio and container width
    let effectiveHeight = containerHeight;
    if (aspectRatioDiff > 0.3 && containerWidth > 0) {
      // Calculate expected height based on frame aspect ratio and available width
      const availableWidth = containerWidth - previewMargin;
      effectiveHeight = availableWidth * frameAspectRatio + previewMargin;
    }

    // Calculate preview scale to fit container using preview dimensions (with fixed 2" borders)
    // Use 999 as max scale to allow proper screen-sized preview (pixels per inch)
    // Responsive margin system: mobile 8px, desktop 24px (safety guards prevent negative dimensions)
    const scaleResult = getPreviewScale(
      previewFrameDimensions.width,
      previewFrameDimensions.height,
      containerWidth - previewMargin,
      effectiveHeight - previewMargin,
      999 // Allow scaling up for screen display
    );

    const frameFaceWidthPx = scaleResult.pixelsPerInch * frameFaceWidth;

    return {
      scale: scaleResult.pixelsPerInch,
      previewWidth: scaleResult.previewWidth,
      previewHeight: scaleResult.previewHeight,
      frameFaceWidth: frameFaceWidthPx,
      isMobile, // Pass mobile state for shadow scaling
    };
  }, [previewFrameDimensions, selectedFrame.mouldingWidth, containerWidth, containerHeight]);

  // Build mat manifest with opening positions
  const manifest = useMemo(() => {
    if (!format || !layout) {
      return {
        openings: [],
        frameWidth: 0,
        frameHeight: 0,
        matBorder: 0,
        matReveal: 0,
      };
    }

    const { comicWidth, comicHeight } = format;
    const { rows, columns, spacingFactor } = layout;

    // Use the correct pixels-per-inch scale (min of width/height constraints)
    // This ensures all axes use the same scale for even mat borders
    const pixelsPerInch = previewDimensions.scale;

    return buildMatManifest(
      baseFrameDimensions.width, // Frame dimensions in INCHES (without plaque)
      baseFrameDimensions.height,
      matBorder,
      matReveal,
      rows,
      columns,
      comicWidth,
      comicHeight,
      spacingFactor,
      pixelsPerInch // Actual pixels-per-inch scale
    );
  }, [format, layout, baseFrameDimensions, matBorder, matReveal, previewDimensions.scale]);

  // Generate deterministic comic covers based on configuration
  const finalComicCovers = useMemo(() => {
    // If comic covers are provided directly, use them
    if (comicCovers && comicCovers.length > 0) {
      return comicCovers;
    }

    // Otherwise, use getCoversForConfig if provided
    if (getCoversForConfig && layout) {
      return getCoversForConfig(formatId, layoutId, layout.count);
    }

    // Return empty array if no layout selected yet or no covers provided
    if (!layout) {
      return [];
    }

    // Fallback: return empty array
    return [];
  }, [comicCovers, getCoversForConfig, formatId, layoutId, layout]);

  // Get frame photo URLs (use SKU for file paths)
  const framePhotos = useMemo(() => {
    const frameSku = selectedFrame.sku || selectedFrame.id;
    return {
      cornerUrl: `/frames/${frameSku}/corner.jpg`,
      profileUrl: `/frames/${frameSku}/profile.jpg`,
      topUrl: `/frames/${frameSku}/top.jpg`,
      bottomUrl: `/frames/${frameSku}/bottom.jpg`,
      leftUrl: `/frames/${frameSku}/left.jpg`,
      rightUrl: `/frames/${frameSku}/right.jpg`,
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
    comicCovers: finalComicCovers,
    framePhotos,
  };
}
