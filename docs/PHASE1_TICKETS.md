# Phase 1: Foundation & Architecture - Kanban Board Tickets

**Created**: December 29, 2025  
**Phase**: Phase 1 - Foundation & Architecture  
**Estimated Duration**: 8-10 weeks  
**Total Estimated Hours**: 320-400 hours

---

## Kanban Board Column Structure

```
┌─────────────┬──────────────┬──────────────┬──────────────┬─────────────┐
│   Backlog   │    Ready     │  In Progress │   Review     │    Done     │
│             │              │              │              │             │
│  (Phase 1)  │  (Next Up)   │  (Active)    │  (Testing)   │ (Completed) │
└─────────────┴──────────────┴──────────────┴──────────────┴─────────────┘
```

### Column Descriptions

1. **Backlog**: All Phase 1 tickets organized by section (1.1, 1.2, etc.)
2. **Ready**: Tickets ready to start (dependencies met, approved)
3. **In Progress**: Currently being worked on
4. **Review**: Completed and ready for code review/testing
5. **Done**: Completed, tested, and merged

### Labels/Tags

- `phase-1.1` - Monorepo Setup
- `phase-1.2` - Package Extraction
- `phase-1.3` - Storefront API
- `phase-1.4` - Admin API
- `phase-1.5` - Multi-Store Config
- `phase-1.6` - Database
- `priority-high` - Critical path items
- `priority-medium` - Important but not blocking
- `priority-low` - Can be deferred
- `blocked` - Waiting on dependency
- `documentation` - Documentation tasks
- `testing` - Testing/QA tasks

---

## Section 1.1: Monorepo Setup & Infrastructure

### Ticket P1-001: Initialize pnpm Workspace

**Labels**: `phase-1.1`, `priority-high`, `foundation`

**Estimated Hours**: 4 hours

**Description**:
Create the foundational pnpm workspace structure for the monorepo. This is the first step that enables all subsequent package work.

**Tasks**:

- Create new repository or branch for monorepo structure
- Install pnpm globally (if not already installed)
- Initialize pnpm workspace with `pnpm init`
- Create `pnpm-workspace.yaml` file
- Configure workspace to include `apps/*` and `packages/*` directories
- Create root `package.json` with basic metadata
- Add workspace scripts placeholder (build, dev, test, lint)
- Verify workspace structure with `pnpm list -r`

**Acceptance Criteria**:

- [ ] `pnpm-workspace.yaml` exists and correctly defines workspace patterns
- [ ] Root `package.json` exists with proper metadata
- [ ] Running `pnpm list -r` shows workspace structure
- [ ] Workspace can be initialized without errors
- [ ] Documentation added to README about workspace structure

**Files to Create/Modify**:

- `pnpm-workspace.yaml` (new)
- `package.json` (new/update)
- `README.md` (update)

---

### Ticket P1-002: Install and Configure Turborepo

**Labels**: `phase-1.1`, `priority-high`, `foundation`

**Estimated Hours**: 6 hours

**Description**:
Install Turborepo as the build orchestration tool and configure basic pipeline for monorepo tasks.

**Tasks**:

- Install Turborepo as dev dependency: `pnpm add -D turbo`
- Create initial `turbo.json` configuration file
- Configure basic pipeline tasks (build, dev, lint, type-check)
- Set up task dependencies using `dependsOn`
- Configure output directories for caching
- Add global dependencies configuration
- Test Turborepo runs with `pnpm turbo run build`
- Document Turborepo commands in README

**Acceptance Criteria**:

- [ ] `turbo.json` exists with valid configuration
- [ ] Turborepo is installed as dev dependency
- [ ] Pipeline defines at least: build, dev, lint, type-check tasks
- [ ] Task dependencies are properly configured
- [ ] Output directories specified for caching
- [ ] `pnpm turbo run build` executes without errors
- [ ] Documentation updated with Turborepo usage

**Files to Create/Modify**:

- `turbo.json` (new)
- `package.json` (update - add turbo dependency)
- `README.md` (update)

---

### Ticket P1-003: Create Base Monorepo Directory Structure

**Labels**: `phase-1.1`, `priority-high`, `foundation`

**Estimated Hours**: 2 hours

**Description**:
Create the directory structure for apps, packages, data, and content directories as planned in the architecture.

**Tasks**:

- Create `apps/` directory
- Create `packages/` directory
- Create `data/` directory (for shared data files)
- Create `content/` directory (for markdown content)
- Create `.gitkeep` files in empty directories
- Document directory structure in README
- Create initial directory structure diagram

**Acceptance Criteria**:

- [ ] All required directories exist: `apps/`, `packages/`, `data/`, `content/`
- [ ] Directory structure documented in README
- [ ] Empty directories have `.gitkeep` to preserve structure in git
- [ ] Structure matches planned architecture

**Files to Create/Modify**:

- `apps/.gitkeep` (new)
- `packages/.gitkeep` (new)
- `data/.gitkeep` (new)
- `content/.gitkeep` (new)
- `README.md` (update)

---

### Ticket P1-004: Set Up Shared TypeScript Configuration

**Labels**: `phase-1.1`, `priority-high`, `foundation`

**Estimated Hours**: 4 hours

**Description**:
Create base TypeScript configuration that all packages will extend, ensuring consistent TypeScript settings across the monorepo.

**Tasks**:

- Create `tsconfig.base.json` in root
- Configure base compiler options (target, module, lib, strict mode)
- Set up path mappings for shared packages
- Configure module resolution settings
- Set up project references structure
- Add TypeScript as dev dependency
- Create example `tsconfig.json` in a package showing how to extend base
- Document TypeScript configuration approach

**Acceptance Criteria**:

- [ ] `tsconfig.base.json` exists with appropriate settings
- [ ] Strict type checking enabled
- [ ] Path mappings configured for package imports
- [ ] Module resolution set to appropriate strategy
- [ ] TypeScript installed as dev dependency
- [ ] Documentation explains how packages extend base config
- [ ] Example package tsconfig.json created as template

**Files to Create/Modify**:

- `tsconfig.base.json` (new)
- `package.json` (update - add typescript dependency)
- `README.md` (update)

---

### Ticket P1-005: Configure ESLint for Monorepo

**Labels**: `phase-1.1`, `priority-medium`, `code-quality`

**Estimated Hours**: 3 hours

**Description**:
Set up ESLint configuration that works across all packages in the monorepo, with shared rules and package-specific overrides.

**Tasks**:

- Install ESLint and necessary plugins as dev dependencies
- Create root `.eslintrc.js` or `.eslintrc.json`
- Configure TypeScript ESLint parser
- Set up shared rules for React, TypeScript
- Configure monorepo-aware ESLint settings
- Add ESLint ignore patterns for build outputs
- Create example package ESLint config
- Add lint script to root package.json
- Test linting works: `pnpm turbo run lint`

**Acceptance Criteria**:

- [ ] ESLint configuration file exists at root
- [ ] TypeScript and React rules configured
- [ ] ESLint can run on all packages: `pnpm turbo run lint`
- [ ] Shared rules are consistent across packages
- [ ] Package-specific overrides are supported
- [ ] Documentation explains linting setup

**Files to Create/Modify**:

- `.eslintrc.json` (new)
- `package.json` (update - add eslint dependencies and scripts)
- `.eslintignore` (new)

---

### Ticket P1-006: Configure Prettier for Monorepo

**Labels**: `phase-1.1`, `priority-medium`, `code-quality`

**Estimated Hours**: 2 hours

**Description**:
Set up Prettier for consistent code formatting across all packages.

**Tasks**:

- Install Prettier as dev dependency
- Create `.prettierrc` configuration file
- Create `.prettierignore` file
- Configure Prettier rules (print width, tabs, semicolons, etc.)
- Add format script to root package.json
- Add format:check script for CI
- Integrate Prettier with ESLint (optional)
- Document Prettier configuration

**Acceptance Criteria**:

- [ ] `.prettierrc` exists with configuration
- [ ] `.prettierignore` exists with appropriate patterns
- [ ] Prettier installed as dev dependency
- [ ] Format scripts added to package.json
- [ ] Code can be formatted: `pnpm format`
- [ ] Format checking works: `pnpm format:check`
- [ ] Documentation explains formatting rules

**Files to Create/Modify**:

- `.prettierrc` (new)
- `.prettierignore` (new)
- `package.json` (update - add prettier and scripts)

---

### Ticket P1-007: Set Up Pre-commit Hooks with Husky

**Labels**: `phase-1.1`, `priority-medium`, `code-quality`

**Estimated Hours**: 3 hours

**Description**:
Configure Husky to run linting and formatting checks before commits, ensuring code quality.

**Tasks**:

- Install Husky as dev dependency
- Initialize Husky: `pnpm exec husky install`
- Create pre-commit hook script
- Configure hook to run lint-staged (if using) or direct lint/format
- Add lint-staged package (optional but recommended)
- Configure lint-staged to run on staged files only
- Test pre-commit hook works
- Document pre-commit hook behavior

**Acceptance Criteria**:

- [ ] Husky installed and initialized
- [ ] Pre-commit hook file exists in `.husky/`
- [ ] Hook runs linting on staged files
- [ ] Hook runs formatting checks
- [ ] Hook prevents commit if checks fail
- [ ] Documentation explains how to bypass hooks (emergency only)
- [ ] Test commit shows hooks working

