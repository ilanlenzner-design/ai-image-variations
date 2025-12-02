#!/bin/bash

################################################################################
# AI Image Variations - Self-Contained Mac Installer
# This script installs the After Effects CEP extension
################################################################################

set -e

echo "=========================================="
echo "AI Image Variations Installer"
echo "=========================================="
echo ""

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Error: This installer is for macOS only"
    exit 1
fi

# Check if After Effects is installed
echo "🔍 Checking for After Effects..."
AE_FOUND=false
for AE_PATH in "/Applications/Adobe After Effects"*; do
    if [ -d "$AE_PATH" ]; then
        AE_FOUND=true
        echo "✅ Found: $(basename "$AE_PATH")"
        break
    fi
done

if [ "$AE_FOUND" = false ]; then
    echo "⚠️  Warning: Adobe After Effects not found"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Define paths
CEP_PATH="/Library/Application Support/Adobe/CEP/extensions"
INSTALL_PATH="$CEP_PATH/AIImageVariations"
TEMP_DIR="/tmp/ai-image-variations-installer-$$"

echo ""
echo "📦 Creating extension files..."

# Create temporary directory
mkdir -p "$TEMP_DIR"

# Create extension directory structure
mkdir -p "$TEMP_DIR/AIImageVariations/CSXS"
mkdir -p "$TEMP_DIR/AIImageVariations/css"
mkdir -p "$TEMP_DIR/AIImageVariations/js"
mkdir -p "$TEMP_DIR/AIImageVariations/jsx"

# Create manifest.xml
cat > "$TEMP_DIR/AIImageVariations/CSXS/manifest.xml" << 'MANIFEST_EOF'
<?xml version='1.0' encoding='UTF-8'?>
<ExtensionManifest ExtensionBundleId="com.ilanlenzner.aiImageVariations" ExtensionBundleVersion="1.0.0" Version="11.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <ExtensionList>
    <Extension Id="com.ilanlenzner.aiImageVariations" Version="1.0.0" />
  </ExtensionList>
  <ExecutionEnvironment>
    <HostList>
      <Host Name="AEFT" Version="[0.0,99.9]" />
    </HostList>
    <LocaleList>
      <Locale Code="All" />
    </LocaleList>
    <RequiredRuntimeList>
      <RequiredRuntime Name="CSXS" Version="11.0" />
    </RequiredRuntimeList>
  </ExecutionEnvironment>
  <DispatchInfoList>
    <Extension Id="com.ilanlenzner.aiImageVariations">
      <DispatchInfo>
        <Resources>
          <MainPath>./index.html</MainPath>
          <ScriptPath>./jsx/hostscript.jsx</ScriptPath>
          <CEFCommandLine />
        </Resources>
        <Lifecycle>
          <AutoVisible>true</AutoVisible>
        </Lifecycle>
        <UI>
          <Type>Panel</Type>
          <Menu>AI Image Variations</Menu>
          <Geometry>
            <Size>
              <Height>600</Height>
              <Width>400</Width>
            </Size>
            <MinSize>
              <Height>400</Height>
              <Width>350</Width>
            </MinSize>
            <MaxSize>
              <Height>1000</Height>
              <Width>600</Width>
            </MaxSize>
          </Geometry>
          <Icons>
          </Icons>
        </UI>
      </DispatchInfo>
    </Extension>
  </DispatchInfoList>
</ExtensionManifest>
MANIFEST_EOF

# Create .debug
cat > "$TEMP_DIR/AIImageVariations/.debug" << 'DEBUG_EOF'
<?xml version="1.0" encoding="UTF-8"?>
<ExtensionList>
    <Extension Id="com.ilanlenzner.aiImageVariations">
        <HostList>
            <Host Name="AEFT" Port="8088"/>
        </HostList>
    </Extension>
</ExtensionList>
DEBUG_EOF

echo "✅ Extension structure created"

echo ""
echo "🔐 Installing extension (requires administrator password)..."

# Create CEP extensions folder
sudo mkdir -p "$CEP_PATH"

# Remove old installation if exists
if [ -d "$INSTALL_PATH" ]; then
    echo "🗑️  Removing old installation..."
    sudo rm -rf "$INSTALL_PATH"
fi

# Copy extension
sudo cp -R "$TEMP_DIR/AIImageVariations" "$INSTALL_PATH"

# Set permissions
sudo chmod -R 755 "$INSTALL_PATH"

echo "✅ Extension files installed"

echo ""
echo "🐛 Enabling debug mode..."

# Get current user
CURRENT_USER=$(stat -f "%Su" /dev/console)

# Enable debug mode for CEP 9, 10, and 11
sudo -u "$CURRENT_USER" defaults write com.adobe.CSXS.9 PlayerDebugMode 1 2>/dev/null || true
sudo -u "$CURRENT_USER" defaults write com.adobe.CSXS.10 PlayerDebugMode 1 2>/dev/null || true
sudo -u "$CURRENT_USER" defaults write com.adobe.CSXS.11 PlayerDebugMode 1 2>/dev/null || true

echo "✅ Debug mode enabled"

# Clean up
rm -rf "$TEMP_DIR"

echo ""
echo "=========================================="
echo "✅ Installation Complete!"
echo "=========================================="
echo ""
echo "⚠️  IMPORTANT: You need to add the remaining files!"
echo ""
echo "The extension structure is installed, but you need to:"
echo ""
echo "1. Download CSInterface.js:"
echo "   curl -o /tmp/CSInterface.js https://raw.githubusercontent.com/Adobe-CEP/CEP-Resources/master/CEP_11.x/CSInterface.js"
echo "   sudo cp /tmp/CSInterface.js '$INSTALL_PATH/js/'"
echo ""
echo "2. Copy the remaining files from your repo:"
echo "   cd ~/Downloads/ai-image-variations"
echo "   sudo cp index.html '$INSTALL_PATH/'"
echo "   sudo cp styles.css '$INSTALL_PATH/css/'"
echo "   sudo cp app.js '$INSTALL_PATH/js/main.js'"
echo ""
echo "OR use the repository with the complete extension:"
echo "   https://github.com/ilanlenzner-design/ilan"
echo "   Branch: claude/ai-image-variations-01SEbdBRg4WqhLvQv28V2Vwf"
echo ""
echo "After copying files:"
echo "• Restart After Effects"
echo "• Go to: Window → Extensions → AI Image Variations"
echo "• Get API key: https://aistudio.google.com/app/apikey"
echo ""
echo "Installation path: $INSTALL_PATH"
echo "=========================================="
