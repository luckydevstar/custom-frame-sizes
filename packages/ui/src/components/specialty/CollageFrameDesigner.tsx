"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Copy, Maximize, X, Eye, Settings, Info, Upload, Pencil } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { TermsOfServiceModal } from "../shared/TermsOfServiceModal";
import { ImageEditor } from "../shared/ImageEditor";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { QuantitySelector } from "../ui/quantity-selector";
import { PriceBox } from "../ui/PriceBox";
import type { PriceLineItem } from "../ui/PriceBox";
import { useToast } from "../../hooks/use-toast";
import {
  useIsMobile,
  useMobileViewToggle,
  useIntelligentPreviewSizing,
  getFramesByCategory,
  getGlassTypes,
  getSharedAssetUrl,
  COLLAGE_LAYOUTS,
  PLAQUE_FRAME_EXTENSION,
  PHOTO_SIZES,
  DEFAULT_FRAME_MOLDING_WIDTH,
  type CollageLayoutType,
  generateCollagePrintFile,
  uploadCollagePrintFile,
  useCollagePricing,
} from "@framecraft/core";
import type { FrameStyle } from "@framecraft/types";
import type { BrassNameplateConfig } from "@framecraft/types";
import { ALL_MATS, getMatById, isMatAvailableForSize, type Mat } from "@framecraft/config";
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import type { CollagePrintConfig, CollagePrintResult } from "@framecraft/core";
import { CollagePreviewCanvas } from "./CollagePreviewCanvas";
import { CollageLayoutGallery } from "./CollageLayoutGallery";
import { TrustBadges } from "../marketing/TrustBadges";
import { HangingHardwareSection, BottomWeightedMatting, BOTTOM_WEIGHTED_EXTRA } from "./shared";

const pictureFrames = getFramesByCategory("picture");
const allFrames = pictureFrames;
const allGlassTypes = getGlassTypes();
const glassTypes = allGlassTypes.filter((g) => g.id === "standard" || g.id === "non-glare");

// Collage-specific lifestyle images (NOT frame-specific) - paths match shared_assets/collage/lifestyle/
const COLLAGE_LIFESTYLE_IMAGES = [
  {
    url: getSharedAssetUrl("collage/lifestyle/collage-lifestyle-1.jpg"),
    alt: "Family holding a photo collage frame outdoors",
  },
  {
    url: getSharedAssetUrl("collage/lifestyle/collage-lifestyle-2.jpg"),
    alt: "Woman holding a three-photo collage frame",
  },
  {
    url: getSharedAssetUrl("collage/lifestyle/collage-lifestyle-3.jpg"),
    alt: "Couple admiring photo collage on living room wall",
  },
  {
    url: getSharedAssetUrl("collage/lifestyle/collage-lifestyle-4.jpg"),
    alt: "Woman holding a two-photo collage frame",
  },
  {
    url: getSharedAssetUrl("collage/lifestyle/collage-lifestyle-5.jpg"),
    alt: "Family holding a six-photo collage frame",
  },
  {
    url: getSharedAssetUrl("collage/lifestyle/collage-lifestyle-6.jpg"),
    alt: "Woman holding a vertical six-photo collage frame",
  },
  {
    url: getSharedAssetUrl("collage/lifestyle/collage-lifestyle-7.jpg"),
    alt: "Woman holding a two-photo collage frame with nature scenes",
  },
  {
    url: getSharedAssetUrl("collage/lifestyle/collage-lifestyle-8.jpg"),
    alt: "Family holding a large nine-photo collage frame",
  },
  {
    url: getSharedAssetUrl("collage/lifestyle/collage-lifestyle-9.jpg"),
    alt: "Teen holding a four-photo collage frame",
  },
  {
    url: getSharedAssetUrl("collage/lifestyle/collage-lifestyle-10.jpg"),
    alt: "Photo collage frame displayed in bright living room",
  },
];

interface CollageFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
}

