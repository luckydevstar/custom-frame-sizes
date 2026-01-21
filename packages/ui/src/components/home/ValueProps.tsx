import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useIntersectionAnimation } from "@framecraft/core";
import type { LucideIcon } from "lucide-react";

export interface WhyChooseUsCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface WhyChooseUsConfig {
  headline: string;
  subhead: string;
  cards: WhyChooseUsCard[];
}

interface ValuePropsProps {
  config: WhyChooseUsConfig;
}

export function ValueProps({ config }: ValuePropsProps) {
  const titleRef = useIntersectionAnimation({ animationClass: "motion-fade-rise" });
  const cardsRef = useIntersectionAnimation({ stagger: true, animationClass: "motion-scale-in" });

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12"
      data-testid="section-value-props"
    >
      <div ref={titleRef} className="text-center mb-8 sm:mb-10">
        <h2
          className="font-serif font-semibold mb-3 sm:mb-4"
          style={{ fontSize: "clamp(1.5rem, 6vw, 2.75rem)" }}
          data-testid="text-value-props-title"
        >
          {config.headline}
        </h2>
        <p
          className="text-muted-foreground max-w-2xl mx-auto"
          style={{ fontSize: "clamp(0.875rem, 3.5vw, 1.125rem)" }}
        >
          {config.subhead}
        </p>
      </div>

      <div
        ref={cardsRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6"
      >
        {config.cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card
              key={index}
              data-testid={`card-value-prop-${index + 1}`}
              className="transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-1 hover:scale-[1.03] focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
              style={{ padding: "clamp(1rem, 2.5vw, 1.5rem)" }}
              tabIndex={0}
            >
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mb-3" data-testid={`icon-value-prop-${index + 1}`}>
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <CardTitle
                  className="font-semibold"
                  style={{ fontSize: "clamp(1.0625rem, 4vw, 1.125rem)" }}
                  data-testid={`text-value-prop-${index + 1}-title`}
                >
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p
                  className="text-muted-foreground leading-relaxed"
                  style={{ fontSize: "clamp(0.875rem, 3.5vw, 0.9375rem)" }}
                  data-testid={`text-value-prop-${index + 1}-description`}
                >
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