**Files to Create/Modify**:

- `.husky/pre-commit` (new)
- `package.json` (update - add husky, lint-staged dependencies)
- `.lintstagedrc` (new, if using lint-staged)

---

### Ticket P1-008: Create Workspace Documentation

**Labels**: `phase-1.1`, `priority-medium`, `documentation`

**Estimated Hours**: 3 hours

**Description**:
Document the monorepo structure, conventions, and workflows for developers.

**Tasks**:

- Create `docs/WORKSPACE.md` or update root README
- Document workspace structure
- Explain package naming conventions
- Document build system (Turborepo) usage
- Explain development workflow
- Document common commands
- Add troubleshooting section
- Create getting started guide for new developers

**Acceptance Criteria**:

- [ ] Workspace documentation exists
- [ ] Structure and conventions clearly explained
- [ ] Common commands documented with examples
- [ ] Development workflow explained
- [ ] Troubleshooting section includes common issues
- [ ] New developer onboarding path clear

**Files to Create/Modify**:

- `docs/WORKSPACE.md` (new)
- `README.md` (update)

---

## Section 1.2: Package Extraction & Organization

### Ticket P1-009: Audit Existing Components for Extraction

**Labels**: `phase-1.2`, `priority-high`, `analysis`

**Estimated Hours**: 4 hours

**Description**:
Analyze existing component structure in `client/src/components/` to identify what should be extracted to shared packages.

**Tasks**:

- List all components in `client/src/components/`
- Categorize components: UI primitives, layout, specialty designers, business logic
- Identify dependencies between components
- Mark components as: shared, store-specific, or needs refactoring
- Document findings in spreadsheet or markdown
- Identify component groupings for package organization
- Note any breaking changes needed for extraction

**Acceptance Criteria**:

- [ ] Complete inventory of all components created
- [ ] Components categorized by extraction strategy
- [ ] Dependencies mapped between components
- [ ] Decision document created with recommendations
- [ ] Clear plan for which components go to which packages

**Deliverables**:

- Component audit document (markdown/spreadsheet)
- Extraction plan with priorities

---

### Ticket P1-010: Create @framecraft/ui Package Structure

**Labels**: `phase-1.2`, `priority-high`, `package-setup`

**Estimated Hours**: 3 hours

**Description**:
Initialize the UI package structure that will contain all shared UI components.

**Tasks**:

- Create `packages/ui/` directory
- Initialize package.json with name `@framecraft/ui`
- Create `src/` directory structure (components/, index.ts)
- Set up TypeScript configuration extending base
- Create initial `index.ts` barrel export file
- Set up package.json scripts (build, dev, type-check)
- Add package to workspace
- Test package can be imported from workspace root

**Acceptance Criteria**:

- [ ] `packages/ui/` directory structure exists
- [ ] Package.json configured with correct name and scripts
- [ ] TypeScript configuration extends base config
- [ ] Package can be built: `pnpm --filter @framecraft/ui build`
- [ ] Package can be imported in workspace
- [ ] Package structure documented

**Files to Create/Modify**:

- `packages/ui/package.json` (new)
- `packages/ui/tsconfig.json` (new)
- `packages/ui/src/index.ts` (new)
- `packages/ui/README.md` (new)

---

### Ticket P1-011: Extract Shadcn/ui Base Components

**Labels**: `phase-1.2`, `priority-high`, `package-extraction`

**Estimated Hours**: 6 hours

**Description**:
Move all Shadcn/ui primitive components (Button, Card, Dialog, etc.) to the UI package.

**Tasks**:

- Identify all Shadcn/ui components in `client/src/components/ui/`
- Copy components to `packages/ui/src/components/ui/`
- Update import paths within moved components
- Ensure all component dependencies are included
- Update barrel exports in `packages/ui/src/index.ts`
- Remove components from original location (after verification)
- Test components can be imported from package
- Update any existing imports in codebase (if extracting incrementally)

**Acceptance Criteria**:

- [ ] All Shadcn/ui components moved to `packages/ui/src/components/ui/`
- [ ] Components maintain original functionality
- [ ] Import paths updated and working
- [ ] Barrel exports include all components
- [ ] Package builds without errors
- [ ] Components can be imported: `import { Button } from '@framecraft/ui'`

**Files to Create/Modify**:

- `packages/ui/src/components/ui/*` (new - moved files)
- `packages/ui/src/index.ts` (update)
- Original component files (remove after verification)

---

### Ticket P1-012: Extract Layout Components (Header, Footer)

**Labels**: `phase-1.2`, `priority-high`, `package-extraction`

**Estimated Hours**: 4 hours

**Description**:
Move Header and Footer layout components to the UI package, making them shareable across stores.

**Tasks**:

- Locate Header component in current codebase
- Locate Footer component in current codebase
- Copy to `packages/ui/src/components/layout/`
- Extract any brand-specific logic (will be handled by theme/config later)
- Update component to accept configuration via props
- Update barrel exports
- Test components render correctly
- Update imports where used

**Acceptance Criteria**:

- [ ] Header component in `packages/ui/src/components/layout/Header.tsx`
- [ ] Footer component in `packages/ui/src/components/layout/Footer.tsx`
- [ ] Components accept configuration via props (theme, navigation, etc.)
- [ ] Components exported from package
- [ ] Package builds successfully
- [ ] Components can be imported and used

**Files to Create/Modify**:

- `packages/ui/src/components/layout/Header.tsx` (new)
- `packages/ui/src/components/layout/Footer.tsx` (new)
- `packages/ui/src/index.ts` (update)

---

### Ticket P1-013: Extract Navigation Component

**Labels**: `phase-1.2`, `priority-high`, `package-extraction`

**Estimated Hours**: 3 hours

**Description**:
Move Navigation component to UI package, making it configurable per store.

**Tasks**:

- Locate Navigation component
- Copy to `packages/ui/src/components/layout/Navigation.tsx`
- Make navigation items configurable via props
- Extract hardcoded navigation to configuration
- Update barrel exports
- Test component works with different navigation configs
- Document navigation configuration format

**Acceptance Criteria**:

- [ ] Navigation component in UI package
- [ ] Component accepts navigation configuration via props
- [ ] Hardcoded navigation items removed
- [ ] Component exported and buildable
- [ ] Documentation explains navigation configuration

**Files to Create/Modify**:

- `packages/ui/src/components/layout/Navigation.tsx` (new)
- `packages/ui/src/index.ts` (update)

---

### Ticket P1-014: Extract FrameDesigner Component

**Labels**: `phase-1.2`, `priority-high`, `package-extraction`

**Estimated Hours**: 6 hours

**Description**:
Move the main FrameDesigner component to UI package. This is a critical component that needs careful extraction.

**Tasks**:

- Locate FrameDesigner component
- Identify all dependencies (hooks, utilities, types)
- Copy component to `packages/ui/src/components/specialty/FrameDesigner.tsx`
- Move related hooks if they're designer-specific
- Update imports to use package imports where possible
- Extract business logic that should be in @framecraft/core
- Test component still works after extraction
- Update barrel exports

**Acceptance Criteria**:

- [ ] FrameDesigner component in UI package
- [ ] All dependencies identified and handled
- [ ] Component builds and runs correctly
- [ ] Business logic separated from UI logic
- [ ] Component exported from package
- [ ] Original functionality preserved

**Files to Create/Modify**:

- `packages/ui/src/components/specialty/FrameDesigner.tsx` (new)
- `packages/ui/src/index.ts` (update)
- May need to extract dependencies first (see related tickets)

---

### Ticket P1-015: Extract Specialty Designer Components

**Labels**: `phase-1.2`, `priority-high`, `package-extraction`

**Estimated Hours**: 8 hours

**Description**:
Move all specialty designer components (ShadowboxDesigner, JerseyDesigner, etc.) to UI package.

**Tasks**:

- Identify all specialty designer components
- For each designer:
  - Copy component to `packages/ui/src/components/specialty/`
  - Update imports
  - Extract business logic dependencies
  - Test component
- Update barrel exports to include all designers
- Create specialty designer index file
- Test all designers work after extraction

**Acceptance Criteria**:

- [ ] All specialty designers in UI package:
  - ShadowboxDesigner
  - JerseyDesigner
  - CanvasFloatDesigner
  - PuzzleDesigner
  - ComicBookDesigner
  - PlaybillDesigner
- [ ] Each component builds and works correctly
- [ ] All components exported from package
- [ ] Original functionality preserved

**Files to Create/Modify**:

- `packages/ui/src/components/specialty/*Designer.tsx` (new - multiple files)
- `packages/ui/src/index.ts` (update)

---

### Ticket P1-016: Create @framecraft/core Package Structure

**Labels**: `phase-1.2`, `priority-high`, `package-setup`

**Estimated Hours**: 3 hours

**Description**:
Initialize the core business logic package that will contain services, utilities, and shared logic.

**Tasks**:

- Create `packages/core/` directory
- Initialize package.json with name `@framecraft/core`
- Create directory structure: `src/services/`, `src/utils/`, `src/hooks/`, `src/types/`
- Set up TypeScript configuration
- Create initial barrel export files
- Set up package.json scripts
- Add package to workspace
- Test package structure

