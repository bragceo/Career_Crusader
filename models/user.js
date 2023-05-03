// models/user.js

// Export a function that takes sequelize and DataTypes as arguments
module.exports = (sequelize, DataTypes) => {
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
        isEmail: true // Validate that the value is a valid email format
      }
    },
    // Define password attribute with its properties
    password: {
      type: DataTypes.STRING, // Set the data type of the password attribute to string
      allowNull: false // Disallow null values for the password attribute
    },
    // Define retypePassword attribute with its properties
    retypePassword: {
      type: DataTypes.STRING, // Set the data type of the password attribute to string
      allowNull: false, // Disallow null values for the password attribute
      validate: {
        // Custom validation to check if the retypePassword value matches the password value
        isEqualTo: function(value) {
          if (value !== this.password) {
            throw new Error('Passwords do not match');
          }
        }
      }
    }
  });


    // Define associations between User model and other models
    User.associate = (models) => {
      // Define a one-to-many relationship between User and Job models
      User.hasMany(models.Job, {
        foreignKey: 'userId', // Define a foreign key 'userId' to associate the models
        as: 'jobs' // Define an alias 'jobs' for easier querying later
      });
    };

    // Return the User model
    return User;
};

  