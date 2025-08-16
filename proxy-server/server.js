const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Store browser instance
let browser = null;

// Initialize browser
async function initBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
  }
  return browser;
}

// Proxy endpoint for fetching portal content
app.post('/proxy', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ 
        success: false, 
        error: 'URL is required' 
      });
    }

    console.log(`Fetching content for: ${url}`);

    const browser = await initBrowser();
    const page = await browser.newPage();
    
    // Set user agent to mimic real browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Set viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    // Navigate to the URL
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Get page content
    const content = await page.content();
    const title = await page.title();

    // Process the HTML to make it work within our portal
    const $ = cheerio.load(content);
    
    // Remove problematic elements
    $('script[src*="google-analytics"]').remove();
    $('script[src*="gtag"]').remove();
    $('script[src*="facebook"]').remove();
    
    // Convert relative URLs to absolute
    $('a[href^="/"]').each((i, el) => {
      const href = $(el).attr('href');
      $(el).attr('href', new URL(href, url).href);
    });
    
    $('img[src^="/"]').each((i, el) => {
      const src = $(el).attr('src');
      $(el).attr('src', new URL(src, url).href);
    });
    
    $('link[href^="/"]').each((i, el) => {
      const href = $(el).attr('href');
      $(el).attr('href', new URL(href, url).href);
    });

    // Add base tag for relative URLs
    $('head').prepend(`<base href="${url}">`);
    
    // Add custom CSS to ensure proper display
    $('head').append(`
      <style>
        body { 
          margin: 0 !important; 
          padding: 20px !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        * { 
          box-sizing: border-box !important; 
        }
        .portal-wrapper {
          max-width: 100% !important;
          overflow-x: auto !important;
        }
      </style>
    `);

    // Wrap content in portal wrapper
    $('body').wrapInner('<div class="portal-wrapper"></div>');

    await page.close();

    res.json({
      success: true,
      content: $.html(),
      url,
      title
    });

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      content: '',
      url: req.body.url || '',
      title: 'Error'
    });
  }
});

// Form submission endpoint
app.post('/proxy/form', async (req, res) => {
  try {
    const { url, formData } = req.body;
    
    console.log(`Submitting form to: ${url}`);

    const browser = await initBrowser();
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1200, height: 800 });
    
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Fill form fields
    for (const [field, value] of Object.entries(formData)) {
      try {
        await page.type(`input[name="${field}"], input[id="${field}"]`, value);
      } catch (e) {
        console.log(`Could not fill field: ${field}`);
      }
    }

    // Submit form (look for submit button or form)
    try {
      await Promise.race([
        page.click('input[type="submit"]'),
        page.click('button[type="submit"]'),
        page.keyboard.press('Enter')
      ]);
      
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    } catch (e) {
      console.log('Form submission method not found, trying Enter key');
    }

    const content = await page.content();
    const title = await page.title();
    const currentUrl = page.url();

    await page.close();

    res.json({
      success: true,
      content,
      url: currentUrl,
      title
    });

  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      content: '',
      url: req.body.url || '',
      title: 'Error'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down proxy server...');
  if (browser) {
    await browser.close();
  }
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});