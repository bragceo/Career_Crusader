// Import required modules
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

// Get the name of the current file (basename)
const basename = path.basename(__filename);

// Set the environment to either the value of the NODE_ENV environment variable or 'development' if not set
const env = process.env.NODE_ENV || 'development';

// Read the database configuration from the config.json file based on the current environment (e.g., development, production)
const config = require(__dirname + '/../config/config.json')[env];

// Create an empty object named 'db' to hold the Sequelize models and other related properties
const db = {};


