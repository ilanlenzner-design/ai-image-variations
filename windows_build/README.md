# Windows Build Instructions

This folder contains the necessary files to package the **AI Image Variations** extension as a Windows installer (`.exe`).

## Prerequisites

You need a Windows PC (or a virtual machine like Parallels/VMware) to build the installer.

1.  **Download and Install Inno Setup**:
    *   Go to: [https://jrsoftware.org/isdl.php](https://jrsoftware.org/isdl.php)
    *   Download the latest "Stable Release" (e.g., `innosetup-6.x.x.exe`).
    *   Install it with default settings.

## How to Build the Installer

1.  **Get the Code on Windows**:
    *   Clone this repository or download the ZIP file to your Windows computer.
    *   Extract it if it's a ZIP.

2.  **Open the Script**:
    *   Navigate to the `windows_build` folder inside the project.
    *   Double-click the `installer.iss` file. This should open it in the **Inno Setup Compiler**.

3.  **Compile**:
    *   In Inno Setup, click the **Build** menu -> **Compile** (or press `Ctrl+F9`).
    *   The tool will read the files from the parent directory (`../index.html`, `../js`, etc.) and compress them into an installer.

4.  **Get the Installer**:
    *   Once the compilation finishes (it should be very fast), look in the `windows_build` folder (or a subfolder named `Output` if created).
    *   You will see a file named `AIImageVariations_Installer_Win.exe`.

## Distributing

You can now send `AIImageVariations_Installer_Win.exe` to any Windows user.

*   **Installation Path**: The installer is configured to automatically install the extension to:
    `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.ilanlenzner.aiImageVariations`
    (or `C:\Program Files\Common Files...` depending on the system).

*   **Note**: Users might need to restart After Effects after installing.
