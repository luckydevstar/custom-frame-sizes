"use client";

/**
 * Ticket Stub Preview – frame + mat + openings + optional brass nameplate.
 * Placeholder images:
 *   - ticket-frames/insert-images/ticket-1..7.jpg for ticket openings
 *   - ticket-frames/insert-images/concert_photo_2.jpg for the photo opening (ticket + photo layouts)
 *   - ticket-frames/insert-images/poster_insert_1.png for the poster opening (concert poster + tickets layouts)
 */

import { memo, useMemo } from "react";
import { Ticket } from "lucide-react";
import type { FrameStyle } from "@framecraft/types";
import type { BrassNameplateConfig } from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS } from "@framecraft/types";
import type { Mat } from "@framecraft/config";
import {
  TICKET_STUB_LAYOUTS,
  DEFAULT_FRAME_MOLDING_WIDTH,
  getSharedAssetUrl,
  getMatTilingStyle,
  getMatBevelColor,
} from "@framecraft/core";
import type { TicketStubLayoutType } from "@framecraft/core";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";

const TICKET_INSERT_COUNT = 7;

/** Concert/event photo placeholder for the photo opening in ticket+photo layouts. */
const CONCERT_PHOTO_PLACEHOLDER_PATH = "ticket-frames/insert-images/concert_photo_2.jpg";
/** Concert poster placeholder for the poster opening in concert poster + tickets layouts. */
const POSTER_PLACEHOLDER_PATH = "ticket-frames/insert-images/poster_insert_1.png";

function getPlaceholderImage(type: string, index: number): string {
  if (type === "photo") {
    return getSharedAssetUrl(CONCERT_PHOTO_PLACEHOLDER_PATH);
  }
  if (type === "poster") {
    return getSharedAssetUrl(POSTER_PLACEHOLDER_PATH);
  }
  const ticketIndex = (index % TICKET_INSERT_COUNT) + 1;
  const path = `ticket-frames/insert-images/ticket-${ticketIndex}.jpg`;
  return getSharedAssetUrl(path);
}

