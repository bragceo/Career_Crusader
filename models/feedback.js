const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./user');
const Job = require('./job');

const Feedback = db.define('feedback', {
    content: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    upvote: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    downvote: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
});

Feedback.belongsTo(User, { foreignKey: 'postedBy' });

module.exports = Feedback;