export function CollageFrameDesigner({
  defaultFrameId,
  embedded = false,
}: CollageFrameDesignerProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);

  // Initialize frame selection - Default to Black Wood Frame
  const initialFrame = useMemo(() => {
    if (defaultFrameId) {
      const frame = allFrames.find((f) => f.id === defaultFrameId || f.sku === defaultFrameId);
      return frame || allFrames[0];
    }
    const frameParam = urlParams.get("frame");
    if (frameParam) {
      const frame = allFrames.find((f) => f.id === frameParam || f.sku === frameParam);
      return frame || allFrames[0];
    }
    // Default to Black Wood Frame
    const defaultFrame = allFrames.find((f) => f.id === "black-wood");
    return defaultFrame || allFrames[0];
  }, [defaultFrameId, urlParams]);

  const [selectedLayout, setSelectedLayout] = useState<CollageLayoutType>(() => {
    const urlLayout = urlParams.get("layout") as CollageLayoutType;
    if (urlLayout && COLLAGE_LAYOUTS.find((l) => l.id === urlLayout)) {
      return urlLayout;
    }
    return "2-grid";
  });

  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(
    () => initialFrame ?? allFrames[0]!
  );

  const [selectedMat, setSelectedMat] = useState<Mat>(() => {
    const urlMat = urlParams.get("mat");
    return (urlMat ? getMatById(urlMat) : getMatById("mat-1")) ?? ALL_MATS[0]!;
  });

  const [selectedMatInner, setSelectedMatInner] = useState<Mat>(() => {
    const urlMatInner = urlParams.get("matInner");
    return (urlMatInner ? getMatById(urlMatInner) : getMatById("mat-2")) ?? ALL_MATS[1]!;
  });

  const [matType, setMatType] = useState<"single" | "double">(() => {
    const urlMatType = urlParams.get("matType");
    return urlMatType === "single" || urlMatType === "double" ? urlMatType : "single";
  });

  const [bottomWeighted, setBottomWeighted] = useState(() => {
    return urlParams.get("bottomWeighted") === "true";
  });

  const MAT_REVEAL = 0.25;

  const [selectedGlass, setSelectedGlass] = useState(() => {
    const urlGlass = urlParams.get("glass");
    return (urlGlass ? glassTypes.find((g) => g.id === urlGlass) : null) ?? glassTypes[0]!;
  });

  const [hardware, setHardware] = useState<"standard" | "security">(() => {
    return (urlParams.get("hardware") as "standard" | "security") || "standard";
  });

  const [brassNameplateConfig, setBrassNameplateConfig] = useState<BrassNameplateConfig>(() => {
    const defaultConfig: BrassNameplateConfig = {
      enabled: false,
      line1: "",
      line2: "",
      line3: "",
      font: "georgia",
      color: "brass-black",
      includeFlag: false,
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
        includeFlag: false,
      };
    } catch {
      return defaultConfig;
    }
  });

  const [_showShareDialog, setShowShareDialog] = useState(false);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<
    "preview" | "corner" | "profile" | "lifestyle"
  >("preview");
  const [fullscreenLifestyleUrl, setFullscreenLifestyleUrl] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [pricingSidebarExpanded, setPricingSidebarExpanded] = useState(false);

  const [framePhotos, setFramePhotos] = useState<{
    cornerUrl?: string;
    profileUrl?: string;
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  }>({});

  // Initialize with first lifestyle image so correct URL shows immediately (path: collage/lifestyle/ for asset rewrite)
  const [randomLifestylePhoto, setRandomLifestylePhoto] = useState<{ url: string; alt: string }>(
    () => COLLAGE_LIFESTYLE_IMAGES[0] ?? { url: "", alt: "Photo collage lifestyle photo" }
  );

  // Random seed for collage insert images - changes on each page load
  const [collageInsertSeed] = useState(() => Math.floor(Math.random() * 10000));

  // Print & Frame state
  const [serviceType, setServiceType] = useState<"frame-only" | "print-and-frame">(() => {
    const urlService = urlParams.get("service");
    return urlService === "print-and-frame" ? "print-and-frame" : "frame-only";
  });
  const [copyrightAgreed, setCopyrightAgreed] = useState(false);
  const [userPhotos, setUserPhotos] = useState<Record<number, string>>({});
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [pendingEditImage, setPendingEditImage] = useState<string | null>(null);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Per-opening source tracking: 'upload' = we print it, 'byo' = customer brings their own print
  const [openingSources, setOpeningSources] = useState<Record<number, "upload" | "byo">>({});

  // Print generation state
  const [isGeneratingPrint, setIsGeneratingPrint] = useState(false);
  const [_printResult, setPrintResult] = useState<CollagePrintResult | null>(null);
  const [_printFileUrl, setPrintFileUrl] = useState<string | null>(null);

  const designerSectionRef = useRef<HTMLDivElement>(null);
  const hardwareSectionRef = useRef<HTMLDivElement>(null);

  const currentLayout = useMemo(() => {
    return COLLAGE_LAYOUTS.find((l) => l.id === selectedLayout) ?? COLLAGE_LAYOUTS[0]!;
  }, [selectedLayout]);

  // Filter mats based on selected layout's frame size
  // Mats only available in 32x40 are hidden when frame exceeds that size (e.g., 11x14 "3 Wide Photos" = 49×17")
  const standardMats = useMemo(() => {
    return ALL_MATS.filter(
      (m) =>
        !m.isPremium &&
        m.lineNumber !== 28 &&
        isMatAvailableForSize(m, currentLayout.frameWidth, currentLayout.frameHeight)
    );
  }, [currentLayout.frameWidth, currentLayout.frameHeight]);

  const premiumMats = useMemo(() => {
    return ALL_MATS.filter(
      (m) =>
        m.isPremium && isMatAvailableForSize(m, currentLayout.frameWidth, currentLayout.frameHeight)
    );
  }, [currentLayout.frameWidth, currentLayout.frameHeight]);

  // Reset mat selection if current mat is no longer available for the new layout size
  useEffect(() => {
    const isMatAvailable = isMatAvailableForSize(
      selectedMat,
      currentLayout.frameWidth,
      currentLayout.frameHeight
    );
    if (!isMatAvailable && standardMats.length > 0) {
      setSelectedMat(standardMats[0]!);
    }
  }, [currentLayout.frameWidth, currentLayout.frameHeight, selectedMat, standardMats]);

  useEffect(() => {
    const isInnerMatAvailable = isMatAvailableForSize(
      selectedMatInner,
      currentLayout.frameWidth,
      currentLayout.frameHeight
    );
    if (!isInnerMatAvailable && standardMats.length > 0) {
      setSelectedMatInner(standardMats[0]!);
    }
  }, [currentLayout.frameWidth, currentLayout.frameHeight, selectedMatInner, standardMats]);

  useEffect(() => {
    async function fetchFramePhotos() {
      try {
        const response = await fetch(`/api/frames/${selectedFrame.sku}/photos`);
        if (response.ok) {
          const photoSet = await response.json();
          setFramePhotos(photoSet);
        }
      } catch (error) {
        console.error("Failed to fetch frame photos:", error);
      }
    }

    fetchFramePhotos();
  }, [selectedFrame.sku]);

  // Pick a random collage lifestyle image on page load or frame change
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * COLLAGE_LIFESTYLE_IMAGES.length);
    setRandomLifestylePhoto(COLLAGE_LIFESTYLE_IMAGES[randomIndex] ?? COLLAGE_LIFESTYLE_IMAGES[0]!);
  }, [selectedFrame.sku]);

  const bottomWeightedExtra = bottomWeighted ? BOTTOM_WEIGHTED_EXTRA : 0;

  const handleLayoutChange = useCallback((newLayout: CollageLayoutType) => {
    setSelectedLayout(newLayout);
  }, []);

  // Photo upload handlers for Print & Frame
  const handlePhotoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || activePhotoIndex === null) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setPendingEditImage(dataUrl);
        setShowImageEditor(true);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [activePhotoIndex]
  );

  const handleImageEditorSave = useCallback(
    (editedImage: Blob) => {
      if (activePhotoIndex === null) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setUserPhotos((prev) => ({ ...prev, [activePhotoIndex]: dataUrl }));
      };
      reader.readAsDataURL(editedImage);

      setShowImageEditor(false);
      setPendingEditImage(null);
      setActivePhotoIndex(null);
    },
    [activePhotoIndex]
  );

  const handleImageEditorCancel = useCallback(() => {
    setShowImageEditor(false);
    setPendingEditImage(null);
    setActivePhotoIndex(null);
  }, []);

  const triggerPhotoUpload = useCallback((index: number) => {
    setActivePhotoIndex(index);
    fileInputRef.current?.click();
  }, []);

  const handleEditPhoto = useCallback(
    (index: number) => {
      const photo = userPhotos[index];
      if (photo) {
        setActivePhotoIndex(index);
        setPendingEditImage(photo);
        setShowImageEditor(true);
      }
    },
    [userPhotos]
  );

  const handleRemovePhoto = useCallback((index: number) => {
    setUserPhotos((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  }, []);

  // Count how many openings need prints from us vs bring-your-own
  const printCount = useMemo(() => {
    if (serviceType === "frame-only") return 0;
    let count = 0;
    const openingCount = currentLayout.openingCount;
    for (let i = 0; i < openingCount; i++) {
      // Count as print if: has uploaded photo AND is not marked as BYO
      if (userPhotos[i] && openingSources[i] !== "byo") {
        count++;
      }
    }
    return count;
  }, [serviceType, currentLayout.openingCount, userPhotos, openingSources]);

  const byoCount = useMemo(() => {
    let count = 0;
    const openingCount = currentLayout.openingCount;
    for (let i = 0; i < openingCount; i++) {
      if (openingSources[i] === "byo") {
        count++;
      }
    }
    return count;
  }, [currentLayout.openingCount, openingSources]);

  // Check if all openings are accounted for (either uploaded or marked as BYO)
  const allOpeningsReady = useMemo(() => {
    if (serviceType === "frame-only") return true;
    const openingCount = currentLayout.openingCount;
    for (let i = 0; i < openingCount; i++) {
      // Opening is ready if: it has uploaded photo OR is marked as BYO
      if (!userPhotos[i] && openingSources[i] !== "byo") return false;
    }
    return true;
  }, [serviceType, currentLayout.openingCount, userPhotos, openingSources]);

  // Copyright agreement only needed if there are prints to make
  const canAddToCart =
    serviceType === "frame-only" || (allOpeningsReady && (printCount === 0 || copyrightAgreed));

  const { containerRef, previewContainerHeight, containerWidth } = useIntelligentPreviewSizing({
    frameWidth: currentLayout.frameWidth,
    frameHeight: currentLayout.frameHeight + bottomWeightedExtra,
    plaqueEnabled: brassNameplateConfig.enabled,
    plaqueExtension: PLAQUE_FRAME_EXTENSION,
    isMobile,
    minHeightMobile: 400,
    maxHeightMobile: 600,
    minHeightDesktop: 400,
  });

  const pricing = useCollagePricing({
    frame: selectedFrame,
    layoutId: selectedLayout,
    matType,
    glass: selectedGlass,
    hardware,
    brassPlaqueEnabled: brassNameplateConfig.enabled,
    printCount,
  });

  useEffect(() => {
    if (isMobile || !hardwareSectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setPricingSidebarExpanded(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-100px 0px 0px 0px" }
    );

    observer.observe(hardwareSectionRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();

    params.set("layout", selectedLayout);
    params.set("frame", selectedFrame.id);
    params.set("mat", selectedMat.id);
    params.set("matInner", selectedMatInner.id);
    params.set("matType", matType);
    params.set("glass", selectedGlass.id);
    params.set("hardware", hardware);

    if (serviceType === "print-and-frame") {
      params.set("service", "print-and-frame");
    }

    if (bottomWeighted) {
      params.set("bottomWeighted", "true");
    }

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
    selectedLayout,
    selectedFrame,
    selectedMat,
    selectedMatInner,
    matType,
    bottomWeighted,
    selectedGlass,
    hardware,
    serviceType,
    brassNameplateConfig,
  ]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  const handleShare = useCallback(() => {
    const params = new URLSearchParams();
    params.set("layout", selectedLayout);
    params.set("frame", selectedFrame.id);
    params.set("mat", selectedMat.id);
    if (matType === "double") params.set("matInner", selectedMatInner.id);
    params.set("matType", matType);
    params.set("glass", selectedGlass.id);
    params.set("hardware", hardware);
    if (brassNameplateConfig.enabled) {
      params.set("nameplateEnabled", "true");
      if (brassNameplateConfig.line1) params.set("nameplateLine1", brassNameplateConfig.line1);
      if (brassNameplateConfig.line2) params.set("nameplateLine2", brassNameplateConfig.line2);
      if (brassNameplateConfig.line3) params.set("nameplateLine3", brassNameplateConfig.line3);
      params.set("nameplateFont", brassNameplateConfig.font);
      params.set("nameplateColor", brassNameplateConfig.color);
    }

    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url);

    toast({
      title: "Link copied!",
      description: "Design link copied to clipboard",
    });

    setShowShareDialog(false);
  }, [
    selectedLayout,
    selectedFrame,
    selectedMat,
    selectedMatInner,
    matType,
    selectedGlass,
    hardware,
    brassNameplateConfig,
    toast,
  ]);

  const handleAddToCart = useCallback(async () => {
    // If Print & Frame selected and we have photos to print, generate print file first
    if (serviceType === "print-and-frame" && printCount > 0) {
      setIsGeneratingPrint(true);

      toast({
        title: "Generating Print File",
        description: "Creating your 300 DPI print-ready composite file...",
      });

      try {
        // Calculate actual frame height including bottom-weighted extra
        const actualFrameHeight = currentLayout.frameHeight + bottomWeightedExtra;

        // Build print config
        const printConfig: CollagePrintConfig = {
          frameWidth: currentLayout.frameWidth,
          frameHeight: actualFrameHeight,
          frameMoldingWidth: DEFAULT_FRAME_MOLDING_WIDTH,
          openings: currentLayout.openings.map((o) => ({
            x: o.x,
            y: o.y,
            width: o.width,
            height: o.height,
          })),
          userPhotos,
          openingSources,
        };

        const result = await generateCollagePrintFile(printConfig);
        setPrintResult(result);

        // Calculate interior size for display
        const interiorW = result.interiorWidthInches.toFixed(1);
        const interiorH = result.interiorHeightInches.toFixed(1);
        const fileSizeMB = (result.blob.size / 1024 / 1024).toFixed(1);

        toast({
          title: "Print File Generated!",
          description: `${interiorW}" × ${interiorH}" at 300 DPI (${fileSizeMB} MB) - ${result.printCount} photo${result.printCount !== 1 ? "s" : ""} printed${result.byoCount > 0 ? `, ${result.byoCount} BYO space${result.byoCount !== 1 ? "s" : ""}` : ""}`,
        });

        // Upload print file to object storage for production retrieval
        toast({
          title: "Uploading Print File",
          description: "Saving your print file for production...",
        });

        let uploadedUrl: string | null = null;
        try {
          uploadedUrl = await uploadCollagePrintFile(result.blob, result.filename);
        } catch (uploadError) {
          setIsGeneratingPrint(false);
          console.error("[Collage Print] Upload failed:", uploadError);
          toast({
            title: "Upload Failed",
            description: "Could not save your print file. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (!uploadedUrl) {
          setIsGeneratingPrint(false);
          toast({
            title: "Upload Failed",
            description: "Could not save your print file. Please try again.",
            variant: "destructive",
          });
          return;
        }

        setPrintFileUrl(uploadedUrl);

        setIsGeneratingPrint(false);

        // Success - add to cart
        toast({
          title: "Added to cart!",
          description: `${quantity}× Photo Collage Frame - ${currentLayout.name} (Print & Frame)`,
        });
      } catch (error) {
        setIsGeneratingPrint(false);
        console.error("Print file generation failed:", error);
        toast({
          title: "Print Generation Failed",
          description: "There was an error generating the print file. Please try again.",
          variant: "destructive",
        });
        return;
      }
    } else {
      // Frame only or BYO-only
      toast({
        title: "Added to cart!",
        description: `${quantity}× Photo Collage Frame - ${currentLayout.name}`,
      });
    }
  }, [
    quantity,
    currentLayout,
    serviceType,
    printCount,
    userPhotos,
    openingSources,
    bottomWeightedExtra,
    toast,
  ]);

  const priceItems: PriceLineItem[] = useMemo(() => {
    const items: PriceLineItem[] = [];

    const displayFrameHeight = currentLayout.frameHeight + bottomWeightedExtra;
    items.push({
      label: `${currentLayout.name} Frame & Glazing (${currentLayout.frameWidth}" × ${displayFrameHeight}")`,
      amount: pricing.framePrice + pricing.glassPrice,
      testId: "price-frame",
    });

    if (pricing.matPrice > 0) {
      const totalOpenings = currentLayout.openingCount;
      const additionalOpenings = totalOpenings - 1;
      const matLabel = matType === "double" ? "Double mat" : "Single mat";
      items.push({
        label: `Mat Cutting - ${matLabel} (${additionalOpenings} additional opening${additionalOpenings > 1 ? "s" : ""})`,
        amount: pricing.matPrice,
        testId: "price-mat",
      });
    }

    if (selectedGlass?.id === "non-glare") {
      items.push({
        label: "Non-Glare Acrylic Upgrade",
        amount: 0,
        isIncluded: true,
        testId: "price-glass",
      });
    }

    if (hardware === "security") {
      items.push({
        label: "Security Hardware",
        amount: pricing.hardwarePrice,
        testId: "price-hardware",
      });
    } else {
      items.push({
        label: "Standard Hardware",
        amount: 0,
        isIncluded: true,
        testId: "price-hardware",
      });
    }

    if (brassNameplateConfig.enabled) {
      items.push({
        label: "Engraved Brass Nameplate",
        amount: pricing.nameplatePrice,
        testId: "price-nameplate",
      });
    }

    if (pricing.printPrice > 0) {
      items.push({
        label: `Photo Printing (${printCount} print${printCount !== 1 ? "s" : ""})`,
        amount: pricing.printPrice,
        testId: "price-prints",
      });
    }

    return items;
  }, [
    pricing,
    currentLayout,
    matType,
    selectedGlass,
    hardware,
    brassNameplateConfig.enabled,
    bottomWeightedExtra,
    printCount,
  ]);

  const openFullscreen = useCallback(
    (imageType: "preview" | "corner" | "profile" | "lifestyle", lifestyleUrl?: string) => {
      setFullscreenImage(imageType);
      if (imageType === "lifestyle" && lifestyleUrl) {
        setFullscreenLifestyleUrl(lifestyleUrl);
      }
      setShowFullscreenPreview(true);
    },
    []
  );

  return (
    <TooltipProvider>
      <div
        className="bg-gradient-to-b from-background to-muted/30 pb-24 lg:pb-0"
        ref={designerSectionRef}
      >
        {isMobile && embedded && (
          <div className="lg:hidden border-b bg-card/50 sticky top-0 z-40">
            <div className="px-4 py-3">
              <h1 className="text-lg font-bold">Photo Collage Frame Designer</h1>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div
              className={`${isMobile && mobileView === "controls" ? "hidden" : ""} lg:sticky lg:top-[132px] lg:self-start`}
            >
              <Card ref={previewCardRef} className="p-6" data-testid="card-preview">
                <div className="space-y-4">
                  <div
                    ref={containerRef}
                    className="bg-muted/50 rounded p-2 md:p-4 flex items-center justify-center relative group"
                    style={{ minHeight: `${previewContainerHeight}px` }}
                    data-testid="preview-container"
                  >
                    {!isMobile && (
                      <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openFullscreen("preview")}
                          className="bg-background/90 hover:bg-background p-2 rounded-md shadow-lg hover-elevate active-elevate-2"
                          data-testid="button-expand-preview"
                        >
                          <Maximize className="h-5 w-5" />
                        </button>
                      </div>
                    )}

                    <CollagePreviewCanvas
                      framePhotos={framePhotos}
                      selectedFrame={selectedFrame}
                      topMatColor={matType === "double" ? selectedMat : selectedMat}
                      bottomMatColor={matType === "double" ? selectedMatInner : selectedMat}
                      matType={matType}
                      matReveal={MAT_REVEAL}
                      layoutId={selectedLayout}
                      layout={currentLayout}
                      containerWidth={containerWidth}
                      containerHeight={previewContainerHeight}
                      brassNameplateConfig={brassNameplateConfig}
                      isMobile={isMobile}
                      randomSeed={collageInsertSeed}
                      bottomWeighted={bottomWeighted}
                      userPhotos={userPhotos}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground/60 text-center mt-2">
                    {Object.keys(userPhotos).length > 0
                      ? "Your uploaded photos shown in preview."
                      : "Sample image. Not included with purchase."}
                  </p>

                  {currentLayout && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          Finished Size:{" "}
                          <span className="text-primary">
                            {currentLayout.frameWidth.toFixed(2)}&quot; ×{" "}
                            {(
                              currentLayout.frameHeight +
                              bottomWeightedExtra +
                              (brassNameplateConfig.enabled ? PLAQUE_FRAME_EXTENSION : 0)
                            ).toFixed(2)}
                            &quot;
                          </span>
                        </p>
                        {selectedFrame.dimensionalDiagram && (
                          <Tooltip delayDuration={200}>
                            <TooltipTrigger asChild>
                              <button
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                data-testid="button-dimensional-diagram"
                              >
                                <Info className="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              className="p-0 border-0 bg-transparent shadow-lg"
                            >
                              <img
                                src={selectedFrame.dimensionalDiagram}
                                alt={`${selectedFrame.name} dimensional diagram`}
                                className="w-64 rounded-lg border-2 border-border bg-background"
                                data-testid="img-dimensional-diagram"
                              />
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Layout: {currentLayout.name} ({currentLayout.openingCount} photos) • Photo
                        Size:{" "}
                        {currentLayout.photoSizeLabel ||
                          PHOTO_SIZES[currentLayout.defaultPhotoSize].displayName}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    {(() => {
                      const cornerImage = selectedFrame.alternateImages?.find(
                        (img) => img.type === "corner" && img.url.includes("corner_a")
                      );
                      return cornerImage ? (
                        <button
                          onClick={() => openFullscreen("corner")}
                          className="aspect-square rounded-md border overflow-hidden bg-background hover-elevate active-elevate-2"
                          data-testid="button-view-corner"
                        >
                          <img
                            src={cornerImage.url}
                            alt={cornerImage.alt || `${selectedFrame.name} corner detail`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : framePhotos.cornerUrl ? (
                        <button
                          onClick={() => openFullscreen("corner")}
                          className="aspect-square rounded-md border overflow-hidden bg-background hover-elevate active-elevate-2"
                          data-testid="button-view-corner"
                        >
                          <img
                            src={framePhotos.cornerUrl}
                            alt="Frame corner detail"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : (
                        <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                          <p className="text-xs text-muted-foreground text-center p-2">
                            Frame Corner
                          </p>
                        </div>
                      );
                    })()}

                    {(() => {
                      const profileImage = selectedFrame.alternateImages?.find(
                        (img) => img.type === "profile"
                      );
                      return profileImage ? (
                        <button
                          onClick={() => openFullscreen("profile")}
                          className="aspect-square rounded-md border overflow-hidden bg-background hover-elevate active-elevate-2"
                          data-testid="button-view-profile"
                        >
                          <img
                            src={profileImage.url}
                            alt={profileImage.alt || `${selectedFrame.name} profile`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : framePhotos.profileUrl ? (
                        <button
                          onClick={() => openFullscreen("profile")}
                          className="aspect-square rounded-md border overflow-hidden bg-background hover-elevate active-elevate-2"
                          data-testid="button-view-profile"
                        >
                          <img
                            src={framePhotos.profileUrl}
                            alt="Frame profile view"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : (
                        <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                          <p className="text-xs text-muted-foreground text-center p-2">Profile</p>
                        </div>
                      );
                    })()}

                    {randomLifestylePhoto.url ? (
                      <button
                        onClick={() => openFullscreen("lifestyle", randomLifestylePhoto.url)}
                        className="aspect-square rounded-md border overflow-hidden bg-background hover-elevate active-elevate-2"
                        data-testid="button-view-lifestyle"
                      >
                        <img
                          src={randomLifestylePhoto.url}
                          alt={randomLifestylePhoto.alt}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ) : (
                      <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                        <p className="text-xs text-muted-foreground text-center p-2">Lifestyle</p>
                      </div>
                    )}
                  </div>

                  {!isMobile && <TrustBadges />}
                </div>
              </Card>
            </div>

            <div className={`space-y-6 ${isMobile && mobileView !== "controls" ? "hidden" : ""}`}>
              <h2 ref={controlsHeadingRef} className="text-2xl font-bold mb-2 lg:hidden">
                Customize Your Frame
              </h2>

              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4 hidden lg:block">
                  Configure Your Photo Collage Frame
                </h2>

                <Accordion
                  type="multiple"
                  defaultValue={[
                    "layout",
                    "service",
                    "frame",
                    "mats",
                    "brass-nameplate",
                    "glazing",
                    "hardware",
                  ]}
                  className="space-y-4"
                >
                  <AccordionItem value="layout" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-layout"
                    >
                      Layout Selection
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-base font-semibold">Choose Your Layout</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>Select a layout based on how many photos you want to display</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        <div className="max-h-[600px] overflow-y-auto">
                          <CollageLayoutGallery
                            selectedLayout={selectedLayout}
                            onLayoutChange={handleLayoutChange}
                            compact={isMobile}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="service" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-service"
                    >
                      Print & Frame Service
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <RadioGroup
                        value={serviceType}
                        onValueChange={(value: "frame-only" | "print-and-frame") =>
                          setServiceType(value)
                        }
                        className="grid grid-cols-2 gap-3"
                      >
                        <button
                          type="button"
                          onClick={() => setServiceType("frame-only")}
                          className={`flex items-center justify-center p-3 rounded-md border-2 cursor-pointer hover-elevate active-elevate-2 ${
                            serviceType === "frame-only"
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                          data-testid="button-service-frame-only"
                        >
                          <span className="text-sm font-medium">Frame Only</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setServiceType("print-and-frame")}
                          className={`flex items-center justify-center p-3 rounded-md border-2 cursor-pointer hover-elevate active-elevate-2 ${
                            serviceType === "print-and-frame"
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                          data-testid="button-service-print-and-frame"
                        >
                          <span className="text-sm font-medium">Print & Frame</span>
                        </button>
                      </RadioGroup>

                      <p className="text-sm text-muted-foreground">
                        {serviceType === "frame-only"
                          ? "You'll receive an empty frame. Bring your own photos to insert."
                          : "Upload your photos and we'll print them at professional quality."}
                      </p>

                      {serviceType === "print-and-frame" && (
                        <div className="space-y-4 pt-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            data-testid="input-photo-upload"
                          />

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium">Photo Openings</Label>
                              <span className="text-xs text-muted-foreground">
                                {printCount > 0 &&
                                  `${printCount} print${printCount !== 1 ? "s" : ""}`}
                                {printCount > 0 && byoCount > 0 && " + "}
                                {byoCount > 0 && `${byoCount} your own`}
                                {printCount === 0 &&
                                  byoCount === 0 &&
                                  `${currentLayout.openingCount} to assign`}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {Array.from({ length: currentLayout.openingCount }).map((_, idx) => (
                                <div key={idx} className="border rounded-lg p-2 bg-muted/20">
                                  <div className="text-xs font-medium text-center mb-2 text-muted-foreground">
                                    Opening {idx + 1}
                                  </div>

                                  {openingSources[idx] === "byo" ? (
                                    <div className="space-y-2">
                                      <div className="aspect-square border-2 border-dashed border-muted-foreground/30 rounded-md flex flex-col items-center justify-center bg-muted/50">
                                        <span className="text-xs text-muted-foreground text-center px-1">
                                          Using your own print
                                        </span>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-xs h-7"
                                        onClick={() =>
                                          setOpeningSources((prev) => {
                                            const updated = { ...prev };
                                            delete updated[idx];
                                            return updated;
                                          })
                                        }
                                        data-testid={`button-change-source-${idx}`}
                                      >
                                        Change
                                      </Button>
                                    </div>
                                  ) : userPhotos[idx] ? (
                                    <div className="space-y-2">
                                      <div className="relative aspect-square group">
                                        <img
                                          src={userPhotos[idx]}
                                          alt={`Photo ${idx + 1}`}
                                          className="w-full h-full object-cover rounded-md border"
                                          data-testid={`img-photo-${idx}`}
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center gap-1">
                                          <Button
                                            variant="secondary"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => handleEditPhoto(idx)}
                                            data-testid={`button-edit-photo-${idx}`}
                                          >
                                            <Pencil className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="destructive"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => handleRemovePhoto(idx)}
                                            data-testid={`button-remove-photo-${idx}`}
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                      <div className="text-xs text-center text-primary">
                                        We&apos;ll print this
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      <button
                                        onClick={() => triggerPhotoUpload(idx)}
                                        className="w-full aspect-square border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center hover:border-primary/50 transition-colors bg-background"
                                        data-testid={`button-upload-photo-${idx}`}
                                      >
                                        <Upload className="w-4 h-4 text-muted-foreground mb-1" />
                                        <span className="text-xs text-muted-foreground">
                                          Upload
                                        </span>
                                      </button>
                                      <button
                                        onClick={() =>
                                          setOpeningSources((prev) => ({ ...prev, [idx]: "byo" }))
                                        }
                                        className="w-full text-xs py-1.5 border border-border rounded-md hover:bg-muted/50 transition-colors text-muted-foreground"
                                        data-testid={`button-byo-${idx}`}
                                      >
                                        Use my own print
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {printCount > 0 && (
                            <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-md">
                              <Checkbox
                                id="collage-copyright-agreement"
                                checked={copyrightAgreed}
                                onCheckedChange={(checked) => setCopyrightAgreed(checked === true)}
                                className="mt-0.5"
                                data-testid="checkbox-copyright"
                              />
                              <Label
                                htmlFor="collage-copyright-agreement"
                                className="text-xs cursor-pointer"
                              >
                                I confirm that I own or am authorized to reproduce these images and
                                agree to the <TermsOfServiceModal />.
                              </Label>
                            </div>
                          )}

                          {byoCount > 0 && (
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md text-xs text-blue-700 dark:text-blue-300">
                              {byoCount} opening{byoCount !== 1 ? "s" : ""} marked for your own
                              prints. You&apos;ll insert your pre-printed photos into these
                              openings.
                            </div>
                          )}
                        </div>
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
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="max-h-[400px] overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 gap-2">
                          {allFrames.map((frame) => (
                            <button
                              key={frame.id}
                              onClick={() => setSelectedFrame(frame)}
                              className={`p-3 rounded-md border-2 text-left hover-elevate active-elevate-2 ${
                                selectedFrame.id === frame.id
                                  ? "border-primary"
                                  : "border-transparent"
                              }`}
                              data-testid={`button-select-frame-${frame.sku}`}
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

                  <AccordionItem value="mats" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-mat"
                    >
                      Mat Options
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="space-y-4">
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
                          testIdPrefix="collage"
                        />

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

                        {matType === "double" && (
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              Bottom Mat Color (Reveal): {selectedMatInner.name}
                            </Label>
                            <ColorSwatchesWithSeparator
                              standardColors={standardMats}
                              premiumColors={premiumMats}
                              selectedId={selectedMatInner.id}
                              onSelect={setSelectedMatInner}
                              testIdPrefix="mat-inner"
                            />
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="brass-nameplate" className="border rounded-lg px-4 lg:px-6">
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
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="glazing" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-glass"
                    >
                      Glazing
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <RadioGroup
                        value={selectedGlass.id}
                        onValueChange={(value) => {
                          const glass = glassTypes.find((g) => g.id === value);
                          if (glass) setSelectedGlass(glass);
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
                        hardwareType={hardware}
                        setHardwareType={setHardware}
                        frameWidth={currentLayout.frameWidth}
                        frameHeight={currentLayout.frameHeight}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>

              <PriceBox
                totalPrice={pricing.total}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onCopyLink={handleShare}
                priceItems={priceItems}
                testIdPrefix="collage-"
                className={`transition-all ${pricingSidebarExpanded ? "top-6" : "top-20"}`}
                disabled={!canAddToCart || isGeneratingPrint}
                isProcessing={isGeneratingPrint}
                beforeButtons={
                  serviceType === "print-and-frame" && printCount > 0 && !copyrightAgreed ? (
                    <div
                      className="flex items-start space-x-2 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md"
                      data-testid="sticky-copyright-checkbox"
                    >
                      <input
                        type="checkbox"
                        id="collage-sticky-copyright"
                        checked={copyrightAgreed}
                        onChange={(e) => setCopyrightAgreed(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-amber-300 text-primary focus:ring-primary"
                        data-testid="checkbox-sticky-copyright"
                      />
                      <label htmlFor="collage-sticky-copyright" className="text-xs leading-relaxed">
                        I confirm that I own or am authorized to reproduce these images and agree to
                        the <TermsOfServiceModal />.
                      </label>
                    </div>
                  ) : undefined
                }
                warnings={
                  serviceType === "print-and-frame" && !canAddToCart
                    ? [
                        <div key="print-warning" className="text-sm text-amber-600">
                          {!allOpeningsReady
                            ? `Select an option for all ${currentLayout.openingCount} openings to continue`
                            : "Accept copyright agreement to continue"}
                        </div>,
                      ]
                    : undefined
                }
              />
            </div>
          </div>
        </div>

        {isMobile && pricing && (
          <div
            className={`fixed left-0 right-0 bottom-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg z-50 transition-all duration-300 ease-in-out ${
              showMobileBar
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0 pointer-events-none"
            }`}
          >
            <div className="px-4 py-3">
              {/* Mobile sticky copyright checkbox */}
              {serviceType === "print-and-frame" && printCount > 0 && !copyrightAgreed && (
                <div
                  className="flex items-start space-x-2 p-2 mb-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md"
                  data-testid="mobile-sticky-copyright-checkbox"
                >
                  <input
                    type="checkbox"
                    id="collage-mobile-sticky-copyright"
                    checked={copyrightAgreed}
                    onChange={(e) => setCopyrightAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-amber-300 text-primary focus:ring-primary"
                    data-testid="checkbox-mobile-sticky-copyright"
                  />
                  <label
                    htmlFor="collage-mobile-sticky-copyright"
                    className="text-xs leading-tight"
                  >
                    I confirm that I own or am authorized to reproduce these images and agree to the{" "}
                    <TermsOfServiceModal />.
                  </label>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-0.5 min-w-[60px]">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <span
                    className="font-bold text-sm"
                    data-testid="text-collage-mobile-sticky-total-price"
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
                    testId="input-collage-quantity-sticky"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  data-testid="button-collage-mobile-copy-link"
                  className="h-11 w-11"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="default"
                  onClick={handleAddToCart}
                  disabled={!canAddToCart || isGeneratingPrint}
                  data-testid="button-collage-mobile-add-to-cart"
                  className="flex-1 text-xs min-w-0 min-h-11"
                >
                  {isGeneratingPrint ? "Generating..." : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {!embedded && (
          <Button
            size="lg"
            className={`fixed bottom-20 right-6 z-[60] lg:hidden shadow-lg rounded-full h-14 px-6 transition-all duration-300 ${
              showMobileBar
                ? "visible opacity-100 translate-y-0"
                : "invisible opacity-0 translate-y-8"
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
                    <CollagePreviewCanvas
                      framePhotos={framePhotos}
                      selectedFrame={selectedFrame}
                      topMatColor={matType === "double" ? selectedMat : selectedMat}
                      bottomMatColor={matType === "double" ? selectedMatInner : selectedMat}
                      matType={matType}
                      matReveal={MAT_REVEAL}
                      layoutId={selectedLayout}
                      layout={currentLayout}
                      containerWidth={window.innerWidth - 100}
                      containerHeight={window.innerHeight - 200}
                      brassNameplateConfig={brassNameplateConfig}
                      isMobile={false}
                      randomSeed={collageInsertSeed}
                      bottomWeighted={bottomWeighted}
                      userPhotos={userPhotos}
                    />
                  </div>
                </div>
              )}
              {fullscreenImage === "corner" && framePhotos.cornerUrl && (
                <div style={{ filter: "drop-shadow(0 8px 32px rgba(0, 0, 0, 0.15))" }}>
                  <img
                    src={framePhotos.cornerUrl}
                    alt="Frame corner detail"
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>
              )}
              {fullscreenImage === "profile" && framePhotos.profileUrl && (
                <div style={{ filter: "drop-shadow(0 8px 32px rgba(0, 0, 0, 0.15))" }}>
                  <img
                    src={framePhotos.profileUrl}
                    alt="Frame profile view"
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>
              )}
              {fullscreenImage === "lifestyle" && fullscreenLifestyleUrl && (
                <div style={{ filter: "drop-shadow(0 8px 32px rgba(0, 0, 0, 0.15))" }}>
                  <img
                    src={fullscreenLifestyleUrl}
                    alt="Lifestyle photo"
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {showImageEditor && pendingEditImage && (
          <ImageEditor
            imageUrl={pendingEditImage}
            onComplete={handleImageEditorSave}
            onCancel={handleImageEditorCancel}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
