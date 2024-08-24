const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to a sample page
  await page.goto('https://example.com');

  // Track clicks on the page
  await page.exposeFunction('logClick', (element) => {
    console.log('Clicked element:', element);
  });

  await page.evaluate(() => {
    document.addEventListener('click', (event) => {
      logClick(event.target.outerHTML);
    });
  });

  // Keep the browser open for interaction
})();
