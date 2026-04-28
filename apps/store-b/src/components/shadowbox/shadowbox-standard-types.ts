/** Keys into the icon map used by KeyFeaturesBar on shadowbox SKU pages. */
export type ShadowboxBarIconKey = "Award" | "Box" | "Ruler" | "Shield" | "Sparkles" | "Zap";

export interface StandardBarFeature {
  icon: ShadowboxBarIconKey;
  title: string;
  subtitle: string;
  testId: string;
}

/** Per-frame marketing copy for the standard shadowbox product template (carousel or compact). */
export interface ShadowboxStandardPageCopy {
  meta: { title: string; description: string };
  hero: {
    badgeLabel: string;
    headline: string;
    /** Italic subtitle: fixed brand line, or catalog shortDescription when `shortFromCatalog` */
    subtitleMode: "brandItalic" | "shortFromCatalog";
    brandItalic?: string;
    /** Legacy varies: "Design Your Shadow Box" vs "Design Your Shadowbox" */
    designButtonLabel: string;
  };
  inspirationSubtitle: string;
  designHeading: string;
  designBodySource: "static" | "featuredDescription";
  /** Present when designBodySource is static */
  designBodyParagraph?: string | null;
  features: StandardBarFeature[];
  cta: { title: string; description: string };
  /** Omit lifestyle carousel + gallery (matches legacy MediumDepthGold + StandardDepthModern*) */
  hasCarousel: boolean;
  /** Technical grid: moulding/units wording */
  specsFormat: "inchesWords" | "inchMarks";
  categoryLabel: "Shadow Box" | "Shadowbox";
}
