document.getElementById('fetch-btn').addEventListener('click', () => {
    const url = document.getElementById('search-input').value;
    if (url) {
        // Fetch the content from the server
        fetch(`http://localhost:3000/fetch?url=${encodeURIComponent(url)}`)
            .then(response => response.text())
            .then(html => {
                // Create a Blob URL and set it as the src for the iframe
                const blob = new Blob([html], { type: 'text/html' });
                const blobUrl = URL.createObjectURL(blob);
                document.getElementById('content-frame').src = blobUrl;
            })
            .catch(error => console.error('Error fetching the URL:', error));
    } else {
        alert('Please enter a URL.');
    }
});
