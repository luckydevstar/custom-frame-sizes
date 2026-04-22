'use client';

import { useEffect } from 'react';
import { restoreTheme } from '@framecraft/config/theme/theme-utils';

/**
 * Restore theme from localStorage on page load
 * This component must run early to prevent theme flash
 */
export function ThemeScript() {
  useEffect(() => {
    restoreTheme();
  }, []);

  return null;
}
