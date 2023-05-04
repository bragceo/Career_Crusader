'use strict';

const { User, Job } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add altering commands here.
    return Promise.all([
      queryInterface.createTable(User.getTableName(), User.attributes),
      queryInterface.createTable(Job.getTableName(), Job.attributes),
    ]);
  },

  async down (queryInterface, Sequelize) {
    // Add reverting commands here.
    return Promise.all([
      queryInterface.dropTable(User.getTableName()),
      queryInterface.dropTable(Job.getTableName()),
    ]);
  }
};
