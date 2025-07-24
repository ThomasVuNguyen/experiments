// popup.js - Script for the popup UI

document.addEventListener('DOMContentLoaded', function() {
  const statusElement = document.getElementById('status');
  const pageInfoElement = document.getElementById('page-info');
  const domStructureElement = document.getElementById('dom-structure');
  const htmlSampleElement = document.getElementById('html-sample');
  const timestampElement = document.getElementById('timestamp');
  const refreshButton = document.getElementById('refresh-btn');
  const tabsContainer = document.getElementById('tabs-container');
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const searchBox = document.getElementById('search-box');
  const clearSearchBtn = document.getElementById('clear-search');
  
  // Store the original DOM structure and HTML sample
  let originalDomStructure = '';
  let originalHtmlSample = '';

  // Set up tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and tab contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      const contentId = tab.getAttribute('data-tab');
      document.getElementById(contentId).classList.add('active');
    });
  });
  
  // Set up clear search button
  clearSearchBtn.addEventListener('click', function() {
    searchBox.value = '';
    // Restore original content
    domStructureElement.innerHTML = `<pre>${originalDomStructure}</pre>`;
    htmlSampleElement.innerHTML = `<pre>${originalHtmlSample}</pre>`;
    // Focus back on search box
    searchBox.focus();
  });
  
  // Set up search functionality
  searchBox.addEventListener('input', function() {
    const searchTerm = searchBox.value.toLowerCase();
    
    // If search term is empty, restore original content
    if (!searchTerm) {
      domStructureElement.innerHTML = `<pre>${originalDomStructure}</pre>`;
      htmlSampleElement.innerHTML = `<pre>${originalHtmlSample}</pre>`;
      return;
    }
    
    // Search in DOM structure
    if (originalDomStructure) {
      const lines = originalDomStructure.split('\n');
      const matchedLines = [];
      
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(searchTerm)) {
          // Add the matching line with some context (2 lines before and after)
          const startLine = Math.max(0, index - 2);
          const endLine = Math.min(lines.length - 1, index + 2);
          
          if (matchedLines.length > 0 && startLine <= matchedLines[matchedLines.length - 1].end + 1) {
            // Extend the previous match group
            matchedLines[matchedLines.length - 1].end = endLine;
          } else {
            // Create a new match group
            matchedLines.push({ start: startLine, end: endLine, match: index });
          }
        }
      });
      
      if (matchedLines.length > 0) {
        let highlightedContent = '';
        
        matchedLines.forEach((match, idx) => {
          if (idx > 0) highlightedContent += '\n...\n';
          
          for (let i = match.start; i <= match.end; i++) {
            const line = lines[i];
            if (i === match.match) {
              // Highlight the matching line
              highlightedContent += `<span style="background-color: #ffff00; font-weight: bold;">${escapeHtml(line)}</span>\n`;
            } else {
              highlightedContent += escapeHtml(line) + '\n';
            }
          }
        });
        
        domStructureElement.innerHTML = `<pre>${highlightedContent}</pre>`;
      } else {
        domStructureElement.innerHTML = `<pre>No matches found for "${searchTerm}"</pre>`;
      }
    }
    
    // Search in HTML sample
    if (originalHtmlSample) {
      const htmlContent = originalHtmlSample;
      if (htmlContent.toLowerCase().includes(searchTerm)) {
        const regex = new RegExp(`(.{0,50})(${escapeRegExp(searchTerm)})(.{0,50})`, 'gi');
        let match;
        let highlightedHtml = '';
        let lastIndex = 0;
        
        while ((match = regex.exec(htmlContent)) !== null) {
          const [fullMatch, before, term, after] = match;
          highlightedHtml += `...${escapeHtml(before)}<span style="background-color: #ffff00; font-weight: bold;">${escapeHtml(term)}</span>${escapeHtml(after)}...\n\n`;
        }
        
        htmlSampleElement.innerHTML = `<pre>${highlightedHtml || 'No matches found'}</pre>`;
      } else {
        htmlSampleElement.innerHTML = `<pre>No matches found for "${searchTerm}"</pre>`;
      }
    }
  });

  // Function to escape regex special characters
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Function to update the timestamp
  function updateTimestamp() {
    const now = new Date();
    timestampElement.textContent = `Last updated: ${now.toLocaleTimeString()}`;
  }

  // Function to display content in the popup
  function displayContent(data) {
    // Update status
    if (data.isOutlookPage) {
      statusElement.className = 'status active';
      statusElement.innerHTML = '<p>✅ Outlook page detected</p>';
    } else {
      statusElement.className = 'status inactive';
      statusElement.innerHTML = '<p>❌ Not an Outlook page</p>';
    }

    // Update page info
    if (data.pageInfo) {
      let pageInfoHtml = '';
      pageInfoHtml += `<p><strong>Title:</strong> ${data.pageInfo.title || 'N/A'}</p>`;
      pageInfoHtml += `<p><strong>URL:</strong> ${data.pageInfo.url || 'N/A'}</p>`;
      pageInfoElement.innerHTML = pageInfoHtml;
    } else {
      pageInfoElement.innerHTML = '<p class="no-content">No page information available</p>';
    }

    // Update DOM structure
    if (data.domStructure) {
      originalDomStructure = escapeHtml(data.domStructure);
      domStructureElement.innerHTML = `<pre>${originalDomStructure}</pre>`;
    } else {
      originalDomStructure = '';
      domStructureElement.innerHTML = '<p class="no-content">No DOM structure available</p>';
    }

    // Update HTML sample
    if (data.htmlSample) {
      originalHtmlSample = escapeHtml(data.htmlSample);
      htmlSampleElement.innerHTML = `<pre>${originalHtmlSample}</pre>`;
    } else {
      originalHtmlSample = '';
      htmlSampleElement.innerHTML = '<p class="no-content">No HTML sample available</p>';
    }

    updateTimestamp();
  }

  // Helper function to escape HTML
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Function to get the current tab
  async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  // Function to check if the current page is an Outlook page
  function isOutlookPage(url) {
    return url && (
      url.includes('outlook.live.com') || 
      url.includes('outlook.office.com') || 
      url.includes('outlook.office365.com')
    );
  }

  // Function to extract content from the current tab
  async function extractContent() {
    try {
      const tab = await getCurrentTab();
      const isOutlook = isOutlookPage(tab.url);
      
      if (isOutlook) {
        // Execute content script to extract data
        chrome.tabs.sendMessage(tab.id, { action: "getContent" }, function(response) {
          if (response) {
            // Store the data and update the popup
            chrome.storage.local.set({ outlookData: response }, function() {
              displayContent({
                isOutlookPage: true,
                pageInfo: {
                  title: response.pageTitle,
                  url: response.pageUrl
                },
                domStructure: response.domStructure,
                htmlSample: response.htmlSample
              });
            });
          } else {
            // If no response, the content script might not be ready
            displayContent({
              isOutlookPage: true,
              pageInfo: {
                title: tab.title,
                url: tab.url
              },
              domStructure: "Error: No response from content script. Try refreshing the page.",
              htmlSample: null
            });
          }
        });
      } else {
        // Not an Outlook page
        displayContent({
          isOutlookPage: false,
          pageInfo: {
            title: tab.title,
            url: tab.url
          },
          domStructure: null,
          htmlSample: null
        });
      }
    } catch (error) {
      console.error("Error extracting content:", error);
      displayContent({
        isOutlookPage: false,
        pageInfo: null,
        domStructure: `Error: ${error.toString()}`,
        htmlSample: null
      });
    }
  }

  // Check if we have stored data
  chrome.storage.local.get(['outlookData'], function(result) {
    if (result.outlookData) {
      // Use stored data
      displayContent({
        isOutlookPage: true,
        pageInfo: {
          title: result.outlookData.pageTitle,
          url: result.outlookData.pageUrl
        },
        domStructure: result.outlookData.domStructure,
        htmlSample: result.outlookData.htmlSample
      });
    } else {
      // No stored data, extract fresh content
      extractContent();
    }
  });

  // Add event listener for refresh button
  refreshButton.addEventListener('click', function() {
    refreshButton.textContent = "Refreshing...";
    refreshButton.disabled = true;
    searchBox.value = ''; // Clear search box on refresh
    
    extractContent();
    
    setTimeout(() => {
      refreshButton.textContent = "Refresh Content";
      refreshButton.disabled = false;
    }, 1000);
  });
});
