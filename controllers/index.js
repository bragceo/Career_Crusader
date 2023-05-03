// Import the express module to work with routes and middleware
const express = require('express');
// Import the userController from the userController.js file
const userController = require('./userController');
// Import the jobController from the jobController.js file
const jobController = require('./jobController');

// Export an object containing the userController, jobController, and the setupRoutes function
module.exports = {
  // Add the userController to the exported object
  userController,
  // Add the jobController to the exported object
  jobController,
  // Define a function called setupRoutes that takes the app (Express application) as an argument
  // This function is responsible for setting up the routes in the application
  setupRoutes: (app) => {
    // Tell the Express application to use the userController for all routes starting with /api/users
    app.use('/api/users', userController);
    // Tell the Express application to use the jobController for all routes starting with /api/jobs
    app.use('/api/jobs', jobController);
  },
};

