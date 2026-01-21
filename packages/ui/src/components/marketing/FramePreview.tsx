import { useState, useEffect, useMemo, useRef } from "react";
import { computePreviewLayout } from "@framecraft/core";

interface FramePreviewProps {
  frameSku?: string;
  frameColor?: string; // Frame color for fallback rendering (hex code)
  topMatColor: string;
  bottomMatColor: string;
  matType: "single" | "double";
  uploadedImage?: string | null;
  artworkWidth: number;
  artworkHeight: number;
  className?: string;
  fillMatOpening?: boolean; // If true, image fills mat opening (cover); if false, image fits within opening (contain)
  matBorderWidth?: number; // Mat border width in inches (defaults to 2.5)
  frameWidth?: number; // Frame molding width in inches (defaults to 1.0)
}

export function FramePreview({
  frameSku,
  frameColor = "#654321", // Default brown color
  topMatColor,
  bottomMatColor,
  matType,
  uploadedImage,
  artworkWidth,
  artworkHeight,
  className = "",
  fillMatOpening = false,
  matBorderWidth = 2.5,
  frameWidth = 1.0,
}: FramePreviewProps) {
  const [framePhotos, setFramePhotos] = useState<{
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  }>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 400, height: 400 });

  // Measure actual container size with ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Fetch frame photos when SKU is available
  useEffect(() => {
    // Reset framePhotos at the START of every fetch to prevent stale data
    setFramePhotos({});

    if (!frameSku) {
      return;
    }

    async function fetchFramePhotos() {
      try {
        const response = await fetch(`/api/frames/${frameSku}/photos`);
        if (response.ok) {
          const photoSet = await response.json();
          setFramePhotos({
            topUrl: photoSet.topUrl,
            bottomUrl: photoSet.bottomUrl,
            leftUrl: photoSet.leftUrl,
            rightUrl: photoSet.rightUrl,
          });
        } else {
          // Reset on fetch failure (non-OK response)
          setFramePhotos({});
        }
      } catch (error) {
        console.error("Error fetching frame photos:", error);
        // Reset on error
        setFramePhotos({});
      }
    }

    fetchFramePhotos();
  }, [frameSku]);

  // Fixed configuration for preview
  const matRevealWidth = 0.25; // inches
  // matBorderWidth and frameWidth are now props with default values

  // Compute layout using ACTUAL container size (responsive!)
  const layout = useMemo(() => {
    return computePreviewLayout({
      artW: artworkWidth,
      artH: artworkHeight,
      matBorder: matBorderWidth,
      frameFace: frameWidth,
      containerWpx: containerSize.width,
      containerHpx: containerSize.height,
    });
  }, [
    artworkWidth,
    artworkHeight,
    matBorderWidth,
    frameWidth,
    containerSize.width,
    containerSize.height,
  ]);

  const hasFramePhotos =
    framePhotos.topUrl && framePhotos.bottomUrl && framePhotos.leftUrl && framePhotos.rightUrl;

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: "100%", height: "100%" }}
      data-testid="frame-preview"
    >
      {hasFramePhotos ? (
        // Photo-based 2D preview with clip-path rendering
        <div
          className="preview-stage"
          style={{
            width: `${layout.outerPx.w}px`,
            height: `${layout.outerPx.h}px`,
            position: "relative",
            // Outer shadow for frame assembly visibility (especially white frames on white backgrounds)
            filter:
              "drop-shadow(0 2px 12px rgba(0,0,0,0.12)) drop-shadow(0 4px 20px rgba(0,0,0,0.08))",
          }}
        >
          {/* Top frame piece - pre-oriented with decorative edge facing down */}
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

          {/* Bottom frame piece - pre-oriented with decorative edge facing up */}
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

          {/* Left frame piece - pre-oriented with decorative edge facing right */}
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

          {/* Right frame piece - pre-oriented with decorative edge facing left */}
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

          {/* Lighting blend overlays for smooth transitions at corners */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${layout.frameFacePx * 1.5}px`,
              height: `${layout.frameFacePx * 1.5}px`,
              background:
                "radial-gradient(circle at top left, rgba(255,255,255,0.03) 0%, transparent 70%)",
              pointerEvents: "none",
              mixBlendMode: "overlay",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: `${layout.frameFacePx * 1.5}px`,
              height: `${layout.frameFacePx * 1.5}px`,
              background:
                "radial-gradient(circle at top right, rgba(255,255,255,0.03) 0%, transparent 70%)",
              pointerEvents: "none",
              mixBlendMode: "overlay",
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: `${layout.frameFacePx * 1.5}px`,
              height: `${layout.frameFacePx * 1.5}px`,
              background:
                "radial-gradient(circle at bottom left, rgba(255,255,255,0.03) 0%, transparent 70%)",
              pointerEvents: "none",
              mixBlendMode: "overlay",
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: `${layout.frameFacePx * 1.5}px`,
              height: `${layout.frameFacePx * 1.5}px`,
              background:
                "radial-gradient(circle at bottom right, rgba(255,255,255,0.03) 0%, transparent 70%)",
              pointerEvents: "none",
              mixBlendMode: "overlay",
            }}
          />

          {/* Mat and artwork area - extends slightly under frame to eliminate gaps at mitered corners */}
          <div
            style={{
              position: "absolute",
              top: `${layout.frameFacePx - 2}px`,
              left: `${layout.frameFacePx - 2}px`,
              right: `${layout.frameFacePx - 2}px`,
              bottom: `${layout.frameFacePx - 2}px`,
              // Enhanced inset shadow for better frame/mat separation (especially white-on-white)
              boxShadow:
                "inset 0 0 20px rgba(0,0,0,0.3), inset 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 3px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: topMatColor,
              padding: `${layout.matPx}px`,
            }}
          >
            {matType === "double" ? (
              <div
                style={{
                  width: `${layout.openingPx.w}px`,
                  height: `${layout.openingPx.h}px`,
                  padding: `${matRevealWidth * layout.scale}px`,
                  backgroundColor: bottomMatColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // Top mat beveled edge (1/16" off-white inner border)
                  boxShadow: `inset 0 0 0 ${Math.max(1.5, layout.scale * 0.0625)}px #F8F6F0, 0 1px 2px rgba(0,0,0,0.06)`,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    // Bottom mat beveled edge (1/16" off-white inner border)
                    boxShadow: `inset 0 0 0 ${Math.max(1.5, layout.scale * 0.0625)}px #F8F6F0, 0 1px 2px rgba(0,0,0,0.06)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "white",
                    position: "relative",
                  }}
                >
                  {uploadedImage && (
                    <img
                      src={uploadedImage}
                      alt="Artwork"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: fillMatOpening ? "cover" : "contain",
                        padding: fillMatOpening ? "0" : "8%",
                      }}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div
                style={{
                  width: `${layout.openingPx.w}px`,
                  height: `${layout.openingPx.h}px`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  position: "relative",
                  // Single mat beveled edge (1/16" off-white inner border)
                  boxShadow: `inset 0 0 0 ${Math.max(1.5, layout.scale * 0.0625)}px #F8F6F0`,
                }}
              >
                {uploadedImage && (
                  <img
                    src={uploadedImage}
                    alt="Artwork"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: fillMatOpening ? "cover" : "contain",
                      padding: fillMatOpening ? "0" : "8%",
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Fallback: Simple preview when frame photos aren't available (matches photo-based layer order)
        <div
          className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
          style={{
            maxWidth: `${layout.outerPx.w}px`,
            maxHeight: `${layout.outerPx.h}px`,
            // Outer shadow for frame assembly visibility (matching photo-based rendering)
            filter:
              "drop-shadow(0 2px 12px rgba(0,0,0,0.12)) drop-shadow(0 4px 20px rgba(0,0,0,0.08))",
          }}
        >
          {/* Frame border (outermost) - using box-shadow to simulate frame */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              boxShadow: `inset 0 0 0 ${layout.frameFacePx}px ${frameColor}`,
              padding: `${layout.frameFacePx - 2}px`, // 2px overlap to prevent gaps
            }}
          >
            {/* Top mat border (outer mat) */}
            {matType === "double" ? (
              <div
                className="relative w-full h-full flex items-center justify-center"
                style={{
                  backgroundColor: topMatColor,
                  padding: `${layout.matPx}px`,
                  // Enhanced inner shadow for better frame/mat separation (matching photo-based rendering)
                  boxShadow: "inset 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                {/* Bottom mat border (inner mat reveal) */}
                <div
                  className="relative w-full h-full flex items-center justify-center"
                  style={{
                    backgroundColor: bottomMatColor,
                    padding: `${matRevealWidth * layout.scale}px`,
                    // Top mat beveled edge (1/16" off-white inner border)
                    boxShadow: `inset 0 0 0 ${Math.max(1.5, layout.scale * 0.0625)}px #F8F6F0`,
                  }}
                >
                  {/* White backing with photo */}
                  <div
                    className="relative w-full h-full flex items-center justify-center"
                    style={{
                      backgroundColor: "white",
                      // Bottom mat beveled edge (1/16" off-white inner border)
                      boxShadow: `inset 0 0 0 ${Math.max(1.5, layout.scale * 0.0625)}px #F8F6F0`,
                    }}
                  >
                    {uploadedImage && (
                      <img
                        src={uploadedImage}
                        alt="Artwork"
                        className={`w-full h-full ${fillMatOpening ? "object-cover" : "object-contain"}`}
                        style={{ padding: fillMatOpening ? "0" : "8%" }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Single mat version */
              <div
                className="relative w-full h-full flex items-center justify-center"
                style={{
                  backgroundColor: topMatColor,
                  padding: `${layout.matPx}px`,
                  // Enhanced inner shadow for better frame/mat separation (matching photo-based rendering)
                  boxShadow: "inset 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  className="relative w-full h-full flex items-center justify-center"
                  style={{
                    backgroundColor: "white",
                  }}
                >
                  {uploadedImage && (
                    <img
                      src={uploadedImage}
                      alt="Artwork"
                      className={`w-full h-full ${fillMatOpening ? "object-cover" : "object-contain"}`}
                      style={{ padding: fillMatOpening ? "0" : "8%" }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
