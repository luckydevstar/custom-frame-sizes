import { memo, useMemo } from "react";
import { Shirt } from "lucide-react";
import type { FrameStyle } from "@framecraft/types";
import type { MatOption } from "@framecraft/core";
import type { JerseyLayoutType } from "@framecraft/core";
import type { BrassNameplateConfig } from "@framecraft/types";
import {
  computePreviewLayout,
  getMatTilingStyle,
  getMatBevelColor,
  generateOpeningPaths,
} from "@framecraft/core";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";

function getBackingStyles(backing: MatOption): React.CSSProperties {
  return { backgroundColor: backing.hex };
}

interface JerseyPreviewCanvasProps {
  // Core display data
  layout: ReturnType<typeof computePreviewLayout>;
  framePhotos: {
    cornerUrl?: string;
    profileUrl?: string;
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  };
  matPaths: {
    bottomMatPath: string;
    topMatPath: string;
    openingsPx: Array<{ x: number; y: number; width: number; height: number }>;
  } | null;

  // Configuration
  selectedLayout: JerseyLayoutType;
  currentLayout: {
    id: JerseyLayoutType;
    name: string;
    frameInteriorWidth: number;
    frameInteriorHeight: number;
    openings: Array<{
      purpose: "jersey-display" | "photo" | "plaque";
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
    matReveal: number;
  };
  selectedFrame: FrameStyle;
  topMatColor: MatOption;
  bottomMatColor: MatOption;
  backingColor: MatOption;

  // Brass plaque configuration
  brassNameplateConfig: BrassNameplateConfig;

  // Bottom-weighted matting extra (0.5" when enabled, 0 when disabled)
  bottomWeightedExtra?: number;

  // V-Groove configuration
  vGroove?: { enabled: boolean; offsetIn: number };

  // Optional styling overrides
  className?: string;
  style?: React.CSSProperties;
}

export const JerseyPreviewCanvas = memo(function JerseyPreviewCanvas({
  layout,
  framePhotos,
  matPaths,
  selectedLayout,
  currentLayout,
  selectedFrame,
  topMatColor,
  bottomMatColor,
  backingColor,
  brassNameplateConfig,
  bottomWeightedExtra: _bottomWeightedExtra = 0,
  vGroove: _vGroove,
  className,
  style,
}: JerseyPreviewCanvasProps) {
  // Generate unique clipPath IDs to avoid collisions between multiple preview instances
  const clipPathIds = useMemo(
    () => ({
      bottomMat: `jersey-bottom-mat-${selectedLayout}-${Date.now()}`,
      topMat: `jersey-top-mat-${selectedLayout}-${Date.now()}`,
    }),
    [selectedLayout]
  );

  // Compute preview scale for mat tiling (pixels per inch)
  const previewScale = useMemo(() => {
    // Calculate scale based on layout dimensions
    return layout.glassPx.w / currentLayout.frameInteriorWidth;
  }, [layout.glassPx.w, currentLayout.frameInteriorWidth]);

  // Bevel stroke width calculation (1/16" = 0.1 inches)
  // previewScale already represents pixels-per-inch, no need to multiply by INCHES_TO_PX
  const bevelStrokeWidth = useMemo(() => {
    return Math.max(2, 0.1 * previewScale);
  }, [previewScale]);

  // Bevel color based on bottom mat (the mat that shows at the opening edge)
  const bevelColor = useMemo(() => {
    return getMatBevelColor(bottomMatColor.name);
  }, [bottomMatColor.name]);

  // Generate individual opening paths for bevel rendering (premium layouts only)
  const openingPaths = useMemo(() => {
    if (!matPaths || !matPaths.openingsPx) return [];
    return generateOpeningPaths(matPaths.openingsPx);
  }, [matPaths]);

  // Shared helper to render premium multi-opening placeholders + SVG bevel overlay
  const renderPremiumOpenings = () => {
    if (!matPaths) return null;

    return (
      <>
        {/* Opening placeholders for each cutout */}
        {matPaths.openingsPx.map((opening, idx) => {
          const purpose = currentLayout.openings[idx]?.purpose;

          return (
            <div
              key={`opening-${idx}`}
              style={{
                position: "absolute",
                left: `${opening.x}px`,
                top: `${opening.y}px`,
                width: `${opening.width}px`,
                height: `${opening.height}px`,
                ...getBackingStyles(backingColor),
                // Depth shadow only (bevel now rendered via SVG)
                boxShadow: "inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1, // Below mat layers (bottom: 2, top: 3) so reveal is visible
                transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
              }}
            >
              {purpose === "jersey-display" && (
                <Shirt className="w-12 h-12 text-muted-foreground/30" />
              )}
              {purpose === "photo" && <div className="text-xs text-muted-foreground">Photo</div>}
              {purpose === "plaque" && brassNameplateConfig.enabled && (
                <BrassNameplatePreview config={brassNameplateConfig} scale={previewScale / 150} />
              )}
            </div>
          );
        })}

        {/* SVG bevel overlay - renders beveled edges for all openings */}
        {openingPaths.length > 0 && (
          <svg
            className="absolute inset-0 pointer-events-none"
            width={layout.glassPx.w}
            height={layout.glassPx.h}
            style={{ zIndex: 4, overflow: "visible" }}
          >
            {openingPaths.map((path, idx) => (
              <path
                key={`bevel-${idx}`}
                d={path}
                fill="none"
                stroke={bevelColor}
                strokeWidth={bevelStrokeWidth}
                strokeLinejoin="round"
                style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.1))" }}
              />
            ))}
          </svg>
        )}
      </>
    );
  };

