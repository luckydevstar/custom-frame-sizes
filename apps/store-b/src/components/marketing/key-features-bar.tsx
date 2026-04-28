import { Award, CheckCircle2, Ruler, Sparkles, type LucideIcon } from "lucide-react";

/** origina-store-b/client/src/components/marketing/KeyFeaturesBar.tsx */

interface Feature {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  testId: string;
}

interface KeyFeaturesBarProps {
  features?: Feature[];
  className?: string;
}

const DEFAULT_FEATURES: Feature[] = [
  { icon: Ruler, title: "Custom Sizes", subtitle: "Built to Your Exact Dimensions", testId: "feature-custom-size" },
  { icon: Sparkles, title: "Handcrafted", subtitle: "Built by Skilled Artisans in the USA", testId: "feature-handcrafted" },
  { icon: Award, title: "Premium Quality", subtitle: "Acid-Free Materials That Protect", testId: "feature-professional-grade" },
  { icon: CheckCircle2, title: "Live Preview", subtitle: "See Your Frame as You Design It", testId: "feature-instant-pricing" },
];

export function KeyFeaturesBar({ features = DEFAULT_FEATURES, className = "" }: KeyFeaturesBarProps) {
  return (
    <section className={`border-y bg-muted/20 ${className}`}>
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
        <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.testId} className="text-center" data-testid={feature.testId}>
                <Icon className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">{feature.title}</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">{feature.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export type { Feature };
