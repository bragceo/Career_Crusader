'use strict';

var express = require('express');
var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');
var bcrypt = require('bcryptjs');
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var mysql = require('mysql2');

dotenv.config();

const DATABASE_CONFIG = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  host: process.env.HOST,
  dialect: process.env.DIALECT,
};

const APP_CONFIG = {
  port: process.env.PORT,
	jwtSecret:process.env.JWT_SECRET
};

const authenticate = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, APP_CONFIG.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Token is not valid" });
  }
};

// models/user.js

// Export a function that takes sequelize and DataTypes as arguments
const User$1 = (sequelize, DataTypes) => {
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
      },
				isEmail: true, // Validate that the value is a valid email format
		},
		// Define password attribute with its properties
		password: {
			type: DataTypes.STRING, // Set the data type of the password attribute to string
			allowNull: false, // Disallow null values for the password attribute
		},
	});

	// Define associations between User model and other models
	User.associate = (models) => {
		// Define a one-to-many relationship between User and Job models
		User.hasMany(models.Job, {
			foreignKey: 'jobId', // Define a foreign key 'userId' to associate the models
			as: 'jobs', // Define an alias 'jobs' for easier querying later
		});
	};

	// Return the User model
	return User;
};

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

// Import the required modules

// Get the filename of the current file (index.js)
const basename = path.basename(__filename);
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

sequelize = new Sequelize(DATABASE_CONFIG.database,DATABASE_CONFIG.username,DATABASE_CONFIG.password, DATABASE_CONFIG);

// Read all files in the current directory (models)
fs.readdirSync(__dirname)
	.filter((file) => {
		return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
	})
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
	});

const UserModel = User$1(sequelize, Sequelize.DataTypes);
db[UserModel.name] = UserModel;

const JobModel = Job(sequelize, Sequelize.DataTypes);
db[JobModel.name] = JobModel;

// Iterate over the models in the db object
Object.keys(db).forEach((modelName) => {
	// If a model has an associate method, call it to set up relationships between models
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

sequelize.sync({force: false});


// Add the Sequelize instance and the Sequelize constructor to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

const User = db.User;
const registerUser = async (req, res) => {
  const { userName, retypePassword, email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    if (password !== retypePassword)
      return res.status(422).json({ msg: "Password doesn't match" });

    user = await User.create({
      email,
      password: bcrypt.hashSync(password, 10),
      userName,
    });

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      APP_CONFIG.jwtSecret,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      APP_CONFIG.jwtSecret,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const router$2 = express.Router();

router$2.post("/register", registerUser);

router$2.post("/login", loginUser);

router$2.get("/", authenticate, getUser);

// import { Job } from "../models/job.js";

const deleteJob = async (req, res) => {
  try {
    // Find the job by primary key (ID)
    const Job = db.Job;
    const job = await Job.findByPk(req.params.id);

    // If the job is not found, return a 404 error
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    // If the job's user ID doesn't match the authenticated user's ID, return a 401 error
    if (job.userId !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Delete the job from the database
    await job.destroy();

    // Send a success message
    res.json({ msg: "Job removed" });
  } catch (err) {
    // Log the error and return a 500 server error
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Other routes were explained in the previous response.

const router$1 = express.Router();

router$1.delete("/:id", authenticate, deleteJob);

const router = express.Router();
router.use("/api/users/", router$2);

router.use("/api/jobs/", router$1);

const app = express();
app.use(express.json());
app.use(router);


app.listen(APP_CONFIG.port, () => console.log(`Server started on port ${APP_CONFIG.port}`));