  return (
    <div className={className} style={style} data-testid="jersey-preview-canvas">
      {/* SVG Definitions for Premium multi-opening clip paths (shared by both render paths) */}
      {(selectedLayout === "premium-small" ||
        selectedLayout === "premium-regular" ||
        selectedLayout === "premium-large") &&
        matPaths && (
          <svg width="0" height="0" style={{ position: "absolute" }}>
            <defs>
              <clipPath
                id={clipPathIds.bottomMat}
                clipPathUnits="userSpaceOnUse"
                clipRule="evenodd"
              >
                <path d={matPaths.bottomMatPath} />
              </clipPath>
              <clipPath id={clipPathIds.topMat} clipPathUnits="userSpaceOnUse" clipRule="evenodd">
                <path d={matPaths.topMatPath} />
              </clipPath>
            </defs>
          </svg>
        )}

      {framePhotos.topUrl &&
      framePhotos.bottomUrl &&
      framePhotos.leftUrl &&
      framePhotos.rightUrl ? (
        // Photo-based preview - four-piece frame construction with actual frame edge images
        <div
          style={{
            width: `${layout.outerPx.w}px`,
            height: `${layout.outerPx.h}px`,
            position: "relative",
          }}
        >
          {/* Top frame piece */}
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
              clipPath: `polygon(
              0 0, 
              100% 0, 
              calc(100% - ${layout.frameFacePx}px) 100%, 
              ${layout.frameFacePx}px 100%
            )`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          />

          {/* Bottom frame piece */}
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
              clipPath: `polygon(
              ${layout.frameFacePx}px 0, 
              calc(100% - ${layout.frameFacePx}px) 0, 
              100% 100%, 
              0 100%
            )`,
              boxShadow: "0 -2px 8px rgba(0,0,0,0.15)",
            }}
          />

          {/* Left frame piece */}
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
              clipPath: `polygon(
              0 0, 
              100% ${layout.frameFacePx}px, 
              100% calc(100% - ${layout.frameFacePx}px), 
              0 100%
            )`,
              boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
            }}
          />

          {/* Right frame piece */}
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
              clipPath: `polygon(
              0 ${layout.frameFacePx}px, 
              100% 0, 
              100% 100%, 
              0 calc(100% - ${layout.frameFacePx}px)
            )`,
              boxShadow: "-2px 0 8px rgba(0,0,0,0.15)",
            }}
          />

          {/* Mat/backing area - sits inside the frame */}
          <div
            style={{
              position: "absolute",
              top: `${layout.frameFacePx}px`,
              left: `${layout.frameFacePx}px`,
              right: `${layout.frameFacePx}px`,
              bottom: `${layout.frameFacePx}px`,
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            {(selectedLayout === "premium-small" ||
              selectedLayout === "premium-regular" ||
              selectedLayout === "premium-large") &&
            matPaths ? (
              // Premium layouts: Multi-opening with SVG clip paths and double mat layers
              <>
                {/* Bottom mat layer - smaller openings */}
                <div
                  className="absolute inset-0"
                  style={{
                    ...getMatTilingStyle(bottomMatColor.name, previewScale, bottomMatColor.hex),
                    clipPath: `url(#${clipPathIds.bottomMat})`,
                    transition: "background 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                    zIndex: 2,
                  }}
                />

                {/* Top mat layer - larger openings */}
                <div
                  className="absolute inset-0"
                  style={{
                    ...getMatTilingStyle(topMatColor.name, previewScale, topMatColor.hex),
                    clipPath: `url(#${clipPathIds.topMat})`,
                    transition: "background 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                    zIndex: 3,
                  }}
                />

                {/* Render openings with SVG bevel overlay */}
                {renderPremiumOpenings()}
              </>
            ) : (
              // Classic layouts: Simple single opening (original rendering)
              // Use asymmetric padding when bottom-weighted matting is enabled
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: topMatColor.hex,
                  boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: `${layout.matTopPx}px ${layout.matRightPx}px ${layout.matBottomPx}px ${layout.matLeftPx}px`,
                  transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                }}
              >
                {/* Bottom mat - shows as reveal under top mat */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: bottomMatColor.hex,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: `${currentLayout.matReveal * layout.scale}px`,
                    border: `${Math.max(1.5, layout.scale * 0.06)}px solid #E0E0E0`,
                    transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                    position: "relative",
                  }}
                >
                  {/* Jersey opening placeholder */}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      ...getBackingStyles(backingColor),
                      // Mat beveled edge (1/16" inner border) + depth shadow
                      boxShadow: `inset 0 0 0 ${Math.max(1, layout.scale * 0.1)}px ${getMatBevelColor(bottomMatColor.name)}, inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                    }}
                  >
                    <Shirt className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Fallback: Hex color borders when frame photos aren't available
        <div
          style={{
            width: `${layout.outerPx.w}px`,
            height: `${layout.outerPx.h}px`,
            borderTop: `${layout.frameFacePx}px solid ${selectedFrame.borderColor}`,
            borderLeft: `${layout.frameFacePx}px solid ${selectedFrame.borderColor}`,
            borderRight: `${layout.frameFacePx}px solid ${selectedFrame.color}`,
            borderBottom: `${layout.frameFacePx}px solid ${selectedFrame.color}`,
            boxShadow:
              "inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.25)",
            position: "relative",
            transition: "border-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
          }}
        >
          {/* Mat layers (only for Premium layouts with double mat) - fallback mode */}
          {(selectedLayout === "premium-small" ||
            selectedLayout === "premium-regular" ||
            selectedLayout === "premium-large") &&
            matPaths && (
              <>
                {/* Bottom mat layer with solid background */}
                <div
                  className="absolute inset-0"
                  style={{
                    top: `${layout.frameFacePx}px`,
                    left: `${layout.frameFacePx}px`,
                    width: `${layout.glassPx.w}px`,
                    height: `${layout.glassPx.h}px`,
                    backgroundColor: bottomMatColor.hex,
                    clipPath: `url(#${clipPathIds.bottomMat})`,
                    transition: "background 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                  }}
                />

                {/* Top mat layer with textured background and reveal */}
                <div
                  className="absolute inset-0"
                  style={{
                    top: `${layout.frameFacePx}px`,
                    left: `${layout.frameFacePx}px`,
                    width: `${layout.glassPx.w}px`,
                    height: `${layout.glassPx.h}px`,
                    ...getMatTilingStyle(topMatColor.name, previewScale, topMatColor.hex),
                    clipPath: `url(#${clipPathIds.topMat})`,
                    transition: "background 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                  }}
                />
              </>
            )}

          {/* Mat area */}
          <div
            style={{
              position: "absolute",
              top: `${layout.frameFacePx}px`,
              left: `${layout.frameFacePx}px`,
              right: `${layout.frameFacePx}px`,
              bottom: `${layout.frameFacePx}px`,
              overflow: "hidden",
            }}
          >
            {(selectedLayout === "premium-small" ||
              selectedLayout === "premium-regular" ||
              selectedLayout === "premium-large") &&
            matPaths ? (
              // Premium layouts: Multi-opening with SVG clip paths (mats rendered in SVG above)
              renderPremiumOpenings()
            ) : (
              // Classic layouts: Simple single opening
              // Use asymmetric padding when bottom-weighted matting is enabled
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: topMatColor.hex,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: `${layout.matTopPx}px ${layout.matRightPx}px ${layout.matBottomPx}px ${layout.matLeftPx}px`,
                  transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: bottomMatColor.hex,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: `${currentLayout.matReveal * layout.scale}px`,
                    border: `${Math.max(1.5, layout.scale * 0.06)}px solid #E0E0E0`,
                    transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      ...getBackingStyles(backingColor),
                      // Mat beveled edge (1/16" inner border) + depth shadow
                      boxShadow: `inset 0 0 0 ${Math.max(1, layout.scale * 0.1)}px ${getMatBevelColor(bottomMatColor.name)}, inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                    }}
                  >
                    <Shirt className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
