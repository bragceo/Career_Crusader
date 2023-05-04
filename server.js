// server.js

const express = require('express');
const { setupRoutes } = require('./controllers');

const app = express();

// Use JSON middleware
app.use(express.json());

// Set up routes
setupRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 
