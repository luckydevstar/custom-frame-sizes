import { Frame } from "lucide-react";
import { cn } from "../../utils";

interface FrameSpinnerProps {
  size?: "sm" | "default" | "lg";
  text?: string;
  className?: string;
}

export function FrameSpinner({ size = "default", text, className }: FrameSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Frame className={cn(sizeClasses[size], "animate-spin text-primary")} aria-label="Loading" />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
