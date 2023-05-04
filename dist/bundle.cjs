'use strict';

var express = require('express');
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var mysql = require('mysql2');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// config/config.js

const ConfigBase = {
	development: {
		username: 'root',
		password: 'Melnick34?',
		database: 'career_crusader',
		host: 'localhost',
		dialect: 'mysql',
	},
	// ... other environment configurations (e.g., test, production) if applicable
};

// Import the required modules

// Get the filename of the current file (index.js)
const basename = path.basename(__filename);

// Set the environment to use ('development' by default)
const env = process.env.NODE_ENV || 'development';

const config = ConfigBase[env];

// ****************** Create the database if not exist
// ************************************************* //

// Open the connection to MySQL server
const connection = mysql.createConnection({
	host: config.host,
	user: config.username,
	password: config.password,
});

// Run create database statement
connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database}`, function (err, results) {
	if (!err) {
		console.log(
			'\x1b[42m%s\x1b[0m',
			`Database ${config.database} created successfully on http://localhost/phpmyadmin`
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
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, config);
}

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

const authenticate = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

// models/user.js

// Export a function that takes sequelize and DataTypes as arguments
const User = (sequelize, DataTypes) => {
	// Define a User model using sequelize.define method
	const User = sequelize.define('User', {
		// Define username attribute with its properties
		userName: {
			type: DataTypes.STRING, // Set the data type of the username attribute to string
			allowNull: false, // Disallow null values for the username attribute
			unique: true, // Ensure that each username is unique (no duplicate username)
		},
		// Define email attribute with its properties
		email: {
			type: DataTypes.STRING, // Set the data type of the email attribute to string
			allowNull: false, // Disallow null values for the email attribute
			unique: true, // Ensure that each email is unique (no duplicate emails)
			validate: {
				isEmail: true, // Validate that the value is a valid email format
			},
		},
		// Define password attribute with its properties
		password: {
			type: DataTypes.STRING, // Set the data type of the password attribute to string
			allowNull: false, // Disallow null values for the password attribute
		},
		// Define retypePassword attribute with its properties
		retypePassword: {
			type: DataTypes.STRING, // Set the data type of the password attribute to string
			allowNull: false, // Disallow null values for the password attribute
			validate: {
				// Custom validation to check if the retypePassword value matches the password value
				isEqualTo: function (value) {
					if (value !== this.password) {
						throw new Error('Passwords do not match');
					}
				},
			},
		},
	});

	// Define associations between User model and other models
	User.associate = (models) => {
		// Define a one-to-many relationship between User and Job models
		User.hasMany(models.Job, {
			foreignKey: 'userId', // Define a foreign key 'userId' to associate the models
			as: 'jobs', // Define an alias 'jobs' for easier querying later
		});
	};

	// Return the User model
	return User;
};

// controllers/userController.js

const router$1 = express.Router();

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router$1.post('/register', async (req, res) => {
	const { email, password } = req.body;

	try {
		let user = await User.findOne({ where: { email } });

		if (user) {
			return res.status(400).json({ msg: 'User already exists' });
		}

		user = await User.create({
			email,
			password: bcrypt.hashSync(password, 10),
		});

		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
			if (err) throw err;
			res.json({ token });
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route   POST api/users/login
// @desc    Authenticate user and get token
// @access  Public
router$1.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		let user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(400).json({ msg: 'Invalid email or password' });
		}

		const isMatch = bcrypt.compareSync(password, user.password);

		if (!isMatch) {
			return res.status(400).json({ msg: 'Invalid email or password' });
		}

		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
			if (err) throw err;
			res.json({ token });
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route   GET api/users
// @desc    Get user by token
// @access  Private
router$1.get('/', authenticate, async (req, res) => {
	try {
		const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });

		if (!user) {
			return res.status(404).json({ msg: 'User not found' });
		}

		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// models/job.js

// Export a function that takes sequelize and DataTypes as arguments
const Job = (sequelize, DataTypes) => {
	// Define a Job model using sequelize.define method
	const Job = sequelize.define('Job', {
		// Define title attribute with its properties
		title: {
			// Set the data type of the job title attribute to string
			type: DataTypes.STRING,
			// Disallow null values for the job title attribute
			allowNull: false,
		},
		// Define field attribute with its properties
		field: {
			// Set the data type of the field attribute to an ENUM with allowed values
			type: DataTypes.ENUM('Engineering', 'Law', 'Construction', 'Education', 'Catering'),
			// Disallow null values for the field attribute
			allowNull: false,
		},
		// Define company attribute with its properties
		company: {
			// Set the data type of the company attribute to string
			type: DataTypes.STRING,
			// Disallow null values for the field attribute
			allowNull: false,
		},
		location: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		// Define description attribute with its properties
		description: {
			// Set the data type of the description attribute to text
			type: DataTypes.TEXT,
			// Disallow null values for the description attribute
			allowNull: false,
		},
		// Define requirements attribute with its properties
		requirements: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	});

	// Define associations between Job model and other models
	Job.associate = (models) => {
		// Define a one-to-many relationship between Job and User models
		Job.belongsTo(models.User, {
			foreignKey: 'userId', // Define a foreign key 'userId' to associate the models
			as: 'user', // Define an alias 'user' for easier querying later
		});
	};

	// Return the Job model
	return Job;
};

// Import required modules

// Create an Express router
const router = express.Router();

// @route   DELETE api/jobs/:id
// @desc    Delete a job by ID
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
	try {
		// Find the job by primary key (ID)
		const job = await Job.findByPk(req.params.id);

		// If the job is not found, return a 404 error
		if (!job) {
			return res.status(404).json({ msg: 'Job not found' });
		}

		// If the job's user ID doesn't match the authenticated user's ID, return a 401 error
		if (job.userId !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized' });
		}

		// Delete the job from the database
		await job.destroy();

		// Send a success message
		res.json({ msg: 'Job removed' });
	} catch (err) {
		// Log the error and return a 500 server error
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// Other routes were explained in the previous response.

// Import the express module to work with routes and middleware

// Define a function called setupRoutes that takes the app (Express application) as an argument
// This function is responsible for setting up the routes in the application
const setupRoutes = (app) => {
	// Tell the Express application to use the userController for all routes starting with /api/users
	app.use('/api/users', router$1);
	// Tell the Express application to use the jobController for all routes starting with /api/jobs
	app.use('/api/jobs', router);
};

// server.js

const app = express();

// Use JSON middleware
app.use(express.json());

// Set up routes
setupRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
