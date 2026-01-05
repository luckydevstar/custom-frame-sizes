#!/usr/bin/env python3
"""
Script to update import paths in UI components after extraction.
Updates:
- @/lib/utils -> ../../utils
- @/components/ui/ -> ./
- @/hooks/ -> (leaves as-is for now, will need to be handled separately)
"""

import os
import re
from pathlib import Path

UI_COMPONENTS_DIR = Path(__file__).parent.parent / "packages" / "ui" / "src" / "components" / "ui"

def update_imports_in_file(file_path: Path) -> bool:
    """Update import paths in a single file."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        original_content = content
        
        # Replace @/lib/utils with ../../utils
        content = re.sub(r'from "@/lib/utils"', 'from "../../utils"', content)
        
        # Replace @/components/ui/ with ./
        content = re.sub(r'from "@/components/ui/', 'from "./', content)
        
        if content != original_content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main function to update all UI component files."""
    if not UI_COMPONENTS_DIR.exists():
        print(f"Error: Directory {UI_COMPONENTS_DIR} does not exist")
        return
    
    updated_count = 0
    total_count = 0
    
    for file_path in UI_COMPONENTS_DIR.glob("*.tsx"):
        total_count += 1
        if update_imports_in_file(file_path):
            updated_count += 1
            print(f"Updated: {file_path.name}")
    
    print(f"\nCompleted: Updated {updated_count} of {total_count} files")

if __name__ == "__main__":
    main()

