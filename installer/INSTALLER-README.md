# AI Image Variations - Installer Package

This directory contains everything needed to create a professional macOS installer for the AI Image Variations After Effects extension.

## 🎯 Two Installation Options

### Option 1: AppleScript Installer (EASIEST - Recommended)

**Perfect for end users who want a simple double-click install.**

#### How to Use:

1. **Open the AppleScript:**
   ```bash
   open installer/Easy-Install.applescript
   ```

   Or double-click `Easy-Install.applescript` in Finder

2. **Click "Run"** in Script Editor

3. **Follow the dialogs:**
   - Click "Continue" on welcome screen
   - Enter your administrator password when prompted
   - Click "Open API Page" to get your API key

4. **Done!** Restart After Effects and access the extension

**Pros:**
- ✅ No building required
- ✅ Simple dialogs guide you through
- ✅ Automatically opens API key page
- ✅ Works immediately

**Cons:**
- ⚠️ Less professional looking than .pkg
- ⚠️ Requires opening in Script Editor

---

### Option 2: Build .pkg Installer (PROFESSIONAL)

**Perfect for distribution, more professional appearance.**

#### Requirements:

- macOS (this won't work on Linux)
- Xcode Command Line Tools

**Install Xcode tools if needed:**
```bash
xcode-select --install
```

#### Build Steps:

1. **Navigate to installer directory:**
   ```bash
   cd ai-image-variations/installer
   ```

2. **Run the build script:**
   ```bash
   ./build-pkg.sh
   ```

3. **Find your installer:**
   - Output: `AIImageVariations-Installer.pkg`
   - Located in the `installer/` directory

4. **Install:**
   - Double-click the `.pkg` file
   - Follow the installation wizard
   - Enter password when prompted

**Pros:**
- ✅ Professional installer appearance
- ✅ Includes welcome/license/conclusion screens
- ✅ Easy to distribute
- ✅ Standard macOS installer experience

**Cons:**
- ⚠️ Requires building on Mac
- ⚠️ Needs Xcode Command Line Tools

---

## 📦 Package Contents

```
installer/
├── Easy-Install.applescript   # Simple AppleScript installer
├── build-pkg.sh               # Script to build .pkg
├── Distribution.xml           # Package distribution config
├── welcome.html               # Installer welcome screen
├── license.txt                # Software license
├── conclusion.html            # Post-install instructions
├── scripts/
│   ├── preinstall            # Pre-installation checks
│   └── postinstall           # Post-installation setup
├── payload/
│   └── AIImageVariations/    # Extension files
│       ├── CSXS/
│       ├── css/
│       ├── js/
│       ├── jsx/
│       ├── .debug
│       ├── index.html
│       └── README.md
└── INSTALLER-README.md        # This file
```

---

## 🔧 What the Installer Does

Both installation methods perform these steps:

1. **Create CEP Extensions Folder**
   - Path: `/Library/Application Support/Adobe/CEP/extensions/`
   - Creates if doesn't exist

2. **Copy Extension Files**
   - Copies all extension files to: `/Library/Application Support/Adobe/CEP/extensions/AIImageVariations/`
   - Sets proper permissions (755)

3. **Enable Debug Mode**
   - Enables `PlayerDebugMode` for CEP versions 9, 10, and 11
   - Allows unsigned extensions to run
   - Required for development extensions

4. **Set Permissions**
   - Ensures files are readable and executable
   - Sets ownership appropriately

---

## 🎨 Customizing the Installer

### Modify Welcome Screen

Edit `installer/welcome.html` to change:
- Welcome message
- Feature list
- Requirements
- Branding

### Modify License

Edit `installer/license.txt` to update:
- License terms
- Attribution
- Usage restrictions

### Modify Conclusion Screen

Edit `installer/conclusion.html` to change:
- Success message
- Next steps
- Support links

### Add Background Image

1. Create a PNG image (620x418 pixels recommended)
2. Save as `installer/background.png`
3. The build script will automatically include it

---

## 🧪 Testing the Installer

### Test the AppleScript:

```bash
# Open in Script Editor
open installer/Easy-Install.applescript
```

Click "Run" to test the installation process.

### Test the .pkg:

```bash
# Build the package
cd installer
./build-pkg.sh

# Install (test in a VM if possible)
open AIImageVariations-Installer.pkg
```

---

## 📤 Distributing the Installer

### For .pkg Distribution:

1. **Build the package** (as shown above)

2. **Optional: Sign the package** (requires Apple Developer account)
   ```bash
   productsign --sign "Developer ID Installer: Your Name" \
     AIImageVariations-Installer.pkg \
     AIImageVariations-Installer-Signed.pkg
   ```

3. **Optional: Notarize** (for Gatekeeper approval)
   ```bash
   xcrun notarytool submit AIImageVariations-Installer-Signed.pkg \
     --apple-id "your@email.com" \
     --team-id "TEAMID" \
     --password "app-specific-password"
   ```

4. **Distribute:**
   - Upload to website/GitHub releases
   - Share via download link
   - Users double-click to install

### For AppleScript Distribution:

**Option A: As .scpt file**
```bash
osacompile -o Easy-Install.scpt installer/Easy-Install.applescript
```

**Option B: As .app bundle** (better for distribution)
```bash
osacompile -o "AI Image Variations Installer.app" installer/Easy-Install.applescript
```

Then compress and distribute:
```bash
zip -r AIImageVariations-Installer.zip "AI Image Variations Installer.app"
```

---

## 🔐 Code Signing (Optional but Recommended)

### Why Sign?

- Prevents Gatekeeper warnings
- Builds user trust
- Required for Mac App Store

### How to Sign:

1. **Get a Developer ID Certificate** from Apple Developer Program ($99/year)

2. **Sign the installer:**
   ```bash
   productsign --sign "Developer ID Installer: Your Name (TEAMID)" \
     AIImageVariations-Installer.pkg \
     AIImageVariations-Installer-Signed.pkg
   ```

3. **Verify signature:**
   ```bash
   pkgutil --check-signature AIImageVariations-Installer-Signed.pkg
   ```

---

## 🐛 Troubleshooting Build Issues

### "pkgbuild: command not found"

**Solution:** Install Xcode Command Line Tools
```bash
xcode-select --install
```

### "Payload directory not found"

**Solution:** Ensure you're in the correct directory and files exist
```bash
ls -la installer/payload/AIImageVariations
```

### Permission Denied

**Solution:** Make script executable
```bash
chmod +x installer/build-pkg.sh
```

### AppleScript Won't Run

**Solution 1:** Open in Script Editor first
```bash
open -a "Script Editor" installer/Easy-Install.applescript
```

**Solution 2:** Check Security & Privacy settings
- System Preferences → Security & Privacy → Privacy
- Automation → Allow Script Editor

---

## 📋 Installation Verification

After installation, verify with:

```bash
# Check files exist
ls -la "/Library/Application Support/Adobe/CEP/extensions/AIImageVariations"

# Check debug mode enabled
defaults read com.adobe.CSXS.11 PlayerDebugMode

# Should return: 1
```

---

## 🗑️ Uninstallation

To uninstall:

```bash
# Remove extension
sudo rm -rf "/Library/Application Support/Adobe/CEP/extensions/AIImageVariations"

# Optional: Disable debug mode
defaults delete com.adobe.CSXS.11 PlayerDebugMode
```

Or provide an uninstaller script:
```bash
#!/bin/bash
sudo rm -rf "/Library/Application Support/Adobe/CEP/extensions/AIImageVariations"
echo "✅ AI Image Variations uninstalled"
```

---

## 📞 Support

For issues with:
- **Building:** Check this README's troubleshooting section
- **Installing:** See main INSTALL.md in project root
- **Using:** See main README.md in project root

---

## ✅ Quick Start Summary

**For End Users (Easiest):**
```bash
open installer/Easy-Install.applescript
# Click Run → Enter Password → Done!
```

**For Professional Distribution:**
```bash
cd installer
./build-pkg.sh
# Creates: AIImageVariations-Installer.pkg
# Double-click to install
```

That's it! Choose the method that works best for your needs.
