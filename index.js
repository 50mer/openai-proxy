const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

// Enable CORS for all origins
app.use(cors({
  origin: '*', // For development, you can use '*'. For production, specify your domains
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Proxy endpoint for OpenAI API
app.post('/api/openai', async (req, res) => {
  try {
    console.log('Received request:', JSON.stringify(req.body).substring(0, 200) + '...');
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', req.body, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('OpenAI response status:', response.status);
    
    res.json(response.data);
  } catch (error) {
    console.error('Error calling OpenAI API:', error.message);
    
    if (error.response) {
      console.error('OpenAI API error status:', error.response.status);
      console.error('OpenAI API error data:', error.response.data);
      
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: { message: error.message } });
    }
  }
});

// Simple health check endpoint
app.get('/', (req, res) => {
  res.send('OpenAI proxy is running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
