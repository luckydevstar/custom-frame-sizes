"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Disc3, Eye, Settings, Maximize, Copy } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { QuantitySelector } from "../ui/quantity-selector";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { RecordAlbumPreview } from "./RecordAlbumPreview";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import { PriceBox } from "../ui/PriceBox";
import type { PriceLineItem } from "../ui/PriceBox";
import { useToast } from "../../hooks/use-toast";
import {
  ALL_MATS,
  getMatsInDisplayOrder,
  isMatAvailableForSize,
  type Mat,
} from "@framecraft/config";
import {
  useIsMobile,
  useMobileViewToggle,
  useIntelligentPreviewSizing,
  getFramesByCategory,
  getGlassTypes,
  getFrameStyleById,
  calculatePricing,
  addToCart,
  isShopifyEnabled,
  getRecordAlbumLayout,
  getRecordAlbumLayoutWithMolding,
  getLayoutPricingDimensions,
  getCDLayout,
  getCDPricingDimensions,
  getCDLifestyleImageUrl,
  getRecordAlbumLifestyleImageUrl,
  getSharedAssetUrl,
  getStoreBaseAssetUrl,
  type RecordAlbumLayoutType,
  type CDLayoutType,
} from "@framecraft/core";
import type {
  FrameStyle,
  GlassType,
  FrameConfiguration,
  BrassNameplateConfig,
} from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS } from "@framecraft/types";
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { BottomWeightedMatting, BOTTOM_WEIGHTED_EXTRA } from "./shared/BottomWeightedMatting";

const frameStyles = getFramesByCategory("shadowbox");
const glassTypes = getGlassTypes().filter((g) => g.id === "standard" || g.id === "non-glare");
const SECURITY_HARDWARE_UPCHARGE = 8;

type PresetConfig = {
  id: string;
  name: string;
  description: string;
  frameId: string;
  matType: "single" | "double" | "none";
  matId: string;
  bottomMatId?: string;
  glassId: string;
  hardware: "standard" | "security";
} & (
  | { layoutType: "vinyl"; layout: RecordAlbumLayoutType }
  | { layoutType: "cd"; layout: CDLayoutType }
);

const VINYL_LAYOUT_PRESETS: Record<
  RecordAlbumLayoutType,
  Omit<PresetConfig, "id" | "name" | "description" | "layout" | "layoutType">
> = {
  "cover-only": {
    frameId: "standard-depth-matte-black",
    matType: "single",
    matId: "white-core-white",
    glassId: "standard",
    hardware: "standard",
  },
  "single-with-cover": {
    frameId: "standard-depth-matte-black",
    matType: "single",
    matId: "white-core-white",
    glassId: "standard",
    hardware: "standard",
  },
  "double-with-covers": {
    frameId: "standard-depth-matte-black",
    matType: "single",
    matId: "white-core-white",
    glassId: "standard",
    hardware: "standard",
  },
};

const CD_LAYOUT_PRESETS: Record<
  CDLayoutType,
  Omit<PresetConfig, "id" | "name" | "description" | "layout" | "layoutType">
> = {
  "cover-only": {
    frameId: "standard-depth-matte-black",
    matType: "single",
    matId: "white-core-white",
    glassId: "standard",
    hardware: "standard",
  },
  "disc-with-cover": {
    frameId: "standard-depth-matte-black",
    matType: "single",
    matId: "white-core-white",
    glassId: "standard",
    hardware: "standard",
  },
  "double-disc": {
    frameId: "standard-depth-matte-black",
    matType: "single",
    matId: "white-core-white",
    glassId: "standard",
    hardware: "standard",
  },
};

