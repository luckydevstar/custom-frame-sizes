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

const POSTER_IDS = [
  "eclipse-of-worlds",
  "chosen-breed",
  "first-contact",
  "fantastic-family",
  "monster-island",
  "city-of-vengeance",
  "bands-on-brink",
  "team-wild",
  "woods-of-wonder",
  "lost-kingdom",
  "super-squad",
  "encounter",
  "vegas-or-bust",
  "rise-of-robots",
  "rise-of-robots-kids",
  "dino-quest",
  "gone-fishing",
];
const POSTER_TITLES = [
  "Eclipse of Worlds",
  "Chosen Breed",
  "First Contact",
  "The Fantastic Family Adventure",
  "Maximum Fun on Monster Island",
  "City of Vengeance",
  "Bands on the Brink",
  "Team Wild",
  "Woods of Wonder",
  "The Lost Kingdom",
  "Super Squad",
  "Encounter",
  "Vegas or Bust",
  "Rise of the Robots",
  "Rise of the Robots: Friends to the Rescue",
  "Dino Quest",
  "Gone Fishing",
];

function buildPosterList(): Array<{ id: string; src: string; title: string }> {
  return POSTER_IDS.map((id, i) => ({
    id,
    src: getSharedAssetUrl(
      `movie-poster/insert-images/poster-${String(i + 1).padStart(2, "0")}.png`
    ),
    title: POSTER_TITLES[i] ?? "Movie Poster",
  }));
}

const SAMPLE_MOVIE_POSTERS = buildPosterList();

const LIFESTYLE_IMAGES: string[] = Array.from({ length: 31 }, (_, i) =>
  getSharedAssetUrl(`movie-poster/lifestyle/lifestyle_${i + 1}.jpg`)
);

function getRandomLifestyleImageFromPool(): string {
  return (
    LIFESTYLE_IMAGES[Math.floor(Math.random() * LIFESTYLE_IMAGES.length)] ?? LIFESTYLE_IMAGES[0]!
  );
}

const POSTER_SIZE_SAMPLES: Record<string, number[]> = {
  "us-standard": [0, 1, 2, 5, 6, 7, 12, 13],
  "us-vintage": [3, 4, 8, 9, 10, 11, 14],
  "british-quad": [0, 2, 5, 6, 13],
  "half-sheet": [1, 3, 7, 10, 15],
  "window-card": [9, 10, 11, 14, 15],
  "lobby-card": [3, 4, 8, 9, 16],
  custom: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
};

function getRandomPosterForSize(sizeId: string): (typeof SAMPLE_MOVIE_POSTERS)[number] {
  const indices: number[] =
    POSTER_SIZE_SAMPLES[sizeId as keyof typeof POSTER_SIZE_SAMPLES] ??
    POSTER_SIZE_SAMPLES.custom ??
    [];
  const randomIndex = indices[Math.floor(Math.random() * indices.length)] ?? 0;
  return SAMPLE_MOVIE_POSTERS[randomIndex] ?? SAMPLE_MOVIE_POSTERS[0]!;
}

const frameStyles = getFramesByCategory("picture");
const allGlassTypes = getGlassTypes();
const glassTypes = allGlassTypes.filter((g) => g.id === "standard" || g.id === "non-glare");

export type MoviePosterSizeId =
  | "british-quad"
  | "us-standard"
  | "us-vintage"
  | "half-sheet"
  | "window-card"
  | "lobby-card"
  | "custom";

export interface MoviePosterSize {
  id: MoviePosterSizeId;
  name: string;
  width: number;
  height: number;
  description?: string;
}

export const MOVIE_POSTER_SIZES: MoviePosterSize[] = [
  { id: "us-standard", name: "US Onesheet", width: 27, height: 40, description: "Standard" },
  { id: "us-vintage", name: "US Onesheet", width: 27, height: 41, description: "Vintage" },
  { id: "british-quad", name: "British Quad", width: 27, height: 39, description: "Onesheet" },
  { id: "half-sheet", name: "Half Sheet", width: 22, height: 28 },
  { id: "window-card", name: "Window Card", width: 14, height: 22 },
  { id: "lobby-card", name: "Lobby Card", width: 11, height: 14 },
];

export function getMoviePosterSize(id: MoviePosterSizeId): MoviePosterSize | undefined {
  return MOVIE_POSTER_SIZES.find((s) => s.id === id);
}

export interface MoviePosterFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
  hideMobileSticky?: boolean;
}

