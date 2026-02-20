"use client";

import { memo, useMemo } from "react";
import { Award } from "lucide-react";
import type { FrameStyle } from "@framecraft/types";
import type { MilitaryMatOption } from "@framecraft/core";
import type { BrassNameplateConfig } from "@framecraft/types";
import {
  computePreviewLayout,
  getMatTilingStyle,
  getMatBevelColor,
  getSharedAssetUrl,
} from "@framecraft/core";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";

interface MilitaryPreviewCanvasProps {
  layout: ReturnType<typeof computePreviewLayout>;
  framePhotos: {
    cornerUrl?: string;
    profileUrl?: string;
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  };
  adjustedLayout: {
    frameWidth: number;
    frameHeight: number;
    matOpeningWidth: number;
    matOpeningHeight: number;
    matBorderTop: number;
    matBorderRight: number;
    matBorderBottom: number;
    matBorderLeft: number;
    brassPlaqueSpace: number;
  };
  selectedFrame: FrameStyle;
  topMatColor: MilitaryMatOption;
  bottomMatColor: MilitaryMatOption;
  backingColor: MilitaryMatOption;
  brassNameplateConfig?: BrassNameplateConfig;
  className?: string;
  style?: React.CSSProperties;
}

function getBackingSwatchUrl(swatchFile: string | undefined): string | undefined {
  if (!swatchFile) return undefined;
  // Suede swatches (29-38.jpg) - try shared mats path; fallback to /mats/ for local
  return getSharedAssetUrl(`mats/${swatchFile}`);
}