**Acceptance Criteria**:

- [ ] `packages/core/` structure exists
- [ ] Package.json configured correctly
- [ ] TypeScript configuration extends base
- [ ] Package can be built
- [ ] Directory structure matches planned architecture
- [ ] Package documented

**Files to Create/Modify**:

- `packages/core/package.json` (new)
- `packages/core/tsconfig.json` (new)
- `packages/core/src/index.ts` (new)
- `packages/core/src/services/index.ts` (new)
- `packages/core/src/utils/index.ts` (new)
- `packages/core/src/hooks/index.ts` (new)

---

### Ticket P1-017: Extract Products Service

**Labels**: `phase-1.2`, `priority-high`, `package-extraction`

**Estimated Hours**: 4 hours

**Description**:
Move products service to core package, making product data access reusable.

**Tasks**:

- Locate `client/src/services/products.ts`
- Copy to `packages/core/src/services/products.ts`
- Update imports (remove client-specific paths)
- Extract any client-specific dependencies
- Update barrel exports
- Test service functions work correctly
- Document service API

**Acceptance Criteria**:

- [ ] Products service in `packages/core/src/services/products.ts`
- [ ] All functions exported correctly
- [ ] No client-specific dependencies
- [ ] Service can be imported: `import { getFrameStyles } from '@framecraft/core'`
- [ ] Service functions work as expected
- [ ] API documented

**Files to Create/Modify**:

- `packages/core/src/services/products.ts` (new)
- `packages/core/src/services/index.ts` (update)
- `packages/core/src/index.ts` (update)

---

### Ticket P1-018: Extract Pricing Service

**Labels**: `phase-1.2`, `priority-high`, `package-extraction`

**Estimated Hours**: 5 hours

**Description**:
Move pricing calculation logic to core package. This is critical business logic that must work correctly.

**Tasks**:

- Locate `client/src/services/pricing.ts`
- Copy to `packages/core/src/services/pricing.ts`
- Identify and extract any dependencies
- Update imports to use package imports
- Test pricing calculations with existing test cases
- Ensure no client-specific code remains
- Update barrel exports
- Document pricing calculation logic

**Acceptance Criteria**:

- [ ] Pricing service in core package
- [ ] All pricing functions exported
- [ ] Calculations produce same results as before
- [ ] No client-specific dependencies
- [ ] Service can be imported and used
- [ ] Documentation explains pricing logic

**Files to Create/Modify**:

- `packages/core/src/services/pricing.ts` (new)
- `packages/core/src/services/index.ts` (update)
- `packages/core/src/index.ts` (update)

---

### Ticket P1-019: Extract Validation Service

**Labels**: `phase-1.2`, `priority-high`, `package-extraction`

**Estimated Hours**: 3 hours

**Description**:
Move validation utilities to core package for reuse across packages.

**Tasks**:

- Locate validation service/utilities
- Copy to `packages/core/src/services/validation.ts` or `src/utils/validation.ts`
- Update imports
- Test validation functions work correctly
- Export validation functions
- Document validation rules

**Acceptance Criteria**:

- [ ] Validation code in core package
- [ ] All validation functions exported
- [ ] Functions work correctly
- [ ] Can be imported and used
- [ ] Validation rules documented

**Files to Create/Modify**:

- `packages/core/src/services/validation.ts` (new)
- `packages/core/src/index.ts` (update)

---

### Ticket P1-020: Extract Shared Hooks

**Labels**: `phase-1.2`, `priority-medium`, `package-extraction`

**Estimated Hours**: 4 hours

**Description**:
Move reusable React hooks to core package.

**Tasks**:

- Identify hooks in `client/src/hooks/`
- Categorize: shared vs component-specific
- Copy shared hooks to `packages/core/src/hooks/`
- Update hook imports to use package imports
- Test hooks work correctly
- Update barrel exports
- Document hook usage

**Acceptance Criteria**:

- [ ] Shared hooks moved to core package
- [ ] Hooks in `packages/core/src/hooks/`
- [ ] All hooks exported correctly
- [ ] Hooks can be imported and used
- [ ] Hook documentation created

**Files to Create/Modify**:

- `packages/core/src/hooks/*.ts` (new - multiple files)
- `packages/core/src/hooks/index.ts` (new)
- `packages/core/src/index.ts` (update)

---

### Ticket P1-021: Extract Utility Functions

**Labels**: `phase-1.2`, `priority-medium`, `package-extraction`

**Estimated Hours**: 4 hours

**Description**:
Move shared utility functions from `client/src/lib/` to core package.

**Tasks**:

- Identify utility functions in `client/src/lib/`
- Categorize utilities (formatting, calculations, transformations)
- Copy utilities to `packages/core/src/utils/`
- Organize utilities into logical files
- Update imports
- Test utilities work correctly
- Export utilities
- Document utility functions

**Acceptance Criteria**:

- [ ] Utility functions in core package
- [ ] Organized into logical files
- [ ] All utilities exported
- [ ] Can be imported and used
- [ ] Utility documentation created

**Files to Create/Modify**:

- `packages/core/src/utils/*.ts` (new - multiple files)
- `packages/core/src/utils/index.ts` (new)
- `packages/core/src/index.ts` (update)

---

### Ticket P1-022: Create @framecraft/types Package

**Labels**: `phase-1.2`, `priority-high`, `package-setup`

**Estimated Hours**: 4 hours

**Description**:
Create dedicated types package for shared TypeScript type definitions.

**Tasks**:

- Create `packages/types/` directory
- Initialize package.json with name `@framecraft/types`
- Set up TypeScript configuration (declaration only)
- Create directory structure for different type categories
- Set up package.json scripts (type-check, build for declarations)
- Add package to workspace
- Create initial index.ts barrel export

**Acceptance Criteria**:

- [ ] `packages/types/` package exists
- [ ] Package.json configured correctly
- [ ] TypeScript configured for declaration output
- [ ] Package can be built to generate .d.ts files
- [ ] Package structure documented

**Files to Create/Modify**:

- `packages/types/package.json` (new)
- `packages/types/tsconfig.json` (new)
- `packages/types/src/index.ts` (new)

---

### Ticket P1-023: Extract Shared Type Definitions

**Labels**: `phase-1.2`, `priority-high`, `package-extraction`

**Estimated Hours**: 5 hours

**Description**:
Move all shared TypeScript type definitions to the types package.

**Tasks**:

- Identify type definitions in `client/src/types/`
- Categorize types (products, pricing, configuration, etc.)
- Copy types to `packages/types/src/` organized by category
- Update type imports to use package imports
- Ensure no circular dependencies
- Export all types from barrel exports
- Test types can be imported correctly
- Document type definitions

**Acceptance Criteria**:

- [ ] All shared types in types package
- [ ] Types organized by category
- [ ] All types exported correctly
- [ ] Can be imported: `import { FrameConfiguration } from '@framecraft/types'`
- [ ] No circular dependencies
- [ ] Type definitions documented

**Files to Create/Modify**:

- `packages/types/src/*.ts` (new - multiple type definition files)
- `packages/types/src/index.ts` (update)

---

### Ticket P1-024: Create @framecraft/config Package Structure

**Labels**: `phase-1.2`, `priority-high`, `package-setup`

**Estimated Hours**: 3 hours

**Description**:
Initialize the configuration package for shared configuration schemas and utilities.

**Tasks**:

- Create `packages/config/` directory
- Initialize package.json with name `@framecraft/config`
- Create directory structure for different config types
- Set up TypeScript configuration
- Create initial barrel exports
- Set up package scripts
- Add to workspace

**Acceptance Criteria**:

- [ ] `packages/config/` package exists
- [ ] Package.json configured correctly
- [ ] TypeScript configuration set up
- [ ] Package can be built
- [ ] Structure documented

**Files to Create/Modify**:

- `packages/config/package.json` (new)
- `packages/config/tsconfig.json` (new)
- `packages/config/src/index.ts` (new)

---

### Ticket P1-025: Extract Navigation Configuration

**Labels**: `phase-1.2`, `priority-medium`, `package-extraction`

**Estimated Hours**: 3 hours

**Description**:
Move navigation configuration to config package.

**Tasks**:

- Locate navigation configuration in current codebase
- Copy to `packages/config/src/navigation.ts`
- Define navigation configuration type/interface
- Make configuration data-driven
- Export configuration and types
- Document navigation configuration format

**Acceptance Criteria**:

- [ ] Navigation configuration in config package
- [ ] Configuration type defined
- [ ] Configuration exported correctly
- [ ] Can be imported and used
- [ ] Configuration format documented

**Files to Create/Modify**:

- `packages/config/src/navigation.ts` (new)
- `packages/config/src/index.ts` (update)

---

### Ticket P1-026: Extract Theme Configuration

**Labels**: `phase-1.2`, `priority-high`, `package-extraction`

**Estimated Hours**: 4 hours

**Description**:
Move theme configuration to config package, setting up the foundation for multi-store theming.

**Tasks**:

- Locate theme/color configuration in current codebase
- Copy to `packages/config/src/theme.ts`
- Define theme configuration interface
- Extract color palette definitions
- Extract typography configuration
- Export theme types and base theme
- Document theme configuration structure

