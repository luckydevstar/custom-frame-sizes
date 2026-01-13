# Brand/Store Configuration Guide

**Package**: `@framecraft/config`  
**Last Updated**: January 13, 2026

---

## Overview

The brand configuration system allows each store to customize its appearance, features, and behavior while sharing the same codebase. This enables multi-store deployments with per-store branding.

---

## Configuration Structure

### BrandConfig Interface

```typescript
interface BrandConfig {
  storeId: string; // Unique identifier
  name: string; // Display name
  domain: string; // Store domain
  shopify: ShopifyConfig; // Shopify integration
  theme?: ThemeOverride; // Theme customizations
  features?: Partial<FeatureFlags>; // Feature flags
  navigation?: NavigationOverride; // Navigation customizations
  componentOverrides?: ComponentOverrides; // Component overrides
  seo: SEOConfig; // SEO metadata
  branding?: BrandingConfig; // Brand messaging
  metadata?: Metadata; // Additional metadata
}
```

---

## Configuration Sections

### 1. Store Identity

```typescript
{
  storeId: "store-a",
  name: "Store A",
  domain: "store-a.example.com"
}
```

**Required Fields**:

- `storeId`: Unique identifier (used for routing, database filtering)
- `name`: Display name for the store
- `domain`: Primary domain for the store

---

### 2. Shopify Configuration

```typescript
{
  shopify: {
    domain: "store-a.myshopify.com",
    storefrontAccessToken: "SHOPIFY_STOREFRONT_TOKEN", // From env
    apiVersion: "2024-01" // Optional, defaults to latest
  }
}
```

**Note**: `storefrontAccessToken` should reference an environment variable name. The actual token is retrieved at runtime.

---

### 3. Theme Overrides

```typescript
{
  theme: {
    brandColors: {
      primary: "#2563eb",
      secondary: "#0ea5e9",
      accent: "#8b5cf6"
    },
    colors: {
      primary: "217 91% 60%", // HSL format
      primaryForeground: "0 0% 100%"
    },
    logo: {
      src: "/logos/store-a-logo.svg",
      alt: "Store A Logo",
      width: "150px",
      height: "40px"
    }
  }
}
```

**Theme Override Options**:

- `brandColors`: Hex colors for brand identity
- `colors`: HSL color palette overrides
- `typography`: Font family overrides
- `spacing`: Spacing scale overrides
- `layout`: Layout configuration overrides
- `logo`: Logo image configuration

**Merging**: Theme overrides are deep-merged with the base theme. Only specified values override the base.

---

### 4. Feature Flags

```typescript
{
  features: {
    enableAIRecommendations: true,
    enableImageUpscaling: false,
    FEATURE_MOULDING_PICKER: true
  }
}
```

**Feature Flag Types**:

- **App Features**: `enableAIRecommendations`, `enableImageUpscaling`, etc.
- **Designer Features**: `FEATURE_MOULDING_PICKER`, `FEATURE_MAT_SET`, etc.

**Merging**: Feature flags are merged with defaults. Only specified flags override defaults.

---

### 5. Navigation Customization

```typescript
{
  navigation: {
    mainNav: {
      items: [
        { label: "Custom Item", href: "/custom" }
      ]
    },
    customItems: [
      { label: "Store-Specific", href: "/store-specific" }
    ]
  }
}
```

**Navigation Override Options**:

- `mainNav`: Override main navigation structure
- `footerNav`: Override footer navigation
- `customItems`: Add custom navigation items

---

### 6. Component Overrides

```typescript
{
  componentOverrides: {
    "ui/Button": "@/components/custom/Button",
    "ui/Header": "@/components/custom/Header"
  }
}
```

**Component Override Format**:

- Key: Component path (e.g., "ui/Button")
- Value: Path to custom component file

**Resolution**: Component overrides are resolved at runtime. If override exists, custom component is used; otherwise, default component is used.

---

### 7. SEO Configuration

```typescript
{
  seo: {
    title: "Store A - Custom Picture Frames",
    description: "Premium custom picture frames",
    keywords: ["custom frames", "picture frames"],
    ogImage: "https://store-a.example.com/og-image.jpg",
    canonicalUrl: "https://store-a.example.com"
  }
}
```

**Required Fields**:

- `title`: Page title
- `description`: Meta description

**Optional Fields**:

- `keywords`: SEO keywords array
- `ogImage`: Open Graph image URL
- `twitterImage`: Twitter card image URL
- `canonicalUrl`: Canonical URL

---

### 8. Branding

```typescript
{
  branding: {
    tagline: "Premium Custom Framing",
    valueProposition: "Museum-quality frames",
    targetAudience: "Art collectors and galleries"
  }
}
```

**Branding Fields**:

- `tagline`: Brand tagline
- `valueProposition`: Primary value proposition
- `targetAudience`: Target audience description

---

## Usage

### Registering Store Configurations

```typescript
import { BrandConfigRegistry, registerBrandConfigs } from "@framecraft/config";
import { storeAConfig } from "./configs/store-a.config";

// Register single config
BrandConfigRegistry.register(storeAConfig);

// Register multiple configs
registerBrandConfigs([storeAConfig, storeBConfig]);
```

### Retrieving Store Configuration

```typescript
import { BrandConfigRegistry, getBrandConfig } from "@framecraft/config";

// Get config (returns null if not found)
const config = BrandConfigRegistry.get("store-a");

// Get config (throws if not found)
const config = getBrandConfig("store-a");
```

### Checking Store Status

```typescript
import { isStoreActive } from "@framecraft/config";

if (isStoreActive("store-a")) {
  // Store is active
}
```

---

## Validation

All configurations are validated using Zod schemas:

```typescript
import { validateBrandConfig } from "@framecraft/config";

const result = validateBrandConfig(config);
if (!result.success) {
  console.error(result.errors);
}
```

---

## Example Configurations

See `packages/config/src/examples/` for complete example configurations.

---

## Best Practices

1. **Store IDs**: Use kebab-case (e.g., "store-a", "custom-picture-frames")
2. **Theme Colors**: Use HSL format for CSS custom properties
3. **Feature Flags**: Only override flags that differ from defaults
4. **Component Overrides**: Use sparingly - prefer theme customization
5. **SEO**: Always provide title and description
6. **Validation**: Validate configurations at application startup

---

## Related Documentation

- [Theme System](./theme.md)
- [Feature Flags](./features.md)
- [Navigation](./navigation.md)

---

**Last Updated**: January 13, 2026