function LayoutIcon({ layoutId }: { layoutId: RecordAlbumLayoutType | CDLayoutType }) {
  const size = 28;
  const blueColor = "#3b82f6";
  if (layoutId === "cover-only") {
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className="flex-shrink-0">
        <rect
          x="6"
          y="6"
          width="16"
          height="16"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          rx="1"
        />
        <line
          x1="9"
          y1="10"
          x2="19"
          y2="10"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.5"
        />
        <line
          x1="9"
          y1="13"
          x2="19"
          y2="13"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.5"
        />
        <line
          x1="9"
          y1="16"
          x2="16"
          y2="16"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.5"
        />
      </svg>
    );
  }
  if (layoutId === "single-with-cover") {
    const coverSize = 13;
    const vinylRadius = 6.5;
    const centerY = 14;
    const coverLeft = 4;
    const coverRight = coverLeft + coverSize;
    const vinylCenterX = coverRight + vinylRadius - 4;
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className="flex-shrink-0">
        <defs>
          <clipPath id="vinyl-clip-single">
            <rect x={coverRight} y="0" width="28" height="28" />
          </clipPath>
        </defs>
        <g clipPath="url(#vinyl-clip-single)">
          <circle
            cx={vinylCenterX}
            cy={centerY}
            r={vinylRadius}
            stroke={blueColor}
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx={vinylCenterX} cy={centerY} r="1.5" fill={blueColor} />
        </g>
        <rect
          x={coverLeft}
          y={centerY - coverSize / 2}
          width={coverSize}
          height={coverSize}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="var(--background)"
          rx="1"
        />
        <line
          x1={coverLeft + 2.5}
          y1={centerY - coverSize / 2 + 3.5}
          x2={coverLeft + coverSize - 2.5}
          y2={centerY - coverSize / 2 + 3.5}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.5"
        />
        <line
          x1={coverLeft + 2.5}
          y1={centerY}
          x2={coverLeft + coverSize - 2.5}
          y2={centerY}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.5"
        />
      </svg>
    );
  }
  if (layoutId === "double-with-covers") {
    const coverSize = 11;
    const vinylRadius = 5;
    const centerY = 14;
    const coverLeft = 3;
    const coverRight = coverLeft + coverSize;
    const vinyl1CenterX = coverRight + vinylRadius - 3.5;
    const vinyl2CenterX = vinyl1CenterX + vinylRadius * 1.6;
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className="flex-shrink-0">
        <defs>
          <clipPath id="vinyl-clip-double">
            <rect x={coverRight} y="0" width="28" height="28" />
          </clipPath>
        </defs>
        <g clipPath="url(#vinyl-clip-double)">
          <circle
            cx={vinyl1CenterX}
            cy={centerY}
            r={vinylRadius}
            stroke={blueColor}
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx={vinyl1CenterX} cy={centerY} r="1.2" fill={blueColor} />
        </g>
        <circle
          cx={vinyl2CenterX}
          cy={centerY}
          r={vinylRadius}
          stroke={blueColor}
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx={vinyl2CenterX} cy={centerY} r="1.2" fill={blueColor} />
        <rect
          x={coverLeft}
          y={centerY - coverSize / 2}
          width={coverSize}
          height={coverSize}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="var(--background)"
          rx="1"
        />
        <line
          x1={coverLeft + 2}
          y1={centerY - coverSize / 2 + 3}
          x2={coverLeft + coverSize - 2}
          y2={centerY - coverSize / 2 + 3}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.5"
        />
        <line
          x1={coverLeft + 2}
          y1={centerY}
          x2={coverLeft + coverSize - 2}
          y2={centerY}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.5"
        />
      </svg>
    );
  }
  if (layoutId === "disc-with-cover") {
    const coverSize = 10;
    const discRadius = 5;
    const centerY = 14;
    const coverLeft = 4;
    const coverRight = coverLeft + coverSize;
    const discCenterX = coverRight + discRadius - 2;
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className="flex-shrink-0">
        <defs>
          <clipPath id="cd-clip-single">
            <rect x={coverRight} y="0" width="28" height="28" />
          </clipPath>
        </defs>
        <g clipPath="url(#cd-clip-single)">
          <circle
            cx={discCenterX}
            cy={centerY}
            r={discRadius}
            stroke={blueColor}
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx={discCenterX} cy={centerY} r="1.2" fill={blueColor} />
        </g>
        <rect
          x={coverLeft}
          y={centerY - coverSize / 2}
          width={coverSize}
          height={coverSize}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="var(--background)"
          rx="1"
        />
        <line
          x1={coverLeft + 2}
          y1={centerY - 2}
          x2={coverLeft + coverSize - 2}
          y2={centerY - 2}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.5"
        />
        <line
          x1={coverLeft + 2}
          y1={centerY + 1}
          x2={coverLeft + coverSize - 2}
          y2={centerY + 1}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.5"
        />
      </svg>
    );
  }
  if (layoutId === "double-disc") {
    const discRadius = 5;
    const centerY = 14;
    const leftCx = 10;
    const rightCx = 18;
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className="flex-shrink-0">
        <circle
          cx={rightCx}
          cy={centerY}
          r={discRadius}
          stroke={blueColor}
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx={rightCx} cy={centerY} r="1.2" fill={blueColor} />
        <circle
          cx={leftCx}
          cy={centerY}
          r={discRadius}
          stroke={blueColor}
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx={leftCx} cy={centerY} r="1.2" fill={blueColor} />
      </svg>
    );
  }
  return <Disc3 className="w-4 h-4" />;
}

function MountingScrewSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <circle cx="60" cy="60" r="45" fill="#f5f5dc" stroke="#d3d3d3" strokeWidth="3" />
      <g opacity="0.7">
        <rect x="57" y="30" width="6" height="60" fill="#888" rx="1" />
        <rect x="30" y="57" width="60" height="6" fill="#888" rx="1" />
      </g>
      <circle cx="60" cy="60" r="38" stroke="#aaa" strokeWidth="1.5" opacity="0.3" />
      <circle cx="60" cy="60" r="32" stroke="#aaa" strokeWidth="1.5" opacity="0.3" />
      <circle cx="60" cy="60" r="26" stroke="#aaa" strokeWidth="1.5" opacity="0.3" />
      <ellipse cx="48" cy="48" rx="15" ry="12" fill="white" opacity="0.3" />
    </svg>
  );
}

interface RecordAlbumDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
  layoutType?: "vinyl" | "cd";
}

