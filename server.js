const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://quiz-app-frontend-jxnlvixqw-khushi-rastogis-projects-5e58af8c.vercel.app/',  // Replace with your actual frontend URL
    'https://quiz-app-frontend-jxnlvixqw-khushi-rastogis-projects-5e58af8c.vercel.app/' // Allow preview deployments
  ],
  credentials: true
}));

// Route to fetch quiz questions from OpenTDB API
app.get('/api/questions', async (req, res) => {
  try {
    const response = await axios.get('https://opentdb.com/api.php?amount=15');
    
    // Check if API returned valid data
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

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Quiz API Server is running' });
});

// For Vercel serverless deployment
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
