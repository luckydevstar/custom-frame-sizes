#!/usr/bin/env node
/**
 * Filter out example files and config files, then run ESLint on remaining files
 */

import { execSync } from "child_process";

const files = process.argv.slice(2);
const filtered = files.filter((file) => {
  // Filter out example files
  if (file.includes("/examples/")) {
    return false;
  }
  // Filter out config files
  if (file.match(/\.config\.(ts|js|mjs)$/i) || file.endsWith("vitest.config.ts")) {
    return false;
  }
  return true;
});

if (filtered.length > 0) {
  try {
    execSync(`npx eslint --fix --max-warnings=0 ${filtered.map((f) => `"${f}"`).join(" ")}`, {
      stdio: "inherit",
    });
  } catch (error) {
    process.exit(1);
  }
}
