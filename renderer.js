async function fetchContent() {
    const url = document.getElementById('urlInput').value;
    if (url) {
      document.getElementById('content-container').innerHTML = `Fetching content from <a href="${url}" target="_blank">${url}</a>`;
    }
  }
  