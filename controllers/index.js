// Import the express module to work with routes and middleware
import express from 'express';

// Import the userController from the userController.js file
import userController from './userController.js';

// Import the jobController from the jobController.js file
import jobController from './jobController.js';

// Export an object containing the userController, jobController, and the setupRoutes function
export default {
	// Add the userController to the exported object
	userController,
	// Add the jobController to the exported object
	jobController,
};

// Define a function called setupRoutes that takes the app (Express application) as an argument
// This function is responsible for setting up the routes in the application
export const setupRoutes = (app) => {
	// Tell the Express application to use the userController for all routes starting with /api/users
	app.use('/api/users', userController);
	// Tell the Express application to use the jobController for all routes starting with /api/jobs
	app.use('/api/jobs', jobController);
};
