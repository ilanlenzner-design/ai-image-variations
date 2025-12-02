<div align="center">

<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  <h1>AI Image Variations - After Effects Extension</h1>

  <p>Generate stunning image variations directly in After Effects using Gemini & Imagen AI</p>

  <a href="https://aistudio.google.com/apps">Get API Key</a>

</div>

## Overview

AI Image Variations is a powerful Adobe After Effects CEP extension that leverages Google's cutting-edge AI models to create unique image variations. Upload any image, and let Gemini 2.5 Flash analyze it while Imagen 4.0 generates four distinct variations—all without leaving After Effects.

## Features

- **AI-Powered Analysis** - Deep image understanding using Gemini 2.5 Flash
- **Imagen Generation** - Create 4 unique variations with Imagen 4.0
- **Preserve Options** - Toggle controls to maintain colors and composition
- **Direct Import** - Import generated images straight into your After Effects project
- **One-Click Download** - Save variations to your local drive
- **Dark UI** - Matches After Effects interface seamlessly
- **Local Storage** - API keys stored locally, never sent to external servers

## Installation

### Prerequisites

- Adobe After Effects CC 2019 or later
- Google AI Studio API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation Steps

#### Windows

1. Download or clone this repository
2. Copy the extension folder to:
   ```
   C:\Program Files\Common Files\Adobe\CEP\extensions\AIImageVariations
   ```
3. Enable unsigned extensions (for development):
   - Set registry key `PlayerDebugMode` to `1`:
     ```
     HKEY_CURRENT_USER\Software\Adobe\CSXS.11 (for CC 2021+)
     ```
4. Restart After Effects
5. Access the panel: `Window > Extensions > AI Image Variations`

#### macOS

1. Download or clone this repository
2. Copy the extension folder to:
   ```
   /Library/Application Support/Adobe/CEP/extensions/AIImageVariations
   ```
3. Enable unsigned extensions (for development):
   - Create/edit the file:
     ```
     ~/Library/Preferences/com.adobe.CSXS.11.plist
     ```
   - Add the key `PlayerDebugMode` with value `1`
4. Restart After Effects
5. Access the panel: `Window > Extensions > AI Image Variations`

### Enable Debug Mode

For development, create/modify the `.debug` file in the extension root (already included).

## Usage

### Getting Started

1. **Set Up API Key**
   - Open the extension panel in After Effects
   - Click the link to get your API key from Google AI Studio
   - Paste your API key and click "Save Key"

2. **Upload an Image**
   - Click the upload area or drag & drop an image
   - Supported formats: JPG, PNG, WebP
   - Preview will appear once loaded

3. **Configure Options**
   - **Preserve Colors**: Keep the original color palette
   - **Preserve Composition**: Maintain the layout structure

4. **Generate Variations**
   - Click "Generate Variations"
   - Wait for Gemini to analyze (20-40% progress)
   - Wait for Imagen to generate (40-100% progress)
   - View 4 unique variations

5. **Import to After Effects**
   - Hover over any variation
   - Click "Import" to add to your project
   - Image will be imported and added to active composition (if any)
   - Or click "Save" to download locally

### Features in Detail

#### AI Analysis
Gemini 2.5 Flash analyzes your image to understand:
- Subject and composition
- Color palette and lighting
- Style and mood
- Key visual elements

#### Imagen Generation
Based on the analysis, Imagen 4.0 creates:
- 4 distinct variations
- Each with unique interpretation
- Preserving chosen attributes (colors/composition)
- Professional quality output

#### After Effects Integration
- Automatic import to project panel
- Optional composition layer creation
- Auto-centering in active comp
- No manual file management needed

## Extension Structure

```
AIImageVariations/
├── CSXS/
│   └── manifest.xml          # Extension manifest
├── css/
│   └── styles.css            # UI styling
├── js/
│   ├── CSInterface.js        # Adobe CEP library
│   └── main.js               # Main application logic
├── jsx/
│   └── hostscript.jsx        # After Effects integration
├── .debug                    # Debug configuration
├── index.html                # Extension UI
└── README.md                 # This file
```

## API Requirements

### Gemini API
- Model: `gemini-2.0-flash-exp`
- Endpoint: `generativelanguage.googleapis.com`
- Required for image analysis

### Imagen API
- Model: `imagen-3.0-generate-001`
- Endpoint: `generativelanguage.googleapis.com`
- Required for generating variations

Get your API key: [Google AI Studio](https://aistudio.google.com/app/apikey)

## Troubleshooting

### Extension Not Appearing

1. Check installation path is correct
2. Ensure debug mode is enabled (registry/plist)
3. Restart After Effects completely
4. Check CEP version compatibility

### API Errors

- **Invalid API Key**: Verify key from AI Studio
- **Quota Exceeded**: Check API usage limits
- **Network Error**: Check internet connection

### Import Issues

- Ensure you have an active After Effects project
- Check temporary folder write permissions
- Verify image format compatibility

## Development

### Debug in Chrome DevTools

1. Enable debug mode (see installation)
2. Open After Effects with extension
3. Navigate to `http://localhost:8088` in Chrome
4. Select your extension to debug

### Modify Code

- **UI Changes**: Edit `index.html` and `css/styles.css`
- **Logic Changes**: Edit `js/main.js`
- **AE Integration**: Edit `jsx/hostscript.jsx`
- **Manifest**: Edit `CSXS/manifest.xml`

## License

Built with Google AI Studio. See Google's terms for API usage.

## Credits

- **Gemini 2.5 Flash** by Google DeepMind
- **Imagen 4.0** by Google Research
- Adobe CEP Framework

## Support

For issues and feature requests, please open an issue on GitHub.

---

<div align="center">
  <p>Built with ❤️ using Google AI Studio</p>
  <a href="https://aistudio.google.com">Learn More</a>
</div>
