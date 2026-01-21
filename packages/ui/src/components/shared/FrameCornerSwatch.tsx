interface FrameCornerSwatchProps {
  frameId: string;
  frameName: string;
  isSelected: boolean;
  onClick: () => void;
  cornerImageUrl?: string;
  fallbackColor?: string;
  fallbackBorderColor?: string;
}

/**
 * FrameCornerSwatch Component
 * Displays a frame corner sample image for frame selection
 *
 * Features:
 * - Shows actual corner images when available
 * - Falls back to gradient or solid color when no image exists
 * - Matches mat designer's FrameSelector visual style
 * - Relies on parent component to provide cornerImageUrl prop
 */
export function FrameCornerSwatch({
  frameId,
  frameName,
  isSelected,
  onClick,
  cornerImageUrl,
  fallbackColor,
  fallbackBorderColor,
}: FrameCornerSwatchProps) {
  const imageUrl = cornerImageUrl;
  const altText = `${frameName} frame corner`;

  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-md border-2 text-left hover-elevate active-elevate-2 ${
        isSelected ? "border-primary" : "border-transparent"
      }`}
      data-testid={`button-frame-${frameId}`}
    >
      <div className="aspect-square rounded mb-2 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={altText} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full rounded"
            style={{
              background:
                fallbackColor && fallbackBorderColor
                  ? `linear-gradient(135deg, ${fallbackColor} 0%, ${fallbackBorderColor} 100%)`
                  : fallbackColor || "#e5e7eb",
            }}
          />
        )}
      </div>
      <p className="font-medium text-sm">{frameName}</p>
    </button>
  );
}
