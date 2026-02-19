"use client";

import { memo, useMemo, useCallback, useState, useEffect } from "react";
import { ImageIcon } from "lucide-react";
import type { FrameStyle } from "@framecraft/types";
import type { BrassNameplateConfig } from "@framecraft/types";
import type { Mat } from "@framecraft/config";
import type { PuckLayout } from "@framecraft/core";
import {
  computePreviewLayout,
  getMatTilingStyle,
  getMatBevelColor,
  PUCK_INSERTS,
  createPuckDataUrl,
  type PuckInsert,
} from "@framecraft/core";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";

interface PuckPreviewCanvasProps {
  layout: ReturnType<typeof computePreviewLayout>;
  framePhotos: {
    cornerUrl?: string;
    profileUrl?: string;
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  };
  currentLayout: PuckLayout;
  selectedFrame: FrameStyle;
  topMatColor: Mat;
  bottomMatColor: Mat;
  matType: "single" | "double";
  brassNameplateConfig: BrassNameplateConfig;
  bottomWeightedExtra?: number;
  plaqueExtension?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const PuckPreviewCanvas = memo(function PuckPreviewCanvas({
  layout,
  framePhotos,
  currentLayout,
  selectedFrame,
  topMatColor,
  bottomMatColor,
  matType,
  brassNameplateConfig,
  bottomWeightedExtra: _bottomWeightedExtra = 0,
  plaqueExtension: _plaqueExtension = 0,
  className,
  style,
}: PuckPreviewCanvasProps) {
  const [puckAssignments, setPuckAssignments] = useState<PuckInsert[]>([]);

  const puckOpeningCount = useMemo(() => {
    return currentLayout.openings.filter((o) => o.purpose === "puck").length;
  }, [currentLayout.openings]);

  useEffect(() => {
    const shuffled = [...PUCK_INSERTS].sort(() => Math.random() - 0.5);
    const assignments: PuckInsert[] = [];
    for (let i = 0; i < puckOpeningCount; i++) {
      assignments.push(shuffled[i % shuffled.length]!);
    }
    setPuckAssignments(assignments);
  }, [puckOpeningCount, currentLayout.id]);

  const previewScale = useMemo(() => {
    return layout.glassPx.w / currentLayout.frameInteriorWidth;
  }, [layout.glassPx.w, currentLayout.frameInteriorWidth]);

  const bevelStrokeWidth = useMemo(() => {
    return Math.max(2, 0.1 * previewScale);
  }, [previewScale]);

  const bevelColor = useMemo(() => {
    return getMatBevelColor(matType === "double" ? bottomMatColor.name : topMatColor.name);
  }, [matType, bottomMatColor.name, topMatColor.name]);

  const matReveal = 0.25;

  const openingsPx = useMemo(() => {
    return currentLayout.openings.map((opening) => {
      if (opening.type === "circle") {
        const centerX = opening.x * previewScale;
        const centerY = opening.y * previewScale;
        const radius = ((opening.diameter ?? 0) / 2) * previewScale;
        return {
          type: "circle" as const,
          cx: centerX,
          cy: centerY,
          r: radius,
          purpose: opening.purpose,
        };
      } else {
        return {
          type: "rectangle" as const,
          x: opening.x * previewScale,
          y: opening.y * previewScale,
          width: (opening.width ?? 0) * previewScale,
          height: (opening.height ?? 0) * previewScale,
          purpose: opening.purpose,
        };
      }
    });
  }, [currentLayout.openings, previewScale]);

  const generateMatClipPath = useCallback(
    (includeReveal: boolean): string => {
      const revealOffset = includeReveal ? matReveal * previewScale : 0;
      const paths: string[] = [];

      currentLayout.openings.forEach((opening) => {
        if (opening.type === "circle") {
          const r = ((opening.diameter ?? 0) / 2) * previewScale - revealOffset;
          const cx = opening.x * previewScale;
          const cy = opening.y * previewScale;
          paths.push(
            `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy}`
          );
        } else {
          const x = opening.x * previewScale + revealOffset;
          const y = opening.y * previewScale + revealOffset;
          const w = (opening.width ?? 0) * previewScale - revealOffset * 2;
          const h = (opening.height ?? 0) * previewScale - revealOffset * 2;
          paths.push(`M ${x} ${y} h ${w} v ${h} h ${-w} Z`);
        }
      });

      const outerRect = `M 0 0 h ${layout.glassPx.w} v ${layout.glassPx.h} h ${-layout.glassPx.w} Z`;
      return `${outerRect} ${paths.join(" ")}`;
    },
    [currentLayout.openings, matReveal, previewScale, layout.glassPx.w, layout.glassPx.h]
  );

  const bottomMatPath = useMemo(
    () => generateMatClipPath(matType === "double"),
    [generateMatClipPath, matType]
  );

  const topMatPath = useMemo(() => generateMatClipPath(false), [generateMatClipPath]);

  const clipPathIds = useMemo(
    () => ({
      bottomMat: `puck-bottom-mat-${currentLayout.id}-${Date.now()}`,
      topMat: `puck-top-mat-${currentLayout.id}-${Date.now()}`,
    }),
    [currentLayout.id]
  );

  const renderOpenings = () => {
    let puckIndex = 0;
    return (
      <>
        {openingsPx.map((opening, idx) => {
          if (opening.type === "circle" && opening.purpose === "puck") {
            const puckInsert = puckAssignments[puckIndex];
            puckIndex++;
            const puckDataUrl = puckInsert ? createPuckDataUrl(puckInsert) : null;

            return (
              <div
                key={`opening-${idx}`}
                style={{
                  position: "absolute",
                  left: `${opening.cx - opening.r}px`,
                  top: `${opening.cy - opening.r}px`,
                  width: `${opening.r * 2}px`,
                  height: `${opening.r * 2}px`,
                  borderRadius: "50%",
                  backgroundColor: "#1a1a2e",
                  boxShadow: "inset 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 4px rgba(0,0,0,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  overflow: "hidden",
                  transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                }}
                data-testid={`puck-opening-${idx}`}
              >
                {puckDataUrl ? (
                  <img
                    src={puckDataUrl}
                    alt={puckInsert?.name ?? "Hockey puck"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
                )}
              </div>
            );
          } else if (opening.type === "circle") {
            return (
              <div
                key={`opening-${idx}`}
                style={{
                  position: "absolute",
                  left: `${opening.cx - opening.r}px`,
                  top: `${opening.cy - opening.r}px`,
                  width: `${opening.r * 2}px`,
                  height: `${opening.r * 2}px`,
                  borderRadius: "50%",
                  backgroundColor: "#1a1a2e",
                  boxShadow: "inset 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 4px rgba(0,0,0,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                }}
              />
            );
          } else {
            return (
              <div
                key={`opening-${idx}`}
                style={{
                  position: "absolute",
                  left: `${opening.x}px`,
                  top: `${opening.y}px`,
                  width: `${opening.width}px`,
                  height: `${opening.height}px`,
                  backgroundColor: "#1a1a2e",
                  boxShadow: "inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                }}
              >
                <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
              </div>
            );
          }
        })}

        <svg
          className="absolute inset-0 pointer-events-none"
          width={layout.glassPx.w}
          height={layout.glassPx.h}
          style={{ zIndex: 4, overflow: "visible" }}
        >
          {openingsPx.map((opening, idx) => {
            if (opening.type === "circle") {
              return (
                <circle
                  key={`bevel-${idx}`}
                  cx={opening.cx}
                  cy={opening.cy}
                  r={opening.r}
                  fill="none"
                  stroke={bevelColor}
                  strokeWidth={bevelStrokeWidth}
                  style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.1))" }}
                />
              );
            } else {
              return (
                <rect
                  key={`bevel-${idx}`}
                  x={opening.x}
                  y={opening.y}
                  width={opening.width}
                  height={opening.height}
                  fill="none"
                  stroke={bevelColor}
                  strokeWidth={bevelStrokeWidth}
                  style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.1))" }}
                />
              );
            }
          })}
        </svg>
      </>
    );
  };

  return (
    <div
      className={className}
      style={{
        width: `${layout.outerPx.w}px`,
        height: `${layout.outerPx.h}px`,
        position: "relative",
        ...style,
      }}
      data-testid="puck-preview-canvas"
    >
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id={clipPathIds.bottomMat} clipPathUnits="userSpaceOnUse" clipRule="evenodd">
            <path d={bottomMatPath} />
          </clipPath>
          <clipPath id={clipPathIds.topMat} clipPathUnits="userSpaceOnUse" clipRule="evenodd">
            <path d={topMatPath} />
          </clipPath>
        </defs>
      </svg>

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
              height: `${layout.frameFacePx}px`,
              backgroundImage: `url(${framePhotos.topUrl})`,
              backgroundSize: "auto 100%",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "left center",
              clipPath: `polygon(0 0, 100% 0, calc(100% - ${layout.frameFacePx}px) 100%, ${layout.frameFacePx}px 100%)`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          />
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
              clipPath: `polygon(${layout.frameFacePx}px 0, calc(100% - ${layout.frameFacePx}px) 0, 100% 100%, 0 100%)`,
              boxShadow: "0 -2px 8px rgba(0,0,0,0.15)",
            }}
          />
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
              clipPath: `polygon(0 0, 100% ${layout.frameFacePx}px, 100% calc(100% - ${layout.frameFacePx}px), 0 100%)`,
              boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
            }}
          />
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
              clipPath: `polygon(0 ${layout.frameFacePx}px, 100% 0, 100% 100%, 0 calc(100% - ${layout.frameFacePx}px))`,
              boxShadow: "-2px 0 8px rgba(0,0,0,0.15)",
            }}
          />
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${selectedFrame.color} 0%, ${selectedFrame.borderColor} 100%)`,
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.3)",
          }}
        />
      )}

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
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `url(#${clipPathIds.bottomMat})`,
            zIndex: 2,
            ...getMatTilingStyle(
              matType === "single" ? topMatColor.name : bottomMatColor.name,
              previewScale,
              matType === "single" ? topMatColor.hexColor : bottomMatColor.hexColor
            ),
            transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
          }}
        />

        {matType === "double" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `url(#${clipPathIds.topMat})`,
              zIndex: 3,
              ...getMatTilingStyle(topMatColor.name, previewScale, topMatColor.hexColor),
              transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
            }}
          />
        )}

        {renderOpenings()}

        {brassNameplateConfig.enabled && (
          <div
            data-testid="puck-brass-nameplate"
            style={{
              position: "absolute",
              bottom: `${0.5 * previewScale}px`,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            <BrassNameplatePreview config={brassNameplateConfig} scale={previewScale / 150} />
          </div>
        )}
      </div>
    </div>
  );
});
