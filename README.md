# FrameCraft Monorepo

**Multi-Store Headless Shopify Platform**

This monorepo contains the FrameCraft platform, a headless Shopify solution supporting 10+ branded storefronts from a single codebase.

## 📁 Repository Structure

```
framecraft-monorepo/
├── apps/                    # Application entry points
│   ├── store-a/            # Store A frontend application
│   ├── store-b/            # Store B frontend application
│   ├── custompictureframes/ # CPF.com migration (Phase 5)
│   └── api/                # Shared API serverless functions
│
├── packages/               # Shared packages
│   ├── ui/                # Shared UI component library
│   ├── core/              # Business logic and services
│   ├── config/            # Configuration and themes
│   ├── data/              # Product catalogs and data
│   └── types/             # Shared TypeScript types
│
├── data/                   # Shared data files (to be migrated)
│   └── (frames.json, mats.json, etc.)
│
├── content/                # Markdown content files
│   └── (blog posts, pages, etc.)
│
├── docs/                   # Documentation
│   ├── WORKSPACE.md       # Workspace guide for developers
│   ├── MIGRATION_PLAN.md  # Overall migration strategy
│   └── PHASE1_TICKETS.md  # Phase 1 detailed tickets
│
├── turbo.json             # Turborepo build configuration
└── package.json           # Root package.json (includes workspaces config)
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 (comes with Node.js)

### Installation

```bash
# Install all workspace dependencies
npm install

# Verify workspace structure
npm list --workspaces
```

### Development

```bash
# Start all apps in development mode
npm run dev

# Start specific app (using Turborepo filter)
npm run dev -- --filter store-a

# Build all packages and apps
npm run build

# Type check all packages
npm run type-check

