# Installation Guide - AI Image Variations CEP Extension

## Quick Start

This guide will walk you through installing the AI Image Variations extension for Adobe After Effects.

## System Requirements

- **Operating System**: Windows 10+ or macOS 10.13+
- **Adobe After Effects**: CC 2019 or later (CEP 11 compatible)
- **Internet Connection**: Required for API calls to Google AI Studio
- **API Key**: Free Google AI Studio API key

## Step 1: Get Your API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key (keep it secure)

## Step 2: Download the Extension

### Option A: Clone Repository
```bash
git clone https://github.com/ilanlenzner-design/ai-image-variations.git
cd ai-image-variations
```

### Option B: Download ZIP
1. Go to the repository page
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file

## Step 3: Install the Extension

### Windows Installation

1. **Locate CEP Extensions Folder**
   ```
   C:\Program Files\Common Files\Adobe\CEP\extensions\
   ```
   If the folder doesn't exist, create it.

2. **Copy Extension Files**
   - Copy the entire extension folder
   - Rename it to `AIImageVariations`
   - Final path: `C:\Program Files\Common Files\Adobe\CEP\extensions\AIImageVariations\`

3. **Enable Developer Mode**
   - Press `Win + R` to open Run dialog
   - Type `regedit` and press Enter
   - Navigate to:
     ```
     HKEY_CURRENT_USER\Software\Adobe\CSXS.11
     ```
   - Right-click → New → String Value
   - Name: `PlayerDebugMode`
   - Value: `1`

   **Note**: For different After Effects versions:
   - CC 2019: `CSXS.9`
   - CC 2020: `CSXS.10`
   - CC 2021+: `CSXS.11`

4. **Restart After Effects**

### macOS Installation

1. **Locate CEP Extensions Folder**
   ```
   /Library/Application Support/Adobe/CEP/extensions/
   ```
   If the folder doesn't exist, create it.

2. **Copy Extension Files**
   ```bash
   sudo cp -r /path/to/ai-image-variations /Library/Application\ Support/Adobe/CEP/extensions/AIImageVariations
   ```

3. **Enable Developer Mode**

   **Option A: Using Terminal**
   ```bash
   defaults write com.adobe.CSXS.11 PlayerDebugMode 1
   ```

   **Option B: Manual plist Edit**
   - Navigate to: `~/Library/Preferences/`
   - Open or create: `com.adobe.CSXS.11.plist`
   - Add the key:
     ```xml
     <key>PlayerDebugMode</key>
     <string>1</string>
     ```

   **Note**: For different After Effects versions:
   - CC 2019: `com.adobe.CSXS.9`
   - CC 2020: `com.adobe.CSXS.10`
   - CC 2021+: `com.adobe.CSXS.11`

4. **Set Permissions** (if needed)
   ```bash
   sudo chmod -R 755 /Library/Application\ Support/Adobe/CEP/extensions/AIImageVariations
   ```

5. **Restart After Effects**

## Step 4: Launch the Extension

1. Open Adobe After Effects
2. Go to: `Window` → `Extensions` → `AI Image Variations`
3. The panel should appear in your workspace

## Step 5: Configure API Key

1. In the extension panel, locate the "Gemini API Key" field
2. Paste your API key from Step 1
3. Click "Save Key"
4. The key is stored locally in browser localStorage

## Verification

To verify the installation:

1. **Extension Appears**: Check `Window → Extensions` menu
2. **Panel Opens**: The extension panel should load without errors
3. **API Key Saved**: Try uploading an image
4. **Generate Button**: Should be enabled after image upload

## Troubleshooting

### Extension Not Visible in Menu

**Solution 1: Check Installation Path**
- Ensure files are in the correct CEP extensions folder
- Verify folder name is `AIImageVariations`

**Solution 2: Enable Debug Mode**
- Confirm registry/plist changes are saved
- Make sure you edited the correct CSXS version

**Solution 3: Restart Completely**
- Quit After Effects completely (check Task Manager/Activity Monitor)
- Wait 10 seconds
- Restart After Effects

### Panel Shows Error

**Solution 1: Check File Integrity**
- Ensure all files are present:
  - `index.html`
  - `CSXS/manifest.xml`
  - `js/CSInterface.js`
  - `js/main.js`
  - `css/styles.css`
  - `jsx/hostscript.jsx`

**Solution 2: Check Permissions**
- Windows: Run After Effects as Administrator
- macOS: Check folder permissions with `ls -la`

### API Key Not Working

**Solution 1: Verify API Key**
- Check for extra spaces or characters
- Generate a new key from AI Studio
- Ensure API is enabled in Google Cloud Console

**Solution 2: Check Network**
- Verify internet connection
- Check firewall settings
- Try a different network

### Images Not Importing

**Solution 1: Check After Effects Project**
- Ensure a project is open (not just After Effects)
- Try creating a new project

**Solution 2: Check Temp Folder**
- Windows: Verify `%TEMP%` folder access
- macOS: Verify `/tmp` folder access

**Solution 3: Check ExtendScript**
- Open ExtendScript Toolkit (if available)
- Test `jsx/hostscript.jsx` functions manually

## Advanced Configuration

### Custom Installation Path

If you need to install to a custom location:

1. Install to your preferred location
2. Create a symbolic link to CEP extensions folder:

**Windows (Command Prompt as Admin)**:
```cmd
mklink /D "C:\Program Files\Common Files\Adobe\CEP\extensions\AIImageVariations" "C:\Your\Custom\Path\AIImageVariations"
```

**macOS/Linux**:
```bash
sudo ln -s /Your/Custom/Path/AIImageVariations "/Library/Application Support/Adobe/CEP/extensions/AIImageVariations"
```

### Debugging with Chrome DevTools

1. Enable debug mode (see Step 3)
2. Open After Effects with extension loaded
3. Open Chrome browser
4. Navigate to: `http://localhost:8088`
5. Click on your extension name
6. Chrome DevTools will open for debugging

### Multiple After Effects Versions

If you have multiple AE versions:

1. Enable debug mode for each CSXS version
2. The same extension works across versions
3. CEP 11 (CC 2021+) is recommended

## Uninstallation

### Windows
1. Delete folder:
   ```
   C:\Program Files\Common Files\Adobe\CEP\extensions\AIImageVariations
   ```
2. Optionally remove registry key:
   ```
   HKEY_CURRENT_USER\Software\Adobe\CSXS.11\PlayerDebugMode
   ```

### macOS
1. Delete folder:
   ```bash
   sudo rm -rf "/Library/Application Support/Adobe/CEP/extensions/AIImageVariations"
   ```
2. Optionally remove debug mode:
   ```bash
   defaults delete com.adobe.CSXS.11 PlayerDebugMode
   ```

## Updates

To update the extension:

1. Download the latest version
2. Delete the old installation folder
3. Copy the new version to the extensions folder
4. Restart After Effects

**Note**: Your API key is stored in localStorage and will persist.

## Support

If you continue to have issues:

1. Check the [Troubleshooting](README.md#troubleshooting) section in README
2. Open an issue on GitHub with:
   - Your OS and version
   - After Effects version
   - Error messages (from Chrome DevTools if available)
   - Steps to reproduce

## Next Steps

After successful installation:

1. Read the [Usage Guide](README.md#usage) in README
2. Try uploading a test image
3. Experiment with preserve options
4. Import variations into your compositions

---

**Congratulations!** You've successfully installed the AI Image Variations extension. Happy creating!
