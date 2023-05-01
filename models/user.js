// models/user.js

// Export a function that takes sequelize and DataTypes as arguments
module.exports = (sequelize, DataTypes) => {
    // Define a User model using sequelize.define method
    const User = sequelize.define('User', {
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

  