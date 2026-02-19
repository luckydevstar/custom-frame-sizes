"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Maximize, Eye, Settings, Info, ChevronLeft, ChevronRight } from "lucide-react";
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
  parseFraction,
  computePreviewLayout,
  getSharedAssetUrl,
  getMatTilingStyle,
  getMatBevelColor,
  getRandomNeedleworkInsertPath,
  getNeedleworkLifestyleImages,
  getRandomNeedleworkLifestyleImage,
  getStoreBaseAssetUrl,
} from "@framecraft/core";
import { useToast } from "../../hooks/use-toast";
import { ALL_MATS, getMatsInDisplayOrder, getMatById, type Mat } from "@framecraft/config";
import { useIsMobile, useMobileViewToggle } from "@framecraft/core";
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";
import type { BrassNameplateConfig } from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS, getTypeBBottomBorder } from "@framecraft/types";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { TrustBadges } from "../marketing/TrustBadges";
import { NeedleworkLifestyleCarousel } from "./NeedleworkLifestyleCarousel";

const NEEDLEWORK_SIZE_PRESETS = [
  { w: 8, h: 8, label: '8×8"' },
  { w: 8, h: 10, label: '8×10"' },
  { w: 11, h: 14, label: '11×14"' },
  { w: 12, h: 12, label: '12×12"' },
  { w: 14, h: 14, label: '14×14"' },
  { w: 14, h: 18, label: '14×18"' },
  { w: 16, h: 20, label: '16×20"' },
  { w: 18, h: 24, label: '18×24"' },
];

const frameStyles = getFramesByCategory("picture");
const allGlassTypes = getGlassTypes();
const glassTypes = allGlassTypes.filter((g) => g.id === "standard" || g.id === "non-glare");

function buildLifestyleUrls(): Array<{ url: string; alt: string }> {
  const images = getNeedleworkLifestyleImages();
  return images.map(({ path, alt }) => ({ url: getSharedAssetUrl(path), alt }));
}

const LIFESTYLE_IMAGES = buildLifestyleUrls();

function getRandomLifestyleFromPool(): { url: string; alt: string } {
  const img = getRandomNeedleworkLifestyleImage();
  if (img) return { url: getSharedAssetUrl(img.path), alt: img.alt };
  return LIFESTYLE_IMAGES[0] ?? { url: "", alt: "Needlework frame" };
}

export interface NeedleworkFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
  hideMobileSticky?: boolean;
}

