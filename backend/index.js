const express = require('express');
const cors = require('cors');

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// start server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});