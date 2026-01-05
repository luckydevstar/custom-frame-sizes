#!/usr/bin/env node
/**
 * Script to update import paths in UI components after extraction.
 * Updates:
 * - @/lib/utils -> ../../utils
 * - @/components/ui/ -> ./
 */

import { readFileSync, writeFileSync } from "fs";
import { readdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const UI_COMPONENTS_DIR = join(__dirname, "..", "packages", "ui", "src", "components", "ui");

async function updateImportsInFile(filePath) {
	try {
		const content = readFileSync(filePath, "utf-8");
		let updated = content;

		// Replace @/lib/utils with ../../utils
		updated = updated.replace(/from "@\/lib\/utils"/g, 'from "../../utils"');

		// Replace @/components/ui/ with ./
		updated = updated.replace(/from "@\/components\/ui\//g, 'from "./');

		if (updated !== content) {
			writeFileSync(filePath, updated, "utf-8");
			return true;
		}
		return false;
	} catch (error) {
		console.error(`Error processing ${filePath}:`, error.message);
		return false;
	}
}

async function main() {
	try {
		const files = await readdir(UI_COMPONENTS_DIR);
		const tsxFiles = files.filter((f) => f.endsWith(".tsx"));

		let updatedCount = 0;
		for (const file of tsxFiles) {
			const filePath = join(UI_COMPONENTS_DIR, file);
			if (await updateImportsInFile(filePath)) {
				updatedCount++;
				console.log(`Updated: ${file}`);
			}
		}

		console.log(`\nCompleted: Updated ${updatedCount} of ${tsxFiles.length} files`);
	} catch (error) {
		console.error("Error:", error.message);
		process.exit(1);
	}
}

main();

