// Initialize CSInterface
const csInterface = new CSInterface();

// DOM Elements
let fileInput;
let uploadArea;
let previewImage;
let generateBtn;
let apiKeyInput;
let saveApiKeyBtn;
let progressSection;
let progressFill;
let progressText;
let resultsSection;
let resultsGrid;
let errorMessage;
let preserveColorsCheckbox;
let preserveCompositionCheckbox;

// State
let currentImage = null;
let apiKey = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

function init() {
    // Get DOM elements
    fileInput = document.getElementById('fileInput');
    uploadArea = document.getElementById('uploadArea');
    previewImage = document.getElementById('previewImage');
    generateBtn = document.getElementById('generateBtn');
    apiKeyInput = document.getElementById('apiKey');
    saveApiKeyBtn = document.getElementById('saveApiKey');
    progressSection = document.getElementById('progressSection');
    progressFill = document.getElementById('progressFill');
    progressText = document.getElementById('progressText');
    resultsSection = document.getElementById('resultsSection');
    resultsGrid = document.getElementById('resultsGrid');
    errorMessage = document.getElementById('errorMessage');
    preserveColorsCheckbox = document.getElementById('preserveColors');
    preserveCompositionCheckbox = document.getElementById('preserveComposition');

    // Load saved API key
    loadApiKey();

    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // API Key
    saveApiKeyBtn.addEventListener('click', saveApiKey);
    document.getElementById('openAIStudio').addEventListener('click', (e) => {
        e.preventDefault();
        csInterface.openURLInDefaultBrowser('https://aistudio.google.com/app/apikey');
    });

    // Upload area
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // Generate button
    generateBtn.addEventListener('click', generateVariations);
}

function loadApiKey() {
    const stored = localStorage.getItem('gemini_api_key');
    if (stored) {
        apiKey = stored;
        apiKeyInput.value = stored;
    }
}

function saveApiKey() {
    const key = apiKeyInput.value.trim();
    if (key) {
        apiKey = key;
        localStorage.setItem('gemini_api_key', key);
        showMessage('API key saved successfully', 'success');
        updateGenerateButton();
    } else {
        showError('Please enter a valid API key');
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        loadImage(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        loadImage(files[0]);
    }
}

function loadImage(file) {
    // Validate file type
    if (!file.type.match('image.*')) {
        showError('Please select a valid image file');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = {
            data: e.target.result,
            name: file.name,
            type: file.type
        };

        // Show preview
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        document.querySelector('.upload-placeholder').style.display = 'none';

        updateGenerateButton();
    };
    reader.readAsDataURL(file);
}

function updateGenerateButton() {
    generateBtn.disabled = !(currentImage && apiKey);
}

async function generateVariations() {
    if (!currentImage || !apiKey) {
        showError('Please provide an API key and upload an image');
        return;
    }

    try {
        // Hide error, show progress
        hideError();
        progressSection.style.display = 'block';
        resultsSection.style.display = 'none';
        generateBtn.disabled = true;

        // Step 1: Analyze image with Gemini
        updateProgress(20, 'Analyzing image with Gemini...');
        const analysis = await analyzeImage(currentImage.data);

        // Step 2: Generate variations with Imagen
        updateProgress(40, 'Generating variations with Imagen...');
        const variations = await generateWithImagen(analysis);

        // Step 3: Display results
        updateProgress(100, 'Complete!');
        displayResults(variations);

        setTimeout(() => {
            progressSection.style.display = 'none';
            generateBtn.disabled = false;
        }, 500);

    } catch (error) {
        console.error('Error generating variations:', error);
        showError(error.message || 'Failed to generate variations');
        progressSection.style.display = 'none';
        generateBtn.disabled = false;
    }
}

async function analyzeImage(imageData) {
    // Convert base64 to blob for API
    const base64Data = imageData.split(',')[1];
    const mimeType = imageData.split(',')[0].match(/:(.*?);/)[1];

    const preserveColors = preserveColorsCheckbox.checked;
    const preserveComposition = preserveCompositionCheckbox.checked;

    const prompt = `Analyze this image in detail. Describe:
1. Main subject and composition
2. Color palette and lighting
3. Style and mood
4. Key visual elements

${preserveColors ? 'Focus on preserving the color scheme in variations.' : ''}
${preserveComposition ? 'Focus on preserving the composition structure in variations.' : ''}

Provide a detailed description suitable for generating 4 distinct variations of this image.`;

    const requestBody = {
        contents: [{
            parts: [
                { text: prompt },
                {
                    inline_data: {
                        mime_type: mimeType,
                        data: base64Data
                    }
                }
            ]
        }]
    };

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to analyze image');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

async function generateWithImagen(analysis) {
    const variations = [];
    const preserveColors = preserveColorsCheckbox.checked;
    const preserveComposition = preserveCompositionCheckbox.checked;

    // Generate 4 variations
    const prompts = [
        `${analysis}. Create a variation with ${preserveColors ? 'same colors' : 'different colors'} and ${preserveComposition ? 'similar composition' : 'new composition'}.`,
        `${analysis}. Create an artistic interpretation with ${preserveColors ? 'original color palette' : 'creative color changes'}.`,
        `${analysis}. Generate a fresh take while ${preserveComposition ? 'maintaining the layout' : 'exploring new arrangements'}.`,
        `${analysis}. Produce a unique version ${preserveColors ? 'preserving color harmony' : 'with bold color shifts'}.`
    ];

    for (let i = 0; i < 4; i++) {
        updateProgress(40 + (i * 12), `Generating variation ${i + 1}/4...`);

        try {
            const requestBody = {
                instances: [{
                    prompt: prompts[i]
                }],
                parameters: {
                    sampleCount: 1,
                    aspectRatio: "1:1"
                }
            };

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.predictions && data.predictions[0]) {
                    variations.push({
                        image: data.predictions[0].bytesBase64Encoded,
                        prompt: prompts[i]
                    });
                }
            }
        } catch (error) {
            console.error(`Error generating variation ${i + 1}:`, error);
        }
    }

    if (variations.length === 0) {
        throw new Error('No variations were generated');
    }

    return variations;
}

