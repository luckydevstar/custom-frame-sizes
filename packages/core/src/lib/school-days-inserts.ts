/**
 * School-days layout preset images (stub).
 * Full implementation can provide preset image paths for school-days and k12-school-years layouts.
 */

import type { CollageLayoutType } from "./collage-layouts";

/** Return preset image URLs for school layouts, or undefined to use standard collage inserts */
export function getSchoolLayoutPresetImages(_layoutId: CollageLayoutType): string[] | undefined {
  return undefined;
}

/** Whether the layout uses school-days preset positioning */
export function isSchoolDaysPresetLayout(_layoutId: CollageLayoutType): boolean {
  return false;
}
