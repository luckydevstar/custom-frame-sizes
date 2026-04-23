import { ShieldCheck, Truck } from "lucide-react";

/** b-shadow-box-frames-original/client/src/components/TrustBadge.tsx (default variant) */
export function TrustBadge({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 text-xs text-muted-foreground/80 ${className}`}
      data-testid="text-trust-badge"
    >
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
