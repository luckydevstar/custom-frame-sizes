"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Copy,
  Maximize,
  ShoppingCart,
  Eye,
  Settings,
  LayoutGrid,
  Sparkles,
  Award,
  Share2,
  Info,
  Shield,
  CheckCircle2,
  Package,
  Ruler,
  Layers,
  Tag,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { QuantitySelector } from "../ui/quantity-selector";
import { PriceBox } from "../ui/PriceBox";
import type { PriceLineItem } from "../ui/PriceBox";
import { useToast } from "../../hooks/use-toast";
import {
  getFramesByCategory,
  getGlassTypes,
  getSharedAssetUrl,
  getStoreBaseAssetUrl,
} from "@framecraft/core";
import { useIsMobile, useMobileViewToggle } from "@framecraft/core";
import type { FrameStyle, GlassType } from "@framecraft/types";
import type { FrameConfiguration } from "@framecraft/types";
import { ALL_MATS, getMatById, getAvailableMatsForSize, type Mat } from "@framecraft/config";
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import type { BrassNameplateConfig } from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS } from "@framecraft/types";
import {
  getCardFormatById,
  CARD_LAYOUTS,
  getCardLayout,
  calculateCardFrameSize,
  type CardLayoutType,
} from "@framecraft/core";
import {
  getShuffledCardsForFormat,
  getRandomCategory,
  getAllCategories,
  type CardCategory,
} from "@framecraft/core";
import { calculatePricing } from "@framecraft/core";
import { CardPreviewCanvas, useCardPreviewState } from "./CardPreviewCanvas";
import { CardLayoutGallery } from "./CardLayoutGallery";
import { TrustBadges } from "../marketing/TrustBadges";
import { GradedCardLifestyleCarousel } from "./GradedCardLifestyleCarousel";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { BottomWeightedMatting } from "./shared/BottomWeightedMatting";

// Get product data from services
const shadowboxFrames = getFramesByCategory("shadowbox");
const allGlassTypes = getGlassTypes();
// Filter to only Regular and Non-glare for card frames
const glassTypes = allGlassTypes.filter((g) => g.id === "standard" || g.id === "non-glare");

interface CardFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
}

