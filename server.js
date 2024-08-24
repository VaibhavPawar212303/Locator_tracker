const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const urlModule = require('url');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

const trackingData = []; // Array to store tracking data

app.get('/', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const response = await axios.get(url);
        const baseUrl = urlModule.parse(url).protocol + '//' + urlModule.parse(url).host;
        const fetchedHtml = response.data;

        // Load HTML into cheerio for manipulation
        const $ = cheerio.load(fetchedHtml);

        // Update relative URLs for CSS and other assets
        $('link[rel="stylesheet"]').each((index, element) => {
            const href = $(element).attr('href');
            if (href && !href.startsWith('http') && !href.startsWith('//')) {
                $(element).attr('href', urlModule.resolve(baseUrl, href));
            }
        });

        $('script').each((index, element) => {
            const src = $(element).attr('src');
            if (src && !src.startsWith('http') && !src.startsWith('//')) {
                $(element).attr('src', urlModule.resolve(baseUrl, src));
            }
        });

        $('img').each((index, element) => {
            const src = $(element).attr('src');
            if (src && !src.startsWith('http') && !src.startsWith('//')) {
                $(element).attr('src', urlModule.resolve(baseUrl, src));
            }
        });

        // Send the response that opens the URL in a new "minimized" window
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Opening Minimized Window</title>
                <script>
                    window.onload = function() {
                        window.open("${url}", "_blank", "width=12000,height=1000,left=-10000,top=-10000");
                    };
                </script>
            </head>
            <body>
                <h1>The content is being opened in a minimized window...</h1>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error fetching the URL:', error);
        res.status(500).send('Error fetching the URL');
    }
});

// Endpoint to receive tracking data
app.post('/track', (req, res) => {
    console.log('Received tracking data:', req.body); // Log received data for debugging
    trackingData.push(req.body); // Store the tracking data
    res.status(200).send('Tracking data received');
});

// Endpoint to retrieve tracking data
app.get('/tracking-data', (req, res) => {
    res.json(trackingData); // Return the array of tracking data
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
