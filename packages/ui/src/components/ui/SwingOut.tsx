/**
 * SwingOut Progressive Disclosure Component
 * Accessible accordion wrapper for collapsible sections
 */

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

interface SwingOutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  testId?: string;
}

export function SwingOut({
  title,
  subtitle,
  children,
  defaultOpen = false,
  testId,
}: SwingOutProps) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? "item-1" : undefined}
      data-testid={testId}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger data-testid={`${testId}-trigger`}>
          <div className="flex flex-col items-start gap-1">
            <span>{title}</span>
            {subtitle && (
              <span className="text-sm font-normal text-muted-foreground">{subtitle}</span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent data-testid={`${testId}-content`}>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