export function CardFrameDesigner({ defaultFrameId, embedded = false }: CardFrameDesignerProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  // URL parameters (SSR-safe)
  const urlParams = useMemo(
    () =>
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams(),
    []
  );

  // Initialize frame selection
  const initialFrame = useMemo(() => {
    if (defaultFrameId) {
      const frame = shadowboxFrames.find(
        (f) => f.id === defaultFrameId || f.sku === defaultFrameId
      );
      return frame || shadowboxFrames[0];
    }
    const frameParam = urlParams.get("frame");
    if (frameParam) {
      const frame = shadowboxFrames.find((f) => f.id === frameParam || f.sku === frameParam);
      return frame || shadowboxFrames[0];
    }
    // Default to SKU 8693
    const defaultFrame = shadowboxFrames.find((f) => f.sku === "8693");
    return defaultFrame || shadowboxFrames[0];
  }, [defaultFrameId, urlParams]);

  // Card category - randomly selected on page load, persisted to URL
  const [cardCategory, setCardCategory] = useState<CardCategory>(() => {
    const urlCategory = urlParams.get("category") as CardCategory;
    // Validate URL category - must be a valid available category
    const availableCategories = getAllCategories();
    if (urlCategory && availableCategories.includes(urlCategory)) {
      return urlCategory;
    }
    // Default to random category on first load
    return getRandomCategory();
  });

  // Designer state - Three-step flow: Format → Layout → Presentation
  const [selectedFormat, setSelectedFormat] = useState<string>(() => {
    const urlFormat = urlParams.get("format");
    // Validate URL format - must be a valid card format
    if (urlFormat && getCardFormatById(urlFormat)) {
      return urlFormat;
    }
    // Default to PSA format (most common)
    return "psa";
  });

  const [selectedLayout, setSelectedLayout] = useState<CardLayoutType>(() => {
    const urlLayout = urlParams.get("layout");
    if (urlLayout && CARD_LAYOUTS.find((l) => l.id === urlLayout)) {
      return urlLayout as CardLayoutType;
    }
    // Start with empty string - desktop will get default via useEffect
    return "";
  });

  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(
    () => initialFrame ?? shadowboxFrames[0]!
  );

  // Mat configuration
  const [selectedMat, setSelectedMat] = useState<Mat>(() => {
    const urlMat = urlParams.get("mat");
    return (urlMat ? getMatById(urlMat) : getMatById("mat-1")) ?? ALL_MATS[0]!;
  });

  const [selectedMatInner, setSelectedMatInner] = useState<Mat>(() => {
    const urlMatInner = urlParams.get("matInner");
    return (urlMatInner ? getMatById(urlMatInner) : getMatById("mat-2")) ?? ALL_MATS[1]!;
  });

  const [matType, setMatType] = useState<"none" | "single" | "double">(() => {
    const urlMatType = urlParams.get("matType") as "none" | "single" | "double";
    return urlMatType || "double";
  });

  const [bottomWeighted, setBottomWeighted] = useState(() => {
    return urlParams.get("bottomWeighted") === "true";
  });

  // Fixed mat dimensions (not user-adjustable for card frames)
  const MAT_BORDER = 2.0; // inches
  const MAT_REVEAL = 0.25; // inches - 0.25" reveal to show bottom mat color

  // Glazing and hardware
  const [selectedGlass, setSelectedGlass] = useState<GlassType>(() => {
    const urlGlass = urlParams.get("glass");
    const found = urlGlass
      ? glassTypes.find((g) => g.id === urlGlass) || glassTypes[0]
      : glassTypes[0];
    return found!;
  });

  const [hardware, setHardware] = useState<"standard" | "security">(() => {
    return (urlParams.get("hardware") as "standard" | "security") || "standard";
  });

  // Brass nameplate configuration
  const [brassNameplateConfig, setBrassNameplateConfig] = useState<BrassNameplateConfig>(() => {
    const defaultConfig: BrassNameplateConfig = {
      enabled: false,
      line1: "",
      line2: "",
      line3: "",
      font: "georgia",
      color: "brass-black",
      includeFlag: false, // No flag for card frames
    };

    try {
      const nameplateEnabled =
        urlParams.get("nameplateEnabled") === "true" || urlParams.get("plaqueEnabled") === "true";
      if (!nameplateEnabled) return defaultConfig;

      return {
        enabled: true,
        line1: urlParams.get("nameplateLine1") || urlParams.get("plaqueLine1") || "",
        line2: urlParams.get("nameplateLine2") || urlParams.get("plaqueLine2") || "",
        line3: urlParams.get("nameplateLine3") || urlParams.get("plaqueLine3") || "",
        font:
          (urlParams.get("nameplateFont") as BrassNameplateConfig["font"]) ||
          (urlParams.get("plaqueFont") as BrassNameplateConfig["font"]) ||
          "georgia",
        color:
          (urlParams.get("nameplateColor") as BrassNameplateConfig["color"]) ||
          (urlParams.get("plaqueColor") as BrassNameplateConfig["color"]) ||
          "brass-black",
        includeFlag: false, // Always false for card frames
      };
    } catch {
      return defaultConfig;
    }
  });

  // UI state
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<
    "preview" | "corner" | "profile" | "lifestyle"
  >("preview");
  const [fullscreenLifestyleUrl, setFullscreenLifestyleUrl] = useState<string>("");
  const [fullscreenLifestyleAlt, setFullscreenLifestyleAlt] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const customizationPaneRef = useRef<HTMLDivElement>(null);

  // New UX improvement states
  const [smartDefaultApplied, setSmartDefaultApplied] = useState<string | null>(null);

  // Deterministic first lifestyle photo (avoids hydration mismatch; previewState.framePhotos used for frame)
  const LIFESTYLE_IMAGES = useMemo(
    () => [
      {
        url: getSharedAssetUrl("card-frames/lifestyle/lifestyle_1.jpg"),
        alt: "PSA graded sports cards in custom shadowbox frame",
      },
      {
        url: getSharedAssetUrl("card-frames/lifestyle/lifestyle_2.jpg"),
        alt: "BGS graded basketball cards in shadowbox frame",
      },
      {
        url: getSharedAssetUrl("card-frames/lifestyle/lifestyle_3.jpg"),
        alt: "Graded Pokemon cards in professional frame display",
      },
      {
        url: getSharedAssetUrl("card-frames/lifestyle/lifestyle_4.jpg"),
        alt: "PSA 10 gem mint cards in custom shadowbox",
      },
    ],
    []
  );
  const randomLifestylePhoto = LIFESTYLE_IMAGES[0]!;

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const designerSectionRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 400, height: 400 });

  // Scroll to designer function for CTA button
  const scrollToDesigner = useCallback(() => {
    designerSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  // Calculate manufacturing dimensions using exact interior dimension lookup table
  // This provides accurate dimensions for pricing and "Overall Size" display text
  const manufacturingFrameDimensions = useMemo(() => {
    // Return default dimensions if no layout selected yet
    if (!selectedLayout) {
      return {
        width: 16,
        height: 20,
      };
    }

    const dimensions = calculateCardFrameSize(
      selectedLayout,
      selectedFormat,
      MAT_BORDER,
      brassNameplateConfig.enabled
    );

    const bottomWeightedExtra = bottomWeighted ? 0.5 : 0;
    return {
      width: dimensions.width,
      height: dimensions.height + bottomWeightedExtra,
    };
  }, [selectedLayout, selectedFormat, brassNameplateConfig.enabled, bottomWeighted]);

  // Calculate FIXED container height using MAXIMUM aspect ratio to prevent layout shifts
  // This prevents bouncing when brass plaque is toggled (26" → 27.5" height change)
  // Strategy: Reserve space for tallest possible frame so container never resizes
  const previewContainerHeight = useMemo(() => {
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800;
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1200;

    // Calculate responsive width (use container width if available, otherwise estimate)
    const availableWidth =
      containerSize.width > 0 ? containerSize.width : Math.min(viewportWidth * 0.94, 600);

    // Use MAXIMUM aspect ratio (tallest frame configuration with plaque)
    // This is approximately 1.72 (27.5" / 16" for 16-card grid with plaque)
    // Using 1.75 to ensure all layouts fit comfortably
    const maxAspectRatio = 1.75;

    // Calculate height based on maximum aspect ratio
    const calculatedHeight = availableWidth * maxAspectRatio;

    // Clamp height between reasonable bounds
    const minHeight = 220;
    const maxHeight = isMobile ? viewportHeight * 0.65 : viewportHeight * 0.8;

    return Math.max(minHeight, Math.min(calculatedHeight, maxHeight));
  }, [containerSize.width, isMobile]);

  // Re-randomize card category when layout changes (PSA and SGC/CGC/BGS formats)
  // This ensures variety across layouts - users will see Monsters, Heroes, Baseball, Football rotating
  useEffect(() => {
    // Re-randomize for PSA and SGC/CGC/BGS formats (both use thematic card sets)
    // Pack slabs don't use category system - they have their own dedicated pack images
    if ((selectedFormat === "psa" || selectedFormat === "sgc-cgc-bgs") && selectedLayout) {
      const newCategory = getRandomCategory();
      setCardCategory(newCategory);
    }
  }, [selectedFormat, selectedLayout]);

  // Get card covers for preview - shuffled based on format selection (CDN URLs)
  const cardImages = useMemo(() => {
    if (!selectedLayout) return [];
    const layout = getCardLayout(selectedLayout);
    const cardCount = layout.count;
    const raw = getShuffledCardsForFormat(
      selectedFormat as "psa" | "sgc-cgc-bgs" | "psa-pack-slabs",
      cardCategory,
      cardCount,
      ""
    );
    return raw.map((p) => getSharedAssetUrl("card-frames/insert-images/card-inserts" + p));
  }, [selectedFormat, cardCategory, selectedLayout]);

  // Get current format details (for dimensions display)
  const currentFormat = useMemo(() => getCardFormatById(selectedFormat), [selectedFormat]);

  // Track container WIDTH ONLY for preview scaling (height is fixed to prevent feedback loop)
  // This breaks the oscillation cycle that caused layout cards to bounce when plaque toggled
  useEffect(() => {
    if (!containerRef.current) return;

    let timeoutId: NodeJS.Timeout;

    const resizeObserver = new ResizeObserver((entries) => {
      // Debounce to avoid processing every frame
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        for (const entry of entries) {
          const newWidth = Math.round(entry.contentRect.width);
          // DO NOT track height - it creates a feedback loop with previewContainerHeight

          setContainerSize((prev) => {
            // Tolerance threshold: only update if width change is > 2px
            const widthDiff = Math.abs(newWidth - prev.width);

            if (widthDiff > 2) {
              return { width: newWidth, height: prev.height }; // Keep height stable
            }
            return prev;
          });
        }
      }, 16); // ~60fps, fast enough to feel instant but debounced
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [selectedLayout]);

  // Get preview state using the hook
  const previewState = useCardPreviewState({
    formatId: selectedFormat,
    layoutId: selectedLayout,
    matBorder: MAT_BORDER,
    matReveal: MAT_REVEAL,
    matType,
    brassNameplateConfig,
    selectedFrame,
    containerWidth: containerSize.width,
    containerHeight: containerSize.height,
    cardImages,
    bottomWeightedExtra: bottomWeighted ? 0.5 : 0,
  });

  // Get fullscreen preview state with larger dimensions
  const fullscreenPreviewState = useCardPreviewState({
    formatId: selectedFormat,
    layoutId: selectedLayout,
    matBorder: MAT_BORDER,
    matReveal: MAT_REVEAL,
    matType,
    brassNameplateConfig,
    selectedFrame,
    containerWidth: typeof window !== "undefined" ? window.innerWidth - 100 : 1000,
    containerHeight: typeof window !== "undefined" ? window.innerHeight - 100 : 800,
    cardImages,
    bottomWeightedExtra: bottomWeighted ? 0.5 : 0,
  });

  // Get mats filtered by frame size to hide mats that don't have required sheet sizes
  // On desktop, filter out Terracotta (only show on mobile)
  const standardMats = useMemo(() => {
    const availableMats = getAvailableMatsForSize(
      manufacturingFrameDimensions.width,
      manufacturingFrameDimensions.height,
      true, // include regular
      false // exclude premium
    );
    // Hide Terracotta on desktop only
    if (!isMobile) {
      return availableMats.filter((mat) => mat.name !== "Terracotta");
    }
    return availableMats;
  }, [manufacturingFrameDimensions.width, manufacturingFrameDimensions.height, isMobile]);

  const premiumMats = useMemo(() => {
    const availableMats = getAvailableMatsForSize(
      manufacturingFrameDimensions.width,
      manufacturingFrameDimensions.height,
      false, // exclude regular
      true // include premium
    );
    return availableMats;
  }, [manufacturingFrameDimensions.width, manufacturingFrameDimensions.height]);

  // Reset mat selection if current mat becomes unavailable due to size change
  useEffect(() => {
    const allAvailableMats = [...standardMats, ...premiumMats];

    // Check if top mat is still available
    const isTopMatAvailable = allAvailableMats.some((mat) => mat.id === selectedMat.id);
    if (!isTopMatAvailable && allAvailableMats.length > 0) {
      const blackMat = allAvailableMats.find((mat) => mat.id === "mat-2");
      setSelectedMat(blackMat ?? allAvailableMats[0]!);
    }

    if (matType === "double") {
      const isBottomMatAvailable = allAvailableMats.some((mat) => mat.id === selectedMatInner.id);
      if (!isBottomMatAvailable && allAvailableMats.length > 0) {
        const whiteMat = allAvailableMats.find((mat) => mat.id === "mat-1");
        setSelectedMatInner(whiteMat ?? allAvailableMats[0]!);
      }
    }
  }, [standardMats, premiumMats, selectedMat.id, selectedMatInner.id, matType]);

  // Calculate pricing using the new pricing engine v2
  // Hardware pricing constant (security hardware add-on)
  const SECURITY_HARDWARE_UPCHARGE = 8.95;

  const pricing = useMemo(() => {
    // Return zero pricing if no layout selected yet
    if (!selectedLayout) {
      return {
        framePrice: 0,
        matPrice: 0,
        glassPrice: 0,
        hardwarePrice: 0,
        nameplatePrice: 0,
        subtotal: 0,
        total: 0,
      };
    }

    // Calculate artwork dimensions (frame interior minus mat borders)
    // calculatePricing adds mat border back to get frame dimensions
    const bottomWeightedExtra = bottomWeighted ? 0.5 : 0;
    const artworkWidth = manufacturingFrameDimensions.width - MAT_BORDER * 2;
    const artworkHeight =
      manufacturingFrameDimensions.height - bottomWeightedExtra - MAT_BORDER * 2;

    // Build FrameConfiguration for pricing engine
    const config: FrameConfiguration = {
      serviceType: "frame-only",
      artworkWidth,
      artworkHeight,
      frameStyleId: selectedFrame.id,
      matType,
      matBorderWidth: MAT_BORDER,
      matRevealWidth: MAT_REVEAL,
      matColorId: selectedMat.id,
      matInnerColorId: matType === "double" ? selectedMatInner.id : undefined,
      glassTypeId: selectedGlass.id,
      bottomWeighted,
    };

    // Get frame + glazing + mat pricing from new engine v2
    const basePricing = calculatePricing(config);

    // Add hardware pricing (security hardware is an add-on)
    const hardwarePrice = hardware === "security" ? SECURITY_HARDWARE_UPCHARGE : 0;

    // Add nameplate pricing (brass nameplate is an add-on)
    const nameplatePrice = brassNameplateConfig.enabled ? BRASS_NAMEPLATE_SPECS.PRICE : 0;

    // Combine all pricing
    const subtotal = basePricing.total + hardwarePrice + nameplatePrice;

    return {
      framePrice: basePricing.framePrice,
      matPrice: basePricing.matPrice,
      glassPrice: basePricing.glassPrice,
      hardwarePrice,
      nameplatePrice,
      subtotal,
      total: subtotal,
    };
  }, [
    selectedLayout,
    selectedFrame.id,
    matType,
    selectedMat.id,
    selectedMatInner.id,
    selectedGlass.id,
    hardware,
    brassNameplateConfig.enabled,
    manufacturingFrameDimensions.width,
    manufacturingFrameDimensions.height,
    bottomWeighted,
  ]);

  // Build itemized price breakdown for PriceBox
  const priceItems: PriceLineItem[] = useMemo(() => {
    const items: PriceLineItem[] = [];

    // Frame price
    items.push({
      label: "Frame",
      amount: pricing.framePrice,
      testId: "text-frame-price",
    });

    // Mat price (if applicable)
    if (matType !== "none" && pricing.matPrice > 0) {
      items.push({
        label: matType === "double" ? "Double Mat" : "Single Mat",
        amount: pricing.matPrice,
        testId: "text-mat-price",
      });
    }

    // Glass/Glazing - included in frame price with new pricing engine v2
    // Show the selected glass type as "Included" since cost is bundled in frame price
    items.push({
      label: selectedGlass.name || "Standard Acrylic",
      amount: 0,
      isIncluded: true,
      testId: "text-glass-price",
    });

    // Hardware price (security hardware)
    if (hardware === "security" && pricing.hardwarePrice > 0) {
      items.push({
        label: "Security Hardware",
        amount: pricing.hardwarePrice,
        testId: "text-hardware-price",
      });
    }

    // Brass plaque (if enabled)
    if (brassNameplateConfig.enabled && pricing.nameplatePrice > 0) {
      items.push({
        label: "Engraved Brass Nameplate",
        amount: pricing.nameplatePrice,
        testId: "text-plaque-price",
      });
    }

    return items;
  }, [pricing, matType, selectedGlass, hardware, brassNameplateConfig.enabled]);

  // Share configuration
  const handleShare = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Design link copied to clipboard",
    });
  }, [toast]);

  // Add to cart handler
  const handleAddToCart = useCallback(() => {
    const currentLayout = getCardLayout(selectedLayout);
    toast({
      title: "Added to cart!",
      description: `${quantity}× Card Frame - ${currentLayout?.displayName ?? "Custom"}`,
    });
  }, [quantity, selectedLayout, toast]);

  // Apply preset configuration (reserved for future preset buttons; kept for API)
  function applyPreset(presetName: "signature" | "vault") {
    if (presetName === "signature") {
      // Signature Wall Display preset
      setSelectedFormat("psa"); // PSA format (most popular)
      // Mobile: reset layout to force selection; Desktop: set it directly
      if (isMobile) {
        setSelectedLayout("");
      } else {
        setSelectedLayout("1x1");
      }
      // Find black frame
      const blackFrame = shadowboxFrames.find((f) => f.name.toLowerCase().includes("black"));
      if (blackFrame) setSelectedFrame(blackFrame);
      setMatType("double");
      // White top mat
      const whiteMat = getMatById("mat-1"); // White
      if (whiteMat) setSelectedMat(whiteMat);
      // Metallic gold bottom mat
      const goldMat = getMatById("mat-11"); // Metallic Gold (premium)
      if (goldMat) setSelectedMatInner(goldMat);
      // UV-protective glass (standard)
      setSelectedGlass(glassTypes.find((g) => g.id === "standard") ?? glassTypes[0]!);
      // Enable brass plaque
      setBrassNameplateConfig({
        enabled: true,
        line1: "",
        line2: "",
        line3: "",
        font: "georgia",
        color: "brass-black",
        includeFlag: false,
      });
      setHardware("standard");
      setSmartDefaultApplied(null); // Clear smart default banner
      toast({
        title: "Applied Signature Wall Display",
        description: isMobile
          ? "Preset applied. Now choose your layout."
          : "Premium configuration for showcase display",
      });
    } else if (presetName === "vault") {
      // Vault Preservation preset
      setSelectedFormat("psa"); // PSA format (most popular)
      // Mobile: reset layout to force selection; Desktop: set it directly
      if (isMobile) {
        setSelectedLayout("");
      } else {
        setSelectedLayout("1x1");
      }
      // Find black frame
      const blackFrame = shadowboxFrames.find((f) => f.name.toLowerCase().includes("black"));
      if (blackFrame) setSelectedFrame(blackFrame);
      setMatType("single");
      // Black mat
      const blackMat = getMatById("mat-3"); // Black
      if (blackMat) setSelectedMat(blackMat);
      // Museum glass (non-glare)
      setSelectedGlass(glassTypes.find((g) => g.id === "non-glare") ?? glassTypes[0]!);
      // Disable brass plaque
      setBrassNameplateConfig({
        enabled: false,
        line1: "",
        line2: "",
        line3: "",
        font: "georgia",
        color: "brass-black",
        includeFlag: false,
      });
      setHardware("standard");
      setSmartDefaultApplied(null); // Clear smart default banner
      toast({
        title: "Applied Vault Preservation",
        description: isMobile
          ? "Preset applied. Now choose your layout."
          : "Professional protection for graded slabs",
      });
    }
  }

  // Default layout - set 'single' for all users if no selection (ensures preview on mobile)
  useEffect(() => {
    // Both desktop and mobile users get auto-default layout to ensure preview shows immediately
    if (!selectedLayout && !urlParams.get("layout")) {
      setSelectedLayout("1x1");
    }
  }, [selectedLayout, urlParams]);

  // Smart defaults system - auto-apply settings based on format selection
  useEffect(() => {
    // Skip if this is the initial load with URL params (don't override user's saved config)
    if (urlParams.get("format")) return;

    // Skip if smart defaults were just applied for this format (prevent infinite loops)
    if (smartDefaultApplied === selectedFormat) return;

    // Apply smart defaults based on format
    // All formats use consistent mat defaults: White (VB222/mat-1) top + Black (VB221/mat-2) bottom
    if (selectedFormat === "psa") {
      // PSA format - auto-select single card layout for all users (desktop + mobile)
      setSelectedLayout("1x1");
      const blackFrame = shadowboxFrames.find((f) => f.name.toLowerCase().includes("black"));
      if (blackFrame) setSelectedFrame(blackFrame);
      setMatType("double");
      const whiteMat = getMatById("mat-1"); // White VB222
      if (whiteMat) setSelectedMat(whiteMat);
      const blackMat = getMatById("mat-2"); // Black VB221
      if (blackMat) setSelectedMatInner(blackMat);
      setSmartDefaultApplied("psa");
    } else if (selectedFormat === "sgc-cgc-bgs") {
      // SGC/CGC/BGS format - auto-select single card layout for all users
      setSelectedLayout("1x1");
      const blackFrame = shadowboxFrames.find((f) => f.name.toLowerCase().includes("black"));
      if (blackFrame) setSelectedFrame(blackFrame);
      setMatType("double");
      const whiteMat = getMatById("mat-1"); // White VB222
      if (whiteMat) setSelectedMat(whiteMat);
      const blackMat = getMatById("mat-2"); // Black VB221
      if (blackMat) setSelectedMatInner(blackMat);
      setSmartDefaultApplied("sgc-cgc-bgs");
    }
  }, [selectedFormat, smartDefaultApplied, isMobile, urlParams]);

  // Sync configuration to URL for shareability (client-only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();

    // Add all configuration parameters to URL
    params.set("category", cardCategory);
    params.set("format", selectedFormat);
    if (selectedLayout) params.set("layout", selectedLayout);
    params.set("frame", selectedFrame.id);
    params.set("mat", selectedMat.id);
    params.set("matType", matType);
    if (matType === "double") {
      params.set("matInner", selectedMatInner.id);
    }
    if (matType !== "none") {
      if (bottomWeighted) {
        params.set("bottomWeighted", "true");
      } else {
        params.delete("bottomWeighted");
      }
    }
    params.set("glass", selectedGlass.id);
    params.set("hardware", hardware);
    params.set("quantity", quantity.toString());

    // Add brass plaque config if enabled
    if (brassNameplateConfig.enabled) {
      params.set("nameplateEnabled", "true");
      if (brassNameplateConfig.line1) params.set("nameplateLine1", brassNameplateConfig.line1);
      if (brassNameplateConfig.line2) params.set("nameplateLine2", brassNameplateConfig.line2);
      if (brassNameplateConfig.line3) params.set("nameplateLine3", brassNameplateConfig.line3);
      params.set("nameplateFont", brassNameplateConfig.font);
      params.set("nameplateColor", brassNameplateConfig.color);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [
    cardCategory,
    selectedFormat,
    selectedLayout,
    selectedFrame,
    selectedMat,
    selectedMatInner,
    matType,
    bottomWeighted,
    selectedGlass,
    hardware,
    quantity,
    brassNameplateConfig,
  ]);

  // Reset bottomWeighted when mat is disabled
  useEffect(() => {
    if (matType === "none" && bottomWeighted) {
      setBottomWeighted(false);
    }
  }, [matType, bottomWeighted]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-24 lg:pb-0">
        {/* Hero Section - Only shown when not embedded */}
        {!embedded && (
          <>
            <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
                  <Shield className="w-3 h-3" />
                  <span className="text-xs font-medium" data-testid="text-badge">
                    Protect Your Graded Card Collection
                  </span>
                </div>

                <h1
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
                  data-testid="text-hero-title"
                >
                  Picture Frames in Custom Sizes for Graded Sports Cards & TCG Cards
                </h1>

                <p
                  className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
                  data-testid="text-hero-subtitle"
                >
                  Professional shadowbox frames for PSA, SGC, CGC, and BGS graded cards. Custom
                  layouts from single cards to 8-card displays with double mat systems, brass
                  plaques, and archival protection.
                </p>

                <Button
                  size="lg"
                  onClick={scrollToDesigner}
                  className="gap-2"
                  data-testid="button-scroll-to-designer"
                >
                  Design Your Frame
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>
            </section>

            <section className="border-y bg-muted/20">
              <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
                  <div className="text-center" data-testid="feature-custom-size">
                    <Ruler className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                    <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                      Custom Sizes
                    </p>
                    <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                      Built to fit your slabs
                    </p>
                  </div>
                  <div className="text-center" data-testid="feature-handcrafted">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                    <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                      Handcrafted
                    </p>
                    <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                      Skilled artisans
                    </p>
                  </div>
                  <div className="text-center" data-testid="feature-professional-grade">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                    <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                      Professional-Grade
                    </p>
                    <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                      Archival materials
                    </p>
                  </div>
                  <div className="text-center" data-testid="feature-instant-pricing">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                    <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                      Instant Pricing
                    </p>
                    <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                      See cost as you customize
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Mobile Header - Only shown on mobile when embedded */}
        {isMobile && embedded && (
          <div className="lg:hidden border-b bg-card/50 sticky top-0 z-40">
            <div className="px-4 py-3">
              <h1 className="text-lg font-bold">Card Frame Designer</h1>
            </div>
          </div>
        )}

        <div ref={designerSectionRef} className="container mx-auto px-4 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left: Preview - Hidden on mobile when viewing controls */}
            <div
              className={`${isMobile && mobileView === "controls" ? "hidden" : ""} lg:sticky lg:top-[132px] lg:self-start`}
            >
              <Card ref={previewCardRef} className="p-6" data-testid="card-preview">
                <div className="space-y-4">
                  {/* Mobile Quick Actions Bar */}
                  {isMobile && (
                    <div className="flex items-center justify-between gap-2 pb-2 border-b">
                      <h3 className="font-semibold text-base">Preview</h3>
                      <div className="flex items-center gap-1">
                        {/* Fullscreen */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setFullscreenImage("preview");
                                  setShowFullscreenPreview(true);
                                }}
                                data-testid="button-mobile-fullscreen"
                                className="h-9 w-9"
                              >
                                <Maximize className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Fullscreen</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* Share */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const url = window.location.href;
                                  navigator.clipboard.writeText(url);
                                  toast({
                                    title: "Link copied!",
                                    description: "Design link copied to clipboard",
                                  });
                                }}
                                data-testid="button-mobile-share"
                                className="h-9 w-9"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Share</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  )}

                  {/* Frame Preview */}
                  <div
                    ref={containerRef}
                    className="bg-muted/50 rounded p-2 md:p-4 flex items-center justify-center relative group"
                    style={{ minHeight: `${previewContainerHeight}px` }}
                    data-testid="preview-container"
                  >
                    {/* Desktop Fullscreen button */}
                    {!isMobile && (
                      <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setFullscreenImage("preview");
                            setShowFullscreenPreview(true);
                          }}
                          className="bg-background/90 hover:bg-background p-2 rounded-md shadow-lg hover-elevate active-elevate-2"
                          data-testid="button-expand-preview"
                        >
                          <Maximize className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                    {selectedLayout ? (
                      <CardPreviewCanvas
                        framePhotos={previewState.framePhotos}
                        selectedFrame={selectedFrame}
                        topMatColor={selectedMat}
                        bottomMatColor={matType === "double" ? selectedMatInner : selectedMat}
                        backingColor={selectedMat}
                        matType={matType}
                        layout={selectedLayout}
                        formatId={selectedFormat}
                        matBorder={MAT_BORDER}
                        manifest={previewState.manifest}
                        previewScale={previewState.previewScale}
                        previewWidth={previewState.previewWidth}
                        previewHeight={previewState.previewHeight}
                        frameFaceWidth={previewState.frameFaceWidth}
                        isMobile={previewState.isMobile}
                        cardImages={previewState.cardImages}
                        brassNameplateConfig={brassNameplateConfig}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full min-h-[400px]">
                        <div className="text-center p-8">
                          <LayoutGrid className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p className="text-lg font-medium text-muted-foreground">
                            Select a layout to preview your frame
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dimensions Box */}
                  <div
                    className="p-3 bg-muted/50 rounded-md space-y-0.5"
                    data-testid="dimensions-box"
                  >
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium">
                        Finished Size:{" "}
                        <span className="text-primary">
                          {manufacturingFrameDimensions.width.toFixed(1)}&quot; ×{" "}
                          {manufacturingFrameDimensions.height.toFixed(1)}&quot;
                        </span>
                      </p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            Outer frame dimensions including moulding. Interior dimensions
                            accommodate your graded cards with the selected mat border.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {currentFormat
                        ? `Card: ${currentFormat.cardWidth}\u0022 × ${currentFormat.cardHeight}\u0022`
                        : ""}{" "}
                      • Mat Border: {MAT_BORDER}&quot;
                    </p>
                  </div>

                  {/* Sample Image Caption */}
                  <p className="text-xs text-muted-foreground text-center">
                    Sample image. Not included with purchase.
                  </p>

                  {/* Frame Details - 3 Small Boxes */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Corner Detail */}
                    {(() => {
                      const cornerImage = selectedFrame.alternateImages?.find(
                        (img) => img.type === "corner" && img.url.includes("corner_a")
                      );
                      return cornerImage ? (
                        <button
                          onClick={() => {
                            setFullscreenImage("corner");
                            setShowFullscreenPreview(true);
                          }}
                          className="aspect-square rounded-md border overflow-hidden bg-background hover-elevate active-elevate-2"
                        >
                          <img
                            src={getStoreBaseAssetUrl(
                              cornerImage.url.startsWith("/")
                                ? cornerImage.url.slice(1)
                                : cornerImage.url
                            )}
                            alt={cornerImage.alt || `${selectedFrame.name} corner detail`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : previewState.framePhotos.cornerUrl ? (
                        <button
                          onClick={() => {
                            setFullscreenImage("corner");
                            setShowFullscreenPreview(true);
                          }}
                          className="aspect-square rounded-md border overflow-hidden bg-background hover-elevate active-elevate-2"
                        >
                          <img
                            src={previewState.framePhotos.cornerUrl}
                            alt="Frame corner detail"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : (
                        <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                          <div className="text-center p-2">
                            <p className="text-xs text-muted-foreground">Frame Corner</p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Profile View */}
                    {(() => {
                      const profileImage = selectedFrame.alternateImages?.find(
                        (img) => img.type === "profile"
                      );
                      return profileImage ? (
                        <button
                          onClick={() => {
                            setFullscreenImage("profile");
                            setShowFullscreenPreview(true);
                          }}
                          className="aspect-square rounded-md border overflow-hidden bg-background hover-elevate active-elevate-2"
                        >
                          <img
                            src={getStoreBaseAssetUrl(
                              profileImage.url.startsWith("/")
                                ? profileImage.url.slice(1)
                                : profileImage.url
                            )}
                            alt={profileImage.alt || `${selectedFrame.name} profile`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : previewState.framePhotos.profileUrl ? (
                        <button
                          onClick={() => {
                            setFullscreenImage("profile");
                            setShowFullscreenPreview(true);
                          }}
                          className="aspect-square rounded-md border overflow-hidden bg-background hover-elevate active-elevate-2"
                        >
                          <img
                            src={previewState.framePhotos.profileUrl}
                            alt="Frame profile view"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : (
                        <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                          <div className="text-center p-2">
                            <p className="text-xs text-muted-foreground">Profile</p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Random Lifestyle Photo */}
                    {randomLifestylePhoto.url ? (
                      <button
                        onClick={() => {
                          setFullscreenImage("lifestyle");
                          setShowFullscreenPreview(true);
                        }}
                        className="aspect-square rounded-md border overflow-hidden bg-background hover-elevate active-elevate-2"
                      >
                        <img
                          src={randomLifestylePhoto.url}
                          alt={randomLifestylePhoto.alt}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ) : (
                      <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                        <div className="text-center p-2">
                          <p className="text-xs text-muted-foreground">Lifestyle</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Trust Badges - Hidden on mobile */}
                  {!isMobile && <TrustBadges />}

                  {/* Copyright Disclaimer */}
                  <div className="pt-4 mt-4 border-t">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      All graded card covers displayed are for illustrative purposes only to show
                      how our frames look in use. We do not sell or reproduce any graded card
                      artwork. All characters, logos, and artwork remain the property of their
                      respective copyright holders and are used here under fair use for
                      demonstration.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: Controls - Hidden on mobile when viewing preview */}
            <div
              ref={customizationPaneRef}
              className={`${isMobile && mobileView === "preview" ? "hidden" : ""} space-y-6`}
            >
              <h2 ref={controlsHeadingRef} className="text-2xl font-bold mb-2 lg:hidden">
                Customize Your Frame
              </h2>

              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4 hidden lg:block">
                  Configure Your Card Frame
                </h2>

                {/* Consolidated Accordions for Better Mobile Flow */}
                <Accordion
                  type="multiple"
                  defaultValue={[
                    "card-format-layout",
                    "frame-style",
                    "mat-options",
                    "nameplate",
                    "glazing",
                    "hardware",
                  ]}
                  className="space-y-4"
                >
                  {/* Section 1: Card Format & Layout */}
                  <AccordionItem
                    value="card-format-layout"
                    className="border rounded-lg px-4 lg:px-6"
                  >
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-setup"
                    >
                      Card Format & Layout
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      {/* Format Selection - Hero Cards */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-base font-semibold">
                            Grading Company & Card Type
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>
                                Select your card&apos;s era to ensure proper sizing. Different eras
                                have slightly different dimensions.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        {/* Mobile: Card Format Selector */}
                        <div className="lg:hidden grid grid-cols-3 gap-2">
                          <Button
                            type="button"
                            variant={selectedFormat === "psa" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedFormat("psa")}
                            className="flex-col h-auto py-2 px-2"
                            aria-pressed={selectedFormat === "psa"}
                            data-testid="button-format-psa-mobile"
                          >
                            <span className="text-xs font-semibold leading-tight">PSA</span>
                            <span className="text-[0.6rem] opacity-70">3&quot; × 5.25&quot;</span>
                          </Button>
                          <Button
                            type="button"
                            variant={selectedFormat === "sgc-cgc-bgs" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedFormat("sgc-cgc-bgs")}
                            className="flex-col h-auto py-2 px-2"
                            aria-pressed={selectedFormat === "sgc-cgc-bgs"}
                            data-testid="button-format-sgc-mobile"
                          >
                            <span className="text-xs font-semibold leading-tight text-center">
                              SGC | CGC | BGS
                            </span>
                            <span className="text-[0.6rem] opacity-70">
                              3.25&quot; × 5.375&quot;
                            </span>
                          </Button>
                          <Button
                            type="button"
                            variant={selectedFormat === "psa-pack-slabs" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedFormat("psa-pack-slabs")}
                            className="flex-col h-auto py-2 px-2"
                            aria-pressed={selectedFormat === "psa-pack-slabs"}
                            data-testid="button-format-pack-slabs-mobile"
                          >
                            <span className="text-xs font-semibold leading-tight">Pack Slabs</span>
                            <span className="text-[0.6rem] opacity-70">4.4&quot; × 7.4&quot;</span>
                          </Button>
                        </div>

                        {/* Desktop: Card Format Selection */}
                        <div className="hidden lg:grid grid-cols-1 gap-3">
                          {/* PSA Format */}
                          <button
                            onClick={() => setSelectedFormat("psa")}
                            className={`text-left p-4 rounded-lg border-2 hover-elevate active-elevate-2 ${
                              selectedFormat === "psa"
                                ? "border-primary bg-primary/5"
                                : "border-border bg-card"
                            }`}
                            data-testid="button-format-psa"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold flex items-center gap-2">
                                  <Shield className="w-4 h-4" />
                                  PSA Graded Card Frames
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Standard PSA graded card frames
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  3.0&quot; × 5.25&quot; × 0.3&quot; depth
                                </p>
                              </div>
                              <Badge variant="default" className="text-xs">
                                Most Popular
                              </Badge>
                            </div>
                          </button>

                          {/* SGC/CGC/BGS Format */}
                          <button
                            onClick={() => setSelectedFormat("sgc-cgc-bgs")}
                            className={`text-left p-4 rounded-lg border-2 hover-elevate active-elevate-2 ${
                              selectedFormat === "sgc-cgc-bgs"
                                ? "border-primary bg-primary/5"
                                : "border-border bg-card"
                            }`}
                            data-testid="button-format-sgc"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold flex items-center gap-2">
                                  <Award className="w-4 h-4" />
                                  SGC | CGC | BGS Graded Card Frames
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  SGC, CGC, and BGS graded card frames
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  3.25&quot; × 5.375&quot; × 0.3&quot; depth
                                </p>
                              </div>
                            </div>
                          </button>

                          {/* PSA Pack Slab Frames Format */}
                          <button
                            onClick={() => setSelectedFormat("psa-pack-slabs")}
                            className={`text-left p-4 rounded-lg border-2 hover-elevate active-elevate-2 ${
                              selectedFormat === "psa-pack-slabs"
                                ? "border-primary bg-primary/5"
                                : "border-border bg-card"
                            }`}
                            data-testid="button-format-pack-slabs"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold flex items-center gap-2">
                                  <Package className="w-4 h-4" />
                                  PSA Pack Slab Frames
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Graded wax packs (Garbage Pail Kids, etc.)
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  4.4&quot; × 7.4&quot; × 0.5&quot; depth
                                </p>
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>

                      <Separator />

                      {/* Quick presets */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applyPreset("signature")}
                          data-testid="preset-signature"
                        >
                          Signature Wall
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applyPreset("vault")}
                          data-testid="preset-vault"
                        >
                          Vault Preservation
                        </Button>
                      </div>

                      <Separator />

                      {/* Layout Selection */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-base font-semibold">Layout</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>
                                Choose how many cards to display in your frame. Single card layouts
                                are most popular for showcasing valuable issues.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Choose how many cards to display
                        </p>
                        <CardLayoutGallery
                          selectedLayout={selectedLayout}
                          onLayoutChange={setSelectedLayout}
                          formatId={selectedFormat}
                          matBorder={MAT_BORDER}
                          brassPlaqueEnabled={brassNameplateConfig.enabled}
                          compact={isMobile}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 2: Frame Style */}
                  <AccordionItem value="frame-style" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-frame-style"
                    >
                      Frame Style
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="mb-3 p-2.5 bg-muted/50 rounded-md text-xs text-muted-foreground">
                        <p>
                          <strong className="text-foreground">Shadowbox Depth:</strong> How deep the
                          frame is
                        </p>
                        <p className="mt-1">
                          <strong className="text-foreground">Moulding Width:</strong> The width of
                          the frame
                        </p>
                      </div>
                      <div className="lg:max-h-[400px] lg:overflow-y-auto lg:pr-2">
                        <div className="grid grid-cols-2 gap-2">
                          {shadowboxFrames.map((frame) => (
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

                  {/* Section 3: Mat Color Options */}
                  <AccordionItem value="mat-options" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-mat-options"
                    >
                      Mat Color Options
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="space-y-4">
                        {/* Mat Type Selection */}
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

                        {/* Bottom Weighted Matting */}
                        <BottomWeightedMatting
                          checked={bottomWeighted}
                          onCheckedChange={setBottomWeighted}
                        />

                        {/* Top Mat Color */}
                        <div className="space-y-3">
                          {matType === "double" ? (
                            <Label className="text-base font-semibold">
                              Top Mat Color: {selectedMat.name}
                            </Label>
                          ) : (
                            <Label>Mat Color: {selectedMat.name}</Label>
                          )}

                          <ColorSwatchesWithSeparator
                            standardColors={standardMats}
                            premiumColors={premiumMats}
                            selectedId={selectedMat.id}
                            onSelect={setSelectedMat}
                            testIdPrefix="mat"
                          />
                        </div>

                        {/* Bottom Mat Color (only for double mat) */}
                        {matType === "double" && (
                          <>
                            <Separator className="my-6" />
                            <div className="space-y-3">
                              <Label className="text-base font-semibold">
                                Bottom Mat Color: {selectedMatInner.name}
                              </Label>

                              <ColorSwatchesWithSeparator
                                standardColors={standardMats}
                                premiumColors={premiumMats}
                                selectedId={selectedMatInner.id}
                                onSelect={setSelectedMatInner}
                                testIdPrefix="bottom-mat"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 4: Brass Nameplate */}
                  <AccordionItem value="nameplate" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-nameplate"
                    >
                      Brass Nameplate
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <BrassNameplateSection
                        config={brassNameplateConfig}
                        onChange={setBrassNameplateConfig}
                        embedded={true}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 5: Glazing Type */}
                  <AccordionItem value="glazing" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-glazing"
                    >
                      Glazing Type
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <RadioGroup
                        value={selectedGlass.id}
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

                  {/* Section 6: Hanging Hardware */}
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
                        frameWidth={manufacturingFrameDimensions.width}
                        frameHeight={manufacturingFrameDimensions.height}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Desktop Pricing Sidebar - Standardized PriceBox */}
                <PriceBox
                  totalPrice={pricing.total}
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  onAddToCart={handleAddToCart}
                  onCopyLink={handleShare}
                  priceItems={priceItems}
                  testIdPrefix=""
                />
              </Card>
            </div>
          </div>

          {/* Floating Toggle Button (Mobile Only) - CSS visibility pattern */}
          {!embedded && (
            <Button
              size="lg"
              className={`fixed bottom-20 right-6 z-[60] lg:hidden shadow-lg rounded-full h-14 px-6 ${
                showMobileBar ? "visible" : "invisible pointer-events-none"
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
          )}

          {/* Share Dialog */}
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Shareable Link</Label>
                  <div className="flex gap-2 mt-2">
                    <Input readOnly value={window.location.href} className="flex-1" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast({
                          title: "Link copied!",
                          description: "Share this link to show your configuration",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Card Lifestyle Carousel */}
          <div className="mt-12">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Card Display Inspiration</h2>
              <p className="text-muted-foreground">
                Browse real customer frames showcasing graded cards and graded slabs
              </p>
            </div>
            <GradedCardLifestyleCarousel
              onImageClick={(url, alt) => {
                setFullscreenLifestyleUrl(url);
                setFullscreenLifestyleAlt(alt);
                setFullscreenImage("lifestyle");
                setShowFullscreenPreview(true);
              }}
            />
          </div>

          {/* Why Choose Section */}
          <section className="mt-16 py-12 border-t bg-muted/20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  Why Collectors Choose Our Graded Card Frames
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Professional shadowbox frames made for PSA, BGS, CGC, and SGC graded cards
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card rounded-lg border p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Framer&apos;s Grade Acrylic</h3>
                      <p className="text-sm text-muted-foreground">
                        Professional glazing protects your slabs from dust and damage. Safer and
                        lighter than glass.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Ruler className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Fits All Grading Companies</h3>
                      <p className="text-sm text-muted-foreground">
                        Built-in layouts for PSA, BGS, CGC, and SGC slabs. We size each opening to
                        fit your cards.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Layers className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Archival Materials</h3>
                      <p className="text-sm text-muted-foreground">
                        Mat board and backing are archival quality. Your cards stay safe for years.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Frame Shop Quality</h3>
                      <p className="text-sm text-muted-foreground">
                        Each frame is handcrafted in our shop. Real wood frames with solid
                        construction.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <LayoutGrid className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Multi-Card Layouts</h3>
                      <p className="text-sm text-muted-foreground">
                        Display 1 to 12 graded cards in one frame. Great for sets, rookies, and team
                        collections.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Tag className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Optional Nameplate</h3>
                      <p className="text-sm text-muted-foreground">
                        Add a brass nameplate with your player&apos;s name, card year, or collection
                        title.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Long-Form Content Section */}
          <section className="py-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How Graded Card Frames Work</h2>

              <div className="space-y-8 text-muted-foreground">
                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">
                    Built for Graded Slabs
                  </h3>
                  <p className="mb-3">
                    Our frames use shadowbox construction. This means the frame is deep enough to
                    hold your graded cards without pressing them against the acrylic. Each slab sits
                    in its own precision-cut opening.
                  </p>
                  <p>
                    We support all major grading companies: PSA, BGS, CGC, and SGC. Pick your
                    grading company and we size the openings to match. The slabs drop right in.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">
                    Layout Options for Every Collection
                  </h3>
                  <p className="mb-3">
                    Frame a single prized card or build a display of 12 cards. Our layouts work for
                    rookie cards, team sets, and mixed collections. Popular choices include 3-card
                    and 6-card layouts for sets.
                  </p>
                  <p>
                    Each layout shows you the final frame size so you know how it will fit on your
                    wall.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">
                    Mat Colors and Styles
                  </h3>
                  <p className="mb-3">
                    Pick from single or double matting. Double mats add a thin color border around
                    each card for extra depth. We offer black, white, and team-friendly colors.
                  </p>
                  <p>
                    Black mats are most popular. They make card colors pop and give a clean, modern
                    look.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">
                    Brass Nameplate Personalization
                  </h3>
                  <p className="mb-3">
                    Add a custom brass nameplate below your cards. Include the player&apos;s name,
                    card year, or collection title. Great for gifts or awards.
                  </p>
                  <p>
                    The nameplate uses engraved text on brushed brass. It adds a professional touch
                    to any display.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">Ready to Hang</h3>
                  <p>
                    Every frame ships with hanging hardware installed. Just unpack and hang. Your
                    cards slide into the openings from the back. No tools needed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-12 border-t bg-muted/20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Graded Card Frame Questions
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    What grading companies do your frames fit?
                  </h3>
                  <p className="text-muted-foreground">
                    Our frames fit PSA, BGS (Beckett), CGC, and SGC slabs. Pick your grading company
                    in the designer and we size each opening to fit.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    How many cards can I put in one frame?
                  </h3>
                  <p className="text-muted-foreground">
                    You can frame 1 to 12 graded cards. We offer layouts for single cards, pairs,
                    rows of 3, grids of 4 or 6, and larger displays up to 12 cards.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Do the cards touch the acrylic?</h3>
                  <p className="text-muted-foreground">
                    No. Our shadowbox frames have depth. The mat board holds your slabs away from
                    the acrylic. This protects the cards and gives the display dimension.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Can I mix different grading companies in one frame?
                  </h3>
                  <p className="text-muted-foreground">
                    Each frame is sized for one grading company since slab sizes differ. For mixed
                    collections, we recommend separate frames for each grading company.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">How do I install my cards?</h3>
                  <p className="text-muted-foreground">
                    Open the back of the frame and slide your slabs into each opening. The openings
                    are cut slightly larger than your slabs so they drop in easily. No tools or tape
                    needed.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">What frame materials do you use?</h3>
                  <p className="text-muted-foreground">
                    Frames are solid wood. Mat boards and backing are archival quality. Glazing is
                    framer&apos;s grade acrylic - lighter and safer than glass.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Can I add a nameplate?</h3>
                  <p className="text-muted-foreground">
                    Yes. Our brass nameplate option lets you add up to three lines of text. Include
                    the player&apos;s name, card year, or any custom message.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Fullscreen Dialog */}
        <Dialog open={showFullscreenPreview} onOpenChange={setShowFullscreenPreview}>
          <DialogContent className="max-w-[100vw] w-screen h-screen max-h-screen p-0 border-0">
            <DialogHeader className="sr-only">
              <DialogTitle>
                {fullscreenImage === "preview" && "Frame Preview"}
                {fullscreenImage === "corner" && "Frame Corner Detail"}
                {fullscreenImage === "profile" && "Frame Profile View"}
                {fullscreenImage === "lifestyle" && "Lifestyle Photo"}
              </DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-full flex items-center justify-center bg-white">
              {fullscreenImage === "preview" && (
                <div className="w-full h-full flex items-center justify-center p-8">
                  <div style={{ filter: "drop-shadow(0 8px 32px rgba(0, 0, 0, 0.15))" }}>
                    <CardPreviewCanvas
                      framePhotos={fullscreenPreviewState.framePhotos}
                      selectedFrame={selectedFrame}
                      topMatColor={selectedMat}
                      bottomMatColor={matType === "double" ? selectedMatInner : selectedMat}
                      backingColor={selectedMat}
                      matType={matType}
                      layout={selectedLayout}
                      formatId={selectedFormat}
                      matBorder={MAT_BORDER}
                      manifest={fullscreenPreviewState.manifest}
                      previewScale={fullscreenPreviewState.previewScale}
                      previewWidth={fullscreenPreviewState.previewWidth}
                      previewHeight={fullscreenPreviewState.previewHeight}
                      frameFaceWidth={fullscreenPreviewState.frameFaceWidth}
                      isMobile={fullscreenPreviewState.isMobile}
                      cardImages={fullscreenPreviewState.cardImages}
                      brassNameplateConfig={brassNameplateConfig}
                    />
                  </div>
                </div>
              )}
              {fullscreenImage === "corner" &&
                (() => {
                  const cornerImage = selectedFrame.alternateImages?.find(
                    (img) => img.type === "corner" && img.url.includes("corner_a")
                  );
                  const imageUrl = cornerImage?.url || previewState.framePhotos.cornerUrl;
                  const resolvedUrl = imageUrl?.startsWith("http")
                    ? imageUrl
                    : imageUrl
                      ? getStoreBaseAssetUrl(
                          imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl
                        )
                      : undefined;
                  return resolvedUrl ? (
                    <img
                      src={resolvedUrl}
                      alt="Frame corner detail"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : null;
                })()}
              {fullscreenImage === "profile" &&
                (() => {
                  const profileImage = selectedFrame.alternateImages?.find(
                    (img) => img.type === "profile"
                  );
                  const imageUrl = profileImage?.url || previewState.framePhotos.profileUrl;
                  const resolvedUrl = imageUrl?.startsWith("http")
                    ? imageUrl
                    : imageUrl
                      ? getStoreBaseAssetUrl(
                          imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl
                        )
                      : undefined;
                  return resolvedUrl ? (
                    <img
                      src={resolvedUrl}
                      alt="Frame profile view"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : null;
                })()}
              {fullscreenImage === "lifestyle" && (
                <img
                  src={fullscreenLifestyleUrl || randomLifestylePhoto.url}
                  alt={fullscreenLifestyleAlt || randomLifestylePhoto.alt}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Mobile Sticky Action Bar - Inline Implementation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg lg:hidden">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-lg font-bold" data-testid="card-mobile-total-price">
                    ${(pricing.total * quantity).toFixed(2)}
                  </span>
                  {quantity > 1 && (
                    <span className="text-xs text-muted-foreground">
                      ${pricing.total.toFixed(2)} each
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <QuantitySelector
                    value={quantity}
                    onChange={setQuantity}
                    className="w-14 h-7 text-xs text-center p-0"
                    testId="card-mobile-quantity"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    className="h-11 w-11"
                    data-testid="card-mobile-copy-link"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 text-xs min-w-0 min-h-11"
                    data-testid="card-mobile-add-to-cart"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1.5" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