export const MilitaryPreviewCanvas = memo(function MilitaryPreviewCanvas({
  layout,
  framePhotos,
  adjustedLayout,
  selectedFrame,
  topMatColor,
  bottomMatColor,
  backingColor,
  brassNameplateConfig,
  className,
  style,
}: MilitaryPreviewCanvasProps) {
  const previewScale = useMemo(() => {
    const totalWidth =
      adjustedLayout.matOpeningWidth + adjustedLayout.matBorderLeft + adjustedLayout.matBorderRight;
    return layout.glassPx.w / totalWidth;
  }, [layout.glassPx.w, adjustedLayout]);

  const bevelWidthPx = useMemo(() => {
    const width = layout.scale * 0.0625;
    return Math.max(1, isNaN(width) || !isFinite(width) ? 1 : width);
  }, [layout.scale]);

  const matRevealPx = useMemo(() => layout.scale * 0.25, [layout.scale]);

  const frameLipPx = useMemo(() => {
    const ratio = selectedFrame.rabbetInsetRatio ?? 0.92;
    return layout.frameFacePx * ratio;
  }, [layout.frameFacePx, selectedFrame.rabbetInsetRatio]);

  const matBorderPx = useMemo(
    () => ({
      top: layout.scale * adjustedLayout.matBorderTop,
      right: layout.scale * adjustedLayout.matBorderRight,
      bottom: layout.scale * adjustedLayout.matBorderBottom,
      left: layout.scale * adjustedLayout.matBorderLeft,
    }),
    [layout.scale, adjustedLayout]
  );

  const nameplateDimensionsPx = useMemo(() => {
    if (!brassNameplateConfig?.enabled) return null;
    return { width: layout.scale * 4.5, height: layout.scale * 1.5 };
  }, [brassNameplateConfig?.enabled, layout.scale]);

  const backingBgImage = getBackingSwatchUrl(backingColor.swatchFile);

  const renderMatArea = () => (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: topMatColor.hex,
          ...getMatTilingStyle(topMatColor.name, previewScale, topMatColor.hex),
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.08)",
          transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `${matBorderPx.top}px`,
            left: `${matBorderPx.left}px`,
            right: `${matBorderPx.right}px`,
            bottom: `${matBorderPx.bottom}px`,
            backgroundColor: bottomMatColor.hex,
            border: `${Math.max(1.5, layout.scale * 0.06)}px solid #E0E0E0`,
            transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: `${matRevealPx}px`,
              left: `${matRevealPx}px`,
              right: `${matRevealPx}px`,
              bottom: `${matRevealPx}px`,
              backgroundColor: backingColor.hex,
              backgroundImage: backingBgImage ? `url(${backingBgImage})` : undefined,
              backgroundSize: backingBgImage ? "cover" : undefined,
              backgroundPosition: backingBgImage ? "center" : undefined,
              boxShadow: `inset 0 0 0 ${bevelWidthPx}px ${getMatBevelColor(bottomMatColor.name)}, inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
            }}
          >
            <Award className="w-12 h-12 text-muted-foreground/30" />
          </div>
        </div>

        {brassNameplateConfig?.enabled && nameplateDimensionsPx && (
          <div
            style={{
              position: "absolute",
              bottom: `${layout.scale * 1}px`,
              left: "50%",
              transform: "translateX(-50%)",
              width: `${nameplateDimensionsPx.width}px`,
              height: `${nameplateDimensionsPx.height}px`,
              zIndex: 10,
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <BrassNameplatePreview config={brassNameplateConfig} scale={layout.scale / 150} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  border: "1.5px solid #eeeeee",
                  borderRadius: "2px",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );

  const matAreaStyle = {
    position: "absolute" as const,
    top: `${frameLipPx}px`,
    left: `${frameLipPx}px`,
    right: `${frameLipPx}px`,
    bottom: `${frameLipPx}px`,
    overflow: "hidden" as const,
    zIndex: 1,
  };

  const hasFramePhotos =
    framePhotos.topUrl && framePhotos.bottomUrl && framePhotos.leftUrl && framePhotos.rightUrl;

  return (
    <div className={className} style={style} data-testid="military-preview-canvas">
      {hasFramePhotos ? (
        <div
          style={{
            width: `${layout.outerPx.w}px`,
            height: `${layout.outerPx.h}px`,
            position: "relative",
            backgroundColor: topMatColor.hex,
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.25))",
          }}
        >
          <div
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: `${layout.frameFacePx}px`,
              position: "absolute",
              backgroundImage: `url(${framePhotos.topUrl})`,
              backgroundSize: "auto 100%",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "left center",
              zIndex: 10,
              clipPath: `polygon(0 0, 100% 0, calc(100% - ${layout.frameFacePx}px) 100%, ${layout.frameFacePx}px 100%)`,
            }}
          />
          <div
            style={{
              bottom: 0,
              left: 0,
              right: 0,
              height: `${layout.frameFacePx}px`,
              position: "absolute",
              backgroundImage: `url(${framePhotos.bottomUrl})`,
              backgroundSize: "auto 100%",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "left center",
              zIndex: 10,
              clipPath: `polygon(${layout.frameFacePx}px 0, calc(100% - ${layout.frameFacePx}px) 0, 100% 100%, 0 100%)`,
            }}
          />
          <div
            style={{
              top: 0,
              left: 0,
              bottom: 0,
              width: `${layout.frameFacePx}px`,
              position: "absolute",
              backgroundImage: `url(${framePhotos.leftUrl})`,
              backgroundSize: "100% auto",
              backgroundRepeat: "repeat-y",
              backgroundPosition: "center top",
              zIndex: 10,
              clipPath: `polygon(0 0, 100% ${layout.frameFacePx}px, 100% calc(100% - ${layout.frameFacePx}px), 0 100%)`,
            }}
          />
          <div
            style={{
              top: 0,
              right: 0,
              bottom: 0,
              width: `${layout.frameFacePx}px`,
              position: "absolute",
              backgroundImage: `url(${framePhotos.rightUrl})`,
              backgroundSize: "100% auto",
              backgroundRepeat: "repeat-y",
              backgroundPosition: "center top",
              zIndex: 10,
              clipPath: `polygon(0 ${layout.frameFacePx}px, 100% 0, 100% 100%, 0 calc(100% - ${layout.frameFacePx}px))`,
            }}
          />
          <div style={matAreaStyle}>{renderMatArea()}</div>
        </div>
      ) : (
        <div
          style={{
            width: `${layout.outerPx.w}px`,
            height: `${layout.outerPx.h}px`,
            borderTop: `${frameLipPx}px solid ${selectedFrame.borderColor}`,
            borderLeft: `${frameLipPx}px solid ${selectedFrame.borderColor}`,
            borderRight: `${frameLipPx}px solid ${selectedFrame.color}`,
            borderBottom: `${frameLipPx}px solid ${selectedFrame.color}`,
            boxShadow:
              "inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.25)",
            position: "relative",
            transition: "border-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
          }}
        >
          <div style={matAreaStyle}>{renderMatArea()}</div>
        </div>
      )}
    </div>
  );
});
