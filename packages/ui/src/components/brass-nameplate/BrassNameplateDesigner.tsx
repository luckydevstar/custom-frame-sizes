"use client";

import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { BrassNameplatePreview } from "./BrassNameplatePreview";
import { AlertCircle, Download } from "lucide-react";
import type { BrassNameplateConfig } from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS } from "@framecraft/types";
import { useToast } from "../../hooks/use-toast";

interface BrassNameplateDesignerProps {
  config: BrassNameplateConfig;
  onChange: (config: BrassNameplateConfig) => void;
  className?: string;
}

// Font display names and CSS font families (5 distinct options)
const FONT_OPTIONS = [
  { id: "georgia", name: "Georgia", family: 'Georgia, "Times New Roman", serif' },
  { id: "arial", name: "Arial", family: "Arial, Helvetica, sans-serif" },
  { id: "trajan-pro", name: "Cinzel", family: '"Cinzel", "Times New Roman", serif' },
  { id: "dancing-script", name: "Dancing Script", family: '"Dancing Script", cursive' },
  { id: "courier-new", name: "Courier New", family: '"Courier New", Courier, monospace' },
];

// Color option display names
const COLOR_OPTIONS = [
  {
    id: "brass-black",
    name: "Brass",
    nameplateColor:
      "linear-gradient(135deg, #D4AF37 0%, #F0E68C 25%, #B8860B 50%, #DAA520 75%, #B8860B 100%)",
    textColor: "#000000",
    metallic: true,
  },
  {
    id: "black-gold",
    name: "Black/Gold",
    nameplateColor: "#1A1A1A",
    textColor:
      "linear-gradient(135deg, #D4AF37 0%, #F0E68C 25%, #B8860B 50%, #DAA520 75%, #B8860B 100%)",
    metallicText: true,
  },
  {
    id: "black-silver",
    name: "Black/Silver",
    nameplateColor: "#1A1A1A",
    textColor:
      "linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 25%, #A8A8A8 50%, #D0D0D0 75%, #A8A8A8 100%)",
    metallicText: true,
  },
];

