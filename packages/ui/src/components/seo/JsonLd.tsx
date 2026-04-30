/**
 * <JsonLd /> — Render schema.org payloads as `<script type="application/ld+json">`.
 *
 * Server-only by default (no client interactivity). Pass either a single schema
 * or an array. Empty / nullish entries are filtered out so callers can spread
 * conditional schemas without ternaries.
 *
 * @example
 * ```tsx
 * import { JsonLd } from "@framecraft/ui";
 * import { seo } from "@/lib/seo";
 *
 * <JsonLd schemas={[seo.organizationSchema(), seo.websiteSchema()]} />
 * ```
 */

import * as React from "react";

export interface JsonLdProps {
  /** Single schema, an array of schemas, or any falsy entries (skipped). */
  schemas: Record<string, unknown> | Array<Record<string, unknown> | null | undefined | false>;
  /** Optional script id prefix; defaults to `"jsonld"`. */
  idPrefix?: string;
}

export function JsonLd({ schemas, idPrefix = "jsonld" }: JsonLdProps): React.ReactElement | null {
  const list = Array.isArray(schemas)
    ? schemas.filter((entry): entry is Record<string, unknown> => Boolean(entry))
    : [schemas];

  if (list.length === 0) return null;

  return (
    <>
      {list.map((schema, index) => {
        const schemaType = typeof schema["@type"] === "string" ? schema["@type"] : "schema";
        const id = `${idPrefix}-${schemaType.toLowerCase()}-${index}`;
        return (
          <script
            key={id}
            id={id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        );
      })}
    </>
  );
}