**Acceptance Criteria**:

- [ ] Theme configuration in config package
- [ ] Theme interface/types defined
- [ ] Base theme exported
- [ ] Color palette extracted
- [ ] Typography configuration extracted
- [ ] Configuration documented

**Files to Create/Modify**:

- `packages/config/src/theme.ts` (new)
- `packages/config/src/index.ts` (update)

---

### Ticket P1-027: Extract Feature Flag System

**Labels**: `phase-1.2`, `priority-medium`, `package-extraction`

**Estimated Hours**: 4 hours

**Description**:
Move feature flag configuration and logic to config package.

**Tasks**:

- Locate feature flag definitions
- Copy to `packages/config/src/features.ts`
- Define feature flag type/interface
- Extract default feature flags
- Create feature flag evaluation utilities
- Export feature flag types and defaults
- Document feature flag system

**Acceptance Criteria**:

- [ ] Feature flag configuration in config package
- [ ] Feature flag interface defined
- [ ] Default flags exported
- [ ] Flag evaluation utilities created
- [ ] Can be imported and used
- [ ] Feature flag system documented

**Files to Create/Modify**:

- `packages/config/src/features.ts` (new)
- `packages/config/src/index.ts` (update)

---

### Ticket P1-028: Create @framecraft/data Package Structure

**Labels**: `phase-1.2`, `priority-high`, `package-setup`

**Estimated Hours**: 3 hours

**Description**:
Initialize the data package that will contain product catalogs and static data.

**Tasks**:

- Create `packages/data/` directory
- Initialize package.json (may not need build, just data files)
- Copy product catalog JSON files (frames.json, mats.json, glass.json)
- Copy pricing configuration JSON
- Set up package exports for data access
- Add package to workspace
- Document data package structure

**Acceptance Criteria**:

- [ ] `packages/data/` package exists
- [ ] All product catalog files copied
- [ ] Pricing configuration copied
- [ ] Package.json configured
- [ ] Data files accessible via package imports
- [ ] Package documented

**Files to Create/Modify**:

- `packages/data/package.json` (new)
- `packages/data/frames.json` (copy)
- `packages/data/mats.json` (copy)
- `packages/data/glass.json` (copy)
- `packages/data/pricing-config.json` (copy)

---

### Ticket P1-029: Update All Package Dependencies

**Labels**: `phase-1.2`, `priority-high`, `dependency-management`

**Estimated Hours**: 4 hours

**Description**:
Ensure all packages have correct dependencies and peer dependencies configured.

**Tasks**:

- Review each package's dependencies
- Move shared dependencies to workspace root where appropriate
- Configure peer dependencies correctly
- Add internal package dependencies (@framecraft/types, etc.)
- Run `pnpm install` to verify dependency resolution
- Fix any dependency conflicts
- Document dependency strategy

**Acceptance Criteria**:

- [ ] All packages have correct dependencies
- [ ] Peer dependencies configured properly
- [ ] Internal package dependencies working
- [ ] `pnpm install` completes without errors
- [ ] No dependency conflicts
- [ ] Dependency strategy documented

**Files to Create/Modify**:

- `packages/*/package.json` (update - all packages)
- Root `package.json` (update if moving dependencies)

---

### Ticket P1-030: Create Package Build Scripts

**Labels**: `phase-1.2`, `priority-high`, `build-system`

**Estimated Hours**: 4 hours

**Description**:
Configure build scripts for each package to ensure they can be built independently and as part of monorepo.

**Tasks**:

- Add build scripts to each package.json
- Configure output directories (dist/, lib/, etc.)
- Set up TypeScript compilation for packages that need it
- Configure build for data package (if needed)
- Test each package builds: `pnpm --filter <package> build`
- Test monorepo build: `pnpm turbo run build`
- Ensure build outputs are in correct locations

**Acceptance Criteria**:

- [ ] Each package has build script
- [ ] Packages can be built independently
- [ ] Monorepo build works: `pnpm turbo run build`
- [ ] Build outputs in correct directories
- [ ] Build process documented

**Files to Create/Modify**:

- `packages/*/package.json` (update - add build scripts)
- `turbo.json` (update if needed)

---

### Ticket P1-031: Update Package Exports and Barrel Files

**Labels**: `phase-1.2`, `priority-high`, `package-organization`

**Estimated Hours**: 3 hours

**Description**:
Ensure all packages have proper exports configured for clean imports.

**Tasks**:

- Review each package's main entry point
- Update barrel export files (index.ts) to export all public APIs
- Configure package.json exports field (if using)
- Test imports work: `import { ... } from '@framecraft/...'`
- Ensure internal exports are not exposed
- Document what each package exports

**Acceptance Criteria**:

- [ ] All packages have proper exports
- [ ] Barrel files export all public APIs
- [ ] Imports work correctly from packages
- [ ] Internal APIs not exposed
- [ ] Package exports documented

**Files to Create/Modify**:

- `packages/*/src/index.ts` (update - all packages)
- `packages/*/package.json` (update exports field)

---

## Section 1.3: Shopify Storefront API Integration

### Ticket P1-032: Design Storefront API Client Architecture

**Labels**: `phase-1.3`, `priority-high`, `architecture`

**Estimated Hours**: 4 hours

**Description**:
Design the architecture for the Storefront API client that will handle all client-side Shopify interactions.

**Tasks**:

- Research Shopify Storefront API structure
- Design client class structure
- Plan store identifier mapping system
- Design error handling approach
- Plan GraphQL query/mutation structure
- Design response transformation layer
- Create architecture diagram
- Document design decisions

**Acceptance Criteria**:

- [ ] Architecture design document created
- [ ] Client class structure defined
- [ ] Store mapping approach documented
- [ ] Error handling strategy defined
- [ ] GraphQL structure planned
- [ ] Design decisions documented

**Deliverables**:

- Architecture design document

---

### Ticket P1-033: Create Storefront API Client Base Class

**Labels**: `phase-1.3`, `priority-high`, `implementation`

**Estimated Hours**: 5 hours

**Description**:
Implement the base Storefront API client class in the core package.

**Tasks**:

- Create `packages/core/src/shopify/storefront-client.ts`
- Implement client class with constructor accepting store config
- Implement base query method
- Implement base mutation method
- Add error handling
- Add request/response logging (optional)
- Write unit tests for client
- Document client usage

**Acceptance Criteria**:

- [ ] StorefrontClient class implemented
- [ ] Query method works
- [ ] Mutation method works
- [ ] Error handling implemented
- [ ] Client can be instantiated with store config
- [ ] Unit tests pass
- [ ] Client usage documented

**Files to Create/Modify**:

- `packages/core/src/shopify/storefront-client.ts` (new)
- `packages/core/src/shopify/__tests__/storefront-client.test.ts` (new)

---

### Ticket P1-034: Implement Store Configuration Mapping

**Labels**: `phase-1.3`, `priority-high`, `implementation`

**Estimated Hours**: 4 hours

**Description**:
Create system to map store identifiers to Shopify store configurations.

**Tasks**:

- Design store configuration interface
- Create store configuration registry/map
- Implement function to get store config by ID
- Implement configuration validation
- Add default store configuration
- Create configuration loading mechanism
- Test store mapping works correctly
- Document store configuration setup

**Acceptance Criteria**:

- [ ] Store configuration interface defined
- [ ] Store mapping system implemented
- [ ] Can get store config by ID
- [ ] Configuration validation works
- [ ] Default configuration available
- [ ] Store mapping tested
- [ ] Configuration documented

**Files to Create/Modify**:

- `packages/core/src/shopify/store-config.ts` (new)

---

### Ticket P1-035: Create ProductFields GraphQL Fragment

**Labels**: `phase-1.3`, `priority-high`, `graphql`

**Estimated Hours**: 3 hours

**Description**:
Create reusable GraphQL fragment for product fields to ensure consistent product data structure.

**Tasks**:

- Research Shopify Storefront API product fields
- Create `packages/core/src/shopify/fragments.ts`
- Define ProductFields fragment with all needed fields
- Include product ID, title, handle, description
- Include price range fields
- Include image fields
- Include variant connection
- Document fragment usage
- Test fragment syntax is valid

**Acceptance Criteria**:

- [ ] ProductFields fragment created
- [ ] Fragment includes all essential product fields
- [ ] Fragment syntax is valid GraphQL
- [ ] Fragment documented
- [ ] Fragment can be composed in queries

**Files to Create/Modify**:

- `packages/core/src/shopify/fragments.ts` (new)

---

### Ticket P1-036: Create VariantFields GraphQL Fragment

**Labels**: `phase-1.3`, `priority-high`, `graphql`

**Estimated Hours**: 3 hours

**Description**:
Create reusable GraphQL fragment for product variant fields.

**Tasks**:

- Define VariantFields fragment
- Include variant ID, title, SKU
- Include price fields
- Include availability fields
- Include selected options
- Include variant image
- Add fragment to fragments file
- Document fragment
- Test fragment syntax

**Acceptance Criteria**:

- [ ] VariantFields fragment created
- [ ] Fragment includes all variant fields needed
- [ ] Fragment syntax valid
- [ ] Fragment documented
- [ ] Fragment can be used in queries

**Files to Create/Modify**:

- `packages/core/src/shopify/fragments.ts` (update)

