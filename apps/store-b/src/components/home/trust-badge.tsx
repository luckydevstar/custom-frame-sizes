import { ShieldCheck, Truck } from "lucide-react";

/** origina-store-b/client/src/components/TrustBadge.tsx */
interface TrustBadgeProps {
  variant?: "full" | "inline" | "hero";
  className?: string;
}

const colorMap = {
  full: "text-muted-foreground/80",
  inline: "text-muted-foreground/80",
  hero: "text-white/70",
};

export function TrustBadge({ variant = "full", className = "" }: TrustBadgeProps) {
  const color = colorMap[variant];

  if (variant === "inline") {
    return (
      <p className={`text-xs ${color} text-center mt-3 ${className}`} data-testid="text-trust-inline">
        <ShieldCheck className="inline h-3.5 w-3.5 mr-1 align-text-bottom" />
        Love It or We Make It Right · Free Shipping Over $75
      </p>
    );
  }

  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 text-xs ${color} ${className}`} data-testid="text-trust-badge">
      <span className="inline-flex items-center gap-1">
        <ShieldCheck className="h-3.5 w-3.5" />
        Love It or We Make It Right
      </span>
      <span className="inline-flex items-center gap-1">
        <Truck className="h-3.5 w-3.5" />
        Free Shipping Over $75
      </span>
    </div>
  );
}