export function MoviePosterFrameDesigner({
  defaultFrameId,
  embedded = false,
  hideMobileSticky: _hideMobileSticky = false,
}: MoviePosterFrameDesignerProps = {}) {
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

  const [selectedSizeId, setSelectedSizeId] = useState<MoviePosterSizeId>(() => {
    const urlSize = searchParams.get("size") as MoviePosterSizeId | null;
    const valid: MoviePosterSizeId[] = [
      "british-quad",
      "us-standard",
      "us-vintage",
      "half-sheet",
      "window-card",
      "lobby-card",
      "custom",
    ];
    if (urlSize && valid.includes(urlSize)) return urlSize;
    return "us-standard";
  });

  const [customWidth, setCustomWidth] = useState(() => searchParams.get("customWidth") ?? "27");
  const [customHeight, setCustomHeight] = useState(() => searchParams.get("customHeight") ?? "40");

  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(
    () => initialFrame ?? frameStyles[0]!
  );
  const [selectedMat, setSelectedMat] = useState<Mat>(() => getMatById("mat-1") ?? ALL_MATS[0]!);
  const [selectedMatInner, setSelectedMatInner] = useState<Mat>(
    () => getMatById("mat-4") ?? ALL_MATS[1]!
  );
  const [selectedGlass, setSelectedGlass] = useState<GlassType>(() => glassTypes[0]!);
  const [matType, setMatType] = useState<"none" | "single" | "double">("single");
  const [matBorderWidth, setMatBorderWidth] = useState("1.5");
  const [matRevealWidth, setMatRevealWidth] = useState("0.25");
  const [bottomWeighted, setBottomWeighted] = useState(false);
  const [hangingHardware, setHangingHardware] = useState<"standard" | "security">("standard");
  const [quantity, setQuantity] = useState(1);
  const [fullImageOpen, setFullImageOpen] = useState(false);
  const [displayPoster, setDisplayPoster] = useState(() => getRandomPosterForSize("us-standard"));
  const [lifestylePreviewImage, setLifestylePreviewImage] = useState(() =>
    getRandomLifestyleImageFromPool()
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

  const parsedCustomWidth = parseFraction(customWidth);
  const parsedCustomHeight = parseFraction(customHeight);

  const currentSize = useMemo(() => {
    if (selectedSizeId === "custom") {
      return { width: parsedCustomWidth || 27, height: parsedCustomHeight || 40 };
    }
    const preset = getMoviePosterSize(selectedSizeId);
    return preset ? { width: preset.width, height: preset.height } : { width: 27, height: 40 };
  }, [selectedSizeId, parsedCustomWidth, parsedCustomHeight]);

  const artWidth = currentSize.width;
  const artHeight = currentSize.height;
  const matBorder = parseFraction(matBorderWidth) || 2.5;
  const matReveal = parseFraction(matRevealWidth) || 0.25;

  const isValidDimensions = artWidth >= 4 && artHeight >= 4;
  const isTooLarge = artWidth + matBorder * 2 > 60 || artHeight + matBorder * 2 > 90;

  const customDimensionValidation = useMemo(() => {
    if (selectedSizeId !== "custom") return { valid: true as const };
    if (parsedCustomWidth < 4 || parsedCustomHeight < 4)
      return { valid: false as const, message: 'Minimum size is 4" × 4"' };
    if (parsedCustomWidth > 50 || parsedCustomHeight > 80)
      return { valid: false as const, message: 'Maximum size is 50" × 80"' };
    return { valid: true as const };
  }, [selectedSizeId, parsedCustomWidth, parsedCustomHeight]);

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
    params.set("size", selectedSizeId);
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
    if (selectedSizeId === "custom") {
      params.set("customWidth", customWidth);
      params.set("customHeight", customHeight);
    }
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
    selectedSizeId,
    selectedFrame,
    matType,
    selectedMat,
    selectedMatInner,
    matBorderWidth,
    matRevealWidth,
    bottomWeighted,
    hangingHardware,
    customWidth,
    customHeight,
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
    setDisplayPoster(getRandomPosterForSize(selectedSizeId));
  }, [selectedSizeId]);

  useEffect(() => {
    setLifestylePreviewImage(getRandomLifestyleImageFromPool());
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
  const finalTotalPrice = (totalPrice + hardwarePrice + nameplatePrice) * quantity;

  const priceItems: PriceLineItem[] = [];
  priceItems.push({
    label: `${selectedFrame.name} Frame`,
    amount: framePrice,
    testId: "text-movie-poster-frame-price",
  });
  if (matType !== "none" && matPrice > 0) {
    priceItems.push({
      label: matType === "double" ? "Double Mat" : "Single Mat",
      amount: matPrice,
      testId: "text-movie-poster-mat-price",
    });
  }
  if (glassPrice > 0) {
    priceItems.push({
      label: selectedGlass.name,
      amount: glassPrice,
      testId: "text-movie-poster-glazing-price",
    });
  }
  if (oversizeFee > 0) {
    priceItems.push({
      label: "Oversize Fee",
      amount: oversizeFee,
      testId: "text-movie-poster-oversize-fee",
    });
  }
  if (hardwarePrice > 0) {
    priceItems.push({
      label: "Security Hardware Kit",
      amount: hardwarePrice,
      testId: "text-movie-poster-hardware-price",
    });
  }
  if (brassNameplateConfig.enabled && matType !== "none" && nameplatePrice > 0) {
    priceItems.push({
      label: "Engraved Brass Nameplate",
      amount: nameplatePrice,
      testId: "text-movie-poster-nameplate-price",
    });
  }

  const warnings: React.ReactNode[] = [];
  if (oversizeFee > 0) {
    warnings.push(
      <div
        key="oversize"
        className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 text-sm text-yellow-800 dark:text-yellow-200"
        data-testid="warning-movie-poster-oversize"
      >
        Your onesheet poster frame is oversized and will include an oversize fee
      </div>
    );
  }
  if (isTooLarge) {
    warnings.push(
      <div
        key="toolarge"
        className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-800 dark:text-red-200"
        data-testid="warning-movie-poster-too-large"
      >
        This frame is too large for online ordering – please contact us to discuss your project
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
      description: `${quantity}× Onesheet Poster Frame added to your cart.`,
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
                  data-testid="button-movie-poster-expand-preview"
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
                    data-testid="movie-poster-preview-frame"
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
                            src={displayPoster.src}
                            alt={displayPoster.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "fill",
                              display: "block",
                            }}
                            data-testid="img-movie-poster-preview"
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
                          src={displayPoster.src}
                          alt={displayPoster.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "fill",
                            display: "block",
                          }}
                          data-testid="img-movie-poster-preview"
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
                        src={displayPoster.src}
                        alt={displayPoster.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "fill",
                          display: "block",
                        }}
                        data-testid="img-movie-poster-preview-fallback"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm space-y-0.5">
              <p className="font-medium" data-testid="text-movie-poster-finished-size">
                Finished Size:{" "}
                <span className="text-primary">
                  {frameWidth.toFixed(1)}&quot; × {frameHeight.toFixed(1)}&quot;
                </span>
              </p>
              <p className="text-muted-foreground text-xs">
                Poster Size: {artWidth}&quot; × {artHeight}&quot; • Frame Width:{" "}
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
                  src={lifestylePreviewImage}
                  alt="Framed movie poster in home setting"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  data-testid="img-movie-poster-lifestyle-preview"
                />
              </div>
            </div>

            {!isMobile && <TrustBadges />}
          </Card>
        </div>

        <div className={mobileView === "preview" ? "hidden lg:block" : ""}>
          <h2 ref={controlsHeadingRef} className="text-lg font-semibold mb-4">
            Customize Your Onesheet Poster Frame
          </h2>

          <Accordion
            type="multiple"
            defaultValue={["size", "frame", "mat", "nameplate", "glass", "hardware"]}
            className="w-full"
          >
            <AccordionItem value="size">
              <AccordionTrigger data-testid="accordion-movie-poster-size">
                Poster Size
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Select your onesheet movie poster size
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {MOVIE_POSTER_SIZES.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSizeId(size.id)}
                      className={`px-3 py-2.5 rounded-md border-2 text-left transition-all hover-elevate active-elevate-2 ${
                        selectedSizeId === size.id
                          ? "border-primary bg-primary/5 font-semibold"
                          : "border-border bg-background"
                      }`}
                      data-testid={`button-movie-poster-size-${size.id}`}
                    >
                      <div className="text-sm font-medium">{size.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {size.width}×{size.height}&quot;
                        {size.description ? ` • ${size.description}` : ""}
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedSizeId("custom")}
                    className={`col-span-2 px-3 py-2.5 rounded-md border-2 text-center transition-all hover-elevate active-elevate-2 ${
                      selectedSizeId === "custom"
                        ? "border-primary bg-primary/5 font-semibold"
                        : "border-dashed border-muted-foreground/40 bg-background"
                    }`}
                    data-testid="button-movie-poster-size-custom"
                  >
                    <div className="text-sm font-medium">Custom Size</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Any dimensions</div>
                  </button>
                </div>

                {selectedSizeId === "custom" && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
                    <p className="text-sm font-medium mb-3">Enter Your Poster Dimensions</p>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Label
                          htmlFor="customWidth"
                          className="text-xs text-muted-foreground mb-1 block"
                        >
                          Width (inches)
                        </Label>
                        <Input
                          id="customWidth"
                          value={customWidth}
                          onChange={(e) => setCustomWidth(e.target.value)}
                          placeholder="e.g., 27"
                          className={!customDimensionValidation.valid ? "border-destructive" : ""}
                          data-testid="input-movie-poster-custom-width"
                        />
                      </div>
                      <div className="flex items-end pb-0.5 text-muted-foreground">×</div>
                      <div className="flex-1">
                        <Label
                          htmlFor="customHeight"
                          className="text-xs text-muted-foreground mb-1 block"
                        >
                          Height (inches)
                        </Label>
                        <Input
                          id="customHeight"
                          value={customHeight}
                          onChange={(e) => setCustomHeight(e.target.value)}
                          placeholder="e.g., 40"
                          className={!customDimensionValidation.valid ? "border-destructive" : ""}
                          data-testid="input-movie-poster-custom-height"
                        />
                      </div>
                    </div>
                    {!customDimensionValidation.valid && "message" in customDimensionValidation && (
                      <p className="text-xs text-destructive mt-2">
                        {customDimensionValidation.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Min 4&quot;. Decimals or fractions accepted (e.g., 27.5 or 27 1/2)
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="frame">
              <AccordionTrigger data-testid="accordion-movie-poster-frame">
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
                        data-testid={`button-movie-poster-frame-${frame.id}`}
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
                        <div className="space-y-0.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <span>Width: {frame.mouldingWidth}&quot;</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="mat">
              <AccordionTrigger data-testid="accordion-movie-poster-mat">
                Mat Board
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={matType === "none" ? "default" : "outline"}
                    onClick={() => setMatType("none")}
                    data-testid="button-movie-poster-mat-none"
                  >
                    <span className="font-semibold">No Mat</span>
                  </Button>
                  <Button
                    type="button"
                    variant={matType === "single" ? "default" : "outline"}
                    onClick={() => setMatType("single")}
                    data-testid="button-movie-poster-mat-single"
                  >
                    <span className="font-semibold">Single Mat</span>
                  </Button>
                  <Button
                    type="button"
                    variant={matType === "double" ? "default" : "outline"}
                    onClick={() => setMatType("double")}
                    data-testid="button-movie-poster-mat-double"
                  >
                    <span className="font-semibold">Double Mat</span>
                  </Button>
                </div>

                {matType !== "none" && (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="matBorder">Mat Border Width</Label>
                        <span
                          className="text-sm font-medium"
                          data-testid="text-movie-poster-mat-border-value"
                        >
                          {matBorder.toFixed(2)}&quot;
                        </span>
                      </div>
                      <Slider
                        id="matBorder"
                        min={1.5}
                        max={8}
                        step={0.25}
                        value={[matBorder]}
                        onValueChange={(values) =>
                          setMatBorderWidth(values[0]?.toString() ?? "1.5")
                        }
                        data-testid="slider-movie-poster-mat-border"
                      />
                      <p className="text-xs text-muted-foreground">
                        Border around your onesheet poster
                      </p>

                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                          id="bottomWeighted"
                          checked={bottomWeighted}
                          onCheckedChange={(checked) => setBottomWeighted(checked === true)}
                          data-testid="checkbox-movie-poster-bottom-weighted"
                        />
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor="bottomWeighted"
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            Bottom-Weighted Matting
                          </Label>
                          <Tooltip delayDuration={200}>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                data-testid="button-movie-poster-bottom-weighted-info"
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
                      className={`space-y-3 ${matType === "double" ? "pt-4 pb-3 px-3 md:px-0 bg-muted/40 md:bg-transparent rounded-lg" : ""}`}
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
                        testIdPrefix="movie-poster-mat"
                      />
                    </div>

                    {matType === "double" && (
                      <>
                        <Separator className="my-6" />
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="matReveal">Mat Reveal Width</Label>
                            <span
                              className="text-sm font-medium"
                              data-testid="text-movie-poster-mat-reveal-value"
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
                            onValueChange={(values) =>
                              setMatRevealWidth(values[0]?.toString() ?? "0.25")
                            }
                            data-testid="slider-movie-poster-mat-reveal"
                          />
                          <p className="text-xs text-muted-foreground">
                            Inner mat border visible around poster
                          </p>
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
                            testIdPrefix="movie-poster-mat-inner"
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
                <AccordionTrigger data-testid="accordion-movie-poster-nameplate">
                  Engraved Brass Nameplate
                </AccordionTrigger>
                <AccordionContent>
                  <BrassNameplateSection
                    config={brassNameplateConfig}
                    onChange={setBrassNameplateConfig}
                    data-testid="section-movie-poster-brass-nameplate"
                    embedded={true}
                  />
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="glass">
              <AccordionTrigger data-testid="accordion-movie-poster-glass">
                Glazing
              </AccordionTrigger>
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
                          id={`glass-${glass.id}`}
                          data-testid={`radio-movie-poster-glass-${glass.id}`}
                        />
                        <Label htmlFor={`glass-${glass.id}`}>{glass.name}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground mt-3">
                  Includes archival foam core backing. Framer&apos;s grade acrylic for your onesheet
                  poster.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="hardware">
              <AccordionTrigger data-testid="accordion-movie-poster-hardware">
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
            totalPrice={finalTotalPrice}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={handleCheckout}
            isProcessing={false}
            disabled={!isValidDimensions || isTooLarge || !customDimensionValidation.valid}
            priceItems={priceItems}
            warnings={warnings}
          />

          <Card className="p-4 mt-4">
            <h3 className="font-semibold">{selectedFrame.name} Onesheet Poster Frame</h3>
            {selectedFrame.shortDescription && (
              <p className="text-xs italic text-muted-foreground mt-1">
                {selectedFrame.shortDescription}
              </p>
            )}
          </Card>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
            Movie Poster Frames in Your Home
          </h2>
          <p className="text-muted-foreground">
            See how our custom movie poster frames look in real settings
          </p>
        </div>
        <div className="relative group">
          {showLifestylePrev && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-background/90 hover:bg-background shadow-lg opacity-80 hover:opacity-100 transition-opacity"
              onClick={scrollLifestylePrev}
              aria-label="View previous movie poster display photos"
              data-testid="button-lifestyle-carousel-previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          <div
            ref={lifestyleScrollRef}
            className="overflow-x-auto scroll-smooth scrollbar-hide"
            onScroll={handleLifestyleScroll}
            data-testid="movie-poster-lifestyle-carousel-container"
          >
            <div className="flex gap-4 pb-4 px-1">
              {LIFESTYLE_IMAGES.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setLifestylePreviewImage(img)}
                  className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
                    lifestylePreviewImage === img
                      ? "ring-2 ring-primary ring-offset-2 scale-105"
                      : "hover:scale-102 hover:shadow-lg"
                  }`}
                  style={{ width: "200px", height: "150px" }}
                  data-testid={`button-lifestyle-carousel-${index}`}
                >
                  <img
                    src={img}
                    alt={`Movie poster frame in home setting ${index + 1}`}
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
              aria-label="View next movie poster display photos"
              data-testid="button-lifestyle-carousel-next"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>

      <Dialog open={fullImageOpen} onOpenChange={setFullImageOpen}>
        <DialogContent
          className="p-0 !max-w-none !w-[100vw] !h-[100vh] md:!w-[95vw] md:!h-[95vh]"
          aria-describedby="movie-poster-preview-description"
        >
          <DialogTitle className="sr-only">Full Onesheet Poster Frame Preview</DialogTitle>
          <div
            className="relative w-full h-full flex items-center justify-center bg-muted p-2 md:p-8"
            id="movie-poster-preview-description"
          >
            <p className="text-muted-foreground">Full preview of your onesheet poster frame</p>
          </div>
        </DialogContent>
      </Dialog>

      {!embedded && isMobile && showMobileBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-50 p-3 flex gap-2">
          <Button
            variant={mobileView === "preview" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setMobileView("preview")}
            data-testid="button-movie-poster-mobile-preview"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant={mobileView === "controls" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setMobileView("controls")}
            data-testid="button-movie-poster-mobile-customize"
          >
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </Button>
        </div>
      )}
    </>
  );
}
