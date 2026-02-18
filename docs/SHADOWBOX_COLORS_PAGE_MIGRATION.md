# Shadowbox Colors Page – Original vs Migrated

**Source:** `CustomFrameSizes-CODE/client/src/pages/shadowboxes/ShadowboxColors.tsx`

## Section order and content (original)

| #   | Section                                                | Content summary                                                                                                                                                           |
| --- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Hero**                                               | "Shadowbox Frames by Color" + subtitle (browse by finish color, deep-profile, jerseys to medals).                                                                         |
| 2   | **Color Grid**                                         | Cards per color: image, swatch, name, count, description (md+), design-style badges (md+), "View {Color} Shadowboxes". Links: `/shadowboxes/${slug}-shadowbox-frames`.    |
| 3   | **Why Shadowbox Color Matters**                        | Three paragraphs: frame color + interior integration; match vs contrast + metallics; preservation vs color (UV = glazing).                                                |
| 4   | **How to Choose Shadowbox Colors by Memorabilia Type** | Four cards (Trophy, Shield, Music, Heart): Sports Jerseys, Military Medals, Music Memorabilia, Personal Heirlooms. Each has two paragraphs.                               |
| 5   | **Shadowbox Color Gallery Wall Combinations**          | Four cards: **Matching Color Series**, **Complementary Contrast**, **Metallic Accent Walls**, **Natural Wood Warmth**. (This section was missing in the first migration.) |
| 6   | **Frequently Asked Questions**                         | Five FAQ cards (best color jerseys; team vs décor; dark vs light protection; mix colors; vintage memorabilia).                                                            |
| 7   | **Shadowbox Depth Options**                            | Intro paragraph + three depth cards: Standard 1.5", Deep 2.5", Extra Deep 3.5".                                                                                           |
| 8   | **Popular Shadowbox Applications**                     | Two links: Record Album Frames, Jersey Display Frames.                                                                                                                    |
| 9   | **Final CTA**                                          | "Ready to Preserve Your Memories?" + button to Browse All Shadowboxes.                                                                                                    |

## Differences fixed in migration (completed)

- **Missing section:** Section 5 **Shadowbox Color Gallery Wall Combinations** added with the four cards (Matching Color Series, Complementary Contrast, Metallic Accent Walls, Natural Wood Warmth) and exact copy from the original.
- **Order:** Reordered to match the original: Memorabilia Type → **Gallery Wall Combinations** → FAQ → Depth Options → Popular Applications → CTA.
- **Copy:** "Why Shadowbox Color Matters" (3 paragraphs), Memorabilia Type cards (2 paragraphs each), and FAQ answers updated to the original, longer copy.

## Color detail URL

- Original color links: `/shadowboxes/${slug}-shadowbox-frames` (e.g. `/shadowboxes/black-shadowbox-frames`).
- Migrated hub uses: `/shadowboxes/colors/${slug}` for consistency with existing `/shadowbox-frames/colors/[slug]`. If URL parity with original is required, add redirects or a route at `shadowboxes/[slug]-shadowbox-frames`.
