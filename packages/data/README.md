# @framecraft/data

Product catalog and static data for FrameCraft.

## Contents

This package contains the following JSON data files:

- **frames.json**: Frame styles with pricing, specifications, and metadata
- **mats.json**: Mat board colors, pricing, and availability
- **glass.json**: Glass/acrylic options and pricing
- **pricing-config.json**: Pricing rules, fees, and multipliers

## Usage

```typescript
import { framesData, matsData, glassData, pricingConfigData } from "@framecraft/data";

// Or import as default object
import data from "@framecraft/data";
const frames = data.frames;
```

## Data Structure

### Frames

Each frame object contains:

- `id`: Unique identifier
- `name`: Display name
- `material`: Material type (Wood, Metal, etc.)
- `color`: Hex color code
- `pricePerInch`: Price per linear inch
- `mouldingWidth`: Width in inches
- `category`: Frame category
- And more...

### Mats

Mat data structure includes:

- `id`: Unique identifier
- `name`: Display name
- `hexColor`: Color in hex format
- `sizes`: Available sheet sizes with pricing
- `coreColor`: Core color (white/black)
- And more...

### Glass

Glass options include:

- `id`: Unique identifier
- `name`: Display name
- `pricePerSqFt`: Price per square foot

### Pricing Config

Pricing configuration includes:

- `printAndFrame`: Print-and-frame service pricing
- `oversizeFees`: Oversize fee thresholds
- `matMultipliers`: Mat pricing multipliers

## Notes

- This package does not require a build step - JSON files are imported directly
- Data files are validated by services in `@framecraft/core`
- Updates to data files take effect immediately (no restart needed)
