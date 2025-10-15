const express = require('express');
const axios = require('axios');

const app = express();

// Manual CORS headers - BEFORE any routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

// Questions endpoint
app.get('/api/questions', async (req, res) => {
  try {
    const response = await axios.get('https://opentdb.com/api.php?amount=15');
    
    if (response.data.response_code !== 0) {
      return res.status(500).json({ 
        error: 'Failed to fetch questions',
        details: 'API returned error'
      });
    }

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch questions',
      details: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Root
app.get('/', (req, res) => {
  res.json({ 
    message: 'Quiz API Server',
    version: '1.0',
    endpoints: {
      health: '/api/health',
      questions: '/api/questions'
    }
  });
});

// Export for Vercel
module.exports = app;