export interface TicketStubPreviewProps {
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
  layoutId: TicketStubLayoutType;
  containerWidth: number;
  containerHeight: number;
  brassNameplateConfig?: BrassNameplateConfig;
  isMobile: boolean;
  bottomWeightedExtra?: number;
  userPhoto?: string | null;
  onEditPhoto?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

function getAdjustedFrameHeight(
  layout: (typeof TICKET_STUB_LAYOUTS)[0] | undefined,
  nameplateEnabled: boolean,
  bottomWeightedExtra: number = 0
): number {
  if (!layout) return 0;
  let height = layout.frameHeight + bottomWeightedExtra;
  if (nameplateEnabled) {
    const lowestOpeningBottom = layout.openings.reduce(
      (maxY, o) => Math.max(maxY, o.y + o.height),
      0
    );
    const TARGET_BOTTOM_MAT = 3.75;
    const currentBottomMat = layout.frameHeight - lowestOpeningBottom;
    height += Math.max(0, TARGET_BOTTOM_MAT - currentBottomMat);
  }
  return height;
}

const MAT_BEVEL_WIDTH = 0.08;
const TICKET_NAMEPLATE_OFFSET = 0.75;

export const TicketStubPreview = memo(function TicketStubPreview({
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
  userPhoto,
  onEditPhoto,
  className,
  style,
}: TicketStubPreviewProps) {
  const layout = useMemo(() => TICKET_STUB_LAYOUTS.find((l) => l.id === layoutId), [layoutId]);

  const adjustedHeight = layout
    ? getAdjustedFrameHeight(layout, !!brassNameplateConfig?.enabled, bottomWeightedExtra)
    : 0;
  const frameAspectRatio = layout ? layout.frameWidth / adjustedHeight : 1;
  const containerAspectRatio = containerWidth / containerHeight;
  let width = 0;
  let height = 0;
  if (layout) {
    if (frameAspectRatio > containerAspectRatio) {
      width = containerWidth * 0.98;
      height = width / frameAspectRatio;
    } else {
      height = containerHeight * 0.98;
      width = height * frameAspectRatio;
    }
  }
  const scale = layout && width > 0 ? width / layout.frameWidth : 0;
  const frameFaceWidth = scale * DEFAULT_FRAME_MOLDING_WIDTH;
  const frameLipPx = frameFaceWidth * (selectedFrame.rabbetInsetRatio ?? 0.92);
  const matRevealPx = scale * matReveal;

  const topMatTiling = useMemo(
    () => getMatTilingStyle(topMatColor.name, scale),
    [topMatColor.name, scale]
  );
  const bottomMatTiling = useMemo(
    () => getMatTilingStyle(bottomMatColor.name, scale),
    [bottomMatColor.name, scale]
  );
  const bevelColor = useMemo(() => getMatBevelColor(bottomMatColor.name), [bottomMatColor.name]);
  const bevelBorderWidth = Math.max(1.5, MAT_BEVEL_WIDTH * scale);

  const plaquePositioning = useMemo(() => {
    if (!layout || !brassNameplateConfig?.enabled) return null;
    const plaqueWidthPx = BRASS_NAMEPLATE_SPECS.NAMEPLATE_WIDTH * scale;
    const plaqueHeightPx = BRASS_NAMEPLATE_SPECS.NAMEPLATE_HEIGHT * scale;
    const clearanceFromOpeningPx = TICKET_NAMEPLATE_OFFSET * scale;
    const nameplateRenderScale = scale / 150;
    const lowestOpeningBottomPx = layout.openings.reduce(
      (maxY, o) => Math.max(maxY, (o.y + o.height) * scale),
      0
    );
    const plaqueY = lowestOpeningBottomPx + clearanceFromOpeningPx;
    const plaqueX = (width - plaqueWidthPx) / 2;
    return {
      x: plaqueX,
      y: plaqueY,
      width: plaqueWidthPx,
      height: plaqueHeightPx,
      renderScale: nameplateRenderScale,
    };
  }, [layout, brassNameplateConfig?.enabled, scale, width]);

  const dropShadow = isMobile
    ? "drop-shadow(0 4px 12px rgba(0,0,0,0.20))"
    : "drop-shadow(0 8px 24px rgba(0,0,0,0.25))";

  const matAreaWidthFinal = layout ? width - frameLipPx * 2 : 0;
  const matAreaHeightFinal =
    layout && scale > 0 ? scale * (layout.frameHeight + bottomWeightedExtra) - frameLipPx * 2 : 0;

  if (!layout) {
    return (
      <div className={className} style={style}>
        <div className="flex items-center justify-center h-full">
          <Ticket className="w-12 h-12 text-muted-foreground/30 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        ...style,
        position: "relative",
        width: `${width}px`,
        height: `${height}px`,
        margin: "0 auto",
        filter: dropShadow,
      }}
      data-testid="ticket-stub-preview-canvas"
    >
      {framePhotos.topUrl &&
        framePhotos.bottomUrl &&
        framePhotos.leftUrl &&
        framePhotos.rightUrl && (
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
        )}

      <div
        style={{
          position: "absolute",
          top: `${frameLipPx}px`,
          left: `${frameLipPx}px`,
          width: `${matAreaWidthFinal}px`,
          height: `${matAreaHeightFinal}px`,
          zIndex: 5,
        }}
      >
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
            const lowestOpeningBottom = layout.openings.reduce(
              (maxY, o) => Math.max(maxY, o.y + o.height),
              0
            );
            const extensionNeeded = Math.max(0, 3.75 - (layout.frameHeight - lowestOpeningBottom));
            const plaqueExtensionPx = scale * extensionNeeded;
            if (extensionNeeded <= 0) return null;
            return (
              <div
                style={{
                  position: "absolute",
                  top: `${matAreaHeightFinal}px`,
                  left: 0,
                  width: "100%",
                  height: `${plaqueExtensionPx}px`,
                  ...(matType === "double" ? topMatTiling : bottomMatTiling),
                }}
              />
            );
          })()}

        {matType === "double" && (
          <svg
            className="absolute inset-0 pointer-events-none"
            width={matAreaWidthFinal}
            height={matAreaHeightFinal}
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

        <svg
          className="absolute inset-0 pointer-events-none"
          width={matAreaWidthFinal}
          height={matAreaHeightFinal}
          style={{ zIndex: 6 }}
        >
          {layout.openings.map((opening, idx) => {
            const x = Math.max(0, opening.x * scale - frameLipPx);
            const y = Math.max(0, opening.y * scale - frameLipPx);
            const w = opening.width * scale;
            const h = opening.height * scale;
            return (
              <rect
                key={`top-bevel-${idx}`}
                x={x}
                y={y}
                width={w}
                height={h}
                fill="none"
                stroke={bevelColor}
                strokeWidth={bevelBorderWidth}
              />
            );
          })}
        </svg>

        {layout.openings.map((opening, index) => {
          const x = opening.x * scale - frameLipPx;
          const y = opening.y * scale - frameLipPx;
          const w = opening.width * scale;
          const h = opening.height * scale;
          const revealPx = matType === "double" ? matRevealPx : 0;
          const isPhotoOpening = opening.type === "photo";
          const displayImage =
            isPhotoOpening && userPhoto ? userPhoto : getPlaceholderImage(opening.type, index);
          const showEditButton = isPhotoOpening && !!userPhoto && onEditPhoto;

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
                  }}
                />
              )}
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
                <img
                  src={displayImage}
                  alt={`${opening.type} insert ${index + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "2px" }}
                  loading="lazy"
                  data-testid={`img-ticket-stub-${opening.type}-${index}`}
                />
                {showEditButton && (
                  <button
                    type="button"
                    onClick={onEditPhoto}
                    className="absolute bottom-1 right-1 bg-black/60 hover:bg-black/80 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1"
                    style={{
                      fontSize: Math.max(10, scale * 0.3),
                      padding: `${Math.max(2, scale * 0.1)}px ${Math.max(4, scale * 0.15)}px`,
                    }}
                    data-testid="button-edit-photo-preview"
                  >
                    Edit Photo
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {plaquePositioning && (
        <div
          style={{
            position: "absolute",
            left: `${plaquePositioning.x}px`,
            top: `${plaquePositioning.y}px`,
            width: `${plaquePositioning.width}px`,
            height: `${plaquePositioning.height}px`,
            zIndex: 15,
          }}
          data-testid="ticket-stub-nameplate"
        >
          <BrassNameplatePreview
            config={brassNameplateConfig!}
            scale={plaquePositioning.renderScale}
          />
        </div>
      )}
    </div>
  );
});
