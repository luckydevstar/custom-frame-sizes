"use client";

import { useState, useEffect, useMemo } from "react";
import { Maximize } from "lucide-react";
import type { FrameStyle } from "@framecraft/types";
import type { BrassNameplateConfig } from "@framecraft/types";
import type { Mat } from "@framecraft/config";
import {
  getMatTilingStyle,
  getMatBevelColor,
  getHeartPath,
  getRandomSignatureImageUrl,
} from "@framecraft/core";
import { Card } from "../ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";

export interface SignatureFramePreviewProps {
  openingSize: "5x5" | "8x8";
  openingShape: "square" | "circle" | "heart";
  frame: FrameStyle;
  topMat: Mat;
  accentMat: Mat;
  matBorder: number;
  matReveal: number;
  brassNameplateConfig: BrassNameplateConfig;
  frameDimensions: {
    width: number;
    height: number;
    isOversize: boolean;
    bottomWeightedExtra: number;
  };
  onFullscreen?: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  containerWidth: number;
  previewContainerHeight: number;
  uploadedImage?: string | null;
}

const openingNum = (size: "5x5" | "8x8") => (size === "5x5" ? 5 : 8);

export function SignatureFramePreview({
  openingSize,
  openingShape,
  frame,
  topMat,
  accentMat,
  matBorder,
  matReveal,
  brassNameplateConfig,
  frameDimensions,
  onFullscreen,
  containerRef,
  containerWidth,
  previewContainerHeight,
  uploadedImage,
}: SignatureFramePreviewProps) {
  const [lifestyleImage] = useState(() => getRandomSignatureImageUrl());
  const [framePhotos, setFramePhotos] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!frame.sku) return;
    fetch(`/api/frames/${frame.sku}/photos`)
      .then((r) => (r.ok ? r.json() : {}))
      .then(setFramePhotos)
      .catch(() => {});
  }, [frame.sku]);

  const openingSizeNum = openingNum(openingSize);
  const totalWidthInches = frameDimensions.width + (frame.mouldingWidth ?? 0) * 2;
  const totalHeightInches = frameDimensions.height + (frame.mouldingWidth ?? 0) * 2;
  const scaleX = containerWidth / totalWidthInches;
  const scaleY = previewContainerHeight / totalHeightInches;
  const scale = Math.min(scaleX, scaleY);
  const previewWidth = totalWidthInches * scale;
  const previewHeight = totalHeightInches * scale;
  const frameWidthPx = (frame.mouldingWidth ?? 0) * scale;
  const frameLipPx = frameWidthPx * (frame.rabbetInsetRatio ?? 0.92);
  const matAreaWidthPx = previewWidth - frameLipPx * 2;
  const matAreaHeightPx = previewHeight - frameLipPx * 2;
  const _matBorderPx = matBorder * scale;
  const _bottomWeightedExtraPx = frameDimensions.bottomWeightedExtra * scale;
  const matRevealPx = matReveal * scale;
  const openingPx = openingSizeNum * scale;

  const centerX = matAreaWidthPx / 2;
  const bottomWeightOffset = (frameDimensions.bottomWeightedExtra * scale) / 2;
  const centerY = matAreaHeightPx / 2 - bottomWeightOffset;
  const opening = useMemo(
    () => ({
      centerX,
      centerY,
      size: openingPx,
      x: centerX - openingPx / 2,
      y: centerY - openingPx / 2,
    }),
    [centerX, centerY, openingPx]
  );

  const topMatTiling = useMemo(() => getMatTilingStyle(topMat.name, scale), [topMat.name, scale]);
  const accentMatTiling = useMemo(
    () => getMatTilingStyle(accentMat.name, scale),
    [accentMat.name, scale]
  );
  const bevelColor = useMemo(() => getMatBevelColor(accentMat.name), [accentMat.name]);

  const plaqueDimensions = useMemo(() => {
    if (!brassNameplateConfig?.enabled) return null;
    const plaqueWidth = scale * 4.5 * 0.8;
    const plaqueHeight = scale * 1.5 * 0.8;
    const plaqueY = opening.y + opening.size + 1 * scale;
    const plaqueX = (matAreaWidthPx - plaqueWidth) / 2;
    return { width: plaqueWidth, height: plaqueHeight, x: plaqueX, y: plaqueY };
  }, [brassNameplateConfig?.enabled, scale, opening, matAreaWidthPx]);

  const clipPathIds = useMemo(
    () => ({
      bottomMat: `sig-bottom-${openingSize}-${openingShape}-${Math.random().toString(36).slice(2, 9)}`,
      topMat: `sig-top-${openingSize}-${openingShape}-${Math.random().toString(36).slice(2, 9)}`,
      heartOpening: `sig-heart-${Math.random().toString(36).slice(2, 9)}`,
    }),
    [openingSize, openingShape]
  );

  const hasFramePhotos = !!(
    framePhotos.topUrl &&
    framePhotos.bottomUrl &&
    framePhotos.leftUrl &&
    framePhotos.rightUrl
  );
  const displayImage = uploadedImage || lifestyleImage;

  const heartPathForClip = useMemo(() => {
    const w = opening.size - matRevealPx * 2;
    const h = w;
    return getHeartPath(0, 0, w, h, 0.38);
  }, [opening.size, matRevealPx]);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div
          ref={containerRef}
          className="bg-muted overflow-hidden flex items-center justify-center relative group"
          style={{ minHeight: `${previewContainerHeight}px` }}
          data-testid="preview-container"
        >
          {onFullscreen && (
            <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={onFullscreen}
                className="bg-background/90 hover:bg-background p-2 rounded-md shadow-lg"
                data-testid="button-fullscreen"
              >
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          )}
          <div
            style={{
              width: `${previewWidth}px`,
              height: `${previewHeight}px`,
              position: "relative",
              backgroundColor: frame.borderColor,
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            {hasFramePhotos ? (
              <>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: `${frameWidthPx}px`,
                    backgroundImage: `url(${framePhotos.topUrl})`,
                    backgroundSize: "auto 100%",
                    backgroundRepeat: "repeat-x",
                    backgroundPosition: "left center",
                    zIndex: 10,
                    clipPath: `polygon(0 0, 100% 0, calc(100% - ${frameWidthPx}px) 100%, ${frameWidthPx}px 100%)`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${frameWidthPx}px`,
                    backgroundImage: `url(${framePhotos.bottomUrl})`,
                    backgroundSize: "auto 100%",
                    backgroundRepeat: "repeat-x",
                    backgroundPosition: "left center",
                    zIndex: 10,
                    clipPath: `polygon(${frameWidthPx}px 0, calc(100% - ${frameWidthPx}px) 0, 100% 100%, 0 100%)`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: `${frameWidthPx}px`,
                    backgroundImage: `url(${framePhotos.leftUrl})`,
                    backgroundSize: "100% auto",
                    backgroundRepeat: "repeat-y",
                    backgroundPosition: "center top",
                    zIndex: 10,
                    clipPath: `polygon(0 0, 100% ${frameWidthPx}px, 100% calc(100% - ${frameWidthPx}px), 0 100%)`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: `${frameWidthPx}px`,
                    backgroundImage: `url(${framePhotos.rightUrl})`,
                    backgroundSize: "100% auto",
                    backgroundRepeat: "repeat-y",
                    backgroundPosition: "center top",
                    zIndex: 10,
                    clipPath: `polygon(0 ${frameWidthPx}px, 100% 0, 100% 100%, 0 calc(100% - ${frameWidthPx}px))`,
                  }}
                />
              </>
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderTop: `${frameWidthPx}px solid ${frame.borderColor}`,
                  borderLeft: `${frameWidthPx}px solid ${frame.borderColor}`,
                  borderRight: `${frameWidthPx}px solid ${frame.color}`,
                  borderBottom: `${frameWidthPx}px solid ${frame.color}`,
                  boxShadow: "inset 0 0 20px rgba(0,0,0,0.3)",
                }}
              />
            )}

            <div
              style={{
                position: "absolute",
                top: `${frameLipPx}px`,
                left: `${frameLipPx}px`,
                width: `${matAreaWidthPx}px`,
                height: `${matAreaHeightPx}px`,
                overflow: "hidden",
              }}
            >
              <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                  <clipPath
                    id={clipPathIds.bottomMat}
                    clipPathUnits="userSpaceOnUse"
                    clipRule="evenodd"
                  >
                    <path
                      d={`M 0 0 L ${matAreaWidthPx} 0 L ${matAreaWidthPx} ${matAreaHeightPx} L 0 ${matAreaHeightPx} Z ${
                        openingShape === "heart"
                          ? getHeartPath(
                              opening.x + matRevealPx,
                              opening.y + matRevealPx,
                              opening.size - matRevealPx * 2,
                              opening.size - matRevealPx * 2,
                              0.38
                            )
                          : `M ${opening.x + matRevealPx} ${opening.y + matRevealPx} L ${opening.x + opening.size - matRevealPx} ${opening.y + matRevealPx} L ${opening.x + opening.size - matRevealPx} ${opening.y + opening.size - matRevealPx} L ${opening.x + matRevealPx} ${opening.y + opening.size - matRevealPx} Z`
                      }`}
                    />
                  </clipPath>
                  <clipPath
                    id={clipPathIds.topMat}
                    clipPathUnits="userSpaceOnUse"
                    clipRule="evenodd"
                  >
                    <path
                      d={`M 0 0 L ${matAreaWidthPx} 0 L ${matAreaWidthPx} ${matAreaHeightPx} L 0 ${matAreaHeightPx} Z ${
                        openingShape === "heart"
                          ? getHeartPath(opening.x, opening.y, opening.size, opening.size, 0.38)
                          : `M ${opening.x} ${opening.y} L ${opening.x + opening.size} ${opening.y} L ${opening.x + opening.size} ${opening.y + opening.size} L ${opening.x} ${opening.y + opening.size} Z`
                      }`}
                    />
                  </clipPath>
                  {openingShape === "heart" && (
                    <clipPath id={clipPathIds.heartOpening} clipPathUnits="userSpaceOnUse">
                      <path d={heartPathForClip} />
                    </clipPath>
                  )}
                </defs>
              </svg>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  ...accentMatTiling,
                  clipPath: `url(#${clipPathIds.bottomMat})`,
                  zIndex: 2,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  ...topMatTiling,
                  clipPath: `url(#${clipPathIds.topMat})`,
                  zIndex: 5,
                }}
              />

              {openingShape === "heart" ? (
                <svg
                  style={{
                    position: "absolute",
                    top: `${opening.y + matRevealPx}px`,
                    left: `${opening.x + matRevealPx}px`,
                    width: `${opening.size - matRevealPx * 2}px`,
                    height: `${opening.size - matRevealPx * 2}px`,
                  }}
                  viewBox={`0 0 ${opening.size - matRevealPx * 2} ${opening.size - matRevealPx * 2}`}
                >
                  <defs>
                    <clipPath id={clipPathIds.heartOpening}>
                      <path d={heartPathForClip} />
                    </clipPath>
                  </defs>
                  <image
                    href={displayImage}
                    x="0"
                    y="0"
                    width={opening.size - matRevealPx * 2}
                    height={opening.size - matRevealPx * 2}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#${clipPathIds.heartOpening})`}
                  />
                  <path
                    d={heartPathForClip}
                    fill="none"
                    stroke={bevelColor}
                    strokeWidth={Math.max(1, scale * 0.06)}
                  />
                </svg>
              ) : (
                <div
                  style={{
                    position: "absolute",
                    top: `${opening.y + matRevealPx}px`,
                    left: `${opening.x + matRevealPx}px`,
                    width: `${opening.size - matRevealPx * 2}px`,
                    height: `${opening.size - matRevealPx * 2}px`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: openingShape === "circle" ? "50%" : 0,
                      overflow: "hidden",
                      backgroundImage: `url(${displayImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: openingShape === "circle" ? "50%" : 0,
                      border: `${Math.max(1, scale * 0.06)}px solid ${bevelColor}`,
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  />
                </div>
              )}

              {plaqueDimensions && (
                <div
                  style={{
                    position: "absolute",
                    left: `${plaqueDimensions.x}px`,
                    top: `${plaqueDimensions.y}px`,
                    width: `${plaqueDimensions.width}px`,
                    height: `${plaqueDimensions.height}px`,
                    zIndex: 10,
                  }}
                  data-testid="brass-nameplate-preview"
                >
                  <BrassNameplatePreview config={brassNameplateConfig} scale={scale * 0.8} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-md space-y-0.5" data-testid="dimensions-box">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium">
              Finished Size:{" "}
              <span className="text-primary">
                {frameDimensions.width}&quot; × {frameDimensions.height}&quot;
              </span>
            </p>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-muted-foreground cursor-help text-xs">(?)</span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Outer frame dimensions including moulding. Interior mat opening accommodates
                  signatures with the selected border width.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-xs text-muted-foreground">
            Opening: {openingSize === "5x5" ? "5" : "8"}&quot; × {openingSize === "5x5" ? "5" : "8"}
            &quot; • Mat Border: {matBorder}&quot;
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Sample image. Not included with purchase.
        </p>
      </div>
    </Card>
  );
}
