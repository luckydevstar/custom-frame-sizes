"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  getRecordAlbumLayoutWithMolding,
  getCDLayout,
  generateMatOpeningPath,
  generateMatBoardPath,
  getMatTilingStyle,
  getMatBevelColor,
  type RecordAlbumLayoutType,
  type CDLayoutType,
  type Rectangle,
  type Circle,
  type MatOpeningLayoutType,
} from "@framecraft/core";
import type { BrassNameplateConfig } from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS } from "@framecraft/types";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";

const CD_DISC_IMAGE = "/cd/disc-placeholder.png";

interface RecordAlbumPreviewProps {
  layout: RecordAlbumLayoutType | CDLayoutType;
  layoutType?: "vinyl" | "cd";
  frameSku?: string;
  frameColor?: string;
  topMatColor: string;
  bottomMatColor?: string;
  matType?: "single" | "double" | "none";
  albumCoverImage?: string | null;
  className?: string;
  mouldingWidth?: number;
  backgroundImageUrl?: string;
  vGroove?: { enabled: boolean; offsetIn: number };
  brassNameplateConfig?: BrassNameplateConfig;
  containerRef?: React.RefObject<HTMLDivElement>;
  containerWidth?: number;
  previewContainerHeight?: number;
  bottomWeighted?: boolean;
}

const REVEAL_COLOR = "#F5F3EE";
const MAT_SAFETY_IN = 0.06;
const PX_SAFETY = 1;
const BOTTOM_WEIGHTED_EXTRA = 0.5;

