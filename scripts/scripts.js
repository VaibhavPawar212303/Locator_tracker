let actionLog = [];

function logAction(action) {
  const logDiv = document.getElementById("actionLog");
  const newLog = document.createElement("div");
  newLog.className = "log-entry";

  // Format log entry without curly brackets
  const formattedAction = `
Action Type: ${action.action_type}
CSS Selector: ${action.css_selector || 'N/A'}
XPath: ${action.xpath || 'N/A'}
Text: ${action.text || 'N/A'}
ID: ${action.id || 'N/A'}
Class Name: ${action.class_name || 'N/A'}
  `;
  newLog.textContent = formattedAction.trim();
  
  logDiv.appendChild(newLog);
  logDiv.scrollTop = logDiv.scrollHeight; // Auto-scroll to the bottom
}

async function fetchContent() {
  const url = document.getElementById("urlInput").value;
  if (url) {
    try {
      const proxyUrl = `http://localhost:8000/proxy?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const text = await response.text();

      // Create shadow root
      const contentContainer = document.getElementById("content-container");
      contentContainer.innerHTML = ""; // Clear previous content
      const shadowRoot = contentContainer.attachShadow({ mode: "open" });

      // Inject fetched content into shadow DOM
      const wrapper = document.createElement("div");
      wrapper.innerHTML = text;
      shadowRoot.appendChild(wrapper);

      logAction({ action_type: "fetch", url: url });

      // Track clicks and inputs within shadow DOM
      wrapper.addEventListener("click", function (event) {
        const element = event.target;
        const actionDetail = getLocatorDetails(element, "click");
        actionLog.push(actionDetail);
        logAction(actionDetail);
      });

      wrapper.addEventListener("input", function (event) {
        const element = event.target;
        const actionDetail = getLocatorDetails(element, "input");
        actionLog.push(actionDetail);
        logAction({
          ...actionDetail,
          text: element.value,
        });
      });
    } catch (error) {
      logAction({
        action_type: "error",
        message: `Error fetching content from: ${url} - ${error.message}`,
      });
    }
  } else {
    logAction({
      action_type: "warning",
      message: "Please enter a URL.",
    });
  }
}

function getLocatorDetails(element, actionType) {
  const cssSelector = getCssSelector(element);
  const xpath = getXPath(element);
  const text = element.textContent.trim() || null;
  const id = element.id || null;
  const className = element.className || null;

  return {
    action_type: actionType,
    css_selector: cssSelector,
    xpath: xpath,
    text: text,
    id: id,
    class_name: className,
  };
}

function getCssSelector(element) {
  if (element.id) {
    return `#${element.id}`;
  }
  let path = "";
  for (; element && element.nodeType === Node.ELEMENT_NODE; element = element.parentNode) {
    let selector = element.nodeName.toLowerCase();
    if (element.id) {
      selector += `#${element.id}`;
      path = selector + (path ? " > " + path : "");
      break;
    } else {
      let sibling = element;
      let nth = 1;
      while ((sibling = sibling.previousElementSibling)) {
        nth++;
      }
      selector += `:nth-of-type(${nth})`;
    }
    path = selector + (path ? " > " + path : "");
  }
  return path;
}

function getXPath(element) {
  let path = "";
  for (; element && element.nodeType === Node.ELEMENT_NODE; element = element.parentNode) {
    let selector = element.nodeName.toLowerCase();
    if (element.id) {
      selector += `[@id="${element.id}"]`;
      path = selector + (path ? "/" + path : "");
      break;
    } else {
      let sibling = element;
      let nth = 1;
      while ((sibling = sibling.previousElementSibling)) {
        nth++;
      }
      selector += `[${nth}]`;
    }
    path = selector + (path ? "/" + path : "");
  }
  return "//" + path;
}

async function saveActions() {
  console.log(actionLog);
  const actions = actionLog.map((action) => ({
    action_type: action.action_type,
    css_selector: action.css_selector || null, // Ensure null if undefined
    xpath: action.xpath || null,
    text: action.text || null,
    id: action.id || null,
    class_name: action.class_name || null,
  }));

  try {
    const response = await fetch("http://localhost:8000/save_actions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ actions }), // Send actions array within an object
    });

    const result = await response.json();
    logAction({ action_type: "info", message: result.message });
  } catch (error) {
    logAction({
      action_type: "error",
      message: `Error saving actions: ${error.message}`,
    });
  }
}
