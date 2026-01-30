"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";

interface ComingSoonDesignerProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
}

export function ComingSoonDesigner({
  title = "Interactive designer coming soon",
  description = "Use our main frame designer to choose your size, frame style, and options. We'll add a dedicated designer for this category soon.",
  buttonLabel = "Design your frame",
}: ComingSoonDesignerProps) {
  return (
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
  );
}