---

### Ticket P1-037: Create CartFields GraphQL Fragment

**Labels**: `phase-1.3`, `priority-high`, `graphql`

**Estimated Hours**: 4 hours

**Description**:
Create GraphQL fragment for cart fields including line items.

**Tasks**:

- Define CartFields fragment
- Include cart ID, checkout URL
- Include total quantity
- Include cost breakdown (total, subtotal)
- Include lines connection with merchandise
- Compose ProductFields and VariantFields in fragment
- Add fragment to fragments file
- Document fragment structure
- Test fragment syntax

**Acceptance Criteria**:

- [ ] CartFields fragment created
- [ ] Fragment includes all cart fields
- [ ] Line items structure defined
- [ ] Fragment composes other fragments correctly
- [ ] Fragment syntax valid
- [ ] Fragment documented

**Files to Create/Modify**:

- `packages/core/src/shopify/fragments.ts` (update)

---

### Ticket P1-038: Create CollectionFields GraphQL Fragment

**Labels**: `phase-1.3`, `priority-medium`, `graphql`

**Estimated Hours**: 2 hours

**Description**:
Create GraphQL fragment for collection fields.

**Tasks**:

- Define CollectionFields fragment
- Include collection ID, title, handle, description
- Include product connection structure
- Add fragment to fragments file
- Document fragment
- Test fragment syntax

**Acceptance Criteria**:

- [ ] CollectionFields fragment created
- [ ] Fragment includes collection fields
- [ ] Product connection defined
- [ ] Fragment documented
- [ ] Fragment syntax valid

**Files to Create/Modify**:

- `packages/core/src/shopify/fragments.ts` (update)

---

### Ticket P1-039: Implement getProductByHandle Function

**Labels**: `phase-1.3`, `priority-high`, `implementation`

**Estimated Hours**: 5 hours

**Description**:
Implement function to fetch a single product by handle with store context.

**Tasks**:

- Create `packages/core/src/shopify/products.ts`
- Implement getProductByHandle function
- Accept storeId and handle as parameters
- Build GraphQL query using ProductFields fragment
- Execute query via StorefrontClient
- Transform Shopify response to internal format
- Add error handling
- Write unit tests
- Document function usage

**Acceptance Criteria**:

- [ ] getProductByHandle function implemented
- [ ] Function accepts storeId and handle
- [ ] Query uses ProductFields fragment
- [ ] Response transformed correctly
- [ ] Error handling works
- [ ] Unit tests pass
- [ ] Function documented with examples

**Files to Create/Modify**:

- `packages/core/src/shopify/products.ts` (new)
- `packages/core/src/shopify/__tests__/products.test.ts` (new)

---

### Ticket P1-040: Implement getCollection Function with Pagination

**Labels**: `phase-1.3`, `priority-high`, `implementation`

**Estimated Hours**: 6 hours

**Description**:
Implement function to fetch collection products with pagination support.

**Tasks**:

- Add getCollection function to products.ts
- Accept storeId, handle, and pagination params (first, after)
- Build GraphQL query with pagination arguments
- Include pageInfo in response
- Transform response including pagination info
- Handle empty collections
- Add error handling
- Write unit tests including pagination
- Document pagination usage

**Acceptance Criteria**:

- [ ] getCollection function implemented
- [ ] Pagination parameters accepted
- [ ] Query includes pageInfo
- [ ] Response includes pagination metadata
- [ ] Pagination works correctly (first, after)
- [ ] Unit tests cover pagination
- [ ] Function documented

**Files to Create/Modify**:

- `packages/core/src/shopify/products.ts` (update)
- `packages/core/src/shopify/__tests__/products.test.ts` (update)

---

### Ticket P1-041: Implement searchProducts Function

**Labels**: `phase-1.3`, `priority-medium`, `implementation`

**Estimated Hours**: 5 hours

**Description**:
Implement product search functionality using Shopify's search API.

**Tasks**:

- Add searchProducts function
- Accept storeId and search query string
- Build GraphQL search query
- Include pagination support
- Transform search results
- Handle empty results
- Add error handling
- Write unit tests
- Document search usage

**Acceptance Criteria**:

- [ ] searchProducts function implemented
- [ ] Search query parameter accepted
- [ ] GraphQL search query works
- [ ] Results transformed correctly
- [ ] Pagination supported
- [ ] Unit tests pass
- [ ] Function documented

**Files to Create/Modify**:

- `packages/core/src/shopify/products.ts` (update)
- `packages/core/src/shopify/__tests__/products.test.ts` (update)

---

### Ticket P1-042: Design Frame Configuration Serialization

**Labels**: `phase-1.3`, `priority-high`, `design`

**Estimated Hours**: 4 hours

**Description**:
Design how frame configurations will be serialized to Shopify line item attributes.

**Tasks**:

- Review current frame configuration structure
- Design attribute key naming convention
- Plan attribute structure (key-value pairs)
- Design JSON serialization for complex data
- Plan attribute order and organization
- Design deserialization strategy for order fulfillment
- Create serialization specification document
- Review with team/stakeholder

**Acceptance Criteria**:

- [ ] Serialization design document created
- [ ] Attribute naming convention defined
- [ ] Attribute structure planned
- [ ] JSON serialization approach defined
- [ ] Deserialization strategy planned
- [ ] Specification reviewed and approved

**Deliverables**:

- Frame configuration serialization specification

---

### Ticket P1-043: Implement Frame Configuration Serializer

**Labels**: `phase-1.3`, `priority-high`, `implementation`

**Estimated Hours**: 6 hours

**Description**:
Implement serializer to convert frame configuration to Shopify line item attributes.

**Tasks**:

- Create `packages/core/src/shopify/serialization.ts`
- Implement serializeFrameConfiguration function
- Convert configuration to attribute array
- Handle all configuration fields (dimensions, frame, mat, glass, etc.)
- Include JSON representation for order fulfillment
- Validate serialized data
- Write unit tests for serialization
- Document serialization format

**Acceptance Criteria**:

- [ ] serializeFrameConfiguration function implemented
- [ ] All configuration fields serialized
- [ ] Attributes follow naming convention
- [ ] JSON representation included
- [ ] Validation works
- [ ] Unit tests cover all configuration types
- [ ] Serialization documented

**Files to Create/Modify**:

- `packages/core/src/shopify/serialization.ts` (new)
- `packages/core/src/shopify/__tests__/serialization.test.ts` (new)

---

### Ticket P1-044: Implement Specialty Designer Serializers

**Labels**: `phase-1.3`, `priority-high`, `implementation`

**Estimated Hours**: 6 hours

**Description**:
Implement serializers for each specialty designer type (shadowbox, jersey, etc.).

**Tasks**:

- Create serializer functions for each designer type
- Implement serializeShadowboxConfiguration
- Implement serializeJerseyConfiguration
- Implement serializeCanvasFloatConfiguration
- Implement serializePuzzleConfiguration
- Implement serializeComicBookConfiguration
- Implement serializePlaybillConfiguration
- Test each serializer
- Document specialty serialization

**Acceptance Criteria**:

- [ ] Serializers for all specialty designers implemented
- [ ] Each serializer handles designer-specific fields
- [ ] All serializers follow same pattern
- [ ] Unit tests for each serializer
- [ ] Serialization documented

**Files to Create/Modify**:

- `packages/core/src/shopify/serialization.ts` (update)
- `packages/core/src/shopify/__tests__/serialization.test.ts` (update)

---

### Ticket P1-045: Implement Configuration Deserializer

**Labels**: `phase-1.3`, `priority-medium`, `implementation`

**Estimated Hours**: 5 hours

**Description**:
Implement deserializer to convert Shopify line item attributes back to frame configuration for order fulfillment.

**Tasks**:

- Implement deserializeFrameConfiguration function
- Parse attribute array back to configuration object
- Handle JSON attribute if present
- Validate deserialized configuration
- Support all configuration types
- Write unit tests
- Document deserialization

**Acceptance Criteria**:

- [ ] Deserializer function implemented
- [ ] Can deserialize all configuration types
- [ ] JSON attribute parsed correctly
- [ ] Validation works
- [ ] Unit tests pass
- [ ] Deserialization documented

**Files to Create/Modify**:

- `packages/core/src/shopify/serialization.ts` (update)
- `packages/core/src/shopify/__tests__/serialization.test.ts` (update)

---

### Ticket P1-046: Design Client-Side Cart State Management

**Labels**: `phase-1.3`, `priority-high`, `design`

**Estimated Hours**: 3 hours

**Description**:
Design the cart state management approach using Zustand for client-side cart handling.

**Tasks**:

- Review Zustand patterns
- Design cart store structure
- Plan cart state shape (items, totals, metadata)
- Design actions (addItem, removeItem, updateQuantity, etc.)
- Plan optimistic updates strategy
- Plan cart persistence strategy
- Design cart syncing with Storefront API
- Document cart state design

**Acceptance Criteria**:

- [ ] Cart state design document created
- [ ] Store structure defined
- [ ] Actions planned
- [ ] Optimistic update strategy defined
- [ ] Persistence strategy planned
- [ ] Design documented

**Deliverables**:

- Cart state management design document

---

### Ticket P1-047: Implement Cart Store with Zustand

