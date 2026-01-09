# Frame Configuration Serialization Specification

**Ticket**: P1-042  
**Date**: January 9, 2026  
**Status**: Design Complete

---

## Overview

This document defines how frame configurations are serialized to Shopify line item attributes. The serialization format must be:

- Human-readable in Shopify admin
- Machine-parseable for order fulfillment
- Consistent across all frame types
- Extensible for specialty designers

---

## Design Goals

1. **Human Readability**: Attributes should be readable in Shopify admin without parsing JSON
2. **Machine Parsability**: Full JSON representation for automated order fulfillment
3. **Consistency**: Same structure for all frame types
4. **Extensibility**: Easy to add new fields or specialty configurations
5. **Order Fulfillment**: Easy to deserialize for production

---

## Attribute Structure

### Standard Attributes (Always Present)

All frame configurations include these standard attributes:

| Key                  | Value Format                             | Description                                 |
| -------------------- | ---------------------------------------- | ------------------------------------------- |
| `Service Type`       | `"frame-only"` or `"print-and-frame"`    | Type of service                             |
| `Artwork Width`      | `"12.5\""`                               | Artwork width in inches with unit           |
| `Artwork Height`     | `"16.25\""`                              | Artwork height in inches with unit          |
| `Frame Style`        | Frame style ID (e.g., `"black-classic"`) | Selected frame style                        |
| `Mat Type`           | `"none"`, `"single"`, or `"double"`      | Mat configuration type                      |
| `Mat Border Width`   | `"2.5\""`                                | Mat border width in inches (if mat present) |
| `Mat Color`          | Mat color ID (e.g., `"white"`)           | Outer mat color (if mat present)            |
| `Mat Inner Color`    | Mat color ID (e.g., `"cream"`)           | Inner mat color (if double mat)             |
| `Mat Reveal`         | `"0.25\""`                               | Mat reveal width in inches (if double mat)  |
| `Glass Type`         | Glass type ID (e.g., `"standard"`)       | Selected glass/acrylic type                 |
| `Configuration JSON` | JSON string                              | Complete configuration as JSON              |

### Conditional Attributes

These attributes are included only when applicable:

| Key                | Condition                   | Value Format             |
| ------------------ | --------------------------- | ------------------------ |
| `Customer Image`   | `imageUrl` is present       | Image URL string         |
| `Order Source`     | `orderSource` is present    | Source identifier        |
| `Image Fit`        | `imageFit` is present       | `"cover"` or `"contain"` |
| `Bottom Weighted`  | `bottomWeighted` is `true`  | `"Yes"`                  |
| `Copyright Agreed` | `copyrightAgreed` is `true` | `"Yes"`                  |

### Specialty Designer Attributes

Specialty designers add their own attributes (see Specialty Serialization section).

---

## Attribute Naming Convention

### Rules

1. **Title Case**: All attribute keys use Title Case (e.g., "Mat Border Width")
2. **Spaces**: Use spaces instead of underscores or camelCase
3. **Clarity**: Names should be self-explanatory
4. **Consistency**: Use consistent terminology across all attributes
5. **No Abbreviations**: Spell out full words (e.g., "Width" not "W")

### Examples

✅ **Good**:

- `"Artwork Width"`
- `"Mat Border Width"`
- `"Glass Type"`

❌ **Bad**:

- `"artwork_width"` (snake_case)
- `"artworkWidth"` (camelCase)
- `"Artwork W"` (abbreviation)

---

## JSON Serialization

### Purpose

The `Configuration JSON` attribute contains the complete configuration as a JSON string. This serves as:

- Backup for all configuration data
- Source of truth for order fulfillment systems
- Enables deserialization to exact configuration state

### Format

