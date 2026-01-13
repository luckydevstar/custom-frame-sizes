/**
 * Component Override System
 *
 * System for resolving and rendering component overrides.
 * Allows stores to override shared components with custom implementations.
 */

import { lazy, Suspense, type ComponentType, type ReactNode } from "react";
import type { ComponentOverrides } from "@framecraft/config";
import { useStoreConfig } from "../stores/store-context";

/**
 * Component override registry
 * Maps component paths to their override implementations
 */
const overrideRegistry = new Map<string, () => Promise<{ default: ComponentType<unknown> }>>();

/**
 * Register a component override
 *
 * @param componentPath Component path (e.g., "ui/Button")
 * @param importFn Function that imports the override component
 */
export function registerComponentOverride(
  componentPath: string,
  importFn: () => Promise<{ default: ComponentType<unknown> }>
): void {
  overrideRegistry.set(componentPath, importFn);
}

/**
 * Resolve component override
 * Returns the override component if registered, otherwise returns null
 *
 * @param componentPath Component path
 * @returns Override component or null
 */
export function resolveComponentOverride(componentPath: string): ComponentType<unknown> | null {
  const importFn = overrideRegistry.get(componentPath);
  if (!importFn) {
    return null;
  }

  // Return lazy-loaded component
  return lazy(importFn) as ComponentType<unknown>;
}

/**
 * Component override wrapper
 * Renders override component if available, otherwise renders default
 */
export interface OverrideComponentProps {
  /**
   * Component path (e.g., "ui/Button")
   */
  componentPath: string;

  /**
   * Default component to render if no override
   */
  defaultComponent: ComponentType<unknown>;

  /**
   * Props to pass to component
   */
  props?: Record<string, unknown>;

  /**
   * Fallback UI while loading override
   */
  fallback?: ReactNode;
}

/**
 * OverrideComponent
 *
 * Renders component override if available, otherwise renders default component
 */
export function OverrideComponent({
  componentPath,
  defaultComponent: DefaultComponent,
  props = {},
  fallback = null,
}: OverrideComponentProps): JSX.Element {
  const config = useStoreConfig();
  const overrides = config.componentOverrides;

  // Check if override exists in config
  const overridePath = overrides?.[componentPath];

  if (overridePath) {
    // Try to resolve override
    const OverrideComponent = resolveComponentOverride(componentPath);

    if (OverrideComponent) {
      return (
        <Suspense fallback={fallback}>
          <OverrideComponent {...props} />
        </Suspense>
      );
    }

    // Override path specified but not registered
    console.warn(
      `Component override registered for "${componentPath}" but not loaded. Using default component.`
    );
  }

  // Use default component
  return <DefaultComponent {...props} />;
}

/**
 * Initialize component overrides from store config
 * Registers all component overrides from the store configuration
 *
 * @param overrides Component overrides from store config
 */
export function initializeComponentOverrides(overrides?: ComponentOverrides): void {
  if (!overrides) {
    return;
  }

  for (const [componentPath, overridePath] of Object.entries(overrides)) {
    // Register lazy import for override
    registerComponentOverride(componentPath, () => {
      // Dynamic import of override component
      // Note: This assumes overridePath is a valid import path
      return import(/* @vite-ignore */ overridePath);
    });
  }
}
