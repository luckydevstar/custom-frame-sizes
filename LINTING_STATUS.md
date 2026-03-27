# Linting Status & Known Issues (E12.2/E12.3)

**Last Updated**: 2026-03-27  
**Status**: ESLint/Prettier configured; known errors identified for cleanup

## Summary

ESLint configuration has been updated per E12.2 to include import ordering, accessibility rules, and stricter TypeScript enforcement. The codebase has **known linting errors and warnings** that are documented below for prioritized fixes.

## Critical Errors (Block Lint)

These errors must be fixed for the monorepo lint to pass:

### `@framecraft/config`

- **Status**: ✅ **FIXED** (duplicate `BrandConfigRegistry` export removed)

### `@framecraft/core`

- **Location**: `packages/core/src/utils/index.ts` (22 duplicate export errors)
  - Affected exports: `MatTilingStyle`, `getMatTilingStyle`, `hexColorToMatName`, `getMatBevelColor`, `getMatVGrooveColor`, `MAT_BEVEL_WIDTH`, `MAT_VGROOVE_WIDTH`, `MAT_VGROOVE_DEFAULT_OFFSET`, `MAT_VGROOVE_MIN_OFFSET`, `MAT_VGROOVE_MAX_OFFSET`, `getMatSVGPatternData`
  - **Root Cause**: Wildcard exports from `./specialty/mat-tiling` conflict with individual barrel exports
  - **Fix**: Consolidate to single source of truth (remove duplicate wildcard or specific exports)
  - **Effort**: ~30 minutes

## Warnings (Auto-Fixable / Manual Review)

These warnings can be auto-fixed or manually addressed in follow-up PRs:

### Import Order (`import/order` - 130+ warnings)

- **Across**: `@framecraft/config`, `@framecraft/core`, `@framecraft/ui`, apps
- **Issue**: Imports not grouped/alphabetized per new rule
- **Fix**: `eslint --fix` will resolve ~77% automatically
- **Effort**: Auto-fix + manual review of complex cases (~1-2 hours)

### Explicit `any` Types (`@typescript-eslint/no-explicit-any` - 60+ warnings)

- **Across**: `@framecraft/config`, `@framecraft/core`, `@framecraft/types`
- **Issue**: TypeScript code using untyped `any`
- **Fix**: Replace with specific types or `unknown` + narrowing
- **Priority**: Medium (warnings only; refactor incrementally)
- **Effort**: 3-4 hours across packages

### Import Duplicates (`import/no-duplicates` - 10+ warnings)

- **Issue**: Same module imported multiple times
- **Fix**: Consolidate imports
- **Effort**: Auto-fix handles most (~15 minutes)

## Recommended Next Steps

### E12.3 Phase

1. **Fix duplicate export errors** in `@framecraft/core/src/utils/index.ts` (blocker)
2. **Run `eslint --fix`** on all packages to auto-resolve import ordering and duplicates
3. **Document remaining `any` types** as technical debt to address in follow-up tickets
4. **Commit fixed state** and verify lint passes

### Follow-Up Tickets

- **E12.4**: Address all `any` type warnings (3-4 hours)
- **E12.5**: Review and fix complex linting patterns if needed

## Commands

```bash
# Auto-fix what can be auto-fixed
npm run lint -- --fix

# Check which issues remain
npm run lint

# Lint specific package
npm run lint -- --filter=@framecraft/core
```

## Configuration Applied

- ✅ ESLint: import plugin + import/order rule (warn level)
- ✅ Prettier: `trailingComma: all`
- ✅ Pre-commit: husky + lint-staged
- ✅ TypeScript: `no-explicit-any` raised to warn level
