const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 2333;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Example Route
app.get('/', (req, res) => {
  res.send('Hello, this is the backend for your React Native app!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
