# FrameCraft Monorepo - Workspace Documentation

**Comprehensive guide for developers working in the FrameCraft monorepo**

This document provides detailed information about the monorepo structure, conventions, workflows, and best practices for developers.

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Workspace Structure](#workspace-structure)
3. [Package Naming Conventions](#package-naming-conventions)
4. [Development Workflow](#development-workflow)
5. [Build System (Turborepo)](#build-system-turborepo)
6. [Common Commands](#common-commands)
7. [Code Quality Tools](#code-quality-tools)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 (comes with Node.js)
- **Git**: For version control

### First-Time Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd CustomFrameSizes-migrated
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   This installs dependencies for the root workspace and all packages/apps.

3. **Verify installation**

   ```bash
   # Check workspace structure
   npm list --workspaces

   # Verify Turborepo
   npx turbo --version

   # Verify TypeScript
   npx tsc --version
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

### Onboarding Checklist for New Developers

- [ ] Read this workspace documentation
- [ ] Review [MIGRATION_PLAN.md](./MIGRATION_PLAN.md) for project context
- [ ] Review [PHASE1_TICKETS.md](./PHASE1_TICKETS.md) for current work items
- [ ] Set up Git hooks (automatic with `npm install` via `prepare` script)
- [ ] Verify pre-commit hooks work by making a test commit
- [ ] Explore existing packages/apps structure
- [ ] Join team communication channels (if applicable)

---

## 📁 Workspace Structure

### Root Level

```
framecraft-monorepo/
├── apps/                    # Application entry points
├── packages/               # Shared packages
├── data/                   # Shared data files
├── content/                # Markdown content files
├── docs/                   # Documentation
├── .husky/                 # Git hooks (Husky)
├── turbo.json             # Turborepo configuration
├── tsconfig.base.json     # Shared TypeScript config
├── .eslintrc.json         # Shared ESLint config
├── .prettierrc            # Prettier configuration
└── package.json           # Root package.json with workspaces
```

### Apps (`apps/*`)

Applications are storefront instances and API services:

- **Purpose**: Individual storefront applications that import shared packages
- **Structure**: Each app has its own `package.json`, build configuration, and entry point
- **Examples**: `apps/store-a/`, `apps/store-b/`, `apps/api/`
- **Convention**: Store-specific overrides can exist within each app

### Packages (`packages/*`)

Shared packages provide reusable functionality:

- **Purpose**: Code shared across multiple apps/stores
- **Structure**: Each package is independently versioned and buildable
- **Naming**: Uses `@framecraft/*` scope
- **Types**: UI components, business logic, configs, types, data

**Planned Packages:**

- `@framecraft/ui` - UI component library
- `@framecraft/core` - Business logic and services
- `@framecraft/config` - Configuration and themes
- `@framecraft/types` - Shared TypeScript types
- `@framecraft/data` - Product catalogs and data

### Data (`data/`)

Shared data files:

- Product catalogs (`frames.json`, `mats.json`, `glass.json`)
- Pricing configurations
- Other static data files

### Content (`content/`)

Markdown content files:

- Blog posts
- CMS pages
- Documentation content

### Documentation (`docs/`)

- `MIGRATION_PLAN.md` - Overall migration strategy
- `PHASE1_TICKETS.md` - Phase 1 detailed tickets
- `WORKSPACE.md` - This file

---

## 📦 Package Naming Conventions

### Package Scope

All shared packages use the `@framecraft/` scope:

- `@framecraft/ui` - UI components
- `@framecraft/core` - Core business logic
- `@framecraft/config` - Configuration
- `@framecraft/types` - Type definitions
- `@framecraft/data` - Data packages

### App Naming

Apps are named descriptively:

- Store apps: `store-{identifier}` (e.g., `store-a`, `custompictureframes`)
- Services: Descriptive names (e.g., `api`, `admin`)

### Internal Dependencies

Use workspace protocol in `package.json`:

```json
{
  "dependencies": {
    "@framecraft/ui": "workspace:*",
    "@framecraft/core": "workspace:*"
  }
}
```

Or use explicit workspace paths:

```json
{
  "dependencies": {
    "@framecraft/ui": "*"
  }
}
```

---

## 🔄 Development Workflow

### Daily Workflow

1. **Pull latest changes**

   ```bash
   git pull origin main
   npm install  # If dependencies changed
   ```

2. **Start development**

   ```bash
   npm run dev
   ```

3. **Make changes**
   - Edit code in packages or apps
   - Pre-commit hooks will auto-format and lint on commit

4. **Test changes**

   ```bash
   npm run build      # Build everything
   npm run lint       # Lint all packages
   npm run type-check # Type check all packages
   ```

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: description"
   # Pre-commit hooks run automatically
   ```

### Package Development Workflow

When working on a shared package:

1. **Navigate to package**

   ```bash
   cd packages/ui  # Example
   ```

2. **Make changes**
   - Edit source files in `src/`
   - Package will rebuild automatically if using watch mode

3. **Test package**

   ```bash
   # From package directory
   npm run build
   npm run lint
   npm run type-check
   ```

4. **Use in app**
   - Changes are automatically available to apps via workspace links
   - No need to rebuild or reinstall (in dev mode)

### Creating a New Package

1. **Create directory structure**

   ```bash
   mkdir -p packages/new-package/src
   ```

2. **Initialize package**

   ```bash
   cd packages/new-package
   npm init -y
   ```

3. **Configure package.json**

   ```json
   {
     "name": "@framecraft/new-package",
     "version": "0.1.0",
     "main": "./dist/index.js",
     "types": "./dist/index.d.ts",
     "scripts": {
       "build": "tsc",
       "dev": "tsc --watch",
       "lint": "eslint src",
       "type-check": "tsc --noEmit"
     },
     "dependencies": {},
     "devDependencies": {}
   }
   ```

4. **Add TypeScript config**
   - Copy `packages/tsconfig.template.json` to `tsconfig.json`
   - Customize as needed

5. **Add ESLint config**
   - Copy `packages/.eslintrc.template.json` to `.eslintrc.json`
   - Customize as needed

6. **Build and verify**
   ```bash
   npm run build
   ```

### Creating a New App

1. **Create directory structure**

   ```bash
   mkdir -p apps/new-app
   ```

2. **Initialize app**
   - Follow framework-specific setup (Next.js, Vite, etc.)
   - Ensure it uses workspace packages

3. **Add to workspace**
   - Apps are automatically included via `apps/*` pattern in root `package.json`

---

## ⚡ Build System (Turborepo)

### What is Turborepo?

Turborepo is a high-performance build system for JavaScript/TypeScript monorepos. It:

- Runs tasks in parallel when possible
- Caches task outputs (skips unnecessary rebuilds)
- Manages task dependencies
- Only rebuilds what changed

### Configuration

Turborepo is configured in `turbo.json`:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**"],
      "cache": true
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": [],
      "cache": true
    }
  }
}
```

### Task Dependencies

- `^build` means "build dependencies first"
- `build` means "build this package before running task"

### Caching

Turborepo caches task outputs based on:

- Source file changes
- Environment variables
- Task configuration

Cache is stored in `.turbo/` directory.

### Common Turborepo Commands

```bash
# Run build for all packages
npm run build

# Run build for specific package
npx turbo run build --filter=@framecraft/ui

# Run build for package and dependencies
npx turbo run build --filter=@framecraft/ui...

# Run build for package and dependents
npx turbo run build --filter=...@framecraft/ui

# Force rebuild (ignore cache)
npx turbo run build --force

# View execution graph
npx turbo run build --graph

# Clear cache
npx turbo run build --force --no-cache
```

---

## 🛠️ Common Commands

### Root Level Commands

```bash
# Install dependencies
npm install

# Development
npm run dev                  # Start all apps in dev mode
npm run dev -- --filter=store-a  # Start specific app

# Build
npm run build               # Build all packages and apps
npm run build -- --filter=@framecraft/ui  # Build specific package

# Code Quality
npm run lint                # Lint all packages
npm run type-check          # Type check all packages
npm run format              # Format all code with Prettier
npm run format:check        # Check formatting without fixing

# Testing
npm run test                # Run all tests

# Cleanup
npm run clean               # Clean all build artifacts
```

### Package-Specific Commands

From a package directory:

```bash
npm run build       # Build package
npm run dev         # Watch mode (if configured)
npm run lint        # Lint package
npm run type-check  # Type check package
npm run test        # Run package tests
```

### Workspace Management

```bash
# List all workspaces
npm list --workspaces

# Install dependency in specific workspace
npm install <package> -w @framecraft/ui

# Run script in specific workspace
npm run build -w @framecraft/ui
```

---

## ✨ Code Quality Tools

### ESLint

- **Configuration**: `.eslintrc.json` (root)
- **Purpose**: Code linting and quality checks
- **Integration**: Pre-commit hooks run ESLint on staged files

```bash
# Lint all
npm run lint

# Lint specific package
npx turbo run lint --filter=@framecraft/ui

# Auto-fix issues
npm run lint -- --fix
```

### Prettier

- **Configuration**: `.prettierrc`
- **Purpose**: Code formatting
- **Integration**: Pre-commit hooks format staged files

```bash
# Format all
npm run format

# Check formatting
npm run format:check
```

### TypeScript

- **Configuration**: `tsconfig.base.json` (base) + package-specific configs
- **Purpose**: Type checking and compilation
- **Strict Mode**: Enabled with all strict flags

```bash
# Type check all
npm run type-check

# Type check specific package
npx turbo run type-check --filter=@framecraft/ui
```

### Git Hooks (Husky)

- **Pre-commit**: Runs lint-staged on staged files
- **Automatic**: Installed via `prepare` script in package.json
- **Bypass**: `git commit --no-verify` (emergency only)

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Dependencies Not Installing

**Problem**: `npm install` fails or packages not found

**Solutions**:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# On Windows PowerShell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

#### 2. TypeScript Errors

**Problem**: Type errors across packages

**Solutions**:

```bash
# Rebuild all packages
npm run build

# Check specific package
npx turbo run type-check --filter=@framecraft/ui

# Clear TypeScript build info
find . -name "tsconfig.tsbuildinfo" -delete
```

#### 3. Turborepo Cache Issues

**Problem**: Stale cache causing build issues

**Solutions**:

```bash
# Force rebuild (ignore cache)
npx turbo run build --force

# Clear cache directory
rm -rf .turbo
# Or on Windows
Remove-Item -Recurse -Force .turbo
```

#### 4. Pre-commit Hooks Not Running

**Problem**: Git hooks not executing

**Solutions**:

```bash
# Reinstall Husky hooks
npm run prepare

# Verify hook exists
cat .husky/pre-commit

# Check hook permissions (Linux/Mac)
chmod +x .husky/pre-commit
```

#### 5. Workspace Package Not Found

**Problem**: `Cannot find module '@framecraft/ui'`

**Solutions**:

```bash
# Reinstall all dependencies
npm install

# Verify package exists
npm list --workspaces

# Check package.json workspace configuration
cat package.json | grep workspaces
```

#### 6. Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use`

**Solutions**:

```bash
# Find process using port (example: 3000)
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

#### 7. ESLint/Prettier Conflicts

**Problem**: Formatting conflicts between ESLint and Prettier

**Solutions**:

- Ensure `eslint-config-prettier` is installed and last in ESLint extends array
- Verify `.eslintrc.json` includes `"prettier"` in extends

#### 8. Build Failing in CI/CD

**Problem**: Build works locally but fails in CI

**Solutions**:

- Check Node.js version matches CI environment
- Ensure all dependencies are in `package.json` (not just devDependencies)
- Clear cache: `npx turbo run build --force`
- Check for environment-specific issues

### Getting Help

1. **Check Documentation**
   - This file (WORKSPACE.md)
   - README.md
   - Package-specific README files

2. **Review Error Messages**
   - Error messages often contain specific solutions
   - Check stack traces for exact failing package

3. **Common Commands for Debugging**

   ```bash
   # Check Node/npm versions
   node --version
   npm --version

   # Check workspace structure
   npm list --workspaces --depth=0

   # Verify Turborepo
   npx turbo --version

   # Check TypeScript
   npx tsc --version
   ```

---

## 📚 Additional Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [npm Workspaces Documentation](https://docs.npmjs.com/cli/v9/using-npm/workspaces)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)

---

**Last Updated**: December 29, 2025  
**Maintained By**: FrameCraft Team
