"use client";

import { memo, useMemo } from "react";
import { Heart } from "lucide-react";
import type { FrameStyle } from "@framecraft/types";
import type { BrassNameplateConfig } from "@framecraft/types";
import type { Mat } from "@framecraft/config";
import { getMatTilingStyle, getMatBevelColor } from "@framecraft/core";
import type { WeddingFrameConfig, WeddingPreviewDimensions } from "@framecraft/core";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";

const MAT_REVEAL = 0.25;

export interface WeddingInvitationPreviewProps {
  config: WeddingFrameConfig;
  previewDimensions: WeddingPreviewDimensions;
  framePhotos: { topUrl?: string; bottomUrl?: string; leftUrl?: string; rightUrl?: string };
  selectedFrame: FrameStyle;
  topMatColor: Mat;
  bottomMatColor: Mat;
  matType: "single" | "double";
  brassNameplateConfig?: BrassNameplateConfig;
  bottomWeightedExtra?: number;
  invitationImage?: string | null;
  secondaryImage?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

function InvitationPlaceholder({ widthPx, heightPx }: { widthPx: number; heightPx: number }) {
  const fontSize = Math.min(widthPx, heightPx) * 0.08;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FDF8F5 0%, #FAF3EE 100%)",
        border: "1px solid #E8DDD4",
        padding: 8,
        textAlign: "center",
      }}
    >
      <Heart
        style={{ width: fontSize * 2, height: fontSize * 2, color: "#C9A86C", marginBottom: 4 }}
      />
      <span style={{ fontFamily: "Georgia, serif", fontSize, color: "#6B5344" }}>Invitation</span>
    </div>
  );
}

function PhotoPlaceholder({
  widthPx,
  heightPx,
  isRSVP,
}: {
  widthPx: number;
  heightPx: number;
  isRSVP?: boolean;
}) {
  const fontSize = Math.min(widthPx, heightPx) * 0.1;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f0f0",
        color: "#888",
        fontSize,
      }}
    >
      {isRSVP ? "RSVP" : "Photo"}
    </div>
  );
}

export const WeddingInvitationPreview = memo(function WeddingInvitationPreview({
  config,
  previewDimensions,
  framePhotos,
  selectedFrame,
  topMatColor,
  bottomMatColor,
  matType,
  brassNameplateConfig,
  invitationImage,
  secondaryImage,
  className,
  style,
}: WeddingInvitationPreviewProps) {
  const { scale, previewWidth, previewHeight, frameFaceWidth, openings } = previewDimensions;
  const bevelWidthPx = Math.max(1, scale * 0.0625);
  const matRevealPx = scale * MAT_REVEAL;
  const glassAreaWidth = previewWidth - frameFaceWidth * 2;
  const glassAreaHeight = previewHeight - frameFaceWidth * 2;

  const topMatTilingStyle = useMemo(
    () => getMatTilingStyle(topMatColor.name, scale),
    [topMatColor.name, scale]
  );
  const bottomMatTilingStyle = useMemo(
    () => getMatTilingStyle(bottomMatColor.name, scale),
    [bottomMatColor.name, scale]
  );
  const topBevelColor = useMemo(() => getMatBevelColor(topMatColor.name), [topMatColor.name]);
  const bottomBevelColor = useMemo(
    () => getMatBevelColor(bottomMatColor.name),
    [bottomMatColor.name]
  );

  const nameplateDimensionsPx = useMemo(() => {
    if (!brassNameplateConfig?.enabled) return null;
    return { width: scale * 4.5, height: scale * 1.5 };
  }, [brassNameplateConfig?.enabled, scale]);

  const hasFrameTextures = !!(
    framePhotos.topUrl &&
    framePhotos.bottomUrl &&
    framePhotos.leftUrl &&
    framePhotos.rightUrl
  );

  return (
    <div
      className={className}
      style={{ ...style, filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.25))" }}
      data-testid="wedding-preview-canvas"
    >
      <div
        style={{
          width: `${previewWidth}px`,
          height: `${previewHeight}px`,
          position: "relative",
          backgroundColor: selectedFrame.borderColor,
        }}
      >
        {hasFrameTextures ? (
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
                left: 0,
                bottom: 0,
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
                right: 0,
                bottom: 0,
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
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: `${frameFaceWidth}px solid ${selectedFrame.borderColor ?? selectedFrame.color}`,
              zIndex: 10,
              pointerEvents: "none",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            top: `${frameFaceWidth}px`,
            left: `${frameFaceWidth}px`,
            width: `${glassAreaWidth}px`,
            height: `${glassAreaHeight}px`,
            ...topMatTilingStyle,
            zIndex: 1,
          }}
        >
          {openings.map((opening, index) => (
            <div key={index} style={{ position: "absolute" }}>
              <div
                style={{
                  position: "absolute",
                  left: `${opening.x - bevelWidthPx}px`,
                  top: `${opening.y - bevelWidthPx}px`,
                  width: `${opening.width + bevelWidthPx * 2}px`,
                  height: `${opening.height + bevelWidthPx * 2}px`,
                  background: topBevelColor,
                  zIndex: 2,
                }}
              />
              {matType === "double" && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      left: `${opening.x}px`,
                      top: `${opening.y}px`,
                      width: `${opening.width}px`,
                      height: `${opening.height}px`,
                      ...bottomMatTilingStyle,
                      zIndex: 3,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: `${opening.x + matRevealPx - bevelWidthPx}px`,
                      top: `${opening.y + matRevealPx - bevelWidthPx}px`,
                      width: `${opening.width - matRevealPx * 2 + bevelWidthPx * 2}px`,
                      height: `${opening.height - matRevealPx * 2 + bevelWidthPx * 2}px`,
                      background: bottomBevelColor,
                      zIndex: 4,
                    }}
                  />
                </>
              )}
              <div
                style={{
                  position: "absolute",
                  left: `${opening.x + (matType === "double" ? matRevealPx : 0)}px`,
                  top: `${opening.y + (matType === "double" ? matRevealPx : 0)}px`,
                  width: `${opening.width - (matType === "double" ? matRevealPx * 2 : 0)}px`,
                  height: `${opening.height - (matType === "double" ? matRevealPx * 2 : 0)}px`,
                  backgroundColor: "#F8F6F3",
                  zIndex: 5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {opening.type === "primary" ? (
                  invitationImage ? (
                    <img
                      src={invitationImage}
                      alt="Wedding invitation"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <InvitationPlaceholder widthPx={opening.width} heightPx={opening.height} />
                  )
                ) : secondaryImage ? (
                  <img
                    src={secondaryImage}
                    alt="Wedding photo"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <PhotoPlaceholder
                    widthPx={opening.width}
                    heightPx={opening.height}
                    isRSVP={config.layoutType === "invite-rsvp"}
                  />
                )}
              </div>
            </div>
          ))}

          {brassNameplateConfig?.enabled && nameplateDimensionsPx && (
            <div
              style={{
                position: "absolute",
                bottom: `${scale * 0.5}px`,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 6,
              }}
            >
              <BrassNameplatePreview config={brassNameplateConfig} scale={scale / 150} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
