/**
 * Standardized Hanging Hardware Section
 *
 * Provides consistent hardware selection across all specialty frame designers.
 * Two options: Standard and Security hardware kits.
 *
 * Logic:
 * - If frame dimensions ≤ 13" × 16" (either orientation), shows "Standard Wall Hanger & Easel Stand"
 * - Larger frames show "Standard Wall Hanging Hardware Kit"
 * - Security Hardware Kit adds $8.95 (price not shown in this section)
 *
 * NOTE: This component does NOT include Accordion wrappers.
 * Callers must wrap this in their own AccordionItem/AccordionContent as needed.
 * The AccordionTrigger should use header text: "Hanging Hardware"
 */

import { Info } from "lucide-react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";

interface HangingHardwareSectionProps {
  hardwareType: "standard" | "security";
  setHardwareType: (value: "standard" | "security") => void;
  frameWidth: number;
  frameHeight: number;
}

const EASEL_MAX_SHORT = 13;
const EASEL_MAX_LONG = 16;

function isEaselSize(width: number, height: number): boolean {
  const short = Math.min(width, height);
  const long = Math.max(width, height);
  return short <= EASEL_MAX_SHORT && long <= EASEL_MAX_LONG;
}

export function HangingHardwareSection({
  hardwareType,
  setHardwareType,
  frameWidth,
  frameHeight,
}: HangingHardwareSectionProps) {
  const showEaselOption = isEaselSize(frameWidth, frameHeight);

  const standardLabel = showEaselOption
    ? "Standard Wall Hanger & Easel Stand"
    : "Standard Wall Hanging Hardware Kit";

  return (
    <div className="space-y-4">
      <TooltipProvider>
        <RadioGroup
          value={hardwareType}
          onValueChange={(value) => setHardwareType(value as "standard" | "security")}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2 py-2">
              <RadioGroupItem
                value="standard"
                id="hardware-standard"
                data-testid="radio-hardware-standard"
              />
              <Label
                htmlFor="hardware-standard"
                className="flex items-center gap-2 flex-1 cursor-pointer"
              >
                {standardLabel}
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="shrink-0 px-2">
                    <Info className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    {showEaselOption
                      ? "Includes sawtooth wall hanger and easel back for tabletop display."
                      : "Standard hook and wire for secure wall mounting."}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center space-x-2 py-2">
              <RadioGroupItem
                value="security"
                id="hardware-security"
                data-testid="radio-hardware-security"
              />
              <Label htmlFor="hardware-security" className="flex-1 cursor-pointer">
                Security Hardware Kit
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="shrink-0 px-2">
                    <Info className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    Lock frame to the wall for added protection - includes wrench key.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </RadioGroup>
      </TooltipProvider>

      <p className="text-xs text-muted-foreground">
        Hardware included unattached for flexible mounting.
      </p>
    </div>
  );
}
