"use client";

import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { BrassNameplatePreview } from "./BrassNameplatePreview";
import {
  AlertCircle,
  Download,
  Sparkles,
  Flag,
  Music,
  Theater,
  GraduationCap,
  Trophy,
} from "lucide-react";
import type { BrassNameplateConfig } from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS } from "@framecraft/types";
import { useToast } from "../../hooks/use-toast";
import { useIsMobile } from "@framecraft/core";

export interface BrassNameplateSectionProps {
  config: BrassNameplateConfig;
  onChange: (config: BrassNameplateConfig) => void;
  className?: string;
  showFlagOption?: boolean;
  showMusicOption?: boolean;
  showTheaterOption?: boolean;
  showGradOption?: boolean;
  showSportsOption?: boolean;
  showDownloadButton?: boolean;
  embedded?: boolean;
}

const FONT_OPTIONS = [
  { id: "georgia", name: "Georgia", family: 'Georgia, "Times New Roman", serif' },
  { id: "arial", name: "Arial", family: "Arial, Helvetica, sans-serif" },
  { id: "trajan-pro", name: "Cinzel", family: '"Cinzel", "Times New Roman", serif' },
  { id: "dancing-script", name: "Dancing Script", family: '"Dancing Script", cursive' },
  { id: "courier-new", name: "Courier New", family: '"Courier New", Courier, monospace' },
];

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
    id: "silver-black",
    name: "Silver",
    nameplateColor:
      "linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 25%, #A8A8A8 50%, #D0D0D0 75%, #A8A8A8 100%)",
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

