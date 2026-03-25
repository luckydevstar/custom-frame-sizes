#!/bin/bash

# Bundle Size Analysis Script for Store-A
# 
# This script builds the app and generates a visual bundle analysis
# Usage: bash scripts/analyze-bundle.sh

set -e

echo "🔍 Analyzing bundle size..."
echo "This will create a visual HTML report of your bundle"
echo ""

# Clean previous builds
echo "Cleaning previous builds..."
npm run clean

# Build with analysis enabled
echo "Building with bundle analyzer enabled..."
ANALYZE=true npm run build

echo ""
echo "✅ Bundle analysis complete!"
echo "📊 Results: Check the interactive HTML visualization"
echo ""
echo "💡 Tips:"
echo "  - Look for red areas (large unused chunks)"
echo "  - Look for duplicate packages"
echo "  - Hover over items to see size details"
