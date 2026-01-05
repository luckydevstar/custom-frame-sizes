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
├── docs/                   # Documentation
│   ├── MIGRATION_PLAN.md  # Overall migration strategy
│   └── PHASE1_TICKETS.md  # Phase 1 detailed tickets
│
├── pnpm-workspace.yaml    # pnpm workspace configuration
├── turbo.json             # Turborepo build configuration
└── package.json           # Root package.json
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0

Install pnpm globally if not already installed:
```bash
npm install -g pnpm@8.15.0
```

### Installation

```bash
# Install all workspace dependencies
pnpm install

# Verify workspace structure
pnpm list -r
```

### Development

```bash
# Start all apps in development mode
pnpm dev

# Start specific app
pnpm dev --filter store-a

# Build all packages and apps
pnpm build

# Type check all packages
pnpm type-check

# Lint all packages
pnpm lint
```

## 📦 Workspace Packages

### Apps (`apps/*`)
- Individual storefront applications
- Each app imports shared packages
- Can have store-specific overrides

### Shared Packages (`packages/*`)
- **@framecraft/ui**: UI component library (Shadcn/ui, specialty designers)
- **@framecraft/core**: Business logic (pricing, products, Shopify integration)
- **@framecraft/config**: Configuration (themes, feature flags, navigation)
- **@framecraft/data**: Product catalogs (frames, mats, glass)
- **@framecraft/types**: Shared TypeScript type definitions

## 🛠️ Available Scripts

- `pnpm build` - Build all packages and apps
- `pnpm dev` - Start all apps in development mode
- `pnpm lint` - Lint all packages
- `pnpm type-check` - Type check all packages
- `pnpm test` - Run tests across all packages
- `pnpm clean` - Clean all build artifacts
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## 📚 Documentation

- [Migration Plan](./docs/MIGRATION_PLAN.md) - Complete migration strategy
- [Phase 1 Tickets](./docs/PHASE1_TICKETS.md) - Detailed Phase 1 task breakdown

## 🏗️ Architecture

This monorepo uses:
- **pnpm workspaces** for package management
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
pnpm turbo run build

# Run builds for specific package
pnpm turbo run build --filter=@framecraft/ui

# Run builds for a package and its dependencies
pnpm turbo run build --filter=@framecraft/ui...

# Clear Turborepo cache
pnpm turbo run build --force

# View task execution graph
pnpm turbo run build --graph
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
- ⏳ P1-003: Create Base Monorepo Directory Structure (Next)

## 📝 Development Guidelines

1. All shared code goes in `packages/`
2. Store-specific code goes in `apps/{store-name}/`
3. Use workspace protocol (`workspace:*`) for internal dependencies
4. Keep packages focused and independent where possible

## 🤝 Contributing

This is a private project. Follow the ticket structure in `docs/PHASE1_TICKETS.md` for work items.

---

**Last Updated**: December 29, 2025

