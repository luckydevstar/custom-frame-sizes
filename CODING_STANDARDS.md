# FrameCraft Coding Standards

This document defines shared coding conventions across FrameCraft storefronts and packages.
It is the baseline for refactoring and new development work.

## 1) File Organization

For each app (`apps/*`) and package (`packages/*`), use this structure where applicable:

- `src/components/` for React components and component-specific submodules
- `src/lib/` for utility functions, integrations, and shared business helpers
- `src/hooks/` for React hooks
- `src/constants/` for static constants and config maps
- `src/types/` for type-only declarations and shared interfaces

Guidelines:

- Keep files close to their usage domain.
- Do not put app-specific logic in shared packages.
- If a module grows beyond one concern, split by responsibility (for example, parsing vs formatting).

## 2) Naming Conventions

- Components: PascalCase (`FrameDesigner.tsx`, `GlassSelector.tsx`)
- Functions and hooks: camelCase (`calculatePrice`, `useCart`)
- Constants: UPPER_CASE (`FRAME_STYLES`, `DEFAULT_MAT_SIZE`)
- Types and interfaces: PascalCase (`FrameConfig`, `PriceBreakdown`)
- Files should match the primary export name.

Examples:

- `src/components/FrameDesigner.tsx` exports `FrameDesigner`
- `src/hooks/useCart.ts` exports `useCart`
- `src/lib/calculatePrice.ts` exports `calculatePrice`

## 3) Component Structure

Component files should follow this order when practical:

1. Imports
2. Local types/interfaces
3. Constants/defaults
4. Component definition
5. Named exports

Conventions:

- Define a props interface or type for every public component.
- Keep defaults explicit (default parameter values or local constants).
- Add JSDoc comments for public/shared component APIs and utilities.
- Use `forwardRef` when exposing refs is required by composition needs.

Example:

```tsx
import { forwardRef } from "react";

export interface PriceTagProps {
  amount: number;
  currency?: string;
}

/**
 * Displays a formatted price value for storefront UI.
 */
export const PriceTag = forwardRef<HTMLSpanElement, PriceTagProps>(function PriceTag(
  { amount, currency = "USD" },
  ref
) {
  return (
    <span ref={ref}>
      {new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)}
    </span>
  );
});
```

## 4) Styling Standards

- Use Tailwind utility classes as the default styling approach.
- Avoid inline styles except for rare runtime values that cannot be represented with tokens/utilities.
- Do not introduce runtime CSS-in-JS frameworks.
- Use theme variables and design tokens from shared config/UI packages.

Preferred:

- `className="text-foreground bg-background border-border"`

Avoid:

- `style={{ color: "#123456" }}`
- one-off hardcoded colors bypassing theme tokens

## 5) TypeScript Standards

- Keep TypeScript strict mode enabled.
- Do not use `any`. If unavoidable, use `unknown` plus narrowing and document why.
- Use explicit return types for exported/public functions.
- Prefer discriminated unions or explicit model types over loosely shaped objects.
- Use branded types for IDs in domain boundaries where mixing IDs is risky.

Example branded ID:

```ts
export type FrameId = string & { readonly __brand: "FrameId" };
```

## 6) Testing Standards

- Add unit tests for utilities and hooks that contain logic.
- Add component tests for complex interactive components and critical rendering behavior.
- Avoid snapshot-heavy testing as a primary strategy.
- Prefer behavior-focused assertions over implementation-detail assertions.

Minimum expectation for new logic:

- one happy-path test
- one edge-case test

## 7) Git Conventions

- Keep commits small and focused on one intent.
- Use branch names like:
  - `feature/<short-topic>`
  - `fix/<short-topic>`
  - `refactor/<short-topic>`
- Start commit messages with an imperative verb:
  - `Add ...`
  - `Fix ...`
  - `Refactor ...`
  - `Update ...`

## 8) Refactoring Rules of Engagement

During refactors:

- Preserve behavior first, then improve structure.
- Prefer incremental refactors that are easy to review.
- Keep changes testable and reversible in small slices.
- Avoid cross-cutting rewrites without a staged migration plan.

## 9) Example Module Pattern

```ts
// src/lib/calculatePrice.ts
import type { FrameConfig } from "@/types/frame";

/**
 * Calculates final customer price from frame configuration.
 */
export function calculatePrice(config: FrameConfig): number {
  const base = config.basePrice;
  const matTotal = config.mats.reduce((sum, m) => sum + m.price, 0);
  return base + matTotal + config.glazing.price;
}
```

## Adoption Checklist

- [ ] Team reviewed and approved this document
- [ ] Shared in developer onboarding references
- [ ] Applied to active refactoring tasks
- [ ] Verified in PR review checklist
