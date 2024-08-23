let openedTabId = null;

chrome.action.onClicked.addListener(() => {
    // Open a new tab when the extension icon is clicked
    chrome.tabs.create({ url: 'https://www.google.com' }, function(tab) {
        openedTabId = tab.id; // Store the ID of the newly opened tab
    });
});

// Listen for messages from the popup to open or close tabs
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "open_new_tab") {
        chrome.tabs.create({ url: 'https://www.google.com' }, function(tab) {
            openedTabId = tab.id; // Store the ID of the newly opened tab
            sendResponse({status: "New tab opened"});
        });
        return true; // Keep the message channel open for sendResponse
    } else if (request.message === "close_tab" && openedTabId !== null) {
        chrome.tabs.remove(openedTabId, function() {
            sendResponse({status: "Tab closed"});
            openedTabId = null; // Reset the openedTabId after closing
        });
        return true; // Keep the message channel open for sendResponse
    }
});
