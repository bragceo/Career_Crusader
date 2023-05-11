const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

module.exports = new Sequelize(process.env.DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: process.env.DIALECT
});

// const Sequelize = require('sequelize');
// const dotenv = require('dotenv');

// dotenv.config();

// // parsing credentials from database URL
// const dbUrl = process.env.DATABASE_URL;
// const url = new URL(dbUrl);
// const [username, password] = url.username.split(':');
// const database = url.pathname.substring(1);
// const host = url.hostname;
// const dialect = url.protocol.slice(0, -1); // remove the ":" at the end

// module.exports = new Sequelize(database, username, password, {
//   host,
//   dialect,
//   port: url.port || 3306 // if the port isn't specified in the URL, default to 3306 (standard MySQL port)
// });