export function NeedleworkFrameDesigner({
  defaultFrameId,
  embedded = false,
  hideMobileSticky: _hideMobileSticky = false,
}: NeedleworkFrameDesignerProps = {}) {
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

  const [artworkWidth, setArtworkWidth] = useState(() => searchParams.get("width") ?? "12");
  const [artworkHeight, setArtworkHeight] = useState(() => searchParams.get("height") ?? "12");

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
  const [placeholderSeed] = useState(() => Math.floor(Math.random() * 10000));
  const [lifestylePreview, setLifestylePreview] = useState<{ url: string; alt: string }>(() =>
    getRandomLifestyleFromPool()
  );

  const [brassNameplateConfig, setBrassNameplateConfig] = useState<BrassNameplateConfig>(() => ({
    enabled: searchParams.get("nameplateEnabled") === "true",
    line1: searchParams.get("nameplateLine1") ?? "",
    line2: searchParams.get("nameplateLine2") ?? "",
    line3: searchParams.get("nameplateLine3") ?? "",
    font: (searchParams.get("nameplateFont") as BrassNameplateConfig["font"]) ?? "georgia",
    color: (searchParams.get("nameplateColor") as BrassNameplateConfig["color"]) ?? "brass-black",
    includeFlag: false,
  }));

  const [containerSize, setContainerSize] = useState({ width: 600, height: 500 });
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lifestyleScrollRef = useRef<HTMLDivElement>(null);
  const [showLifestylePrev, setShowLifestylePrev] = useState(false);
  const [showLifestyleNext, setShowLifestyleNext] = useState(false);

  const [framePhotos, setFramePhotos] = useState<{
    cornerUrl?: string;
    profileUrl?: string;
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  }>({});

  const displayImageUrl = useMemo(
    () => getSharedAssetUrl(getRandomNeedleworkInsertPath(placeholderSeed)),
    [placeholderSeed]
  );

  const parsedWidth = parseFraction(artworkWidth);
  const parsedHeight = parseFraction(artworkHeight);
  const artWidth = parsedWidth || 12;
  const artHeight = parsedHeight || 12;
  const matBorder = parseFraction(matBorderWidth) || 2.5;
  const matReveal = parseFraction(matRevealWidth) || 0.25;

  const isValidDimensions = artWidth >= 4 && artHeight >= 4;
  const isTooLarge = artWidth + matBorder * 2 > 60 || artHeight + matBorder * 2 > 90;

  const standardMats = useMemo(
    () => getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", true, false),
    [isMobile]
  );
  const premiumMats = useMemo(
    () => getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", false, true),
    [isMobile]
  );

  useEffect(() => {
    setFramePhotos({});
    if (!selectedFrame?.sku) return;
    async function fetchFramePhotos() {
      try {
        const response = await fetch(`/api/frames/${selectedFrame.sku}/photos`);
        if (response.ok) {
          const photoSet = await response.json();
          setFramePhotos({
            topUrl: photoSet.topUrl,
            bottomUrl: photoSet.bottomUrl,
            leftUrl: photoSet.leftUrl,
            rightUrl: photoSet.rightUrl,
            cornerUrl: photoSet.cornerUrl,
            profileUrl: photoSet.profileUrl,
          });
        }
      } catch (err) {
        console.error("Error fetching frame photos:", err);
      }
    }
    fetchFramePhotos();
  }, [selectedFrame?.sku]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("width", artworkWidth);
    params.set("height", artworkHeight);
    params.set("frame", selectedFrame.id);
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
    if (quantity > 1) params.set("quantity", quantity.toString());
    const newUrl = `${typeof window !== "undefined" ? window.location.pathname : ""}?${params.toString()}`;
    if (typeof window !== "undefined") window.history.replaceState({}, "", newUrl);
  }, [
    artworkWidth,
    artworkHeight,
    selectedFrame,
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
    const container = previewContainerRef.current;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (matType === "none" && bottomWeighted) setBottomWeighted(false);
  }, [matType, bottomWeighted]);

  useEffect(() => {
    setLifestylePreview(getRandomLifestyleFromPool());
  }, [selectedFrame.id]);

  const handleLifestyleScroll = useCallback(() => {
    const container = lifestyleScrollRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const EPSILON = 5;
    if (scrollWidth <= clientWidth + EPSILON) {
      setShowLifestylePrev(false);
      setShowLifestyleNext(false);
      return;
    }
    setShowLifestylePrev(scrollLeft > 10);
    setShowLifestyleNext(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  const scrollLifestylePrev = useCallback(() => {
    lifestyleScrollRef.current?.scrollBy({ left: -420, behavior: "smooth" });
  }, []);
  const scrollLifestyleNext = useCallback(() => {
    lifestyleScrollRef.current?.scrollBy({ left: 420, behavior: "smooth" });
  }, []);

  useEffect(() => {
    handleLifestyleScroll();
    window.addEventListener("resize", handleLifestyleScroll);
    return () => window.removeEventListener("resize", handleLifestyleScroll);
  }, [handleLifestyleScroll]);

  const effectiveMatBorder = matType === "none" ? 0 : matBorder;
  const matOverlap = matType !== "none" ? 0.5 : 0;
  const matRevealAddition = matType === "double" ? matReveal * 2 : 0;
  const bottomWeightedExtra = bottomWeighted ? 0.5 : 0;
  const effectiveBottomBorder =
    matType !== "none" ? getTypeBBottomBorder(brassNameplateConfig.enabled, matBorder) : 0;
  const nameplateBottomExtra = effectiveBottomBorder - effectiveMatBorder;

  const frameWidth = isValidDimensions
    ? artWidth +
      effectiveMatBorder * 2 +
      (selectedFrame.mouldingWidth ?? 1) * 2 -
      matOverlap +
      matRevealAddition
    : 0;
  const frameHeight = isValidDimensions
    ? artHeight +
      effectiveMatBorder * 2 +
      bottomWeightedExtra +
      nameplateBottomExtra +
      (selectedFrame.mouldingWidth ?? 1) * 2 -
      matOverlap +
      matRevealAddition
    : 0;

  const layout = useMemo(() => {
    const effMatBorder = matType === "none" ? 0 : matBorder;
    const effMatReveal = matType === "double" ? matReveal : 0;
    const bottomExtra = bottomWeighted ? 0.5 : 0;
    const effBottomBorder =
      matType !== "none" ? getTypeBBottomBorder(brassNameplateConfig.enabled, matBorder) : 0;
    const nameplateExtra = effBottomBorder - effMatBorder;
    return computePreviewLayout({
      artW: artWidth,
      artH: artHeight,
      matBorderTop: effMatBorder,
      matBorderRight: effMatBorder,
      matBorderBottom: effMatBorder + bottomExtra + nameplateExtra,
      matBorderLeft: effMatBorder,
      matReveal: effMatReveal,
      frameFace: selectedFrame.mouldingWidth ?? 1,
      containerWpx: containerSize.width,
      containerHpx: containerSize.height,
      paddingPx: 12,
    });
  }, [
    artWidth,
    artHeight,
    matBorder,
    matReveal,
    bottomWeighted,
    matType,
    selectedFrame.mouldingWidth,
    containerSize,
    brassNameplateConfig.enabled,
  ]);

  const plaquePositioning = useMemo(() => {
    if (!brassNameplateConfig.enabled || matType === "none") return null;
    const plaqueWidthPx = BRASS_NAMEPLATE_SPECS.NAMEPLATE_WIDTH * layout.scale;
    const plaqueHeightPx = BRASS_NAMEPLATE_SPECS.NAMEPLATE_HEIGHT * layout.scale;
    const clearanceFromOpeningPx = 1.0 * layout.scale;
    const nameplateRenderScale = layout.scale / 150;
    const openingBottomY =
      layout.frameFacePx + layout.matTopPx + layout.openingPx.h + 2 * layout.matRevealPx;
    const plaqueY = openingBottomY + clearanceFromOpeningPx;
    const plaqueX = (layout.outerPx.w - plaqueWidthPx) / 2;
    return {
      x: plaqueX,
      y: plaqueY,
      width: plaqueWidthPx,
      height: plaqueHeightPx,
      renderScale: nameplateRenderScale,
    };
  }, [brassNameplateConfig.enabled, matType, layout]);

  const pricing = useMemo(() => {
    if (!isValidDimensions)
      return {
        framePrice: 0,
        matPrice: 0,
        glassPrice: 0,
        oversizeFee: 0,
        total: 0,
        isTooLarge: false,
      };
    return calculatePricing({
      serviceType: "frame-only",
      artworkWidth: artWidth,
      artworkHeight: artHeight,
      frameStyleId: selectedFrame.id,
      matType,
      matBorderWidth: matBorder,
      matRevealWidth: matReveal,
      matColorId: selectedMat.id,
      matInnerColorId: matType === "double" ? selectedMatInner.id : undefined,
      glassTypeId: selectedGlass.id,
      bottomWeighted,
    });
  }, [
    selectedFrame.id,
    selectedGlass.id,
    selectedMat.id,
    selectedMatInner.id,
    artWidth,
    artHeight,
    matType,
    matBorder,
    matReveal,
    bottomWeighted,
    isValidDimensions,
  ]);

  const { framePrice, matPrice, glassPrice, oversizeFee = 0, total: totalPrice } = pricing;
  const hardwarePrice = hangingHardware === "security" ? 8.95 : 0;
  const nameplatePrice =
    brassNameplateConfig.enabled && matType !== "none" ? BRASS_NAMEPLATE_SPECS.PRICE : 0;
  const totalPerUnit = totalPrice + hardwarePrice + nameplatePrice;

  const priceItems: PriceLineItem[] = [];
  priceItems.push({
    label: `${selectedFrame.name} Frame`,
    amount: framePrice,
    testId: "text-needlework-frame-price",
  });
  if (matType !== "none" && matPrice > 0) {
    priceItems.push({
      label: matType === "double" ? "Double Mat" : "Single Mat",
      amount: matPrice,
      testId: "text-needlework-mat-price",
    });
  }
  if (glassPrice > 0) {
    priceItems.push({
      label: selectedGlass.name,
      amount: glassPrice,
      testId: "text-needlework-glazing-price",
    });
  }
  if (oversizeFee > 0) {
    priceItems.push({
      label: "Oversize Fee",
      amount: oversizeFee,
      testId: "text-needlework-oversize-fee",
    });
  }
  if (hardwarePrice > 0) {
    priceItems.push({
      label: "Security Hardware Kit",
      amount: hardwarePrice,
      testId: "text-needlework-hardware-price",
    });
  }
  if (brassNameplateConfig.enabled && matType !== "none" && nameplatePrice > 0) {
    priceItems.push({
      label: "Engraved Brass Nameplate",
      amount: nameplatePrice,
      testId: "text-needlework-nameplate-price",
    });
  }

  const warnings: React.ReactNode[] = [];
  if (oversizeFee > 0) {
    warnings.push(
      <div
        key="oversize"
        className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 text-sm text-yellow-800 dark:text-yellow-200"
        data-testid="warning-needlework-oversize"
      >
        This needlework frame is oversized and will include an oversize fee
      </div>
    );
  }
  if (isTooLarge) {
    warnings.push(
      <div
        key="toolarge"
        className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-800 dark:text-red-200"
        data-testid="warning-needlework-too-large"
      >
        This frame is too large for online ordering – please contact us
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!isValidDimensions || isTooLarge) {
      toast({
        title: "Invalid Configuration",
        description: "Please check your frame dimensions.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Added to Cart",
      description: `${quantity}× Needlework Frame added to your cart.`,
    });
  };

  const getMatTextureClass = (_mat: Mat) => "mat-texture-standard";

  return (
    <>
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-6 pb-24 md:pb-12">
        <div className={mobileView === "controls" ? "hidden lg:block" : ""}>
          <Card ref={previewCardRef} className="p-4 md:p-6 lg:sticky lg:top-20 lg:self-start">
            <div
              ref={previewContainerRef}
              className="preview-wrap h-[400px] md:h-[500px] bg-muted rounded-md flex items-center justify-center relative group"
            >
              <div className="absolute top-4 left-4 z-50 flex gap-2">
                <button
                  onClick={() => setFullImageOpen(true)}
                  className="bg-background/90 hover:bg-background p-2 rounded-md shadow-lg hover-elevate active-elevate-2"
                  data-testid="button-needlework-expand-preview"
                  title="Fullscreen preview"
                >
                  <Maximize className="h-5 w-5" />
                </button>
              </div>

              {framePhotos.topUrl &&
              framePhotos.bottomUrl &&
              framePhotos.leftUrl &&
              framePhotos.rightUrl ? (
                <div
                  className="preview-stage"
                  style={{
                    width: `${layout.outerPx.w}px`,
                    height: `${layout.outerPx.h}px`,
                    position: "relative",
                  }}
                >
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
                  <div
                    className={matType !== "none" ? getMatTextureClass(selectedMat) : ""}
                    style={{
                      position: "absolute",
                      top: `${layout.frameFacePx}px`,
                      left: `${layout.frameFacePx}px`,
                      right: `${layout.frameFacePx}px`,
                      bottom: `${layout.frameFacePx}px`,
                      boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ...(matType !== "none"
                        ? getMatTilingStyle(selectedMat.name, layout.scale, selectedMat.hexColor)
                        : {}),
                      padding:
                        matType !== "none"
                          ? `${layout.matTopPx}px ${layout.matRightPx}px ${layout.matBottomPx}px ${layout.matLeftPx}px`
                          : "0",
                      transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                    }}
                    data-testid="needlework-preview-frame"
                  >
                    {matType === "double" ? (
                      <div
                        className={getMatTextureClass(selectedMatInner)}
                        style={{
                          width: `${layout.openingPx.w + matReveal * 2 * layout.scale}px`,
                          height: `${layout.openingPx.h + matReveal * 2 * layout.scale}px`,
                          padding: `${matReveal * layout.scale}px`,
                          ...getMatTilingStyle(
                            selectedMatInner.name,
                            layout.scale,
                            selectedMatInner.hexColor
                          ),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `${Math.max(1.1, layout.scale * 0.08)}px solid ${getMatBevelColor(selectedMat.name)}`,
                          transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                            left: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                            right: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                            bottom: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                            backgroundColor: "#e8e4df",
                            border: `${Math.max(1.1, layout.scale * 0.08)}px solid ${getMatBevelColor(selectedMatInner.name)}`,
                            boxShadow: `inset 0 0 0 ${Math.max(1, layout.scale * 0.1)}px ${getMatBevelColor(selectedMatInner.name)}`,
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={displayImageUrl}
                            alt="Needlework preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "fill",
                              display: "block",
                            }}
                            data-testid="img-needlework-preview"
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                          backgroundColor: matType !== "none" ? undefined : "#e8e4df",
                          border:
                            matType !== "none"
                              ? `${Math.max(1.1, layout.scale * 0.08)}px solid ${getMatBevelColor(selectedMat.name)}`
                              : "none",
                          boxShadow:
                            matType !== "none"
                              ? `inset 0 0 0 ${Math.max(1, layout.scale * 0.1)}px ${getMatBevelColor(selectedMat.name)}`
                              : "none",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={displayImageUrl}
                          alt="Needlework preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "fill",
                            display: "block",
                          }}
                          data-testid="img-needlework-preview"
                        />
                      </div>
                    )}
                  </div>

                  {plaquePositioning && brassNameplateConfig.enabled && (
                    <div
                      style={{
                        position: "absolute",
                        left: `${layout.frameFacePx + plaquePositioning.x - layout.frameFacePx}px`,
                        top: `${plaquePositioning.y}px`,
                        width: `${plaquePositioning.width}px`,
                        height: `${plaquePositioning.height}px`,
                        pointerEvents: "none",
                      }}
                    >
                      <BrassNameplatePreview
                        config={brassNameplateConfig}
                        scale={plaquePositioning.renderScale}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="preview-stage"
                  style={{
                    width: `${layout.outerPx.w}px`,
                    height: `${layout.outerPx.h}px`,
                    position: "relative",
                    backgroundColor: selectedFrame.color ?? "#333",
                    border: `${layout.frameFacePx}px solid ${selectedFrame.borderColor ?? "#222"}`,
                    borderRadius: "2px",
                  }}
                >
                  <div
                    className={matType !== "none" ? getMatTextureClass(selectedMat) : ""}
                    style={{
                      position: "absolute",
                      inset: 0,
                      boxShadow: "inset 0 0 20px rgba(0,0,0,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ...(matType !== "none"
                        ? getMatTilingStyle(selectedMat.name, layout.scale, selectedMat.hexColor)
                        : {}),
                      padding:
                        matType !== "none"
                          ? `${layout.matTopPx}px ${layout.matRightPx}px ${layout.matBottomPx}px ${layout.matLeftPx}px`
                          : "0",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#e8e4df",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={displayImageUrl}
                        alt="Needlework preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "fill",
                          display: "block",
                        }}
                        data-testid="img-needlework-preview-fallback"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm space-y-0.5">
              <p className="font-medium" data-testid="text-needlework-finished-size">
                Finished Size:{" "}
                <span className="text-primary">
                  {frameWidth.toFixed(1)}&quot; × {frameHeight.toFixed(1)}&quot;
                </span>
              </p>
              <p className="text-muted-foreground text-xs">
                Artwork: {artWidth}&quot; × {artHeight}&quot; • Frame Width:{" "}
                {selectedFrame.mouldingWidth ?? 1}&quot;
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              {framePhotos.cornerUrl ? (
                <div className="aspect-square rounded-md border overflow-hidden bg-background">
                  <img
                    src={framePhotos.cornerUrl}
                    alt="Frame corner detail"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                  <p className="text-xs text-muted-foreground">Corner</p>
                </div>
              )}
              {framePhotos.profileUrl ? (
                <div className="aspect-square rounded-md border overflow-hidden bg-background">
                  <img
                    src={framePhotos.profileUrl}
                    alt="Frame profile view"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                  <p className="text-xs text-muted-foreground">Profile</p>
                </div>
              )}
              <div className="aspect-square rounded-md border overflow-hidden bg-background">
                <img
                  src={lifestylePreview.url}
                  alt={lifestylePreview.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  data-testid="img-needlework-lifestyle-preview"
                />
              </div>
            </div>

            {!isMobile && <TrustBadges />}
          </Card>
        </div>

        <div className={mobileView === "preview" ? "hidden lg:block" : ""}>
          <h2 ref={controlsHeadingRef} className="text-lg font-semibold mb-4">
            Customize Your Needlework Frame
          </h2>

          <Accordion
            type="multiple"
            defaultValue={["size", "frame", "mat", "nameplate", "glass", "hardware"]}
            className="w-full"
          >
            <AccordionItem value="size">
              <AccordionTrigger data-testid="accordion-needlework-size">Size</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Choose a preset or enter custom dimensions (inches)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {NEEDLEWORK_SIZE_PRESETS.map((preset) => (
                    <button
                      key={`${preset.w}x${preset.h}`}
                      onClick={() => {
                        setArtworkWidth(String(preset.w));
                        setArtworkHeight(String(preset.h));
                      }}
                      className={`px-3 py-2.5 rounded-md border-2 text-left transition-all hover-elevate active-elevate-2 ${
                        artworkWidth === String(preset.w) && artworkHeight === String(preset.h)
                          ? "border-primary bg-primary/5 font-semibold"
                          : "border-border bg-background"
                      }`}
                      data-testid={`button-needlework-size-${preset.w}x${preset.h}`}
                    >
                      <div className="text-sm font-medium">{preset.label}</div>
                    </button>
                  ))}
                </div>
                <div className="pt-4 p-4 bg-muted/30 rounded-lg border border-border">
                  <p className="text-sm font-medium mb-3">Custom dimensions</p>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label
                        htmlFor="needleworkWidth"
                        className="text-xs text-muted-foreground mb-1 block"
                      >
                        Width (inches)
                      </Label>
                      <Input
                        id="needleworkWidth"
                        value={artworkWidth}
                        onChange={(e) => setArtworkWidth(e.target.value)}
                        placeholder="e.g., 12"
                        data-testid="input-needlework-width"
                      />
                    </div>
                    <div className="flex items-end pb-0.5 text-muted-foreground">×</div>
                    <div className="flex-1">
                      <Label
                        htmlFor="needleworkHeight"
                        className="text-xs text-muted-foreground mb-1 block"
                      >
                        Height (inches)
                      </Label>
                      <Input
                        id="needleworkHeight"
                        value={artworkHeight}
                        onChange={(e) => setArtworkHeight(e.target.value)}
                        placeholder="e.g., 12"
                        data-testid="input-needlework-height"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Min 4&quot;. Decimals or fractions accepted.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="frame">
              <AccordionTrigger data-testid="accordion-needlework-frame">
                Frame Style
              </AccordionTrigger>
              <AccordionContent>
                <div className="md:max-h-[400px] md:overflow-y-auto md:pr-2">
                  <div className="grid grid-cols-2 gap-2">
                    {frameStyles.map((frame) => (
                      <button
                        key={frame.id}
                        onClick={() => setSelectedFrame(frame)}
                        className={`p-3 rounded-md border-2 text-left hover-elevate active-elevate-2 ${
                          selectedFrame.id === frame.id ? "border-primary" : "border-transparent"
                        }`}
                        data-testid={`button-needlework-frame-${frame.id}`}
                      >
                        {frame.thumbnail ? (
                          <div className="h-12 w-full rounded mb-2 overflow-hidden">
                            <img
                              src={getStoreBaseAssetUrl(
                                frame.thumbnail.startsWith("/")
                                  ? frame.thumbnail.slice(1)
                                  : frame.thumbnail
                              )}
                              alt={frame.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div
                            className="h-12 w-full rounded mb-2"
                            style={{
                              background: `linear-gradient(135deg, ${frame.color} 0%, ${frame.borderColor} 100%)`,
                            }}
                          />
                        )}
                        <p className="font-medium text-sm mb-1">{frame.name}</p>
                        <div className="text-xs text-muted-foreground">
                          Width: {frame.mouldingWidth}&quot;
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="mat">
              <AccordionTrigger data-testid="accordion-needlework-mat">Mat Board</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={matType === "none" ? "default" : "outline"}
                    onClick={() => setMatType("none")}
                    data-testid="button-needlework-mat-none"
                  >
                    <span className="font-semibold">No Mat</span>
                  </Button>
                  <Button
                    type="button"
                    variant={matType === "single" ? "default" : "outline"}
                    onClick={() => setMatType("single")}
                    data-testid="button-needlework-mat-single"
                  >
                    <span className="font-semibold">Single Mat</span>
                  </Button>
                  <Button
                    type="button"
                    variant={matType === "double" ? "default" : "outline"}
                    onClick={() => setMatType("double")}
                    data-testid="button-needlework-mat-double"
                  >
                    <span className="font-semibold">Double Mat</span>
                  </Button>
                </div>

                {matType !== "none" && (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="needleworkMatBorder">Mat Border Width</Label>
                        <span
                          className="text-sm font-medium"
                          data-testid="text-needlework-mat-border-value"
                        >
                          {matBorder.toFixed(2)}&quot;
                        </span>
                      </div>
                      <Slider
                        id="needleworkMatBorder"
                        min={1.5}
                        max={8}
                        step={0.25}
                        value={[matBorder]}
                        onValueChange={(values) =>
                          setMatBorderWidth(values[0]?.toString() ?? "2.5")
                        }
                        data-testid="slider-needlework-mat-border"
                      />
                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                          id="needleworkBottomWeighted"
                          checked={bottomWeighted}
                          onCheckedChange={(checked) => setBottomWeighted(checked === true)}
                          data-testid="checkbox-needlework-bottom-weighted"
                        />
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor="needleworkBottomWeighted"
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            Bottom-Weighted Matting
                          </Label>
                          <Tooltip delayDuration={200}>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="text-muted-foreground hover:text-foreground"
                                data-testid="button-needlework-bottom-weighted-info"
                              >
                                <Info className="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-sm">
                                Adds 0.5&quot; to the bottom border for visual balance.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>

                    <div
                      className={
                        matType === "double"
                          ? "pt-4 pb-3 px-3 md:px-0 bg-muted/40 md:bg-transparent rounded-lg"
                          : ""
                      }
                    >
                      {matType === "double" ? (
                        <Label className="text-base font-semibold">
                          Top Mat: {selectedMat.name}
                        </Label>
                      ) : (
                        <Label>Mat: {selectedMat.name}</Label>
                      )}
                      <ColorSwatchesWithSeparator
                        standardColors={standardMats}
                        premiumColors={premiumMats}
                        selectedId={selectedMat.id}
                        onSelect={(mat) => setSelectedMat(mat)}
                        testIdPrefix="needlework-mat"
                      />
                    </div>

                    {matType === "double" && (
                      <>
                        <Separator className="my-6" />
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="needleworkMatReveal">Mat Reveal Width</Label>
                            <span
                              className="text-sm font-medium"
                              data-testid="text-needlework-mat-reveal-value"
                            >
                              {matReveal.toFixed(2)}&quot;
                            </span>
                          </div>
                          <Slider
                            id="needleworkMatReveal"
                            min={0.25}
                            max={1}
                            step={0.25}
                            value={[matReveal]}
                            onValueChange={(values) =>
                              setMatRevealWidth(values[0]?.toString() ?? "0.25")
                            }
                            data-testid="slider-needlework-mat-reveal"
                          />
                        </div>
                        <div className="space-y-3 pt-4 pb-3 px-3 md:px-0 bg-muted/40 md:bg-transparent rounded-lg">
                          <Label className="text-base font-semibold">
                            Accent Mat: {selectedMatInner.name}
                          </Label>
                          <ColorSwatchesWithSeparator
                            standardColors={standardMats}
                            premiumColors={premiumMats}
                            selectedId={selectedMatInner.id}
                            onSelect={(mat) => setSelectedMatInner(mat)}
                            testIdPrefix="needlework-mat-inner"
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
                <AccordionTrigger data-testid="accordion-needlework-nameplate">
                  Engraved Brass Nameplate
                </AccordionTrigger>
                <AccordionContent>
                  <BrassNameplateSection
                    config={brassNameplateConfig}
                    onChange={setBrassNameplateConfig}
                    data-testid="section-needlework-brass-nameplate"
                    embedded={true}
                  />
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="glass">
              <AccordionTrigger data-testid="accordion-needlework-glass">Glazing</AccordionTrigger>
              <AccordionContent>
                <RadioGroup
                  value={selectedGlass.id}
                  onValueChange={(id) =>
                    setSelectedGlass(glassTypes.find((g) => g.id === id) ?? glassTypes[0]!)
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {glassTypes.map((glass) => (
                      <div key={glass.id} className="flex items-center space-x-2 py-2">
                        <RadioGroupItem
                          value={glass.id}
                          id={`needlework-glass-${glass.id}`}
                          data-testid={`radio-needlework-glass-${glass.id}`}
                        />
                        <Label htmlFor={`needlework-glass-${glass.id}`}>{glass.name}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground mt-3">
                  Framer&apos;s grade acrylic to protect your needlework.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="hardware">
              <AccordionTrigger data-testid="accordion-needlework-hardware">
                Hanging Hardware
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
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
            warnings={warnings}
            testIdPrefix="needlework-"
          />

          <Card className="p-4 mt-4">
            <h3 className="font-semibold">{selectedFrame.name} Needlework Frame</h3>
            {selectedFrame.shortDescription && (
              <p className="text-xs italic text-muted-foreground mt-1">
                {selectedFrame.shortDescription}
              </p>
            )}
          </Card>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t">
        <div className="relative group">
          {showLifestylePrev && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-background/90 hover:bg-background shadow-lg opacity-80 hover:opacity-100 transition-opacity"
              onClick={scrollLifestylePrev}
              aria-label="Previous needlework lifestyle photos"
              data-testid="button-needlework-lifestyle-prev"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          <div
            ref={lifestyleScrollRef}
            className="overflow-x-auto scroll-smooth scrollbar-hide"
            onScroll={handleLifestyleScroll}
            data-testid="needlework-lifestyle-carousel-container"
          >
            <div className="flex gap-4 pb-4 px-1">
              {LIFESTYLE_IMAGES.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setLifestylePreview(img)}
                  className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
                    lifestylePreview.url === img.url
                      ? "ring-2 ring-primary ring-offset-2 scale-105"
                      : "hover:scale-102 hover:shadow-lg"
                  }`}
                  style={{ width: "200px", height: "150px" }}
                  data-testid={`button-needlework-lifestyle-${index}`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
          {showLifestyleNext && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-background/90 hover:bg-background shadow-lg opacity-80 hover:opacity-100 transition-opacity"
              onClick={scrollLifestyleNext}
              aria-label="Next needlework lifestyle photos"
              data-testid="button-needlework-lifestyle-next"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>

      <NeedleworkLifestyleCarousel />

      <Dialog open={fullImageOpen} onOpenChange={setFullImageOpen}>
        <DialogContent
          className="p-0 !max-w-none !w-[100vw] !h-[100vh] md:!w-[95vw] md:!h-[95vh]"
          aria-describedby="needlework-preview-description"
        >
          <DialogTitle className="sr-only">Full Needlework Frame Preview</DialogTitle>
          <div
            className="relative w-full h-full flex items-center justify-center bg-muted p-2 md:p-8"
            id="needlework-preview-description"
          >
            <p className="text-muted-foreground">Full preview of your needlework frame</p>
          </div>
        </DialogContent>
      </Dialog>

      {!embedded && isMobile && showMobileBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-50 p-3 flex gap-2">
          <Button
            variant={mobileView === "preview" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setMobileView("preview")}
            data-testid="button-needlework-mobile-preview"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant={mobileView === "controls" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setMobileView("controls")}
            data-testid="button-needlework-mobile-customize"
          >
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </Button>
        </div>
      )}
    </>
  );
}
