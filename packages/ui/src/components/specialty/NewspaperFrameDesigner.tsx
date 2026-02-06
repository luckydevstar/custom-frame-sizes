"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Maximize, Eye, Settings, Info } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { PriceBox } from "../ui/PriceBox";
import type { PriceLineItem } from "../ui/PriceBox";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { FrameStyle, GlassType } from "@framecraft/types";
import {
  getFramesByCategory,
  getGlassTypes,
  getFrameStyleById,
  calculatePricing,
  computePreviewLayout,
  getSharedAssetUrl,
  getMatTilingStyle,
  getUniqueRandomNewspaperInsertPaths,
  getRandomNewspaperLifestyleImage,
  NEWSPAPER_PRESETS,
  getNewspaperLayoutsForSize,
  type NewspaperLayoutType,
} from "@framecraft/core";
import { useToast } from "../../hooks/use-toast";
import { ALL_MATS, getMatsInDisplayOrder, getMatById, type Mat } from "@framecraft/config";
import { useIsMobile, useMobileViewToggle } from "@framecraft/core";
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";
import type { BrassNameplateConfig } from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS } from "@framecraft/types";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { TrustBadges } from "../marketing/TrustBadges";

const frameStyles = getFramesByCategory("shadowbox");
const allGlassTypes = getGlassTypes();
const glassTypes = allGlassTypes.filter((g) => g.id === "standard" || g.id === "non-glare");

export interface NewspaperFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
  hideMobileSticky?: boolean;
}