export function RecordAlbumDesigner({
  defaultFrameId,
  embedded: _embedded = false,
  layoutType = "vinyl",
}: RecordAlbumDesignerProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  const searchParams = useSearchParams();

  const initialFrame = useMemo(() => {
    if (defaultFrameId) {
      return getFrameStyleById(defaultFrameId) ?? frameStyles[0];
    }
    const frameParam = searchParams.get("frame");
    return frameParam ? (getFrameStyleById(frameParam) ?? frameStyles[0]) : frameStyles[0];
  }, [defaultFrameId, searchParams]);

  const [selectedLayout, setSelectedLayout] = useState<RecordAlbumLayoutType | CDLayoutType>(() => {
    const urlLayout = searchParams.get("layout");
    const urlLayoutType = searchParams.get("layoutType") as "vinyl" | "cd" | null;
    const effectiveLayoutType = urlLayoutType ?? layoutType;
    if (urlLayout && effectiveLayoutType === layoutType) {
      if (effectiveLayoutType === "vinyl") {
        const isValid = getRecordAlbumLayout(urlLayout as RecordAlbumLayoutType);
        if (isValid) return urlLayout as RecordAlbumLayoutType;
      } else {
        const isValid = getCDLayout(urlLayout as CDLayoutType);
        if (isValid) return urlLayout as CDLayoutType;
      }
    }
    return layoutType === "vinyl" ? "single-with-cover" : "disc-with-cover";
  });

  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(
    () => initialFrame ?? frameStyles[0]!
  );
  const [selectedMat, setSelectedMat] = useState<Mat>(() => {
    const urlMatId = searchParams.get("mat");
    if (urlMatId) {
      const found = ALL_MATS.find((m) => m.id === urlMatId);
      if (found) return found;
    }
    return ALL_MATS[0]!;
  });
  const [selectedBottomMat, setSelectedBottomMat] = useState<Mat>(() => {
    const urlMatId = searchParams.get("bottomMat");
    if (urlMatId) {
      const found = ALL_MATS.find((m) => m.id === urlMatId);
      if (found) return found;
    }
    return ALL_MATS[0]!;
  });
  const [matType, setMatType] = useState<"single" | "double" | "none">(
    (searchParams.get("matType") as "single" | "double" | "none") || "single"
  );
  const [selectedGlass, setSelectedGlass] = useState<GlassType>(
    glassTypes.find((g) => g.id === searchParams.get("glass")) ?? glassTypes[0]!
  );
  const [hardware, setHardware] = useState<"standard" | "security">(
    (searchParams.get("hardware") as "standard" | "security") || "standard"
  );
  const [bottomWeighted, setBottomWeighted] = useState(
    searchParams.get("bottomWeighted") === "true"
  );
  const [brassNameplateConfig, setBrassNameplateConfig] = useState<BrassNameplateConfig>(() => {
    const enabled = searchParams.get("plaqueEnabled") === "true";
    const line1 = searchParams.get("plaqueLine1") ?? "";
    const line2 = searchParams.get("plaqueLine2") ?? "";
    const line3 = searchParams.get("plaqueLine3") ?? "";
    const font = (searchParams.get("plaqueFont") ?? "georgia") as BrassNameplateConfig["font"];
    const color = (searchParams.get("plaqueColor") ??
      "brass-black") as BrassNameplateConfig["color"];
    const includeFlag = searchParams.get("plaqueIncludeFlag") === "true";
    return { enabled, line1, line2, line3, font, color, includeFlag };
  });

  const [showShareDialog, setShowShareDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [fullImageOpen, setFullImageOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<
    "preview" | "corner" | "profile" | "screw" | "lifestyle"
  >("preview");
  const [fullscreenDesignerOpen, setFullscreenDesignerOpen] = useState(false);
  const [framePhotos, setFramePhotos] = useState<{
    cornerUrl?: string;
    profileUrl?: string;
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  }>({});

  const lifestyleImage = useMemo(() => {
    const totalImages = layoutType === "cd" ? 55 : 49;
    const randomIndex = Math.floor(Math.random() * totalImages) + 1;
    const path =
      layoutType === "cd"
        ? getCDLifestyleImageUrl(randomIndex)
        : getRecordAlbumLifestyleImageUrl(randomIndex);
    return getSharedAssetUrl(path);
  }, [layoutType]);

  useEffect(() => {
    setFramePhotos({});
    if (!selectedFrame?.sku) return;
    async function fetchFramePhotos() {
      try {
        const response = await fetch(`/api/frames/${selectedFrame.sku}/photos`);
        if (response.ok) {
          const photoSet = await response.json();
          setFramePhotos({
            cornerUrl: photoSet.cornerUrl,
            profileUrl: photoSet.profileUrl,
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
  }, [selectedFrame?.sku]);

  const layouts = useMemo(() => {
    if (!selectedFrame?.mouldingWidth) return [];
    if (layoutType === "vinyl") {
      return ["cover-only", "single-with-cover", "double-with-covers"].map(
        (id) =>
          getRecordAlbumLayoutWithMolding(id as RecordAlbumLayoutType, selectedFrame.mouldingWidth)!
      );
    }
    return ["cover-only", "disc-with-cover", "double-disc"].map(
      (id) => getCDLayout(id as CDLayoutType, selectedFrame.mouldingWidth)!
    );
  }, [selectedFrame?.mouldingWidth, layoutType]);

  const currentLayout = useMemo(() => {
    if (!selectedFrame?.mouldingWidth) return null;
    if (layoutType === "vinyl") {
      return getRecordAlbumLayoutWithMolding(
        selectedLayout as RecordAlbumLayoutType,
        selectedFrame.mouldingWidth
      )!;
    }
    return getCDLayout(selectedLayout as CDLayoutType, selectedFrame.mouldingWidth)!;
  }, [selectedLayout, selectedFrame?.mouldingWidth, layoutType]);

  const { containerRef, previewContainerHeight, containerWidth } = useIntelligentPreviewSizing({
    frameWidth: currentLayout?.frameWidth ?? 12,
    frameHeight: currentLayout?.frameHeight ?? 12,
    plaqueEnabled: brassNameplateConfig.enabled,
    plaqueExtension: BRASS_NAMEPLATE_SPECS.NAMEPLATE_FRAME_EXTENSION ?? 1.5,
    isMobile,
  });

  const { artworkWidth, artworkHeight } = useMemo(() => {
    if (!selectedFrame?.mouldingWidth) return { artworkWidth: 12, artworkHeight: 12 };
    if (layoutType === "vinyl") {
      const layoutDims = getLayoutPricingDimensions(
        selectedLayout as RecordAlbumLayoutType,
        selectedFrame.mouldingWidth
      );
      return {
        artworkWidth: layoutDims.artworkWidth,
        artworkHeight: layoutDims.artworkHeight,
      };
    }
    const layoutDims = getCDPricingDimensions(
      selectedLayout as CDLayoutType,
      selectedFrame.mouldingWidth
    );
    return {
      artworkWidth: layoutDims.artworkWidth,
      artworkHeight: layoutDims.artworkHeight,
    };
  }, [selectedLayout, selectedFrame?.mouldingWidth, layoutType]);

  const availableStandardMats = useMemo(() => {
    const mats = getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", true, false);
    return mats.filter((mat) => isMatAvailableForSize(mat, artworkWidth, artworkHeight));
  }, [artworkWidth, artworkHeight, isMobile]);

  const availablePremiumMats = useMemo(() => {
    const mats = getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", false, true);
    return mats.filter((mat) => isMatAvailableForSize(mat, artworkWidth, artworkHeight));
  }, [artworkWidth, artworkHeight, isMobile]);

  useEffect(() => {
    const allAvailableMats = [...availableStandardMats, ...availablePremiumMats];
    if (!allAvailableMats.find((m) => m.id === selectedMat.id)) {
      const whiteMatboard = allAvailableMats.find((m) => m.id === "white-core-white");
      if (whiteMatboard) {
        setSelectedMat(whiteMatboard);
        toast({
          title: "Mat color changed",
          description: `${selectedMat.name} is not available for this size. Switched to ${whiteMatboard.name}.`,
        });
      }
    }
    if (matType === "double" && !allAvailableMats.find((m) => m.id === selectedBottomMat.id)) {
      const whiteMatboard = allAvailableMats.find((m) => m.id === "white-core-white");
      if (whiteMatboard) {
        setSelectedBottomMat(whiteMatboard);
        toast({
          title: "Bottom mat color changed",
          description: `${selectedBottomMat.name} is not available for this size. Switched to ${whiteMatboard.name}.`,
        });
      }
    }
  }, [
    artworkWidth,
    artworkHeight,
    availableStandardMats,
    availablePremiumMats,
    selectedMat,
    selectedBottomMat,
    matType,
    toast,
  ]);

  useEffect(() => {
    if (selectedLayout !== "cover-only" && matType === "none") {
      setMatType("single");
    }
  }, [selectedLayout, matType]);

  useEffect(() => {
    if (matType === "none") {
      setBottomWeighted(false);
    }
  }, [matType]);

  const plaqueAvailable = !(selectedLayout === "cover-only" && matType === "none");
  useEffect(() => {
    if (!plaqueAvailable && brassNameplateConfig.enabled) {
      setBrassNameplateConfig((prev) => ({ ...prev, enabled: false }));
    }
  }, [plaqueAvailable, brassNameplateConfig.enabled]);

  useEffect(() => {
    if (!selectedFrame) return;
    const params = new URLSearchParams();
    params.set("layoutType", layoutType);
    params.set("layout", selectedLayout);
    params.set("frame", selectedFrame.id);
    params.set("mat", selectedMat.id);
    params.set("matType", matType);
    if (matType === "double") params.set("bottomMat", selectedBottomMat.id);
    params.set("glass", selectedGlass.id);
    params.set("hardware", hardware);
    if (bottomWeighted) params.set("bottomWeighted", "true");
    params.set("nameplateEnabled", brassNameplateConfig.enabled.toString());
    if (brassNameplateConfig.line1) params.set("nameplateLine1", brassNameplateConfig.line1);
    if (brassNameplateConfig.line2) params.set("nameplateLine2", brassNameplateConfig.line2);
    if (brassNameplateConfig.line3) params.set("nameplateLine3", brassNameplateConfig.line3);
    if (brassNameplateConfig.font) params.set("nameplateFont", brassNameplateConfig.font);
    if (brassNameplateConfig.color) params.set("nameplateColor", brassNameplateConfig.color);
    const newUrl = `${typeof window !== "undefined" ? window.location.pathname : ""}?${params.toString()}`;
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", newUrl);
    }
  }, [
    layoutType,
    selectedLayout,
    selectedFrame,
    selectedMat,
    selectedBottomMat,
    matType,
    selectedGlass,
    hardware,
    bottomWeighted,
    brassNameplateConfig,
  ]);

  useEffect(() => {
    if (!plaqueAvailable && brassNameplateConfig.enabled) {
      setBrassNameplateConfig({
        enabled: false,
        line1: "",
        line2: "",
        line3: "",
        font: "georgia",
        color: "brass-black",
        includeFlag: false,
      });
      const urlParams = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : ""
      );
      urlParams.delete("plaqueEnabled");
      urlParams.delete("plaqueLine1");
      urlParams.delete("plaqueLine2");
      urlParams.delete("plaqueLine3");
      urlParams.delete("plaqueFont");
      urlParams.delete("plaqueColor");
      const newUrl = urlParams.toString()
        ? `${typeof window !== "undefined" ? window.location.pathname : ""}?${urlParams.toString()}`
        : typeof window !== "undefined"
          ? window.location.pathname
          : "";
      if (typeof window !== "undefined") {
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, [plaqueAvailable, brassNameplateConfig.enabled]);

  const pricing = useMemo(() => {
    if (!selectedFrame) {
      return {
        framePrice: 0,
        matPrice: 0,
        glassPrice: 0,
        backerPrice: 0,
        oversizeFee: 0,
        hardwarePrice: 0,
        nameplatePrice: 0,
        total: 0,
      };
    }
    let layoutDims: {
      artworkWidth: number;
      artworkHeight: number;
      matBorderWidth: number;
    };
    if (layoutType === "vinyl") {
      layoutDims = getLayoutPricingDimensions(
        selectedLayout as RecordAlbumLayoutType,
        selectedFrame.mouldingWidth
      );
    } else {
      layoutDims = getCDPricingDimensions(
        selectedLayout as CDLayoutType,
        selectedFrame.mouldingWidth
      );
    }
    const frameConfig: FrameConfiguration = {
      serviceType: "frame-only",
      artworkWidth: layoutDims.artworkWidth,
      artworkHeight: layoutDims.artworkHeight,
      frameStyleId: selectedFrame.id,
      matType,
      matBorderWidth: matType === "none" ? 0 : layoutDims.matBorderWidth,
      matRevealWidth: matType === "double" ? 0.25 : 0,
      matColorId: matType === "none" ? "" : selectedMat.id,
      matInnerColorId: matType === "double" ? selectedBottomMat.id : undefined,
      glassTypeId: selectedGlass.id,
      bottomWeighted,
    };
    const pricingBreakdown = calculatePricing(frameConfig);
    const hardwarePrice = hardware === "security" ? SECURITY_HARDWARE_UPCHARGE : 0;
    const nameplatePrice = brassNameplateConfig.enabled ? BRASS_NAMEPLATE_SPECS.PRICE : 0;
    const total = pricingBreakdown.total + hardwarePrice + nameplatePrice;
    return {
      framePrice: pricingBreakdown.framePrice,
      matPrice: pricingBreakdown.matPrice,
      glassPrice: pricingBreakdown.glassPrice,
      backerPrice: 0,
      oversizeFee: pricingBreakdown.oversizeFee,
      hardwarePrice,
      nameplatePrice,
      total,
    };
  }, [
    selectedLayout,
    selectedFrame,
    selectedMat.id,
    selectedBottomMat.id,
    matType,
    selectedGlass.id,
    hardware,
    brassNameplateConfig.enabled,
    layoutType,
    bottomWeighted,
  ]);

  const priceItems = useMemo((): PriceLineItem[] => {
    if (!selectedFrame) return [];
    const items: PriceLineItem[] = [];
    items.push({
      label: `${selectedFrame.name} Frame + ${selectedGlass.name}`,
      amount: pricing.framePrice + pricing.glassPrice,
      testId: "text-frame-price",
    });
    if (matType !== "none" && pricing.matPrice > 0) {
      const matLabel =
        matType === "double"
          ? `Double Mat (${selectedMat.name} / ${selectedBottomMat.name})`
          : `Mat (${selectedMat.name})`;
      items.push({
        label: matLabel,
        amount: pricing.matPrice,
        testId: "text-mat-price",
      });
    }
    if (hardware === "security") {
      items.push({
        label: "Security Hardware Upgrade",
        amount: pricing.hardwarePrice,
        testId: "text-hardware-upgrade-price",
      });
    }
    if (brassNameplateConfig.enabled) {
      items.push({
        label: "Metal Engraved Plaque",
        amount: pricing.nameplatePrice,
        testId: "text-plaque-price",
      });
    }
    return items;
  }, [
    selectedFrame,
    selectedGlass.name,
    selectedMat.name,
    selectedBottomMat.name,
    matType,
    hardware,
    brassNameplateConfig.enabled,
    pricing,
  ]);

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Share this link to show your design.",
    });
    setShowShareDialog(false);
  };

  const applyPreset = (
    preset:
      | PresetConfig
      | Omit<PresetConfig, "id" | "name" | "description" | "layout" | "layoutType">,
    layout?: RecordAlbumLayoutType | CDLayoutType
  ) => {
    const targetLayout = "layout" in preset ? preset.layout : (layout ?? selectedLayout);
    const frame = frameStyles.find((f) => f.id === preset.frameId) ?? frameStyles[0]!;
    const mat = ALL_MATS.find((m) => m.id === preset.matId) ?? ALL_MATS[0]!;
    const bottomMat = preset.bottomMatId
      ? (ALL_MATS.find((m) => m.id === preset.bottomMatId) ?? ALL_MATS[0]!)
      : ALL_MATS[0]!;
    const glass = glassTypes.find((g) => g.id === preset.glassId) ?? glassTypes[0]!;
    setSelectedLayout(targetLayout);
    setSelectedFrame(frame);
    setMatType(preset.matType);
    setSelectedMat(mat);
    if (preset.matType === "double" && preset.bottomMatId) {
      setSelectedBottomMat(bottomMat);
    }
    setSelectedGlass(glass);
    setHardware(preset.hardware);
    toast({
      title: "Preset applied",
      description:
        "layout" in preset
          ? `${preset.name} configuration loaded`
          : `${targetLayout} defaults applied`,
    });
  };

  const handleLayoutPreset = (layout: RecordAlbumLayoutType | CDLayoutType) => {
    if (layoutType === "vinyl") {
      const vinylLayout = layout as RecordAlbumLayoutType;
      if (!VINYL_LAYOUT_PRESETS[vinylLayout]) return;
      applyPreset(VINYL_LAYOUT_PRESETS[vinylLayout], layout);
    } else {
      const cdLayout = layout as CDLayoutType;
      if (!CD_LAYOUT_PRESETS[cdLayout]) return;
      applyPreset(CD_LAYOUT_PRESETS[cdLayout], layout);
    }
  };
  void handleLayoutPreset;

  const handleAddToCart = async () => {
    setIsCheckingOut(true);
    try {
      let layoutDims: {
        artworkWidth: number;
        artworkHeight: number;
        matBorderWidth: number;
      };
      if (layoutType === "vinyl") {
        layoutDims = getLayoutPricingDimensions(
          selectedLayout as RecordAlbumLayoutType,
          selectedFrame.mouldingWidth
        );
      } else {
        layoutDims = getCDPricingDimensions(
          selectedLayout as CDLayoutType,
          selectedFrame.mouldingWidth
        );
      }
      const orderSource =
        layoutType === "vinyl"
          ? `record-album-frame-${selectedLayout}`
          : `cd-frame-${selectedLayout}`;
      const frameConfig: FrameConfiguration = {
        serviceType: "frame-only",
        artworkWidth: layoutDims.artworkWidth,
        artworkHeight: layoutDims.artworkHeight,
        frameStyleId: selectedFrame.id,
        matType,
        matBorderWidth: matType === "none" ? 0 : layoutDims.matBorderWidth,
        matRevealWidth: matType === "double" ? 0.25 : 0,
        matColorId: matType === "none" ? "" : selectedMat.id,
        matInnerColorId: matType === "double" ? selectedBottomMat.id : undefined,
        glassTypeId: selectedGlass.id,
        orderSource,
        brassNameplateConfig: brassNameplateConfig.enabled ? brassNameplateConfig : undefined,
      };
      await addToCart(frameConfig, pricing.total, quantity);
      if (!isShopifyEnabled()) {
        toast({
          title: "Mock Checkout Created",
          description: "Shopify is not configured. Check console for payload details.",
        });
      } else {
        toast({
          title: "Redirecting to Checkout",
          description: "Taking you to secure checkout...",
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Error",
        description:
          error instanceof Error ? error.message : "Failed to create checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const layoutConfig = useMemo(() => {
    if (!selectedFrame?.mouldingWidth) return null;
    const bottomWeightedExtra = bottomWeighted ? BOTTOM_WEIGHTED_EXTRA : 0;
    let baseLayout;
    if (layoutType === "vinyl") {
      baseLayout = getRecordAlbumLayoutWithMolding(
        selectedLayout as RecordAlbumLayoutType,
        selectedFrame.mouldingWidth
      );
    } else {
      baseLayout = getCDLayout(selectedLayout as CDLayoutType, selectedFrame.mouldingWidth);
    }
    if (selectedLayout === "cover-only" && matType === "none" && baseLayout) {
      const insertSize = layoutType === "cd" ? 4.75 : baseLayout.artworkWidth;
      const frameSize = insertSize + 2 * selectedFrame.mouldingWidth;
      return {
        ...baseLayout,
        matBorderWidth: 0,
        artworkWidth: insertSize,
        artworkHeight: insertSize,
        frameWidth: frameSize,
        frameHeight: brassNameplateConfig.enabled ? frameSize + 1.5 : frameSize,
      };
    }
    if (baseLayout && bottomWeightedExtra > 0) {
      return {
        ...baseLayout,
        frameHeight: baseLayout.frameHeight + bottomWeightedExtra,
        matBorderBottom: (baseLayout.matBorderWidth ?? 0) + bottomWeightedExtra,
      };
    }
    return baseLayout;
  }, [
    selectedLayout,
    selectedFrame?.mouldingWidth,
    layoutType,
    matType,
    brassNameplateConfig.enabled,
    bottomWeighted,
  ]);

  if (!selectedFrame) {
    return (
      <div className="container mx-auto px-6 py-16">
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">
            <Disc3 className="w-12 h-12 mx-auto mb-4 animate-spin" />
            <p>Loading designer...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 lg:py-8 px-4 pb-32 lg:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-6 pb-24 md:pb-12">
          <div className={`${mobileView === "controls" ? "hidden lg:block" : ""}`}>
            <div className="lg:sticky lg:top-24 space-y-6">
              <Card className="p-4 lg:p-6">
                <h3 className="text-base font-semibold mb-2 lg:mb-3">Choose Your Layout</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                  {layouts.map((layout) => (
                    <button
                      key={layout.id}
                      onClick={() => setSelectedLayout(layout.id)}
                      className={`p-2.5 md:p-4 rounded-md border-2 text-left hover-elevate active-elevate-2 transition-colors ${
                        selectedLayout === layout.id
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                      data-testid={`button-layout-${layout.id}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1 md:mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <LayoutIcon layoutId={layout.id} />
                          <span className="font-medium text-xs md:text-sm truncate">
                            {layout.name}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0 md:hidden">
                          {layout.frameWidth}&quot; × {layout.frameHeight}&quot;
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1 md:mb-2 hidden md:block">
                        {layout.frameWidth}&quot; × {layout.frameHeight}&quot;
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1 md:line-clamp-2">
                        {layout.description}
                      </p>
                    </button>
                  ))}
                </div>
              </Card>

              <Card ref={previewCardRef} className="p-6">
                <div className="relative group">
                  <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setFullscreenDesignerOpen(true)}
                      className="bg-background/90 hover:bg-background p-2 rounded-md shadow-lg hover-elevate active-elevate-2"
                      data-testid="button-fullscreen-preview"
                    >
                      <Maximize className="h-5 w-5" />
                    </button>
                  </div>
                  <RecordAlbumPreview
                    layout={selectedLayout}
                    layoutType={layoutType}
                    frameSku={selectedFrame.sku}
                    frameColor={selectedFrame.color}
                    topMatColor={selectedMat.name}
                    bottomMatColor={selectedBottomMat.name}
                    matType={matType}
                    mouldingWidth={selectedFrame?.mouldingWidth ?? 1}
                    backgroundImageUrl={layoutType === "cd" ? undefined : lifestyleImage}
                    brassNameplateConfig={brassNameplateConfig}
                    className="min-h-[300px] lg:min-h-[400px]"
                    containerRef={containerRef}
                    containerWidth={containerWidth}
                    previewContainerHeight={previewContainerHeight}
                    bottomWeighted={bottomWeighted}
                  />
                </div>
                {layoutConfig && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        Finished Size:{" "}
                        <span className="text-primary">
                          {layoutConfig.frameWidth}&quot; ×{" "}
                          {(brassNameplateConfig.enabled
                            ? (layoutConfig.frameHeight ?? 0) + 1.5
                            : layoutConfig.frameHeight
                          )?.toFixed(2)}
                          &quot;
                        </span>
                      </p>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Layout: {currentLayout?.name ?? selectedLayout}
                      {matType !== "none" && ` • Mat: ${matType}`}
                      {brassNameplateConfig.enabled && " • Brass Nameplate"}
                    </p>
                  </div>
                )}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setFullscreenImage("corner");
                      setFullImageOpen(true);
                    }}
                    className="aspect-square rounded-md overflow-hidden border border-border hover-elevate active-elevate-2 group relative"
                    data-testid="button-frame-corner"
                  >
                    {framePhotos.cornerUrl ? (
                      <img
                        src={framePhotos.cornerUrl}
                        alt="Frame corner detail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-xs text-muted-foreground text-center px-2">
                          Corner Detail
                        </span>
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setFullscreenImage("profile");
                      setFullImageOpen(true);
                    }}
                    className="aspect-square rounded-md overflow-hidden border border-border hover-elevate active-elevate-2 group relative"
                    data-testid="button-frame-profile"
                  >
                    {framePhotos.profileUrl ? (
                      <img
                        src={framePhotos.profileUrl}
                        alt="Frame profile view"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-xs text-muted-foreground text-center px-2">
                          Profile View
                        </span>
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setFullscreenImage("lifestyle");
                      setFullImageOpen(true);
                    }}
                    className="aspect-square rounded-md overflow-hidden border border-border hover-elevate active-elevate-2 group relative"
                    data-testid="button-lifestyle-photo"
                  >
                    {lifestyleImage ? (
                      <img
                        src={lifestyleImage}
                        alt="Lifestyle photo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-xs text-muted-foreground text-center px-2">
                          Lifestyle Photo
                        </span>
                      </div>
                    )}
                  </button>
                </div>
              </Card>
            </div>
          </div>

          <div className={`${mobileView === "preview" ? "hidden lg:block" : ""}`}>
            <div className="lg:sticky lg:top-24 space-y-6">
              <h2 ref={controlsHeadingRef} className="text-2xl font-bold mb-2 lg:hidden">
                Customize Your Frame
              </h2>
              <Accordion
                type="multiple"
                defaultValue={["frame-style", "mat-options", "glazing", "hardware", "nameplate"]}
                className="w-full space-y-4"
              >
                <AccordionItem value="frame-style" className="border rounded-lg px-4 lg:px-6">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                    Frame Style
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="md:max-h-[400px] md:overflow-y-auto md:pr-2">
                      <div className="grid grid-cols-2 gap-2">
                        {frameStyles.map((frame) => (
                          <button
                            key={frame.id}
                            onClick={() => setSelectedFrame(frame)}
                            className={`p-3 rounded-md border-2 text-left hover-elevate active-elevate-2 ${
                              selectedFrame.id === frame.id
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            }`}
                            data-testid={`button-frame-${frame.id}`}
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
                                />
                              </div>
                            ) : (
                              <div className="h-12 w-full rounded mb-2 flex items-center justify-center bg-muted">
                                <span className="text-xs text-muted-foreground">No preview</span>
                              </div>
                            )}
                            <p className="font-medium text-xs lg:text-sm">{frame.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {frame.mouldingWidth}&quot; wide × {frame.usableDepth}&quot; deep
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mat-options" className="border rounded-lg px-4 lg:px-6">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                    Mat Color Options
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="space-y-4">
                      <div
                        className={
                          selectedLayout === "cover-only"
                            ? "grid grid-cols-3 gap-2"
                            : "grid grid-cols-2 gap-2"
                        }
                      >
                        {selectedLayout === "cover-only" && (
                          <Button
                            type="button"
                            variant={matType === "none" ? "default" : "outline"}
                            onClick={() => setMatType("none")}
                            data-testid="button-mat-none"
                          >
                            <span className="font-semibold">No Mat</span>
                          </Button>
                        )}
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
                      {matType !== "none" && (
                        <BottomWeightedMatting
                          checked={bottomWeighted}
                          onCheckedChange={setBottomWeighted}
                          testIdPrefix="record-album"
                        />
                      )}
                      {matType !== "none" && (
                        <div
                          className={`space-y-3 ${
                            matType === "double"
                              ? "pt-4 pb-3 px-3 md:px-0 bg-muted/40 md:bg-transparent rounded-lg"
                              : ""
                          }`}
                        >
                          <Label>
                            {matType === "double"
                              ? `Top Mat Color: ${selectedMat.name}`
                              : `Mat Color: ${selectedMat.name}`}
                          </Label>
                          <ColorSwatchesWithSeparator
                            standardColors={availableStandardMats}
                            premiumColors={availablePremiumMats}
                            selectedId={selectedMat.id}
                            onSelect={setSelectedMat}
                            testIdPrefix="mat"
                          />
                        </div>
                      )}
                      {matType === "double" && (
                        <>
                          <Separator className="my-6" />
                          <div className="space-y-3 pt-4 pb-3 px-3 md:px-0 bg-muted/40 md:bg-transparent rounded-lg">
                            <Label className="text-base font-semibold">
                              Bottom Mat Color: {selectedBottomMat.name}
                            </Label>
                            <ColorSwatchesWithSeparator
                              standardColors={availableStandardMats}
                              premiumColors={availablePremiumMats}
                              selectedId={selectedBottomMat.id}
                              onSelect={setSelectedBottomMat}
                              testIdPrefix="bottom-mat"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="nameplate" className="border rounded-lg px-4 lg:px-6">
                  <AccordionTrigger
                    className="text-base font-semibold hover:no-underline py-4"
                    data-testid="accordion-nameplate"
                  >
                    Engraved Brass Nameplate
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <BrassNameplateSection
                      config={brassNameplateConfig}
                      onChange={setBrassNameplateConfig}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="glazing" className="border rounded-lg px-4 lg:px-6">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                    Glazing Type
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <RadioGroup
                      value={selectedGlass?.id ?? glassTypes[0]?.id ?? ""}
                      onValueChange={(id) =>
                        setSelectedGlass(glassTypes.find((g) => g.id === id) ?? glassTypes[0]!)
                      }
                    >
                      <div className="flex flex-col md:flex-row flex-wrap gap-2">
                        {glassTypes.map((glass) => (
                          <div
                            key={glass.id}
                            className="flex items-center space-x-3 flex-1 min-w-[200px]"
                          >
                            <RadioGroupItem
                              value={glass.id}
                              id={`glass-${glass.id}`}
                              className="h-5 w-5"
                              data-testid={`radio-glass-${glass.id}`}
                            />
                            <Label
                              htmlFor={`glass-${glass.id}`}
                              className="cursor-pointer text-sm flex-1"
                            >
                              {glass.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="hardware" className="border rounded-lg px-4 lg:px-6">
                  <AccordionTrigger
                    className="text-base font-semibold hover:no-underline py-4"
                    data-testid="accordion-hardware"
                  >
                    Hanging Hardware
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <HangingHardwareSection
                      hardwareType={hardware}
                      setHardwareType={setHardware}
                      frameWidth={currentLayout?.frameWidth ?? 12}
                      frameHeight={currentLayout?.frameHeight ?? 12}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <PriceBox
                totalPrice={pricing.total}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onCopyLink={() => setShowShareDialog(true)}
                isProcessing={isCheckingOut}
                priceItems={priceItems}
                testIdPrefix="record-album-"
              />
            </div>
          </div>
        </div>

        {isMobile && (
          <div
            className={`fixed left-0 right-0 bottom-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg z-50 transition-all duration-300 ease-in-out ${
              showMobileBar
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0 pointer-events-none"
            }`}
          >
            <div className="px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-0.5 min-w-[60px]">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <span
                    className="font-bold text-sm"
                    data-testid="text-record-album-mobile-sticky-total-price"
                  >
                    ${(pricing.total * quantity).toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <Label htmlFor="quantity-sticky" className="text-xs text-muted-foreground">
                    Qty
                  </Label>
                  <QuantitySelector
                    value={quantity}
                    onChange={setQuantity}
                    className="w-14 h-7 text-xs text-center p-0"
                    testId="input-record-album-quantity-sticky"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowShareDialog(true)}
                  data-testid="button-record-album-mobile-copy-link"
                  className="h-11 w-11"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="default"
                  onClick={handleAddToCart}
                  disabled={isCheckingOut}
                  data-testid="button-record-album-mobile-add-to-cart"
                  className="flex-1 text-xs min-w-0 min-h-11"
                >
                  {isCheckingOut ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <Button
          size="lg"
          className={`fixed bottom-20 right-6 z-[60] lg:hidden shadow-lg rounded-full h-14 px-6 transition-all duration-300 ${
            showMobileBar
              ? "translate-y-0 opacity-100"
              : "translate-y-32 opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileView(mobileView === "preview" ? "controls" : "preview")}
          data-testid="button-toggle-mobile-view"
        >
          {mobileView === "preview" ? (
            <>
              <Settings className="w-5 h-5 mr-2" />
              Customize
            </>
          ) : (
            <>
              <Eye className="w-5 h-5 mr-2" />
              Preview
            </>
          )}
        </Button>
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Design</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Copy this link to share your {layoutType === "cd" ? "CD" : "record album"} frame
              design
            </p>
            <div className="flex gap-2">
              <Input value={typeof window !== "undefined" ? window.location.href : ""} readOnly />
              <Button onClick={handleShare}>Copy</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={fullImageOpen} onOpenChange={setFullImageOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {fullscreenImage === "corner" && "Frame Corner Detail"}
              {fullscreenImage === "profile" && "Frame Profile View"}
              {fullscreenImage === "lifestyle" && "Lifestyle Photo"}
              {fullscreenImage === "screw" && "Nylon Mounting Screw"}
            </DialogTitle>
          </DialogHeader>
          <div className="relative aspect-square w-full">
            {fullscreenImage === "corner" && framePhotos.cornerUrl && (
              <img
                src={framePhotos.cornerUrl}
                alt="Frame corner detail"
                className="w-full h-full object-contain"
              />
            )}
            {fullscreenImage === "profile" && framePhotos.profileUrl && (
              <img
                src={framePhotos.profileUrl}
                alt="Frame profile view"
                className="w-full h-full object-contain"
              />
            )}
            {fullscreenImage === "lifestyle" && lifestyleImage && (
              <img
                src={lifestyleImage}
                alt="Lifestyle photo showing frame in use"
                className="w-full h-full object-contain"
              />
            )}
            {fullscreenImage === "screw" && (
              <div className="w-full h-full flex items-center justify-center bg-muted/10 p-8">
                <div className="max-w-md text-center">
                  <div className="w-64 h-64 mx-auto mb-6">
                    <MountingScrewSVG className="w-full h-full" />
                  </div>
                  <p className="text-lg font-medium mb-2">Nylon Mounting Screw</p>
                  <p className="text-sm text-muted-foreground">
                    Nylon mounting screws securely attach your record album to the shadowbox
                    backing, preventing movement while allowing easy access if needed.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={fullscreenDesignerOpen} onOpenChange={setFullscreenDesignerOpen}>
        <DialogContent className="max-w-[98vw] max-h-[98vh] h-[98vh] p-3">
          <DialogHeader className="pb-1">
            <DialogTitle className="text-base">Preview - Fullscreen Mode</DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center overflow-hidden min-h-0">
            <RecordAlbumPreview
              layout={selectedLayout}
              layoutType={layoutType}
              frameSku={selectedFrame.sku}
              frameColor={selectedFrame.color}
              topMatColor={selectedMat.name}
              bottomMatColor={selectedBottomMat.name}
              matType={matType}
              mouldingWidth={selectedFrame?.mouldingWidth ?? 1}
              backgroundImageUrl={layoutType === "cd" ? undefined : lifestyleImage}
              brassNameplateConfig={brassNameplateConfig}
              className="w-full h-full"
              bottomWeighted={bottomWeighted}
            />
          </div>
          {layoutConfig && (
            <div className="mt-1 p-2 bg-muted/50 rounded-md">
              <p className="text-xs font-medium text-center">
                Overall Frame Dimensions:{" "}
                <span className="font-normal">
                  {layoutConfig.frameWidth}&quot; ×{" "}
                  {brassNameplateConfig.enabled
                    ? (layoutConfig.frameHeight ?? 0) + 1.5
                    : layoutConfig.frameHeight}
                  &quot;
                </span>
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
