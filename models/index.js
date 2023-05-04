// Import the required modules
import fs from 'fs';

import path from 'path';
import Sequelize from 'sequelize';

// Get the filename of the current file (index.js)
const basename = path.basename(__filename);

// Set the environment to use ('development' by default)


// Import the configuration for the current environment from the config.json file
import { DATABASE_CONFIG } from '../config/config.js';

import mysql from 'mysql2';
console.log(DATABASE_CONFIG)
// const config = ConfigBase[env];

// ****************** Create the database if not exist
// ************************************************* //

// Open the connection to MySQL server
const connection = mysql.createConnection({
	host: DATABASE_CONFIG.host,
	user: DATABASE_CONFIG.username,
	password: DATABASE_CONFIG.password,

});

// Run create database statement
connection.query(`CREATE DATABASE IF NOT EXISTS ${DATABASE_CONFIG.database}`, function (err, results) {
	if (!err) {
		console.log(
			'\x1b[42m%s\x1b[0m',
			`Database ${DATABASE_CONFIG.database} created successfully on http://localhost/phpmyadmin`
		);
	} else {
		console.log(err);
	}
});

// Close the connection
connection.end();
// ****************** Create the database if not exist
// ************************************************* //

// Initialize an empty object to store the models
const db = {};

// Create a Sequelize instance based on the environment configuration
let sequelize;

sequelize = new Sequelize('database','username','password',DATABASE_CONFIG);


// Read all files in the current directory (models)
fs.readdirSync(__dirname)
	.filter((file) => {
		return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
	})
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
	});

// Iterate over the models in the db object
Object.keys(db).forEach((modelName) => {
	// If a model has an associate method, call it to set up relationships between models
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

// Add the Sequelize instance and the Sequelize constructor to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export the db object, which now contains all the models and their relationships
export default db;
