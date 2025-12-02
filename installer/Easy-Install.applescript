(*
AI Image Variations - Easy Installer
Double-click this file to install the extension
*)

-- Get the directory where this script is located
tell application "Finder"
	set scriptPath to container of (path to me) as text
	set scriptPOSIXPath to POSIX path of scriptPath
end tell

-- Show welcome dialog
set welcomeMessage to "Welcome to AI Image Variations Installer!

This will install the CEP extension for Adobe After Effects.

Requirements:
• Adobe After Effects CC 2019 or later
• Administrator access
• Internet connection for API calls

Click Continue to proceed with installation."

set userChoice to button returned of (display dialog welcomeMessage buttons {"Cancel", "Continue"} default button "Continue" with icon note with title "AI Image Variations Installer")

if userChoice is "Cancel" then
	return
end if

-- Define paths
set extensionSource to scriptPOSIXPath & "payload/AIImageVariations"
set cepPath to "/Library/Application Support/Adobe/CEP/extensions/"
set installPath to cepPath & "AIImageVariations"

try
	-- Check if After Effects is running
	tell application "System Events"
		set aeRunning to (name of processes) contains "After Effects"
	end tell

	if aeRunning then
		display dialog "After Effects is currently running.

For the installation to take effect, After Effects needs to be restarted after installation.

Click OK to continue." buttons {"OK"} default button "OK" with icon caution
	end if

	-- Create CEP extensions directory and copy files
	set progress description to "Installing AI Image Variations..."
	set progress additional description to "Copying extension files..."

	-- Create directory and copy files (requires admin password)
	do shell script "mkdir -p '" & cepPath & "' && cp -R '" & extensionSource & "' '" & installPath & "' && chmod -R 755 '" & installPath & "'" with administrator privileges

	set progress additional description to "Enabling debug mode..."

	-- Enable debug mode for CEP 9, 10, and 11
	-- Get current user
	set currentUser to do shell script "stat -f '%Su' /dev/console"

	-- Enable debug mode for different CEP versions
	do shell script "sudo -u " & currentUser & " defaults write com.adobe.CSXS.9 PlayerDebugMode 1" with administrator privileges
	do shell script "sudo -u " & currentUser & " defaults write com.adobe.CSXS.10 PlayerDebugMode 1" with administrator privileges
	do shell script "sudo -u " & currentUser & " defaults write com.adobe.CSXS.11 PlayerDebugMode 1" with administrator privileges

	-- Success message
	set successMessage to "✅ Installation Complete!

The AI Image Variations extension has been installed successfully.

Next Steps:
1. Restart After Effects (if running)
2. Go to: Window → Extensions → AI Image Variations
3. Get your API key from: https://aistudio.google.com/app/apikey
4. Paste API key in the extension and start creating!

Installation Location:
/Library/Application Support/Adobe/CEP/extensions/AIImageVariations

Would you like to open the API key page now?"

	set openAPIPage to button returned of (display dialog successMessage buttons {"No Thanks", "Open API Page"} default button "Open API Page" with icon note with title "Installation Complete")

	if openAPIPage is "Open API Page" then
		open location "https://aistudio.google.com/app/apikey"
	end if

on error errMsg number errNum
	-- Error handling
	set errorMessage to "❌ Installation Failed

Error: " & errMsg & " (Code: " & errNum & ")

Common issues:
• Make sure you entered the administrator password
• Check that you have write permissions
• Ensure After Effects is installed

Please try again or install manually following the INSTALL.md guide."

	display dialog errorMessage buttons {"OK"} default button "OK" with icon stop with title "Installation Error"
end try
