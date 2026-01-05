# Navigation Component Documentation

## Overview

The `Navigation` component provides a configurable navigation menu for site headers. It accepts navigation items as configuration and renders them as clickable links.

## Usage

### Basic Usage

```tsx
import { Navigation } from "@framecraft/ui";

function MyHeader() {
  const navigationConfig = {
    items: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  };

  return <Navigation config={navigationConfig} />;
}
```

### With Custom Content

For complex navigation items (like MegaMenu components), you can provide custom React nodes:

```tsx
import { Navigation } from "@framecraft/ui";

function MyHeader() {
  const navigationConfig = {
    items: [
      {
        label: "Products",
        href: "/products",
        content: <MegaMenu label="Products">...</MegaMenu>,
      },
      { label: "About", href: "/about" },
    ],
  };

  return <Navigation config={navigationConfig} />;
}
```

### With Children (Backward Compatibility)

The component also accepts children for backward compatibility:

```tsx
import { Navigation } from "@framecraft/ui";

function MyHeader() {
  return (
    <Navigation>
      <MegaMenu label="Products">...</MegaMenu>
      <Button asChild>
        <Link href="/about">About</Link>
      </Button>
    </Navigation>
  );
}
```

## Configuration

### NavigationItem

| Property     | Type        | Required | Description                                                |
| ------------ | ----------- | -------- | ---------------------------------------------------------- |
| `label`      | `string`    | Yes      | Text label for the navigation item                         |
| `href`       | `string`    | Yes      | URL path for the navigation link                           |
| `isDropdown` | `boolean`   | No       | Whether this item is a dropdown (for future enhancement)   |
| `content`    | `ReactNode` | No       | Custom React node to render instead of default button/link |
| `testId`     | `string`    | No       | Test ID for testing purposes                               |

### NavigationConfig

| Property          | Type               | Required | Description                                            |
| ----------------- | ------------------ | -------- | ------------------------------------------------------ |
| `items`           | `NavigationItem[]` | Yes      | Array of navigation items to display                   |
| `className`       | `string`           | No       | Custom className for the navigation container          |
| `itemClassName`   | `string`           | No       | Custom className for individual navigation items       |
| `showActiveState` | `boolean`          | No       | Whether to show active state styling (default: `true`) |

## Active State

The component automatically detects active navigation items by comparing the current location with each item's `href`. Active items are styled with the "secondary" button variant, while inactive items use the "ghost" variant.

## Future Enhancements

This component is a simplified version created for P1-013. Future enhancements will include:

- Full MegaMenu support
- Navigation menu variants
- Configuration from config package
- Enhanced dropdown/mega menu functionality
- Mobile navigation integration

## Related Components

- `Header` - Uses Navigation component for desktop navigation
- `MegaMenu` - Dropdown menu component (to be extracted)
- `MobileNavigation` - Mobile navigation component (to be extracted)
