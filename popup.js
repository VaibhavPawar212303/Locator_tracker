// popup.js
document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({ action: 'getActions' }, function(actions) {
      const actionsContainer = document.getElementById('actions');
      actions.forEach(action => {
        const div = document.createElement('div');
        div.textContent = `${action.type} at ${action.locator} (timestamp: ${new Date(action.timestamp).toLocaleString()})`;
        actionsContainer.appendChild(div);
      });
    });
  });
  