export function RecordAlbumPreview({
  layout,
  layoutType = "vinyl",
  frameSku,
  frameColor = "#654321",
  topMatColor,
  bottomMatColor = "#FFFFFF",
  matType = "single",
  albumCoverImage,
  className = "",
  mouldingWidth = 1.0,
  backgroundImageUrl,
  brassNameplateConfig,
  containerRef: externalContainerRef,
  containerWidth: externalContainerWidth,
  previewContainerHeight: externalPreviewContainerHeight,
  bottomWeighted = false,
}: RecordAlbumPreviewProps) {
  const internalContainerRef = useRef<HTMLDivElement | null>(null);
  const [internalContainerW, setInternalContainerW] = useState<number>(600);
  const [internalContainerH, setInternalContainerH] = useState<number>(400);

  const outerRef = externalContainerRef ?? internalContainerRef;
  const containerW =
    externalContainerWidth !== undefined ? externalContainerWidth : internalContainerW;
  const containerH =
    externalPreviewContainerHeight !== undefined
      ? externalPreviewContainerHeight
      : internalContainerH;

  useEffect(() => {
    if (externalContainerWidth !== undefined && externalPreviewContainerHeight !== undefined) {
      return;
    }
    if (!outerRef.current) return;
    const el = outerRef.current;
    const rect = el.getBoundingClientRect();
    setInternalContainerW(rect.width);
    setInternalContainerH(rect.height || 400);
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (!r) return;
      setInternalContainerW(r.width);
      setInternalContainerH(r.height || 400);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [externalContainerWidth, externalPreviewContainerHeight, outerRef]);

  const layoutConfig = useMemo(() => {
    const isCDLayout = ["cover-only", "disc-with-cover", "double-disc"].includes(layout);
    const baseLayout = isCDLayout
      ? getCDLayout(layout as CDLayoutType, mouldingWidth)
      : getRecordAlbumLayoutWithMolding(layout as RecordAlbumLayoutType, mouldingWidth);
    if (!baseLayout) return null;

    if (layout === "cover-only" && matType === "none") {
      const insertSize = isCDLayout ? 4.75 : baseLayout.artworkWidth;
      const frameSize = insertSize + 2 * mouldingWidth;
      return {
        ...baseLayout,
        matBorderWidth: 0,
        artworkWidth: insertSize,
        artworkHeight: insertSize,
        frameWidth: frameSize,
        frameHeight: brassNameplateConfig?.enabled ? frameSize + 1.5 : frameSize,
        openings: [
          {
            type: "rectangle" as const,
            x: 0,
            y: 0,
            width: insertSize,
            height: insertSize,
            purpose: "album-cover" as const,
          },
        ],
      };
    }

    const bottomWeightedExtra = bottomWeighted && matType !== "none" ? BOTTOM_WEIGHTED_EXTRA : 0;
    return {
      ...baseLayout,
      frameHeight:
        baseLayout.frameHeight + (brassNameplateConfig?.enabled ? 1.5 : 0) + bottomWeightedExtra,
      matBorderBottom: (baseLayout.matBorderWidth || 0) + bottomWeightedExtra,
    };
  }, [layout, matType, mouldingWidth, brassNameplateConfig?.enabled, bottomWeighted]);

  const [framePhotos, setFramePhotos] = useState<{
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  }>({});

  useEffect(() => {
    setFramePhotos({});
    if (!frameSku) return;
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
          setFramePhotos({});
        }
      } catch (error) {
        console.error("Error fetching frame photos:", error);
        setFramePhotos({});
      }
    }
    fetchFramePhotos();
  }, [frameSku]);

  const INCHES_TO_PX = 72;
  const MAT_REVEAL_WIDTH = 0.33;
  const MAT_BEVEL_WIDTH = 0.1;
  const matBevelColor = getMatBevelColor(topMatColor);

  const {
    previewScale,
    scaledWidth,
    scaledHeight,
    frameFacePx,
    matRevealPx: _matRevealPx,
    matBevelPx: _matBevelPx,
  } = useMemo(() => {
    if (!layoutConfig)
      return {
        previewScale: 1,
        scaledWidth: 0,
        scaledHeight: 0,
        frameFacePx: 0,
        matRevealPx: 0,
        matBevelPx: 0,
      };
    const frameWidthPx = (layoutConfig.frameWidth || 15) * INCHES_TO_PX;
    const frameHeightPx = (layoutConfig.frameHeight || 15) * INCHES_TO_PX;
    const vw = typeof window !== "undefined" ? window.innerWidth : containerW;
    const vh = typeof window !== "undefined" ? window.innerHeight : containerH;
    const P = 8;
    const availW = Math.max(200, Math.min(containerW, vw - P));
    const availH = Math.max(160, Math.min(containerH || 400, vh - P));
    const scaleX = availW / frameWidthPx;
    const scaleY = availH / frameHeightPx;
    const scale = Math.min(scaleX, scaleY, 1);
    const width = frameWidthPx * scale;
    const height = frameHeightPx * scale;
    const frameFace = mouldingWidth * INCHES_TO_PX * scale;
    const matReveal = MAT_REVEAL_WIDTH * INCHES_TO_PX * scale;
    const matBevel = Math.max(2, MAT_BEVEL_WIDTH * INCHES_TO_PX * scale);
    return {
      previewScale: scale,
      scaledWidth: width,
      scaledHeight: height,
      frameFacePx: frameFace,
      matRevealPx: matReveal,
      matBevelPx: matBevel,
    };
  }, [layoutConfig, mouldingWidth, containerW, containerH]);

  const {
    matBoardPath,
    bottomMatBoardPath,
    borderMatBoardPath,
    openingPath,
    bottomMatOpeningPath: _bottomMatOpeningPath,
    borderMatOpeningPath: _borderMatOpeningPath,
    svgId,
    interiorWidth,
    interiorHeight,
  } = useMemo(() => {
    if (!layoutConfig) {
      const interiorWidth = Math.max(0, scaledWidth - frameFacePx * 2 - PX_SAFETY);
      const interiorHeight = Math.max(0, scaledHeight - frameFacePx * 2 - PX_SAFETY);
      return {
        matBoardPath: "",
        bottomMatBoardPath: "",
        borderMatBoardPath: "",
        openingPath: "",
        bottomMatOpeningPath: "",
        borderMatOpeningPath: "",
        svgId: "",
        interiorWidth,
        interiorHeight,
      };
    }

    const interiorWidth = Math.max(0, scaledWidth - frameFacePx * 2 - PX_SAFETY);
    const interiorHeight = Math.max(0, scaledHeight - frameFacePx * 2 - PX_SAFETY);
    const outerRect: Rectangle = {
      x: 0,
      y: 0,
      width: interiorWidth,
      height: interiorHeight,
    };

    const rectOpening = layoutConfig.openings?.find((o) => o.type === "rectangle");
    const circleOpenings = layoutConfig.openings?.filter((o) => o.type === "circle") ?? [];
    if (!rectOpening || rectOpening.type !== "rectangle") {
      return {
        matBoardPath: "",
        bottomMatBoardPath: "",
        borderMatBoardPath: "",
        openingPath: "",
        bottomMatOpeningPath: "",
        borderMatOpeningPath: "",
        svgId: "",
        interiorWidth,
        interiorHeight,
      };
    }

    const rect: Rectangle = {
      x: (rectOpening.x + MAT_SAFETY_IN) * INCHES_TO_PX * previewScale,
      y: (rectOpening.y + MAT_SAFETY_IN) * INCHES_TO_PX * previewScale,
      width: (rectOpening.width! - 2 * MAT_SAFETY_IN) * INCHES_TO_PX * previewScale,
      height: (rectOpening.height! - 2 * MAT_SAFETY_IN) * INCHES_TO_PX * previewScale,
    };

    let circle1: Circle | undefined;
    let circle2: Circle | undefined;
    const sortedCircles = [...circleOpenings].sort((a, b) => (a.x ?? 0) - (b.x ?? 0));
    if (sortedCircles[0]?.type === "circle") {
      const c1 = sortedCircles[0];
      circle1 = {
        centerX: c1.x * INCHES_TO_PX * previewScale,
        centerY: c1.y * INCHES_TO_PX * previewScale,
        radius: (c1.diameter! / 2 - MAT_SAFETY_IN) * INCHES_TO_PX * previewScale,
      };
    }
    if (sortedCircles[1]?.type === "circle") {
      const c2 = sortedCircles[1];
      circle2 = {
        centerX: c2.x * INCHES_TO_PX * previewScale,
        centerY: c2.y * INCHES_TO_PX * previewScale,
        radius: (c2.diameter! / 2 - MAT_SAFETY_IN) * INCHES_TO_PX * previewScale,
      };
    }

    const openingPathVal = generateMatOpeningPath(
      layout as MatOpeningLayoutType,
      rect,
      circle1,
      circle2
    );
    const topMatPath = generateMatBoardPath(outerRect, openingPathVal);

    const borderMatRevealPx = 0.06 * INCHES_TO_PX * previewScale;
    const borderRect: Rectangle = {
      x: rect.x + borderMatRevealPx,
      y: rect.y + borderMatRevealPx,
      width: rect.width - 2 * borderMatRevealPx,
      height: rect.height - 2 * borderMatRevealPx,
    };
    const borderCircle1 = circle1
      ? { ...circle1, radius: circle1.radius - borderMatRevealPx }
      : undefined;
    const borderCircle2 = circle2
      ? { ...circle2, radius: circle2.radius - borderMatRevealPx }
      : undefined;
    const borderOpeningPath = generateMatOpeningPath(
      layout as MatOpeningLayoutType,
      borderRect,
      borderCircle1,
      borderCircle2
    );
    const borderMatPath = generateMatBoardPath(outerRect, borderOpeningPath);

    let bottomMatPath = topMatPath;
    let bottomOpeningPath = "";
    if (matType === "double") {
      const useOutwardExpansion =
        layoutType === "cd" || layout === "single-with-cover" || layout === "double-with-covers";
      const matRevealPxVal = (useOutwardExpansion ? 0.25 : 0.33) * INCHES_TO_PX * previewScale;

      if (useOutwardExpansion) {
        const largerRect: Rectangle = {
          x: rect.x - matRevealPxVal,
          y: rect.y - matRevealPxVal,
          width: rect.width + 2 * matRevealPxVal,
          height: rect.height + 2 * matRevealPxVal,
        };
        const largerCircle1 = circle1
          ? { ...circle1, radius: circle1.radius + matRevealPxVal }
          : undefined;
        const largerCircle2 = circle2
          ? { ...circle2, radius: circle2.radius + matRevealPxVal }
          : undefined;
        const largerOpeningPath = generateMatOpeningPath(
          layout as MatOpeningLayoutType,
          largerRect,
          largerCircle1,
          largerCircle2
        );
        const topMatPathExpanded = generateMatBoardPath(outerRect, largerOpeningPath);
        bottomMatPath = generateMatBoardPath(outerRect, openingPathVal);
        bottomOpeningPath = openingPathVal;
        return {
          matBoardPath: topMatPathExpanded,
          bottomMatBoardPath: bottomMatPath,
          borderMatBoardPath: borderMatPath,
          openingPath: largerOpeningPath,
          bottomMatOpeningPath: openingPathVal,
          borderMatOpeningPath: borderOpeningPath,
          svgId: `mat-opening-${layout}-${Date.now()}`,
          interiorWidth,
          interiorHeight,
        };
      }

      const smallerRect: Rectangle = {
        x: rect.x + matRevealPxVal,
        y: rect.y + matRevealPxVal,
        width: rect.width - 2 * matRevealPxVal,
        height: rect.height - 2 * matRevealPxVal,
      };
      const smallerCircle1 = circle1
        ? { ...circle1, radius: circle1.radius - matRevealPxVal }
        : undefined;
      const smallerCircle2 = circle2
        ? { ...circle2, radius: circle2.radius - matRevealPxVal }
        : undefined;
      const smallerOpeningPath = generateMatOpeningPath(
        layout as MatOpeningLayoutType,
        smallerRect,
        smallerCircle1,
        smallerCircle2
      );
      bottomMatPath = generateMatBoardPath(outerRect, smallerOpeningPath);
      bottomOpeningPath = smallerOpeningPath;
    }

    const id = `mat-opening-${layout}-${Date.now()}`;
    return {
      matBoardPath: topMatPath,
      bottomMatBoardPath: bottomMatPath,
      borderMatBoardPath: borderMatPath,
      openingPath: openingPathVal,
      bottomMatOpeningPath: bottomOpeningPath,
      borderMatOpeningPath: borderOpeningPath,
      svgId: id,
      interiorWidth,
      interiorHeight,
    };
  }, [
    layoutConfig,
    layout,
    previewScale,
    scaledWidth,
    scaledHeight,
    frameFacePx,
    matType,
    layoutType,
  ]);

  if (!layoutConfig) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-md ${className}`}>
        <p className="text-muted-foreground">Invalid layout</p>
      </div>
    );
  }

  const hasFramePhotos =
    framePhotos.topUrl && framePhotos.bottomUrl && framePhotos.leftUrl && framePhotos.rightUrl;
  const openingPurposeCover = (o: { purpose?: string }) =>
    o.purpose === "album-cover" || o.purpose === "cover";

  return (
    <div
      ref={outerRef}
      className={`flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 ${className}`}
      data-testid="record-album-preview"
      style={
        backgroundImageUrl
          ? {
              width: "100%",
              maxWidth: "100vw",
              overflowX: "hidden",
              backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(${backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { width: "100%", maxWidth: "100vw", overflowX: "hidden" }
      }
    >
      <div
        className="relative"
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          maxWidth: "100%",
          overflow: "hidden",
          filter:
            "drop-shadow(0 2px 12px rgba(0,0,0,0.12)) drop-shadow(0 4px 20px rgba(0,0,0,0.08))",
        }}
      >
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <clipPath id={svgId} clipPathUnits="userSpaceOnUse" clipRule="evenodd">
              <path d={matBoardPath} />
            </clipPath>
            {matType === "double" && (
              <clipPath
                id={`${svgId}-bottom-mat`}
                clipPathUnits="userSpaceOnUse"
                clipRule="evenodd"
              >
                <path d={bottomMatBoardPath} />
              </clipPath>
            )}
            <clipPath id={`${svgId}-border-mat`} clipPathUnits="userSpaceOnUse" clipRule="evenodd">
              <path d={borderMatBoardPath} />
            </clipPath>
          </defs>
        </svg>

        {hasFramePhotos ? (
          <>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: `${mouldingWidth * INCHES_TO_PX * previewScale}px`,
                zIndex: 10,
                backgroundImage: `url(${framePhotos.topUrl})`,
                backgroundSize: "auto 100%",
                backgroundRepeat: "repeat-x",
                backgroundPosition: "left center",
                clipPath: `polygon(0 0, 100% 0, calc(100% - ${mouldingWidth * INCHES_TO_PX * previewScale}px) 100%, ${mouldingWidth * INCHES_TO_PX * previewScale}px 100%)`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.08))",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: `${mouldingWidth * INCHES_TO_PX * previewScale}px`,
                zIndex: 10,
                backgroundImage: `url(${framePhotos.bottomUrl})`,
                backgroundSize: "auto 100%",
                backgroundRepeat: "repeat-x",
                backgroundPosition: "left center",
                clipPath: `polygon(${mouldingWidth * INCHES_TO_PX * previewScale}px 0, calc(100% - ${mouldingWidth * INCHES_TO_PX * previewScale}px) 0, 100% 100%, 0 100%)`,
                boxShadow: "0 -2px 8px rgba(0,0,0,0.15)",
                filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.08))",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: `${mouldingWidth * INCHES_TO_PX * previewScale}px`,
                zIndex: 10,
                backgroundImage: `url(${framePhotos.leftUrl})`,
                backgroundSize: "100% auto",
                backgroundRepeat: "repeat-y",
                backgroundPosition: "center top",
                clipPath: `polygon(0 0, 100% ${mouldingWidth * INCHES_TO_PX * previewScale}px, 100% calc(100% - ${mouldingWidth * INCHES_TO_PX * previewScale}px), 0 100%)`,
                boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
                filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.08))",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: `${mouldingWidth * INCHES_TO_PX * previewScale}px`,
                zIndex: 10,
                backgroundImage: `url(${framePhotos.rightUrl})`,
                backgroundSize: "100% auto",
                backgroundRepeat: "repeat-y",
                backgroundPosition: "center top",
                clipPath: `polygon(0 ${mouldingWidth * INCHES_TO_PX * previewScale}px, 100% 0, 100% 100%, 0 calc(100% - ${mouldingWidth * INCHES_TO_PX * previewScale}px))`,
                boxShadow: "-2px 0 8px rgba(0,0,0,0.15)",
                filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.08))",
              }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              boxShadow: `inset 0 0 0 ${mouldingWidth * INCHES_TO_PX * previewScale}px ${frameColor}`,
              zIndex: 10,
              filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.08))",
            }}
          />
        )}

        <div
          className="absolute"
          style={{
            top: `${mouldingWidth * INCHES_TO_PX * previewScale}px`,
            left: `${mouldingWidth * INCHES_TO_PX * previewScale}px`,
            width: `${Math.max(0, interiorWidth)}px`,
            height: `${Math.max(0, interiorHeight)}px`,
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          <div
            className="absolute"
            style={{
              left: `${MAT_SAFETY_IN * INCHES_TO_PX * previewScale}px`,
              top: `${MAT_SAFETY_IN * INCHES_TO_PX * previewScale}px`,
              width: `${interiorWidth - 2 * (MAT_SAFETY_IN * INCHES_TO_PX * previewScale)}px`,
              height: `${interiorHeight - 2 * (MAT_SAFETY_IN * INCHES_TO_PX * previewScale)}px`,
              backgroundColor: "#ffffff",
            }}
          />

          <div className="absolute inset-0">
            {layoutConfig.openings
              ?.map((o, i) => ({ ...o, __originalIndex: i }))
              .sort((a, b) => {
                const zA =
                  (a as { zIndex?: number; __originalIndex: number }).zIndex ??
                  (a as { __originalIndex: number }).__originalIndex;
                const zB =
                  (b as { zIndex?: number; __originalIndex: number }).zIndex ??
                  (b as { __originalIndex: number }).__originalIndex;
                return zA - zB;
              })
              .map((opening, index) => {
                const openingAny = opening as {
                  type: string;
                  x: number;
                  y: number;
                  width?: number;
                  height?: number;
                  diameter?: number;
                  purpose?: string;
                };
                if (openingAny.type === "rectangle" && openingAny.width && openingAny.height) {
                  return (
                    <div
                      key={`artwork-rect-${index}`}
                      className="absolute"
                      style={{
                        left: `${(openingAny.x + MAT_SAFETY_IN) * INCHES_TO_PX * previewScale}px`,
                        top: `${(openingAny.y + MAT_SAFETY_IN) * INCHES_TO_PX * previewScale}px`,
                        width: `${(openingAny.width - 2 * MAT_SAFETY_IN) * INCHES_TO_PX * previewScale}px`,
                        height: `${(openingAny.height - 2 * MAT_SAFETY_IN) * INCHES_TO_PX * previewScale}px`,
                      }}
                    >
                      {openingPurposeCover(openingAny) &&
                        (albumCoverImage ? (
                          <img
                            src={albumCoverImage}
                            alt="Album cover"
                            className="w-full h-full object-cover"
                          />
                        ) : layoutType === "cd" &&
                          (layout === "disc-with-cover" ||
                            layout === "cover-only" ||
                            layout === "double-disc") ? (
                          <img
                            src="/cd/insert-placeholder.jpg"
                            alt="CD insert placeholder"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex flex-col items-center justify-center gap-2 p-8"
                            style={{
                              background: "linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%)",
                              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
                            }}
                          >
                            {layoutType === "cd" ? (
                              <img
                                src={CD_DISC_IMAGE}
                                alt="CD disc"
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  borderRadius: "50%",
                                  flexShrink: 0,
                                }}
                              />
                            ) : (
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 100 100"
                                style={{ flexShrink: 0 }}
                              >
                                <defs>
                                  <radialGradient id="record-icon-gradient">
                                    <stop offset="0%" stopColor="#2a2a2a" />
                                    <stop offset="50%" stopColor="#0a0a0a" />
                                    <stop offset="100%" stopColor="#000000" />
                                  </radialGradient>
                                </defs>
                                <circle cx="50" cy="50" r="50" fill="url(#record-icon-gradient)" />
                                {Array.from({ length: 20 }).map((_, i) => (
                                  <circle
                                    key={i}
                                    cx="50"
                                    cy="50"
                                    r={18 + i * 1.4}
                                    fill="none"
                                    stroke={i % 2 === 0 ? "#404040" : "#1a1a1a"}
                                    strokeWidth="0.5"
                                    opacity="0.2"
                                  />
                                ))}
                                <circle cx="50" cy="50" r="10" fill="#ff7722" />
                                <circle cx="50" cy="50" r="2.5" fill="#2a2a2a" />
                              </svg>
                            )}
                            <div
                              style={{
                                width: "50px",
                                height: "1px",
                                backgroundColor: "#2a2a2a",
                                opacity: "0.2",
                                flexShrink: 0,
                              }}
                            />
                            <div
                              className="text-center"
                              style={{
                                color: "#2a2a2a",
                                fontFamily: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
                                fontSize:
                                  layout === "double-with-covers"
                                    ? "clamp(7.5px, 2vw, 15px)"
                                    : "15px",
                                letterSpacing: "0.12em",
                                lineHeight: "1.4",
                                fontWeight: "400",
                                flexShrink: 0,
                              }}
                            >
                              YOUR MUSIC,
                              <br />
                              FRAMED
                            </div>
                          </div>
                        ))}
                    </div>
                  );
                }

                if (openingAny.type === "circle" && openingAny.diameter) {
                  const radiusPx =
                    (openingAny.diameter / 2 - MAT_SAFETY_IN) * INCHES_TO_PX * previewScale;
                  const centerX = openingAny.x * INCHES_TO_PX * previewScale;
                  const centerY = openingAny.y * INCHES_TO_PX * previewScale;
                  const isCDLayout = layoutType === "cd";

                  return (
                    <div
                      key={`artwork-circle-${index}`}
                      className="absolute rounded-full overflow-hidden"
                      style={{
                        left: `${centerX - radiusPx}px`,
                        top: `${centerY - radiusPx}px`,
                        width: `${(openingAny.diameter - 2 * MAT_SAFETY_IN) * INCHES_TO_PX * previewScale}px`,
                        height: `${(openingAny.diameter - 2 * MAT_SAFETY_IN) * INCHES_TO_PX * previewScale}px`,
                      }}
                    >
                      {isCDLayout ? (
                        <img
                          src={CD_DISC_IMAGE}
                          alt="CD disc"
                          className="w-full h-full object-cover"
                          style={{ display: "block", transform: "scale(1.02)" }}
                        />
                      ) : (
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 100 100"
                          style={{ display: "block" }}
                        >
                          <defs>
                            <radialGradient id={`record-gradient-${index}`}>
                              <stop offset="0%" stopColor="#1a1a1a" />
                              <stop offset="40%" stopColor="#0d0d0d" />
                              <stop offset="70%" stopColor="#050505" />
                              <stop offset="100%" stopColor="#000000" />
                            </radialGradient>
                            <radialGradient id={`record-highlight-${index}`}>
                              <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                              <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
                              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                            </radialGradient>
                          </defs>
                          <circle cx="50" cy="50" r="50" fill={`url(#record-gradient-${index})`} />
                          {Array.from({ length: 45 }).map((_, i) => (
                            <circle
                              key={i}
                              cx="50"
                              cy="50"
                              r={18 + i * 0.68}
                              fill="none"
                              stroke={i % 3 === 0 ? "#3a3a3a" : i % 3 === 1 ? "#1a1a1a" : "#0a0a0a"}
                              strokeWidth="0.4"
                              opacity={0.25 + (i % 3) * 0.05}
                            />
                          ))}
                          <ellipse
                            cx="35"
                            cy="35"
                            rx="25"
                            ry="28"
                            fill={`url(#record-highlight-${index})`}
                            opacity="0.6"
                          />
                          <circle cx="50" cy="50" r="16.5" fill="#1a1a1a" />
                          <circle cx="50" cy="50" r="15.5" fill="#ff7722" />
                          <circle
                            cx="50"
                            cy="50"
                            r="15.5"
                            fill="none"
                            stroke="rgba(0,0,0,0.2)"
                            strokeWidth="0.3"
                          />
                          <circle cx="50" cy="50" r="3.5" fill="#1a1a1a" />
                          <circle cx="50" cy="50" r="3" fill="#0a0a0a" />
                        </svg>
                      )}
                    </div>
                  );
                }
                return null;
              })}
          </div>

          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "#eeeeee",
              clipPath: `url(#${svgId}-border-mat)`,
            }}
          />

          {matType === "double" && (
            <div
              className="absolute inset-0"
              style={{
                ...getMatTilingStyle(bottomMatColor ?? "#FFFFFF", previewScale, bottomMatColor),
                clipPath: `url(#${svgId}-bottom-mat)`,
              }}
            />
          )}

          <div
            className="absolute inset-0"
            style={{
              ...(matType === "none"
                ? { backgroundColor: REVEAL_COLOR }
                : getMatTilingStyle(topMatColor, previewScale, topMatColor)),
              clipPath: `url(#${svgId})`,
            }}
          />

          {openingPath && matType !== "none" && (
            <svg
              className="absolute inset-0 pointer-events-none"
              width={interiorWidth}
              height={interiorHeight}
              style={{ overflow: "visible" }}
            >
              <path
                d={openingPath}
                fill="none"
                stroke={matBevelColor}
                strokeWidth={Math.max(2, 0.1 * INCHES_TO_PX * previewScale)}
                style={{
                  filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.1))",
                }}
              />
            </svg>
          )}

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.02) 100%)",
            }}
          />

          {brassNameplateConfig?.enabled &&
            (() => {
              const plaqueWidthIn = BRASS_NAMEPLATE_SPECS.NAMEPLATE_WIDTH;
              const plaqueHeightIn = BRASS_NAMEPLATE_SPECS.NAMEPLATE_HEIGHT;
              const plaqueOffsetFromBottomIn = 1;
              const plaqueWidth = plaqueWidthIn * INCHES_TO_PX * previewScale;
              const plaqueHeight = plaqueHeightIn * INCHES_TO_PX * previewScale;
              const plaqueOffsetFromBottom = plaqueOffsetFromBottomIn * INCHES_TO_PX * previewScale;
              const plaqueSpacePx = 1.5 * INCHES_TO_PX * previewScale;
              const matInteriorHeight = interiorHeight - plaqueSpacePx;
              let extraOffsetPx = 0;
              if (layout === "disc-with-cover") {
                extraOffsetPx = 0.575 * INCHES_TO_PX * previewScale;
              } else if (layout === "double-disc") {
                extraOffsetPx = 0.6 * INCHES_TO_PX * previewScale;
              }
              const plaqueX = (interiorWidth - plaqueWidth) / 2;
              const plaqueY =
                matInteriorHeight +
                (plaqueSpacePx - plaqueOffsetFromBottom - plaqueHeight) +
                extraOffsetPx;
              return (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: `${plaqueX}px`,
                    top: `${plaqueY}px`,
                    width: `${plaqueWidth}px`,
                    height: `${plaqueHeight}px`,
                  }}
                >
                  <BrassNameplatePreview config={brassNameplateConfig} scale={previewScale} />
                </div>
              );
            })()}
        </div>
      </div>
    </div>
  );
}
