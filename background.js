// background.js
chrome.runtime.onInstalled.addListener(() => {
    console.log('User Action Tracker extension installed.');
});

// Handle messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    chrome.windows.create({
        url: 'https://www.google.com', // Replace with the URL you want to open
        type: 'popup', // or 'normal' for a standard window
        width: 800, // Set the width of the new window
        height: 600 // Set the height of the new window
    }, (newWindow) => {
        console.log('New window created:', newWindow);
    });

    if (message.action === 'getActions') {
        chrome.storage.local.get('actions', function (data) {
            sendResponse(data.actions || []);
        });
        return true; // Indicates that response is asynchronous
    }
});

