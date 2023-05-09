const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./user');
const Feedback = require('./feedback');

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
Job.hasMany(Feedback, { foreignKey: 'jobId' });

User.sync().then(() => {
    Job.sync().then(() => {
        Feedback.sync().then(() => {
            console.log('All models synced');
        });
    });
});


module.exports = Job;