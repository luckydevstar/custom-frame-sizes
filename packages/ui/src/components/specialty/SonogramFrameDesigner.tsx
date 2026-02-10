"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Copy, Eye, Settings, PenTool } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { TooltipProvider } from "../ui/tooltip";
import { Alert, AlertDescription } from "../ui/alert";
import { QuantitySelector } from "../ui/quantity-selector";
import { PriceBox } from "../ui/PriceBox";
import type { PriceLineItem } from "../ui/PriceBox";
import type { FrameStyle, FrameConfiguration } from "@framecraft/types";
import {
  getFramesByCategory,
  getGlassTypes,
  getFrameStyleById,
  calculatePricing,
  addToCart,
  computePreviewLayout,
  useIntelligentPreviewSizing,
  useIsMobile,
  useMobileViewToggle,
  getMatTilingStyle,
  getMatBevelColor,
  getAllSonogramInsertImages,
  getRandomSonogramLifestyleImage,
  getSonogramLayoutsForSize,
  getHeartPath,
  SONOGRAM_PRESETS,
  PEN_TOOL_PRESETS,
  PEN_TOOL_FONTS,
  isLightMat,
  type SonogramLayoutType,
  type PenToolConfig,
} from "@framecraft/core";
import { ALL_MATS, getMatById, getMatsInDisplayOrder, type Mat } from "@framecraft/config";
import { useToast } from "../../hooks/use-toast";
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { BottomWeightedMatting, BOTTOM_WEIGHTED_EXTRA } from "./shared/BottomWeightedMatting";
import type { SonogramLifestyleImage } from "@framecraft/core";

const pictureFrames = getFramesByCategory("picture");
const glassTypes = getGlassTypes().filter((g) => g.id === "standard" || g.id === "non-glare");
const sonogramInsertImages = getAllSonogramInsertImages();

const MOBILE_EXCLUDED_LIGHT_MATS = ["mat-5", "mat-7"];

interface SonogramFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
  hideMobileSticky?: boolean;
}

