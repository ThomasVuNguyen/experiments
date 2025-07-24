# Outlook Content Reader Chrome Extension

A Chrome extension that automatically detects Outlook webpages and displays their content in a popup.

## Features

- Automatically activates on Outlook webpages (outlook.live.com, outlook.office.com, outlook.office365.com)
- Extracts email content, subjects, and message lists
- Displays the extracted content in a clean, user-friendly popup interface
- Monitors for dynamic content changes and updates the stored data accordingly
- Provides a refresh button to manually update the content

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the extension directory
5. The extension is now installed and will automatically run on Outlook pages

## Usage

1. Navigate to any Outlook webpage
2. Click on the extension icon in your browser toolbar to open the popup
3. The popup will display the page information and any detected email content
4. Click the "Refresh Content" button to update the displayed information
5. For developers: Open Chrome DevTools (F12) to see additional console logs

## Permissions

This extension requires the following permissions:
- `activeTab`: To access the current tab's content
- `scripting`: To inject scripts into Outlook pages
- `storage`: To store extracted data for the popup
- Access to Outlook domains (outlook.live.com, outlook.office.com, outlook.office365.com)

## Development

To modify the extension:
1. Edit the files as needed
2. Reload the extension in `chrome://extensions/` by clicking the refresh icon
3. Test your changes on an Outlook page

## Files

- `manifest.json`: Extension configuration
- `content.js`: Script that runs on Outlook pages to extract content
- `background.js`: Background script for extension functionality
- `popup.html`: HTML structure for the popup UI
- `popup.js`: JavaScript for the popup functionality
- `icon.png`: Extension icon
