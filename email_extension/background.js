// background.js - Background script for the Outlook Content Reader extension

// Log when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Outlook Content Reader extension installed');
  
  // Initialize storage with empty data
  chrome.storage.local.set({ outlookData: null }, function() {
    console.log('Storage initialized');
  });
});

// Listen for tab updates to detect when user navigates to an Outlook page
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the page is fully loaded and is an Outlook page
  if (changeInfo.status === 'complete' && 
      (tab.url.includes('outlook.live.com') || 
       tab.url.includes('outlook.office.com') || 
       tab.url.includes('outlook.office365.com'))) {
    
    console.log('Outlook page detected in tab:', tabId);
    
    // Update the extension icon to indicate an active Outlook page
    chrome.action.setIcon({
      path: {
        16: "icon.png",
        48: "icon.png",
        128: "icon.png"
      },
      tabId: tabId
    });
    
    // We don't need to execute the content script manually here
    // because it's already injected via the manifest.json content_scripts
  }
});