export function SonogramFrameDesigner({
  defaultFrameId,
  embedded = false,
  hideMobileSticky = false,
}: SonogramFrameDesignerProps = {}) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  const urlParams = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const initialFrame = useMemo((): FrameStyle => {
    if (defaultFrameId) {
      const f = getFrameStyleById(defaultFrameId) ?? pictureFrames[0];
      return f ?? pictureFrames[0]!;
    }
    const frameParam = urlParams.get("frame");
    const defaultSonogramFrame = getFrameStyleById("natural-picture-frame") ?? pictureFrames[0];
    if (frameParam) {
      const f = getFrameStyleById(frameParam) ?? pictureFrames.find((x) => x.sku === frameParam);
      return f ?? defaultSonogramFrame ?? pictureFrames[0]!;
    }
    return defaultSonogramFrame ?? pictureFrames[0]!;
  }, [defaultFrameId, urlParams]);

  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(initialFrame);
  const [selectedMat, setSelectedMat] = useState<Mat>(() => getMatById("mat-1") ?? ALL_MATS[0]!);
  const [selectedMatInner, setSelectedMatInner] = useState<Mat>(
    () => getMatById("mat-4") ?? ALL_MATS[1]!
  );
  const [selectedGlass, setSelectedGlass] = useState(() => glassTypes[0]!);
  const [matType, setMatType] = useState<"none" | "single" | "double">("double");
  const [matBorderWidth, setMatBorderWidth] = useState("2.5");
  const [matRevealWidth, setMatRevealWidth] = useState("0.25");
  const [quantity, setQuantity] = useState(1);
  const [hangingHardware, setHangingHardware] = useState<"standard" | "security">("standard");
  const [bottomWeighted, setBottomWeighted] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<(typeof SONOGRAM_PRESETS)[number]>(
    SONOGRAM_PRESETS[0]!
  );
  const [layoutType, setLayoutType] = useState<SonogramLayoutType>("single-sonogram");
  const [penToolConfig, setPenToolConfig] = useState<PenToolConfig>({
    enabled: false,
    text: "",
    subtext: "",
    font: "dancing-script",
    presetType: "first-photo",
    textSize: 1.0,
  });
  const [savedCustomText, setSavedCustomText] = useState({ text: "", subtext: "" });
  const [framePhotos, setFramePhotos] = useState<Record<string, string>>({});
  const [randomLifestyleImage, setRandomLifestyleImage] = useState<SonogramLifestyleImage>({
    url: "",
    alt: "",
  });
  const hardwareSectionRef = useRef<HTMLDivElement>(null);

  const sonogramWidth = selectedPreset.width;
  const sonogramHeight = selectedPreset.height;
  const matBorder = parseFloat(matBorderWidth);
  const matReveal = parseFloat(matRevealWidth);
  const effectiveMatBorder = matType === "none" ? 0 : matBorder;
  const openingShape = selectedPreset.shape;
  const availableLayouts = useMemo(
    () =>
      getSonogramLayoutsForSize(sonogramWidth, sonogramHeight, effectiveMatBorder, openingShape),
    [sonogramWidth, sonogramHeight, effectiveMatBorder, openingShape]
  );
  const currentLayout = useMemo(
    () => availableLayouts.find((l) => l.id === layoutType) ?? availableLayouts[0]!,
    [availableLayouts, layoutType]
  );

  const bottomWeightedExtra = bottomWeighted ? BOTTOM_WEIGHTED_EXTRA : 0;
  const penToolExtension = penToolConfig.enabled ? 0.5 : 0;
  const frameWidth = currentLayout.frameWidth;
  const baseFrameHeight = currentLayout.frameHeight + bottomWeightedExtra;
  const frameHeight = baseFrameHeight + penToolExtension;
  const artworkWidth = currentLayout.artworkWidth;
  const artworkHeight = currentLayout.artworkHeight;

  const { containerRef, previewContainerHeight, containerWidth } = useIntelligentPreviewSizing({
    frameWidth,
    frameHeight,
    plaqueEnabled: penToolConfig.enabled,
    plaqueExtension: penToolExtension,
    isMobile,
    minHeightMobile: 350,
    maxHeightMobile: 450,
    minHeightDesktop: 400,
    maxHeightDesktop: 550,
  });

  const layout = useMemo(() => {
    const matBorderValue = matType !== "none" ? matBorder : 0;
    const bottomMatBorderExtension = penToolConfig.enabled ? penToolExtension : 0;
    return computePreviewLayout({
      artW: artworkWidth,
      artH: artworkHeight,
      frameFace: selectedFrame.mouldingWidth,
      matBorderTop: matBorderValue,
      matBorderRight: matBorderValue,
      matBorderBottom: matBorderValue + bottomWeightedExtra + bottomMatBorderExtension,
      matBorderLeft: matBorderValue,
      containerWpx: containerWidth,
      containerHpx: previewContainerHeight,
    });
  }, [
    artworkWidth,
    artworkHeight,
    selectedFrame.mouldingWidth,
    matBorder,
    matType,
    bottomWeightedExtra,
    penToolExtension,
    containerWidth,
    previewContainerHeight,
    penToolConfig.enabled,
  ]);

  const pixelOpenings = useMemo(
    () =>
      currentLayout.openings.map((opening) => ({
        type: opening.type,
        posX: opening.x * layout.scale,
        posY: opening.y * layout.scale,
        width: opening.width * layout.scale,
        height: opening.height * layout.scale,
      })),
    [currentLayout.openings, layout.scale]
  );

  const clipPathId = useMemo(() => `sonogram-mat-clip-${Math.random().toString(36).slice(2)}`, []);

  const matBoardPath = useMemo(() => {
    if (matType === "none") return "";
    const glassW = layout.glassPx.w;
    const glassH = layout.glassPx.h;
    let path = `M 0 0 L ${glassW} 0 L ${glassW} ${glassH} L 0 ${glassH} Z`;
    pixelOpenings.forEach((opening) => {
      if (opening.type === "heart") {
        path += ` ${getHeartPath(opening.posX, opening.posY, opening.width, opening.height)}`;
      } else {
        path += ` M ${opening.posX} ${opening.posY} L ${opening.posX + opening.width} ${opening.posY} L ${opening.posX + opening.width} ${opening.posY + opening.height} L ${opening.posX} ${opening.posY + opening.height} Z`;
      }
    });
    return path;
  }, [layout.glassPx, pixelOpenings, matType]);

  const bottomMatPath = useMemo(() => {
    if (matType !== "double") return "";
    const glassW = layout.glassPx.w;
    const glassH = layout.glassPx.h;
    const revealPx = matReveal * layout.scale;
    let path = `M 0 0 L ${glassW} 0 L ${glassW} ${glassH} L 0 ${glassH} Z`;
    pixelOpenings.forEach((opening) => {
      const innerX = opening.posX + revealPx;
      const innerY = opening.posY + revealPx;
      const innerW = opening.width - 2 * revealPx;
      const innerH = opening.height - 2 * revealPx;
      if (opening.type === "heart") {
        path += ` ${getHeartPath(innerX, innerY, innerW, innerH)}`;
      } else {
        path += ` M ${innerX} ${innerY} L ${innerX + innerW} ${innerY} L ${innerX + innerW} ${innerY + innerH} L ${innerX} ${innerY + innerH} Z`;
      }
    });
    return path;
  }, [layout.glassPx, pixelOpenings, matType, matReveal, layout.scale]);

  const penToolMetrics = useMemo(() => {
    if (!penToolConfig.enabled) return null;
    const lastOpening = pixelOpenings[pixelOpenings.length - 1]!;
    const textY = lastOpening.posY + lastOpening.height + 0.75 * layout.scale;
    const totalWidth =
      pixelOpenings.reduce((s, o) => s + o.width, 0) +
      (pixelOpenings.length - 1) * (0.5 * layout.scale);
    const centerX = pixelOpenings[0]!.posX + totalWidth / 2;
    const fontConfig = PEN_TOOL_FONTS.find((f) => f.id === penToolConfig.font);
    const textSizeMultiplier = penToolConfig.textSize ?? 1.0;
    const baseFontSize = Math.max(14, 0.4 * layout.scale);
    const baseSubtextFontSize = Math.max(11, 0.29 * layout.scale);
    return {
      textX: centerX,
      textY,
      fontSize: baseFontSize * textSizeMultiplier,
      subtextFontSize: baseSubtextFontSize * textSizeMultiplier,
      fontFamily: fontConfig?.family ?? "'Dancing Script', cursive",
    };
  }, [penToolConfig, pixelOpenings, layout.scale]);

  const availableMats = useMemo(() => {
    const deviceMats = getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", true, true);
    if (penToolConfig.enabled) {
      return deviceMats.filter((mat) => {
        if (!isLightMat(mat.id)) return false;
        if (isMobile && MOBILE_EXCLUDED_LIGHT_MATS.includes(mat.id)) return false;
        return true;
      });
    }
    return deviceMats;
  }, [penToolConfig.enabled, isMobile]);

  const standardMats = useMemo(() => availableMats.filter((m) => !m.isPremium), [availableMats]);
  const premiumMats = useMemo(() => availableMats.filter((m) => m.isPremium), [availableMats]);
  const allStandardMats = useMemo(() => ALL_MATS.filter((m) => !m.isPremium), []);
  const allPremiumMats = useMemo(() => ALL_MATS.filter((m) => m.isPremium), []);

  const pricing = useMemo(() => {
    const config: FrameConfiguration = {
      serviceType: "frame-only",
      frameStyleId: selectedFrame.id,
      matColorId: selectedMat.id,
      matInnerColorId: matType === "double" ? selectedMatInner.id : undefined,
      glassTypeId: selectedGlass.id,
      artworkWidth,
      artworkHeight,
      matType: matType === "none" ? "none" : matType,
      matBorderWidth: matBorder,
      matRevealWidth: matReveal,
      bottomWeighted,
    };
    try {
      return calculatePricing(config);
    } catch {
      return null;
    }
  }, [
    selectedFrame,
    selectedMat,
    selectedMatInner,
    selectedGlass,
    artworkWidth,
    artworkHeight,
    matType,
    matBorder,
    matReveal,
    bottomWeighted,
  ]);

  const priceItems: PriceLineItem[] = useMemo(() => {
    if (!pricing) return [];
    const items: PriceLineItem[] = [];
    items.push({
      label: selectedFrame.name,
      amount: pricing.framePrice,
      testId: "text-price-frame",
    });
    if (matType !== "none") {
      items.push({
        label: `Mat Board (${matType})`,
        amount: pricing.matPrice,
        testId: "text-price-mat",
      });
    }
    items.push({
      label: selectedGlass.name,
      amount: pricing.glassPrice,
      isIncluded: pricing.glassPrice === 0,
      testId: "text-price-glass",
    });
    if (pricing.oversizeFee > 0) {
      items.push({
        label: "Oversize Fee",
        amount: pricing.oversizeFee,
        testId: "text-price-oversize",
      });
    }
    return items;
  }, [pricing, selectedFrame, selectedGlass, matType]);

  const finalTotalPrice = pricing?.total ?? 0;
  const isValidDimensions = frameWidth >= 4 && frameHeight >= 4;
  const isTooLarge = pricing?.isTooLarge ?? false;

  const warnings = useMemo(() => {
    const msgs: React.ReactNode[] = [];
    if (isTooLarge) {
      msgs.push(
        <Alert key="too-large" variant="destructive" className="text-sm">
          <AlertDescription>
            This frame size exceeds our maximum dimensions. Please reduce the mat border or choose a
            smaller layout.
          </AlertDescription>
        </Alert>
      );
    }
    return msgs;
  }, [isTooLarge]);

  useEffect(() => {
    setRandomLifestyleImage(getRandomSonogramLifestyleImage());
    setFramePhotos({});
    if (!selectedFrame.sku) return;
    fetch(`/api/frames/${selectedFrame.sku}/photos`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => setFramePhotos(data))
      .catch(() => {});
  }, [selectedFrame.sku]);

  useEffect(() => {
    if (
      (layoutType === "double-sonogram" || layoutType === "triple-sonogram") &&
      matType === "none"
    ) {
      setMatType("single");
    }
  }, [layoutType, matType]);

  useEffect(() => {
    if (matType === "none" && bottomWeighted) setBottomWeighted(false);
  }, [matType, bottomWeighted]);

  useEffect(() => {
    if (penToolConfig.enabled && !isLightMat(selectedMat.id)) {
      const lightMat = ALL_MATS.find((m) => isLightMat(m.id));
      if (lightMat) setSelectedMat(lightMat);
    }
  }, [penToolConfig.enabled, selectedMat.id]);

  const handleCheckout = useCallback(async () => {
    if (!isValidDimensions || isTooLarge) return;
    const config: FrameConfiguration = {
      serviceType: "frame-only",
      frameStyleId: selectedFrame.id,
      matColorId: selectedMat.id,
      matInnerColorId: matType === "double" ? selectedMatInner.id : undefined,
      glassTypeId: selectedGlass.id,
      artworkWidth,
      artworkHeight,
      matType: matType === "none" ? "none" : matType,
      matBorderWidth: matBorder,
      matRevealWidth: matReveal,
      bottomWeighted,
    };
    try {
      await addToCart(config, finalTotalPrice * quantity, quantity);
      toast({
        title: "Added to Cart!",
        description: `${quantity} × Custom Sonogram Frame${quantity > 1 ? "s" : ""}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not add to cart",
        variant: "destructive",
      });
    }
  }, [
    isValidDimensions,
    isTooLarge,
    quantity,
    finalTotalPrice,
    selectedFrame,
    selectedMat,
    selectedMatInner,
    matType,
    matBorder,
    matReveal,
    bottomWeighted,
    artworkWidth,
    artworkHeight,
    selectedGlass,
    toast,
  ]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(typeof window !== "undefined" ? window.location.href : "");
    toast({
      title: "Link Copied!",
      description: "Share this custom sonogram frame design with others.",
    });
  }, [toast]);

  const handlePenPresetChange = (presetId: string) => {
    const preset = PEN_TOOL_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    if (presetId === "custom") {
      setPenToolConfig((prev) => ({
        ...prev,
        presetType: "custom",
        text: savedCustomText.text || prev.text,
        subtext: savedCustomText.subtext || prev.subtext,
      }));
    } else {
      if (penToolConfig.presetType === "custom") {
        setSavedCustomText({ text: penToolConfig.text, subtext: penToolConfig.subtext });
      }
      setPenToolConfig((prev) => ({
        ...prev,
        presetType: presetId as PenToolConfig["presetType"],
        text: preset.text,
        subtext: "",
      }));
    }
  };

  const hasFramePhotos = !!(
    framePhotos.topUrl &&
    framePhotos.bottomUrl &&
    framePhotos.leftUrl &&
    framePhotos.rightUrl
  );

  const renderPreview = useCallback(
    () => (
      <div
        className="preview-stage"
        style={{
          width: `${layout.outerPx.w}px`,
          height: `${layout.outerPx.h}px`,
          position: "relative",
        }}
        data-testid="preview-frame"
      >
        <div
          style={{
            width: `${layout.outerPx.w}px`,
            height: `${layout.outerPx.h}px`,
            position: "relative",
            overflow: "hidden",
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
                  height: `${layout.frameFacePx}px`,
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
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: `${layout.frameFacePx}px`,
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
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: `${layout.frameFacePx}px`,
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
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: `${layout.frameFacePx}px`,
                  backgroundImage: `url(${framePhotos.rightUrl})`,
                  backgroundSize: "100% auto",
                  backgroundRepeat: "repeat-y",
                  backgroundPosition: "center top",
                  zIndex: 10,
                  clipPath: `polygon(0 ${layout.frameFacePx}px, 100% 0, 100% 100%, 0 calc(100% - ${layout.frameFacePx}px))`,
                }}
              />
            </>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                borderTop: `${layout.frameFacePx}px solid ${selectedFrame.borderColor}`,
                borderLeft: `${layout.frameFacePx}px solid ${selectedFrame.borderColor}`,
                borderRight: `${layout.frameFacePx}px solid ${selectedFrame.color}`,
                borderBottom: `${layout.frameFacePx}px solid ${selectedFrame.color}`,
                boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.25)",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              top: `${layout.frameFacePx}px`,
              left: `${layout.frameFacePx}px`,
              width: `${layout.glassPx.w}px`,
              height: `${layout.glassPx.h}px`,
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
                  ...getMatTilingStyle(selectedMatInner.name, layout.scale),
                  clipPath: `url(#${clipPathId}-bottom)`,
                  zIndex: 2,
                }}
              />
            )}
            {matType === "double" && (
              <svg
                className="absolute inset-0 pointer-events-none"
                width={layout.glassPx.w}
                height={layout.glassPx.h}
                style={{ zIndex: 4 }}
              >
                {pixelOpenings.map((opening, idx) => {
                  const revealPx = matReveal * layout.scale;
                  const innerX = opening.posX + revealPx;
                  const innerY = opening.posY + revealPx;
                  const innerW = Math.max(0, opening.width - 2 * revealPx);
                  const innerH = Math.max(0, opening.height - 2 * revealPx);
                  if (opening.type === "heart") {
                    return (
                      <path
                        key={`bottom-bevel-${idx}`}
                        d={getHeartPath(innerX, innerY, innerW, innerH)}
                        fill="none"
                        stroke={getMatBevelColor(selectedMatInner.name)}
                        strokeWidth={Math.max(1, 0.06 * layout.scale)}
                      />
                    );
                  }
                  return (
                    <rect
                      key={`bottom-bevel-${idx}`}
                      x={innerX}
                      y={innerY}
                      width={innerW}
                      height={innerH}
                      fill="none"
                      stroke={getMatBevelColor(selectedMatInner.name)}
                      strokeWidth={Math.max(1, 0.06 * layout.scale)}
                    />
                  );
                })}
              </svg>
            )}
            {matType !== "none" && (
              <div
                className="absolute inset-0"
                style={{
                  ...getMatTilingStyle(selectedMat.name, layout.scale),
                  clipPath: `url(#${clipPathId})`,
                  zIndex: 5,
                }}
              />
            )}
            {matType !== "none" && (
              <svg
                className="absolute inset-0 pointer-events-none"
                width={layout.glassPx.w}
                height={layout.glassPx.h}
                style={{ zIndex: 6 }}
              >
                {pixelOpenings.map((opening, idx) => {
                  if (opening.type === "heart") {
                    return (
                      <path
                        key={`top-bevel-${idx}`}
                        d={getHeartPath(opening.posX, opening.posY, opening.width, opening.height)}
                        fill="none"
                        stroke={getMatBevelColor(selectedMat.name)}
                        strokeWidth={Math.max(1, 0.06 * layout.scale)}
                      />
                    );
                  }
                  return (
                    <rect
                      key={`top-bevel-${idx}`}
                      x={opening.posX}
                      y={opening.posY}
                      width={opening.width}
                      height={opening.height}
                      fill="none"
                      stroke={getMatBevelColor(selectedMat.name)}
                      strokeWidth={Math.max(1, 0.06 * layout.scale)}
                    />
                  );
                })}
              </svg>
            )}
            {pixelOpenings.map((opening, index) => {
              const isHeart = opening.type === "heart";
              const heartClipPath = isHeart
                ? `path('${getHeartPath(0, 0, opening.width, opening.height)}')`
                : undefined;
              const img = sonogramInsertImages[index % sonogramInsertImages.length];
              return (
                <div
                  key={`opening-${index}`}
                  style={{
                    position: "absolute",
                    left: `${opening.posX}px`,
                    top: `${opening.posY}px`,
                    width: `${opening.width}px`,
                    height: `${opening.height}px`,
                    overflow: "hidden",
                    zIndex: 1,
                    backgroundColor: "#000",
                    clipPath: heartClipPath,
                  }}
                  data-testid={`sonogram-opening-${index}`}
                >
                  {img ? (
                    <img
                      src={img}
                      alt={`Sonogram ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  ) : (
                    <span
                      className="text-muted-foreground text-xs font-medium"
                      style={{ fontSize: Math.max(10, layout.scale * 0.15) }}
                    >
                      {isHeart ? "♡" : `Sonogram ${index + 1}`}
                    </span>
                  )}
                </div>
              );
            })}
            {penToolConfig.enabled && penToolMetrics && (
              <svg
                className="absolute inset-0 pointer-events-none"
                width={layout.glassPx.w}
                height={layout.glassPx.h}
                style={{ zIndex: 8 }}
              >
                <text
                  x={penToolMetrics.textX}
                  y={penToolMetrics.textY}
                  textAnchor="middle"
                  dominantBaseline="hanging"
                  style={{
                    fontFamily: penToolMetrics.fontFamily,
                    fontSize: `${penToolMetrics.fontSize}px`,
                    fill: "#333",
                  }}
                >
                  {penToolConfig.text ||
                    PEN_TOOL_PRESETS.find((p) => p.id === penToolConfig.presetType)?.text ||
                    "Your Message"}
                </text>
                {penToolConfig.subtext && (
                  <text
                    x={penToolMetrics.textX}
                    y={penToolMetrics.textY + penToolMetrics.fontSize + 4}
                    textAnchor="middle"
                    dominantBaseline="hanging"
                    style={{
                      fontFamily: penToolMetrics.fontFamily,
                      fontSize: `${penToolMetrics.subtextFontSize}px`,
                      fill: "#555",
                    }}
                  >
                    {penToolConfig.subtext}
                  </text>
                )}
              </svg>
            )}
          </div>
        </div>
      </div>
    ),
    [
      layout,
      hasFramePhotos,
      framePhotos,
      selectedFrame,
      selectedMat,
      selectedMatInner,
      matType,
      matReveal,
      pixelOpenings,
      clipPathId,
      matBoardPath,
      bottomMatPath,
      penToolConfig,
      penToolMetrics,
    ]
  );

  return (
    <TooltipProvider>
      <div
        className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-24 lg:pb-0"
        data-testid="sonogram-frame-designer"
      >
        {isMobile && embedded && (
          <div className="lg:hidden border-b bg-card/50 sticky top-0 z-40">
            <div className="px-4 py-3">
              <h1 className="text-lg font-bold">Sonogram Frame Designer</h1>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-6">
            <div
              className={`${isMobile && mobileView === "controls" ? "hidden lg:block" : ""} lg:sticky lg:top-[132px] lg:self-start`}
            >
              <Card ref={previewCardRef} className="p-4 md:p-6">
                <div
                  ref={containerRef}
                  className="preview-wrap bg-muted rounded-md flex items-center justify-center relative"
                  style={{ minHeight: `${previewContainerHeight}px` }}
                  data-testid="preview-container"
                >
                  {renderPreview()}
                </div>
                <p className="text-xs text-muted-foreground/60 text-center mt-2">
                  Placeholder preview. Your sonogram images will be framed here.
                </p>
                <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm space-y-0.5">
                  <p className="font-medium">
                    Finished Size:{" "}
                    <span className="text-primary">
                      {frameWidth.toFixed(2)}&quot; × {frameHeight.toFixed(2)}&quot;
                    </span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Sonogram: {selectedPreset.name} • Layout: {currentLayout.name}
                    {matType !== "none" && <> • Mat Border: {matBorderWidth}&quot;</>}
                  </p>
                </div>
                {framePhotos.cornerUrl && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="aspect-square rounded-md overflow-hidden">
                      <img
                        src={framePhotos.cornerUrl}
                        alt="Corner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {framePhotos.profileUrl && (
                      <div className="aspect-square rounded-md overflow-hidden">
                        <img
                          src={framePhotos.profileUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {randomLifestyleImage?.url && (
                      <div className="aspect-square rounded-md overflow-hidden">
                        <img
                          src={randomLifestyleImage.url}
                          alt={randomLifestyleImage.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>

            <div className={`${isMobile && mobileView === "preview" ? "hidden" : ""} space-y-6`}>
              <h2 ref={controlsHeadingRef} className="text-2xl font-bold mb-2 lg:hidden">
                Customize Your Sonogram Frame
              </h2>
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4 hidden lg:block">
                  Configure Your Sonogram Frame
                </h2>
                <Accordion
                  type="multiple"
                  defaultValue={[
                    "size",
                    "layout",
                    "personalize",
                    "frame",
                    "mat",
                    "glass",
                    "hardware",
                  ]}
                  className="space-y-4"
                >
                  <AccordionItem value="size" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-size"
                    >
                      Sonogram Size
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p className="text-sm text-muted-foreground">
                        Select the size of your ultrasound print
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {SONOGRAM_PRESETS.map((preset, index) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setSelectedPreset(preset)}
                            className={`p-3 rounded-md border-2 text-left hover:border-primary/50 ${selectedPreset === preset ? "border-primary bg-primary/5" : "border-border"}`}
                            data-testid={`button-preset-${index}`}
                          >
                            <p className="font-semibold text-sm">{preset.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {preset.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="layout" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-layout"
                    >
                      Layout
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p className="text-sm text-muted-foreground">
                        Choose how many sonogram images to display
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {availableLayouts.map((layoutOption) => (
                          <button
                            key={layoutOption.id}
                            type="button"
                            onClick={() => setLayoutType(layoutOption.id)}
                            className={`p-3 rounded-md border-2 text-center hover:border-primary/50 ${layoutType === layoutOption.id ? "border-primary bg-primary/5" : "border-border"}`}
                            data-testid={`button-layout-${layoutOption.id}`}
                          >
                            <div className="flex justify-center gap-1 mb-2">
                              {Array.from({ length: layoutOption.sonogramCount }).map((_, i) => (
                                <div
                                  key={i}
                                  className="w-4 h-3 bg-muted-foreground/30 rounded-sm"
                                />
                              ))}
                            </div>
                            <p className="font-semibold text-xs">{layoutOption.sonogramCount}</p>
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="personalize" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-personalize"
                    >
                      <div className="flex items-center gap-2">
                        <PenTool className="h-4 w-4" />
                        <span>Personalize</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="penToolEnabled"
                          checked={penToolConfig.enabled}
                          onCheckedChange={(checked) => {
                            if (checked === true) {
                              const first = PEN_TOOL_PRESETS[0]!;
                              setPenToolConfig((prev) => ({
                                ...prev,
                                enabled: true,
                                text: prev.text || first.text,
                                presetType: prev.presetType || "first-photo",
                              }));
                            } else {
                              setPenToolConfig((prev) => ({ ...prev, enabled: false }));
                            }
                          }}
                          data-testid="checkbox-pen-tool-enabled"
                        />
                        <Label htmlFor="penToolEnabled" className="cursor-pointer">
                          Add handwritten-style text to the mat
                        </Label>
                      </div>
                      {penToolConfig.enabled && (
                        <>
                          <div className="space-y-2">
                            <Label>Choose a Message</Label>
                            <Select
                              value={penToolConfig.presetType}
                              onValueChange={handlePenPresetChange}
                            >
                              <SelectTrigger data-testid="select-pen-preset">
                                <SelectValue placeholder="Choose a message..." />
                              </SelectTrigger>
                              <SelectContent>
                                {PEN_TOOL_PRESETS.map((preset) => (
                                  <SelectItem
                                    key={preset.id}
                                    value={preset.id}
                                    data-testid={`select-item-preset-${preset.id}`}
                                    className={preset.id === "custom" ? "font-bold" : ""}
                                  >
                                    {preset.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {penToolConfig.presetType === "custom" && (
                            <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                              <Input
                                id="penText"
                                value={penToolConfig.text}
                                onChange={(e) =>
                                  setPenToolConfig((prev) => ({ ...prev, text: e.target.value }))
                                }
                                placeholder="Enter your message..."
                                maxLength={50}
                                className="text-center"
                                data-testid="input-pen-text"
                              />
                              <Input
                                id="penSubtext"
                                value={penToolConfig.subtext}
                                onChange={(e) =>
                                  setPenToolConfig((prev) => ({ ...prev, subtext: e.target.value }))
                                }
                                placeholder="Add date or details (optional)"
                                maxLength={40}
                                className="text-center text-sm"
                                data-testid="input-pen-subtext"
                              />
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label>Font Style</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {PEN_TOOL_FONTS.map((font) => (
                                <button
                                  key={font.id}
                                  type="button"
                                  onClick={() =>
                                    setPenToolConfig((prev) => ({
                                      ...prev,
                                      font: font.id as PenToolConfig["font"],
                                    }))
                                  }
                                  className={`p-2 rounded-md border-2 text-center ${penToolConfig.font === font.id ? "border-primary bg-primary/5" : "border-border"}`}
                                  style={{ fontFamily: font.family }}
                                  data-testid={`button-font-${font.id}`}
                                >
                                  <span className="text-sm">{font.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label>Text Size</Label>
                              <span className="text-sm text-muted-foreground">
                                {Math.round((penToolConfig.textSize ?? 1.0) * 100)}%
                              </span>
                            </div>
                            <Slider
                              value={[(penToolConfig.textSize ?? 1.0) * 100]}
                              onValueChange={(values) =>
                                setPenToolConfig((prev) => ({
                                  ...prev,
                                  textSize: values[0]! / 100,
                                }))
                              }
                              min={50}
                              max={150}
                              step={5}
                              className="w-full"
                              data-testid="slider-pen-text-size"
                            />
                          </div>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="frame" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-frame"
                    >
                      Frame Style
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="max-h-[400px] overflow-y-auto pr-2 grid grid-cols-2 gap-2 pt-4">
                        {pictureFrames.map((frame) => (
                          <button
                            key={frame.id}
                            type="button"
                            onClick={() => setSelectedFrame(frame)}
                            className={`p-3 rounded-md border-2 text-left hover:border-primary/50 ${selectedFrame.id === frame.id ? "border-primary" : "border-transparent"}`}
                            data-testid={`button-frame-${frame.id}`}
                          >
                            {frame.thumbnail ? (
                              <div className="h-12 w-full rounded mb-2 overflow-hidden">
                                <img
                                  src={frame.thumbnail}
                                  alt={frame.name}
                                  className="h-full w-full object-cover"
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
                            <p className="font-medium text-sm mb-1.5">{frame.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Width: {frame.mouldingWidth}&quot; · Depth: {frame.usableDepth}&quot;
                            </p>
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="mat" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-mat"
                    >
                      Matting
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {layoutType === "double-sonogram" || layoutType === "triple-sonogram" ? (
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant={matType === "single" ? "default" : "outline"}
                            onClick={() => setMatType("single")}
                            data-testid="button-mat-single"
                          >
                            <span className="font-semibold">Single Mat</span>
                          </Button>
                          <Button
                            type="button"
                            variant={matType === "double" ? "default" : "outline"}
                            onClick={() => setMatType("double")}
                            data-testid="button-mat-double"
                          >
                            <span className="font-semibold">Double Mat</span>
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            type="button"
                            variant={matType === "none" ? "default" : "outline"}
                            onClick={() => setMatType("none")}
                            data-testid="button-mat-none"
                          >
                            <span className="font-semibold">No Mat</span>
                          </Button>
                          <Button
                            type="button"
                            variant={matType === "single" ? "default" : "outline"}
                            onClick={() => setMatType("single")}
                            data-testid="button-mat-single"
                          >
                            <span className="font-semibold">Single Mat</span>
                          </Button>
                          <Button
                            type="button"
                            variant={matType === "double" ? "default" : "outline"}
                            onClick={() => setMatType("double")}
                            data-testid="button-mat-double"
                          >
                            <span className="font-semibold">Double Mat</span>
                          </Button>
                        </div>
                      )}
                      {matType !== "none" && (
                        <>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="matBorder">Mat Border Width</Label>
                            <span
                              className="text-sm font-medium"
                              data-testid="text-mat-border-value"
                            >
                              {matBorder.toFixed(2)}&quot;
                            </span>
                          </div>
                          <Slider
                            id="matBorder"
                            min={1}
                            max={4}
                            step={0.5}
                            value={[matBorder]}
                            onValueChange={(values) => setMatBorderWidth(values[0]!.toString())}
                            data-testid="slider-mat-border"
                          />
                          <BottomWeightedMatting
                            checked={bottomWeighted}
                            onCheckedChange={setBottomWeighted}
                            testIdPrefix="sonogram"
                          />
                          {penToolConfig.enabled && (
                            <Alert className="border-amber-500/30 bg-amber-50 dark:bg-amber-950/20">
                              <PenTool className="h-4 w-4 text-amber-600" />
                              <AlertDescription className="text-sm text-amber-800 dark:text-amber-200">
                                <strong>Pen Tool Active:</strong> Only light-colored mats are
                                available for better text visibility.
                              </AlertDescription>
                            </Alert>
                          )}
                          <div className="space-y-3 pt-4 pb-3">
                            <Label className="text-base font-semibold">
                              {matType === "double" ? "Top Mat" : "Mat"}: {selectedMat.name}
                            </Label>
                            <ColorSwatchesWithSeparator
                              standardColors={standardMats}
                              premiumColors={premiumMats}
                              selectedId={selectedMat.id}
                              onSelect={setSelectedMat}
                              testIdPrefix="mat"
                            />
                          </div>
                          {matType === "double" && (
                            <>
                              <Separator className="my-6" />
                              <div className="flex items-center justify-between">
                                <Label htmlFor="matReveal">Mat Reveal Width</Label>
                                <span
                                  className="text-sm font-medium"
                                  data-testid="text-mat-reveal-value"
                                >
                                  {matReveal.toFixed(2)}&quot;
                                </span>
                              </div>
                              <Slider
                                id="matReveal"
                                min={0.25}
                                max={1}
                                step={0.25}
                                value={[matReveal]}
                                onValueChange={(values) => setMatRevealWidth(values[0]!.toString())}
                                data-testid="slider-mat-reveal"
                              />
                              <div className="space-y-3 pt-4 pb-3">
                                <Label className="text-base font-semibold">
                                  Accent Mat: {selectedMatInner.name}
                                </Label>
                                <ColorSwatchesWithSeparator
                                  standardColors={allStandardMats}
                                  premiumColors={allPremiumMats}
                                  selectedId={selectedMatInner.id}
                                  onSelect={setSelectedMatInner}
                                  testIdPrefix="mat-inner"
                                />
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="glass" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-glass"
                    >
                      Glazing & Backing
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <RadioGroup
                        value={selectedGlass.id}
                        onValueChange={(id) => {
                          const g = glassTypes.find((x) => x.id === id);
                          if (g) setSelectedGlass(g);
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {glassTypes.map((glass) => (
                            <div key={glass.id} className="flex items-center space-x-2 py-2">
                              <RadioGroupItem
                                value={glass.id}
                                id={glass.id}
                                data-testid={`radio-glass-${glass.id}`}
                              />
                              <Label htmlFor={glass.id}>{glass.name}</Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="hardware"
                    className="border rounded-lg px-4 lg:px-6"
                    ref={hardwareSectionRef}
                  >
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-hardware"
                    >
                      Hanging Hardware
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
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
                  totalPrice={finalTotalPrice}
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  onAddToCart={handleCheckout}
                  onCopyLink={handleCopyLink}
                  disabled={!isValidDimensions || isTooLarge}
                  priceItems={priceItems}
                  warnings={warnings}
                  testIdPrefix="sonogram-"
                />
              </Card>
            </div>
          </div>
        </div>

        {isMobile && showMobileBar && !hideMobileSticky && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-3 z-50 safe-bottom">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-lg font-bold" data-testid="mobile-total-price">
                  ${(finalTotalPrice * quantity).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {frameWidth.toFixed(1)}&quot; × {frameHeight.toFixed(1)}&quot;
                </p>
              </div>
              <div className="flex items-center gap-2">
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  className="w-14 h-7 text-xs text-center p-0"
                  testId="input-quantity-sticky"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  data-testid="button-mobile-copy-link"
                  className="h-9 w-9"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={!isValidDimensions || isTooLarge}
                  data-testid="button-mobile-add-to-cart"
                  className="flex-1 min-w-0"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        )}

        {!embedded && (
          <Button
            size="lg"
            className={`fixed bottom-20 right-6 z-[60] lg:hidden shadow-lg rounded-full h-14 px-6 ${showMobileBar ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0 pointer-events-none"}`}
            onClick={() => setMobileView(mobileView === "preview" ? "controls" : "preview")}
            data-testid="button-toggle-mobile-view"
          >
            {mobileView === "preview" ? (
              <>
                <Settings className="w-5 h-5 mr-2" /> Customize
              </>
            ) : (
              <>
                <Eye className="w-5 h-5 mr-2" /> Preview
              </>
            )}
          </Button>
        )}
      </div>
    </TooltipProvider>
  );
}
