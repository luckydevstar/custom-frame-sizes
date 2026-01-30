"use client";

import { useState, useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Input } from "./input";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
  testId?: string;
}

export function QuantitySelector({
  value,
  onChange,
  className = "",
  disabled = false,
  testId,
}: QuantitySelectorProps) {
  const [isCustom, setIsCustom] = useState(value >= 10);
  const [customValue, setCustomValue] = useState(value >= 10 ? value.toString() : "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value < 10) {
      setIsCustom(false);
    } else {
      setIsCustom(true);
      setCustomValue(value.toString());
    }
  }, [value]);

  // Auto-select text when switching to custom input mode
  useEffect(() => {
    if (isCustom && inputRef.current) {
      // Use setTimeout to ensure the input is rendered
      const timeoutId = setTimeout(() => {
        if (inputRef.current) {
          // Focus first, then select to ensure it works on all devices
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 10);

      // Cleanup: clear timeout if component unmounts
      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [isCustom]);

  const handleSelectChange = (val: string) => {
    if (val === "10+") {
      setIsCustom(true);
      setCustomValue("10");
      onChange(10);
    } else {
      setIsCustom(false);
      onChange(parseInt(val));
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomValue(val);

    const num = parseInt(val);
    // Only call onChange if the number is >= 10
    // This prevents switching back to dropdown mode while typing
    if (!isNaN(num) && num >= 10) {
      onChange(num);
    }
  };

  const handleCustomInputBlur = () => {
    const num = parseInt(customValue);
    if (isNaN(num) || num < 1) {
      // If blank or invalid, default to 10 (minimum for custom input)
      setCustomValue("10");
      onChange(10);
    } else if (num < 10) {
      setIsCustom(false);
      onChange(num);
    }
  };

  if (isCustom) {
    return (
      <Input
        ref={inputRef}
        type="number"
        min="1"
        value={customValue}
        onChange={handleCustomInputChange}
        onBlur={handleCustomInputBlur}
        disabled={disabled}
        className={className}
        data-testid={testId}
      />
    );
  }

  return (
    <Select value={value.toString()} onValueChange={handleSelectChange} disabled={disabled}>
      <SelectTrigger className={className} data-testid={testId}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <SelectItem key={num} value={num.toString()}>
            {num}
          </SelectItem>
        ))}
        <SelectItem value="10+">10+</SelectItem>
      </SelectContent>
    </Select>
  );
}
