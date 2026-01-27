"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "@framecraft/core";

export function ThemeToggle() {
  const { isDark, toggleDark } = useTheme({ applyToDocument: false });

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => toggleDark()}
      data-testid="button-theme-toggle"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
    >
      {isDark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
      <span className="sr-only">{isDark ? "Switch to light mode" : "Switch to dark mode"}</span>
    </Button>
  );
}
