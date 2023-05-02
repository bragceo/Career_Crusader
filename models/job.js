// models/job.js

// Export a function that takes sequelize and DataTypes as arguments
module.exports = (sequelize, DataTypes) => {
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
      as: 'user' // Define an alias 'user' for easier querying later
    });
  };

  // Return the Job model
  return Job;
};