**Labels**: `phase-1.3`, `priority-high`, `implementation`

**Estimated Hours**: 6 hours

**Description**:
Create Zustand store for cart state management.

**Tasks**:

- Install Zustand if not already installed
- Create `packages/core/src/stores/cart-store.ts`
- Define cart state interface
- Implement cart store with Zustand
- Add actions: addItem, removeItem, updateQuantity, clearCart
- Add selectors for cart totals
- Implement optimistic updates
- Write unit tests
- Document store usage

**Acceptance Criteria**:

- [ ] Cart store implemented with Zustand
- [ ] All cart actions implemented
- [ ] Selectors for totals work
- [ ] Optimistic updates implemented
- [ ] Unit tests pass
- [ ] Store can be used in React components
- [ ] Store usage documented

**Files to Create/Modify**:

- `packages/core/src/stores/cart-store.ts` (new)
- `packages/core/src/stores/__tests__/cart-store.test.ts` (new)
- `packages/core/package.json` (update - add zustand if needed)

---

### Ticket P1-048: Implement Cart Persistence

**Labels**: `phase-1.3`, `priority-medium`, `implementation`

**Estimated Hours**: 4 hours

**Description**:
Implement cart persistence to localStorage or sessionStorage.

**Tasks**:

- Design persistence strategy (localStorage vs sessionStorage)
- Implement saveCartToStorage function
- Implement loadCartFromStorage function
- Integrate persistence with cart store
- Handle storage errors gracefully
- Add cart expiration logic
- Test persistence works across page reloads
- Document persistence behavior

**Acceptance Criteria**:

- [ ] Cart persistence implemented
- [ ] Cart saves to storage
- [ ] Cart loads from storage on init
- [ ] Storage errors handled
- [ ] Cart expiration works
- [ ] Persistence tested
- [ ] Behavior documented

**Files to Create/Modify**:

- `packages/core/src/stores/cart-store.ts` (update)
- May need utility file for storage operations

---

### Ticket P1-049: Implement Cart Sync with Storefront API

**Labels**: `phase-1.3`, `priority-high`, `implementation`

**Estimated Hours**: 6 hours

**Description**:
Implement cart synchronization with Shopify Storefront API (cart creation/updates).

**Tasks**:

- Create cart mutation functions in shopify module
- Implement cartCreate mutation
- Implement cartLinesAdd mutation
- Implement cartLinesUpdate mutation
- Implement cartLinesRemove mutation
- Integrate mutations with cart store
- Handle sync errors
- Implement retry logic for failed syncs
- Write unit tests
- Document cart sync

**Acceptance Criteria**:

- [ ] Cart mutations implemented
- [ ] Cart can be created via API
- [ ] Cart lines can be added/updated/removed
- [ ] Mutations integrated with store
- [ ] Error handling works
- [ ] Retry logic implemented
- [ ] Unit tests pass
- [ ] Cart sync documented

**Files to Create/Modify**:

- `packages/core/src/shopify/cart.ts` (new)
- `packages/core/src/shopify/__tests__/cart.test.ts` (new)
- `packages/core/src/stores/cart-store.ts` (update)

---

### Ticket P1-050: Implement Cart Error Recovery

**Labels**: `phase-1.3`, `priority-medium`, `implementation`

**Estimated Hours**: 4 hours

**Description**:
Implement error recovery mechanisms for cart operations.

**Tasks**:

- Design error recovery strategy
- Implement cart state recovery on error
- Handle network errors
- Handle API errors (rate limits, etc.)
- Implement fallback to local-only cart
- Add error notifications
- Test error scenarios
- Document error handling

**Acceptance Criteria**:

- [ ] Error recovery implemented
- [ ] Cart state recovers from errors
- [ ] Network errors handled
- [ ] API errors handled gracefully
- [ ] Fallback to local cart works
- [ ] Error scenarios tested
- [ ] Error handling documented

**Files to Create/Modify**:

- `packages/core/src/stores/cart-store.ts` (update)
- `packages/core/src/shopify/cart.ts` (update)

---

## Section 1.4: Shopify Admin API Integration (Server-Side)

### Ticket P1-051: Design Backend API Architecture

**Labels**: `phase-1.4`, `priority-high`, `architecture`

**Estimated Hours**: 5 hours

**Description**:
Design the serverless API architecture for Vercel deployment with secure Admin API access.

**Tasks**:

- Research Vercel serverless function structure
- Design API route organization
- Plan endpoint structure (/api/cart, /api/checkout, etc.)
- Design request/response schemas
- Plan authentication approach
- Design rate limiting strategy
- Plan API versioning
- Create architecture diagram
- Document API design

**Acceptance Criteria**:

- [ ] API architecture document created
- [ ] Route structure defined
- [ ] Request/response schemas designed
- [ ] Authentication strategy defined
- [ ] Rate limiting approach planned
- [ ] Versioning strategy defined
- [ ] Architecture documented

**Deliverables**:

- Backend API architecture document

---

### Ticket P1-052: Set Up Vercel API Route Structure

**Labels**: `phase-1.4`, `priority-high`, `infrastructure`

**Estimated Hours**: 4 hours

**Description**:
Create the basic API route structure for Next.js/Vercel serverless functions.

**Tasks**:

- Decide on framework (Next.js API routes or standalone functions)
- Create `apps/api/` directory structure
- Set up route handlers structure
- Create example route handler template
- Configure Next.js API routes structure
- Set up route handler utilities
- Create route error handling wrapper
- Document API route structure

**Acceptance Criteria**:

- [ ] `apps/api/` directory created
- [ ] Route structure defined
- [ ] Example route handler works
- [ ] Route utilities created
- [ ] Error handling wrapper implemented
- [ ] Structure documented

**Files to Create/Modify**:

- `apps/api/package.json` (new)
- `apps/api/README.md` (new)
- `apps/api/lib/route-handler.ts` (new)
- `apps/api/routes/cart/route.ts` (new, template)

---

### Ticket P1-053: Implement POST /api/cart Endpoint

**Labels**: `phase-1.4`, `priority-high`, `implementation`

**Estimated Hours**: 6 hours

**Description**:
Create the POST endpoint for cart creation with secure Admin API integration and HTTP-only cookie management.

**Tasks**:

- Create POST /api/cart route handler
- Implement cart creation using Admin API
- Generate unique cart ID
- Set HTTP-only cookie with cart ID
- Implement request validation (variant ID, quantity, attributes)
- Add error handling and status codes
- Implement security checks (validate variant ID format)
- Add request logging
- Write unit tests

**Acceptance Criteria**:

- [ ] POST /api/cart creates new cart
- [ ] Cart ID stored in HTTP-only cookie
- [ ] Request validation works
- [ ] Error handling implemented
- [ ] Security checks in place
- [ ] Tests pass
- [ ] Documentation updated

**Files to Create/Modify**:

- `apps/api/routes/cart/route.ts` (update)
- `apps/api/lib/cart-utils.ts` (new)
- `apps/api/__tests__/cart.test.ts` (new)

---

### Ticket P1-054: Implement PATCH /api/cart/lines Endpoint

**Labels**: `phase-1.4`, `priority-high`, `implementation`

**Estimated Hours**: 5 hours

**Description**:
Create the PATCH endpoint for updating cart line items (add, update, remove items).

**Tasks**:

- Create PATCH /api/cart/lines route handler
- Implement cart ID retrieval from cookie
- Handle add line item operation
- Handle update line item operation
- Handle remove line item operation
- Validate cart ID exists
- Implement request validation
- Update HTTP-only cookie if needed
- Add error handling
- Write unit tests

**Acceptance Criteria**:

- [ ] PATCH /api/cart/lines updates cart
- [ ] Can add items to cart
- [ ] Can update item quantities
- [ ] Can remove items from cart
- [ ] Cart ID validation works
- [ ] Error handling implemented
- [ ] Tests pass

**Files to Create/Modify**:

- `apps/api/routes/cart/lines/route.ts` (new)
- `apps/api/lib/cart-utils.ts` (update)
- `apps/api/__tests__/cart-lines.test.ts` (new)

---

### Ticket P1-055: Implement Request Validation and Sanitization

**Labels**: `phase-1.4`, `priority-high`, `security`

**Estimated Hours**: 4 hours

**Description**:
Create validation utilities to sanitize and validate all API requests for security.

**Tasks**:

- Create validation schema for cart requests
- Create validation schema for checkout requests
- Implement variant ID format validation
- Implement quantity validation (min/max)
- Implement attribute validation
- Create sanitization functions
- Add input type checking
- Prevent SQL injection patterns
- Prevent XSS in attributes
- Write validation tests

**Acceptance Criteria**:

- [ ] Validation schemas created
- [ ] All inputs validated
- [ ] Sanitization implemented
- [ ] Security patterns prevented
- [ ] Tests pass
- [ ] Documentation updated

**Files to Create/Modify**:

- `apps/api/lib/validation.ts` (new)
- `apps/api/lib/sanitization.ts` (new)
- `apps/api/__tests__/validation.test.ts` (new)

---

### Ticket P1-056: Implement Rate Limiting

**Labels**: `phase-1.4`, `priority-high`, `security`

**Estimated Hours**: 5 hours

**Description**:
Add rate limiting to API endpoints to prevent abuse and protect against DoS attacks.

