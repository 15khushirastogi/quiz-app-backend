const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// CRITICAL: Allow ALL origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use(express.json());

// Route to fetch quiz questions
app.get('/api/questions', async (req, res) => {
  try {
    const response = await axios.get('https://opentdb.com/api.php?amount=15');
    
    if (response.data.response_code !== 0) {
      return res.status(500).json({ 
        error: 'Failed to fetch questions from OpenTDB',
        details: 'API returned an error code'
      });
    }

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch questions',
      details: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date(),
    cors: 'enabled'
  });
});

// Root
app.get('/', (req, res) => {
  res.json({ 
    message: 'Quiz API Server is running',
    endpoints: ['/api/questions', '/api/health']
  });
});

module.exports = app;
