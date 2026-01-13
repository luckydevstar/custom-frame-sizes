#!/usr/bin/env node
/**
 * Filter out example files and run ESLint on remaining files
 */

import { execSync } from "child_process";

const files = process.argv.slice(2);
const filtered = files.filter((file) => !file.includes("/examples/"));

if (filtered.length > 0) {
  try {
    execSync(`npx eslint --fix --max-warnings=0 ${filtered.map((f) => `"${f}"`).join(" ")}`, {
      stdio: "inherit",
    });
  } catch (error) {
    process.exit(1);
  }
}