# Lint all packages
npm run lint
```

## 📁 Directory Structure

### Apps (`apps/*`)

Individual storefront applications that import shared packages. Each app can have store-specific overrides.

### Packages (`packages/*`)

Shared packages used across all stores:

- **@framecraft/ui**: UI component library (Shadcn/ui, specialty designers)
- **@framecraft/core**: Business logic (pricing, products, Shopify integration)
- **@framecraft/config**: Configuration (themes, feature flags, navigation)
- **@framecraft/types**: Shared TypeScript type definitions

### Data (`data/`)

Shared data files including product catalogs (frames.json, mats.json, glass.json, pricing-config.json). These will be migrated from the existing codebase.

### Content (`content/`)

Markdown content files for blog posts, CMS pages, and other content. Will be migrated from the existing codebase.

## 🛠️ Available Scripts

- `npm run build` - Build all packages and apps
- `npm run dev` - Start all apps in development mode
- `npm run lint` - Lint all packages
- `npm run type-check` - Type check all packages
- `npm run test` - Run tests across all packages
- `npm run clean` - Clean all build artifacts
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 📚 Documentation

- [Workspace Documentation](./docs/WORKSPACE.md) - Comprehensive workspace guide for developers
- [Migration Plan](./docs/MIGRATION_PLAN.md) - Complete migration strategy
- [Phase 1 Tickets](./docs/PHASE1_TICKETS.md) - Detailed Phase 1 task breakdown

## 🏗️ Architecture

This monorepo uses:

- **npm workspaces** for package management
- **Turborepo** for build orchestration and caching
- **TypeScript** for type safety
- **Shared packages** for code reuse across stores

## ⚡ Turborepo

This monorepo uses [Turborepo](https://turbo.build/) to manage and optimize the build process across all packages and apps.

### How It Works

Turborepo provides:

- **Task Orchestration**: Runs tasks in parallel when possible
- **Build Caching**: Skips unnecessary rebuilds based on file changes
- **Task Dependencies**: Ensures dependencies are built before dependents
- **Incremental Builds**: Only rebuilds what changed

### Pipeline Tasks

The `turbo.json` configuration defines the following tasks:

- **`build`**: Builds packages/apps, depends on dependencies being built first (`^build`)
- **`dev`**: Starts development servers (persistent, no caching)
- **`lint`**: Lints code across all packages
- **`type-check`**: Type checks TypeScript code
- **`test`**: Runs tests (depends on build)
- **`clean`**: Cleans build artifacts

### Turborepo Commands

```bash
# Run all builds
npm run build
# Or directly: npx turbo run build

# Run builds for specific package
npx turbo run build --filter=@framecraft/ui

# Run builds for a package and its dependencies
npx turbo run build --filter=@framecraft/ui...

# Clear Turborepo cache
npx turbo run build --force

# View task execution graph
npx turbo run build --graph
```

### Caching

Turborepo automatically caches task outputs. If a package hasn't changed, Turborepo will skip building it and use the cached output, dramatically speeding up builds.

Output directories are configured per task:

- `build`: `.next/**`, `dist/**`, `build/**`
- `test`: `coverage/**`

## 🔄 Migration Status

**Current Phase**: Phase 1 - Foundation & Architecture

- ✅ P1-001: pnpm Workspace Initialized
- ✅ P1-002: Turborepo Configuration Complete
- ✅ P1-003: Base Monorepo Directory Structure Created
- ✅ P1-004: Shared TypeScript Configuration Set Up
- ✅ P1-005: ESLint Configuration Complete
- ✅ P1-006: Prettier Configuration Complete
- ✅ P1-007: Pre-commit Hooks with Husky Complete
- ✅ P1-008: Workspace Documentation Complete

## 🔧 TypeScript Configuration

This monorepo uses a shared TypeScript base configuration (`tsconfig.base.json`) that all packages extend. This ensures consistent type checking and compilation settings across the entire codebase.

### Base Configuration

The `tsconfig.base.json` includes:

- **Strict type checking** enabled (all strict flags)
- **Modern target**: ES2022
- **Module system**: ESNext
- **Path mappings** for shared packages:
  - `@framecraft/ui` → `./packages/ui/src`
  - `@framecraft/core` → `./packages/core/src`
  - `@framecraft/config` → `./packages/config/src`
  - `@framecraft/types` → `./packages/types/src`
  - `@framecraft/data` → `./packages/data/src`

### Extending Base Config

Each package should have its own `tsconfig.json` that extends the base:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

See `packages/tsconfig.template.json` for a complete template.

### Type Checking

```bash
# Type check all packages
npm run type-check

# Type check specific package (using Turborepo)
npx turbo run type-check --filter=@framecraft/ui
```

## 🔍 ESLint Configuration

ESLint is configured at the root level to provide consistent linting rules across all packages.

### Configuration

The `.eslintrc.json` includes:

- **TypeScript ESLint**: TypeScript-specific linting rules
- **React ESLint**: React and React Hooks rules
- **Strict rules**: No unused variables, no floating promises, etc.
- **Monorepo support**: Works with TypeScript project references

### Extending ESLint Config

Each package can have its own `.eslintrc.json` that extends the root config:

```json
{
  "extends": ["../../.eslintrc.json"],
  "parserOptions": {
    "project": ["./tsconfig.json"]
  },
  "rules": {
    // Package-specific rule overrides
  }
}
```

See `packages/.eslintrc.template.json` for a complete template.

### Linting Commands

```bash
# Lint all packages
npm run lint

# Lint specific package (using Turborepo)
npx turbo run lint --filter=@framecraft/ui

# Fix linting issues automatically (add fix script if needed)
npm run lint -- --fix
```

## ✨ Prettier Configuration

Prettier is configured for consistent code formatting across all packages in the monorepo.

### Configuration

The `.prettierrc` includes:

- **Print width**: 100 characters
- **Tab width**: 2 spaces
- **Semicolons**: Enabled
- **Quotes**: Double quotes
- **Trailing commas**: ES5 compatible
- **End of line**: LF (Unix-style)

### ESLint Integration

Prettier is integrated with ESLint using `eslint-config-prettier` to disable formatting-related ESLint rules that conflict with Prettier. This ensures:

- ESLint handles code quality
- Prettier handles code formatting
- No conflicts between the two tools

### Formatting Commands

```bash
# Format all code
npm run format

# Check formatting without making changes (useful for CI)
npm run format:check
```

### Ignored Files

The `.prettierignore` file excludes:

- Build outputs (`dist/`, `build/`, `.next/`)
- Dependencies (`node_modules/`)
- Config files (to preserve their formatting)
- Lock files
- Cache directories

## 🪝 Git Hooks with Husky

Husky is configured to run automated checks before commits, ensuring code quality.

### Configuration

Husky uses pre-commit hooks that run `lint-staged` on staged files:

- **TypeScript/TSX files**: ESLint auto-fix + Prettier formatting
- **JSON/Markdown files**: Prettier formatting only

### How It Works

When you commit code:

1. Husky intercepts the commit
2. `lint-staged` runs only on staged files (not entire repo)
3. ESLint fixes are applied automatically
4. Prettier formats the files
5. If checks pass, commit proceeds
6. If checks fail, commit is blocked

### Bypassing Hooks (Emergency Only)

If you need to bypass the pre-commit hook in an emergency:

```bash
# Use --no-verify flag (use sparingly!)
git commit --no-verify -m "Emergency commit message"
```

**⚠️ Warning**: Only bypass hooks in genuine emergencies. The checks exist to maintain code quality.

### Manually Running lint-staged

You can test lint-staged without committing:

```bash
npx lint-staged
```

This runs the same checks that the pre-commit hook would run.

## 📝 Development Guidelines

1. All shared code goes in `packages/`
2. Store-specific code goes in `apps/{store-name}/`
3. Use workspace protocol (`workspace:*` or package name) for internal dependencies
4. Keep packages focused and independent where possible
5. All packages must extend `tsconfig.base.json` for consistency
6. Use `npm workspaces` commands for workspace management

## 🤝 Contributing

This is a private project. Follow the ticket structure in `docs/PHASE1_TICKETS.md` for work items.

---

**Last Updated**: December 29, 2025
