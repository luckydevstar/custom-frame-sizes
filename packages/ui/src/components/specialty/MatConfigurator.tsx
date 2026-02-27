"use client";

/**
 * Mat Configurator – Migrated from CustomFrameSizes-CODE.
 * Two-column layout: preview (left) and controls (right). All state in store; config drives preview.
 */

import { useState, useEffect, useMemo, useRef } from "react";
import { Square, Ruler, Eye, Settings } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";
import { HelpTooltip } from "../ui/help-tooltip";
import { Badge } from "../ui/badge";
import { SwingOut } from "../ui/SwingOut";
import { useIsMobile, getGlassTypes, getGlassTypeById, getFrameStyleById } from "@framecraft/core";
import { getMatsInDisplayOrder, isMatAvailableForSize, type Mat } from "@framecraft/config";
import { useMatStore } from "./mat/store";
import { MatPreviewCanvas } from "./mat/MatPreviewCanvas";
import { FrameSelector } from "./mat/FrameSelector";
import { MatQuantitySelector } from "./mat/MatQuantitySelector";
import { StickyActionBar } from "./mat/StickyActionBar";
import { WelcomeModal } from "./mat/WelcomeModal";
import { useMatPricing } from "./mat/useMatPricing";

const MIN_MAT_SIZE = 10;
const MAX_LONG_SIDE = 60;
const NO_CUT_INSET_IN = 0.75;

/**
 * Frame card – extracted as stable component so FrameSelector does not remount on parent re-renders.
 * Remounting caused the frame photo fetch useEffect to run again (infinite API calls when clicking Borders).
 */
