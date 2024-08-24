chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed");
  });
  
  // Optional: Add listeners for tab actions or other background tasks
  chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  });
  