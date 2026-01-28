"use client";

import Link from "next/link";
import { BookOpen, Glasses, Ruler as RulerAlt } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useIntersectionAnimation } from "@framecraft/core";

const learnMoreConfig = {
  headline: "Learn More",
  subhead: "Expert guides to help you make the perfect framing choices.",
  cards: [
    {
      icon: BookOpen,
      title: "Mat Board Guide",
      description: "Learn how to choose the right mat color and size for your artwork.",
      link: "/mat-board-guide",
    },
    {
      icon: Glasses,
      title: "Glazing Guide",
      description: "Understand glass and acrylic options to protect your framed pieces.",
      link: "/glazing-guide",
    },
    {
      icon: RulerAlt,
      title: "How to Measure",
      description: "Get accurate artwork measurements for a perfect custom fit.",
      link: "/how-to-measure",
    },
  ],
};

export function EducationTeasers() {
  const titleRef = useIntersectionAnimation({ animationClass: "motion-fade-rise" });
  const cardsRef = useIntersectionAnimation({ stagger: true, animationClass: "motion-scale-in" });

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12"
      data-testid="section-education-teasers"
    >
      <div ref={titleRef} className="text-center mb-8 sm:mb-10">
        <h2
          className="font-serif font-semibold mb-3 sm:mb-4"
          style={{ fontSize: "clamp(1.5rem, 6vw, 2.75rem)" }}
          data-testid="text-education-title"
        >
          {learnMoreConfig.headline}
        </h2>
        <p
          className="text-muted-foreground max-w-2xl mx-auto"
          style={{ fontSize: "clamp(0.875rem, 3.5vw, 1.125rem)" }}
        >
          {learnMoreConfig.subhead}
        </p>
      </div>

      <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {learnMoreConfig.cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card
              key={index}
              data-testid={`card-guide-${index + 1}`}
              className="flex flex-col transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-1 hover:scale-[1.03] focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
              style={{ padding: "clamp(1rem, 2.5vw, 1.5rem)" }}
            >
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mb-3" data-testid={`icon-guide-${index + 1}`}>
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <CardTitle
                  className="font-semibold"
                  style={{ fontSize: "clamp(1.125rem, 4vw, 1.25rem)" }}
                  data-testid={`text-guide-${index + 1}-title`}
                >
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pt-0">
                <p
                  className="text-muted-foreground leading-relaxed"
                  style={{ fontSize: "clamp(0.875rem, 3.5vw, 0.9375rem)" }}
                  data-testid={`text-guide-${index + 1}-description`}
                >
                  {card.description}
                </p>
              </CardContent>
              <CardFooter className="pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hover:bg-primary/5 transition-colors"
                >
                  <Link href={card.link} data-testid={`button-guide-${index + 1}`}>
                    Learn More
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
