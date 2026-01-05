#!/usr/bin/env node
/**
 * Script to copy UI components from source and update import paths.
 */

import { readFileSync, writeFileSync, copyFileSync, existsSync } from "fs";
import { readdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SOURCE_DIR = join(__dirname, "..", "..", "CustomFrameSizes-CODE", "client", "src", "components", "ui");
const TARGET_DIR = join(__dirname, "..", "packages", "ui", "src", "components", "ui");

async function copyAndUpdateFile(fileName) {
	try {
		const sourcePath = join(SOURCE_DIR, fileName);
		const targetPath = join(TARGET_DIR, fileName);

		if (!existsSync(sourcePath)) {
			console.error(`Source file not found: ${sourcePath}`);
			return false;
		}

		// Read source file
		let content = readFileSync(sourcePath, "utf-8");

		// Update import paths
		content = content.replace(/from "@\/lib\/utils"/g, 'from "../../utils"');
		content = content.replace(/from "@\/components\/ui\//g, 'from "./');

		// Write to target
		writeFileSync(targetPath, content, "utf-8");
		return true;
	} catch (error) {
		console.error(`Error processing ${fileName}:`, error.message);
		return false;
	}
}

async function main() {
	try {
		if (!existsSync(SOURCE_DIR)) {
			console.error(`Source directory not found: ${SOURCE_DIR}`);
			process.exit(1);
		}

		const files = await readdir(SOURCE_DIR);
		const tsxFiles = files.filter((f) => f.endsWith(".tsx"));

		console.log(`Found ${tsxFiles.length} component files to copy...\n`);

		let successCount = 0;
		for (const file of tsxFiles) {
			if (await copyAndUpdateFile(file)) {
				successCount++;
				console.log(`✓ ${file}`);
			}
		}

		console.log(`\nCompleted: Copied and updated ${successCount} of ${tsxFiles.length} files`);
	} catch (error) {
		console.error("Error:", error.message);
		process.exit(1);
	}
}

main();