```json
{
  "serviceType": "frame-only",
  "artworkWidth": 12.5,
  "artworkHeight": 16.25,
  "frameStyleId": "black-classic",
  "matType": "double",
  "matBorderWidth": 2.5,
  "matRevealWidth": 0.25,
  "matColorId": "white",
  "matInnerColorId": "cream",
  "glassTypeId": "standard",
  "imageUrl": "https://example.com/image.jpg",
  "orderSource": "ai-recommendation",
  "imageFit": "cover",
  "bottomWeighted": true,
  "copyrightAgreed": true,
  "brassNameplateConfig": { ... },
  // Specialty-specific fields
  "specialtyType": "shadowbox",
  "specialtyConfig": { ... }
}
```

### Serialization Rules

1. **Compact JSON**: No pretty-printing (minimize size)
2. **Preserve Types**: Numbers remain numbers, booleans remain booleans
3. **Include All Fields**: Even optional fields if they have values
4. **No Null Values**: Omit fields that are `null` or `undefined`
5. **Stringify Once**: JSON.stringify() the entire object, not individual fields

---

## Attribute Order

Attributes are ordered for readability in Shopify admin:

1. **Service Information** (Service Type, Order Source)
2. **Dimensions** (Artwork Width, Artwork Height)
3. **Frame** (Frame Style)
4. **Mat** (Mat Type, Mat Border Width, Mat Color, Mat Inner Color, Mat Reveal)
5. **Glass** (Glass Type)
6. **Image** (Customer Image, Image Fit, Copyright Agreed)
7. **Specialty** (Specialty-specific attributes)
8. **Configuration JSON** (Always last)

This order groups related information together and makes it easy to scan in Shopify admin.

---

## Deserialization Strategy

### Primary Source: Configuration JSON

The deserialization process should:

1. **Parse JSON First**: Extract and parse the `Configuration JSON` attribute
2. **Validate Structure**: Ensure all required fields are present
3. **Type Conversion**: Convert string values back to appropriate types
4. **Fallback to Attributes**: If JSON is missing or invalid, reconstruct from individual attributes

### Deserialization Function Signature

```typescript
function deserializeFrameConfiguration(
  attributes: Array<{ key: string; value: string }>
): FrameConfiguration {
  // 1. Find "Configuration JSON" attribute
  // 2. Parse JSON
  // 3. Validate and return
  // 4. Fallback to attribute parsing if needed
}
```

### Type Conversion

When reconstructing from attributes (fallback):

- **Dimensions**: Parse `"12.5\""` → `12.5` (remove quotes and unit)
- **Booleans**: `"Yes"` → `true`, missing → `false`
- **Numbers**: Parse strings to numbers where appropriate
- **Enums**: Validate against known values

---

## Specialty Designer Serialization

### Shadowbox Configuration

Additional attributes for shadowbox frames:

| Key                | Value Format                 | Description                      |
| ------------------ | ---------------------------- | -------------------------------- |
| `Backing Type`     | Backing type ID              | Type of backing material         |
| `Backing Color`    | Color identifier             | Backing color                    |
| `Hanging Hardware` | `"standard"` or `"security"` | Hardware type                    |
| `Depth`            | `"2.5\""`                    | Shadowbox depth in inches        |
| `Jersey Mount`     | `"Yes"` or omitted           | Whether jersey mount is included |
| `Accessories`      | Comma-separated list         | Additional accessories           |

### Jersey Frame Configuration

Additional attributes:

| Key             | Value Format                  | Description             |
| --------------- | ----------------------------- | ----------------------- |
| `Jersey Size`   | Jersey size (e.g., `"Large"`) | Jersey size             |
| `Mount Type`    | Mount type identifier         | How jersey is mounted   |
| `Display Style` | Display style identifier      | How jersey is displayed |

### Canvas Float Configuration

Additional attributes:

| Key                | Value Format       | Description                     |
| ------------------ | ------------------ | ------------------------------- |
| `Float Depth`      | `"0.5\""`          | Float depth in inches           |
| `Canvas Stretcher` | `"Yes"` or omitted | Whether stretcher bars included |

### Puzzle Configuration

Additional attributes:

| Key                  | Value Format      | Description            |
| -------------------- | ----------------- | ---------------------- |
| `Puzzle Size`        | Puzzle dimensions | Puzzle size identifier |
| `Puzzle Piece Count` | Number            | Number of pieces       |

