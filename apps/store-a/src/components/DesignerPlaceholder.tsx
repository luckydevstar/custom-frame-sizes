"use client";

import Link from "next/link";
import { Button } from "@framecraft/ui";
import { Sparkles } from "lucide-react";

interface DesignerPlaceholderProps {
  /** Section id for scroll target */
  id?: string;
  /** Short title for the placeholder card */
  title?: string;
  /** Description shown in the card */
  description?: string;
  /** Button label */
  buttonLabel?: string;
  /** Optional test id for the section */
  testId?: string;
}

export function DesignerPlaceholder({
  id = "design-tool",
  title = "Interactive designer coming soon",
  description = "Use our main frame designer to choose your size, frame style, and options. We'll add a dedicated designer for this category soon.",
  buttonLabel = "Design your frame",
  testId = "designer-placeholder",
}: DesignerPlaceholderProps) {
  return (
    <section
      id={id}
      className="scroll-mt-20 container mx-auto px-4 py-12 md:py-16"
      data-testid={testId}
    >
      <div className="max-w-2xl mx-auto text-center p-8 rounded-xl border bg-muted/30">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        <Button asChild size="lg" className="rounded-full">
          <Link href="/designer">
            <Sparkles className="w-4 h-4 mr-2" />
            {buttonLabel}
          </Link>
        </Button>
      </div>
    </section>
  );
}
