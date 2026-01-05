# @framecraft/config

Configuration and constants for FrameCraft.

## Overview

This package contains configuration data and constants used across the FrameCraft monorepo, including:

- **Palette Configuration**: Mat board palette definitions and display order
- **Other Constants**: Shared configuration values

## Installation

This package is part of the FrameCraft monorepo and is automatically linked via npm workspaces.

## Usage

```typescript
import {} from /* config exports */ "@framecraft/config";
```

## Structure

```
packages/config/
├── src/
│   ├── index.ts          # Main exports
│   └── palette.ts        # Palette configuration (TODO)
└── package.json
```

## Development

### Build

```bash
npm run build -- --filter=@framecraft/config
```

### Type Check

```bash
npm run type-check -- --filter=@framecraft/config
```

## Related Packages

- `@framecraft/types` - Type definitions used by config
- `@framecraft/core` - Services that use configuration
- `@framecraft/data` - Data files referenced by config
