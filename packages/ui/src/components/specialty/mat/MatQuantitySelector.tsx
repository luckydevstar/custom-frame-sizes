/**
 * Mat Quantity Selector – pack options with bulk savings labels.
 * Migrated from CustomFrameSizes-CODE client/src/features/mat/MatQuantitySelector.tsx.
 */

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

const PACK_OPTIONS = [
  { quantity: 1, label: "1", savings: null },
  { quantity: 2, label: "2", savings: null },
  { quantity: 4, label: "4", savings: "Save 5%" },
  { quantity: 10, label: "10", savings: "Save 15%" },
  { quantity: 25, label: "25", savings: "Save 25%" },
  { quantity: 50, label: "50", savings: "Save 30%" },
] as const;

export interface MatQuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  testId?: string;
  disabled?: boolean;
}

export function MatQuantitySelector({
  value,
  onChange,
  className = "",
  testId,
  disabled = false,
}: MatQuantitySelectorProps) {
  const matchingOption = PACK_OPTIONS.find((opt) => opt.quantity === value);
  const displayValue = matchingOption ? value : 1;

  const handleValueChange = (val: string) => {
    const quantity = parseInt(val, 10);
    if (!Number.isNaN(quantity) && quantity > 0) {
      onChange(quantity);
    }
  };

  return (
    <Select value={String(displayValue)} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className={className} data-testid={testId}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PACK_OPTIONS.map((option) => (
          <SelectItem key={option.quantity} value={String(option.quantity)}>
            {option.savings ? `${option.label} (${option.savings})` : option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