export function BrassNameplateDesigner({
  config,
  onChange,
  className = "",
}: BrassNameplateDesignerProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const updateConfig = (updates: Partial<BrassNameplateConfig>) => {
    onChange({ ...config, ...updates });
  };

  const line1Remaining = 30 - config.line1.length;
  const line2Remaining = 40 - config.line2.length;
  const line3Remaining = 40 - config.line3.length;

  // Download LightBurn file for laser engraving
  const downloadLightBurnFile = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/brass-nameplate/generate-lbrn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error("Failed to generate LightBurn file");
      }

      // Get the file content
      const lbrnContent = await response.text();

      // Create sanitized filename from line1 text
      const sanitizedText = (config.line1 || "nameplate")
        .replace(/[^a-zA-Z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 30);
      const fileName = `brass-nameplate-${sanitizedText}.lbrn`;

      // Create a blob and download
      const blob = new Blob([lbrnContent], { type: "application/xml" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Engraving File Downloaded",
        description: `${fileName} is ready for LightBurn.`,
      });
    } catch (error) {
      console.error("Error downloading LightBurn file:", error);
      toast({
        title: "Download Failed",
        description: "Could not generate the engraving file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Check if nameplate has any text content for download
  const hasTextContent = config.line1.trim() || config.line2.trim() || config.line3.trim();

  // Calculate text fill percentage (for overflow warnings)
  const getTextFillPercentage = (text: string, maxChars: number): number => {
    // Rough estimate: average character width relative to nameplate width
    const avgCharWidth = BRASS_NAMEPLATE_SPECS.TEXT_AREA_WIDTH / maxChars;
    const textWidth = text.length * avgCharWidth;
    return (textWidth / BRASS_NAMEPLATE_SPECS.TEXT_AREA_WIDTH) * 100;
  };

  const line1Fill = getTextFillPercentage(config.line1, 30);
  const line2Fill = getTextFillPercentage(config.line2, 40);
  const line3Fill = getTextFillPercentage(config.line3, 40);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Enable/Disable Metal Plaque */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="brass-nameplate-enabled"
          checked={config.enabled}
          onCheckedChange={(checked) => updateConfig({ enabled: checked as boolean })}
          data-testid="checkbox-brass-nameplate"
        />
        <Label htmlFor="brass-nameplate-enabled" className="cursor-pointer">
          Add Engraved Metal Plaque (+${BRASS_NAMEPLATE_SPECS.PRICE})
        </Label>
      </div>

      {config.enabled && (
        <div className="space-y-3">
          {/* Live Preview - More compact */}
          <div className="bg-muted/50 rounded p-4 flex items-center justify-center">
            <BrassNameplatePreview config={config} scale={2} />
          </div>

          {/* Font & Color in compact row */}
          <div className="grid grid-cols-2 gap-2">
            {/* Font Selector */}
            <div className="space-y-1">
              <Label htmlFor="plaque-font" className="text-xs text-muted-foreground">
                Font
              </Label>
              <Select
                value={config.font}
                onValueChange={(value) =>
                  updateConfig({ font: value as BrassNameplateConfig["font"] })
                }
              >
                <SelectTrigger id="plaque-font" data-testid="select-plaque-font" className="h-8">
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

            {/* Color Selector */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Color</Label>
              <div className="flex gap-0.5">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() =>
                      updateConfig({ color: color.id as BrassNameplateConfig["color"] })
                    }
                    className={`
                      flex-1 h-8 rounded border-2 transition-all relative overflow-hidden
                      hover-elevate active-elevate-2
                      ${config.color === color.id ? "border-primary" : "border-border"}
                    `}
                    data-testid={`button-plaque-color-${color.id}`}
                    title={color.name}
                  >
                    {/* Diagonal split: plaque color (bottom-left triangle) */}
                    <div
                      className="absolute inset-0"
                      style={{
                        clipPath: "polygon(0 0, 100% 100%, 0 100%)",
                        ...(color.metallic
                          ? { backgroundImage: color.nameplateColor }
                          : { backgroundColor: color.nameplateColor }),
                      }}
                    />
                    {/* Text color (top-right triangle) */}
                    <div
                      className="absolute inset-0"
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                        ...(color.metallicText
                          ? { backgroundImage: color.textColor }
                          : { backgroundColor: color.textColor }),
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Compact Text Inputs with Overflow Warnings */}
          <div className="space-y-2">
            {/* Line 1 */}
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="plaque-line1" className="text-xs text-muted-foreground">
                  Line 1
                </Label>
                <div className="flex items-center gap-1">
                  {line1Fill > 90 && (
                    <AlertCircle
                      className={`h-3 w-3 ${line1Fill > 100 ? "text-destructive" : "text-amber-500"}`}
                    />
                  )}
                  <span
                    className={`text-[10px] ${line1Fill > 100 ? "text-destructive font-medium" : line1Fill > 90 ? "text-amber-500 font-medium" : "text-muted-foreground"}`}
                  >
                    {line1Remaining}
                  </span>
                </div>
              </div>
              <Input
                id="plaque-line1"
                value={config.line1}
                onChange={(e) => updateConfig({ line1: e.target.value.slice(0, 30) })}
                placeholder="Headline"
                maxLength={30}
                className={`h-8 text-sm ${line1Fill > 100 ? "border-destructive" : line1Fill > 90 ? "border-amber-500" : ""}`}
                data-testid="input-plaque-line1"
              />
            </div>

            {/* Line 2 */}
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="plaque-line2" className="text-xs text-muted-foreground">
                  Line 2
                </Label>
                <div className="flex items-center gap-1">
                  {line2Fill > 90 && (
                    <AlertCircle
                      className={`h-3 w-3 ${line2Fill > 100 ? "text-destructive" : "text-amber-500"}`}
                    />
                  )}
                  <span
                    className={`text-[10px] ${line2Fill > 100 ? "text-destructive font-medium" : line2Fill > 90 ? "text-amber-500 font-medium" : "text-muted-foreground"}`}
                  >
                    {line2Remaining}
                  </span>
                </div>
              </div>
              <Input
                id="plaque-line2"
                value={config.line2}
                onChange={(e) => updateConfig({ line2: e.target.value.slice(0, 40) })}
                placeholder="Second line"
                maxLength={40}
                className={`h-8 text-sm ${line2Fill > 100 ? "border-destructive" : line2Fill > 90 ? "border-amber-500" : ""}`}
                data-testid="input-plaque-line2"
              />
            </div>

            {/* Line 3 */}
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="plaque-line3" className="text-xs text-muted-foreground">
                  Line 3
                </Label>
                <div className="flex items-center gap-1">
                  {line3Fill > 90 && (
                    <AlertCircle
                      className={`h-3 w-3 ${line3Fill > 100 ? "text-destructive" : "text-amber-500"}`}
                    />
                  )}
                  <span
                    className={`text-[10px] ${line3Fill > 100 ? "text-destructive font-medium" : line3Fill > 90 ? "text-amber-500 font-medium" : "text-muted-foreground"}`}
                  >
                    {line3Remaining}
                  </span>
                </div>
              </div>
              <Input
                id="plaque-line3"
                value={config.line3}
                onChange={(e) => updateConfig({ line3: e.target.value.slice(0, 40) })}
                placeholder="Third line"
                maxLength={40}
                className={`h-8 text-sm ${line3Fill > 100 ? "border-destructive" : line3Fill > 90 ? "border-amber-500" : ""}`}
                data-testid="input-plaque-line3"
              />
            </div>
          </div>

          {/* Download LightBurn File Button */}
          {hasTextContent && (
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadLightBurnFile}
                disabled={isDownloading}
                className="w-full"
                data-testid="button-download-lightburn"
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Generating..." : "Download Engraving File (.lbrn)"}
              </Button>
              <p className="text-xs text-muted-foreground mt-1.5 text-center">
                For laser engraving in LightBurn software
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