**Tasks**:

- Research rate limiting libraries (e.g., `@upstash/ratelimit`)
- Design rate limiting strategy (per IP, per session)
- Configure rate limits for cart endpoints
- Configure rate limits for checkout endpoints
- Implement rate limit middleware
- Add rate limit headers to responses
- Handle rate limit exceeded responses
- Add rate limit logging
- Test rate limiting behavior
- Document rate limit configuration

**Acceptance Criteria**:

- [ ] Rate limiting implemented
- [ ] Limits configured per endpoint
- [ ] Rate limit headers added
- [ ] Error responses handled
- [ ] Logging implemented
- [ ] Tests pass
- [ ] Documentation updated

**Files to Create/Modify**:

- `apps/api/lib/rate-limit.ts` (new)
- `apps/api/middleware/rate-limit.ts` (new)
- `apps/api/__tests__/rate-limit.test.ts` (new)

---

### Ticket P1-057: Create Admin API Client Abstraction

**Labels**: `phase-1.4`, `priority-high`, `implementation`

**Estimated Hours**: 5 hours

**Description**:
Build a secure abstraction layer for Shopify Admin API calls that handles tokens, errors, and retries.

**Tasks**:

- Create Admin API client class
- Implement token management (from environment variables)
- Add GraphQL query execution
- Implement error handling and retries
- Add request logging
- Create helper methods for common operations
- Implement rate limit handling
- Add TypeScript types for Admin API responses
- Write unit tests
- Document Admin API client usage

**Acceptance Criteria**:

- [ ] Admin API client created
- [ ] Token management works
- [ ] GraphQL queries execute
- [ ] Error handling implemented
- [ ] Retries work
- [ ] Logging added
- [ ] Tests pass
- [ ] Documentation updated

**Files to Create/Modify**:

- `packages/core/src/shopify/admin-client.ts` (new)
- `packages/core/src/shopify/admin-types.ts` (new)
- `packages/core/src/shopify/__tests__/admin-client.test.ts` (new)

---

### Ticket P1-058: Implement POST /api/checkout Endpoint

**Labels**: `phase-1.4`, `priority-high`, `implementation`

**Estimated Hours**: 6 hours

**Description**:
Create the checkout endpoint that generates Shopify checkout URLs from cart data.

**Tasks**:

- Create POST /api/checkout route handler
- Retrieve cart from cookie or cart ID
- Validate cart has items
- Generate checkout URL using Storefront API or Admin API
- Handle discount code validation
- Add customer data validation
- Implement fraud prevention checks
- Return checkout URL in response
- Add error handling
- Write unit tests

**Acceptance Criteria**:

- [ ] POST /api/checkout creates checkout
- [ ] Checkout URL generated correctly
- [ ] Discount codes validated
- [ ] Customer data validated
- [ ] Fraud checks implemented
- [ ] Error handling works
- [ ] Tests pass

**Files to Create/Modify**:

- `apps/api/routes/checkout/route.ts` (new)
- `apps/api/lib/checkout-utils.ts` (new)
- `apps/api/__tests__/checkout.test.ts` (new)

---

### Ticket P1-059: Implement Checkout Abandonment Tracking

**Labels**: `phase-1.4`, `priority-low`, `analytics`

**Estimated Hours**: 3 hours

**Description**:
Add optional tracking for checkout abandonment to help analyze conversion funnel.

**Tasks**:

- Design abandonment tracking data structure
- Create tracking endpoint (optional)
- Implement abandonment event logging
- Add analytics integration (optional)
- Create tracking utilities
- Document tracking implementation
- Add feature flag for tracking

**Acceptance Criteria**:

- [ ] Abandonment tracking designed
- [ ] Tracking implemented
- [ ] Analytics integrated (if applicable)
- [ ] Feature flag added
- [ ] Documentation updated

**Files to Create/Modify**:

- `apps/api/lib/checkout-tracking.ts` (new)
- `apps/api/routes/checkout/tracking/route.ts` (new, optional)

---

### Ticket P1-060: Implement Order File Management - POST Endpoint

**Labels**: `phase-1.4`, `priority-medium`, `implementation`

**Estimated Hours**: 5 hours

**Description**:
Create endpoint for storing order file metadata associated with Shopify orders.

**Tasks**:

- Create POST /api/orders/files route handler
- Validate order ID (Shopify order ID format)
- Validate file metadata (file type, URL, name)
- Store order file metadata in database
- Link file to site ID (multi-tenant)
- Add request validation
- Implement error handling
- Write unit tests

**Acceptance Criteria**:

- [ ] POST /api/orders/files works
- [ ] Order file metadata stored
- [ ] Site ID linked correctly
- [ ] Validation implemented
- [ ] Error handling works
- [ ] Tests pass

**Files to Create/Modify**:

- `apps/api/routes/orders/files/route.ts` (new)
- `apps/api/lib/order-file-utils.ts` (new)
- `apps/api/__tests__/order-files.test.ts` (new)

---

### Ticket P1-061: Implement Order File Management - GET Endpoint

**Labels**: `phase-1.4`, `priority-medium`, `implementation`

**Estimated Hours**: 4 hours

**Description**:
Create endpoint to retrieve order files by order ID with proper site ID filtering.

**Tasks**:

- Create GET /api/orders/files route handler
- Retrieve order ID from query parameters
- Filter by site ID (multi-tenant security)
- Query database for order files
- Return file metadata list
- Add error handling
- Implement pagination if needed
- Write unit tests

**Acceptance Criteria**:

- [ ] GET /api/orders/files retrieves files
- [ ] Site ID filtering works
- [ ] Error handling implemented
- [ ] Tests pass

**Files to Create/Modify**:

- `apps/api/routes/orders/files/route.ts` (update)
- `apps/api/lib/order-file-utils.ts` (update)
- `apps/api/__tests__/order-files.test.ts` (update)

---

### Ticket P1-062: Design Store Configuration Schema

**Labels**: `phase-1.5`, `priority-high`, `design`

**Estimated Hours**: 5 hours

**Description**:
Design the complete TypeScript interface for store configuration including all override options.

**Tasks**:

- Review existing brand.config.ts structure
- Design BrandConfig interface
- Design theme override interface
- Design feature flag interface
- Design navigation customization interface
- Design component override interface
- Create TypeScript types
- Document all configuration options
- Create configuration validation schema
- Create example configurations

**Acceptance Criteria**:

- [ ] BrandConfig interface designed
- [ ] All configuration types defined
- [ ] Validation schema created
- [ ] Examples created
- [ ] Documentation complete

**Files to Create/Modify**:

- `packages/config/src/types/brand-config.ts` (new)
- `packages/config/src/validation/schema.ts` (new)
- `packages/config/docs/configuration.md` (new)

---

### Ticket P1-063: Create Base Theme System

**Labels**: `phase-1.5`, `priority-high`, `implementation`

**Estimated Hours**: 5 hours

**Description**:
Implement the base theme system with CSS custom properties that stores can override.

**Tasks**:

- Design theme token structure (colors, fonts, spacing, etc.)
- Create base theme configuration
- Implement CSS custom properties generation
- Create theme utility functions
- Create theme type definitions
- Document theme structure
- Create theme examples

**Acceptance Criteria**:

- [ ] Base theme created
- [ ] CSS custom properties generated
- [ ] Theme utilities work
- [ ] Types defined
- [ ] Examples created
- [ ] Documentation complete

**Files to Create/Modify**:

- `packages/config/src/theme/base-theme.ts` (new)
- `packages/config/src/theme/theme-utils.ts` (new)
- `packages/config/src/theme/types.ts` (new)

---

### Ticket P1-064: Implement Theme Merging Function

**Labels**: `phase-1.5`, `priority-high`, `implementation`

**Estimated Hours**: 4 hours

**Description**:
Create function to merge store-specific theme overrides with base theme.

**Tasks**:

- Design theme merging algorithm (deep merge)
- Implement theme merge function
- Handle color overrides
- Handle font overrides
- Handle spacing overrides
- Preserve base theme for missing values
- Add TypeScript types
- Write unit tests
- Document merging behavior

**Acceptance Criteria**:

- [ ] Theme merge function works
- [ ] Deep merge implemented correctly
- [ ] All override types supported
- [ ] Base theme preserved
- [ ] Tests pass
- [ ] Documentation complete

**Files to Create/Modify**:

- `packages/config/src/theme/theme-merge.ts` (new)
- `packages/config/src/theme/__tests__/theme-merge.test.ts` (new)

---

### Ticket P1-065: Implement Runtime Theme Application

**Labels**: `phase-1.5`, `priority-high`, `implementation`

**Estimated Hours**: 5 hours

**Description**:
Create React hook and utilities to apply merged theme to the application at runtime.

**Tasks**:

- Create useTheme hook
- Implement CSS custom property injection
- Create ThemeProvider component
- Handle theme switching at runtime
- Add TypeScript support
- Create theme context
- Write unit tests
- Document usage

**Acceptance Criteria**:

- [ ] useTheme hook works
- [ ] ThemeProvider implemented
- [ ] CSS properties injected
- [ ] Runtime switching works
- [ ] Tests pass
- [ ] Documentation complete

**Files to Create/Modify**:

