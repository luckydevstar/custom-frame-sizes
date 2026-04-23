import { ShieldCheck, Award, Hammer } from "lucide-react";

/** b-shadow-box-frames-original/client/src/components/home/HeroTrustStrip.tsx */
export function HeroTrustStrip() {
  return (
    <section className="bg-muted py-4 px-6" data-testid="section-hero-trust">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 flex-shrink-0" />
          <span>Love It or We Make It Right</span>
        </div>
        <span className="hidden sm:inline text-muted-foreground/50">·</span>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Award className="h-4 w-4 flex-shrink-0" />
          <span>The Shadow Box Specialist</span>
        </div>
        <span className="hidden sm:inline text-muted-foreground/50">·</span>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Hammer className="h-4 w-4 flex-shrink-0" />
          <span>Every Frame Handcrafted to Order</span>
        </div>
      </div>
    </section>
  );
}
