const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5000;

// Middleware to handle CORS for frontend requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// API route to fetch trivia questions
app.get('/api/trivia', async (req, res) => {
  try {
    const response = await axios.get('https://opentdb.com/api.php?amount=10&type=multiple');
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching trivia questions');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
