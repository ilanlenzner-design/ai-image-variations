/*
 * After Effects ExtendScript Host Functions
 * For AI Image Variations CEP Extension
 */

/**
 * Import a base64 encoded image into After Effects
 * @param {string} base64Image - Base64 encoded image data
 * @param {string} filename - Name for the imported file
 * @returns {string} - "success" or error message
 */
function importImageToAE(base64Image, filename) {
    try {
        // Ensure we have a project
        var proj = app.project;
        if (!proj) {
            return "Error: No active project";
        }

        // Create a temporary file path
        var tempFolder = Folder.temp;
        var tempFile = new File(tempFolder.fsName + "/" + filename);

        // Decode base64 and write to file
        if (!writeBase64ToFile(base64Image, tempFile)) {
            return "Error: Failed to write temporary file";
        }

        // Import the file into After Effects
        var importOptions = new ImportOptions(tempFile);
        if (!importOptions.canImportAs(ImportAsType.FOOTAGE)) {
            tempFile.remove();
            return "Error: File cannot be imported as footage";
        }

        var importedItem = proj.importFile(importOptions);

        // Clean up temporary file
        tempFile.remove();

        // Select the imported item in the project panel
        importedItem.selected = true;

        // Optionally add to active composition
        var activeComp = app.project.activeItem;
        if (activeComp && activeComp instanceof CompItem) {
            var layer = activeComp.layers.add(importedItem);
            layer.selected = true;

            // Center the layer
            var compWidth = activeComp.width;
            var compHeight = activeComp.height;
            var layerWidth = importedItem.width;
            var layerHeight = importedItem.height;

            layer.property("Position").setValue([compWidth/2, compHeight/2]);
        }

        return "success";
    } catch (e) {
        return "Error: " + e.toString();
    }
}

/**
 * Write base64 encoded data to a file
 * @param {string} base64Data - Base64 encoded string
 * @param {File} file - File object to write to
 * @returns {boolean} - Success status
 */
function writeBase64ToFile(base64Data, file) {
    try {
        // Remove data URL prefix if present
        var cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');

        // Decode base64
        var decoded = decodeBase64(cleanBase64);

        // Write to file
        file.encoding = "BINARY";
        if (!file.open("w")) {
            return false;
        }

        file.write(decoded);
        file.close();

        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Decode base64 string to binary
 * @param {string} base64 - Base64 encoded string
 * @returns {string} - Decoded binary string
 */
function decodeBase64(base64) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var result = "";
    var i = 0;

    // Remove padding
    base64 = base64.replace(/[^A-Za-z0-9\+\/]/g, "");

    while (i < base64.length) {
        var enc1 = chars.indexOf(base64.charAt(i++));
        var enc2 = chars.indexOf(base64.charAt(i++));
        var enc3 = chars.indexOf(base64.charAt(i++));
        var enc4 = chars.indexOf(base64.charAt(i++));

        var chr1 = (enc1 << 2) | (enc2 >> 4);
        var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        var chr3 = ((enc3 & 3) << 6) | enc4;

        result += String.fromCharCode(chr1);

        if (enc3 != -1) {
            result += String.fromCharCode(chr2);
        }
        if (enc4 != -1) {
            result += String.fromCharCode(chr3);
        }
    }

    return result;
}

/**
 * Get current After Effects project information
 * @returns {string} - JSON string with project info
 */
function getProjectInfo() {
    try {
        var proj = app.project;
        if (!proj) {
            return JSON.stringify({ error: "No active project" });
        }

        var info = {
            name: proj.file ? proj.file.name : "Untitled",
            numItems: proj.numItems,
            activeComp: null
        };

        if (proj.activeItem && proj.activeItem instanceof CompItem) {
            info.activeComp = {
                name: proj.activeItem.name,
                width: proj.activeItem.width,
                height: proj.activeItem.height,
                duration: proj.activeItem.duration,
                frameRate: proj.activeItem.frameRate
            };
        }

        return JSON.stringify(info);
    } catch (e) {
        return JSON.stringify({ error: e.toString() });
    }
}

/**
 * Create a new composition with specified dimensions
 * @param {string} name - Composition name
 * @param {number} width - Composition width
 * @param {number} height - Composition height
 * @param {number} duration - Composition duration in seconds
 * @param {number} frameRate - Frame rate
 * @returns {string} - Success or error message
 */
function createComposition(name, width, height, duration, frameRate) {
    try {
        var proj = app.project;
        if (!proj) {
            return "Error: No active project";
        }

        var comp = proj.items.addComp(name, width, height, 1.0, duration, frameRate);
        comp.openInViewer();

        return "success";
    } catch (e) {
        return "Error: " + e.toString();
    }
}

/**
 * Replace current layer source with new footage
 * @param {string} base64Image - Base64 encoded image
 * @param {string} filename - Filename for the image
 * @returns {string} - Success or error message
 */
function replaceLayerSource(base64Image, filename) {
    try {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            return "Error: No active composition";
        }

        var selectedLayers = comp.selectedLayers;
        if (selectedLayers.length === 0) {
            return "Error: No layer selected";
        }

        var layer = selectedLayers[0];

        // Create temporary file
        var tempFolder = Folder.temp;
        var tempFile = new File(tempFolder.fsName + "/" + filename);

        if (!writeBase64ToFile(base64Image, tempFile)) {
            return "Error: Failed to write temporary file";
        }

        // Import new footage
        var importOptions = new ImportOptions(tempFile);
        var newFootage = app.project.importFile(importOptions);

        // Replace source
        layer.replaceSource(newFootage, false);

        // Clean up
        tempFile.remove();

        return "success";
    } catch (e) {
        return "Error: " + e.toString();
    }
}

/**
 * Export current frame as base64
 * @returns {string} - Base64 encoded image or error
 */
function exportCurrentFrame() {
    try {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            return JSON.stringify({ error: "No active composition" });
        }

        // Save current frame to temp file
        var tempFolder = Folder.temp;
        var tempFile = new File(tempFolder.fsName + "/ae_export_" + new Date().getTime() + ".png");

        comp.saveFrameToPng(comp.time, tempFile);

        // Read file as base64
        tempFile.encoding = "BINARY";
        if (!tempFile.open("r")) {
            return JSON.stringify({ error: "Failed to read exported file" });
        }

        var content = tempFile.read();
        tempFile.close();

        var base64 = encodeBase64(content);
        tempFile.remove();

        return JSON.stringify({ image: base64 });
    } catch (e) {
        return JSON.stringify({ error: e.toString() });
    }
}

/**
 * Encode binary data to base64
 * @param {string} data - Binary data string
 * @returns {string} - Base64 encoded string
 */
function encodeBase64(data) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var result = "";
    var i = 0;

    while (i < data.length) {
        var chr1 = data.charCodeAt(i++);
        var chr2 = i < data.length ? data.charCodeAt(i++) : 0;
        var chr3 = i < data.length ? data.charCodeAt(i++) : 0;

        var enc1 = chr1 >> 2;
        var enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        var enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        var enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        result += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + chars.charAt(enc4);
    }

    return result;
}
