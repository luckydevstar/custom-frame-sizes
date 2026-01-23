"use client";

import { useMemo } from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useParallax } from "@framecraft/core";
import { Skeleton } from "../ui/skeleton";

export interface HeroImage {
  src: string;
  alt: string;
  mediaType: "image" | "video";
  overlay?: {
    title?: string;
    subtitle?: string;
  };
  luminance?: "bright" | "medium" | "dark";
}

export interface HeroConfig {
  overlayColor: string;
  overlayOpacity: number;
  maxHeightPx: number;
  heightDesktop: string;
  heightMobile: string;
  objectPosition: string;
}

export interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaPrimary?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  ctaSecondary?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  overlayColor?: string;
  overlayOpacity?: number;
  height?: string;
  maxHeightPx?: number;
  objectPosition?: string;
  showTrustIndicators?: boolean;
  image?: HeroImage | null;
  isLoading?: boolean;
  error?: Error | null;
  config?: HeroConfig;
}

export function Hero({
  title: defaultTitle = "Custom Picture Frames in Any Size",
  subtitle: defaultSubtitle = "Design your custom frame in minutes with exact dimensions",
  ctaPrimary = { label: "Start Designing", href: "#designer" },
  ctaSecondary = { label: "Browse Frames", href: "/picture-frames" },
  overlayColor = "#000000",
  overlayOpacity: defaultOverlayOpacity = 0.28,
  height,
  maxHeightPx = 600,
  objectPosition = "center center",
  showTrustIndicators = true,
  image,
  isLoading = false,
  error = null,
  config,
}: HeroProps) {
  const { ref: parallaxRef, transform } = useParallax<HTMLDivElement>();

  // Use config if provided, otherwise use props
  const effectiveConfig = config
    ? {
        overlayColor: overlayColor || config.overlayColor,
        overlayOpacity: defaultOverlayOpacity || config.overlayOpacity,
        maxHeightPx: maxHeightPx || config.maxHeightPx,
        heightDesktop: height || config.heightDesktop,
        heightMobile: height || config.heightMobile,
        objectPosition: objectPosition || config.objectPosition,
      }
    : {
        overlayColor,
        overlayOpacity: defaultOverlayOpacity,
        maxHeightPx,
        heightDesktop: height || "70vh",
        heightMobile: height || "60vh",
        objectPosition,
      };

  // Use overlay data from image if available, otherwise use defaults
  const title = image?.overlay?.title || defaultTitle;
  const subtitle = image?.overlay?.subtitle || defaultSubtitle;

  // Calculate luminance-based overlay opacity
  const luminance = image?.luminance || "medium";
  const overlayOpacity = useMemo(() => {
    // Luminance-based opacity: bright images need more overlay for legibility
    switch (luminance) {
      case "bright":
        return 0.35; // Reduced for brighter, more visible videos
      case "dark":
        return 0.25; // Reduced for brighter, more visible videos
      case "medium":
      default:
        return 0.28; // Reduced for brighter, more visible videos
    }
  }, [luminance]);

  // Calculate responsive height
  const desktopHeight = effectiveConfig.heightDesktop;
  const mobileHeight = effectiveConfig.heightMobile;

  // Create overlay gradient
  const overlayStyle = {
    background: `linear-gradient(to bottom, ${effectiveConfig.overlayColor}${Math.round(
      overlayOpacity * 255
    )
      .toString(16)
      .padStart(2, "0")}, ${effectiveConfig.overlayColor}${Math.round(overlayOpacity * 255)
      .toString(16)
      .padStart(2, "0")})`,
  };

  // Respect prefers-reduced-motion (SSR safe)
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const transitionClass = prefersReducedMotion ? "" : "transition-opacity duration-500";

  if (error) {
    console.error("Hero image error:", error);
    // Fallback to solid color background on error
    return (
      <div
        className="relative flex items-center justify-center overflow-hidden bg-muted"
        style={{
          height: mobileHeight,
          maxHeight: `${effectiveConfig.maxHeightPx}px`,
        }}
      >
        <HeroContent
          title={title}
          subtitle={subtitle}
          ctaPrimary={ctaPrimary}
          ctaSecondary={ctaSecondary}
          showTrustIndicators={showTrustIndicators}
        />
      </div>
    );
  }

  return (
    <div
      className="hero-wrapper relative flex items-center justify-center overflow-hidden"
      style={{
        height: desktopHeight,
        maxHeight: `${effectiveConfig.maxHeightPx}px`,
      }}
    >
      {/* Background Media (Video or Image) with Parallax */}
      {isLoading ? (
        <Skeleton className="absolute inset-0" />
      ) : image ? (
        image.mediaType === "video" ? (
          <video
            className={`parallax-container object-cover ${transitionClass}`}
            style={{
              objectPosition: effectiveConfig.objectPosition,
              width: "100%",
              height: "100%",
            }}
            autoPlay
            loop
            muted
            playsInline
            aria-label={image.alt}
          >
            <source src={image.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div
            ref={parallaxRef}
            className={`parallax-container bg-cover bg-center ${transitionClass}`}
            style={{
              backgroundImage: `url(${image.src})`,
              objectPosition: effectiveConfig.objectPosition,
              transform: transform,
            }}
            role="img"
            aria-label={image.alt}
          />
        )
      ) : null}

      {/* Overlay */}
      <div className="absolute inset-0" style={overlayStyle} aria-hidden="true" />

      {/* Content */}
      <HeroContent
        title={title}
        subtitle={subtitle}
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        showTrustIndicators={showTrustIndicators}
        isVisible={!isLoading}
      />
    </div>
  );
}

interface HeroContentProps {
  title: string;
  subtitle: string;
  ctaPrimary: { label: string; onClick?: () => void; href?: string };
  ctaSecondary: { label: string; onClick?: () => void; href?: string };
  showTrustIndicators: boolean;
  isVisible?: boolean;
}

function HeroContent({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  showTrustIndicators: _showTrustIndicators,
  isVisible = true,
}: HeroContentProps) {
  // Respect prefers-reduced-motion (SSR safe)
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const fadeInClass = prefersReducedMotion ? "" : isVisible ? "opacity-100" : "opacity-0";
  const transitionClass = prefersReducedMotion ? "" : "transition-opacity duration-700";

  const handlePrimaryClick = () => {
    if (ctaPrimary.onClick) {
      ctaPrimary.onClick();
    } else if (ctaPrimary.href === "#designer") {
      // Smooth scroll to designer section
      const designer = document.getElementById("designer");
      if (designer) {
        designer.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleSecondaryClick = () => {
    if (ctaSecondary.onClick) {
      ctaSecondary.onClick();
    } else if (ctaSecondary.href) {
      window.location.href = ctaSecondary.href;
    }
  };

  return (
    <div
      className={`hero-content relative z-10 max-w-4xl mx-auto px-6 text-center ${fadeInClass} ${transitionClass}`}
    >
      <h1
        className="font-serif text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4"
        style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
        data-testid="text-hero-title"
      >
        {title}
      </h1>
      <p
        className="text-base md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto"
        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
        data-testid="text-hero-subtitle"
      >
        {subtitle}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        <Button size="default" onClick={handlePrimaryClick} data-testid="button-start-designing">
          {ctaPrimary.label}
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          size="default"
          variant="outline"
          className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
          onClick={handleSecondaryClick}
          data-testid="button-browse-frames"
        >
          {ctaSecondary.label}
        </Button>
      </div>
    </div>
  );
}
