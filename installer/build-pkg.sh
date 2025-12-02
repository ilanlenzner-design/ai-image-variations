#!/bin/bash

# Build Script for AI Image Variations Installer
# This script creates a macOS .pkg installer

set -e

echo "=========================================="
echo "AI Image Variations - Package Builder"
echo "=========================================="
echo ""

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Error: This script must be run on macOS"
    exit 1
fi

# Check for required tools
if ! command -v pkgbuild &> /dev/null; then
    echo "❌ Error: pkgbuild not found. Please install Xcode Command Line Tools:"
    echo "   xcode-select --install"
    exit 1
fi

if ! command -v productbuild &> /dev/null; then
    echo "❌ Error: productbuild not found. Please install Xcode Command Line Tools:"
    echo "   xcode-select --install"
    exit 1
fi

# Set up paths
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILD_DIR="$SCRIPT_DIR/build"
PAYLOAD_DIR="$SCRIPT_DIR/payload"
SCRIPTS_DIR="$SCRIPT_DIR/scripts"
RESOURCES_DIR="$SCRIPT_DIR"

OUTPUT_PKG="$SCRIPT_DIR/AIImageVariations-Installer.pkg"
COMPONENT_PKG="$BUILD_DIR/AIImageVariations.pkg"

# Clean build directory
echo "🧹 Cleaning build directory..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Check if payload exists
if [ ! -d "$PAYLOAD_DIR/AIImageVariations" ]; then
    echo "❌ Error: Payload directory not found at $PAYLOAD_DIR/AIImageVariations"
    echo "   Please ensure the extension files are in installer/payload/AIImageVariations/"
    exit 1
fi

# Build component package
echo "📦 Building component package..."
pkgbuild \
    --root "$PAYLOAD_DIR" \
    --scripts "$SCRIPTS_DIR" \
    --identifier "com.ilanlenzner.aiImageVariations" \
    --version "1.0.0" \
    --install-location "/tmp/AIImageVariations-Install" \
    "$COMPONENT_PKG"

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to build component package"
    exit 1
fi

echo "✅ Component package created"

# Build product package
echo "🎁 Building final installer..."
productbuild \
    --distribution "$RESOURCES_DIR/Distribution.xml" \
    --resources "$RESOURCES_DIR" \
    --package-path "$BUILD_DIR" \
    "$OUTPUT_PKG"

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to build final package"
    exit 1
fi

echo "✅ Final package created"

# Get file size
FILE_SIZE=$(du -h "$OUTPUT_PKG" | cut -f1)

echo ""
echo "=========================================="
echo "✅ Build Complete!"
echo "=========================================="
echo ""
echo "Installer created: $OUTPUT_PKG"
echo "File size: $FILE_SIZE"
echo ""
echo "To install:"
echo "  1. Double-click: AIImageVariations-Installer.pkg"
echo "  2. Follow the installation wizard"
echo "  3. Restart After Effects"
echo "  4. Go to: Window → Extensions → AI Image Variations"
echo ""
echo "=========================================="

# Clean up build directory
rm -rf "$BUILD_DIR"

exit 0
