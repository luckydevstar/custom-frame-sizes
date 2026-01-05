# @framecraft/types

Shared TypeScript type definitions for FrameCraft.

## Package Structure

```
packages/types/
├── src/
│   ├── products.ts    # Product types (FrameStyle, MatColor, GlassType, etc.)
│   ├── schema.ts      # Database schema types (User, MatDesign, etc.)
│   ├── specialty.ts   # Specialty frame types (Shadowbox, mat, etc.)
│   └── index.ts       # Barrel exports
├── package.json
├── tsconfig.json
└── README.md
```

## Usage

```typescript
import type {
  FrameStyle,
  FrameConfiguration,
  PricingBreakdown,
  DesignRecommendation,
} from "@framecraft/types";
```

## Development

```bash
# Build the package (generates .d.ts files)
npm run build

# Watch mode
npm run dev

# Type check
npm run type-check

# Lint
npm run lint
```

## Status

This package is being populated as part of Phase 1 extraction. Type definitions are being moved from the original codebase incrementally in P1-023.

## Type Categories

### Product Types (`products.ts`)

- Frame styles, mat colors, glass types
- Frame configuration interfaces
- Pricing breakdown types

### Schema Types (`schema.ts`)

- Database entity types
- AI recommendation types
- Brass nameplate configuration

### Specialty Types (`specialty.ts`)

- Shadowbox-specific types
- Mat catalog types
- Specialty frame configurations
