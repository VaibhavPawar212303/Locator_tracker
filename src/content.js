// This script will run on all web pages
console.log('Content script loaded');

// Example of tracking a click event on the page
document.addEventListener('click', (event) => {
  const clickedElement = event.target;
  console.log('Clicked element:', clickedElement);
  
  // Sending the clicked element data to the background or popup
  chrome.runtime.sendMessage({ action: 'elementClicked', element: clickedElement.outerHTML });
});

// You can track other events similarly (e.g., keypress, mouseover)
