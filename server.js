// server.js

import express from 'express';
import * as sequelize from './models/index.js';
import { setupRoutes } from './controllers/index.js';

const app = express();

// Use JSON middleware
app.use(express.json());

// Set up routes
setupRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
