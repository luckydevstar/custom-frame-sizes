"use client";

import { Sparkles } from "lucide-react";

export function FrameHeroBadge({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
      <Sparkles className="w-3 h-3" />
      <span className="text-xs font-medium">{text}</span>
    </div>
  );
}
