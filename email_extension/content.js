// content.js - Script that runs on Outlook webpages

console.log('Outlook Content Reader: Extension activated on this page');

/**
 * Function to extract DOM structure from the page
 */
function extractPageDOM() {
  console.log('Outlook Content Reader: Extracting page DOM structure');
  
  // Data object to store extracted content
  const extractedData = {
    pageTitle: document.title,
    pageUrl: window.location.href,
    timestamp: new Date().toISOString(),
    domStructure: '',
    htmlSample: ''
  };
  
  // Get a simplified representation of the DOM structure
  function getDomStructure(element, depth = 0) {
    if (!element) return '';
    if (depth > 10) return ''; // Limit depth to avoid infinite recursion
    
    const indent = '  '.repeat(depth);
    let result = '';
    
    // Get element tag name and some key attributes
    const tagName = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const classes = element.className && typeof element.className === 'string' ? 
                    `.${element.className.split(' ').join('.')}` : '';
    const role = element.getAttribute('role') ? `[role="${element.getAttribute('role')}"]` : '';
    const ariaLabel = element.getAttribute('aria-label') ? 
                      `[aria-label="${element.getAttribute('aria-label')}"]` : '';
    
    // Create a string representation of this element
    result += `${indent}<${tagName}${id}${classes}${role}${ariaLabel}>\n`;
    
    // Process children (limit to first 5 children at each level to avoid huge output)
    const children = Array.from(element.children).slice(0, 5);
    for (const child of children) {
      result += getDomStructure(child, depth + 1);
    }
    
    if (children.length < element.children.length) {
      result += `${indent}  ... (${element.children.length - children.length} more children)\n`;
    }
    
    return result;
  }
  
  // Get DOM structure starting from body
  extractedData.domStructure = getDomStructure(document.body);
  
  // Get a sample of the raw HTML
  extractedData.htmlSample = document.body.innerHTML.substring(0, 5000) + 
                            (document.body.innerHTML.length > 5000 ? '...' : '');
  
  // Store the extracted data in Chrome storage for the popup to access
  chrome.storage.local.set({ outlookData: extractedData }, function() {
    console.log('DOM structure saved to storage');
  });
  
  return extractedData;
}

// Run the extraction immediately when the content script loads
const initialData = extractPageDOM();

// Also run extraction when the page is fully loaded
window.addEventListener('load', function() {
  console.log('Page fully loaded, re-extracting DOM');
  extractPageDOM();
});

// Add a delayed extraction to catch dynamically loaded content
setTimeout(() => {
  console.log('Delayed extraction running after 2 seconds');
  extractPageDOM();
}, 2000);

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getContent") {
    // Extract fresh content and send it back to the popup
    const freshData = extractPageDOM();
    sendResponse(freshData);
  }
  return true;
});
