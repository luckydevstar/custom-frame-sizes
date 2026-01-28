"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useIntersectionAnimation } from "@framecraft/core";
import type { LucideIcon } from "lucide-react";
import { Edit3, Sparkles, Eye, ShoppingBag } from "lucide-react";

export interface HowItWorksStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface HowItWorksConfig {
  headline: string;
  subhead: string;
  steps: HowItWorksStep[];
}

export interface HowItWorksProps {
  config?: HowItWorksConfig;
}

const defaultConfig: HowItWorksConfig = {
  headline: "How It Works",
  subhead: "Designing your perfect frame is easy. Here's how we make it happen:",
  steps: [
    {
      icon: Edit3,
      title: "Enter Your Size",
      description:
        "Type your artwork width and height (down to 1/8 in). We'll build the frame to fit.",
    },
    {
      icon: Sparkles,
      title: "Make It Yours",
      description: "Pick frame style, mat color, and glazing to match your space.",
    },
    {
      icon: Eye,
      title: "Preview Instantly",
      description: "Watch your frame update live as you customize.",
    },
    {
      icon: ShoppingBag,
      title: "Place Your Order",
      description: "We handcraft every frame and deliver it ready to hang.",
    },
  ],
};

export function HowItWorks({ config = defaultConfig }: HowItWorksProps) {
  const titleRef = useIntersectionAnimation({ animationClass: "motion-fade-rise" });
  const cardsRef = useIntersectionAnimation({ stagger: true, animationClass: "motion-scale-in" });

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12"
      data-testid="section-how-it-works"
    >
      <div ref={titleRef} className="text-center mb-8 sm:mb-10">
        <h2
          className="font-serif font-semibold mb-3 sm:mb-4"
          style={{ fontSize: "clamp(1.5rem, 6vw, 2.75rem)" }}
          data-testid="text-how-it-works-title"
        >
          {config?.headline}
        </h2>
        <p
          className="text-muted-foreground max-w-2xl mx-auto"
          style={{ fontSize: "clamp(0.875rem, 3.5vw, 1.125rem)" }}
        >
          {config?.subhead}
        </p>
      </div>

      <div ref={cardsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {(config?.steps ?? []).map((step, index) => {
          const Icon = step.icon;
          return (
            <Card
              key={index}
              data-testid={`card-step-${index + 1}`}
              className="transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-1 hover:scale-[1.03] focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
              style={{ padding: "clamp(1rem, 2.5vw, 1.5rem)" }}
              tabIndex={0}
            >
              <CardHeader className="pb-3 sm:pb-4">
                <div
                  className="mb-3 flex items-center justify-center"
                  data-testid={`icon-step-${index + 1}`}
                >
                  <div className="rounded-full bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                </div>
                <CardTitle
                  className="text-center font-semibold"
                  style={{ fontSize: "clamp(1.125rem, 4vw, 1.25rem)" }}
                  data-testid={`text-step-${index + 1}-title`}
                >
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p
                  className="text-muted-foreground text-center leading-relaxed"
                  style={{ fontSize: "clamp(0.875rem, 3.5vw, 0.9375rem)" }}
                  data-testid={`text-step-${index + 1}-description`}
                >
                  {step.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