- `packages/core/src/hooks/use-theme.ts` (new)
- `packages/ui/src/providers/ThemeProvider.tsx` (new)
- `packages/core/src/__tests__/use-theme.test.ts` (new)

---

### Ticket P1-066: Implement Feature Flag System Core

**Labels**: `phase-1.5`, `priority-medium`, `implementation`

**Estimated Hours**: 4 hours

**Description**:
Create the core feature flag evaluation system that checks store configuration.

**Tasks**:

- Design feature flag structure
- Create default feature flags
- Implement feature flag evaluation function
- Create useFeatureFlag hook
- Add TypeScript types
- Write unit tests
- Document feature flags

**Acceptance Criteria**:

- [ ] Feature flag structure defined
- [ ] Default flags created
- [ ] Evaluation function works
- [ ] useFeatureFlag hook works
- [ ] Tests pass
- [ ] Documentation complete

**Files to Create/Modify**:

- `packages/config/src/features/default-features.ts` (new)
- `packages/config/src/features/feature-flags.ts` (new)
- `packages/core/src/hooks/use-feature-flag.ts` (new)
- `packages/config/src/__tests__/feature-flags.test.ts` (new)

---

### Ticket P1-067: Implement Component Override System

**Labels**: `phase-1.5`, `priority-medium`, `implementation`

**Estimated Hours**: 6 hours

**Description**:
Create system for stores to override shared components with custom implementations.

**Tasks**:

- Design component override resolution algorithm
- Create override registry
- Implement lazy loading for override components
- Create fallback to default components
- Create useComponentOverride hook
- Add override validation
- Write unit tests
- Document override patterns
- Create override examples

**Acceptance Criteria**:

- [ ] Override system designed
- [ ] Lazy loading works
- [ ] Fallback works
- [ ] Validation implemented
- [ ] Tests pass
- [ ] Examples created
- [ ] Documentation complete

**Files to Create/Modify**:

- `packages/core/src/components/override-registry.ts` (new)
- `packages/core/src/hooks/use-component-override.ts` (new)
- `packages/ui/src/components/OverrideResolver.tsx` (new)
- `packages/core/src/__tests__/component-override.test.ts` (new)

---

### Ticket P1-068: Create Store Context Provider

**Labels**: `phase-1.5`, `priority-high`, `implementation`

**Estimated Hours**: 5 hours

**Description**:
Implement React context provider that loads and provides store configuration to all components.

**Tasks**:

- Create StoreConfigContext
- Create StoreConfigProvider component
- Implement configuration loading
- Add error handling for missing config
- Implement configuration caching
- Create useStoreConfig hook
- Add TypeScript types
- Write unit tests
- Document usage

**Acceptance Criteria**:

- [ ] StoreConfigContext created
- [ ] StoreConfigProvider implemented
- [ ] Configuration loading works
- [ ] Error handling works
- [ ] Caching implemented
- [ ] useStoreConfig hook works
- [ ] Tests pass
- [ ] Documentation complete

**Files to Create/Modify**:

- `packages/core/src/contexts/StoreConfigContext.tsx` (new)
- `packages/core/src/hooks/use-store-config.ts` (new)
- `packages/core/src/__tests__/store-config.test.ts` (new)

---

### Ticket P1-069: Audit Existing Database Schema

**Labels**: `phase-1.6`, `priority-high`, `analysis`

**Estimated Hours**: 4 hours

**Description**:
Review all existing database tables to identify which need siteId for multi-tenant support.

**Tasks**:

- Review shared/schema.ts file
- List all tables
- Identify tables that store user/store-specific data
- Identify tables that should remain global
- Document relationships between tables
- Create schema audit document
- Identify tables missing siteId
- Plan migration strategy

**Acceptance Criteria**:

- [ ] All tables reviewed
- [ ] Tables needing siteId identified
- [ ] Relationships documented
- [ ] Migration strategy planned
- [ ] Audit document created

**Files to Create/Modify**:

- `docs/database-schema-audit.md` (new)
- Review: `shared/schema.ts` (read-only)

---

### Ticket P1-070: Update Database Schema Definitions

**Labels**: `phase-1.6`, `priority-high`, `implementation`

**Estimated Hours**: 6 hours

**Description**:
Add siteId columns to all relevant tables in the Drizzle schema definitions.

**Tasks**:

- Add siteId column to order_files table
- Add siteId column to uploaded_images table
- Add siteId column to mat_designs table
- Add siteId to other identified tables
- Add proper indexes on siteId columns
- Update foreign key constraints
- Update Drizzle schema exports
- Document schema changes

**Acceptance Criteria**:

- [ ] siteId added to all relevant tables
- [ ] Indexes created
- [ ] Foreign keys updated
- [ ] Schema exports updated
- [ ] Changes documented

**Files to Create/Modify**:

- `shared/schema.ts` (update)
- `docs/database-schema-changes.md` (new)

---

### Ticket P1-071: Update Data Access Layer with Site ID Filtering

**Labels**: `phase-1.6`, `priority-high`, `implementation`

**Estimated Hours**: 6 hours

**Description**:
Update all database queries to automatically filter by siteId for multi-tenant data isolation.

**Tasks**:

- Review storage.ts file
- Update all SELECT queries to include siteId filter
- Update all INSERT queries to include siteId
- Update all UPDATE queries to include siteId filter
- Update all DELETE queries to include siteId filter
- Create helper function for siteId injection
- Add data isolation validation
- Write unit tests

**Acceptance Criteria**:

- [ ] All queries filter by siteId
- [ ] Inserts include siteId
- [ ] Helper functions created
- [ ] Validation implemented
- [ ] Tests pass

**Files to Create/Modify**:

- `server/storage.ts` (update)
- `server/lib/db-helpers.ts` (new)
- `server/__tests__/storage.test.ts` (new)

---

### Ticket P1-072: Create Database Migration Script

**Labels**: `phase-1.6`, `priority-high`, `implementation`

**Estimated Hours**: 5 hours

**Description**:
Create migration script to add siteId columns to existing tables without data loss.

**Tasks**:

- Design migration strategy
- Create migration script using Drizzle
- Add siteId column as nullable initially
- Create backfill script for existing data
- Add NOT NULL constraint after backfill
- Create indexes
- Add rollback script
- Test migration on copy of production data
- Document migration process

**Acceptance Criteria**:

- [ ] Migration script created
- [ ] Backfill script created
- [ ] Rollback script created
- [ ] Tested on staging data
- [ ] Migration documented

**Files to Create/Modify**:

- `server/migrations/add-siteid-columns.ts` (new)
- `server/migrations/backfill-siteid.ts` (new)
- `server/migrations/rollback-siteid.ts` (new)
- `docs/database-migration-guide.md` (new)

---

### Ticket P1-073: Create Backup and Restore Procedures

**Labels**: `phase-1.6`, `priority-high`, `operations`

**Estimated Hours**: 4 hours

**Description**:
Document and create scripts for database backups and restoration before running migrations.

**Tasks**:

- Research database backup best practices
- Create backup script
- Create restore script
- Document backup process
- Document restore process
- Create pre-migration checklist
- Test backup and restore process
- Document rollback procedures

**Acceptance Criteria**:

- [ ] Backup script created
- [ ] Restore script created
- [ ] Process documented
- [ ] Tested successfully
- [ ] Checklist created

**Files to Create/Modify**:

- `server/scripts/backup-db.ts` (new)
- `server/scripts/restore-db.ts` (new)
- `docs/database-backup-procedures.md` (new)

---

### Ticket P1-074: Write Data Access Layer Tests

**Labels**: `phase-1.6`, `priority-high`, `testing`

**Estimated Hours**: 5 hours

**Description**:
Create comprehensive tests for the updated data access layer to ensure proper siteId isolation.

**Tasks**:

- Set up test database
- Create tests for siteId filtering in SELECT
- Create tests for siteId injection in INSERT
- Create tests for siteId filtering in UPDATE
- Create tests for siteId filtering in DELETE
- Test data isolation between sites
- Test edge cases
- Add test utilities
- Document test coverage

**Acceptance Criteria**:

- [ ] Test database set up
- [ ] All query types tested
- [ ] Data isolation tested
- [ ] Edge cases covered
- [ ] Test utilities created
- [ ] Coverage documented

**Files to Create/Modify**:

- `server/__tests__/storage.test.ts` (update)
- `server/__tests__/test-helpers.ts` (new)
- `server/__tests__/data-isolation.test.ts` (new)

---

## Phase 1 Summary

**Total Tickets**: 74 tickets  
**Estimated Total Hours**: 310-350 hours  
**Estimated Duration**: 8-10 weeks (assuming 40 hours/week)

### Tickets by Section

- **Section 1.1** (Monorepo Setup): 8 tickets
- **Section 1.2** (Package Extraction): 22 tickets
- **Section 1.3** (Storefront API): 19 tickets
- **Section 1.4** (Admin API): 13 tickets
- **Section 1.5** (Multi-Store Config): 7 tickets
- **Section 1.6** (Database): 6 tickets

### Priority Distribution

- **High Priority**: 55 tickets (critical path)
- **Medium Priority**: 15 tickets (important)
- **Low Priority**: 4 tickets (nice to have)

---

**End of Phase 1 Tickets**
