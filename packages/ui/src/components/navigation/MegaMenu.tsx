"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";

interface MegaMenuProps {
  label: string;
  children: React.ReactNode;
  isActive?: boolean;
}

export function MegaMenu({ label, children, isActive = false }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = `megamenu-${label.toLowerCase().replace(/\s+/g, "-")}`;

  const openMenu = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const closeMenu = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    openMenu();
  };

  const handleMouseLeave = () => {
    closeMenu();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
    } else if (e.key === "Escape" && isOpen) {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(false);
    }
  };

  const handleClick = () => {
    toggleMenu();
  };

  const handleFocus = () => {
    openMenu();
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!menuRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscapeGlobal = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeGlobal);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeGlobal);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen]);

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onBlur={handleBlur}
    >
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className="gap-1"
        data-testid={`button-megamenu-${label.toLowerCase().replace(/\s+/g, "-")}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={menuId}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onFocus={handleFocus}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          className="absolute left-0 top-full pt-2 z-50"
          data-testid={`megamenu-${label.toLowerCase().replace(/\s+/g, "-")}`}
          onKeyDown={handleMenuKeyDown}
        >
          <div className="bg-background border rounded-lg shadow-lg min-w-[600px]">{children}</div>
        </div>
      )}
    </div>
  );
}