function displayResults(variations) {
    resultsGrid.innerHTML = '';

    variations.forEach((variation, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';

        const img = document.createElement('img');
        img.src = `data:image/png;base64,${variation.image}`;
        img.alt = `Variation ${index + 1}`;

        const actions = document.createElement('div');
        actions.className = 'result-actions';

        const importBtn = document.createElement('button');
        importBtn.className = 'action-btn';
        importBtn.textContent = 'Import';
        importBtn.onclick = () => importToAfterEffects(variation.image, `variation_${index + 1}.png`);

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'action-btn';
        downloadBtn.textContent = 'Save';
        downloadBtn.onclick = () => downloadImage(variation.image, `variation_${index + 1}.png`);

        actions.appendChild(importBtn);
        actions.appendChild(downloadBtn);

        resultItem.appendChild(img);
        resultItem.appendChild(actions);
        resultsGrid.appendChild(resultItem);
    });

    resultsSection.style.display = 'block';
}

function importToAfterEffects(base64Image, filename) {
    // Call ExtendScript to import image into After Effects
    const script = `importImageToAE("${base64Image}", "${filename}")`;
    csInterface.evalScript(script, (result) => {
        if (result === 'success') {
            showMessage('Image imported to After Effects', 'success');
        } else {
            showError('Failed to import image: ' + result);
        }
    });
}

function downloadImage(base64Image, filename) {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Image}`;
    link.download = filename;
    link.click();
}

function updateProgress(percent, text) {
    progressFill.style.width = percent + '%';
    progressText.textContent = text;
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showMessage(message, type) {
    // Simple notification - could be enhanced
    const msg = document.createElement('div');
    msg.className = type === 'success' ? 'success-message' : 'error-message';
    msg.textContent = message;
    msg.style.display = 'block';
    document.querySelector('.container').prepend(msg);

    setTimeout(() => {
        msg.remove();
    }, 3000);
}
