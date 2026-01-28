/**
 * Shared Color Swatches Component
 * Used by both Frame Designer and Mat Designer for mat color selection
 * Includes keyboard accessibility, tooltips, and disabled state support
 */

// Note: matNeedsBorder and Mat type removed - config dependency not yet extracted
// import { matNeedsBorder, type Mat } from "@/config/palette.config";
// Temporary type until config is extracted
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Mat = any;

// Legacy type alias for backwards compatibility
type MatPaletteColor = Mat;

interface ColorSwatchesProps {
  colors: MatPaletteColor[];
  selectedId: string;
  onSelect: (color: MatPaletteColor) => void;
  isPremium?: boolean;
  disabled?: boolean;
  disabledColors?: string[]; // IDs of colors that should be disabled
  disabledTooltip?: string; // Tooltip text for disabled colors
  testIdPrefix?: string; // e.g., "mat" or "mat-inner"
}

export function ColorSwatches({
  colors,
  selectedId,
  onSelect,
  isPremium = false,
  disabled = false,
  disabledColors = [],
  disabledTooltip = "Not available",
  testIdPrefix = "mat",
}: ColorSwatchesProps) {
  const handleKeyDown = (e: React.KeyboardEvent, color: MatPaletteColor, index: number) => {
    const isDisabled = disabled || disabledColors.includes(color.id);
    if (isDisabled) return;

    // Enter/Space to select
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(color);
      return;
    }

    // Arrow key navigation
    let targetIndex = index;
    switch (e.key) {
      case "ArrowRight":
        targetIndex = (index + 1) % colors.length;
        break;
      case "ArrowLeft":
        targetIndex = (index - 1 + colors.length) % colors.length;
        break;
      case "ArrowDown":
        targetIndex = Math.min(index + 9, colors.length - 1);
        break;
      case "ArrowUp":
        targetIndex = Math.max(index - 9, 0);
        break;
      default:
        return;
    }

    e.preventDefault();
    // Find the button element and focus it
    const buttons = document.querySelectorAll(`[data-swatch-index]`);
    const targetButton = buttons[targetIndex] as HTMLButtonElement;
    if (targetButton) {
      targetButton.focus();
    }
  };

  // Responsive grid: 7/6 cols on mobile, 9 cols on desktop (md+)
  const gridClasses = isPremium
    ? "grid grid-cols-6 md:grid-cols-9 gap-1" // Premium: 6 cols mobile, 9 cols desktop
    : "grid grid-cols-7 md:grid-cols-9 gap-1"; // Standard: 7 cols mobile, 9 cols desktop

  return (
    <div className={gridClasses} role="radiogroup" aria-label="Mat color selection">
      {colors.map((color, index) => {
        const isSelected = selectedId === color.id;
        const isDisabled = disabled || disabledColors.includes(color.id);

        // Border styling based on premium/standard and selected state
        const borderClasses = isPremium
          ? isSelected
            ? "border-primary ring-2 ring-primary/20"
            : "border-primary/30"
          : isSelected
            ? "border-primary"
            : "border-border";

        // Use 150x150px swatch thumbnail images for accurate color representation
        // Cache-busting for updated swatches (40, 41, 42, 43 updated Oct 27 v2, 46 improved texture Oct 27 v3)
        const cacheBuster =
          color.lineNumber === 46
            ? "?v=3"
            : [40, 41, 42, 43].includes(color.lineNumber)
              ? "?v=2"
              : "";
        const swatchImagePath =
          getSharedAssetUrl(`mats/swatches/${color.lineNumber}.jpg`) + cacheBuster;

        return (
          <button
            key={color.id}
            onClick={() => onSelect(color)}
            onKeyDown={(e) => handleKeyDown(e, color, index)}
            aria-disabled={isDisabled}
            className={`
              aspect-square rounded-md border-2 relative overflow-hidden
              ${isDisabled ? "opacity-40 cursor-not-allowed" : "hover-elevate active-elevate-2 cursor-pointer"}
              ${borderClasses}
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              transition-all
            `}
            style={{
              backgroundImage: `url(${swatchImagePath})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundColor: color.hexColor, // Fallback while image loads
            }}
            title={isDisabled ? disabledTooltip : color.name}
            aria-label={color.name}
            aria-checked={isSelected}
            role="radio"
            tabIndex={isSelected ? 0 : -1}
            data-testid={`button-${testIdPrefix}-${color.id}`}
            data-swatch-index={index}
          />
        );
      })}
    </div>
  );
}

/**
 * Color Swatches with Standard/Premium Separation
 * Shows standard mats first, then a separator, then premium mats
 */
interface ColorSwatchesWithSeparatorProps {
  standardColors: MatPaletteColor[];
  premiumColors: MatPaletteColor[];
  selectedId: string;
  onSelect: (color: MatPaletteColor) => void;
  disabled?: boolean;
  disabledColors?: string[];
  disabledTooltip?: string;
  testIdPrefix?: string;
}

export function ColorSwatchesWithSeparator({
  standardColors,
  premiumColors,
  selectedId,
  onSelect,
  disabled = false,
  disabledColors = [],
  disabledTooltip,
  testIdPrefix = "mat",
}: ColorSwatchesWithSeparatorProps) {
  const hasPremiumColors = premiumColors.length > 0;

  return (
    <div className="space-y-3">
      {/* Standard Mat Boards */}
      <div className="space-y-1.5">
        <ColorSwatches
          colors={standardColors}
          selectedId={selectedId}
          onSelect={onSelect}
          disabled={disabled}
          disabledColors={disabledColors}
          disabledTooltip={disabledTooltip}
          testIdPrefix={testIdPrefix}
        />
      </div>

      {/* Premium Mat Boards Separator - only show if there are premium colors */}
      {hasPremiumColors && (
        <>
          <div className="flex items-center gap-2 pt-2 pb-1">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
              Premium Mat Boards
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Premium Mat Boards */}
          <ColorSwatches
            colors={premiumColors}
            selectedId={selectedId}
            onSelect={onSelect}
            isPremium
            disabled={disabled}
            disabledColors={disabledColors}
            disabledTooltip={disabledTooltip}
            testIdPrefix={testIdPrefix}
          />
        </>
      )}
    </div>
  );
}