export function NewspaperFrameDesigner({
  defaultFrameId,
  embedded = false,
  hideMobileSticky: _hideMobileSticky = false,
}: NewspaperFrameDesignerProps = {}) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  const initialFrame = useMemo(() => {
    if (defaultFrameId) return getFrameStyleById(defaultFrameId) ?? frameStyles[0];
    const frameParam = searchParams.get("frame");
    return frameParam ? (getFrameStyleById(frameParam) ?? frameStyles[0]) : frameStyles[0];
  }, [defaultFrameId, searchParams]);

  const [selectedPresetIndex, setSelectedPresetIndex] = useState(() => {
    const p = searchParams.get("preset");
    const i = p ? parseInt(p, 10) : 0;
    return i >= 0 && i < NEWSPAPER_PRESETS.length ? i : 0;
  });
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [customWidth, setCustomWidth] = useState(() => searchParams.get("customWidth") ?? "11");
  const [customHeight, setCustomHeight] = useState(() => searchParams.get("customHeight") ?? "22");
  const [layoutType, setLayoutType] = useState<NewspaperLayoutType>(() =>
    (searchParams.get("layout") as NewspaperLayoutType) === "double-newspaper"
      ? "double-newspaper"
      : "single-newspaper"
  );

  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(
    () => initialFrame ?? frameStyles[0]!
  );
  const [selectedMat, setSelectedMat] = useState<Mat>(() => getMatById("mat-1") ?? ALL_MATS[0]!);
  const [selectedMatInner, setSelectedMatInner] = useState<Mat>(
    () => getMatById("mat-4") ?? ALL_MATS[1]!
  );
  const [selectedGlass, setSelectedGlass] = useState<GlassType>(() => glassTypes[0]!);
  const [matType, setMatType] = useState<"none" | "single" | "double">("single");
  const [matBorderWidth, setMatBorderWidth] = useState("2.5");
  const [matRevealWidth, setMatRevealWidth] = useState("0.25");
  const [bottomWeighted, setBottomWeighted] = useState(false);
  const [hangingHardware, setHangingHardware] = useState<"standard" | "security">("standard");
  const [quantity, setQuantity] = useState(1);
  const [fullImageOpen, setFullImageOpen] = useState(false);
  const [lifestylePreview, setLifestylePreview] = useState<{ url: string; alt: string }>(() => {
    const img = getRandomNewspaperLifestyleImage();
    if (img) return { url: getSharedAssetUrl(img.path), alt: img.alt };
    return { url: "", alt: "Newspaper frame" };
  });

  const [brassNameplateConfig, setBrassNameplateConfig] = useState<BrassNameplateConfig>(() => ({
    enabled: searchParams.get("nameplateEnabled") === "true",
    line1: searchParams.get("nameplateLine1") ?? "",
    line2: searchParams.get("nameplateLine2") ?? "",
    line3: searchParams.get("nameplateLine3") ?? "",
    font: (searchParams.get("nameplateFont") as BrassNameplateConfig["font"]) ?? "georgia",
    color: (searchParams.get("nameplateColor") as BrassNameplateConfig["color"]) ?? "brass-black",
    includeFlag: false,
  }));

  const openingCount = layoutType === "double-newspaper" ? 2 : 1;
  const [placeholderPaths] = useState(() => getUniqueRandomNewspaperInsertPaths(openingCount));
  const displayImageUrls = useMemo(
    () => placeholderPaths.map((p) => getSharedAssetUrl(p)),
    [placeholderPaths]
  );

  const [containerSize, setContainerSize] = useState({ width: 600, height: 500 });
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [framePhotos, setFramePhotos] = useState<{
    cornerUrl?: string;
    profileUrl?: string;
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  }>({});

  const newspaperWidth = isCustomSize
    ? parseFloat(customWidth) || 11
    : NEWSPAPER_PRESETS[selectedPresetIndex]!.width;
  const newspaperHeight = isCustomSize
    ? parseFloat(customHeight) || 22
    : NEWSPAPER_PRESETS[selectedPresetIndex]!.height;
  const matBorder = parseFloat(matBorderWidth) || 2.5;
  const matReveal = parseFloat(matRevealWidth) || 0.25;
  const effectiveMatBorder = matType === "none" ? 0 : matBorder;
  const bottomWeightedExtra = bottomWeighted ? 0.5 : 0;

  const availableLayouts = useMemo(
    () =>
      getNewspaperLayoutsForSize(
        newspaperWidth,
        newspaperHeight,
        effectiveMatBorder,
        selectedFrame.mouldingWidth ?? 1
      ),
    [newspaperWidth, newspaperHeight, effectiveMatBorder, selectedFrame.mouldingWidth]
  );
  const currentLayout = useMemo(
    () => availableLayouts.find((l) => l.id === layoutType) ?? availableLayouts[0]!,
    [availableLayouts, layoutType]
  );

  const frameWidth = currentLayout.frameWidth;
  const baseFrameHeight = currentLayout.frameHeight + bottomWeightedExtra;
  const frameHeight = brassNameplateConfig.enabled
    ? baseFrameHeight + (BRASS_NAMEPLATE_SPECS.NAMEPLATE_FRAME_EXTENSION ?? 0)
    : baseFrameHeight;
  const artworkWidth = currentLayout.artworkWidth;
  const artworkHeight = currentLayout.artworkHeight;

  const standardMats = useMemo(
    () => getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", true, false),
    [isMobile]
  );
  const premiumMats = useMemo(
    () => getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", false, true),
    [isMobile]
  );

  const layout = useMemo(() => {
    const matBorderValue = matType !== "none" ? matBorder : 0;
    const bottomExt = brassNameplateConfig.enabled
      ? (BRASS_NAMEPLATE_SPECS.NAMEPLATE_FRAME_EXTENSION ?? 0)
      : 0;
    return computePreviewLayout({
      artW: artworkWidth,
      artH: artworkHeight,
      matBorderTop: matBorderValue,
      matBorderRight: matBorderValue,
      matBorderBottom: matBorderValue + bottomWeightedExtra + bottomExt,
      matBorderLeft: matBorderValue,
      matReveal: matType === "double" ? matReveal : 0,
      frameFace: selectedFrame.mouldingWidth ?? 1,
      containerWpx: containerSize.width,
      containerHpx: containerSize.height,
      paddingPx: 12,
    });
  }, [
    artworkWidth,
    artworkHeight,
    matBorder,
    matType,
    matReveal,
    bottomWeightedExtra,
    selectedFrame.mouldingWidth,
    containerSize,
    brassNameplateConfig.enabled,
  ]);

  const pixelOpenings = useMemo(
    () =>
      currentLayout.openings.map((op) => ({
        ...op,
        posX: op.x * layout.scale,
        posY: op.y * layout.scale,
        width: op.width * layout.scale,
        height: op.height * layout.scale,
      })),
    [currentLayout.openings, layout.scale]
  );

  const matBoardPath = useMemo(() => {
    if (matType === "none" || pixelOpenings.length === 0) return "";
    const { w, h } = layout.glassPx;
    const full = `M 0,0 L ${w},0 L ${w},${h} L 0,${h} Z`;
    const holes = pixelOpenings
      .map(
        (o) =>
          `M ${o.posX},${o.posY} L ${o.posX + o.width},${o.posY} L ${o.posX + o.width},${o.posY + o.height} L ${o.posX},${o.posY + o.height} Z`
      )
      .join(" ");
    return `${full} ${holes}`;
  }, [matType, pixelOpenings, layout.glassPx]);

  const bottomMatPath = useMemo(() => {
    if (matType !== "double" || pixelOpenings.length === 0) return "";
    const { w, h } = layout.glassPx;
    const rev = matReveal * layout.scale;
    const full = `M 0,0 L ${w},0 L ${w},${h} L 0,${h} Z`;
    const holes = pixelOpenings
      .map((o) => {
        const x = o.posX + rev;
        const y = o.posY + rev;
        const ww = Math.max(0, o.width - 2 * rev);
        const hh = Math.max(0, o.height - 2 * rev);
        return `M ${x},${y} L ${x + ww},${y} L ${x + ww},${y + hh} L ${x},${y + hh} Z`;
      })
      .join(" ");
    return `${full} ${holes}`;
  }, [matType, matReveal, pixelOpenings, layout.glassPx, layout.scale]);

  const clipPathId = useMemo(
    () =>
      `newspaper-${newspaperWidth}x${newspaperHeight}-${layoutType}-${matType}-${matReveal}-${brassNameplateConfig.enabled}`,
    [newspaperWidth, newspaperHeight, layoutType, matType, matReveal, brassNameplateConfig.enabled]
  );

  const previewMetrics = useMemo(() => {
    const plaqueW = BRASS_NAMEPLATE_SPECS.NAMEPLATE_WIDTH * layout.scale;
    const plaqueH = BRASS_NAMEPLATE_SPECS.NAMEPLATE_HEIGHT * layout.scale;
    const plaqueX = (layout.glassPx.w - plaqueW) / 2;
    let plaqueY = 0;
    if (pixelOpenings.length > 0) {
      const first = pixelOpenings[0]!;
      plaqueY =
        first.posY + first.height + (BRASS_NAMEPLATE_SPECS.OFFSET_FROM_OPENING ?? 1) * layout.scale;
    }
    return {
      totalPreviewHeight: layout.outerPx.h,
      plaqueWidthPx: plaqueW,
      plaqueHeightPx: plaqueH,
      plaqueXInMat: plaqueX,
      plaqueYInMat: plaqueY,
    };
  }, [layout, pixelOpenings]);

  const framePrice = useMemo(
    () =>
      calculatePricing({
        serviceType: "frame-only",
        artworkWidth: frameWidth,
        artworkHeight: baseFrameHeight,
        frameStyleId: selectedFrame.id,
        matType: "none",
        matBorderWidth: 0,
        matRevealWidth: 0,
        matColorId: "mat-1",
        glassTypeId: "standard",
      }).framePrice,
    [selectedFrame.id, frameWidth, baseFrameHeight]
  );
  const matPrice = useMemo(() => {
    if (matType === "none") return 0;
    const base = frameWidth * baseFrameHeight * 0.15;
    return matType === "double" ? base * 1.5 : base;
  }, [frameWidth, baseFrameHeight, matType]);
  const glassPrice = useMemo(() => {
    if (selectedGlass.id === "standard") return 0;
    return frameWidth * baseFrameHeight * 0.25;
  }, [frameWidth, baseFrameHeight, selectedGlass.id]);
  const hardwarePrice = hangingHardware === "security" ? 8.95 : 0;
  const nameplatePrice =
    brassNameplateConfig.enabled && matType !== "none" ? BRASS_NAMEPLATE_SPECS.PRICE : 0;
  const totalPerUnit = framePrice + matPrice + glassPrice + hardwarePrice + nameplatePrice;

  const priceItems: PriceLineItem[] = [
    { label: "Frame", amount: framePrice, testId: "text-newspaper-frame-price" },
    ...(matType !== "none"
      ? [{ label: `Mat (${matType})`, amount: matPrice, testId: "text-newspaper-mat-price" }]
      : []),
    {
      label: selectedGlass.name,
      amount: glassPrice,
      isIncluded: selectedGlass.id === "standard",
      testId: "text-newspaper-glass-price",
    },
    ...(hardwarePrice > 0
      ? [
          {
            label: "Security Hardware",
            amount: hardwarePrice,
            testId: "text-newspaper-hardware-price",
          },
        ]
      : []),
    ...(nameplatePrice > 0
      ? [
          {
            label: "Brass Nameplate",
            amount: nameplatePrice,
            testId: "text-newspaper-nameplate-price",
          },
        ]
      : []),
  ];

  const isValidDimensions = frameWidth > 0 && baseFrameHeight > 0;
  const isTooLarge = frameWidth > 60 || baseFrameHeight > 60;

  useEffect(() => {
    setFramePhotos({});
    if (!selectedFrame?.sku) return;
    fetch(`/api/frames/${selectedFrame.sku}/photos`)
      .then((r) => (r.ok ? r.json() : null))
      .then((photoSet) => {
        if (photoSet)
          setFramePhotos({
            topUrl: photoSet.topUrl,
            bottomUrl: photoSet.bottomUrl,
            leftUrl: photoSet.leftUrl,
            rightUrl: photoSet.rightUrl,
            cornerUrl: photoSet.cornerUrl,
            profileUrl: photoSet.profileUrl,
          });
      })
      .catch(() => {});
  }, [selectedFrame?.sku]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("frame", selectedFrame.id);
    if (!isCustomSize) params.set("preset", String(selectedPresetIndex));
    else {
      params.set("customWidth", customWidth);
      params.set("customHeight", customHeight);
    }
    params.set("layout", layoutType);
    params.set("mat", matType);
    if (matType !== "none") {
      params.set("matColor", selectedMat.id);
      params.set("matBorder", matBorderWidth);
      if (bottomWeighted) params.set("bottomWeighted", "true");
    }
    if (matType === "double") {
      params.set("matInnerColor", selectedMatInner.id);
      params.set("matReveal", matRevealWidth);
    }
    params.set("hardware", hangingHardware);
    if (brassNameplateConfig.enabled) {
      params.set("nameplateEnabled", "true");
      if (brassNameplateConfig.line1) params.set("nameplateLine1", brassNameplateConfig.line1);
      if (brassNameplateConfig.line2) params.set("nameplateLine2", brassNameplateConfig.line2);
      if (brassNameplateConfig.line3) params.set("nameplateLine3", brassNameplateConfig.line3);
      params.set("nameplateFont", brassNameplateConfig.font);
      params.set("nameplateColor", brassNameplateConfig.color);
    }
    if (quantity > 1) params.set("quantity", String(quantity));
    const url = `${typeof window !== "undefined" ? window.location.pathname : ""}?${params.toString()}`;
    if (typeof window !== "undefined") window.history.replaceState({}, "", url);
  }, [
    selectedFrame,
    selectedPresetIndex,
    isCustomSize,
    customWidth,
    customHeight,
    layoutType,
    matType,
    selectedMat,
    selectedMatInner,
    matBorderWidth,
    matRevealWidth,
    bottomWeighted,
    hangingHardware,
    brassNameplateConfig,
    quantity,
    searchParams,
  ]);

  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries)
        setContainerSize({ width: e.contentRect.width, height: e.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (layoutType === "double-newspaper" && matType === "none") setMatType("single");
  }, [layoutType, matType]);

  useEffect(() => {
    const img = getRandomNewspaperLifestyleImage();
    if (img) setLifestylePreview({ url: getSharedAssetUrl(img.path), alt: img.alt });
  }, [selectedFrame.id]);

  const handleCheckout = () => {
    if (!isValidDimensions || isTooLarge) {
      toast({ title: "Invalid dimensions", variant: "destructive" });
      return;
    }
    toast({ title: "Added to Cart", description: `${quantity}× Newspaper Frame added.` });
  };

  const renderPreview = () => {
    const hasStrip =
      framePhotos.topUrl && framePhotos.bottomUrl && framePhotos.leftUrl && framePhotos.rightUrl;
    return (
      <div
        className="preview-stage"
        style={{
          width: `${layout.outerPx.w}px`,
          height: `${previewMetrics.totalPreviewHeight}px`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "relative",
            width: layout.outerPx.w,
            height: layout.outerPx.h,
            overflow: "hidden",
          }}
        >
          {hasStrip && (
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
                  clipPath: `polygon(0 0,100% 0,calc(100% - ${layout.frameFacePx}px) 100%,${layout.frameFacePx}px 100%)`,
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
                  clipPath: `polygon(${layout.frameFacePx}px 0,calc(100% - ${layout.frameFacePx}px) 0,100% 100%,0 100%)`,
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
                  clipPath: `polygon(0 0,100% ${layout.frameFacePx}px,100% calc(100% - ${layout.frameFacePx}px),0 100%)`,
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
                  clipPath: `polygon(0 ${layout.frameFacePx}px,100% 0,100% 100%,0 calc(100% - ${layout.frameFacePx}px))`,
                }}
              />
            </>
          )}
          <div
            style={{
              position: "absolute",
              top: layout.frameFacePx,
              left: layout.frameFacePx,
              width: layout.glassPx.w,
              height: layout.glassPx.h,
              overflow: "hidden",
            }}
          >
            <svg width="0" height="0" style={{ position: "absolute" }}>
              <defs>
                <clipPath id={clipPathId} clipPathUnits="userSpaceOnUse" clipRule="evenodd">
                  {matBoardPath && <path d={matBoardPath} />}
                </clipPath>
                <clipPath
                  id={`${clipPathId}-bottom`}
                  clipPathUnits="userSpaceOnUse"
                  clipRule="evenodd"
                >
                  {bottomMatPath && <path d={bottomMatPath} />}
                </clipPath>
              </defs>
            </svg>
            {matType === "double" && (
              <div
                className="absolute inset-0"
                style={{
                  ...getMatTilingStyle(
                    selectedMatInner.name,
                    layout.scale,
                    selectedMatInner.hexColor
                  ),
                  clipPath: `url(#${clipPathId}-bottom)`,
                  zIndex: 2,
                }}
              />
            )}
            {matType !== "none" && (
              <div
                className="absolute inset-0"
                style={{
                  ...getMatTilingStyle(selectedMat.name, layout.scale, selectedMat.hexColor),
                  clipPath: `url(#${clipPathId})`,
                  zIndex: 5,
                }}
              />
            )}
            {pixelOpenings.map((opening, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: opening.posX,
                  top: opening.posY,
                  width: opening.width,
                  height: opening.height,
                  overflow: "hidden",
                  zIndex: 1,
                }}
              >
                <img
                  src={displayImageUrls[index] ?? displayImageUrls[0]}
                  alt={`Newspaper ${index + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  data-testid={`img-newspaper-preview-${index}`}
                />
              </div>
            ))}
            {brassNameplateConfig.enabled && matType !== "none" && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: previewMetrics.plaqueXInMat,
                  top: previewMetrics.plaqueYInMat,
                  width: previewMetrics.plaqueWidthPx,
                  height: previewMetrics.plaqueHeightPx,
                  zIndex: 7,
                }}
              >
                <BrassNameplatePreview config={brassNameplateConfig} scale={layout.scale / 150} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-6 pb-24 md:pb-12">
        <div className={mobileView === "controls" ? "hidden lg:block" : ""}>
          <Card ref={previewCardRef} className="p-4 md:p-6 lg:sticky lg:top-20 lg:self-start">
            <div
              ref={previewContainerRef}
              className="h-[400px] md:h-[500px] bg-muted rounded-md flex items-center justify-center relative"
            >
              <div className="absolute top-4 left-4 z-50">
                <button
                  type="button"
                  onClick={() => setFullImageOpen(true)}
                  className="bg-background/90 hover:bg-background p-2 rounded-md shadow"
                  title="Fullscreen preview"
                  data-testid="button-newspaper-expand"
                >
                  <Maximize className="h-5 w-5" />
                </button>
              </div>
              {renderPreview()}
            </div>
            <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm">
              <p className="font-medium" data-testid="text-newspaper-finished-size">
                Finished size:{" "}
                <span className="text-primary">
                  {frameWidth.toFixed(1)}&quot; × {frameHeight.toFixed(1)}&quot;
                </span>
              </p>
              <p className="text-muted-foreground text-xs">
                {currentLayout.newspaperCount} newspaper
                {currentLayout.newspaperCount > 1 ? "s" : ""} • {newspaperWidth}&quot; ×{" "}
                {newspaperHeight}&quot;
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {framePhotos.cornerUrl ? (
                <div className="aspect-square rounded-md border overflow-hidden">
                  <img
                    src={framePhotos.cornerUrl}
                    alt="Corner"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-md border-2 border-dashed flex items-center justify-center bg-muted/30">
                  <span className="text-xs text-muted-foreground">Corner</span>
                </div>
              )}
              {framePhotos.profileUrl ? (
                <div className="aspect-square rounded-md border overflow-hidden">
                  <img
                    src={framePhotos.profileUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-md border-2 border-dashed flex items-center justify-center bg-muted/30">
                  <span className="text-xs text-muted-foreground">Profile</span>
                </div>
              )}
              <div className="aspect-square rounded-md border overflow-hidden">
                <img
                  src={lifestylePreview.url}
                  alt={lifestylePreview.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            {!isMobile && <TrustBadges />}
          </Card>
        </div>

        <div className={mobileView === "preview" ? "hidden lg:block" : ""}>
          <h2 ref={controlsHeadingRef} className="text-lg font-semibold mb-4">
            Customize Your Newspaper Frame
          </h2>

          <Accordion
            type="multiple"
            defaultValue={["size", "layout", "frame", "mat", "nameplate", "glass", "hardware"]}
            className="w-full"
          >
            <AccordionItem value="size">
              <AccordionTrigger data-testid="accordion-newspaper-size">Size</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {NEWSPAPER_PRESETS.map((preset, i) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setIsCustomSize(false);
                        setSelectedPresetIndex(i);
                      }}
                      className={`px-3 py-2.5 rounded-md border-2 text-left ${
                        !isCustomSize && selectedPresetIndex === i
                          ? "border-primary bg-primary/5 font-semibold"
                          : "border-border"
                      }`}
                      data-testid={`button-newspaper-preset-${i}`}
                    >
                      <span className="text-sm font-medium">{preset.name}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCustomSize(true)}
                    className={`col-span-2 px-3 py-2.5 rounded-md border-2 text-center ${
                      isCustomSize
                        ? "border-primary bg-primary/5 font-semibold"
                        : "border-dashed border-muted-foreground/40"
                    }`}
                    data-testid="button-newspaper-custom"
                  >
                    Custom size
                  </button>
                </div>
                {isCustomSize && (
                  <div className="flex gap-3 p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <Label className="text-xs mb-1 block">Width (in.)</Label>
                      <Input
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                        data-testid="input-newspaper-width"
                      />
                    </div>
                    <div className="flex items-end pb-0.5">×</div>
                    <div className="flex-1">
                      <Label className="text-xs mb-1 block">Height (in.)</Label>
                      <Input
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        data-testid="input-newspaper-height"
                      />
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="layout">
              <AccordionTrigger data-testid="accordion-newspaper-layout">Layout</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLayoutType("single-newspaper")}
                    className={`px-3 py-2.5 rounded-md border-2 text-left ${
                      layoutType === "single-newspaper"
                        ? "border-primary bg-primary/5 font-semibold"
                        : "border-border"
                    }`}
                    data-testid="button-newspaper-layout-single"
                  >
                    <span className="text-sm font-medium">Single Newspaper</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayoutType("double-newspaper")}
                    className={`px-3 py-2.5 rounded-md border-2 text-left ${
                      layoutType === "double-newspaper"
                        ? "border-primary bg-primary/5 font-semibold"
                        : "border-border"
                    }`}
                    data-testid="button-newspaper-layout-double"
                  >
                    <span className="text-sm font-medium">Double Newspaper</span>
                  </button>
                </div>
                {layoutType === "double-newspaper" && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Two papers side-by-side. Mat required.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="frame">
              <AccordionTrigger data-testid="accordion-newspaper-frame">
                Frame Style
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                  {frameStyles.map((frame) => (
                    <button
                      key={frame.id}
                      type="button"
                      onClick={() => setSelectedFrame(frame)}
                      className={`p-3 rounded-md border-2 text-left ${
                        selectedFrame.id === frame.id ? "border-primary" : "border-transparent"
                      }`}
                      data-testid={`button-newspaper-frame-${frame.id}`}
                    >
                      {frame.thumbnail ? (
                        <div className="h-12 w-full rounded mb-2 overflow-hidden">
                          <img
                            src={frame.thumbnail}
                            alt={frame.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div
                          className="h-12 w-full rounded mb-2"
                          style={{
                            background: `linear-gradient(135deg,${frame.color},${frame.borderColor})`,
                          }}
                        />
                      )}
                      <p className="font-medium text-sm">{frame.name}</p>
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="mat">
              <AccordionTrigger data-testid="accordion-newspaper-mat">Mat Board</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={matType === "none" ? "default" : "outline"}
                    onClick={() => setMatType("none")}
                    disabled={layoutType === "double-newspaper"}
                    data-testid="button-newspaper-mat-none"
                  >
                    No Mat
                  </Button>
                  <Button
                    type="button"
                    variant={matType === "single" ? "default" : "outline"}
                    onClick={() => setMatType("single")}
                    data-testid="button-newspaper-mat-single"
                  >
                    Single
                  </Button>
                  <Button
                    type="button"
                    variant={matType === "double" ? "default" : "outline"}
                    onClick={() => setMatType("double")}
                    data-testid="button-newspaper-mat-double"
                  >
                    Double
                  </Button>
                </div>
                {matType !== "none" && (
                  <>
                    <div className="flex items-center justify-between">
                      <Label>Mat border</Label>
                      <span className="text-sm font-medium">{matBorder.toFixed(2)}&quot;</span>
                    </div>
                    <Slider
                      min={1.5}
                      max={8}
                      step={0.25}
                      value={[matBorder]}
                      onValueChange={(v) => setMatBorderWidth(String(v[0] ?? 2.5))}
                      data-testid="slider-newspaper-mat-border"
                    />
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="np-bottom-weighted"
                        checked={bottomWeighted}
                        onCheckedChange={(c) => setBottomWeighted(c === true)}
                        data-testid="checkbox-newspaper-bottom-weighted"
                      />
                      <Label htmlFor="np-bottom-weighted" className="text-sm cursor-pointer">
                        Bottom-weighted matting
                      </Label>
                      <Tooltip delayDuration={200}>
                        <TooltipTrigger asChild>
                          <button type="button" className="text-muted-foreground">
                            <Info className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">Adds 0.5&quot; to the bottom border.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className={matType === "double" ? "pt-4 bg-muted/40 rounded-lg p-3" : ""}>
                      {matType === "double" ? (
                        <Label className="text-base font-semibold">
                          Top mat: {selectedMat.name}
                        </Label>
                      ) : (
                        <Label>Mat: {selectedMat.name}</Label>
                      )}
                      <ColorSwatchesWithSeparator
                        standardColors={standardMats}
                        premiumColors={premiumMats}
                        selectedId={selectedMat.id}
                        onSelect={setSelectedMat}
                        testIdPrefix="newspaper-mat"
                      />
                    </div>
                    {matType === "double" && (
                      <>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between">
                          <Label>Mat reveal</Label>
                          <span className="text-sm font-medium">{matReveal.toFixed(2)}&quot;</span>
                        </div>
                        <Slider
                          min={0.25}
                          max={1}
                          step={0.25}
                          value={[matReveal]}
                          onValueChange={(v) => setMatRevealWidth(String(v[0] ?? 0.25))}
                          data-testid="slider-newspaper-mat-reveal"
                        />
                        <div className="pt-4 bg-muted/40 rounded-lg p-3">
                          <Label className="text-base font-semibold">
                            Accent mat: {selectedMatInner.name}
                          </Label>
                          <ColorSwatchesWithSeparator
                            standardColors={standardMats}
                            premiumColors={premiumMats}
                            selectedId={selectedMatInner.id}
                            onSelect={setSelectedMatInner}
                            testIdPrefix="newspaper-mat-inner"
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </AccordionContent>
            </AccordionItem>

            {matType !== "none" && (
              <AccordionItem value="nameplate">
                <AccordionTrigger data-testid="accordion-newspaper-nameplate">
                  Brass Nameplate
                </AccordionTrigger>
                <AccordionContent>
                  <BrassNameplateSection
                    config={brassNameplateConfig}
                    onChange={setBrassNameplateConfig}
                    data-testid="section-newspaper-nameplate"
                    embedded
                  />
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="glass">
              <AccordionTrigger data-testid="accordion-newspaper-glass">Glazing</AccordionTrigger>
              <AccordionContent>
                <RadioGroup
                  value={selectedGlass.id}
                  onValueChange={(id) =>
                    setSelectedGlass(glassTypes.find((g) => g.id === id) ?? glassTypes[0]!)
                  }
                >
                  {glassTypes.map((g) => (
                    <div key={g.id} className="flex items-center space-x-2 py-2">
                      <RadioGroupItem
                        value={g.id}
                        id={`np-glass-${g.id}`}
                        data-testid={`radio-newspaper-glass-${g.id}`}
                      />
                      <Label htmlFor={`np-glass-${g.id}`}>{g.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="hardware">
              <AccordionTrigger data-testid="accordion-newspaper-hardware">
                Hanging Hardware
              </AccordionTrigger>
              <AccordionContent>
                <HangingHardwareSection
                  hardwareType={hangingHardware}
                  setHardwareType={setHangingHardware}
                  frameWidth={frameWidth}
                  frameHeight={frameHeight}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <PriceBox
            totalPrice={totalPerUnit}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={handleCheckout}
            isProcessing={false}
            disabled={!isValidDimensions || isTooLarge}
            priceItems={priceItems}
            testIdPrefix="newspaper-"
          />

          <Card className="p-4 mt-4">
            <h3 className="font-semibold">{selectedFrame.name} Newspaper Frame</h3>
            {selectedFrame.shortDescription && (
              <p className="text-xs italic text-muted-foreground mt-1">
                {selectedFrame.shortDescription}
              </p>
            )}
          </Card>
        </div>
      </div>

      <Dialog open={fullImageOpen} onOpenChange={setFullImageOpen}>
        <DialogContent
          className="p-0 max-w-[95vw] max-h-[95vh]"
          aria-describedby="newspaper-fullscreen-desc"
        >
          <DialogTitle className="sr-only">Newspaper frame fullscreen preview</DialogTitle>
          <div
            id="newspaper-fullscreen-desc"
            className="p-4 flex items-center justify-center bg-muted min-h-[200px]"
          >
            <p className="text-muted-foreground">Full preview</p>
          </div>
        </DialogContent>
      </Dialog>

      {!embedded && isMobile && showMobileBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-50 p-3 flex gap-2">
          <Button
            variant={mobileView === "preview" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setMobileView("preview")}
            data-testid="button-newspaper-mobile-preview"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant={mobileView === "controls" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setMobileView("controls")}
            data-testid="button-newspaper-mobile-customize"
          >
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </Button>
        </div>
      )}
    </>
  );
}
