# @framecraft/core

Core business logic, services, utilities, and hooks for FrameCraft.

## Package Structure

```
packages/core/
├── src/
│   ├── services/      # Business logic services
│   │   ├── products.ts
│   │   ├── pricing.ts
│   │   ├── shopify.ts
│   │   ├── validation.ts
│   │   └── printCompositor.ts
│   ├── utils/        # Utility functions
│   │   ├── dimensions.ts
│   │   ├── exportPreview.ts
│   │   └── shadowbox-utils.ts
│   ├── hooks/        # Shared React hooks
│   │   ├── use-toast.ts
│   │   ├── use-mobile.ts
│   │   ├── useMobileViewToggle.ts
│   │   └── useIntersectionVisible.ts
│   └── index.ts      # Barrel exports
├── package.json
├── tsconfig.json
└── README.md
```

## Usage

```typescript
import { getFramesByCategory, calculatePricing, useToast, parseFraction } from "@framecraft/core";
```

## Development

```bash
# Build the package
npm run build

# Watch mode
npm run dev

# Type check
npm run type-check

# Lint
npm run lint
```

## Status

This package is being populated as part of Phase 1 extraction. Services, utilities, and hooks are being moved from the original codebase incrementally.
