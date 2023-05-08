const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./user');

const Job = db.define('job', {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    company: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    location: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    requirements: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    upvotes: {
        type: Sequelize.INTEGER,
        allowNull: true,
    }
});

Job.belongsTo(User, { foreignKey: 'postedBy' });

Job.sync().then(() => {
    console.log('Job created');
});

module.exports = Job;