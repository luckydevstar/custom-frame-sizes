import { Shield, RefreshCw, Flag } from "lucide-react";

export function TrustBox() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-4" data-testid="trust-box">
      <div
        className="flex items-center gap-2 text-sm text-muted-foreground"
        data-testid="trust-secure"
      >
        <Shield className="w-4 h-4" />
        <span>Secure Checkout</span>
      </div>
      <div
        className="flex items-center gap-2 text-sm text-muted-foreground"
        data-testid="trust-guarantee"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Money-Back Guarantee</span>
      </div>
      <div
        className="flex items-center gap-2 text-sm text-muted-foreground"
        data-testid="trust-usa"
      >
        <Flag className="w-4 h-4" />
        <span>Proudly Made in the USA</span>
      </div>
    </div>
  );
}
