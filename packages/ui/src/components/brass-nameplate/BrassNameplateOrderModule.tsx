"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { QuantitySelector } from "../ui/quantity-selector";
import { useToast } from "../../hooks/use-toast";
import { useIsMobile, parseFraction } from "@framecraft/core";
import {
  ShoppingCart,
  Plus,
  Trash2,
  AlertTriangle,
  Info,
  Link2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
} from "lucide-react";
import { StandaloneNameplatePreview } from "./StandaloneNameplatePreview";
import type {
  StandaloneNameplateConfig,
  TextLine,
  FontId,
  Alignment,
} from "./StandaloneNameplateTypes";
import {
  STANDALONE_NAMEPLATE_SPECS,
  FONT_OPTIONS,
  COLOR_OPTIONS,
  calculateUsableSpace,
  calculatePrice,
  createDefaultLine,
  getDefaultConfig,
  checkTextOverflow,
  configToUrlParams,
  urlParamsToConfig,
} from "./StandaloneNameplateTypes";

export function BrassNameplateOrderModule() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [config, setConfig] = useState<StandaloneNameplateConfig>(getDefaultConfig());
  const [widthInput, setWidthInput] = useState("4");
  const [heightInput, setHeightInput] = useState("1.5");
  const [quantity, setQuantity] = useState(1);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [showMobileBar, setShowMobileBar] = useState(false);
  const configuratorRef = useRef<HTMLDivElement>(null);

  const width = parseFraction(widthInput) || STANDALONE_NAMEPLATE_SPECS.MIN_WIDTH;
  const height = parseFraction(heightInput) || STANDALONE_NAMEPLATE_SPECS.MIN_HEIGHT;

  const isValidWidth =
    width >= STANDALONE_NAMEPLATE_SPECS.MIN_WIDTH && width <= STANDALONE_NAMEPLATE_SPECS.MAX_WIDTH;
  const isValidHeight =
    height >= STANDALONE_NAMEPLATE_SPECS.MIN_HEIGHT &&
    height <= STANDALONE_NAMEPLATE_SPECS.MAX_HEIGHT;
  const isValidSize = isValidWidth && isValidHeight;

  const usableSpace = useMemo(() => calculateUsableSpace(width, height), [width, height]);
  const price = useMemo(() => calculatePrice(width, height), [width, height]);
  const totalPrice = price * quantity;

  const fontOption = FONT_OPTIONS.find((f) => f.id === config.font) || FONT_OPTIONS[0];

  const overflowCheck = useMemo(
    () =>
      checkTextOverflow(
        config.lines,
        usableSpace.width,
        usableSpace.height,
        fontOption.family,
        config.lineSpacing
      ),
    [config.lines, usableSpace.width, usableSpace.height, fontOption.family, config.lineSpacing]
  );

  useEffect(() => {
    const urlConfig = urlParamsToConfig(window.location.search);
    if (urlConfig) {
      if (urlConfig.width) setWidthInput(urlConfig.width.toString());
      if (urlConfig.height) setHeightInput(urlConfig.height.toString());
      setConfig((prev) => ({ ...prev, ...urlConfig }));
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const params = configToUrlParams(config);
    const newUrl = `${window.location.pathname}?${params}`;
    window.history.replaceState({}, "", newUrl);
  }, [initialized, config]);

  useEffect(() => {
    if (isValidSize) {
      setConfig((prev) => ({ ...prev, width, height }));
    }
  }, [width, height, isValidSize]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShowMobileBar(true);
        }
      },
      { threshold: 0.1 }
    );

    if (configuratorRef.current) {
      observer.observe(configuratorRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const updateLine = useCallback((lineId: string, updates: Partial<TextLine>) => {
    setConfig((prev) => ({
      ...prev,
      lines: prev.lines.map((line) => (line.id === lineId ? { ...line, ...updates } : line)),
    }));
  }, []);

  const addLine = useCallback(() => {
    setConfig((prev) => {
      const newId = `line-${prev.lines.length + 1}`;
      return {
        ...prev,
        lines: [...prev.lines, createDefaultLine(newId)],
      };
    });
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setConfig((prev) => ({
      ...prev,
      lines: prev.lines.filter((line) => line.id !== lineId),
    }));
  }, []);

  const handleCopyLink = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Share this link to show your nameplate design.",
    });
  }, [toast]);

  const handleAddToCart = useCallback(() => {
    if (!isValidSize) {
      toast({
        title: "Invalid Size",
        description: 'Please enter valid dimensions between 1.5" and 12".',
        variant: "destructive",
      });
      return;
    }

    if (overflowCheck.hasOverflow) {
      toast({
        title: "Text May Not Fit",
        description:
          "Some text may be too large for this nameplate size. Consider reducing font sizes.",
        variant: "destructive",
      });
      return;
    }

    const hasContent = config.lines.some((line) => line.text.trim());
    if (!hasContent) {
      toast({
        title: "No Text Entered",
        description: "Please enter at least one line of text for your nameplate.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);

    setTimeout(() => {
      toast({
        title: "Added to Cart",
        description: `${quantity} custom nameplate${quantity > 1 ? "s" : ""} added to your cart.`,
      });
      setIsCheckingOut(false);
    }, 1000);
  }, [isValidSize, overflowCheck.hasOverflow, config.lines, quantity, toast]);

  const visibleLines = config.lines.slice(0, STANDALONE_NAMEPLATE_SPECS.MAX_VISIBLE_LINES);
  const canAddMoreLines = config.lines.length < 10;

  const colorOption = COLOR_OPTIONS.find((c) => c.id === config.color) || COLOR_OPTIONS[0];

  return (
    <div className="w-full" ref={configuratorRef}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:sticky lg:top-4 lg:self-start space-y-4">
          <div className="bg-muted/30 rounded-lg p-4 sm:p-6 flex items-center justify-center min-h-[200px]">
            <StandaloneNameplatePreview config={config} scale={isMobile ? 3 : 4} />
          </div>

          <div className="bg-muted/50 rounded-md p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Nameplate Size:{" "}
                <span className="text-primary">
                  {width}&quot; × {height}&quot;
                </span>
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Outer dimensions of the brass plate</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-xs text-muted-foreground">
              Usable engraving area: {usableSpace.width.toFixed(2)}&quot; ×{" "}
              {usableSpace.height.toFixed(2)}&quot; (0.25&quot; border)
            </p>
          </div>

          {overflowCheck.hasOverflow && (
            <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-600 dark:text-amber-400">Text may not fit</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Try reducing font sizes or using a larger plate size.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-4 sm:p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Nameplate Size
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameplate-width">Width (inches)</Label>
                  <Input
                    id="nameplate-width"
                    value={widthInput}
                    onChange={(e) => setWidthInput(e.target.value)}
                    placeholder="4"
                    className={!isValidWidth && widthInput ? "border-destructive" : ""}
                    data-testid="input-nameplate-width"
                  />
                  <p className="text-xs text-muted-foreground">
                    1.5&quot; to 12&quot;. Fractions accepted (e.g., 4 1/2)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameplate-height">Height (inches)</Label>
                  <Input
                    id="nameplate-height"
                    value={heightInput}
                    onChange={(e) => setHeightInput(e.target.value)}
                    placeholder="1.5"
                    className={!isValidHeight && heightInput ? "border-destructive" : ""}
                    data-testid="input-nameplate-height"
                  />
                  <p className="text-xs text-muted-foreground">
                    1.5&quot; to 12&quot;. Fractions accepted (e.g., 1 1/2)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">Plate Style</h3>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, color: color.id }))}
                    className={`
                      h-12 rounded-md border-2 transition-all relative overflow-hidden
                      hover-elevate active-elevate-2
                      ${config.color === color.id ? "border-primary ring-2 ring-primary/30" : "border-border"}
                    `}
                    data-testid={`button-plate-color-${color.id}`}
                    title={color.name}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        clipPath: "polygon(0 0, 100% 100%, 0 100%)",
                        background: color.plaqueColor,
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                        background: color.textColor,
                      }}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Selected: {colorOption?.name ?? ""}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Font</Label>
                <Select
                  value={config.font}
                  onValueChange={(value) =>
                    setConfig((prev) => ({ ...prev, font: value as FontId }))
                  }
                >
                  <SelectTrigger data-testid="select-nameplate-font">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem key={font.id} value={font.id}>
                        <span style={{ fontFamily: font.family }}>{font.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <div className="flex gap-1">
                  {[
                    { value: "left", icon: AlignLeft, label: "Left" },
                    { value: "center", icon: AlignCenter, label: "Center" },
                    { value: "right", icon: AlignRight, label: "Right" },
                  ].map(({ value, icon: Icon, label }) => (
                    <Button
                      key={value}
                      variant={config.alignment === value ? "default" : "outline"}
                      size="icon"
                      onClick={() =>
                        setConfig((prev) => ({ ...prev, alignment: value as Alignment }))
                      }
                      title={label}
                      data-testid={`button-align-${value}`}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Line Spacing</Label>
                <span className="text-xs text-muted-foreground">
                  {config.lineSpacing.toFixed(1)}×
                </span>
              </div>
              <Slider
                value={[config.lineSpacing]}
                onValueChange={([value]) =>
                  setConfig((prev) => ({
                    ...prev,
                    lineSpacing: value ?? STANDALONE_NAMEPLATE_SPECS.DEFAULT_LINE_SPACING,
                  }))
                }
                min={STANDALONE_NAMEPLATE_SPECS.MIN_LINE_SPACING}
                max={STANDALONE_NAMEPLATE_SPECS.MAX_LINE_SPACING}
                step={0.1}
                data-testid="slider-line-spacing"
              />
              <p className="text-xs text-muted-foreground">
                Adjust vertical spacing between text lines
              </p>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 space-y-4">
            <h3 className="text-sm font-semibold">Text Lines</h3>

            <div className="space-y-4">
              {visibleLines.map((line, index) => {
                const isOverflowing = overflowCheck.overflowingLines.includes(line.id);
                return (
                  <div key={line.id} className="space-y-2 pb-3 border-b last:border-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-xs text-muted-foreground">Line {index + 1}</Label>
                      {config.lines.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeLine(line.id)}
                          data-testid={`button-remove-line-${index}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <Input
                      value={line.text}
                      onChange={(e) => updateLine(line.id, { text: e.target.value })}
                      placeholder={index === 0 ? "Enter headline text" : "Enter text"}
                      className={isOverflowing ? "border-amber-500" : ""}
                      data-testid={`input-line-text-${index}`}
                    />
                    <div className="flex items-center gap-3">
                      <div className="flex-1 flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground whitespace-nowrap">
                          Size: {line.fontSize}pt
                        </Label>
                        <Slider
                          value={[line.fontSize]}
                          onValueChange={([value]) => updateLine(line.id, { fontSize: value })}
                          min={STANDALONE_NAMEPLATE_SPECS.MIN_FONT_SIZE}
                          max={STANDALONE_NAMEPLATE_SPECS.MAX_FONT_SIZE}
                          step={1}
                          className="flex-1"
                          data-testid={`slider-font-size-${index}`}
                        />
                      </div>
                      <Button
                        variant={line.bold ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateLine(line.id, { bold: !line.bold })}
                        title="Bold"
                        data-testid={`button-bold-${index}`}
                      >
                        <Bold className="h-3 w-3" />
                      </Button>
                      <Button
                        variant={line.italic ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateLine(line.id, { italic: !line.italic })}
                        title="Italic"
                        data-testid={`button-italic-${index}`}
                      >
                        <Italic className="h-3 w-3" />
                      </Button>
                    </div>
                    {isOverflowing && (
                      <p className="text-xs text-amber-500">
                        This line may be too wide. Try a smaller font size.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {canAddMoreLines && (
              <Button
                variant="outline"
                size="sm"
                onClick={addLine}
                className="w-full"
                data-testid="button-add-line"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Line
              </Button>
            )}
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold" data-testid="price-total">
                  ${totalPrice.toFixed(2)}
                </p>
                {quantity > 1 && (
                  <p className="text-sm text-muted-foreground">${price.toFixed(2)} each</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Qty:</Label>
                <QuantitySelector value={quantity} onChange={setQuantity} testId="input-quantity" />
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Simple, fair pricing. Custom engraved brass nameplates start at $29. Larger sizes
              scale reasonably — capped at $129.
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                title="Copy Link"
                data-testid="button-copy-link"
              >
                <Link2 className="h-4 w-4" />
              </Button>
              <Button
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!isValidSize || isCheckingOut}
                data-testid="button-add-to-cart"
              >
                {isCheckingOut ? (
                  "Adding..."
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {showMobileBar && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-3 z-50">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <p className="text-lg font-bold" data-testid="mobile-total-price">
                ${totalPrice.toFixed(2)}
              </p>
            </div>
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              className="w-14 h-7 text-xs text-center p-0"
              testId="mobile-quantity"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              className="h-11 w-11"
              data-testid="mobile-copy-link"
            >
              <Link2 className="h-4 w-4" />
            </Button>
            <Button
              className="flex-1 text-xs min-w-0 min-h-11"
              onClick={handleAddToCart}
              disabled={!isValidSize || isCheckingOut}
              data-testid="mobile-add-to-cart"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