function MatFrameCard() {
  const config = useMatStore((s) => s.config);
  const setSelectedGlass = useMatStore((s) => s.setSelectedGlass);
  const setHardware = useMatStore((s) => s.setHardware);
  const glassTypes = getGlassTypes();
  return (
    <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
      <div className="p-6 bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
        <SwingOut title="Add a Frame - Save 10%" defaultOpen testId="swingout-frame">
          <div className="max-h-96 overflow-y-auto pr-2">
            <FrameSelector hideNoFrame={false} />
          </div>
          {config.selectedFrameId && (
            <div className="mt-6 pt-6 border-t" data-testid="glass-selection-container">
              <h3 className="text-lg font-medium mb-4">Glazing & Backing</h3>
              <RadioGroup
                value={config.selectedGlassId || "standard"}
                onValueChange={(id) => setSelectedGlass(id)}
              >
                {glassTypes
                  .filter((g) => g.id !== "none" && g.id !== "backing-only")
                  .map((glass) => (
                    <div key={glass.id} className="flex items-center space-x-2 py-2">
                      <RadioGroupItem
                        value={glass.id}
                        id={`glass-${glass.id}`}
                        data-testid={`radio-glass-${glass.id}`}
                      />
                      <Label htmlFor={`glass-${glass.id}`} className="cursor-pointer">
                        {glass.name}
                      </Label>
                    </div>
                  ))}
              </RadioGroup>
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Hanging Hardware</h3>
                <RadioGroup
                  value={config.hardware || "standard"}
                  onValueChange={(v) => setHardware(v as "standard" | "security")}
                >
                  <div className="flex items-center space-x-2 py-2">
                    <RadioGroupItem
                      value="standard"
                      id="hardware-standard"
                      data-testid="radio-hardware-standard"
                    />
                    <Label htmlFor="hardware-standard" className="cursor-pointer">
                      Standard Wall Hanging Hardware (Free)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 py-2">
                    <RadioGroupItem
                      value="security"
                      id="hardware-security"
                      data-testid="radio-hardware-security"
                    />
                    <Label htmlFor="hardware-security" className="cursor-pointer">
                      Security Hardware Kit (+$8.95)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
        </SwingOut>
      </div>
    </Card>
  );
}

export interface MatConfiguratorProps {
  useFrameDesignerFallback?: boolean;
}

export function MatConfigurator({ useFrameDesignerFallback = false }: MatConfiguratorProps) {
  const isMobile = useIsMobile();
  const config = useMatStore((s) => s.config);
  const configVersion = useMatStore((s) => s.configVersion);
  const setOverallSize = useMatStore((s) => s.setOverallSize);
  const updateOpening = useMatStore((s) => s.updateOpening);
  const setMatColor = useMatStore((s) => s.setMatColor);
  const toggleSingleDouble = useMatStore((s) => s.toggleSingleDouble);
  const toggleStandardOverlap = useMatStore((s) => s.toggleStandardOverlap);
  const setMatRevealWidth = useMatStore((s) => s.setMatRevealWidth);
  const setVGrooveEnabled = useMatStore((s) => s.setVGrooveEnabled);
  const setVGrooveOffset = useMatStore((s) => s.setVGrooveOffset);
  const setBackingKitEnabled = useMatStore((s) => s.setBackingKitEnabled);
  const setQuantity = useMatStore((s) => s.setQuantity);
  const setShowBorders = useMatStore((s) => s.setShowBorders);
  const setSelectedFrame = useMatStore((s) => s.setSelectedFrame);
  const pricing = useMatPricing();

  const [widthInput, setWidthInput] = useState(String(config.overallWIn));
  const [heightInput, setHeightInput] = useState(String(config.overallHIn));
  const [openingInputs, setOpeningInputs] = useState<
    Record<string, { width: string; height: string }>
  >({});
  const [mobileView, setMobileView] = useState<"preview" | "controls">("controls");
  const previewRef = useRef<HTMLDivElement>(null);

  // Frame photo state management (following CurrencyFrameDesigner pattern)
  const [framePhotos, setFramePhotos] = useState<{
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  }>({});

  const selectedFrame = config.selectedFrameId
    ? (getFrameStyleById(config.selectedFrameId) ?? undefined)
    : undefined;

  // Fetch frame photos when frame selection changes
  useEffect(() => {
    if (!selectedFrame?.sku) {
      setFramePhotos({});
      return;
    }

    async function fetchFramePhotos() {
      try {
        const response = await fetch(`/api/frames/${selectedFrame!.sku}/photos`);
        if (response.ok) {
          const photoSet = await response.json();
          setFramePhotos({
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
  }, [selectedFrame]);

  const isDouble = config.singleOrDouble === "double" && config.bottomMat;
  const sourceOpenings = isDouble ? config.bottomMat!.openings : config.topMat.openings;
  const allOpenings = config.topMat.openings;

  // --- URL sync for frame selection (shareable links, persistence) ---
  // On first mount, hydrate selected frame from URL (?frame= or legacy ?frameId=)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const frameFromUrl = params.get("frame") || params.get("frameId");
      if (frameFromUrl) {
        setSelectedFrame(frameFromUrl);
      }
    } catch {
      // Ignore URL parsing errors in non-browser environments
    }
  }, [setSelectedFrame]);

  // Whenever selectedFrameId changes, write it back to the URL as ?frame=...
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const selectedFrameId = config.selectedFrameId ?? null;

      if (selectedFrameId) {
        params.set("frame", selectedFrameId);
      } else {
        params.delete("frame");
      }

      const qs = params.toString();
      const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    } catch {
      // Best-effort; ignore if history is not available
    }
  }, [config.selectedFrameId]);

  // Only sync inputs when ACTUAL dimension values change (not on every configVersion bump)
  useEffect(() => {
    setWidthInput(String(config.overallWIn));
    setHeightInput(String(config.overallHIn));
  }, [config.overallWIn, config.overallHIn]);

  // Sync opening inputs from config ONLY when openings are added/removed (preserves typing state)
  useEffect(() => {
    setOpeningInputs((prev) => {
      const updated: Record<string, { width: string; height: string }> = {};

      sourceOpenings.forEach((opening) => {
        // Preserve existing input if it exists (allows typing), otherwise initialize from config
        const existing = prev[opening.id];
        if (existing) {
          updated[opening.id] = existing;
        } else {
          const width = opening.wIn || 0;
          const height = opening.hIn || 0;
          updated[opening.id] = {
            width: String(width),
            height: String(height),
          };
        }
      });

      return updated;
    });
    // Only re-run when openings are added/removed or mode changes, NOT on every dimension change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config.topMat.openings.length,
    config.bottomMat?.openings.length,
    config.singleOrDouble,
    // We intentionally don't add sourceOpenings as a dep - we only want to re-run when count/mode changes
  ]);

  const standardMats = useMemo(
    () =>
      getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", true, false).filter((m) =>
        isMatAvailableForSize(m, config.overallWIn, config.overallHIn)
      ),
    [isMobile, config.overallWIn, config.overallHIn]
  );
  const premiumMats = useMemo(
    () =>
      getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", false, true).filter((m) =>
        isMatAvailableForSize(m, config.overallWIn, config.overallHIn)
      ),
    [isMobile, config.overallWIn, config.overallHIn]
  );
  const findColorByName = (name: string): string =>
    [...standardMats, ...premiumMats].find((c) => c.name === name)?.id ?? standardMats[0]?.id ?? "";

  const commitSizeChange = (dim: "width" | "height", value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      if (dim === "width") setWidthInput(String(config.overallWIn));
      else setHeightInput(String(config.overallHIn));
      return;
    }
    const clamped = Math.max(MIN_MAT_SIZE, Math.min(num, MAX_LONG_SIDE));
    if (dim === "width") {
      setWidthInput(String(clamped));
      setOverallSize(clamped, config.overallHIn);
    } else {
      setHeightInput(String(clamped));
      setOverallSize(config.overallWIn, clamped);
    }
  };

  const handleOpeningInputChange = (openingId: string, dim: "width" | "height", value: string) => {
    setOpeningInputs((prev) => {
      const current = prev[openingId] ?? { width: "", height: "" };
      return {
        ...prev,
        [openingId]: {
          width: dim === "width" ? value : (current.width ?? ""),
          height: dim === "height" ? value : (current.height ?? ""),
        },
      };
    });
  };

  const commitOpeningSizeChange = (openingId: string, dim: "width" | "height", value: string) => {
    const opening = allOpenings.find((o) => o.id === openingId);
    if (!opening) return;
    const num = parseFloat(value);
    const minBorder = isDouble ? NO_CUT_INSET_IN : 1;
    const maxW = config.overallWIn - minBorder * 2;
    const maxH = config.overallHIn - minBorder * 2;
    if (isNaN(num) || num < 1) {
      const cur = dim === "width" ? (opening.wIn ?? 0) : (opening.hIn ?? 0);
      setOpeningInputs((prev) => {
        const current = prev[openingId] ?? { width: "", height: "" };
        return {
          ...prev,
          [openingId]: {
            width: dim === "width" ? String(cur) : (current.width ?? ""),
            height: dim === "height" ? String(cur) : (current.height ?? ""),
          },
        };
      });
      return;
    }
    const clamped = Math.max(1, dim === "width" ? Math.min(num, maxW) : Math.min(num, maxH));
    const updateLayer = isDouble ? "bottom" : "top";
    if (opening.shape === "oval") {
      updateOpening(updateLayer, openingId, dim === "width" ? { wIn: clamped } : { hIn: clamped });
    } else {
      updateOpening(updateLayer, openingId, dim === "width" ? { wIn: clamped } : { hIn: clamped });
    }
  };

  if (useFrameDesignerFallback) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires -- conditional fallback, avoid circular import
    const { FrameDesigner } = require("./FrameDesigner");
    return (
      <div className="space-y-6">
        <p className="text-center text-sm text-muted-foreground max-w-xl mx-auto">
          Design your mat and frame below. For mat-only orders use the dedicated controls above.
        </p>
        <FrameDesigner embedded />
      </div>
    );
  }

  const ControlsCard = () => {
    return (
      <Card className="p-6">
        {/* Overall Mat Size */}
        <div className="mb-4">
          <div className="flex items-center gap-1">
            <h3 className="text-lg font-medium">Overall Mat Size</h3>
            <HelpTooltip content="This is the outer size of your mat board. If you're matting for an existing frame, enter your frame's interior dimensions." />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Specify your mat&apos;s outer dimensions
          </p>
        </div>
        <div className="flex items-end gap-4 mt-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="width-input" className="text-sm">
              Width (in)
            </Label>
            <Input
              id="width-input"
              type="number"
              step={0.125}
              min={MIN_MAT_SIZE}
              max={MAX_LONG_SIDE}
              value={widthInput}
              onChange={(e) => setWidthInput(e.target.value)}
              onBlur={(e) => commitSizeChange("width", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commitSizeChange("width", widthInput)}
              data-testid="input-mat-width"
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="height-input" className="text-sm">
              Height (in)
            </Label>
            <Input
              id="height-input"
              type="number"
              step={0.125}
              min={MIN_MAT_SIZE}
              max={MAX_LONG_SIDE}
              value={heightInput}
              onChange={(e) => setHeightInput(e.target.value)}
              onBlur={(e) => commitSizeChange("height", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commitSizeChange("height", heightInput)}
              data-testid="input-mat-height"
            />
          </div>
        </div>

        {/* Opening Size */}
        <div className="mb-4 mt-6">
          <h3 className="text-lg font-medium mb-3">Opening Size</h3>
          <div className="space-y-4">
            {sourceOpenings.map((opening, index) => (
              <div key={opening.id}>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Artwork Width (in)</Label>
                    <Input
                      type="number"
                      step={0.125}
                      min={1}
                      value={openingInputs[opening.id]?.width ?? ""}
                      onChange={(e) =>
                        handleOpeningInputChange(opening.id, "width", e.target.value)
                      }
                      onBlur={(e) => commitOpeningSizeChange(opening.id, "width", e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        commitOpeningSizeChange(
                          opening.id,
                          "width",
                          openingInputs[opening.id]?.width ?? ""
                        )
                      }
                      data-testid={`input-opening-width-${index}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Artwork Height (in)</Label>
                    <Input
                      type="number"
                      step={0.125}
                      min={1}
                      value={openingInputs[opening.id]?.height ?? ""}
                      onChange={(e) =>
                        handleOpeningInputChange(opening.id, "height", e.target.value)
                      }
                      onBlur={(e) => commitOpeningSizeChange(opening.id, "height", e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        commitOpeningSizeChange(
                          opening.id,
                          "height",
                          openingInputs[opening.id]?.height ?? ""
                        )
                      }
                      data-testid={`input-opening-height-${index}`}
                    />
                  </div>
                </div>

                {/* Shape */}
                <div className="flex gap-2 my-4">
                  <Button
                    size="sm"
                    variant={opening.shape === "rect" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => updateOpening("top", opening.id, { shape: "rect" })}
                    data-testid={`button-shape-rect-${index}`}
                  >
                    <Square className="w-4 h-4 mr-1" />
                    Rectangle
                  </Button>
                  <Button
                    size="sm"
                    variant={opening.shape === "oval" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => updateOpening("top", opening.id, { shape: "oval" })}
                    data-testid={`button-shape-oval-${index}`}
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <ellipse cx="12" cy="12" rx="8" ry="6" />
                    </svg>
                    Oval
                  </Button>
                </div>

                {/* Backing Kit & Rounded Corners */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 my-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`backing-kit-${index}`}
                      checked={config.backingKit?.enabled ?? false}
                      onCheckedChange={(c) => setBackingKitEnabled(c === true)}
                      data-testid={`checkbox-backing-kit-${index}`}
                    />
                    <Label htmlFor={`backing-kit-${index}`} className="cursor-pointer text-sm">
                      Add Backing & Clear Bags
                    </Label>
                    <HelpTooltip
                      content={
                        <div>
                          <p className="font-semibold mb-2">Backing & Clear Bags</p>
                          <p className="mb-2 text-sm">
                            Includes foam core backing board and clear protective bags for your mat.
                          </p>
                          <p className="text-sm">
                            Keeps your mat clean and protected during storage and shipping.
                          </p>
                        </div>
                      }
                    />
                  </div>
                  {opening.shape === "rect" && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`rounded-corners-${index}`}
                        checked={opening.cornerStyle === "rounded"}
                        onCheckedChange={(c) =>
                          updateOpening("top", opening.id, {
                            cornerStyle: c === true ? "rounded" : "square",
                          })
                        }
                        data-testid={`checkbox-rounded-corners-${index}`}
                      />
                      <Label
                        htmlFor={`rounded-corners-${index}`}
                        className="cursor-pointer text-sm"
                      >
                        Rounded Corners
                      </Label>
                    </div>
                  )}
                </div>

                {/* V-Groove */}
                <div className="my-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`v-groove-${index}`}
                      checked={config.vGroove?.enabled ?? false}
                      onCheckedChange={(c) => setVGrooveEnabled(c === true)}
                      data-testid={`checkbox-v-groove-${index}`}
                    />
                    <Label htmlFor={`v-groove-${index}`} className="cursor-pointer text-sm">
                      Add V-Groove
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      Premium
                    </Badge>
                    <HelpTooltip
                      content={
                        <div>
                          <p className="font-semibold mb-2">What is a V-Groove?</p>
                          <p className="text-sm">
                            A decorative V-shaped groove cut around the opening, revealing the
                            mat&apos;s core color.
                          </p>
                        </div>
                      }
                    />
                  </div>
                  {config.vGroove?.enabled && (
                    <div className="mt-3 space-y-2">
                      <Label className="text-sm">V-Groove Offset (inches)</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          min={0.25}
                          max={1}
                          step={0.125}
                          value={config.vGroove.offsetIn}
                          onChange={(e) => {
                            const v = parseFloat(e.target.value);
                            if (!isNaN(v)) setVGrooveOffset(Math.max(0.25, Math.min(1, v)));
                          }}
                          className="w-20"
                          data-testid="input-vgroove-offset"
                        />
                        <Slider
                          min={0.25}
                          max={1}
                          step={0.125}
                          value={[config.vGroove.offsetIn]}
                          onValueChange={(v) => setVGrooveOffset(v[0] ?? 0.5)}
                          className="flex-1"
                          data-testid="slider-vgroove"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Distance from mat opening edge (0.25&quot; - 1&quot;)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Standard Overlap – match original: "Artwork Overlap (Recommended)" */}
        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md my-6">
          <Checkbox
            id="standard-overlap"
            checked={config.standardOverlap}
            onCheckedChange={(c) => toggleStandardOverlap(c === true)}
            data-testid="checkbox-standard-overlap"
            className="mt-0.5"
          />
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="standard-overlap" className="cursor-pointer text-sm">
                Artwork Overlap (Recommended)
              </Label>
              <HelpTooltip
                content={
                  <div>
                    <p className="font-semibold mb-1">How it works:</p>
                    <p className="mb-2">We trim each mat opening by ¼″ on every side (½″ total).</p>
                    <p>
                      That means a 5×7″ photo fits a 4½×6½″ opening — a professional framing
                      standard that keeps your artwork neatly tucked under the mat and held in
                      place.
                    </p>
                  </div>
                }
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Covers 0.25&quot; around artwork edges for secure fit. Uncheck to cut exact
              dimensions.
            </p>
          </div>
        </div>

        {/* Single / Double Mat */}
        <div className="flex gap-2 my-6">
          <Button
            type="button"
            variant={config.singleOrDouble === "single" ? "default" : "outline"}
            size="lg"
            className="flex-1"
            onClick={() => config.singleOrDouble !== "single" && toggleSingleDouble()}
            data-testid="button-single-mat"
          >
            Single Mat
          </Button>
          <Button
            type="button"
            variant={config.singleOrDouble === "double" ? "default" : "outline"}
            size="lg"
            className="flex-1"
            onClick={() => config.singleOrDouble !== "double" && toggleSingleDouble()}
            data-testid="button-double-mat"
          >
            Double Mat
          </Button>
        </div>

        {/* Mat Color(s) */}
        <div className="space-y-4 my-6">
          <Label className="text-lg font-medium">
            {config.singleOrDouble === "double"
              ? `Top Mat Color: ${config.topMat.color}`
              : `Mat Color: ${config.topMat.color}`}
          </Label>
          <ColorSwatchesWithSeparator
            standardColors={standardMats}
            premiumColors={premiumMats}
            selectedId={findColorByName(config.topMat.color) || ""}
            onSelect={(color: Mat) => setMatColor("top", color.name)}
            testIdPrefix="color-top"
          />
        </div>

        {config.singleOrDouble === "double" && config.bottomMat && (
          <>
            <div className="space-y-2 my-6">
              <div className="flex items-center gap-2">
                <Label htmlFor="matReveal" className="text-lg font-medium">
                  Inner Border Size (inches)
                </Label>
                <HelpTooltip content="How much of your bottom mat color shows as a border between openings and the top mat. Common: 0.25 inch to 0.5 inch." />
              </div>
              <Select
                value={config.matRevealWidth.toString()}
                onValueChange={(v) => setMatRevealWidth(parseFloat(v))}
              >
                <SelectTrigger id="matReveal" data-testid="select-mat-reveal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.125">1/8&quot; (0.125&quot;)</SelectItem>
                  <SelectItem value="0.25">1/4&quot; (0.25&quot;)</SelectItem>
                  <SelectItem value="0.375">3/8&quot; (0.375&quot;)</SelectItem>
                  <SelectItem value="0.5">1/2&quot; (0.5&quot;)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                The reveal is the inner mat border visible around the artwork
              </p>
            </div>
            <div className="space-y-4 my-6">
              <Label className="text-lg font-medium">
                Bottom Mat Color (Reveal): {config.bottomMat.color}
              </Label>
              <ColorSwatchesWithSeparator
                standardColors={standardMats}
                premiumColors={premiumMats}
                selectedId={findColorByName(config.bottomMat?.color ?? standardMats[0]?.name ?? "")}
                onSelect={(color: Mat) => setMatColor("bottom", color.name)}
                testIdPrefix="color-bottom"
              />
            </div>
          </>
        )}
      </Card>
    );
  };

  const PricingCard = () => (
    <Card className="p-4 md:sticky md:bottom-4">
      <div className="space-y-2">
        {config.selectedFrameId && pricing.framePrice > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Frame</span>
            <span data-testid="text-frame-price">{pricing.formatPrice(pricing.framePrice)}</span>
          </div>
        )}
        {config.selectedFrameId && config.selectedGlassId && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {getGlassTypeById(config.selectedGlassId)?.name ?? "Glass"}
            </span>
            {config.selectedGlassId === "standard" ? (
              <span data-testid="text-glass-price" className="text-muted-foreground">
                Included
              </span>
            ) : (
              <span data-testid="text-glass-price">{pricing.formatPrice(pricing.glassPrice)}</span>
            )}
          </div>
        )}
        {config.vGroove?.enabled && pricing.vGroovePrice > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">V-Groove</span>
            <span data-testid="text-vgroove-price">
              {pricing.formatPrice(pricing.vGroovePrice)}
            </span>
          </div>
        )}
        {config.backingKit?.enabled && pricing.backingKitPrice > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Backing & Clear Bags</span>
            <span data-testid="text-backing-kit-price">
              {pricing.formatPrice(pricing.backingKitPrice)}
            </span>
          </div>
        )}
        {config.selectedFrameId && pricing.bundleDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Bundle Discount (10%)</span>
            <span data-testid="text-bundle-discount">
              -{pricing.formatPrice(pricing.bundleDiscount)}
            </span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-lg pt-2">
          <span>Total</span>
          <span data-testid="text-total-price">
            {pricing.formatPrice(
              (config.selectedFrameId ? pricing.grandTotal : pricing.total) * config.quantity
            )}
          </span>
        </div>
        {config.quantity > 1 && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Price per mat</span>
            <span data-testid="text-price-per-mat">
              {pricing.formatPrice(config.selectedFrameId ? pricing.grandTotal : pricing.total)}
            </span>
          </div>
        )}
        <div className="space-y-2 pt-2">
          <Label className="text-sm font-medium">Quantity</Label>
          <MatQuantitySelector
            value={config.quantity}
            onChange={setQuantity}
            testId="select-quantity-summary"
          />
        </div>
      </div>
    </Card>
  );

  const PreviewBlock = () => {
    return (
      <Card className="p-6 relative">
        <Button
          size="sm"
          variant={config.showBorders ? "default" : "outline"}
          onClick={() => setShowBorders(!config.showBorders)}
          className="absolute top-4 right-4 z-10 gap-2"
          aria-pressed={config.showBorders}
          data-testid="button-toggle-borders"
        >
          <Ruler className="w-4 h-4" />
          <span className="hidden sm:inline">Borders</span>
        </Button>
        <div
          className="h-[700px] w-full lg:h-[700px] flex items-center justify-center"
          style={{ minHeight: isMobile ? "calc(100vh - 20rem)" : undefined }}
        >
          <MatPreviewCanvas
            config={config}
            configVersion={configVersion}
            framePhotos={framePhotos}
            containerWidth={720}
            containerHeight={700}
          />
        </div>
      </Card>
    );
  };

  return (
    <>
      <WelcomeModal />
      {/* Mobile: toggle preview vs controls */}
      <div className="lg:hidden">
        {mobileView === "preview" && (
          <div className="h-fit scroll-mt-20" ref={previewRef}>
            <PreviewBlock />
          </div>
        )}
        {mobileView === "controls" && (
          <div className="space-y-6 pb-24">
            <ControlsCard />
            <MatFrameCard />
            <PricingCard />
          </div>
        )}
        <Button
          size="lg"
          className="fixed bottom-20 right-6 z-[60] lg:hidden shadow-lg rounded-full h-14 px-6"
          onClick={() => setMobileView((v) => (v === "preview" ? "controls" : "preview"))}
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

      {/* Desktop: two-column – 60% preview left, controls right */}
      <div className="hidden lg:grid lg:grid-cols-[60%_1fr] gap-8 max-w-screen-2xl mx-auto">
        <div className="lg:sticky lg:top-24 h-fit">
          <PreviewBlock />
        </div>
        <div className="space-y-6">
          <ControlsCard />
          <MatFrameCard />
          <PricingCard />
        </div>
      </div>

      {/* Mobile: sticky bottom bar (Total, Qty, Copy link, Add to Cart) */}
      <StickyActionBar isValid />
    </>
  );
}
