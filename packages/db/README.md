# @framecraft/db

Database schema and utilities for FrameCraft.

## Contents

This package contains:

- **Schema Definitions**: Drizzle ORM schema for all database tables
- **Connection Utilities**: Database connection management
- **Migration Scripts**: Database migration utilities

## Schema

### Tables

- `users` - User accounts (global, no siteId)
- `mat_designs` - Mat design configurations (multi-tenant with siteId)
- `uploaded_images` - Customer uploaded images (multi-tenant with siteId)
- `order_files` - Production files for Shopify orders (multi-tenant with siteId)

### Multi-Tenant Support

All user-generated content tables include `siteId` for data isolation:

- `mat_designs.siteId`
- `uploaded_images.siteId`
- `order_files.siteId`

## Usage

### Database Connection

```typescript
import { getDatabaseFromEnv } from "@framecraft/db";

const db = getDatabaseFromEnv();
```

### Querying Data

```typescript
import { db } from "@framecraft/db";
import { matDesigns } from "@framecraft/db/schema";
import { eq } from "drizzle-orm";

// Query with siteId filter
const designs = await db.select().from(matDesigns).where(eq(matDesigns.siteId, "store-a"));
```

### Inserting Data

```typescript
import { db } from "@framecraft/db";
import { matDesigns } from "@framecraft/db/schema";

await db.insert(matDesigns).values({
  siteId: "store-a",
  configJson: JSON.stringify(config),
  svgContent: svg,
});
```

## Migrations

See `docs/database-migration-guide.md` for migration procedures.

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (required)

## Related Documentation

- [Database Schema Audit](../docs/database-schema-audit.md)
- [Database Schema Changes](../docs/database-schema-changes.md)
- [Migration Guide](../docs/database-migration-guide.md)
