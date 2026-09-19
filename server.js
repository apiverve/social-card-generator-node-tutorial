/**
 * Social Card Generator, an APIVerve template.
 *
 * Renders 1200×630 Open Graph images from a title, description and colors.
 * The API key stays on the server: the browser only ever talks to /api routes.
 *
 * HTML to Image: https://apiverve.com/marketplace/htmltoimage
 */

const express = require('express');
const path = require('path');

// Set APIVERVE_API_KEY in .env (local) or your host's environment variables.
// Get a free key at https://dashboard.apiverve.com
const API_KEY = process.env.APIVERVE_API_KEY;
const PORT = process.env.PORT || 3000;

// ============================================
// Rate limit
// Once deployed, anyone who finds this URL can call it with YOUR key.
// This caps each visitor at RATE_LIMIT requests per minute. It is kept in
// memory, so it resets on cold starts and isn't shared between instances:
// good enough for a demo. For production, use a shared store (e.g. Upstash
// Redis) or put the app behind your own auth.
// ============================================
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

/** Calls an APIVerve API and returns its data, or throws with its error message. */
async function callApi(api, { query, body } = {}) {
  const url = `https://api.apiverve.com/v1/${api}${query ? `?${new URLSearchParams(query)}` : ''}`;
  const res = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: { 'x-api-key': API_KEY, ...(body && { 'Content-Type': 'application/json' }) },
    body: body && JSON.stringify(body)
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.status !== 'ok') {
    const err = json?.error;
    const message = err?.missing ? `Missing: ${err.missing.join(', ')}` : typeof err === 'string' ? err : `APIVerve returned ${res.status}`;
    throw Object.assign(new Error(message), { status: res.status === 429 ? 429 : 502 });
  }
  return json.data;
}

/** A trimmed string, capped at max characters. */
const str = (v, max) => String(v ?? '').trim().slice(0, max);

const app = express();
app.use(express.json({ limit: '10kb' }));
// Serves the page locally. On Vercel, public/ is served from the CDN instead.
app.use(express.static(path.join(__dirname, 'public')));

// Every /api route needs the key, and counts against the visitor's limit.
app.use('/api', (req, res, next) => {
  if (!API_KEY) {
    return res.status(500).json({ error: 'Missing APIVERVE_API_KEY. Add it to .env, or to your host’s environment variables, then restart.' });
  }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'local';
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Wait a minute and try again.' });
  }
  next();
});

// The card is built here, not in the browser. Accepting raw HTML would let anyone
// render any page they like on your API key.
const HEX = /^#[0-9a-f]{6}$/i;
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.min(255, Math.max(0, v + amount));
  return '#' + ((c(n >> 16) << 16) | (c((n >> 8) & 0xff) << 8) | c(n & 0xff)).toString(16).padStart(6, '0');
}

function cardHtml({ title, description, author, bgColor, textColor }) {
  return `<!DOCTYPE html><html><head><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: linear-gradient(135deg, ${bgColor} 0%, ${shade(bgColor, -30)} 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column;
  justify-content: center; padding: 80px; color: ${textColor}; }
h1 { font-size: 64px; font-weight: 700; margin-bottom: 24px; line-height: 1.2; }
p { font-size: 32px; opacity: 0.9; margin-bottom: 40px; line-height: 1.4; }
.author { font-size: 24px; opacity: 0.7; display: flex; align-items: center; gap: 12px; }
.dot { width: 8px; height: 8px; background: ${textColor}; border-radius: 50%; opacity: 0.5; }
</style></head><body>
<h1>${esc(title)}</h1><p>${esc(description)}</p><div class="author"><span class="dot"></span>${esc(author)}</div>
</body></html>`;
}

// POST /api/generate { title, description, author, bgColor, textColor }
app.post('/api/generate', async (req, res) => {
  const fields = {
    title: str(req.body.title, 90) || 'Title',
    description: str(req.body.description, 160) || 'Description',
    author: str(req.body.author, 60) || 'Author',
    bgColor: HEX.test(req.body.bgColor) ? req.body.bgColor : '#667eea',
    textColor: HEX.test(req.body.textColor) ? req.body.textColor : '#ffffff'
  };

  try {
    const data = await callApi('htmltoimage', { body: { html: cardHtml(fields), width: 1200, height: 630, format: 'png' } });
    res.json({ success: true, imageUrl: data.downloadURL, width: 1200, height: 630, format: 'png' });
  } catch (err) {
    res.status(err.status || 502).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Social Card Generator running at http://localhost:${PORT}`);
});
