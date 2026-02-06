"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Maximize,
  X,
  Eye,
  Settings,
  Info,
  Copy,
  GraduationCap,
  Image as ImageIcon,
  Ribbon,
  Upload,
  AlertCircle,
} from "lucide-react";
import { useIntelligentPreviewSizing } from "@framecraft/core";
import { Button } from "../ui/button";
import { QuantitySelector } from "../ui/quantity-selector";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Alert, AlertDescription } from "../ui/alert";
import type { FrameStyle, FrameConfiguration } from "@framecraft/types";
import {
  getFramesByCategory,
  getGlassTypes,
  getFrameStyleById,
  calculatePricing,
  parseFraction,
  validateArtworkSize,
  formatDimension,
  computePreviewLayout,
  addToCart,
  isShopifyEnabled,
  apiRequest,
  getRandomDiplomaInsert,
  getRandomDiplomaLifestyle,
  getSharedAssetUrl,
  getMatTilingStyle,
  getMatBevelColor,
  DIPLOMA_SIZES,
  getDiplomaSizeById,
  type DiplomaSize,
} from "@framecraft/core";
import { useIsMobile, useMobileViewToggle } from "@framecraft/core";
import {
  ALL_MATS,
  getMatsInDisplayOrder,
  getMatById,
  getAvailableColorsForSize,
  type Mat,
} from "@framecraft/config";
import { useToast } from "../../hooks/use-toast";
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";
import { ARViewer } from "../shared/ARViewer";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import type { BrassNameplateConfig } from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS, getTypeBBottomBorder } from "@framecraft/types";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";
import { PriceBox } from "../ui/PriceBox";
import type { PriceLineItem } from "../ui/PriceBox";
import { BottomWeightedMatting } from "./shared/BottomWeightedMatting";
import { DiplomaLifestyleCarousel } from "./DiplomaLifestyleCarousel";

// Tassel image: served from shared_assets/diploma/tassel.png when present (add file to assets_to_use or run populate script)
const TASSEL_IMAGE_URL = getSharedAssetUrl("diploma/tassel.png");

// Get product data from services
const pictureFrames = getFramesByCategory("picture");
const shadowboxFrames = getFramesByCategory("shadowbox");
const allGlassTypes = getGlassTypes();
// Filter out "No Acrylic" options for diploma frames
const glassTypes = allGlassTypes.filter((g) => g.id !== "backing-only" && g.id !== "none");

// Layout configuration types
export type DiplomaLayoutType =
  | "diploma-only"
  | "diploma-photo"
  | "diploma-tassel"
  | "diploma-tassel-photo";
export type PhotoSizeOption = "5x7" | "8x10";

interface DiplomaLayoutConfig {
  id: DiplomaLayoutType;
  label: string;
  description: string;
  requiresShadowbox: boolean;
  hasPhotoOpening: boolean;
  hasTassel: boolean;
  icon: typeof GraduationCap;
}

// Tassel image component: uses shared asset URL; shows placeholder if image is missing (e.g. tassel.png not yet in assets_to_use)
function TasselIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const [loadError, setLoadError] = useState(false);
  if (loadError) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "var(--muted)",
          color: "var(--muted-foreground)",
          ...style,
        }}
        title="Graduation tassel"
      >
        <GraduationCap className="w-2/3 h-2/3" style={{ maxWidth: "80%", maxHeight: "80%" }} />
      </div>
    );
  }
  return (
    <img
      src={TASSEL_IMAGE_URL}
      alt="Graduation tassel with 2026 charm"
      className={className}
      style={{
        objectFit: "cover",
        width: "100%",
        height: "100%",
        ...style,
      }}
      onError={() => setLoadError(true)}
    />
  );
}

// Layout configurations
const DIPLOMA_LAYOUTS: DiplomaLayoutConfig[] = [
  {
    id: "diploma-only",
    label: "Diploma Only",
    description: "Classic single-opening frame for your diploma",
    requiresShadowbox: false,
    hasPhotoOpening: false,
    hasTassel: false,
    icon: GraduationCap,
  },
  {
    id: "diploma-photo",
    label: "Diploma + Photo",
    description: "Display your diploma with a graduation photo",
    requiresShadowbox: false,
    hasPhotoOpening: true,
    hasTassel: false,
    icon: ImageIcon,
  },
  {
    id: "diploma-tassel",
    label: "Diploma + Tassel",
    description: "Display your diploma with your graduation tassel (shadowbox frame)",
    requiresShadowbox: true,
    hasPhotoOpening: false,
    hasTassel: true,
    icon: Ribbon,
  },
  {
    id: "diploma-tassel-photo",
    label: "Diploma + Tassel + Photo",
    description: "Complete display with tassel hook and graduation photo (shadowbox frame)",
    requiresShadowbox: true,
    hasPhotoOpening: true,
    hasTassel: true,
    icon: Ribbon,
  },
];

// Photo size options for layouts with photo opening
const PHOTO_SIZE_OPTIONS: { id: PhotoSizeOption; label: string; width: number; height: number }[] =
  [
    { id: "5x7", label: '5×7"', width: 5, height: 7 },
    { id: "8x10", label: '8×10"', width: 8, height: 10 },
  ];

interface DiplomaFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
  hideMobileSticky?: boolean;
}

