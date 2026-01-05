# @framecraft/ui

Shared UI component library for FrameCraft multi-store platform.

## Overview

This package contains all shared UI components used across FrameCraft storefronts. Components are extracted from the existing codebase and organized for reuse across multiple stores.

## Package Structure

```
packages/ui/src/
├── components/
│   ├── ui/              # Base UI primitives (Shadcn/ui components)
│   ├── layout/          # Layout components (Header, Footer, Navigation)
│   ├── specialty/       # Specialty frame designers
│   ├── marketing/       # Marketing/showcase components
│   ├── media/           # Image/media components
│   ├── display/         # Display/card components
│   ├── modals/          # Modal components
│   ├── content/         # Content rendering components
│   ├── seo/             # SEO components
│   ├── overlay/         # Overlay components
│   ├── icons/           # Custom icon components
│   ├── error/           # Error handling components
│   └── gamification/    # Achievement/gamification (optional)
└── index.ts             # Barrel exports
```

## Usage

```typescript
import { Button, Header, Footer } from "@framecraft/ui";
```

## Development

```bash
# Type check
npm run type-check

# Build
npm run build

# Development mode (watch)
npm run dev

# Lint
npm run lint
```

## Extraction Status

Components will be extracted from `CustomFrameSizes-CODE/client/src/components/` according to the migration plan. See `docs/COMPONENT_AUDIT.md` for the complete extraction strategy.

## Dependencies

This package has peer dependencies on:

- `react` ^18.0.0
- `react-dom` ^18.0.0

Additional dependencies (Shadcn/ui, Tailwind, etc.) will be added as components are extracted.
