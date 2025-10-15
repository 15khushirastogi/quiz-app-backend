const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Allow ALL origins temporarily to fix CORS
app.use(cors());

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
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Root
app.get('/', (req, res) => {
  res.json({ message: 'Quiz API Server is running' });
});

module.exports = app;