export function DiplomaFrameDesigner({
  defaultFrameId,
  hideMobileSticky = false,
}: DiplomaFrameDesignerProps = {}) {
  const [searchParams, setSearchParams] = useState(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const [serviceType, setServiceType] = useState<"frame-only" | "print-and-frame">("frame-only");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  // Layout state - controls diploma-only, diploma-photo, or diploma-tassel-photo
  const [layoutType, setLayoutType] = useState<DiplomaLayoutType>("diploma-only");
  const [photoSize, setPhotoSize] = useState<PhotoSizeOption>("5x7");
  const [photoImage, setPhotoImage] = useState<string | null>(null);
  const [_photoImageAspectRatio, setPhotoImageAspectRatio] = useState<number | null>(null);

  // Track last selected frames for smart switching
  const lastPictureFrameRef = useRef<FrameStyle | null>(null);
  const lastShadowboxFrameRef = useRef<FrameStyle | null>(null);
  const hasShownFrameSwitchToast = useRef(false);

  // Get current layout config (always defined)
  const currentLayout = useMemo((): DiplomaLayoutConfig => {
    return DIPLOMA_LAYOUTS.find((l) => l.id === layoutType) ?? DIPLOMA_LAYOUTS[0]!;
  }, [layoutType]);

  // Get appropriate frame pool based on layout
  const frameStyles = useMemo(
    () => (currentLayout.requiresShadowbox ? shadowboxFrames : pictureFrames),
    [currentLayout.requiresShadowbox]
  );

  // Sync searchParams from URL on mount and when user navigates (e.g. Back)
  useEffect(() => {
    setSearchParams(window.location.search);
  }, []);
  useEffect(() => {
    const handler = () => setSearchParams(window.location.search);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  // Initialize frame selection based on defaultFrameId prop or URL parameter
  const initialFrame = useMemo((): FrameStyle => {
    const fallback = pictureFrames[0];
    if (!fallback) throw new Error("No picture frames available");
    if (defaultFrameId) {
      return getFrameStyleById(defaultFrameId) ?? fallback;
    }
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const frameParam = params.get("frame");
    return (
      (frameParam ? getFrameStyleById(frameParam) : getFrameStyleById("modern-black")) ?? fallback
    );
  }, [defaultFrameId]);

  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(initialFrame);
  const [selectedMat, setSelectedMat] = useState<Mat>(() => getMatById("mat-1") ?? ALL_MATS[0]!);
  const [selectedMatInner, setSelectedMatInner] = useState<Mat>(
    () => getMatById("mat-40") ?? ALL_MATS[1]!
  );
  const defaultGlass = glassTypes[0] ?? allGlassTypes[0]!;
  const [selectedGlass, setSelectedGlass] = useState(defaultGlass);
  const [matType, setMatType] = useState<"none" | "single" | "double">("double"); // Default to double mat
  const [matBorderWidth, setMatBorderWidth] = useState("2.5");
  const [matRevealWidth, setMatRevealWidth] = useState("0.25");
  const [bottomWeighted, setBottomWeighted] = useState(false);
  const [copyrightAgreed] = useState(false);
  const [uploadedImageAspectRatio] = useState<number | null>(null);
  const [fullImageOpen, setFullImageOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<
    "preview" | "corner" | "profile" | "lifestyle"
  >("preview");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [previousImage, setPreviousImage] = useState<string | null>(null);
  const prevImageRef = useRef<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [hangingHardware, setHangingHardware] = useState<"standard" | "security">("standard");

  // Brass nameplate state
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
      const params = new URLSearchParams(window.location.search);
      // Support new nameplate* parameters with fallback to legacy plaque* parameters
      const nameplateEnabled =
        params.get("nameplateEnabled") === "true" || params.get("plaqueEnabled") === "true";
      if (!nameplateEnabled) return defaultConfig;

      return {
        enabled: true,
        line1: params.get("nameplateLine1") || params.get("plaqueLine1") || "",
        line2: params.get("nameplateLine2") || params.get("plaqueLine2") || "",
        line3: params.get("nameplateLine3") || params.get("plaqueLine3") || "",
        font:
          (params.get("nameplateFont") as BrassNameplateConfig["font"]) ||
          params.get("plaqueFont") ||
          "georgia",
        color:
          (params.get("nameplateColor") as BrassNameplateConfig["color"]) ||
          params.get("plaqueColor") ||
          "brass-black",
        includeFlag: (params.get("nameplateFlag") || params.get("plaqueFlag")) === "true",
      };
    } catch {
      return defaultConfig;
    }
  });

  // AR Viewer state
  const [showARViewer, setShowARViewer] = useState(false);

  const { toast } = useToast();

  // Diploma size preset state
  const [selectedDiplomaSize, setSelectedDiplomaSize] = useState<DiplomaSize | null>(null);

  // Custom dimensions - artwork size (default to 10×8" landscape)
  const [artworkWidth, setArtworkWidth] = useState("10");
  const [artworkHeight, setArtworkHeight] = useState("8");

  // Desktop pricing sidebar state - starts condensed, expands when scrolled
  const [pricingSidebarExpanded, setPricingSidebarExpanded] = useState(false);
  const hardwareSectionRef = useRef<HTMLDivElement>(null);

  // Generate random seed once on component mount for insert image randomization
  // This makes images change on page load but stay consistent during the session
  const randomSeed = useMemo(() => Math.floor(Math.random() * 10000), []);

  // Get stable placeholder image from diploma insert library (diploma-specific)
  const placeholderImagePath = useMemo(() => getRandomDiplomaInsert(randomSeed), [randomSeed]);
  const placeholderImage = useMemo(
    () => (placeholderImagePath ? getSharedAssetUrl(placeholderImagePath) : ""),
    [placeholderImagePath]
  );

  // Use uploaded image if available, otherwise use placeholder
  const displayImage = selectedImage || placeholderImage;

  const configuratorRef = useRef<HTMLDivElement>(null);

  // Frame photos state (corner, profile, lifestyle, straight/framingengine)
  const [framePhotos, setFramePhotos] = useState<{
    cornerUrl?: string;
    profileUrl?: string;
    lifestyleUrl?: string;
    topUrl?: string; // Pre-oriented top piece (decorative edge facing down)
    bottomUrl?: string; // Pre-oriented bottom piece (decorative edge facing up)
    leftUrl?: string; // Pre-oriented left piece (decorative edge facing right)
    rightUrl?: string; // Pre-oriented right piece (decorative edge facing left)
  }>({});

  // Get random lifestyle image from shared diploma lifestyle pool (resolve to URL for img src)
  const getRandomLifestyleImage = useCallback((frameId: string) => {
    const path = getRandomDiplomaLifestyle(frameId);
    return path ? getSharedAssetUrl(path) : undefined;
  }, []);

  // Track if initial load is complete
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // Load configuration from URL parameters on mount and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    const frameId = params.get("frame");
    const width = params.get("width");
    const height = params.get("height");
    const mat = params.get("mat");
    const matColorId = params.get("matColor");
    const matInnerColorId = params.get("matInnerColor");
    const matBorder = params.get("matBorder");
    const service = params.get("service");
    const hardware = params.get("hardware");
    const imageUrl = params.get("imageUrl");
    const quantityParam = params.get("quantity");
    const diplomaSizeId = params.get("diplomaSize");

    // Load layout parameters
    const layoutParam = params.get("layout");
    const photoSizeParam = params.get("photoSize");
    const photoImageUrl = params.get("photoImageUrl");

    if (
      layoutParam &&
      (layoutParam === "diploma-only" ||
        layoutParam === "diploma-photo" ||
        layoutParam === "diploma-tassel" ||
        layoutParam === "diploma-tassel-photo")
    ) {
      setLayoutType(layoutParam);
    }
    if (photoSizeParam && (photoSizeParam === "5x7" || photoSizeParam === "8x10")) {
      setPhotoSize(photoSizeParam);
    }
    if (photoImageUrl) {
      setPhotoImage(photoImageUrl);
    }

    // Determine frame pool based on layout
    const activeLayout =
      layoutParam &&
      (layoutParam === "diploma-only" ||
        layoutParam === "diploma-photo" ||
        layoutParam === "diploma-tassel" ||
        layoutParam === "diploma-tassel-photo")
        ? DIPLOMA_LAYOUTS.find((l) => l.id === layoutParam)
        : DIPLOMA_LAYOUTS[0];
    const currentFramePool = activeLayout?.requiresShadowbox ? shadowboxFrames : pictureFrames;

    if (frameId) {
      const frame = currentFramePool.find((f) => f.id === frameId);
      if (frame) setSelectedFrame(frame);
    }
    if (quantityParam) {
      const parsedQuantity = parseInt(quantityParam, 10);
      if (parsedQuantity >= 1) setQuantity(parsedQuantity);
    }

    // Load diploma size preset from URL
    if (diplomaSizeId) {
      const diplomaPreset = getDiplomaSizeById(diplomaSizeId);
      if (diplomaPreset) {
        setSelectedDiplomaSize(diplomaPreset);
        // Auto-fill dimensions from preset
        setArtworkWidth(diplomaPreset.documentWidth.toString());
        setArtworkHeight(diplomaPreset.documentHeight.toString());
      }
    } else {
      // Load custom dimensions if no preset
      if (width) setArtworkWidth(width);
      if (height) setArtworkHeight(height);
    }

    if (mat === "none" || mat === "single" || mat === "double") setMatType(mat);
    if (matColorId) {
      const matColor = ALL_MATS.find((m) => m.id === matColorId);
      if (matColor) setSelectedMat(matColor);
    }
    if (matInnerColorId) {
      const innerMatColor = ALL_MATS.find((m) => m.id === matInnerColorId);
      if (innerMatColor) setSelectedMatInner(innerMatColor);
    }
    if (matBorder) setMatBorderWidth(matBorder);
    const bottomWeightedParam = params.get("bottomWeighted");
    if (bottomWeightedParam === "true") setBottomWeighted(true);
    if (service === "frame-only" || service === "print-and-frame") setServiceType(service);
    if (hardware === "standard" || hardware === "security") setHangingHardware(hardware);

    // Load custom image from URL if provided (e.g., from Map Builder)
    if (imageUrl) {
      setSelectedImage(imageUrl);
    }

    // Mark initial load as complete
    setIsInitialLoadComplete(true);
  }, [searchParams]);

  // Update URL when configuration changes (but not during initial load)
  useEffect(() => {
    if (!isInitialLoadComplete) return;

    const params = new URLSearchParams();
    params.set("frame", selectedFrame.id);

    // Layout parameters
    params.set("layout", layoutType);
    if (currentLayout.hasPhotoOpening) {
      params.set("photoSize", photoSize);
      if (photoImage) {
        params.set("photoImageUrl", photoImage);
      }
    }

    // Include diplomaSize in URL only if a preset is selected
    if (selectedDiplomaSize && selectedDiplomaSize.id !== "custom") {
      params.set("diplomaSize", selectedDiplomaSize.id);
    } else {
      // If no preset or custom selected, include width/height
      params.set("width", artworkWidth);
      params.set("height", artworkHeight);
    }

    params.set("mat", matType);
    if (matType !== "none") {
      params.set("matColor", selectedMat.id);
      params.set("matBorder", matBorderWidth);
      if (bottomWeighted) {
        params.set("bottomWeighted", "true");
      } else {
        params.delete("bottomWeighted");
      }
    }
    if (matType === "double") {
      params.set("matInnerColor", selectedMatInner.id);
    }
    params.set("service", serviceType);
    params.set("hardware", hangingHardware);
    if (quantity > 1) {
      params.set("quantity", quantity.toString());
    } else {
      params.delete("quantity");
    }

    // Brass plaque configuration
    if (brassNameplateConfig.enabled) {
      params.set("nameplateEnabled", "true");
      if (brassNameplateConfig.line1) params.set("nameplateLine1", brassNameplateConfig.line1);
      if (brassNameplateConfig.line2) params.set("nameplateLine2", brassNameplateConfig.line2);
      if (brassNameplateConfig.line3) params.set("nameplateLine3", brassNameplateConfig.line3);
      params.set("nameplateFont", brassNameplateConfig.font);
      params.set("nameplateColor", brassNameplateConfig.color);
    } else {
      // Clear plaque params when disabled
      params.delete("nameplateEnabled");
      params.delete("nameplateLine1");
      params.delete("nameplateLine2");
      params.delete("nameplateLine3");
      params.delete("nameplateFont");
      params.delete("nameplateColor");
    }

    // Preserve imageUrl if it exists (from Map Builder or other sources)
    if (
      selectedImage &&
      (selectedImage.includes("/tmp-maps/") || selectedImage.startsWith("http"))
    ) {
      params.set("imageUrl", selectedImage);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [
    isInitialLoadComplete,
    selectedFrame,
    selectedDiplomaSize,
    artworkWidth,
    artworkHeight,
    matType,
    selectedMat,
    selectedMatInner,
    matBorderWidth,
    bottomWeighted,
    serviceType,
    hangingHardware,
    selectedImage,
    quantity,
    brassNameplateConfig,
    layoutType,
    currentLayout.hasPhotoOpening,
    photoSize,
    photoImage,
  ]);

  // Reset bottom-weighted when mat is disabled
  useEffect(() => {
    if (matType === "none" && bottomWeighted) {
      setBottomWeighted(false);
    }
  }, [matType, bottomWeighted]);

  // Smart frame switching when layout changes between picture/shadowbox frames
  const handleLayoutChange = useCallback(
    (newLayout: DiplomaLayoutType) => {
      const newLayoutConfig = DIPLOMA_LAYOUTS.find((l) => l.id === newLayout);
      if (!newLayoutConfig) return;

      const wasRequiringShadowbox = currentLayout.requiresShadowbox;
      const nowRequiresShadowbox = newLayoutConfig.requiresShadowbox;

      // Switching from picture to shadowbox
      if (!wasRequiringShadowbox && nowRequiresShadowbox) {
        lastPictureFrameRef.current = selectedFrame;
        const newFrame = lastShadowboxFrameRef.current ?? shadowboxFrames[0]!;
        setSelectedFrame(newFrame);

        // Show toast only once per session
        if (!hasShownFrameSwitchToast.current) {
          toast({
            title: "Switched to Shadowbox Frame",
            description: "Tassel layouts need shadowbox depth. We've selected a compatible frame.",
          });
          hasShownFrameSwitchToast.current = true;
        }
      }

      // Switching from shadowbox to picture
      if (wasRequiringShadowbox && !nowRequiresShadowbox) {
        lastShadowboxFrameRef.current = selectedFrame;
        const newFrame = lastPictureFrameRef.current ?? pictureFrames[0]!;
        setSelectedFrame(newFrame);
      }

      setLayoutType(newLayout);
    },
    [currentLayout.requiresShadowbox, selectedFrame, toast]
  );

  // File input ref for photo upload
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Handle photo upload for photo opening
  const handlePhotoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setPhotoImage(dataUrl);

        // Get image dimensions for aspect ratio
        const img = new Image();
        img.onload = () => {
          setPhotoImageAspectRatio(img.width / img.height);
        };
        img.src = dataUrl;

        toast({
          title: "Photo uploaded",
          description: "Your graduation photo has been added to the frame.",
        });
      };
      reader.readAsDataURL(file);
    },
    [toast]
  );

  // Fetch frame photos from local storage when frame changes
  useEffect(() => {
    // CRITICAL: Clear frame photos IMMEDIATELY to prevent race condition
    // where old frame's photos show while new frame's photos are loading
    setFramePhotos({});

    if (!selectedFrame.sku) {
      return;
    }

    async function fetchFramePhotos() {
      try {
        const response = await fetch(`/api/frames/${selectedFrame.sku}/photos`);
        if (response.ok) {
          const photoSet = await response.json();
          // Get random lifestyle image from alternateImages array, fallback to API response
          const randomLifestyle = getRandomLifestyleImage(selectedFrame.id);
          setFramePhotos({
            topUrl: photoSet.topUrl,
            bottomUrl: photoSet.bottomUrl,
            leftUrl: photoSet.leftUrl,
            rightUrl: photoSet.rightUrl,
            cornerUrl: photoSet.cornerUrl,
            profileUrl: photoSet.profileUrl,
            lifestyleUrl: randomLifestyle || photoSet.lifestyleUrl,
          });
        }
        // Note: No need to clear on error since we already cleared at the start
      } catch (error) {
        console.error("Error fetching frame photos:", error);
        // Note: Frame photos already cleared at start of effect
      }
    }

    fetchFramePhotos();
  }, [selectedFrame, getRandomLifestyleImage]);

  // Cross-fade animation when selectedImage changes
  useEffect(() => {
    // If we have a previous image, start cross-fade transition
    if (prevImageRef.current && prevImageRef.current !== selectedImage) {
      setPreviousImage(prevImageRef.current);

      // Clear previous image after transition duration (450ms per config)
      const timer = setTimeout(() => {
        setPreviousImage(null);
      }, 450);

      prevImageRef.current = selectedImage;

      return () => clearTimeout(timer);
    }

    // First image or same image - no transition needed
    prevImageRef.current = selectedImage;
    return undefined;
  }, [selectedImage]);

  // Desktop pricing sidebar expansion - expands when user reaches hardware section
  useEffect(() => {
    // Only run on desktop/tablet (md and up)
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (!isDesktop) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Debounce scroll events for better performance
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;

        // Expand pricing sidebar when hardware section approaches the viewport
        // This keeps the sidebar condensed until user reaches the end of customization options
        if (hardwareSectionRef.current) {
          const hardwareTop =
            hardwareSectionRef.current.getBoundingClientRect().top + window.scrollY;
          // Expand when hardware section is about 1 screen away (windowHeight px before it)
          const expandThreshold = hardwareTop - windowHeight;

          if (scrollPosition > expandThreshold && !pricingSidebarExpanded) {
            setPricingSidebarExpanded(true);
          } else if (scrollPosition <= 100 && pricingSidebarExpanded) {
            // Collapse back when scrolling near the top
            setPricingSidebarExpanded(false);
          }
        }
      }, 50); // 50ms debounce
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pricingSidebarExpanded]);

  // Type B behavior: No useEffect needed to clamp mat borders
  // The bottom border auto-extends via getTypeBBottomBorder when nameplate is enabled

  // Handle width change with aspect ratio locking for print-and-frame
  const handleWidthChange = (newWidth: string) => {
    setArtworkWidth(newWidth);

    // Lock aspect ratio for print-and-frame mode with uploaded image
    if (serviceType === "print-and-frame" && uploadedImageAspectRatio && selectedImage) {
      const width = parseFraction(newWidth);
      if (width > 0) {
        const newHeight = width / uploadedImageAspectRatio;
        setArtworkHeight(newHeight.toFixed(2));
      }
    }
  };

  // Handle checkout/add to cart
  const handleCheckout = async () => {
    if (!isValidDimensions || isTooLarge) {
      toast({
        title: "Invalid Configuration",
        description: "Please check your frame dimensions.",
        variant: "destructive",
      });
      return;
    }

    if (serviceType === "print-and-frame" && selectedImage && !copyrightAgreed) {
      toast({
        title: "Copyright Agreement Required",
        description: "Please agree to the copyright terms before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);
    const shopifyEnabled = await isShopifyEnabled();

    const glass = selectedGlass ?? glassTypes[0] ?? allGlassTypes[0]!;
    const config: FrameConfiguration = {
      serviceType,
      artworkWidth: parseFraction(artworkWidth),
      artworkHeight: parseFraction(artworkHeight),
      frameStyleId: selectedFrame.id,
      matType,
      matBorderWidth: parseFraction(matBorderWidth),
      matRevealWidth: parseFraction(matRevealWidth),
      matColorId: selectedMat.id,
      matInnerColorId: matType === "double" ? selectedMatInner.id : undefined,
      glassTypeId: glass.id,
      imageUrl: selectedImage || undefined,
      copyrightAgreed: serviceType === "frame-only" ? undefined : copyrightAgreed,
    };

    if (shopifyEnabled) {
      try {
        const result = await addToCart(config, finalTotalPrice * quantity, quantity);

        if (result.checkoutUrl) {
          // Redirect to Shopify checkout
          window.location.href = result.checkoutUrl;
        } else {
          throw new Error("Failed to create checkout");
        }
      } catch (error) {
        setIsCheckingOut(false);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to add to cart",
          variant: "destructive",
        });
      }
    } else {
      // Cart functionality coming soon
      try {
        const response = await apiRequest("POST", "/api/cart", config);
        await response.json();
        setIsCheckingOut(false);

        toast({
          title: "Added to Cart",
          description: "Your custom frame has been added. Cart checkout coming soon!",
        });

        // TODO: Navigate to cart page when cart is implemented
        // navigate('/cart');
      } catch (error) {
        setIsCheckingOut(false);
        toast({
          title: "Error",
          description: "Failed to add to cart",
          variant: "destructive",
        });
      }
    }
  };

  // Calculate dimensions
  const artW = parseFraction(artworkWidth);
  const artH = parseFraction(artworkHeight);
  const matBorder = parseFraction(matBorderWidth);
  const matReveal = parseFraction(matRevealWidth);

  // Calculate effective dimensions for multi-opening layouts
  // This expands the "artwork area" to include all openings plus gaps
  const multiOpeningDimensions = useMemo(() => {
    // Tassel dimensions (shared across tassel layouts)
    const tasselW = 2;
    const tasselH = 6;
    const tasselGap = 1; // Gap between diploma and tassel

    if (currentLayout.hasTassel && !currentLayout.hasPhotoOpening) {
      // Diploma + Tassel layout (no photo)
      const effectiveArtW = artW + tasselGap + tasselW;
      const effectiveArtH = Math.max(artH, tasselH);

      return { effectiveArtW, effectiveArtH };
    }

    if (!currentLayout.hasPhotoOpening) {
      // Single diploma opening (no tassel, no photo)
      return { effectiveArtW: artW, effectiveArtH: artH };
    }

    const photoOption =
      PHOTO_SIZE_OPTIONS.find((o) => o.id === photoSize) ?? PHOTO_SIZE_OPTIONS[0]!;
    const photoW = photoOption.width;
    const photoH = photoOption.height;

    // Gap between openings (in inches)
    const gapBetweenOpenings = 2;

    if (currentLayout.hasTassel) {
      // Diploma + Tassel + Photo layout
      // Adjusted gaps to achieve target frame sizes
      const tasselToPhotoGap = photoSize === "8x10" ? 2 : 1.5;
      const effectiveArtW = artW + tasselGap + tasselW + tasselToPhotoGap + photoW;
      // Reduce height by 1.5" for tighter proportions
      const effectiveArtH = Math.max(artH, tasselH, photoH) - 1.5;

      return { effectiveArtW, effectiveArtH };
    } else {
      // Diploma + Photo layout
      const effectiveArtW = artW + gapBetweenOpenings + photoW;
      const effectiveArtH = Math.max(artH, photoH);

      return { effectiveArtW, effectiveArtH };
    }
  }, [artW, artH, currentLayout, photoSize]);

  const { effectiveArtW, effectiveArtH } = multiOpeningDimensions;

  // Validate dimensions
  const artworkSizeValidation = useMemo(() => validateArtworkSize(artW, artH), [artW, artH]);
  const isValidDimensions = artworkSizeValidation.valid;

  // Calculate effective mat borders using Type B behavior (only bottom border extends for nameplate)
  const bottomWeightedExtra = bottomWeighted ? 0.5 : 0;
  const effectiveMatBorders = useMemo(() => {
    const userBorder = parseFloat(matBorderWidth);
    const nameplateEnabled = brassNameplateConfig.enabled && matType !== "none";

    return {
      top: userBorder,
      right: userBorder,
      bottom: getTypeBBottomBorder(nameplateEnabled, userBorder) + bottomWeightedExtra,
      left: userBorder,
    };
  }, [matBorderWidth, brassNameplateConfig.enabled, matType, bottomWeightedExtra]);

  // Calculate frame dimensions using effective dimensions for multi-opening layouts
  // When using double mats, add mat reveal to frame size so bottom mat opening stays constant
  const frameWidth =
    effectiveArtW +
    (matType !== "none" ? effectiveMatBorders.left + effectiveMatBorders.right : 0) +
    (matType === "double" ? matReveal * 2 : 0) +
    (selectedFrame.mouldingWidth || 1) * 2;
  const frameHeight = useMemo(() => {
    if (matType === "none") {
      return effectiveArtH + selectedFrame.mouldingWidth * 2;
    }
    // Use effective borders (which includes plaque adjustment for bottom)
    return (
      effectiveArtH +
      effectiveMatBorders.top +
      effectiveMatBorders.bottom +
      (matType === "double" ? matReveal * 2 : 0) +
      selectedFrame.mouldingWidth * 2
    );
  }, [effectiveArtH, selectedFrame.mouldingWidth, matType, effectiveMatBorders, matReveal]);

  // Check if frame is too large
  const MAX_OVERALL = 60;
  const isTooLarge = frameWidth > MAX_OVERALL || frameHeight > MAX_OVERALL;

  // Calculate pricing
  const pricingResult = useMemo(() => {
    if (!isValidDimensions) {
      return {
        basePrice: 0,
        framePrice: 0,
        matPrice: 0,
        glassPrice: 0,
        printPrice: 0,
        oversizeFee: 0,
        hardwarePrice: 0,
        nameplatePrice: 0,
        subtotal: 0,
        tax: 0,
        total: 0,
      };
    }

    // Calculate effective mat border for pricing
    // Using average of all four borders gives the CORRECT perimeter for perimeter-based pricing
    // Perimeter with avg border: 2×(artW + 2×avg + artH + 2×avg) = 2×(artW + artH + sum of all borders)
    // This matches the actual perimeter: 2×((artW + left + right) + (artH + top + bottom))
    const effectiveMatBorderForPricing =
      matType !== "none"
        ? (effectiveMatBorders.top +
            effectiveMatBorders.right +
            effectiveMatBorders.bottom +
            effectiveMatBorders.left) /
          4
        : 0;

    const config: FrameConfiguration = {
      serviceType,
      artworkWidth: artW,
      artworkHeight: artH,
      frameStyleId: selectedFrame.id,
      matType,
      matBorderWidth: effectiveMatBorderForPricing, // Use averaged border to account for asymmetry
      matRevealWidth: matReveal,
      matColorId: selectedMat.id,
      matInnerColorId: matType === "double" ? selectedMatInner.id : undefined,
      glassTypeId: (selectedGlass ?? glassTypes[0]!).id,
    };

    const framePricing = calculatePricing(config);

    // Calculate additional costs
    const hardwareCost = hangingHardware === "security" ? 8.95 : 0;
    // Nameplate only applies when mat is selected (not "none")
    const plaqueCost =
      brassNameplateConfig.enabled && matType !== "none" ? BRASS_NAMEPLATE_SPECS.PRICE : 0;

    // Calculate oversize fee based on ACTUAL frame dimensions (including plaque adjustment)
    const oversizeFee = frameWidth > 40 || frameHeight > 40 ? 100 : 0;

    const total = framePricing.total + hardwareCost + plaqueCost + oversizeFee;

    return {
      ...framePricing,
      hardwarePrice: hardwareCost,
      nameplatePrice: plaqueCost,
      oversizeFee,
      total,
    };
  }, [
    isValidDimensions,
    serviceType,
    artW,
    artH,
    selectedFrame.id,
    matType,
    effectiveMatBorders,
    matReveal,
    selectedMat.id,
    selectedMatInner.id,
    selectedGlass,
    hangingHardware,
    brassNameplateConfig.enabled,
    frameWidth,
    frameHeight,
  ]);

  const {
    framePrice,
    matPrice,
    glassPrice,
    printPrice: _printPrice,
    oversizeFee,
    hardwarePrice,
    total: subtotal,
  } = pricingResult;

  const nameplatePrice = "nameplatePrice" in pricingResult ? pricingResult.nameplatePrice : 0;

  // Additional layout-based pricing
  const photoOpeningPrice = currentLayout.hasPhotoOpening && matType !== "none" ? 5 : 0;
  const tasselPrice = currentLayout.hasTassel ? 15 : 0;

  const finalTotalPrice = subtotal + photoOpeningPrice + tasselPrice;

  // Build itemized pricing breakdown for PriceBox
  const priceItems = useMemo<PriceLineItem[]>(() => {
    const items: PriceLineItem[] = [];

    // Frame
    items.push({
      label: "Frame",
      amount: framePrice,
      testId: "price-frame",
    });

    // Mat Board
    if (matType === "none") {
      items.push({
        label: "Mat Board",
        amount: 0,
        isIncluded: true,
        testId: "price-mat",
      });
    } else if (matType === "single") {
      items.push({
        label: "Mat Board (single)",
        amount: matPrice,
        testId: "price-mat",
      });
    } else {
      items.push({
        label: "Mat Board (double)",
        amount: matPrice,
        testId: "price-mat",
      });
    }

    const glassName = selectedGlass?.name ?? glassTypes[0]?.name ?? "Glazing";
    items.push({
      label: glassName,
      amount: glassPrice,
      isIncluded: glassPrice === 0,
      testId: "price-glass",
    });

    // Hardware
    items.push({
      label: hangingHardware === "security" ? "Security Hardware" : "Standard Hardware",
      amount: hardwarePrice,
      isIncluded: hardwarePrice === 0,
      testId: "price-hardware",
    });

    // Engraved Brass Nameplate (if enabled)
    if (brassNameplateConfig.enabled) {
      items.push({
        label: "Engraved Brass Nameplate",
        amount: nameplatePrice,
        testId: "price-nameplate",
      });
    }

    // Oversize Fee (if applicable)
    if (oversizeFee > 0) {
      items.push({
        label: "Oversize Fee",
        amount: oversizeFee,
        testId: "price-oversize",
      });
    }

    // Photo Opening - additional mat cutting for layouts with photo
    if (currentLayout.hasPhotoOpening && matType !== "none") {
      items.push({
        label: `Photo Opening (${photoSize})`,
        amount: 5,
        testId: "price-photo-opening",
      });
    }

    // Tassel Hook - for shadowbox layouts with tassel
    if (currentLayout.hasTassel) {
      items.push({
        label: "Tassel Hook",
        amount: 15,
        testId: "price-tassel",
      });
    }

    return items;
  }, [
    framePrice,
    matType,
    matPrice,
    glassPrice,
    selectedGlass,
    hardwarePrice,
    hangingHardware,
    brassNameplateConfig.enabled,
    nameplatePrice,
    oversizeFee,
    currentLayout.hasPhotoOpening,
    currentLayout.hasTassel,
    photoSize,
  ]);

  // Build warnings array for PriceBox
  const warnings = useMemo<React.ReactNode[]>(() => {
    const warns: React.ReactNode[] = [];

    if (oversizeFee > 0) {
      warns.push(
        <div
          key="oversize"
          className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-md text-xs text-yellow-700 dark:text-yellow-500"
        >
          <Info className="h-3 w-3 flex-shrink-0" />
          <span>This frame is oversized (over 40&quot;). A $100 oversize fee applies.</span>
        </div>
      );
    }

    if (isTooLarge) {
      warns.push(
        <div
          key="toolarge"
          className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-md text-xs text-red-700 dark:text-red-500"
        >
          <Info className="h-3 w-3 flex-shrink-0" />
          <span>
            This frame exceeds our maximum size (60&quot;). Please contact us for a custom quote.
          </span>
        </div>
      );
    }

    return warns;
  }, [oversizeFee, isTooLarge]);

  // Intelligent preview sizing hook - dynamically adjusts preview container height based on frame aspect ratio
  const { containerRef, previewContainerHeight, containerWidth } = useIntelligentPreviewSizing({
    frameWidth,
    frameHeight,
    plaqueEnabled: brassNameplateConfig.enabled,
    plaqueExtension: BRASS_NAMEPLATE_SPECS.NAMEPLATE_FRAME_EXTENSION,
    isMobile,
    // Custom overrides to match previous behavior (was min-h-[400px] md:min-h-[500px])
    minHeightMobile: 400,
    minHeightDesktop: 500,
  });

  // Compute preview layout using effective dimensions for multi-opening layouts
  const layout = useMemo(() => {
    if (matType === "none") {
      // No mat - use uniform zero borders
      return computePreviewLayout({
        artW: effectiveArtW,
        artH: effectiveArtH,
        matBorder: 0,
        frameFace: selectedFrame.mouldingWidth || 1,
        containerWpx: containerWidth,
        containerHpx: previewContainerHeight,
      });
    }

    // Use asymmetric borders for accurate preview rendering
    return computePreviewLayout({
      artW: effectiveArtW,
      artH: effectiveArtH,
      matBorderTop: effectiveMatBorders.top,
      matBorderRight: effectiveMatBorders.right,
      matBorderBottom: effectiveMatBorders.bottom,
      matBorderLeft: effectiveMatBorders.left,
      matReveal: matType === "double" ? matReveal : 0,
      frameFace: selectedFrame.mouldingWidth || 1,
      containerWpx: containerWidth,
      containerHpx: previewContainerHeight,
    });
  }, [
    effectiveArtW,
    effectiveArtH,
    effectiveMatBorders,
    matType,
    matReveal,
    selectedFrame.mouldingWidth,
    containerWidth,
    previewContainerHeight,
  ]);

  // Calculate diploma opening position (the main diploma, not the full opening area)
  // For multi-opening layouts, this is the diploma portion only
  const asymmetricMatLayout = useMemo(() => {
    // Diploma opening dimensions in pixels (always uses artW/artH, not effective dimensions)
    const diplomaOpeningWidth = artW * layout.scale;
    const diplomaOpeningHeight = artH * layout.scale;

    if (matType === "none" || !brassNameplateConfig.enabled) {
      // Symmetric layout
      return {
        openingX: layout.frameFacePx + layout.matPx,
        openingY: layout.frameFacePx + layout.matPx,
        openingWidth: diplomaOpeningWidth,
        openingHeight: diplomaOpeningHeight,
      };
    }

    // Asymmetric layout - mat opening is offset due to larger bottom border
    const topMatPx = effectiveMatBorders.top * layout.scale;
    const leftMatPx = effectiveMatBorders.left * layout.scale;

    return {
      openingX: layout.frameFacePx + leftMatPx,
      openingY: layout.frameFacePx + topMatPx,
      openingWidth: diplomaOpeningWidth,
      openingHeight: diplomaOpeningHeight,
    };
  }, [matType, brassNameplateConfig.enabled, layout, effectiveMatBorders, artW, artH]);

  // Calculate tassel opening dimensions for tassel layouts (compute first for photo positioning)
  const tasselOpeningLayout = useMemo(() => {
    if (!currentLayout.hasTassel) return null;

    // Tassel hook area: 2" wide × 6" tall opening
    const tasselW = 2;
    const tasselH = 6;
    const tasselOpeningW = tasselW * layout.scale;
    const tasselOpeningH = tasselH * layout.scale;

    // Gap from diploma to tassel (1.5")
    const gapPx = 1.5 * layout.scale;

    // Place tassel to the right of diploma
    const diplomaOpeningRight = asymmetricMatLayout.openingX + asymmetricMatLayout.openingWidth;
    const tasselX = diplomaOpeningRight + gapPx;

    // Center vertically relative to diploma
    const diplomaCenterY = asymmetricMatLayout.openingY + asymmetricMatLayout.openingHeight / 2;
    const tasselY = diplomaCenterY - tasselOpeningH / 2;

    return {
      x: tasselX,
      y: tasselY,
      width: tasselOpeningW,
      height: tasselOpeningH,
      gapFromDiplomaPx: gapPx,
    };
  }, [currentLayout.hasTassel, layout.scale, asymmetricMatLayout]);

  // Calculate photo opening dimensions for multi-opening layouts
  const photoOpeningLayout = useMemo(() => {
    if (!currentLayout.hasPhotoOpening) return null;

    const photoOption =
      PHOTO_SIZE_OPTIONS.find((o) => o.id === photoSize) ?? PHOTO_SIZE_OPTIONS[0]!;
    const photoW = photoOption.width;
    const photoH = photoOption.height;

    // Photo opening in preview pixels
    const photoOpeningW = photoW * layout.scale;
    const photoOpeningH = photoH * layout.scale;

    const diplomaOpeningRight = asymmetricMatLayout.openingX + asymmetricMatLayout.openingWidth;

    let photoOpeningX: number;

    if (currentLayout.hasTassel && tasselOpeningLayout) {
      // Tassel layout: photo is to the right of tassel
      // Gap from tassel to photo is 1.5"
      const gapFromTasselPx = 1.5 * layout.scale;
      photoOpeningX = tasselOpeningLayout.x + tasselOpeningLayout.width + gapFromTasselPx;
    } else {
      // Diploma + Photo layout (no tassel): photo is 2" to the right of diploma
      const gapFromDiplomaPx = 2 * layout.scale;
      photoOpeningX = diplomaOpeningRight + gapFromDiplomaPx;
    }

    // Center photo opening vertically relative to diploma opening
    const diplomaCenterY = asymmetricMatLayout.openingY + asymmetricMatLayout.openingHeight / 2;
    const photoOpeningY = diplomaCenterY - photoOpeningH / 2;

    return {
      x: photoOpeningX,
      y: photoOpeningY,
      width: photoOpeningW,
      height: photoOpeningH,
    };
  }, [
    currentLayout.hasPhotoOpening,
    currentLayout.hasTassel,
    photoSize,
    layout.scale,
    asymmetricMatLayout,
    tasselOpeningLayout,
  ]);

  // Get available mats (filter based on frame size for oversize)
  const availableMats = useMemo(() => {
    return getAvailableColorsForSize(frameWidth, frameHeight);
  }, [frameWidth, frameHeight]);

  // Separate standard and premium mats with viewport-specific display order
  const standardMats = useMemo(() => {
    const viewport = isMobile ? "mobile" : "desktop";
    const matsInOrder = getMatsInDisplayOrder(viewport, true, false); // Regular mats only
    // Filter to only show mats that are available for current size
    const availableMatIds = new Set(availableMats.available.map((m) => m.id));
    return matsInOrder.filter((mat) => availableMatIds.has(mat.id));
  }, [availableMats, isMobile]);

  const premiumMats = useMemo(() => {
    const viewport = isMobile ? "mobile" : "desktop";
    const matsInOrder = getMatsInDisplayOrder(viewport, false, true); // Premium mats only
    // Filter to only show mats that are available for current size
    const availableMatIds = new Set(availableMats.available.map((m) => m.id));
    return matsInOrder.filter((mat) => availableMatIds.has(mat.id));
  }, [availableMats, isMobile]);

  // Disabled mats (not available for current size)
  const disabledMatIds = useMemo(() => {
    const allMatIds = ALL_MATS.map((m) => m.id);
    const availableMatIds = availableMats.available.map((m) => m.id);
    return allMatIds.filter((id) => !availableMatIds.includes(id));
  }, [availableMats]);

  // Calculate plaque positioning (only when plaque is enabled and mat exists)
  const plaquePositioning = useMemo(() => {
    if (!brassNameplateConfig.enabled || matType === "none") return null;

    // Nameplate dimensions in preview pixels
    const plaqueWidthPx = BRASS_NAMEPLATE_SPECS.NAMEPLATE_WIDTH * layout.scale;
    const plaqueHeightPx = BRASS_NAMEPLATE_SPECS.NAMEPLATE_HEIGHT * layout.scale;
    const clearanceFromOpeningPx = 1.0 * layout.scale; // 1" below mat opening

    // BrassNameplatePreview uses 150 DPI internally, so we need to normalize
    // the scale to convert from its 150 DPI base to our preview pixels
    const nameplateRenderScale = layout.scale / 150;

    // Calculate opening bottom position relative to preview-stage
    // For double mat, the outer mat opening includes the inner mat reveal around the artwork
    // Opening top = frameFace + matTop, Opening bottom = Opening top + reveal + artwork + reveal
    const matRevealPx = matType === "double" ? matReveal * layout.scale : 0;
    const openingBottomY =
      layout.frameFacePx + layout.matTopPx + layout.openingPx.h + 2 * matRevealPx;

    // Position plaque 1" below the opening bottom
    const plaqueY = openingBottomY + clearanceFromOpeningPx;

    // Center horizontally within the frame
    const plaqueX = ((layout.outerPx?.w ?? 0) - plaqueWidthPx) / 2;

    return {
      x: plaqueX,
      y: plaqueY,
      width: plaqueWidthPx,
      height: plaqueHeightPx,
      renderScale: nameplateRenderScale,
    };
  }, [brassNameplateConfig.enabled, matType, layout, matReveal]);

  return (
    <>
      <div ref={configuratorRef} className="min-h-screen bg-background">
        <div className="container mx-auto py-4 md:py-8 px-4">
          <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
            {/* Left Column - Preview */}
            <div
              className={`space-y-4 ${mobileView === "controls" ? "hidden md:block" : "block"} lg:sticky lg:top-[132px] lg:self-start`}
            >
              <Card ref={previewCardRef} className="p-4 md:p-6">
                <div
                  ref={containerRef}
                  className="preview-wrap bg-muted rounded-md flex items-center justify-center relative group"
                  style={{ minHeight: `${previewContainerHeight}px` }}
                  data-testid="preview-container"
                  onMouseEnter={() => {}}
                >
                  {/* Fullscreen button - only control in preview */}
                  <div className="absolute top-4 right-4 z-20">
                    <button
                      onClick={() => {
                        setFullscreenImage("preview");
                        setFullImageOpen(true);
                      }}
                      className="bg-background/90 hover:bg-background p-2 rounded-md shadow-lg hover-elevate active-elevate-2"
                      data-testid="button-expand-preview"
                      title="Fullscreen preview"
                    >
                      <Maximize className="h-5 w-5" />
                    </button>
                  </div>

                  {framePhotos.topUrl &&
                  framePhotos.bottomUrl &&
                  framePhotos.leftUrl &&
                  framePhotos.rightUrl ? (
                    // Photo-based 2D preview - four-piece frame construction with pre-oriented images
                    <div
                      className="preview-stage"
                      style={{
                        width: `${layout.outerPx.w}px`,
                        height: `${layout.outerPx.h}px`,
                        position: "relative",
                      }}
                    >
                      {/* Top frame piece - pre-oriented with decorative edge facing down */}
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
                          clipPath: `polygon(
                  0 0, 
                  100% 0, 
                  calc(100% - ${layout.frameFacePx}px) 100%, 
                  ${layout.frameFacePx}px 100%
                )`,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                      />

                      {/* Bottom frame piece - pre-oriented with decorative edge facing up */}
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
                          clipPath: `polygon(
                  ${layout.frameFacePx}px 0, 
                  calc(100% - ${layout.frameFacePx}px) 0, 
                  100% 100%, 
                  0 100%
                )`,
                          boxShadow: "0 -2px 8px rgba(0,0,0,0.15)",
                        }}
                      />

                      {/* Left frame piece - pre-oriented with decorative edge facing right */}
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
                          clipPath: `polygon(
                  0 0, 
                  100% ${layout.frameFacePx}px, 
                  100% calc(100% - ${layout.frameFacePx}px), 
                  0 100%
                )`,
                          boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
                        }}
                      />

                      {/* Right frame piece - pre-oriented with decorative edge facing left */}
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
                          clipPath: `polygon(
                  0 ${layout.frameFacePx}px, 
                  100% 0, 
                  100% 100%, 
                  0 calc(100% - ${layout.frameFacePx}px)
                )`,
                          boxShadow: "-2px 0 8px rgba(0,0,0,0.15)",
                        }}
                      />

                      {/* Lighting blend overlays for smooth transitions at corners */}
                      {/* Top-left corner blend */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: `${layout.frameFacePx * 1.5}px`,
                          height: `${layout.frameFacePx * 1.5}px`,
                          background:
                            "radial-gradient(circle at top left, rgba(255,255,255,0.03) 0%, transparent 70%)",
                          pointerEvents: "none",
                          mixBlendMode: "overlay",
                        }}
                      />

                      {/* Top-right corner blend */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: `${layout.frameFacePx * 1.5}px`,
                          height: `${layout.frameFacePx * 1.5}px`,
                          background:
                            "radial-gradient(circle at top right, rgba(255,255,255,0.03) 0%, transparent 70%)",
                          pointerEvents: "none",
                          mixBlendMode: "overlay",
                        }}
                      />

                      {/* Bottom-left corner blend */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: `${layout.frameFacePx * 1.5}px`,
                          height: `${layout.frameFacePx * 1.5}px`,
                          background:
                            "radial-gradient(circle at bottom left, rgba(255,255,255,0.03) 0%, transparent 70%)",
                          pointerEvents: "none",
                          mixBlendMode: "overlay",
                        }}
                      />

                      {/* Bottom-right corner blend */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: `${layout.frameFacePx * 1.5}px`,
                          height: `${layout.frameFacePx * 1.5}px`,
                          background:
                            "radial-gradient(circle at bottom right, rgba(255,255,255,0.03) 0%, transparent 70%)",
                          pointerEvents: "none",
                          mixBlendMode: "overlay",
                        }}
                      />

                      {/* Mat and artwork area */}
                      <div
                        style={{
                          position: "absolute",
                          top: `${layout.frameFacePx}px`,
                          left: `${layout.frameFacePx}px`,
                          right: `${layout.frameFacePx}px`,
                          bottom: `${layout.frameFacePx}px`,
                          boxShadow:
                            matType !== "none"
                              ? "inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.08)"
                              : "inset 0 0 20px rgba(0,0,0,0.3)",
                          ...(matType !== "none"
                            ? getMatTilingStyle(
                                selectedMat.name,
                                layout.scale,
                                selectedMat.hexColor
                              )
                            : { backgroundColor: "white" }),
                          transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                        }}
                        data-testid="preview-frame"
                      >
                        {matType === "double" ? (
                          <div
                            style={{
                              position: "absolute",
                              top: `${asymmetricMatLayout.openingY - layout.frameFacePx}px`,
                              left: `${asymmetricMatLayout.openingX - layout.frameFacePx}px`,
                              width: `${asymmetricMatLayout.openingWidth + matReveal * 2 * layout.scale}px`,
                              height: `${asymmetricMatLayout.openingHeight + matReveal * 2 * layout.scale}px`,
                              padding: `${matReveal * layout.scale}px`,
                              ...getMatTilingStyle(
                                selectedMatInner.name,
                                layout.scale,
                                selectedMatInner.hexColor
                              ),
                              border: `${Math.max(1.5, layout.scale * 0.06)}px solid #F5F5F0`,
                              boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                              transition:
                                "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                // Bottom mat beveled edge (1/16" inner border - black for some mats, off-white for others)
                                boxShadow: `inset 0 0 0 ${Math.max(1.5, layout.scale * 0.1)}px ${getMatBevelColor(selectedMatInner.name)}`,
                                backgroundColor: "white",
                                position: "relative",
                                transition:
                                  "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                              }}
                            >
                              {previousImage && (
                                <img
                                  src={previousImage}
                                  alt="Previous"
                                  className="image-fade-out"
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              )}
                              <img
                                src={displayImage}
                                alt="Preview"
                                className={previousImage ? "image-fade-in" : ""}
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              position: "absolute",
                              top: `${asymmetricMatLayout.openingY - layout.frameFacePx}px`,
                              left: `${asymmetricMatLayout.openingX - layout.frameFacePx}px`,
                              width: `${asymmetricMatLayout.openingWidth}px`,
                              height: `${asymmetricMatLayout.openingHeight}px`,
                              backgroundColor: "white",
                              // Mat beveled edge (1/16" inner border - black for some mats, off-white for others)
                              boxShadow:
                                matType !== "none"
                                  ? `inset 0 0 0 ${Math.max(1.5, layout.scale * 0.1)}px ${getMatBevelColor(selectedMat.name)}`
                                  : "none",
                              transition:
                                "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                            }}
                          >
                            {previousImage && (
                              <img
                                src={previousImage}
                                alt="Previous"
                                className="image-fade-out"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                            <img
                              src={displayImage}
                              alt="Preview"
                              className={previousImage ? "image-fade-in" : ""}
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        )}

                        {/* Photo opening for multi-opening layouts (photo-based preview) */}
                        {photoOpeningLayout && matType === "double" ? (
                          <div
                            style={{
                              position: "absolute",
                              top: `${photoOpeningLayout.y - layout.frameFacePx}px`,
                              left: `${photoOpeningLayout.x - layout.frameFacePx}px`,
                              width: `${photoOpeningLayout.width + matReveal * 2 * layout.scale}px`,
                              height: `${photoOpeningLayout.height + matReveal * 2 * layout.scale}px`,
                              padding: `${matReveal * layout.scale}px`,
                              ...getMatTilingStyle(
                                selectedMatInner.name,
                                layout.scale,
                                selectedMatInner.hexColor
                              ),
                              border: `${Math.max(1.5, layout.scale * 0.06)}px solid #F5F5F0`,
                              boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                              transition:
                                "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                            }}
                            data-testid="preview-photo-opening-outer"
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: "white",
                                boxShadow: `inset 0 0 0 ${Math.max(1.5, layout.scale * 0.1)}px ${getMatBevelColor(selectedMatInner.name)}`,
                              }}
                              data-testid="preview-photo-opening"
                            >
                              {photoImage ? (
                                <img
                                  src={photoImage}
                                  alt="Graduation photo"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                  data-testid="img-photo-preview"
                                />
                              ) : (
                                <div
                                  className="w-full h-full flex flex-col items-center justify-center bg-muted/30"
                                  style={{ gap: `${Math.max(4, layout.scale * 0.3)}px` }}
                                >
                                  <ImageIcon
                                    className="text-muted-foreground/50"
                                    style={{
                                      width: `${Math.max(16, layout.scale * 1.5)}px`,
                                      height: `${Math.max(16, layout.scale * 1.5)}px`,
                                    }}
                                  />
                                  <span
                                    className="text-muted-foreground/60 text-center px-1"
                                    style={{ fontSize: `${Math.max(8, layout.scale * 0.6)}px` }}
                                  >
                                    {photoSize} Photo
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          photoOpeningLayout && (
                            <div
                              style={{
                                position: "absolute",
                                top: `${photoOpeningLayout.y - layout.frameFacePx}px`,
                                left: `${photoOpeningLayout.x - layout.frameFacePx}px`,
                                width: `${photoOpeningLayout.width}px`,
                                height: `${photoOpeningLayout.height}px`,
                                backgroundColor: "white",
                                boxShadow:
                                  matType !== "none"
                                    ? `inset 0 0 0 ${Math.max(1.5, layout.scale * 0.1)}px ${getMatBevelColor(selectedMat.name)}`
                                    : "none",
                                transition:
                                  "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                              }}
                              data-testid="preview-photo-opening"
                            >
                              {photoImage ? (
                                <img
                                  src={photoImage}
                                  alt="Graduation photo"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                  data-testid="img-photo-preview"
                                />
                              ) : (
                                <div
                                  className="w-full h-full flex flex-col items-center justify-center bg-muted/30"
                                  style={{ gap: `${Math.max(4, layout.scale * 0.3)}px` }}
                                >
                                  <ImageIcon
                                    className="text-muted-foreground/50"
                                    style={{
                                      width: `${Math.max(16, layout.scale * 1.5)}px`,
                                      height: `${Math.max(16, layout.scale * 1.5)}px`,
                                    }}
                                  />
                                  <span
                                    className="text-muted-foreground/60 text-center px-1"
                                    style={{ fontSize: `${Math.max(8, layout.scale * 0.6)}px` }}
                                  >
                                    {photoSize} Photo
                                  </span>
                                </div>
                              )}
                            </div>
                          )
                        )}

                        {/* Tassel opening for tassel layouts (photo-based preview) */}
                        {tasselOpeningLayout && matType === "double" ? (
                          <div
                            style={{
                              position: "absolute",
                              top: `${tasselOpeningLayout.y - layout.frameFacePx}px`,
                              left: `${tasselOpeningLayout.x - layout.frameFacePx}px`,
                              width: `${tasselOpeningLayout.width + matReveal * 2 * layout.scale}px`,
                              height: `${tasselOpeningLayout.height + matReveal * 2 * layout.scale}px`,
                              padding: `${matReveal * layout.scale}px`,
                              ...getMatTilingStyle(
                                selectedMatInner.name,
                                layout.scale,
                                selectedMatInner.hexColor
                              ),
                              border: `${Math.max(1.5, layout.scale * 0.06)}px solid #F5F5F0`,
                              boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                              borderRadius: "2px",
                              transition:
                                "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                            }}
                            data-testid="preview-tassel-opening-outer"
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#f8f6f3",
                                boxShadow: `inset 0 0 0 ${Math.max(2, layout.scale * 0.15)}px ${getMatBevelColor(selectedMatInner.name)}, inset 0 2px 8px rgba(0,0,0,0.15)`,
                                borderRadius: "1px",
                              }}
                              className="overflow-hidden"
                              data-testid="preview-tassel-opening"
                            >
                              <TasselIcon />
                            </div>
                          </div>
                        ) : (
                          tasselOpeningLayout && (
                            <div
                              style={{
                                position: "absolute",
                                top: `${tasselOpeningLayout.y - layout.frameFacePx}px`,
                                left: `${tasselOpeningLayout.x - layout.frameFacePx}px`,
                                width: `${tasselOpeningLayout.width}px`,
                                height: `${tasselOpeningLayout.height}px`,
                                backgroundColor: "#f8f6f3",
                                boxShadow:
                                  matType !== "none"
                                    ? `inset 0 0 0 ${Math.max(2, layout.scale * 0.15)}px ${getMatBevelColor(selectedMat.name)}, inset 0 2px 8px rgba(0,0,0,0.15)`
                                    : "inset 0 2px 8px rgba(0,0,0,0.1)",
                                borderRadius: "2px",
                              }}
                              data-testid="preview-tassel-opening"
                            >
                              <TasselIcon />
                            </div>
                          )
                        )}
                      </div>

                      {/* Brass plaque preview (positioned below mat opening) */}
                      {plaquePositioning && (
                        <div
                          style={{
                            position: "absolute",
                            left: `${plaquePositioning.x}px`,
                            top: `${plaquePositioning.y}px`,
                            zIndex: 15,
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
                    // Synthetic 2D preview (fallback for frames without photos)
                    <div
                      className="preview-stage"
                      style={{
                        width: `${layout.outerPx.w}px`,
                        height: `${layout.outerPx.h}px`,
                      }}
                    >
                      <div
                        style={{
                          width: `${layout.outerPx.w}px`,
                          height: `${layout.outerPx.h}px`,
                          borderTop: `${layout.frameFacePx}px solid ${selectedFrame.borderColor}`,
                          borderLeft: `${layout.frameFacePx}px solid ${selectedFrame.borderColor}`,
                          borderRight: `${layout.frameFacePx}px solid ${selectedFrame.color}`,
                          borderBottom: `${layout.frameFacePx}px solid ${selectedFrame.color}`,
                          boxShadow:
                            matType !== "none"
                              ? "inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.2)"
                              : "inset 0 0 20px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.2)",
                          position: "relative",
                          ...(matType !== "none"
                            ? getMatTilingStyle(
                                selectedMat.name,
                                layout.scale,
                                selectedMat.hexColor
                              )
                            : { backgroundColor: "white" }),
                          transition:
                            "border-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0), background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                        }}
                        data-testid="preview-frame"
                      >
                        {matType === "double" ? (
                          <div
                            style={{
                              position: "absolute",
                              top: `${asymmetricMatLayout.openingY - layout.frameFacePx}px`,
                              left: `${asymmetricMatLayout.openingX - layout.frameFacePx}px`,
                              width: `${asymmetricMatLayout.openingWidth + matReveal * 2 * layout.scale}px`,
                              height: `${asymmetricMatLayout.openingHeight + matReveal * 2 * layout.scale}px`,
                              padding: `${matReveal * layout.scale}px`,
                              ...getMatTilingStyle(
                                selectedMatInner.name,
                                layout.scale,
                                selectedMatInner.hexColor
                              ),
                              border: `${Math.max(1.5, layout.scale * 0.06)}px solid #F5F5F0`,
                              boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                              transition:
                                "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                // Bottom mat beveled edge (1/16" inner border - black for some mats, off-white for others)
                                boxShadow: `inset 0 0 0 ${Math.max(1.5, layout.scale * 0.1)}px ${getMatBevelColor(selectedMatInner.name)}`,
                                backgroundColor: "white",
                                position: "relative",
                                transition:
                                  "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                              }}
                            >
                              {selectedImage ? (
                                <>
                                  {/* Previous image fading out */}
                                  {previousImage && (
                                    <img
                                      src={previousImage}
                                      alt="Previous"
                                      className="image-fade-out"
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  )}
                                  {/* Current image fading in */}
                                  <img
                                    src={selectedImage}
                                    alt="Preview"
                                    className={previousImage ? "image-fade-in" : ""}
                                    style={{
                                      position: previousImage ? "absolute" : "static",
                                      top: 0,
                                      left: 0,
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                    data-testid="img-preview"
                                  />
                                </>
                              ) : (
                                <img
                                  src={placeholderImage}
                                  alt="Placeholder"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                  data-testid="img-placeholder"
                                />
                              )}
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              position: "absolute",
                              top: `${asymmetricMatLayout.openingY - layout.frameFacePx}px`,
                              left: `${asymmetricMatLayout.openingX - layout.frameFacePx}px`,
                              width: `${asymmetricMatLayout.openingWidth}px`,
                              height: `${asymmetricMatLayout.openingHeight}px`,
                              backgroundColor: "white",
                              // Mat beveled edge (1/16" inner border - black for some mats, off-white for others)
                              boxShadow:
                                matType !== "none"
                                  ? `inset 0 0 0 ${Math.max(1.5, layout.scale * 0.1)}px ${getMatBevelColor(selectedMat.name)}`
                                  : "none",
                              transition:
                                "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                            }}
                          >
                            {previousImage && (
                              <img
                                src={previousImage}
                                alt="Previous"
                                className="image-fade-out"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                            <img
                              src={displayImage}
                              alt="Preview"
                              className={previousImage ? "image-fade-in" : ""}
                              style={{
                                position: previousImage ? "absolute" : "static",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              data-testid="img-preview"
                            />
                          </div>
                        )}

                        {/* Photo opening for multi-opening layouts (synthetic preview) */}
                        {photoOpeningLayout && matType === "double" ? (
                          <div
                            style={{
                              position: "absolute",
                              top: `${photoOpeningLayout.y - layout.frameFacePx}px`,
                              left: `${photoOpeningLayout.x - layout.frameFacePx}px`,
                              width: `${photoOpeningLayout.width + matReveal * 2 * layout.scale}px`,
                              height: `${photoOpeningLayout.height + matReveal * 2 * layout.scale}px`,
                              padding: `${matReveal * layout.scale}px`,
                              ...getMatTilingStyle(
                                selectedMatInner.name,
                                layout.scale,
                                selectedMatInner.hexColor
                              ),
                              border: `${Math.max(1.5, layout.scale * 0.06)}px solid #F5F5F0`,
                              boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                              transition:
                                "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                            }}
                            data-testid="preview-photo-opening-outer"
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: "white",
                                boxShadow: `inset 0 0 0 ${Math.max(1.5, layout.scale * 0.1)}px ${getMatBevelColor(selectedMat.name)}`,
                              }}
                              data-testid="preview-photo-opening-synthetic"
                            >
                              {photoImage ? (
                                <img
                                  src={photoImage}
                                  alt="Graduation photo"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <div
                                  className="w-full h-full flex flex-col items-center justify-center bg-muted/30"
                                  style={{ gap: `${Math.max(4, layout.scale * 0.3)}px` }}
                                >
                                  <ImageIcon
                                    className="text-muted-foreground/50"
                                    style={{
                                      width: `${Math.max(16, layout.scale * 1.5)}px`,
                                      height: `${Math.max(16, layout.scale * 1.5)}px`,
                                    }}
                                  />
                                  <span
                                    className="text-muted-foreground/60 text-center px-1"
                                    style={{ fontSize: `${Math.max(8, layout.scale * 0.6)}px` }}
                                  >
                                    {photoSize} Photo
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          photoOpeningLayout && (
                            <div
                              style={{
                                position: "absolute",
                                top: `${photoOpeningLayout.y - layout.frameFacePx}px`,
                                left: `${photoOpeningLayout.x - layout.frameFacePx}px`,
                                width: `${photoOpeningLayout.width}px`,
                                height: `${photoOpeningLayout.height}px`,
                                backgroundColor: "white",
                                boxShadow:
                                  matType !== "none"
                                    ? `inset 0 0 0 ${Math.max(1.5, layout.scale * 0.1)}px ${getMatBevelColor(selectedMat.name)}`
                                    : "none",
                                transition:
                                  "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                              }}
                              data-testid="preview-photo-opening-synthetic"
                            >
                              {photoImage ? (
                                <img
                                  src={photoImage}
                                  alt="Graduation photo"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <div
                                  className="w-full h-full flex flex-col items-center justify-center bg-muted/30"
                                  style={{ gap: `${Math.max(4, layout.scale * 0.3)}px` }}
                                >
                                  <ImageIcon
                                    className="text-muted-foreground/50"
                                    style={{
                                      width: `${Math.max(16, layout.scale * 1.5)}px`,
                                      height: `${Math.max(16, layout.scale * 1.5)}px`,
                                    }}
                                  />
                                  <span
                                    className="text-muted-foreground/60 text-center px-1"
                                    style={{ fontSize: `${Math.max(8, layout.scale * 0.6)}px` }}
                                  >
                                    {photoSize} Photo
                                  </span>
                                </div>
                              )}
                            </div>
                          )
                        )}

                        {/* Tassel opening for tassel layouts (synthetic preview) */}
                        {tasselOpeningLayout && matType === "double" ? (
                          <div
                            style={{
                              position: "absolute",
                              top: `${tasselOpeningLayout.y - layout.frameFacePx}px`,
                              left: `${tasselOpeningLayout.x - layout.frameFacePx}px`,
                              width: `${tasselOpeningLayout.width + matReveal * 2 * layout.scale}px`,
                              height: `${tasselOpeningLayout.height + matReveal * 2 * layout.scale}px`,
                              padding: `${matReveal * layout.scale}px`,
                              ...getMatTilingStyle(
                                selectedMatInner.name,
                                layout.scale,
                                selectedMatInner.hexColor
                              ),
                              border: `${Math.max(1.5, layout.scale * 0.06)}px solid #F5F5F0`,
                              boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                              borderRadius: "2px",
                              transition:
                                "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                            }}
                            data-testid="preview-tassel-opening-outer"
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#f8f6f3",
                                boxShadow: `inset 0 0 0 ${Math.max(2, layout.scale * 0.15)}px ${getMatBevelColor(selectedMat.name)}, inset 0 2px 8px rgba(0,0,0,0.15)`,
                                borderRadius: "1px",
                              }}
                              className="overflow-hidden"
                              data-testid="preview-tassel-opening-synthetic"
                            >
                              <TasselIcon />
                            </div>
                          </div>
                        ) : (
                          tasselOpeningLayout && (
                            <div
                              style={{
                                position: "absolute",
                                top: `${tasselOpeningLayout.y - layout.frameFacePx}px`,
                                left: `${tasselOpeningLayout.x - layout.frameFacePx}px`,
                                width: `${tasselOpeningLayout.width}px`,
                                height: `${tasselOpeningLayout.height}px`,
                                backgroundColor: "#f8f6f3",
                                boxShadow:
                                  matType !== "none"
                                    ? `inset 0 0 0 ${Math.max(2, layout.scale * 0.15)}px ${getMatBevelColor(selectedMat.name)}, inset 0 2px 8px rgba(0,0,0,0.15)`
                                    : "inset 0 2px 8px rgba(0,0,0,0.1)",
                                borderRadius: "2px",
                              }}
                              data-testid="preview-tassel-opening-synthetic"
                            >
                              <TasselIcon />
                            </div>
                          )
                        )}
                      </div>

                      {/* Brass plaque preview (positioned below mat opening) */}
                      {plaquePositioning && (
                        <div
                          style={{
                            position: "absolute",
                            left: `${plaquePositioning.x}px`,
                            top: `${plaquePositioning.y}px`,
                            zIndex: 15,
                          }}
                        >
                          <BrassNameplatePreview
                            config={brassNameplateConfig}
                            scale={plaquePositioning.renderScale}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      Finished Size:{" "}
                      <span className="text-primary">
                        {formatDimension(frameWidth)}&quot; × {formatDimension(frameHeight)}&quot;
                      </span>
                    </p>
                    {selectedFrame.dimensionalDiagram && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="p-0">
                          <img
                            src={selectedFrame.dimensionalDiagram}
                            alt="Dimensional diagram"
                            className="max-w-[300px] rounded-md"
                          />
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {oversizeFee > 0 && (
                      <span className="text-xs text-yellow-600 dark:text-yellow-500 font-medium">
                        (Oversize Fee Applied)
                      </span>
                    )}
                    {isTooLarge && (
                      <span className="text-xs text-red-600 dark:text-red-500 font-medium">
                        (Too Large - Contact Us)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Artwork: {formatDimension(artW)}&quot; × {formatDimension(artH)}&quot;
                    {matType !== "none" && ` • Mat Border: ${formatDimension(matBorder)}"`}
                    {matType === "double" && ` • Reveal: ${formatDimension(matReveal)}"`}
                  </p>
                </div>
              </Card>

              {/* Frame Photos Section (Desktop Only) */}
              <div className="hidden lg:grid lg:grid-cols-3 gap-4">
                {framePhotos.cornerUrl && (
                  <Card
                    className="p-3 cursor-pointer hover-elevate active-elevate-2"
                    onClick={() => {
                      setFullscreenImage("corner");
                      setFullImageOpen(true);
                    }}
                  >
                    <img
                      src={framePhotos.cornerUrl}
                      alt="Frame corner detail"
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                    <p className="text-xs text-center text-muted-foreground">Corner Detail</p>
                  </Card>
                )}
                {framePhotos.profileUrl && (
                  <Card
                    className="p-3 cursor-pointer hover-elevate active-elevate-2"
                    onClick={() => {
                      setFullscreenImage("profile");
                      setFullImageOpen(true);
                    }}
                  >
                    <img
                      src={framePhotos.profileUrl}
                      alt="Frame profile view"
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                    <p className="text-xs text-center text-muted-foreground">Profile View</p>
                  </Card>
                )}
                {framePhotos.lifestyleUrl && (
                  <Card
                    className="p-3 cursor-pointer hover-elevate active-elevate-2"
                    onClick={() => {
                      setFullscreenImage("lifestyle");
                      setFullImageOpen(true);
                    }}
                  >
                    <img
                      src={framePhotos.lifestyleUrl}
                      alt="Frame lifestyle example"
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                    <p className="text-xs text-center text-muted-foreground">Lifestyle Example</p>
                  </Card>
                )}
              </div>
            </div>

            {/* Right Column - Controls */}
            <div className={`space-y-4 ${mobileView === "preview" ? "hidden md:block" : "block"}`}>
              <h2 ref={controlsHeadingRef} className="text-xl md:text-2xl font-semibold mb-4">
                Customize Your Diploma Frame
              </h2>

              <Accordion
                type="multiple"
                defaultValue={[
                  "layout",
                  "diploma-size",
                  "size",
                  "frame",
                  "mat",
                  "nameplate",
                  "glass",
                  "hardware",
                ]}
                className="w-full"
              >
                {/* Layout Selection Section */}
                <AccordionItem value="layout">
                  <AccordionTrigger data-testid="accordion-layout">Frame Layout</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      {DIPLOMA_LAYOUTS.map((layout) => {
                        const IconComponent = layout.icon;
                        const isSelected = layoutType === layout.id;

                        return (
                          <button
                            key={layout.id}
                            onClick={() => handleLayoutChange(layout.id)}
                            className={`p-4 rounded-md border-2 text-left hover-elevate active-elevate-2 flex items-start gap-4 ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border bg-background"
                            }`}
                            data-testid={`button-layout-${layout.id}`}
                          >
                            <div
                              className={`p-2 rounded-lg flex-shrink-0 ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-sm">{layout.label}</p>
                                {layout.requiresShadowbox && (
                                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded">
                                    Shadowbox
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {layout.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Photo Size Options - shown when layout has photo opening */}
                    {currentLayout.hasPhotoOpening && (
                      <div className="pt-2">
                        <Label className="text-sm font-medium mb-2 block">Photo Opening Size</Label>
                        <div className="flex gap-2">
                          {PHOTO_SIZE_OPTIONS.map((option) => (
                            <Button
                              key={option.id}
                              type="button"
                              variant={photoSize === option.id ? "default" : "outline"}
                              onClick={() => setPhotoSize(option.id)}
                              className="flex-1"
                              data-testid={`button-photo-size-${option.id}`}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Standard portrait photo sizes for your graduation photo
                        </p>
                      </div>
                    )}

                    {/* Shadowbox info for tassel layout */}
                    {currentLayout.requiresShadowbox && (
                      <Alert className="mt-3">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Tassel layouts use shadowbox frames with 1&quot; depth to accommodate
                          hanging tassels. We&apos;ve automatically selected a compatible frame
                          style.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Photo Upload Section - shown when layout has photo opening */}
                    {currentLayout.hasPhotoOpening && (
                      <div className="pt-4 border-t mt-4">
                        <Label className="text-sm font-medium mb-3 block">
                          Upload Graduation Photo
                        </Label>

                        {/* Hidden file input */}
                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          data-testid="input-photo-upload"
                        />

                        {photoImage ? (
                          <div className="space-y-3">
                            <div className="relative">
                              <img
                                src={photoImage}
                                alt="Uploaded graduation photo"
                                className="w-full max-h-40 object-contain rounded-lg border"
                                data-testid="img-graduation-photo-preview"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7"
                                onClick={() => {
                                  setPhotoImage(null);
                                  setPhotoImageAspectRatio(null);
                                  if (photoInputRef.current) {
                                    photoInputRef.current.value = "";
                                  }
                                }}
                                data-testid="button-remove-photo"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => photoInputRef.current?.click()}
                              data-testid="button-change-photo"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Change Photo
                            </Button>
                          </div>
                        ) : (
                          <div
                            onClick={() => photoInputRef.current?.click()}
                            className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                            data-testid="dropzone-graduation-photo"
                          >
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="font-medium">Upload Graduation Photo</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Click to select an image file
                            </p>
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground mt-2">
                          Optional: Your photo will appear in the {photoSize} opening
                        </p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Diploma/Certificate Size Preset Section */}
                <AccordionItem value="diploma-size">
                  <AccordionTrigger data-testid="accordion-diploma-size">
                    Diploma/Certificate Size
                  </AccordionTrigger>
                  <AccordionContent>
                    {/* Custom size button */}
                    <button
                      onClick={() => setSelectedDiplomaSize(null)}
                      className={`w-full p-3 rounded-md border-2 text-center hover-elevate active-elevate-2 ${
                        !selectedDiplomaSize
                          ? "border-primary bg-primary/5 font-semibold"
                          : "border-border bg-background"
                      }`}
                      data-testid="button-diploma-custom"
                    >
                      <p className="font-semibold text-sm">Custom Size</p>
                    </button>

                    {/* Grid of all diploma sizes */}
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {DIPLOMA_SIZES.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => {
                            setSelectedDiplomaSize(size);
                            setArtworkWidth(size.documentWidth.toString());
                            setArtworkHeight(size.documentHeight.toString());
                          }}
                          className={`p-3 rounded-md border-2 text-center hover-elevate active-elevate-2 ${
                            selectedDiplomaSize?.id === size.id
                              ? "border-primary bg-primary/5 font-semibold"
                              : "border-border bg-background"
                          }`}
                          data-testid={`button-diploma-${size.id}`}
                        >
                          <p className="font-semibold text-sm">
                            {size.documentWidth}&quot; × {size.documentHeight}&quot;
                          </p>
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Custom Size Section (only shows when Custom is selected) */}
                {(!selectedDiplomaSize || selectedDiplomaSize.id === "custom") && (
                  <AccordionItem value="size">
                    <AccordionTrigger data-testid="accordion-size">Custom Size</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex gap-3">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor="width">Diploma Width (inches)</Label>
                          <Input
                            id="width"
                            value={artworkWidth}
                            onChange={(e) => handleWidthChange(e.target.value)}
                            onFocus={(e) => {
                              setTimeout(() => {
                                e.target.scrollIntoView({ behavior: "smooth", block: "center" });
                              }, 300);
                            }}
                            placeholder="e.g., 16 or 16 1/2"
                            className={
                              !isValidDimensions && artworkWidth ? "border-destructive" : ""
                            }
                            data-testid="input-width"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label htmlFor="height">Diploma Height (inches)</Label>
                          <Input
                            id="height"
                            value={artworkHeight}
                            onChange={(e) => setArtworkHeight(e.target.value)}
                            onFocus={(e) => {
                              setTimeout(() => {
                                e.target.scrollIntoView({ behavior: "smooth", block: "center" });
                              }, 300);
                            }}
                            placeholder="e.g., 20 or 20 3/4"
                            className={
                              !isValidDimensions && artworkHeight ? "border-destructive" : ""
                            }
                            disabled={
                              serviceType === "print-and-frame" &&
                              uploadedImageAspectRatio !== null &&
                              selectedImage !== null
                            }
                            data-testid="input-height"
                          />
                        </div>
                      </div>
                      {artworkSizeValidation && !artworkSizeValidation.valid && artworkWidth && (
                        <p className="text-xs text-destructive">{artworkSizeValidation.message}</p>
                      )}
                      {serviceType === "print-and-frame" &&
                        uploadedImageAspectRatio !== null &&
                        selectedImage !== null && (
                          <p className="text-xs text-muted-foreground">
                            Height is locked to maintain image aspect ratio
                          </p>
                        )}
                      <p className="text-xs text-muted-foreground">
                        Min 4&quot;. Decimals or fractions accepted (e.g., 16.5 or 16 1/2)
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                )}

                <AccordionItem value="frame">
                  <AccordionTrigger data-testid="accordion-frame">Frame Style</AccordionTrigger>
                  <AccordionContent>
                    <div className="md:max-h-[400px] md:overflow-y-auto md:pr-2">
                      <div className="grid grid-cols-2 gap-2">
                        {frameStyles.map((frame) => (
                          <button
                            key={frame.id}
                            onClick={() => setSelectedFrame(frame)}
                            className={`p-3 rounded-md border-2 text-left hover-elevate active-elevate-2 ${
                              selectedFrame.id === frame.id
                                ? "border-primary"
                                : "border-transparent"
                            }`}
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
                            <p className="font-medium text-sm mb-1">{frame.name}</p>
                            {frame.shortDescription && (
                              <p
                                className="text-xs text-muted-foreground/80 mb-1.5 italic"
                                data-testid="text-frame-short-description"
                              >
                                {frame.shortDescription}
                              </p>
                            )}
                            <div className="space-y-0.5 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <svg
                                  className="w-3 h-3 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                  />
                                </svg>
                                <span>Width: {frame.mouldingWidth}&quot;</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <svg
                                  className="w-3 h-3 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                                  />
                                </svg>
                                <span>Depth: {frame.usableDepth}&quot;</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mat">
                  <AccordionTrigger data-testid="accordion-mat">Mat Board</AccordionTrigger>
                  <AccordionContent className="space-y-4">
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

                    {matType !== "none" && (
                      <>
                        <div className="space-y-3">
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
                            min={1.5}
                            max={8}
                            step={0.25}
                            value={[matBorder]}
                            onValueChange={(values) => setMatBorderWidth(String(values[0] ?? 2.5))}
                            data-testid="slider-mat-border"
                          />
                          <p className="text-xs text-muted-foreground">
                            {brassNameplateConfig.enabled
                              ? 'Bottom border auto-extends to 3.75" for plaque'
                              : 'Adjust the width of the mat border (1.5" - 8")'}
                          </p>

                          <BottomWeightedMatting
                            checked={bottomWeighted}
                            onCheckedChange={setBottomWeighted}
                          />
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
                            onSelect={(mat) => {
                              if (disabledMatIds.includes(mat.id)) {
                                toast({
                                  title: "Color Not Available",
                                  description: "This color is not available for oversize mats.",
                                  variant: "destructive",
                                });
                                return;
                              }
                              setSelectedMat(mat);
                            }}
                            disabledColors={disabledMatIds}
                            disabledTooltip="Not available for oversize mats"
                            testIdPrefix="mat"
                          />
                        </div>

                        {matType === "double" && (
                          <>
                            {/* Visual separator for double mat sections */}
                            <Separator className="my-6" />

                            <div className="space-y-3">
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
                                onValueChange={(values) =>
                                  setMatRevealWidth(String(values[0] ?? 0.25))
                                }
                                data-testid="slider-mat-reveal"
                              />
                            </div>

                            <div className="space-y-3 pt-4 pb-3 px-3 md:px-0 bg-muted/40 md:bg-transparent rounded-lg">
                              <Label className="text-base font-semibold">
                                Accent Mat: {selectedMatInner.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Thin border mat visible around the opening
                              </p>

                              <ColorSwatchesWithSeparator
                                standardColors={standardMats}
                                premiumColors={premiumMats}
                                selectedId={selectedMatInner.id}
                                onSelect={(mat) => {
                                  if (disabledMatIds.includes(mat.id)) {
                                    toast({
                                      title: "Color Not Available",
                                      description: "This color is not available for oversize mats.",
                                      variant: "destructive",
                                    });
                                    return;
                                  }
                                  setSelectedMatInner(mat);
                                }}
                                disabledColors={disabledMatIds}
                                disabledTooltip="Not available for oversize mats"
                                testIdPrefix="mat-inner"
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
                    <AccordionTrigger data-testid="accordion-nameplate">
                      Engraved Brass Nameplate
                    </AccordionTrigger>
                    <AccordionContent>
                      <BrassNameplateSection
                        config={brassNameplateConfig}
                        onChange={setBrassNameplateConfig}
                        className=""
                      />
                    </AccordionContent>
                  </AccordionItem>
                )}

                <AccordionItem value="glass">
                  <AccordionTrigger data-testid="accordion-glass">
                    Glazing & Backing
                  </AccordionTrigger>
                  <AccordionContent>
                    <RadioGroup
                      value={selectedGlass?.id ?? glassTypes[0]?.id}
                      onValueChange={(id) =>
                        setSelectedGlass(glassTypes.find((g) => g.id === id) ?? glassTypes[0]!)
                      }
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

                <AccordionItem value="hardware" ref={hardwareSectionRef}>
                  <AccordionTrigger data-testid="accordion-hardware">
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

              {/* Desktop Price Box */}
              <PriceBox
                totalPrice={finalTotalPrice}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleCheckout}
                isProcessing={isCheckingOut}
                disabled={
                  !isValidDimensions ||
                  isTooLarge ||
                  isCheckingOut ||
                  (serviceType === "print-and-frame" && selectedImage !== null && !copyrightAgreed)
                }
                priceItems={priceItems}
                warnings={warnings}
                onCopyLink={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  toast({
                    title: "Link copied!",
                    description: "Design link copied to clipboard",
                  });
                }}
                testIdPrefix=""
              />
            </div>
          </div>

          {/* Diploma Lifestyle Photo Carousel */}
          <DiplomaLifestyleCarousel />
        </div>
      </div>

      {/* Floating Toggle Button (Mobile Only) - Bottom Right, above price bar */}
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

      {/* Fullscreen Image Dialog */}
      <Dialog open={fullImageOpen} onOpenChange={setFullImageOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span>
                {fullscreenImage === "preview" && "Frame Preview"}
                {fullscreenImage === "corner" && "Corner Detail"}
                {fullscreenImage === "profile" && "Profile View"}
                {fullscreenImage === "lifestyle" && "Lifestyle Example"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFullImageOpen(false)}
                data-testid="button-close-fullscreen"
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 overflow-auto">
            {(() => {
              return (() => {
                if (fullscreenImage === "preview") {
                  return (
                    <div className="flex items-center justify-center min-h-[500px]">
                      {framePhotos.topUrl &&
                      framePhotos.bottomUrl &&
                      framePhotos.leftUrl &&
                      framePhotos.rightUrl ? (
                        <div
                          style={{
                            width: `${layout.outerPx?.w ?? 0}px`,
                            height: `${layout.outerPx?.h ?? 0}px`,
                            position: "relative",
                            maxWidth: "100%",
                            maxHeight: "70vh",
                            margin: "0 auto",
                          }}
                        >
                          {/* Same preview rendering as main preview */}
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "relative",
                            }}
                          >
                            {/* Frame pieces */}
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: `${layout.frameFacePx ?? 0}px`,
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
                                height: `${layout.frameFacePx ?? 0}px`,
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
                            {/* Mat and artwork */}
                            <div
                              style={{
                                position: "absolute",
                                top: `${layout.frameFacePx}px`,
                                left: `${layout.frameFacePx}px`,
                                right: `${layout.frameFacePx}px`,
                                bottom: `${layout.frameFacePx}px`,
                                boxShadow:
                                  matType !== "none"
                                    ? "inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.08)"
                                    : "inset 0 0 20px rgba(0,0,0,0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                ...(matType !== "none"
                                  ? getMatTilingStyle(
                                      selectedMat.name,
                                      layout.scale,
                                      selectedMat.hexColor
                                    )
                                  : { backgroundColor: "white" }),
                                padding: matType !== "none" ? `${layout.matPx}px` : "0",
                              }}
                            >
                              <div
                                style={{
                                  width:
                                    matType === "double"
                                      ? `${layout.openingPx.w + matReveal * 2 * layout.scale}px`
                                      : `${layout.openingPx.w}px`,
                                  height:
                                    matType === "double"
                                      ? `${layout.openingPx.h + matReveal * 2 * layout.scale}px`
                                      : `${layout.openingPx.h}px`,
                                  padding:
                                    matType === "double" ? `${matReveal * layout.scale}px` : "0",
                                  ...(matType === "double"
                                    ? getMatTilingStyle(
                                        selectedMatInner.name,
                                        layout.scale,
                                        selectedMatInner.hexColor
                                      )
                                    : {}),
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  border:
                                    matType === "double"
                                      ? `${Math.max(1.5, layout.scale * 0.06)}px solid #F5F5F0`
                                      : "none",
                                  boxShadow:
                                    matType === "double" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                                }}
                              >
                                <img
                                  src={displayImage}
                                  alt="Preview"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            width: `${layout.outerPx.w}px`,
                            height: `${layout.outerPx.h}px`,
                            borderTop: `${layout.frameFacePx}px solid ${selectedFrame.borderColor}`,
                            borderLeft: `${layout.frameFacePx}px solid ${selectedFrame.borderColor}`,
                            borderRight: `${layout.frameFacePx}px solid ${selectedFrame.color}`,
                            borderBottom: `${layout.frameFacePx}px solid ${selectedFrame.color}`,
                            boxShadow:
                              matType !== "none"
                                ? "inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.2)"
                                : "inset 0 0 20px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ...(matType !== "none"
                              ? getMatTilingStyle(
                                  selectedMat.name,
                                  layout.scale,
                                  selectedMat.hexColor
                                )
                              : { backgroundColor: "white" }),
                            padding: matType !== "none" ? `${layout.matPx}px` : "0",
                            maxWidth: "100%",
                            maxHeight: "70vh",
                            margin: "0 auto",
                          }}
                        >
                          <div
                            style={{
                              width:
                                matType === "double"
                                  ? `${layout.openingPx.w + matReveal * 2 * layout.scale}px`
                                  : `${layout.openingPx.w}px`,
                              height:
                                matType === "double"
                                  ? `${layout.openingPx.h + matReveal * 2 * layout.scale}px`
                                  : `${layout.openingPx.h}px`,
                              padding: matType === "double" ? `${matReveal * layout.scale}px` : "0",
                              ...(matType === "double"
                                ? getMatTilingStyle(
                                    selectedMatInner.name,
                                    layout.scale,
                                    selectedMatInner.hexColor
                                  )
                                : {}),
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border:
                                matType === "double"
                                  ? `${Math.max(1.5, layout.scale * 0.06)}px solid #F5F5F0`
                                  : "none",
                              boxShadow:
                                matType === "double"
                                  ? "0 1px 2px rgba(0,0,0,0.06)"
                                  : matType !== "none"
                                    ? `inset 0 0 0 ${Math.max(1.5, layout.scale * 0.1)}px ${getMatBevelColor(selectedMat.name)}`
                                    : "none",
                              backgroundColor: "white",
                            }}
                          >
                            <img
                              src={displayImage}
                              alt="Preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                if (fullscreenImage === "corner" && framePhotos.cornerUrl) {
                  return (
                    <div className="flex items-center justify-center">
                      <img
                        src={framePhotos.cornerUrl}
                        alt="Frame corner detail"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "70vh",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  );
                }

                if (fullscreenImage === "profile" && framePhotos.profileUrl) {
                  return (
                    <div className="flex items-center justify-center">
                      <img
                        src={framePhotos.profileUrl}
                        alt="Frame profile view"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "70vh",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  );
                }

                if (fullscreenImage === "lifestyle" && framePhotos.lifestyleUrl) {
                  return (
                    <div className="flex items-center justify-center">
                      <img
                        src={framePhotos.lifestyleUrl}
                        alt="Frame lifestyle example"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "70vh",
                          objectFit: "contain",
                          opacity: 0.8,
                        }}
                      />
                    </div>
                  );
                }
                return null;
              })();
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Price Bar */}
      {!hideMobileSticky && (
        <div
          className={`block md:hidden fixed left-0 right-0 bottom-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg z-50 transition-all duration-300 ease-in-out ${
            showMobileBar
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-0.5 min-w-[60px]">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="font-bold text-sm" data-testid="text-mobile-sticky-total-price">
                  ${(finalTotalPrice * quantity).toFixed(2)}
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
                  testId="input-quantity-sticky"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  toast({
                    title: "Link copied!",
                    description: "Design link copied to clipboard",
                  });
                }}
                data-testid="button-mobile-copy-link"
                className="h-11 w-11"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="default"
                onClick={handleCheckout}
                disabled={
                  !isValidDimensions ||
                  isTooLarge ||
                  isCheckingOut ||
                  (serviceType === "print-and-frame" && selectedImage !== null && !copyrightAgreed)
                }
                data-testid="button-mobile-add-to-cart"
                className="flex-1 text-xs min-w-0 min-h-11"
              >
                {isCheckingOut ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* AR Viewer Modal */}
      {showARViewer && (
        <ARViewer
          config={{
            serviceType,
            artworkWidth: parseFraction(artworkWidth),
            artworkHeight: parseFraction(artworkHeight),
            frameStyleId: selectedFrame.id,
            matType,
            matBorderWidth: parseFraction(matBorderWidth),
            matRevealWidth: parseFraction(matRevealWidth),
            matColorId: selectedMat.id,
            matInnerColorId: matType === "double" ? selectedMatInner.id : undefined,
            glassTypeId: (selectedGlass ?? glassTypes[0]!).id,
            imageUrl: displayImage,
            copyrightAgreed,
            imageFit: "cover",
          }}
          onClose={() => setShowARViewer(false)}
          onSizeUpdate={(newWidth, newHeight) => {
            // Update dimensions from AR resize
            setArtworkWidth(newWidth.toString());
            setArtworkHeight(newHeight.toString());

            // Show success toast
            toast({
              title: "Size Updated",
              description: `Frame size updated to ${newWidth}" × ${newHeight}" from AR preview`,
            });
          }}
        />
      )}
    </>
  );
}