export function BrassNameplateSection({
  config,
  onChange,
  className = "",
  showFlagOption = false,
  showMusicOption = false,
  showTheaterOption = false,
  showGradOption = false,
  showSportsOption = false,
  showDownloadButton = false,
  embedded = false,
}: BrassNameplateSectionProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isDownloading, setIsDownloading] = useState(false);

  const updateConfig = (updates: Partial<BrassNameplateConfig>) => {
    onChange({ ...config, ...updates });
  };

  const line1Remaining = 30 - config.line1.length;
  const line2Remaining = 40 - config.line2.length;
  const line3Remaining = 40 - config.line3.length;

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

      const lbrnContent = await response.text();

      const sanitizedText = (config.line1 || "nameplate")
        .replace(/[^a-zA-Z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 30);
      const fileName = `brass-nameplate-${sanitizedText}.lbrn`;

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

  const hasTextContent = config.line1.trim() || config.line2.trim() || config.line3.trim();

  const getTextFillPercentage = (text: string, maxChars: number): number => {
    const avgCharWidth = BRASS_NAMEPLATE_SPECS.TEXT_AREA_WIDTH / maxChars;
    const textWidth = text.length * avgCharWidth;
    return (textWidth / BRASS_NAMEPLATE_SPECS.TEXT_AREA_WIDTH) * 100;
  };

  const line1Fill = getTextFillPercentage(config.line1, 30);
  const line2Fill = getTextFillPercentage(config.line2, 40);
  const line3Fill = getTextFillPercentage(config.line3, 40);

  const hasAnyGraphicOption =
    showFlagOption || showMusicOption || showTheaterOption || showGradOption || showSportsOption;

  if (embedded) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">Add personalized engraving</span>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(checked) => updateConfig({ enabled: checked })}
            data-testid="switch-brass-nameplate"
          />
        </div>

        {config.enabled && (
          <>
            <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-center overflow-hidden">
              <BrassNameplatePreview config={config} scale={isMobile ? 1.5 : 2} />
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="nameplate-line1" className="text-sm font-medium">
                    Line 1
                  </Label>
                  <span
                    className={`text-xs ${line1Fill > 100 ? "text-destructive font-medium" : line1Fill > 90 ? "text-amber-500 font-medium" : "text-muted-foreground"}`}
                  >
                    {line1Remaining} remaining
                  </span>
                </div>
                <Input
                  id="nameplate-line1"
                  value={config.line1}
                  onChange={(e) => updateConfig({ line1: e.target.value.slice(0, 30) })}
                  placeholder="Headline text"
                  maxLength={30}
                  className={`${line1Fill > 100 ? "border-destructive" : line1Fill > 90 ? "border-amber-500" : ""}`}
                  data-testid="input-nameplate-line1"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="nameplate-line2" className="text-sm font-medium">
                    Line 2
                  </Label>
                  <span
                    className={`text-xs ${line2Fill > 100 ? "text-destructive font-medium" : line2Fill > 90 ? "text-amber-500 font-medium" : "text-muted-foreground"}`}
                  >
                    {line2Remaining} remaining
                  </span>
                </div>
                <Input
                  id="nameplate-line2"
                  value={config.line2}
                  onChange={(e) => updateConfig({ line2: e.target.value.slice(0, 40) })}
                  placeholder="Second line"
                  maxLength={40}
                  className={`${line2Fill > 100 ? "border-destructive" : line2Fill > 90 ? "border-amber-500" : ""}`}
                  data-testid="input-nameplate-line2"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="nameplate-line3" className="text-sm font-medium">
                    Line 3
                  </Label>
                  <span
                    className={`text-xs ${line3Fill > 100 ? "text-destructive font-medium" : line3Fill > 90 ? "text-amber-500 font-medium" : "text-muted-foreground"}`}
                  >
                    {line3Remaining} remaining
                  </span>
                </div>
                <Input
                  id="nameplate-line3"
                  value={config.line3}
                  onChange={(e) => updateConfig({ line3: e.target.value.slice(0, 40) })}
                  placeholder="Third line"
                  maxLength={40}
                  className={`${line3Fill > 100 ? "border-destructive" : line3Fill > 90 ? "border-amber-500" : ""}`}
                  data-testid="input-nameplate-line3"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="nameplate-style" className="text-sm font-medium">
                  Style
                </Label>
                <div className="flex gap-1">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() =>
                        updateConfig({ color: color.id as BrassNameplateConfig["color"] })
                      }
                      className={`
                        flex-1 h-9 rounded-md border-2 transition-all relative overflow-hidden
                        hover-elevate active-elevate-2
                        ${config.color === color.id ? "border-primary ring-1 ring-primary" : "border-border"}
                      `}
                      data-testid={`button-nameplate-color-${color.id}`}
                      title={color.name}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          clipPath: "polygon(0 0, 100% 100%, 0 100%)",
                          ...(color.metallic
                            ? { backgroundImage: color.nameplateColor }
                            : { backgroundColor: color.nameplateColor }),
                        }}
                      />
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

              <div className="space-y-1.5">
                <Label htmlFor="nameplate-font" className="text-sm font-medium">
                  Font
                </Label>
                <Select
                  value={config.font}
                  onValueChange={(value) =>
                    updateConfig({ font: value as BrassNameplateConfig["font"] })
                  }
                >
                  <SelectTrigger id="nameplate-font" data-testid="select-nameplate-font">
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
            </div>

            <p className="text-xs text-muted-foreground">
              4.5&quot; × 1.5&quot; brass plaque with laser-engraved text.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="rounded-lg border bg-card overflow-hidden">
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => updateConfig({ enabled: !config.enabled })}
          data-testid="nameplate-section-header"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <div>
              <h3 className="font-semibold text-base">Engraved Brass Nameplate</h3>
              <p className="text-sm text-muted-foreground">Add personalized text to your frame</p>
            </div>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(checked) => updateConfig({ enabled: checked })}
            onClick={(e) => e.stopPropagation()}
            data-testid="switch-brass-nameplate"
          />
        </div>

        {config.enabled && (
          <div className="border-t p-4 space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-center overflow-hidden">
              <BrassNameplatePreview config={config} scale={isMobile ? 1.5 : 2} />
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="nameplate-line1" className="text-sm font-medium">
                    Line 1
                  </Label>
                  <div className="flex items-center gap-1">
                    {line1Fill > 90 && (
                      <AlertCircle
                        className={`h-3 w-3 ${line1Fill > 100 ? "text-destructive" : "text-amber-500"}`}
                      />
                    )}
                    <span
                      className={`text-xs ${line1Fill > 100 ? "text-destructive font-medium" : line1Fill > 90 ? "text-amber-500 font-medium" : "text-muted-foreground"}`}
                    >
                      {line1Remaining} remaining
                    </span>
                  </div>
                </div>
                <Input
                  id="nameplate-line1"
                  value={config.line1}
                  onChange={(e) => updateConfig({ line1: e.target.value.slice(0, 30) })}
                  placeholder="Headline text"
                  maxLength={30}
                  className={`${line1Fill > 100 ? "border-destructive" : line1Fill > 90 ? "border-amber-500" : ""}`}
                  data-testid="input-nameplate-line1"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="nameplate-line2" className="text-sm font-medium">
                    Line 2
                  </Label>
                  <div className="flex items-center gap-1">
                    {line2Fill > 90 && (
                      <AlertCircle
                        className={`h-3 w-3 ${line2Fill > 100 ? "text-destructive" : "text-amber-500"}`}
                      />
                    )}
                    <span
                      className={`text-xs ${line2Fill > 100 ? "text-destructive font-medium" : line2Fill > 90 ? "text-amber-500 font-medium" : "text-muted-foreground"}`}
                    >
                      {line2Remaining} remaining
                    </span>
                  </div>
                </div>
                <Input
                  id="nameplate-line2"
                  value={config.line2}
                  onChange={(e) => updateConfig({ line2: e.target.value.slice(0, 40) })}
                  placeholder="Second line"
                  maxLength={40}
                  className={`${line2Fill > 100 ? "border-destructive" : line2Fill > 90 ? "border-amber-500" : ""}`}
                  data-testid="input-nameplate-line2"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="nameplate-line3" className="text-sm font-medium">
                    Line 3
                  </Label>
                  <div className="flex items-center gap-1">
                    {line3Fill > 90 && (
                      <AlertCircle
                        className={`h-3 w-3 ${line3Fill > 100 ? "text-destructive" : "text-amber-500"}`}
                      />
                    )}
                    <span
                      className={`text-xs ${line3Fill > 100 ? "text-destructive font-medium" : line3Fill > 90 ? "text-amber-500 font-medium" : "text-muted-foreground"}`}
                    >
                      {line3Remaining} remaining
                    </span>
                  </div>
                </div>
                <Input
                  id="nameplate-line3"
                  value={config.line3}
                  onChange={(e) => updateConfig({ line3: e.target.value.slice(0, 40) })}
                  placeholder="Third line"
                  maxLength={40}
                  className={`${line3Fill > 100 ? "border-destructive" : line3Fill > 90 ? "border-amber-500" : ""}`}
                  data-testid="input-nameplate-line3"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="nameplate-style" className="text-sm font-medium">
                  Style
                </Label>
                <div className="flex gap-1">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() =>
                        updateConfig({ color: color.id as BrassNameplateConfig["color"] })
                      }
                      className={`
                        flex-1 h-9 rounded-md border-2 transition-all relative overflow-hidden
                        hover-elevate active-elevate-2
                        ${config.color === color.id ? "border-primary ring-1 ring-primary" : "border-border"}
                      `}
                      data-testid={`button-nameplate-color-${color.id}`}
                      title={color.name}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          clipPath: "polygon(0 0, 100% 100%, 0 100%)",
                          ...(color.metallic
                            ? { backgroundImage: color.nameplateColor }
                            : { backgroundColor: color.nameplateColor }),
                        }}
                      />
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

              <div className="space-y-1.5">
                <Label htmlFor="nameplate-font" className="text-sm font-medium">
                  Font
                </Label>
                <Select
                  value={config.font}
                  onValueChange={(value) =>
                    updateConfig({ font: value as BrassNameplateConfig["font"] })
                  }
                >
                  <SelectTrigger id="nameplate-font" data-testid="select-nameplate-font">
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
            </div>

            {hasAnyGraphicOption && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Include Graphic</Label>
                <div className="flex flex-wrap gap-3">
                  {showFlagOption && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="nameplate-flag"
                        checked={config.includeFlag}
                        onCheckedChange={(checked) =>
                          updateConfig({ includeFlag: checked as boolean })
                        }
                        data-testid="checkbox-nameplate-flag"
                      />
                      <Label
                        htmlFor="nameplate-flag"
                        className="text-sm cursor-pointer flex items-center gap-1.5"
                      >
                        <Flag className="h-4 w-4 text-muted-foreground" />
                        US Flag
                      </Label>
                    </div>
                  )}
                  {showMusicOption && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="nameplate-music"
                        checked={false}
                        onCheckedChange={() => {}}
                        data-testid="checkbox-nameplate-music"
                      />
                      <Label
                        htmlFor="nameplate-music"
                        className="text-sm cursor-pointer flex items-center gap-1.5"
                      >
                        <Music className="h-4 w-4 text-muted-foreground" />
                        Music Note
                      </Label>
                    </div>
                  )}
                  {showTheaterOption && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="nameplate-theater"
                        checked={false}
                        onCheckedChange={() => {}}
                        data-testid="checkbox-nameplate-theater"
                      />
                      <Label
                        htmlFor="nameplate-theater"
                        className="text-sm cursor-pointer flex items-center gap-1.5"
                      >
                        <Theater className="h-4 w-4 text-muted-foreground" />
                        Theater Masks
                      </Label>
                    </div>
                  )}
                  {showGradOption && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="nameplate-grad"
                        checked={false}
                        onCheckedChange={() => {}}
                        data-testid="checkbox-nameplate-grad"
                      />
                      <Label
                        htmlFor="nameplate-grad"
                        className="text-sm cursor-pointer flex items-center gap-1.5"
                      >
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        Graduation Cap
                      </Label>
                    </div>
                  )}
                  {showSportsOption && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="nameplate-sports"
                        checked={false}
                        onCheckedChange={() => {}}
                        data-testid="checkbox-nameplate-sports"
                      />
                      <Label
                        htmlFor="nameplate-sports"
                        className="text-sm cursor-pointer flex items-center gap-1.5"
                      >
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        Trophy
                      </Label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {showDownloadButton && hasTextContent && (
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

            <p className="text-xs text-muted-foreground">
              4.5&quot; × 1.5&quot; brass plaque with laser-engraved text.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
