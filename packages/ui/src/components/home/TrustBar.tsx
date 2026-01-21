import type { LucideIcon } from "lucide-react";

export interface TrustBarItem {
  icon: LucideIcon;
  label: string;
  value: string;
}

export interface TrustBarProps {
  items: TrustBarItem[];
}

export function TrustBar({ items }: TrustBarProps) {
  return (
    <div className="border-y bg-muted/30" data-testid="section-trust-bar">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 md:gap-12">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2.5"
                data-testid={`trust-item-${index + 1}`}
              >
                <Icon
                  className="h-5 w-5 text-primary flex-shrink-0"
                  aria-hidden="true"
                  data-testid={`trust-icon-${index + 1}`}
                />
                <span className="text-sm font-medium" data-testid={`trust-text-${index + 1}`}>
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
