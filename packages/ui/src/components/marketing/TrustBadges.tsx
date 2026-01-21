import { Shield, Flag, RotateCcw } from "lucide-react";

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4 px-3 bg-muted/30 rounded-lg border">
      <div className="flex items-center gap-2 text-sm">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">Secure Checkout</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2 text-sm">
        <RotateCcw className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">Money-Back Guarantee</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2 text-sm">
        <Flag className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">Proudly Made in the USA</span>
      </div>
    </div>
  );
}
