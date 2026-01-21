import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { Info } from "lucide-react";

interface BottomWeightedMattingProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  testIdPrefix?: string;
}

export function BottomWeightedMatting({
  checked,
  onCheckedChange,
  testIdPrefix = "",
}: BottomWeightedMattingProps) {
  const prefix = testIdPrefix ? `${testIdPrefix}-` : "";

  return (
    <div className="flex items-center space-x-2 pt-2">
      <Checkbox
        id={`${prefix}bottomWeighted`}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        data-testid={`${prefix}checkbox-bottom-weighted`}
      />
      <div className="flex items-center gap-2">
        <Label
          htmlFor={`${prefix}bottomWeighted`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Bottom-Weighted Matting
        </Label>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid={`${prefix}button-bottom-weighted-info`}
            >
              <Info className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm">
              Adds 0.5&quot; to the bottom border for visual balance. This professional standard
              prevents artwork from appearing to sink.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export const BOTTOM_WEIGHTED_EXTRA = 0.5;
