// Open a new tab when the "Open New Tab" button is clicked
document.getElementById('open-tab').addEventListener('click', () => {
    chrome.runtime.sendMessage({message: "open_new_tab"}, function(response) {
        console.log(response.status); // Log the response from the background script
    });
});

// Close the newly opened tab when the "Close New Tab" button is clicked
document.getElementById('close-tab').addEventListener('click', () => {
    chrome.runtime.sendMessage({message: "close_tab"}, function(response) {
        console.log(response.status); // Log the response from the background script
    });
});
