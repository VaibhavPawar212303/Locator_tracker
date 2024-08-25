const express = require('express');
const axios = require('axios');
const { parse } = require('node-html-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Fetch and serve web application content
app.get('/fetch', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('URL is required');
    }

    try {
        // Configure Axios to include User-Agent header
        const axiosConfig = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };

        // Fetch the main HTML content from the provided URL
        const response = await axios.get(targetUrl, axiosConfig);
        let html = response.data;

        // Parse HTML to extract CSS, JS, and image links
        const root = parse(html);
        const cssLinks = root.querySelectorAll('link[rel="stylesheet"]');
        const jsLinks = root.querySelectorAll('script[src]');
        const imgLinks = root.querySelectorAll('img[src]');

        // Inline CSS, JS, and handle images
        html = await inlineResources(html, cssLinks, jsLinks, imgLinks, targetUrl);

        // Clean up unwanted content
        html = cleanUpHTML(html);

        res.send(html);
    } catch (error) {
        console.error('Error fetching the URL:', error.message);
        res.status(error.response?.status || 500).send('Error fetching the URL');
    }
});

// Helper function to fetch and inline CSS, JS, and handle images
async function inlineResources(html, cssLinks, jsLinks, imgLinks, baseUrl) {
    const promises = [];
    const processedImages = new Set(); // To track processed image URLs

    // Add base tag to resolve relative URLs
    if (!html.includes('<base href="')) {
        html = `<base href="${baseUrl}">\n` + html;
    }

    // Inline CSS
    cssLinks.forEach(link => {
        if (link.getAttribute('href')) {
            const cssUrl = new URL(link.getAttribute('href'), baseUrl).href;
            promises.push(
                axios.get(cssUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }).then(response => {
                    const css = `<style>${response.data}</style>`;
                    html = html.replace(link.outerHTML, css);
                }).catch(err => console.error(`Error fetching CSS ${cssUrl}: ${err.message}`))
            );
        }
    });

    // Inline JS
    jsLinks.forEach(script => {
        if (script.getAttribute('src')) {
            const jsUrl = new URL(script.getAttribute('src'), baseUrl).href;
            promises.push(
                axios.get(jsUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }).then(response => {
                    const js = `<script>${response.data}</script>`;
                    html = html.replace(script.outerHTML, js);
                }).catch(err => console.error(`Error fetching JS ${jsUrl}: ${err.message}`))
            );
        }
    });

    // Handle Images
    imgLinks.forEach(img => {
        if (img.getAttribute('src')) {
            const imgUrl = new URL(img.getAttribute('src'), baseUrl).href;
            if (!processedImages.has(imgUrl)) { // Check if image is already processed
                processedImages.add(imgUrl); // Mark as processed
                promises.push(
                    axios.get(imgUrl, { responseType: 'arraybuffer', headers: { 'User-Agent': 'Mozilla/5.0' } }).then(response => {
                        const imgBase64 = Buffer.from(response.data, 'binary').toString('base64');
                        const imgSrc = `data:${response.headers['content-type']};base64,${imgBase64}`;
                        html = html.replace(img.outerHTML, `<img src="${imgSrc}" />`);
                    }).catch(err => console.error(`Error fetching image ${imgUrl}: ${err.message}`))
                );
            }
        }
    });

    await Promise.all(promises);
    return html;
}

// Helper function to clean up unwanted content
function cleanUpHTML(html) {
    // Remove unwanted embedded data
    html = html.replace(/(?:[^'\\]|\\[\s\S])*\/(?:[^'\\]|\\[\s\S])*\/,/g, ''); // Adjust the pattern as needed
    html = html.replace(/(?:[^'\\]|\\[\s\S])*'(?:[^'\\]|\\[\s\S])*'/g, ''); // Adjust the pattern as needed
    html = html.replace(/(?:[^'\\]|\\[\s\S])*"(?:[^'\\]|\\[\s\S])*"/g, ''); // Adjust the pattern as needed
    html = html.replace(/<script[^>]*>.*?<\/script>/gis, ''); // Remove all script tags
    html = html.replace(/<style[^>]*>.*?<\/style>/gis, ''); // Remove all style tags
    html = html.replace(/<!--.*?-->/g, ''); // Remove comments

    return html;
}

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
