const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple endpoint to check if server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Your OpenAI API endpoint
app.post('/api/openai', async (req, res) => {
  try {
    console.log('Received request:', JSON.stringify(req.body).slice(0, 200) + '...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    console.log('OpenAI response status:', response.status);
    
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
