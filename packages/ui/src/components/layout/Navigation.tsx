/**
 * Navigation Component
 *
 * Configurable navigation component for site navigation menu.
 *
 * NOTE: This is a simplified version created for P1-013. The full navigation system
 * has dependencies on MegaMenu components, navigation menu variants, and config that will
 * be extracted in future tickets. This component will be enhanced once those dependencies
 * are available.
 *
 * For now, this component serves as a configurable navigation wrapper that can accept
 * navigation items as configuration and render them appropriately.
 */

import { Link, useLocation } from "wouter";
import { Button } from "../ui/button";
import { type ReactNode } from "react";

export interface NavigationItem {
  /**
   * Label/text for the navigation item
   */
  label: string;

  /**
   * URL path for the navigation item
   */
  href: string;

  /**
   * Whether this item is a dropdown/mega menu (for future enhancement)
   */
  isDropdown?: boolean;

  /**
   * Custom React node to render instead of default button/link
   * Used for complex navigation items like MegaMenu
   */
  content?: ReactNode;

  /**
   * Optional test ID for testing
   */
  testId?: string;
}

export interface NavigationConfig {
  /**
   * Array of navigation items to display
   */
  items: NavigationItem[];

  /**
   * Custom className for the navigation container
   */
  className?: string;

  /**
   * Custom className for individual navigation items
   */
  itemClassName?: string;

  /**
   * Whether to show active state styling
   */
  showActiveState?: boolean;
}

export interface NavigationProps {
  /**
   * Navigation configuration
   */
  config?: NavigationConfig;

  /**
   * Custom navigation content (takes precedence over config.items)
   * TODO: Remove when navigation system is fully extracted
   */
  children?: ReactNode;
}

/**
 * Helper function to check if a navigation path is active
 */
function isActivePath(currentPath: string, targetPath: string): boolean {
  if (targetPath === "/") return currentPath === "/";
  return currentPath.startsWith(targetPath);
}

export function Navigation({ config, children }: NavigationProps) {
  const [location] = useLocation();

  // If children are provided, render them directly (for backward compatibility)
  if (children) {
    return (
      <nav className="hidden lg:flex items-center gap-1 flex-shrink-0" aria-label="Main navigation">
        {children}
      </nav>
    );
  }

  // If no config or items, return null
  if (!config || !config.items || config.items.length === 0) {
    return null;
  }

  const { items, className, itemClassName, showActiveState = true } = config;

  return (
    <nav
      className={className || "hidden lg:flex items-center gap-1 flex-shrink-0"}
      aria-label="Main navigation"
    >
      {items.map((item, index) => {
        // If custom content is provided, render it directly
        if (item.content) {
          return <div key={item.href || index}>{item.content}</div>;
        }

        // Otherwise, render as a standard navigation link
        const isActive = showActiveState ? isActivePath(location, item.href) : false;

        return (
          <Button
            key={item.href || index}
            variant={isActive ? "secondary" : "ghost"}
            asChild
            className={itemClassName}
            data-testid={item.testId || `nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <Link href={item.href}>{item.label}</Link>
          </Button>
        );
      })}
    </nav>
  );
}
