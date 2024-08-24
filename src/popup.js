// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'elementClicked') {
      const log = document.getElementById('log');
      const newLogEntry = document.createElement('div');
      newLogEntry.textContent = `Clicked Element: ${request.element}`;
      log.appendChild(newLogEntry);
    }
  });
  