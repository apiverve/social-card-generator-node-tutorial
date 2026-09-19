# Social Card Generator | APIVerve Template

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933)](package.json)
[![Express](https://img.shields.io/badge/Express-4-000000)](package.json)
[![APIVerve | HTML to Image](https://img.shields.io/badge/APIVerve-HTML_to_Image-purple)](https://apiverve.com/marketplace/htmltoimage?utm_source=github&utm_medium=template&utm_campaign=social-card-generator-node-tutorial)

Make the preview image that shows when your link is shared. Enter a title, a description and your brand colors, preview it live, and download a 1200×630 PNG ready for Open Graph and X cards.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fapiverve%2Fsocial-card-generator-node-tutorial&project-name=social-card-generator&repository-name=social-card-generator&env=APIVERVE_API_KEY&envDescription=Your%20APIVerve%20API%20key.%20Free%20to%20create%2C%20no%20card%20needed.&envLink=https%3A%2F%2Fdashboard.apiverve.com%2Fsignup%3Fapi%3Dhtmltoimage%26utm_source%3Dvercel%26utm_medium%3Dtemplate%26utm_campaign%3Dsocial-card-generator-node-tutorial)

![Social Card Generator previewing and rendering a blog post card](https://raw.githubusercontent.com/apiverve/social-card-generator-node-tutorial/main/screenshot.png)

---

### Get your free API key

This template needs an APIVerve API key. **[Sign up free](https://dashboard.apiverve.com/signup?api=htmltoimage&utm_source=github&utm_medium=template&utm_campaign=social-card-generator-node-tutorial)**, no credit card required.

---

## Deploy in one click

Click **Deploy with Vercel** above. Vercel copies this repo to your GitHub account, asks for your `APIVERVE_API_KEY`, and gives you a live URL about a minute later.

## Run it locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/apiverve/social-card-generator-node-tutorial.git
   cd social-card-generator-node-tutorial
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your API key**
   ```bash
   cp .env.example .env
   ```
   Then open `.env` and set `APIVERVE_API_KEY`.

4. **Start the server**
   ```bash
   npm run dev
   ```

5. **Open** `http://localhost:3000`

## How it works

1. The page in `public/index.html` calls `POST /api/generate` on this server.
2. `server.js` checks the input, then calls HTML to Image. Your API key stays on the server and never reaches the browser.
3. The page shows the result.

The server builds the card's HTML from the fields, escaping every value, and never accepts raw HTML from the browser. Otherwise anyone could render any page they liked on your key. The page draws the same card in a scaled-down preview so you can see changes as you type.

```
├── server.js            # Express: the /api route that calls APIVerve
├── public/index.html    # The page (HTML, CSS and JavaScript)
├── .env.example         # Copy to .env and add your key
└── package.json
```

### The API call

```javascript
const res = await fetch('https://api.apiverve.com/v1/htmltoimage', {
  method: 'POST',
  headers: { 'x-api-key': process.env.APIVERVE_API_KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({ html: cardHtml(fields), width: 1200, height: 630, format: 'png' })
});
const { data } = await res.json();
// data.downloadURL → the rendered PNG
```

The download link the API returns expires, so save the image if you need to keep it.

## Before you share your URL

Once deployed, anyone who finds your URL can use it on your API key. Each visitor can make 10 requests a minute, which is fine for a demo. The limit is kept in memory, so it isn't shared between serverless instances. For production:

- Put the page behind your own sign-in, or
- Move the limit to a shared store such as [Upstash Redis](https://upstash.com/), or
- Call the route only from your own backend.

## Ideas to extend it

- Generate a card for every blog post when it's published
- Add your logo and a background photo to `cardHtml()` in `server.js`
- Serve the image from your own storage and point `og:image` at it

## API reference

- [HTML to Image](https://apiverve.com/marketplace/htmltoimage?utm_source=github&utm_medium=template&utm_campaign=social-card-generator-node-tutorial): `POST https://api.apiverve.com/v1/htmltoimage`
- [Full documentation](https://docs.apiverve.com?utm_source=github&utm_medium=template&utm_campaign=social-card-generator-node-tutorial)

## Tech stack

- **Node.js 20+** and **Express 4**
- Plain HTML, CSS and JavaScript, no build step
- Deploys to Vercel as-is: `server.js` becomes one function and `public/` is served from the CDN

## License

MIT. See [LICENSE](LICENSE).
