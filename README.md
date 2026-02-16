# Social Card Generator | APIVerve API Tutorial

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-000000)](https://expressjs.com)
[![APIVerve | HTML to Image](https://img.shields.io/badge/APIVerve-HTML_to_Image-purple)](https://apiverve.com/marketplace/htmltoimage?utm_source=github&utm_medium=tutorial&utm_campaign=social-card-generator-node-tutorial)

A Node.js web app for generating social media cards (Open Graph images). Design cards with custom colors, text, and templates, then export as PNG.

![Screenshot](https://raw.githubusercontent.com/apiverve/social-card-generator-node-tutorial/main/screenshot.jpg)

---

### Get Your Free API Key

This tutorial requires an APIVerve API key. **[Sign up free](https://dashboard.apiverve.com?utm_source=github&utm_medium=tutorial&utm_campaign=social-card-generator-node-tutorial)** - no credit card required.

---

## Features

- Visual card editor with live preview
- Custom title, description, and author
- Color picker for background and text
- Pre-built templates (Blog, Product, Event)
- Standard OG image size (1200x630)
- Download as PNG
- Built with Express.js

## Quick Start

1. **Clone this repository**
   ```bash
   git clone https://github.com/apiverve/social-card-generator-node-tutorial.git
   cd social-card-generator-node-tutorial
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your API key**

   Set environment variable or edit `server.js`:
   ```bash
   export API_KEY=your-api-key-here
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open in browser**

   Visit http://localhost:3000 and create social cards!

## Project Structure

```
social-card-generator-node-tutorial/
├── server.js           # Express server & API endpoint
├── public/
│   └── index.html      # Frontend editor UI
├── package.json        # Dependencies
├── screenshot.jpg      # Preview image
├── LICENSE             # MIT license
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## How It Works

1. User designs card in visual editor
2. Editor generates HTML with styles
3. Frontend sends HTML to `/api/generate`
4. Server calls HTML to Image API
5. API renders HTML and returns image URL
6. User downloads the generated PNG

### The API Call

```javascript
const response = await fetch('https://api.apiverve.com/v1/htmltoimage', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  },
  body: JSON.stringify({
    html: '<html>...</html>',
    width: 1200,
    height: 630,
    format: 'png'
  })
});
```

## API Reference

**Endpoint:** `POST https://api.apiverve.com/v1/htmltoimage`

**Request Body:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `html` | string | Yes | HTML code to render |
| `width` | number | No | Image width (default: 1280) |
| `height` | number | No | Image height (default: 800) |
| `format` | string | No | Output format: png, jpeg, webp |

**Example Response:**

```json
{
  "status": "ok",
  "error": null,
  "data": {
    "downloadUrl": "https://storage.apiverve.com/images/abc123.png"
  }
}
```

## Social Card Sizes

| Platform | Size |
|----------|------|
| Open Graph (Facebook, LinkedIn) | 1200 x 630 |
| Twitter Card | 1200 x 600 |
| Pinterest | 1000 x 1500 |

## Use Cases

- **Blog posts** - Generate OG images for articles
- **Product launches** - Create announcement cards
- **Events** - Design event share images
- **Marketing** - Build campaign visuals
- **Documentation** - Generate doc previews
- **Email headers** - Create email banner images

## Customization Ideas

- Add image/logo upload
- Save templates to database
- Add more card layouts
- Support custom fonts
- Add icon library
- Batch generation for multiple posts

## Related APIs

Explore more APIs at [APIVerve](https://apiverve.com/marketplace?utm_source=github&utm_medium=tutorial&utm_campaign=social-card-generator-node-tutorial):

- [HTML to PDF](https://apiverve.com/marketplace/htmltopdf?utm_source=github&utm_medium=tutorial&utm_campaign=social-card-generator-node-tutorial) - Convert HTML to PDF
- [Markdown to Image](https://apiverve.com/marketplace/markdowntoimage?utm_source=github&utm_medium=tutorial&utm_campaign=social-card-generator-node-tutorial) - Convert Markdown to image
- [Website Screenshot](https://apiverve.com/marketplace/webscreenshots?utm_source=github&utm_medium=tutorial&utm_campaign=social-card-generator-node-tutorial) - Capture website screenshots

## License

MIT - see [LICENSE](LICENSE)

## Links

- [Get API Key](https://dashboard.apiverve.com?utm_source=github&utm_medium=tutorial&utm_campaign=social-card-generator-node-tutorial) - Sign up free
- [APIVerve Marketplace](https://apiverve.com/marketplace?utm_source=github&utm_medium=tutorial&utm_campaign=social-card-generator-node-tutorial) - Browse 300+ APIs
- [HTML to Image API](https://apiverve.com/marketplace/htmltoimage?utm_source=github&utm_medium=tutorial&utm_campaign=social-card-generator-node-tutorial) - API details
