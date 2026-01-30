import Link from "next/link";
import { Button } from "@framecraft/ui";
import { Construction } from "lucide-react";

interface ComingSoonPlaceholderProps {
  title: string;
  description?: string;
}

export function ComingSoonPlaceholder({ title, description }: ComingSoonPlaceholderProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted border border-border mb-6">
          <Construction className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3" data-testid="text-coming-soon-title">
          {title}
        </h1>
        <p className="text-muted-foreground mb-6" data-testid="text-coming-soon-description">
          {description ??
            "This page is under construction. Check back soon for our custom framing options."}
        </p>
        <Button asChild variant="default" size="lg">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