### Comic Book Configuration

Additional attributes:

| Key                | Value Format      | Description               |
| ------------------ | ----------------- | ------------------------- |
| `Comic Format`     | Format identifier | Comic book format         |
| `Comic Layout`     | Layout identifier | Layout type               |
| `Number of Comics` | Number            | Number of comics in frame |

### Playbill Configuration

Additional attributes:

| Key             | Value Format      | Description          |
| --------------- | ----------------- | -------------------- |
| `Playbill Size` | Size identifier   | Playbill size        |
| `Layout Type`   | Layout identifier | Layout configuration |

---

## Implementation Notes

### Shopify Attribute Limits

- **Attribute Count**: Shopify allows up to 100 custom attributes per line item
- **Value Length**: Attribute values can be up to 255 characters
- **JSON Size**: Configuration JSON may exceed 255 characters - this is acceptable as it's a single attribute

### Validation

Before serialization, validate:

- All required fields are present
- Numeric values are valid numbers
- Enum values match allowed options
- Dimensions are positive numbers
- Image URLs are valid (if present)

### Error Handling

- **Missing Required Fields**: Throw error before serialization
- **Invalid Values**: Validate and throw descriptive errors
- **JSON Serialization Failure**: Should never happen, but handle gracefully

---

## Migration from Existing Code

The existing `serializeFrameConfiguration` function in `CustomFrameSizes-CODE/client/src/services/shopify.ts` follows a similar pattern but:

- Uses slightly different attribute names
- Doesn't include all new fields (imageFit, bottomWeighted, etc.)
- May need updates for specialty designers

**Migration Path**:

1. Update attribute names to match this specification
2. Add missing attributes
3. Ensure JSON includes all fields
4. Test deserialization with existing orders

---

## Examples

### Standard Frame Configuration

```typescript
const config: FrameConfiguration = {
  serviceType: "frame-only",
  artworkWidth: 12.5,
  artworkHeight: 16.25,
  frameStyleId: "black-classic",
  matType: "double",
  matBorderWidth: 2.5,
  matRevealWidth: 0.25,
  matColorId: "white",
  matInnerColorId: "cream",
  glassTypeId: "standard",
};

// Serialized attributes:
[
  { key: "Service Type", value: "frame-only" },
  { key: "Artwork Width", value: '12.5"' },
  { key: "Artwork Height", value: '16.25"' },
  { key: "Frame Style", value: "black-classic" },
  { key: "Mat Type", value: "double" },
  { key: "Mat Border Width", value: '2.5"' },
  { key: "Mat Color", value: "white" },
  { key: "Mat Inner Color", value: "cream" },
  { key: "Mat Reveal", value: '0.25"' },
  { key: "Glass Type", value: "standard" },
  { key: "Configuration JSON", value: '{"serviceType":"frame-only",...}' },
];
```

### Print and Frame Configuration

```typescript
const config: FrameConfiguration = {
  serviceType: "print-and-frame",
  artworkWidth: 8,
  artworkHeight: 10,
  frameStyleId: "walnut-modern",
  matType: "single",
  matBorderWidth: 2,
  matColorId: "ivory",
  glassTypeId: "non-glare",
  imageUrl: "https://example.com/artwork.jpg",
  imageFit: "cover",
  copyrightAgreed: true,
  orderSource: "ai-recommendation",
};

// Serialized attributes include:
// - All standard attributes
// - "Customer Image": "https://example.com/artwork.jpg"
// - "Image Fit": "cover"
// - "Copyright Agreed": "Yes"
// - "Order Source": "ai-recommendation"
```

---

## Success Criteria

✅ **Design Complete**:

- [x] Attribute naming convention defined
- [x] Attribute structure planned
- [x] JSON serialization approach defined
- [x] Deserialization strategy planned
- [x] Specialty designer attributes documented
- [x] Examples provided
- [x] Migration path defined

---

**Document Status**: ✅ Complete  
**Ready for Implementation**: Yes (P1-043)  
**Dependencies**: None
