/**
 * Social Card Generator - Tutorial Example
 *
 * A simple Express server for generating social media cards using the APIVerve API.
 * https://apiverve.com/marketplace/htmltoimage
 */

const express = require('express');
const path = require('path');

// ============================================
// CONFIGURATION - Add your API key here
// Get a free key at: https://dashboard.apiverve.com
// ============================================
const API_KEY = process.env.API_KEY || 'your-api-key-here';
const API_URL = 'https://api.apiverve.com/v1/htmltoimage';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(express.static('public'));

// API endpoint to generate social card image
app.post('/api/generate', async (req, res) => {
  const { html, width = 1200, height = 630, format = 'png' } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'HTML content is required' });
  }

  if (API_KEY === 'your-api-key-here') {
    return res.status(500).json({
      error: 'API key not configured. Set API_KEY environment variable or edit server.js'
    });
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        html,
        width,
        height,
        format
      })
    });

    const result = await response.json();

    if (result.status === 'ok') {
      res.json({
        success: true,
        imageUrl: result.data.downloadURL,
        width,
        height,
        format
      });
    } else {
      res.status(400).json({ error: result.error || 'Generation failed' });
    }
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  Social Card Generator running at http://localhost:${PORT}\n`);
});
